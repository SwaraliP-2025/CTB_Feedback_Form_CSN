# Google Sheets Integration Setup Instructions

## Step 1: Open Your Google Sheet
1. Go to your Google Sheet: "Digital Coffee Table Book Feedback"
2. The sheet is already created at the URL you provided

## Step 2: Add the Apps Script
1. In your Google Sheet, click on **Extensions** → **Apps Script**
2. Delete any existing code in the editor
3. Copy ALL the code from `google-apps-script.js` file
4. Paste it into the Apps Script editor
5. Click the **Save** icon (💾) or press Ctrl+S
6. Name your project (e.g., "Form Submission Handler")

## Step 3: Deploy as Web App
1. In the Apps Script editor, click **Deploy** → **New deployment**
2. Click the gear icon ⚙️ next to "Select type"
3. Choose **Web app**
4. Fill in the settings:
   - **Description**: "CTB Feedback Form"
   - **Execute as**: Me (your email)
   - **Who has access**: Anyone
5. Click **Deploy**
6. You may need to authorize the script:
   - Click **Authorize access**
   - Choose your Google account
   - Click **Advanced** → **Go to [Project Name] (unsafe)**
   - Click **Allow**
7. **COPY THE WEB APP URL** - it will look like:
   ```
   https://script.google.com/macros/s/AKfycby.../exec
   ```

## Step 4: Update Your HTML Form
1. Open `index.html`
2. Find this line (around line 925):
   ```javascript
   const scriptURL = 'YOUR_GOOGLE_APPS_SCRIPT_WEB_APP_URL_HERE';
   ```
3. Replace `'YOUR_GOOGLE_APPS_SCRIPT_WEB_APP_URL_HERE'` with your actual Web App URL
4. Save the file

## Step 5: Test Your Form
1. Open `index.html` in your browser
2. Fill out the form
3. Click Submit
4. Check your Google Sheet - a new row should appear with the form data!

## Spreadsheet Column Structure
The script will automatically create these headers in your sheet:
- **Column A: Email (Primary Key)** - Unique identifier for each user
- Column B: Your Name
- Column C: Record Email (Yes/No)
- Column D: How Informative (1-5)
- Column E: Impact Coverage (1-5)
- Column F: IT Projects Interested
- Column G: Mobile Apps Interested
- Column H: Overall Design Rating (1-5)
- Column I: Additional Feedback
- Column J: Send Copy (Yes/No)
- Column K: Last Updated (Timestamp)

**Important:** If a user submits the form multiple times with the same email, their previous responses will be **updated** instead of creating duplicate entries.

## Troubleshooting

### Form doesn't submit
- Make sure you replaced the URL in index.html with your actual Web App URL
- Check that the deployment is set to "Anyone" can access
- Open browser console (F12) to see any error messages

### Data not appearing in sheet
- Make sure the script is deployed as a Web App (not just saved)
- Check that you authorized the script properly
- Try redeploying the script (Deploy → Manage deployments → Edit → New version)

### Permission errors
- Make sure "Execute as" is set to "Me"
- Make sure "Who has access" is set to "Anyone"
- Re-authorize the script if needed

## Need Help?
If you encounter any issues, check:
1. Browser console for JavaScript errors (F12)
2. Apps Script execution logs (View → Logs in Apps Script editor)
3. Make sure the Web App URL is correct in your HTML file
