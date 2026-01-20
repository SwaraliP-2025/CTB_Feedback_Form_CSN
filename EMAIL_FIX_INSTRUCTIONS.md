# Email Fix Instructions - Step by Step

## The Problem
Emails are not being sent when "Send me a copy of my responses" is enabled.

## Solution Steps (Follow in Order)

### Step 1: Update Google Apps Script
1. Open your Google Apps Script editor
2. Replace ALL the code with the updated code from `google-apps-script.js`
3. Click **Save** (Ctrl+S)

### Step 2: Authorize Email Permissions (CRITICAL!)
This is the most common reason emails don't work.

1. In Google Apps Script editor, find the function dropdown at the top
2. Select `testEmailFunction` from the dropdown
3. Click the **Run** button (▶️)
4. A popup will appear saying "Authorization required"
5. Click **Review Permissions**
6. Choose your Google account
7. Click **Advanced** (if you see a warning)
8. Click **Go to [Your Project Name] (unsafe)**
9. Click **Allow**
10. Check the logs - you should see "Test email sent successfully"
11. **Check your email inbox** - you should receive a test email

### Step 3: Redeploy the Web App
After authorizing, you MUST redeploy:

1. Click **Deploy** > **Manage deployments**
2. Click the **Edit** button (pencil icon) next to your active deployment
3. Under "Version", select **New version**
4. Add description: "Fixed email permissions"
5. Click **Deploy**
6. Copy the new Web App URL (if it changed)

### Step 4: Update HTML Form (if URL changed)
If the Web App URL changed in Step 3:

1. Open `index.html`
2. Find the line with `scriptURL = 'https://script.google.com/macros/s/...'`
3. Replace it with your new URL
4. Save the file

### Step 5: Test the Form
1. Open your form in a browser
2. Fill out all required fields
3. **Toggle ON** "Send me a copy of my responses" (make sure it's blue/enabled)
4. Click Submit
5. Check your email (including spam folder)

### Step 6: Check Logs if Still Not Working
1. Go to Google Apps Script editor
2. Click **Executions** (clock icon on left sidebar)
3. Find the most recent execution
4. Click on it to see detailed logs
5. Look for these specific messages:

**What you SHOULD see:**
```
Send copy requested: true
Sending email to: your-email@example.com
Email quota remaining: 100 (or some number)
Email sent successfully to: your-email@example.com
```

**What indicates a problem:**
```
Send copy requested: false
```
→ The toggle is not being checked properly

```
Email quota remaining: 0
```
→ You've hit the daily limit (100 emails/day for free accounts)

```
Error sending email: ...
```
→ There's a specific error - read the error message

## Common Issues and Solutions

### Issue 1: "Send copy requested: false"
**Problem:** The toggle switch is not being detected
**Solution:** 
- Make sure you're clicking the toggle switch before submitting
- The toggle should be blue/enabled
- Try refreshing the page and trying again

### Issue 2: "Email quota remaining: 0"
**Problem:** Daily email limit reached
**Solution:** 
- Wait 24 hours for quota to reset
- Or upgrade to Google Workspace for higher limits

### Issue 3: Email sent but not received
**Problem:** Email might be blocked or in spam
**Solutions:**
- Check spam/junk folder
- Check "All Mail" in Gmail
- Add noreply@google.com to your contacts
- Wait 5-10 minutes (sometimes delayed)
- Try a different email address

### Issue 4: "Authorization required" error in logs
**Problem:** Script not authorized to send emails
**Solution:** 
- Follow Step 2 above to authorize
- Must click "Allow" when prompted

### Issue 5: Script URL not working
**Problem:** Old deployment URL
**Solution:**
- Redeploy as new version (Step 3)
- Update URL in HTML form (Step 4)

## Quick Test Function
Add this to your Google Apps Script to test email directly:

```javascript
function testEmailFunction() {
  var testEmail = 'YOUR_EMAIL@example.com'; // CHANGE THIS!
  
  var testData = {
    email: testEmail,
    name: 'Test User',
    informative: '5',
    impact: '4',
    projects: ['Governance Projects', 'Citizen Centric Projects'],
    apps: ['Smart Nagrik', 'WhatsApp Chatbot'],
    design: '5',
    feedback: 'This is a test feedback message.',
    sendCopy: true
  };
  
  Logger.log('Testing email function...');
  Logger.log('Sending to: ' + testEmail);
  
  try {
    sendEmailCopy(testEmail, testData);
    Logger.log('Test email sent successfully!');
    return 'SUCCESS - Check your email!';
  } catch (error) {
    Logger.log('Test failed: ' + error.toString());
    return 'FAILED - Check logs for error';
  }
}
```

## Still Not Working?

If you've followed all steps and it's still not working:

1. **Check the browser console:**
   - Press F12 in your browser
   - Go to Console tab
   - Look for the lines showing:
     - `Send Copy Boolean: true`
     - `Email: your-email@example.com`

2. **Share the error logs:**
   - Copy the error messages from Google Apps Script Executions
   - This will help identify the specific issue

3. **Verify the toggle is working:**
   - The toggle should turn blue when enabled
   - If it stays gray, there's a UI issue

## Email Quota Limits
- **Free Google Account:** 100 emails per day
- **Google Workspace:** 1,500 emails per day
- Quota resets at midnight Pacific Time

## Need More Help?
Provide these details:
1. What you see in browser console (F12)
2. What you see in Google Apps Script execution logs
3. Whether the test function works
4. Whether you completed the authorization step
