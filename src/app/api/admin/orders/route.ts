import { NextRequest, NextResponse } from 'next/server';
import { isMerchantAuthenticated } from '@/lib/auth/adminAuth';
import {
  getServerOrderByRef,
  saveServerOrder,
  listAllServerOrders,
} from '@/features/orders/orderRepository';
import {
  canTransitionPayment,
  canTransitionFulfillment,
} from '@/features/orders/orderStateMachine';
import {
  PaymentStatus,
  FulfillmentStatus,
} from '@/types/order-lifecycle.types';
import { dispatchMultiBotNotification } from '@/features/notifications/botRouter';

export async function GET() {
  const isAdmin = await isMerchantAuthenticated();
  if (!isAdmin) {
    return NextResponse.json({ error: 'Unauthorized Admin Request' }, { status: 401 });
  }
  return NextResponse.json({ orders: listAllServerOrders() });
}

export async function PATCH(req: NextRequest) {
  try {
    const isAdmin = await isMerchantAuthenticated();
    if (!isAdmin) {
      return NextResponse.json({ error: 'Unauthorized Admin Request' }, { status: 401 });
    }

    const body = await req.json();
    const {
      orderReference,
      nextPaymentStatus,
      nextFulfillmentStatus,
      confirmedPaymentReference,
      trackingId,
      courierPartner,
      adminNote,
    } = body as {
      orderReference: string;
      nextPaymentStatus?: PaymentStatus;
      nextFulfillmentStatus?: FulfillmentStatus;
      confirmedPaymentReference?: string;
      trackingId?: string;
      courierPartner?: string;
      adminNote?: string;
    };

    const order = getServerOrderByRef(orderReference || '');
    if (!order) {
      return NextResponse.json({ error: 'Order not found.' }, { status: 404 });
    }

    const nowIso = new Date().toISOString();

    // 1. Authoritative Payment Status Transition
    if (nextPaymentStatus && nextPaymentStatus !== order.paymentStatus) {
      if (!canTransitionPayment(order.paymentStatus, nextPaymentStatus)) {
        return NextResponse.json(
          {
            error: `Invalid payment state transition from ${order.paymentStatus} to ${nextPaymentStatus}.`,
          },
          { status: 422 }
        );
      }

      order.paymentStatus = nextPaymentStatus;
      if (nextPaymentStatus === 'CONFIRMED') {
        order.paymentConfirmedAtIso = nowIso;
        order.receiptNumber =
          order.receiptNumber || `RCPT-${order.orderReference}`;
        order.confirmedPaymentReference =
          confirmedPaymentReference || order.confirmedPaymentReference || 'MERCHANT-VERIFIED';
        if (order.fulfillmentStatus === 'NOT_STARTED') {
          order.fulfillmentStatus = 'READY_FOR_MERCHANT';
        }
      }

      order.eventHistory.push({
        timestampIso: nowIso,
        statusLabel: nextPaymentStatus,
        note: adminNote || `Merchant updated payment state to ${nextPaymentStatus}.`,
      });
    }

    // 2. Authoritative Fulfillment Status Transition
    if (nextFulfillmentStatus && nextFulfillmentStatus !== order.fulfillmentStatus) {
      if (
        !canTransitionFulfillment(
          order.fulfillmentStatus,
          nextFulfillmentStatus,
          order.paymentStatus
        )
      ) {
        return NextResponse.json(
          {
            error: `Cannot transition fulfillment from ${order.fulfillmentStatus} to ${nextFulfillmentStatus} while payment is ${order.paymentStatus}.`,
          },
          { status: 422 }
        );
      }

      order.fulfillmentStatus = nextFulfillmentStatus;
      order.eventHistory.push({
        timestampIso: nowIso,
        statusLabel: nextFulfillmentStatus,
        note:
          adminNote ||
          `Merchant updated fulfillment status to ${nextFulfillmentStatus}.`,
      });
    }

    if (trackingId !== undefined) order.trackingId = trackingId;
    if (courierPartner !== undefined) order.courierPartner = courierPartner;
    order.updatedAtIso = nowIso;

    saveServerOrder(order);

    await dispatchMultiBotNotification({
      channel: 'FULFILLMENT_OPS',
      title: `Order Updated (${order.paymentStatus} // ${order.fulfillmentStatus})`,
      orderReference: order.orderReference,
      lines: [
        `Payment: ${order.paymentStatus}`,
        `Fulfillment: ${order.fulfillmentStatus}`,
        trackingId ? `Tracking: ${trackingId} (${courierPartner || 'Courier'})` : 'Tracking: Pending',
      ],
    });

    return NextResponse.json({ ok: true, order });
  } catch {
    return NextResponse.json({ error: 'Failed to update order.' }, { status: 500 });
  }
}