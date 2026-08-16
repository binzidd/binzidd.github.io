/**
 * Google Apps Script Web App — receives visitor events from the portfolio
 * site and appends them as rows in the bound spreadsheet.
 *
 * SETUP
 * 1. Go to sheets.google.com, create a new spreadsheet (e.g. "Portfolio
 *    Visitors"). Add a header row to the first sheet:
 *      Timestamp | Type | Name | Relationship | Contact URL | Is Owner | Path | Referrer | User Agent
 * 2. Extensions > Apps Script. Delete the placeholder code and paste this
 *    whole file in.
 * 3. Deploy > New deployment > select type "Web app".
 *      - Execute as: Me
 *      - Who has access: Anyone
 *    (It has to be "Anyone" — the request comes from a visitor's browser
 *    with no Google login, not from you.)
 * 4. Authorise when prompted (it's your own script touching your own
 *    sheet — the "unverified app" warning is expected for a personal
 *    script that was never submitted for Google review).
 * 5. Copy the resulting Web App URL (ends in /exec) and give it to me —
 *    it goes into lib/visitorWebhook.ts as SHEETS_WEBHOOK_URL.
 *
 * Every time you edit this script you must create a NEW deployment version
 * (Deploy > Manage deployments > pencil icon > New version) for the change
 * to take effect on the existing URL.
 */
function doPost(e) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();

  let data = {};
  try {
    data = JSON.parse(e.postData.contents);
  } catch (err) {
    data = {};
  }

  sheet.appendRow([
    new Date(),
    data.type || "",
    data.name || "",
    data.relationship || "",
    data.contactUrl || "",
    data.isOwner === true ? "yes" : "",
    data.path || "",
    data.referrer || "",
    data.ua || "",
  ]);

  return ContentService
    .createTextOutput(JSON.stringify({ status: "ok" }))
    .setMimeType(ContentService.MimeType.JSON);
}
