# Enable Email Functionality - Quick Guide

## Your email code is ALREADY working in the files!

The problem is just **authorization**. Follow these exact steps:

---

## Step 1: Open Google Apps Script
1. Go to https://script.google.com
2. Open your project (the one connected to your Google Sheet)

---

## Step 2: Copy the Updated Code
1. Open the file `google-apps-script.js` from your project
2. **Select ALL the code** (Ctrl+A)
3. **Copy it** (Ctrl+C)
4. Go back to Google Apps Script editor
5. **Select all existing code** (Ctrl+A)
6. **Paste the new code** (Ctrl+V)
7. **Save** (Ctrl+S or File > Save)

---

## Step 3: Authorize Email Permissions (CRITICAL!)

### 3a. Change the test email:
Find this line (around line 234):
```javascript
var testEmail = 'your-email@example.com';
```
Change it to YOUR actual email address:
```javascript
var testEmail = 'youremail@gmail.com';
```

### 3b. Run the test function:
1. At the top of the editor, find the function dropdown
2. Select **`testEmailFunction`**
3. Click the **Run** button (▶️ play icon)
4. A popup will appear: **"Authorization required"**
5. Click **"Review Permissions"**
6. Select your Google account
7. You'll see a warning screen - Click **"Advanced"**
8. Click **"Go to [Your Project Name] (unsafe)"**
9. Click **"Allow"**
10. Wait for it to finish running
11. Click **"View" > "Logs"** or **"Execution log"**
12. You should see: **"=== EMAIL TEST SUCCESSFUL ==="**
13. **CHECK YOUR EMAIL** - you should have received a test email!

---

## Step 4: Deploy as Web App
1. Click **"Deploy"** > **"New deployment"** (or "Manage deployments" if already deployed)
2. If managing existing deployment:
   - Click the **Edit** button (pencil icon)
   - Under "Version", select **"New version"**
3. Make sure settings are:
   - **Execute as:** Me (your email)
   - **Who has access:** Anyone
4. Click **"Deploy"**
5. **Copy the Web App URL** (it looks like: `https://script.google.com/macros/s/...`)

---

## Step 5: Update Your HTML Form (if needed)
1. Open `index.html`
2. Find this line (around line 940):
```javascript
const scriptURL = 'https://script.google.com/macros/s/AKfycbxzbw6p6VRRf9UXyKjzhevzTnmwPh0hjVfgg3TcdZd8xcrlVrW4owyCCRJ7_AqQX7pmLg/exec';
```
3. Replace the URL with your new Web App URL from Step 4 (if it changed)
4. Save the file

---

## Step 6: Test Your Form!
1. Open `index.html` in your browser
2. Fill out the form with your email address
3. **Toggle ON** "Send me a copy of my responses" (it should turn blue)
4. Click **Submit**
5. Wait 10-30 seconds
6. **Check your email inbox** (and spam folder!)

---

## What the Email Will Look Like:

**Subject:** Your response: Feedback on the Digital Coffee Table Book of Chhatrapati Sambhajinagar

**Content:** A nicely formatted email with all your responses including:
- Your email and name
- All ratings (1-5)
- Selected projects and apps
- Your feedback

---

## Troubleshooting:

### "I don't see testEmailFunction"
- Make sure you copied the ENTIRE `google-apps-script.js` file
- The function is at the bottom of the file

### "Authorization keeps failing"
- Make sure you're logged into the correct Google account
- Try using an incognito/private browser window
- Clear your browser cache

### "Test email sent but I didn't receive it"
- Check spam/junk folder
- Check "All Mail" in Gmail
- Wait 5 minutes (sometimes delayed)
- Make sure you changed the email address in the test function

### "Form submits but no email"
- Check Google Apps Script **Executions** (clock icon on left)
- Look at the most recent execution logs
- Should say "Email sent successfully to: your-email@example.com"
- If it says "Send copy requested: false", the toggle wasn't enabled

### "Email quota exceeded"
- Free Google accounts: 100 emails per day
- Wait 24 hours for reset
- Or upgrade to Google Workspace

---

## Quick Checklist:
- [ ] Copied updated code to Google Apps Script
- [ ] Changed test email to my email address
- [ ] Ran testEmailFunction
- [ ] Clicked "Allow" when asked for permissions
- [ ] Received test email successfully
- [ ] Deployed as new version
- [ ] Updated scriptURL in index.html (if needed)
- [ ] Tested form with toggle ON
- [ ] Received email from form submission

---

## Still Having Issues?

Run this in Google Apps Script to check your quota:
```javascript
function checkQuota() {
  Logger.log('Remaining email quota: ' + MailApp.getRemainingDailyQuota());
}
```

If quota is 0, you've hit the daily limit. Wait 24 hours.

---

## The Code IS Working!

Your `index.html` already has:
- ✅ Toggle switch for "Send me a copy"
- ✅ JavaScript to capture the toggle state
- ✅ Code to send data to Google Apps Script

Your `google-apps-script.js` already has:
- ✅ Function to receive form data
- ✅ Function to send formatted emails
- ✅ Error handling and logging

**You just need to authorize it!** Follow Step 3 above carefully.
