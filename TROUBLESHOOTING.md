# Troubleshooting Guide - Form Not Submitting to Google Sheets

## Quick Checks

### 1. Check Browser Console
1. Open your form in the browser
2. Press **F12** to open Developer Tools
3. Go to the **Console** tab
4. Submit the form
5. Look for any error messages (red text)
6. Share the error message if you see one

### 2. Verify Apps Script Deployment

**Step-by-step verification:**

1. Go to your Google Sheet
2. Click **Extensions** → **Apps Script**
3. Click **Deploy** → **Manage deployments**
4. Check these settings:
   - ✅ Type: Web app
   - ✅ Execute as: **Me** (your email)
   - ✅ Who has access: **Anyone**
   
5. If settings are wrong:
   - Click the pencil icon (Edit)
   - Change "Who has access" to **Anyone**
   - Click **Deploy**
   - Copy the NEW URL
   - Update it in `index.html` (line 910)

### 3. Test the Script Directly

**Test if the script is working:**

1. Copy your Web App URL
2. Open a new browser tab
3. Paste the URL and press Enter
4. You should see: `{"result":"success","message":"Web app is running!"}`
5. If you see an error or permission page, the deployment is not correct

### 4. Check Script Permissions

1. In Apps Script editor, click **Run** → **Run function** → **doPost**
2. If asked, click **Review permissions**
3. Choose your Google account
4. Click **Advanced** → **Go to [Project Name] (unsafe)**
5. Click **Allow**
6. Try submitting the form again

### 5. Redeploy the Script

Sometimes you need to create a new deployment:

1. In Apps Script, click **Deploy** → **Manage deployments**
2. Click the pencil icon (Edit) next to your deployment
3. Under "Version", click **New version**
4. Add description: "Fixed version"
5. Click **Deploy**
6. **COPY THE NEW URL** (it will be different!)
7. Update the URL in `index.html` line 910

### 6. Check CORS Issues

If you see CORS errors in console:

1. Make sure the script is deployed with "Who has access: **Anyone**"
2. The script must be published as a Web App, not just saved
3. Try opening the form in an incognito/private window

## Common Error Messages

### "Failed to fetch"
- **Cause**: Wrong URL or script not deployed
- **Fix**: Verify the Web App URL is correct and script is deployed

### "Access denied"
- **Cause**: Script not set to "Anyone" can access
- **Fix**: Redeploy with "Who has access: Anyone"

### "Script function not found"
- **Cause**: Script not saved or deployed
- **Fix**: Save the script and deploy as Web App

### No error but data not appearing
- **Cause**: Using `mode: 'no-cors'` which hides errors
- **Fix**: Already fixed in the updated code - check console now

## Debug Steps

1. **Open the form** in your browser
2. **Open Console** (F12 → Console tab)
3. **Fill and submit** the form
4. **Check console** for these messages:
   ```
   Submitting to: [your URL]
   Data being sent: [your form data]
   Response received: [response object]
   ```
5. **Take a screenshot** of any errors and share them

## Still Not Working?

If none of the above works, please provide:
1. Screenshot of browser console errors
2. Screenshot of Apps Script deployment settings
3. The response you get when visiting the Web App URL directly

## Quick Fix Checklist

- [ ] Script is saved in Apps Script editor
- [ ] Script is deployed as Web App
- [ ] "Execute as" is set to "Me"
- [ ] "Who has access" is set to "Anyone"
- [ ] Web App URL is copied to index.html line 910
- [ ] Tested Web App URL in browser (should show success message)
- [ ] Form is opened in browser (not just the HTML file locally)
- [ ] Browser console shows no errors
