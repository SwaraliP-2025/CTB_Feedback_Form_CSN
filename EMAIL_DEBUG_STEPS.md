# Email Debugging Steps

## Problem
The "Send me a copy of my responses" feature is not sending emails.

## Steps to Debug

### 1. Check Browser Console
1. Open your form in a browser
2. Press F12 to open Developer Tools
3. Go to the Console tab
4. Fill out the form and check the "Send me a copy" toggle
5. Submit the form
6. Look for these console messages:
   - `Send Copy Checkbox Value:` - should show "on" if checked
   - `Send Copy Boolean:` - should show "true" if checked
   - `Email:` - should show your email address

### 2. Check Google Apps Script Logs
1. Go to your Google Apps Script editor
2. Click on "Executions" (clock icon on the left)
3. Find the most recent execution
4. Click on it to see the logs
5. Look for these messages:
   - `Send copy requested: true`
   - `Sending email to: [your-email]`
   - `Email quota remaining: [number]`
   - `Email sent successfully to: [your-email]`

### 3. Common Issues and Solutions

#### Issue: sendCopy is false in logs
**Solution:** The toggle switch is not being checked properly. Make sure you click the toggle before submitting.

#### Issue: Email quota is 0
**Solution:** You've reached the daily email limit (100 emails for free Google accounts). Wait 24 hours.

#### Issue: "Email sent successfully" appears but no email received
**Solutions:**
- Check your spam/junk folder
- Check if the email address is correct
- Add the sender to your contacts
- Wait a few minutes (emails can be delayed)

#### Issue: Permission error in logs
**Solution:** 
1. In Google Apps Script, go to "Run" > "Run function" > "sendEmailCopy"
2. Authorize the script to send emails on your behalf
3. Try submitting the form again

### 4. Test Email Function Directly
1. In Google Apps Script editor, add this test function:

```javascript
function testEmail() {
  var testData = {
    email: 'your-email@example.com',  // Replace with your email
    name: 'Test User',
    informative: '5',
    impact: '5',
    projects: ['Governance Projects'],
    apps: ['Smart Nagrik'],
    design: '5',
    feedback: 'This is a test',
    sendCopy: true
  };
  
  sendEmailCopy('your-email@example.com', testData);  // Replace with your email
}
```

2. Run the `testEmail` function
3. Check if you receive the email
4. If this works, the issue is with the form submission

### 5. Verify Script Deployment
1. Make sure you've deployed the script as a web app
2. The deployment should have these settings:
   - Execute as: Me
   - Who has access: Anyone
3. After making changes, deploy as a new version

## Quick Fix to Try

If emails still don't work, you can modify the script to ALWAYS send an email (for testing):

In `google-apps-script.js`, change line 63 from:
```javascript
if (data.sendCopy && email) {
```

To:
```javascript
if (email) {  // Always send email for testing
```

This will send an email for every submission regardless of the toggle.
