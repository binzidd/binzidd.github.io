/**
 * Google Apps Script Web App — receives events from the portfolio site and
 * appends them to the bound spreadsheet.
 *
 * Two kinds of event land in two different tabs, so a genuine enquiry never
 * gets lost in the traffic log:
 *   "visit" / "identify"  ->  tab "Visitors"   (ambient traffic + who said hi)
 *   "engage"              ->  tab "Enquiries"  (consulting front door)
 *
 * Both tabs are created with headers on first use, so there is nothing to set
 * up by hand.
 *
 * SETUP
 * 1. sheets.google.com > new spreadsheet (e.g. "Portfolio"). No headers
 *    needed; this script writes them.
 * 2. Extensions > Apps Script. Replace the placeholder code with this file.
 * 3. Deploy > New deployment > type "Web app".
 *      - Execute as: Me
 *      - Who has access: Anyone
 *    ("Anyone" is required: the request comes from a visitor's browser with
 *    no Google login, not from you.)
 * 4. Authorise when prompted. The "unverified app" warning is expected for a
 *    personal script that was never submitted for Google review.
 * 5. Copy the Web App URL (ends in /exec) into SHEETS_WEBHOOK_URL in
 *    lib/visitorWebhook.ts.
 *
 * IMPORTANT: editing this script does NOT change what the live URL runs.
 * After any edit you must publish a new version:
 *   Deploy > Manage deployments > pencil icon > Version: New version > Deploy.
 */

var VISITOR_HEADERS = [
  "Timestamp", "Type", "Name", "Relationship", "Contact URL",
  "Contact Kind", "Is Owner", "Path", "Referrer", "User Agent",
];

var ENQUIRY_HEADERS = [
  "Timestamp", "Name", "Email", "Company",
  "Engagement", "Timeline", "Brief", "User Agent",
];

/** Returns the named tab, creating it with headers if it doesn't exist yet. */
function getTab(name, headers) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName(name);
  if (!sheet) {
    sheet = ss.insertSheet(name);
    sheet.appendRow(headers);
    sheet.setFrozenRows(1);
    sheet.getRange(1, 1, 1, headers.length).setFontWeight("bold");
  }
  return sheet;
}

function doPost(e) {
  var data = {};
  try {
    data = JSON.parse(e.postData.contents);
  } catch (err) {
    data = {};
  }

  if (data.type === "engage") {
    getTab("Enquiries", ENQUIRY_HEADERS).appendRow([
      new Date(),
      data.name || "",
      data.email || "",
      data.company || "",
      data.engagement || "",
      data.timeline || "",
      data.brief || "",
      data.ua || "",
    ]);
  } else {
    getTab("Visitors", VISITOR_HEADERS).appendRow([
      new Date(),
      data.type || "",
      data.name || "",
      data.relationship || "",
      data.contactUrl || "",
      data.contactKind || "",
      data.isOwner === true ? "yes" : "",
      data.path || "",
      data.referrer || "",
      data.ua || "",
    ]);
  }

  return ContentService
    .createTextOutput(JSON.stringify({ status: "ok" }))
    .setMimeType(ContentService.MimeType.JSON);
}
