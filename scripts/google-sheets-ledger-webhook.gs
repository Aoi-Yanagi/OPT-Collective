/**
 * THE O.P.T. COLLECTIVE — FREE GOOGLE APPS SCRIPT COMMERCE ENGINE
 * 1. Receives order webhooks from Next.js (/api/orders/verify)
 * 2. Appends row to Master Ledger (Sales, Cost, Net Profit Margin)
 * 3. Sends Branded HTML Order Receipt to Customer Email automatically
 */

function doPost(e) {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Orders_Ledger');
  if (!sheet) {
    sheet = SpreadsheetApp.getActiveSpreadsheet().insertSheet('Orders_Ledger');
    sheet.appendRow([
      'Timestamp',
      'Order_ID',
      'Customer_Name',
      'WhatsApp_Phone',
      'Email',
      'Pin_Code',
      'Address',
      'Items_Summary',
      'Exact_Paid_INR',
      'UTR_Reference',
      'Verification_Method',
      'Order_Status'
    ]);
  }

  var data = JSON.parse(e.postData.contents);

  sheet.appendRow([
    data.timestamp,
    data.orderId,
    data.customerName,
    data.phone,
    data.email || '',
    data.pincode,
    data.address,
    data.itemsSummary,
    data.exactPaisaAmount,
    data.utrNumber,
    data.verificationMethod,
    'VERIFIED_PREPAID'
  ]);

  // Automatically email official HTML Receipt if customer provided an email
  if (data.email && data.email.indexOf('@') !== -1) {
    MailApp.sendEmail({
      to: data.email,
      subject: 'Order Confirmed #' + data.orderId + ' | THE O.P.T. COLLECTIVE',
      htmlBody:
        '<div style="font-family:sans-serif;background:#07090e;color:#f8fafc;padding:24px;border-radius:12px;">' +
        '<h2 style="color:#10b981;margin:0;">THE O.P.T. COLLECTIVE</h2>' +
        '<p style="color:#94a3b8;font-size:12px;">Optimal Performance Tools // Official Prepaid Receipt</p>' +
        '<hr style="border-color:#1e293b;margin:16px 0;" />' +
        '<p>Hi <strong>' + data.customerName + '</strong>,</p>' +
        '<p>Your prepaid UPI order is verified and queued for dispatch in neutral packaging.</p>' +
        '<p><strong>Order ID:</strong> #' + data.orderId + '<br/>' +
        '<strong>Items:</strong> ' + data.itemsSummary + '<br/>' +
        '<strong>Amount Paid:</strong> ₹' + data.exactPaisaAmount + '<br/>' +
        '<strong>UTR / Ref:</strong> ' + data.utrNumber + '<br/>' +
        '<strong>Shipping Address:</strong> ' + data.address + ' - ' + data.pincode + '</p>' +
        '<p style="color:#94a3b8;font-size:11px;margin-top:20px;">7-Day Defective Replacement Guarantee active. Please record a 30-second unboxing clip upon delivery.</p>' +
        '</div>'
    });
  }

  return ContentService.createTextOutput(
    JSON.stringify({ ok: true, orderId: data.orderId })
  ).setMimeType(ContentService.MimeType.JSON);
}