function doPost(e) {
  try {
    Logger.log('=== FORM SUBMISSION STARTED ===');
    
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    var data = JSON.parse(e.postData.contents);
    
    Logger.log('Email: ' + data.email);
    Logger.log('Send Copy: ' + data.sendCopy);
    
    if (sheet.getLastRow() === 0) {
      var headers = ['Q1: Overall Rating (1-5)', 'Q2: Ease of Understanding (1-5)', 'Q3: Most Useful Parts', 
                     'Q4: Are you a CSN citizen?', 'Q4a: City services awareness', 'Q5: Overall Satisfaction (1-5)', 
                     'Q6: Recommend Email', 'Email', 'Name', 'Send Copy', 'Timestamp'];
      sheet.appendRow(headers);
      var headerRange = sheet.getRange(1, 1, 1, headers.length);
      headerRange.setFontWeight('bold');
      headerRange.setBackground('#4285f4');
      headerRange.setFontColor('#ffffff');
    }
  
    var timestamp = new Date();
    var rowData = [
      data.q1_rating || '',
      data.q2_understanding || '',
      Array.isArray(data.q3_useful) ? data.q3_useful.join(', ') : '',
      data.q4_citizen || '',
      data.q4_services_aware || '',
      data.q5_satisfaction || '',
      data.q6_recommend_email || '',
      data.email || '',
      data.name || '',
      data.sendCopy ? 'Yes' : 'No',
      timestamp
    ];
    
    sheet.appendRow(rowData);
    Logger.log('Data saved to sheet');
  
    var emailResult = 'not_requested';
    if (data.sendCopy && data.email) {
      Logger.log('Sending email to: ' + data.email);
      try {
        sendEmailToUser(data.email, data);
        emailResult = 'sent';
        Logger.log('Email sent successfully!');
      } catch (emailError) {
        Logger.log('Email error: ' + emailError.toString());
        emailResult = 'failed';
      }
    }
    
    return ContentService
      .createTextOutput(JSON.stringify({
        'result': 'success',
        'message': 'Form submitted successfully!',
        'emailStatus': emailResult
      }))
      .setMimeType(ContentService.MimeType.JSON);
      
  } catch (error) {
    Logger.log('ERROR: ' + error.toString());
    return ContentService
      .createTextOutput(JSON.stringify({
        'result': 'error',
        'message': error.toString()
      }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function sendEmailToUser(email, data) {
  var subject = 'Your response on Chhatrapati Sambhajinagar CTB Feedback';
  
  var plainBody = 'Maha Infotech Pvt Ltd Chhatrapati Sambhajinagar CTB Feedback\n\n';
  plainBody += 'Email\n' + (data.email || '') + '\n\n';
  plainBody += 'Name\n' + (data.name || '') + '\n\n';
  plainBody += 'Q1: Overall, how would you rate the CTB?\n' + (data.q1_rating || '') + ' / 5\n\n';
  plainBody += 'Q2: How easy was it to understand the CTB?\n' + (data.q2_understanding || '') + ' / 5\n\n';
  
  if (Array.isArray(data.q3_useful) && data.q3_useful.length > 0) {
    plainBody += 'Q3: Which part did you find most useful?\n';
    plainBody += data.q3_useful.join(', ') + '\n\n';
  } else {
    plainBody += 'Q3: Which part did you find most useful?\n\n';
  }
  
  plainBody += 'Q4: Are you a citizen of CSN?\n' + (data.q4_citizen || '') + '\n\n';
  
  if (data.q4_citizen === 'Yes' && data.q4_services_aware) {
    plainBody += 'Q4a: Did the CTB make you aware of city services?\n' + (data.q4_services_aware || '') + '\n\n';
  }
  
  plainBody += 'Q5: Overall, how satisfied are you with the CTB?\n' + (data.q5_satisfaction || '') + ' / 5\n\n';
  plainBody += 'Q6: Recommend an email ID for CTB sharing\n' + (data.q6_recommend_email || '') + '\n\n';
  
  plainBody += 'This form was created inside of MIPL.';
  
  // Get header image from Google Drive
  var headerFileId = '1Dna7c6_I1T30MnzikSkDscFBR56LIYFd';
  var headerImageUrl = 'https://drive.google.com/uc?export=view&id=' + headerFileId;

  var htmlBody = '<!DOCTYPE html>';
  htmlBody += '<html><head><meta charset="UTF-8"></head>';
  htmlBody += '<body style="margin: 0; padding: 0; font-family: Roboto, Arial, sans-serif; background-color: #f5f5f5;">';
  htmlBody += '<div style="max-width: 700px; margin: 0 auto; background-color: #ffffff;">';
  
  // Header image
  htmlBody += '<div style="width: 100%; height: 200px; overflow: hidden; margin: 0; padding: 0; border-radius: 12px 12px 0 0;">';
  htmlBody += '<img src="' + headerImageUrl + '" alt="Chhatrapati Sambhajinagar" style="width: 100%; height: 100%; display: block; object-fit: cover; object-position: center 20%;">';
  htmlBody += '</div>';
  
  // Title section
  htmlBody += '<div style="padding: 24px 24px 20px 24px; border-bottom: 1px solid #dadce0;">';
  htmlBody += '<h2 style="margin: 0; font-size: 24px; font-weight: 400; color: #202124; line-height: 1.3;">Feedback on the Digital Coffee Table Book of Chhatrapati Sambhajinagar</h2>';
  htmlBody += '</div>';
  
  // Email field
  htmlBody += '<div style="padding: 24px; border-bottom: 1px solid #dadce0;">';
  htmlBody += '<div style="margin-bottom: 4px; font-size: 14px; color: #70757a;">Email</div>';
  htmlBody += '<div style="font-size: 15px; color: #202124;">' + (data.email || '') + '</div>';
  htmlBody += '</div>';
 
  // Name field
  htmlBody += '<div style="padding: 24px; border-bottom: 1px solid #dadce0;">';
  htmlBody += '<div style="margin-bottom: 4px; font-size: 14px; color: #70757a;">Name</div>';
  htmlBody += '<div style="font-size: 15px; color: #202124;">' + (data.name || '') + '</div>';
  htmlBody += '</div>';
  
  // Q1
  htmlBody += '<div style="padding: 24px; border-bottom: 1px solid #dadce0;">';
  htmlBody += '<div style="margin-bottom: 8px; font-size: 14px; color: #70757a;">Overall, how would you rate the CTB?</div>';
  htmlBody += '<div style="display: inline-block; background: #1a73e8; color: white; padding: 6px 12px; border-radius: 16px; font-size: 14px; font-weight: 600;">';
  htmlBody += (data.q1_rating || '') + ' / 5';
  htmlBody += '</div></div>';
  
  // Q2
  htmlBody += '<div style="padding: 24px; border-bottom: 1px solid #dadce0;">';
  htmlBody += '<div style="margin-bottom: 8px; font-size: 14px; color: #70757a;">How easy was it to understand the CTB?</div>';
  htmlBody += '<div style="display: inline-block; background: #1a73e8; color: white; padding: 6px 12px; border-radius: 16px; font-size: 14px; font-weight: 600;">';
  htmlBody += (data.q2_understanding || '') + ' / 5';
  htmlBody += '</div></div>';
  
  // Q3
  htmlBody += '<div style="padding: 24px; border-bottom: 1px solid #dadce0;">';
  htmlBody += '<div style="margin-bottom: 8px; font-size: 14px; color: #70757a;">Which part did you find most useful?</div>';
  if (Array.isArray(data.q3_useful) && data.q3_useful.length > 0) {
    data.q3_useful.forEach(function(item) {
      htmlBody += '<div style="font-size: 15px; color: #202124; margin-bottom: 4px;">• ' + item + '</div>';
    });
  } else {
    htmlBody += '<div style="font-size: 15px; color: #202124;"></div>';
  }
  htmlBody += '</div>';
  
  // Q4
  htmlBody += '<div style="padding: 24px; border-bottom: 1px solid #dadce0;">';
  htmlBody += '<div style="margin-bottom: 8px; font-size: 14px; color: #70757a;">Are you a citizen of CSN?</div>';
  htmlBody += '<div style="font-size: 15px; color: #202124;">' + (data.q4_citizen || '') + '</div>';
  htmlBody += '</div>';
  
  // Q4a (if applicable)
  if (data.q4_citizen === 'Yes' && data.q4_services_aware) {
    htmlBody += '<div style="padding: 24px; border-bottom: 1px solid #dadce0;">';
    htmlBody += '<div style="margin-bottom: 8px; font-size: 14px; color: #70757a;">Did the CTB make you aware of city services?</div>';
    htmlBody += '<div style="font-size: 15px; color: #202124;">' + (data.q4_services_aware || '') + '</div>';
    htmlBody += '</div>';
  }
  
  // Q5
  htmlBody += '<div style="padding: 24px; border-bottom: 1px solid #dadce0;">';
  htmlBody += '<div style="margin-bottom: 8px; font-size: 14px; color: #70757a;">Overall, how satisfied are you with the CTB?</div>';
  htmlBody += '<div style="display: inline-block; background: #1a73e8; color: white; padding: 6px 12px; border-radius: 16px; font-size: 14px; font-weight: 600;">';
  htmlBody += (data.q5_satisfaction || '') + ' / 5';
  htmlBody += '</div></div>';
  
  // Q6
  htmlBody += '<div style="padding: 24px; border-bottom: 1px solid #dadce0;">';
  htmlBody += '<div style="margin-bottom: 4px; font-size: 14px; color: #70757a;">Recommend an email ID for CTB sharing</div>';
  htmlBody += '<div style="font-size: 15px; color: #202124;">' + (data.q6_recommend_email || '') + '</div>';
  htmlBody += '</div>';
  
  // Footer
  htmlBody += '<div style="padding: 24px; text-align: center; background-color: #f5f5f5;">';
  htmlBody += '<p style="margin: 0; color: #5f6368; font-size: 12px;">This form was created inside of MIPL.</p>';
  htmlBody += '</div>';
  
  htmlBody += '</div></body></html>';
 
  var emailOptions = {
    htmlBody: htmlBody,
    name: 'Maha Infotech Pvt Ltd Chhatrapati Sambhajinagar CTB Feedback'
  };
  
  GmailApp.sendEmail(email, subject, plainBody, emailOptions);
  
  return true;
}

// STEP 1: Run this function FIRST to authorize email sending and Drive access
function setupEmailPermissions() {
  Logger.log('Setting up email and Drive permissions...');
  
  try {
    var myEmail = Session.getEffectiveUser().getEmail();
    Logger.log('Your email: ' + myEmail);
    
    var headerFileId = '1Dna7c6_I1T30MnzikSkDscFBR56LIYFd';
    try {
      var file = DriveApp.getFileById(headerFileId);
      Logger.log('Drive access OK - File found: ' + file.getName());
    } catch (driveError) {
      Logger.log('Drive access issue: ' + driveError.toString());
    }
    
    GmailApp.sendEmail(
      myEmail,
      'Email Authorization Complete - CTB Feedback Form',
      'SUCCESS!\n\nIf you receive this email, the authorization is complete.\n\nYour feedback form will now send emails to users with their responses when they check "Send me a copy".\n\nTest the form now!'
    );
    
    Logger.log('SUCCESS! Email sent to: ' + myEmail);
    Logger.log('Authorization complete. Deploy the script and test your form.');
    return 'SUCCESS - Check your email!';
    
  } catch (error) {
    Logger.log('ERROR: ' + error.toString());
    Logger.log('Click "Review Permissions" and authorize the script.');
    return 'FAILED - Authorization needed';
  }
}

// Test function - sends a sample email with fake form data
function testEmailWithSampleData() {
  var testEmail = 'swarali.pathrikar@consultmipl.com'; // Change to your email
  
  Logger.log('Testing email with sample data...');
  Logger.log('Sending to: ' + testEmail);
  
  var sampleData = {
    email: testEmail,
    name: 'Test User',
    informative: '5',
    impact: '4',
    projects: ['Governance Projects', 'Citizen Centric Projects'],
    apps: ['Smart Nagrik', 'Smart Chhatrapati Sambhajinagar WhatsApp Chatbot'],
    design: '5',
    feedback: 'This is a test feedback message to see how the email looks.',
    sendCopy: true
  };
  
  try {
    sendEmailToUser(testEmail, sampleData);
    Logger.log('Test email sent successfully!');
    Logger.log('Check your inbox at: ' + testEmail);
    return 'SUCCESS - Check your email!';
  } catch (error) {
    Logger.log('Test failed: ' + error.toString());
    return 'FAILED: ' + error.toString();
  }
}

// Test Drive access - Run this to check if the header image can be accessed
function testDriveAccess() {
  var headerFileId = '1Dna7c6_I1T30MnzikSkDscFBR56LIYFd';
  
  Logger.log('Testing Drive access...');
  Logger.log('File ID: ' + headerFileId);
  
  try {
    var file = DriveApp.getFileById(headerFileId);
    Logger.log('SUCCESS! File found: ' + file.getName());
    Logger.log('File size: ' + file.getSize() + ' bytes');
    Logger.log('File type: ' + file.getMimeType());
    
    var blob = file.getBlob();
    Logger.log('Blob created successfully');
    Logger.log('Blob size: ' + blob.getBytes().length + ' bytes');
    
    return 'SUCCESS - File accessible!';
  } catch (error) {
    Logger.log('ERROR accessing file: ' + error.toString());
    Logger.log('Possible solutions:');
    Logger.log('1. Make sure you run setupEmailPermissions() first to authorize Drive access');
    Logger.log('2. Check that the file ID is correct');
    Logger.log('3. Verify the file exists in your Google Drive');
    return 'FAILED: ' + error.toString();
  }
}

function doGet(e) {
  return ContentService
    .createTextOutput(JSON.stringify({
      'result': 'success',
      'message': 'Web app is running!'
    }))
    .setMimeType(ContentService.MimeType.JSON);
}
