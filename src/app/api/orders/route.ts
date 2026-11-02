import { NextRequest, NextResponse } from 'next/server';
import {
  CustomerDeliveryDetails,
  OrderLineSnapshot,
  OrderRecord,
} from '@/types/order-lifecycle.types';
import { maskCustomerName } from '@/features/orders/orderStateMachine';
import { paymentService } from '@/features/payment/paymentIntegrationBoundary';
import {
  saveServerOrder,
  getServerOrderByRef,
  listAllServerOrders,
} from '@/features/orders/orderRepository';
import { generateUniquePaisaAmount } from '@/lib/upi';
import { dispatchMultiBotNotification } from '@/features/notifications/botRouter';
import { isMerchantAuthenticated } from '@/lib/auth/adminAuth';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const orderRef = searchParams.get('orderReference');
  const tokenOrMobile = searchParams.get('token');

  // Public customer lookup requires matching orderReference + last 4 digits of mobile or lookupToken
  if (orderRef) {
    const order = getServerOrderByRef(orderRef);
    if (!order) {
      return NextResponse.json({ error: 'Order reference not found.' }, { status: 404 });
    }

    const mobileLast4 = order.delivery.mobileNumber.slice(-4);
    const isAuthorizedLookup =
      tokenOrMobile === order.lookupToken || tokenOrMobile === mobileLast4;

    if (!isAuthorizedLookup) {
      return NextResponse.json(
        { error: 'Please provide the last 4 digits of the mobile number used on this order.' },
        { status: 403 }
      );
    }

    // Return privacy-safe order view (masked name, no full street address exposed publicly)
    return NextResponse.json({
      order: {
        orderReference: order.orderReference,
        createdAtIso: order.createdAtIso,
        maskedCustomerName: order.maskedCustomerName,
        cityStatePin: `${order.delivery.city}, ${order.delivery.state} - ${order.delivery.pincode}`,
        itemsSnapshot: order.itemsSnapshot,
        payableAmountInr: order.payableAmountInr,
        paymentStatus: order.paymentStatus,
        fulfillmentStatus: order.fulfillmentStatus,
        receiptNumber: order.receiptNumber,
        confirmedPaymentReference: order.confirmedPaymentReference,
        paymentConfirmedAtIso: order.paymentConfirmedAtIso,
        trackingId: order.trackingId,
        courierPartner: order.courierPartner,
        eventHistory: order.eventHistory,
      },
    });
  }

  // Listing all orders requires Merchant Admin Authentication
  const isAdmin = await isMerchantAuthenticated();
  if (!isAdmin) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  return NextResponse.json({ orders: listAllServerOrders() });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { action } = body;

    // ACTION 1: CREATE DURABLE PENDING ORDER SNAPSHOT AT STAGE 2
    if (action === 'CREATE_PENDING_ORDER') {
      const delivery = body.delivery as CustomerDeliveryDetails;
      const items = body.items as OrderLineSnapshot[];

      if (
        !delivery?.fullName ||
        !/^\d{10}$/.test(delivery.mobileNumber || '') ||
        !delivery?.addressLine ||
        !delivery?.city ||
        !delivery?.state ||
        !/^\d{6}$/.test(delivery.pincode || '') ||
        !Array.isArray(items) ||
        items.length === 0
      ) {
        return NextResponse.json(
          { error: 'Please complete all required delivery fields and ensure your bag is not empty.' },
          { status: 400 }
        );
      }

      const subtotalInr = items.reduce(
        (sum: number, i: OrderLineSnapshot) => sum + i.unitPriceInr * i.quantity,
        0
      );
      const payableAmountInr = generateUniquePaisaAmount(
        subtotalInr,
        delivery.mobileNumber
      );

      const randBlock = Math.floor(1000 + Math.random() * 9000);
      const randHex = Math.random().toString(36).substring(2, 6).toUpperCase();
      const orderReference = `OPT-2026-${randBlock}-${randHex}`;
      const lookupToken = `tok-${randBlock}-${Date.now().toString(36)}`;
      const nowIso = new Date().toISOString();

      const newOrder: OrderRecord = {
        orderReference,
        lookupToken,
        createdAtIso: nowIso,
        updatedAtIso: nowIso,
        delivery,
        maskedCustomerName: maskCustomerName(delivery.fullName),
        itemsSnapshot: items,
        subtotalInr,
        deliveryChargeInr: 0,
        discountInr: 0,
        payableAmountInr,
        paymentStatus: 'QR_READY',
        fulfillmentStatus: 'NOT_STARTED',
        eventHistory: [
          {
            timestampIso: nowIso,
            statusLabel: 'QR_READY',
            note: 'Stage 2 Order Review confirmed. Durable snapshot & QR session initialized.',
          },
        ],
      };

      const paymentSession = await paymentService.createPaymentSession(newOrder);
      newOrder.paymentSession = paymentSession;
      saveServerOrder(newOrder);

      await dispatchMultiBotNotification({
        channel: 'ORDERS_INTAKE',
        title: 'New Pending Order Snapshot Created',
        orderReference,
        lines: [
          `Customer: ${delivery.fullName} (${delivery.city}, ${delivery.pincode})`,
          `Payable Snapshot: ₹${payableAmountInr}`,
          `Items: ${items.map((i: OrderLineSnapshot) => `${i.sku} x${i.quantity}`).join(', ')}`,
        ],
      });

      return NextResponse.json({ ok: true, order: newOrder });
    }

    // ACTION 2: INITIATE AUTHORITATIVE PAYMENT VERIFICATION AT STAGE 3
    if (action === 'REQUEST_PAYMENT_VERIFICATION') {
      const { orderReference, customerSubmittedRef, forensics } = body;
      const order = getServerOrderByRef(orderReference || '');
      if (!order || !order.paymentSession) {
        return NextResponse.json({ error: 'Order session not found.' }, { status: 404 });
      }

      const verificationResult = await paymentService.requestPaymentVerification(
        {
          orderReference: order.orderReference,
          paymentSessionId: order.paymentSession.paymentSessionId,
          customerSubmittedRef,
          receiptForensicsSummary: forensics
            ? {
                passedClientPrecheck: Boolean(forensics.passed),
                riskScore: forensics.riskScore,
                verdictLabel: forensics.verdict,
              }
            : undefined,
        },
        order
      );

      order.paymentStatus = verificationResult.paymentStatus;
      order.updatedAtIso = new Date().toISOString();
      order.eventHistory.push({
        timestampIso: order.updatedAtIso,
        statusLabel: verificationResult.paymentStatus,
        note: verificationResult.message,
      });

      saveServerOrder(order);

      await dispatchMultiBotNotification({
        channel: 'PAYMENT_VERIFICATION',
        title: `Verification Requested (${verificationResult.paymentStatus})`,
        orderReference: order.orderReference,
        lines: [
          `Amount: ₹${order.payableAmountInr}`,
          `Submitted Ref/UTR: ${customerSubmittedRef || 'None'}`,
          `Forensics Precheck: ${forensics ? `${forensics.verdict} (Risk ${forensics.riskScore})` : 'Not uploaded'}`,
        ],
      });

      return NextResponse.json({
        ok: true,
        verificationResult,
        order,
      });
    }

    return NextResponse.json({ error: 'Unsupported action.' }, { status: 400 });
  } catch {
    return NextResponse.json({ error: 'Failed to process order request.' }, { status: 500 });
  }
}