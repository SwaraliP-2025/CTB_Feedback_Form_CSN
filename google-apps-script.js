function doPost(e) {
  try {
    Logger.log('=== FORM SUBMISSION STARTED ===');
    
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    var data = JSON.parse(e.postData.contents);
    
    Logger.log('Email: ' + data.email);
    Logger.log('Send Copy: ' + data.sendCopy);
    
    // Create headers if needed
    if (sheet.getLastRow() === 0) {
      var headers = ['Email', 'Your Name', 'Record Email', 'How Informative (1-5)', 
                     'Impact Coverage (1-5)', 'IT Projects Interested', 'Mobile Apps Interested', 
                     'Overall Design Rating (1-5)', 'Additional Feedback', 'Send Copy', 'Timestamp'];
      sheet.appendRow(headers);
      var headerRange = sheet.getRange(1, 1, 1, headers.length);
      headerRange.setFontWeight('bold');
      headerRange.setBackground('#4285f4');
      headerRange.setFontColor('#ffffff');
    }
    
    // Save to sheet
    var timestamp = new Date();
    var rowData = [
      data.email || '',
      data.name || '',
      data.recordEmail ? 'Yes' : 'No',
      data.informative || '',
      data.impact || '',
      Array.isArray(data.projects) ? data.projects.join('\n') : '',
      Array.isArray(data.apps) ? data.apps.join('\n') : '',
      data.design || '',
      data.feedback || '',
      data.sendCopy ? 'Yes' : 'No',
      timestamp
    ];
    
    sheet.appendRow(rowData);
    Logger.log('Data saved to sheet');
    
    // Send email if requested
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

// Function to send email with user's responses
function sendEmailToUser(email, data) {
  var subject = 'Your Feedback Response - Chhatrapati Sambhajinagar CTB';
  
  // Plain text version (fallback)
  var plainBody = 'Thank you for your feedback on the Digital Coffee Table Book!\n\n';
  plainBody += 'Email: ' + (data.email || 'Not provided') + '\n';
  plainBody += 'Name: ' + (data.name || 'Not provided') + '\n\n';
  plainBody += 'How informative: ' + (data.informative || 'N/A') + '/5\n';
  plainBody += 'Impact coverage: ' + (data.impact || 'N/A') + '/5\n';
  plainBody += 'Design rating: ' + (data.design || 'N/A') + '/5\n\n';
  
  if (Array.isArray(data.projects) && data.projects.length > 0) {
    plainBody += 'IT Projects: ' + data.projects.join(', ') + '\n';
  }
  if (Array.isArray(data.apps) && data.apps.length > 0) {
    plainBody += 'Mobile Apps: ' + data.apps.join(', ') + '\n';
  }
  if (data.feedback) {
    plainBody += '\nFeedback: ' + data.feedback + '\n';
  }
  plainBody += '\nThis form was created by MIPL';
  
  // HTML version (beautiful formatting)
  var htmlBody = '<!DOCTYPE html>';
  htmlBody += '<html><head><meta charset="UTF-8"></head>';
  htmlBody += '<body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f0f0f0;">';
  htmlBody += '<div style="max-width: 600px; margin: 20px auto; background-color: #ffffff;">';
  
  // Header with gradient
  htmlBody += '<div style="background: linear-gradient(90deg, #0a0e27 0%, #1a237e 30%, #0d47a1 70%, #01579b 100%); padding: 30px 20px; text-align: center;">';
  htmlBody += '<h1 style="color: #ffffff; margin: 0; font-size: 24px; font-weight: 400; letter-spacing: 1px;">CHHATRAPATI SAMBHAJINAGAR</h1>';
  htmlBody += '<p style="color: #ffffff; margin: 10px 0 0 0; font-size: 14px; opacity: 0.9;">Digital Coffee Table Book Feedback</p>';
  htmlBody += '</div>';
  
  // Thank you message
  htmlBody += '<div style="padding: 30px 20px; border-bottom: 1px solid #e0e0e0;">';
  htmlBody += '<h2 style="color: #1a73e8; margin: 0 0 10px 0; font-size: 20px; font-weight: 400;">Thank you for your feedback!</h2>';
  htmlBody += '<p style="color: #5f6368; margin: 0; font-size: 14px; line-height: 1.6;">Here is a copy of your responses for your records.</p>';
  htmlBody += '</div>';
  
  // Personal Information
  htmlBody += '<div style="padding: 20px; background-color: #f8f9fa;">';
  htmlBody += '<table style="width: 100%; border-collapse: collapse;">';
  htmlBody += '<tr><td style="padding: 8px 0; color: #5f6368; font-size: 13px; font-weight: 600;">EMAIL</td></tr>';
  htmlBody += '<tr><td style="padding: 0 0 15px 0; color: #202124; font-size: 14px;">' + (data.email || 'Not provided') + '</td></tr>';
  htmlBody += '<tr><td style="padding: 8px 0; color: #5f6368; font-size: 13px; font-weight: 600;">NAME</td></tr>';
  htmlBody += '<tr><td style="padding: 0 0 15px 0; color: #202124; font-size: 14px;">' + (data.name || 'Not provided') + '</td></tr>';
  htmlBody += '</table>';
  htmlBody += '</div>';
  
  // Ratings Section
  htmlBody += '<div style="padding: 20px;">';
  htmlBody += '<h3 style="color: #202124; margin: 0 0 15px 0; font-size: 16px; font-weight: 500; border-bottom: 2px solid #4285f4; padding-bottom: 8px;">Your Ratings</h3>';
  
  // Rating 1
  htmlBody += '<div style="margin-bottom: 20px;">';
  htmlBody += '<p style="margin: 0 0 5px 0; color: #5f6368; font-size: 13px;">How informative did you find the CTB?</p>';
  htmlBody += '<div style="display: inline-block; background: #1a73e8; color: white; padding: 8px 16px; border-radius: 20px; font-size: 16px; font-weight: 600;">';
  htmlBody += (data.informative || 'N/A') + ' / 5';
  htmlBody += '</div></div>';
  
  // Rating 2
  htmlBody += '<div style="margin-bottom: 20px;">';
  htmlBody += '<p style="margin: 0 0 5px 0; color: #5f6368; font-size: 13px;">Did you think the CTB covered the impact of the digital projects?</p>';
  htmlBody += '<div style="display: inline-block; background: #1a73e8; color: white; padding: 8px 16px; border-radius: 20px; font-size: 16px; font-weight: 600;">';
  htmlBody += (data.impact || 'N/A') + ' / 5';
  htmlBody += '</div></div>';
  
  // Rating 3
  htmlBody += '<div style="margin-bottom: 20px;">';
  htmlBody += '<p style="margin: 0 0 5px 0; color: #5f6368; font-size: 13px;">How happy are you with the overall design and layout?</p>';
  htmlBody += '<div style="display: inline-block; background: #1a73e8; color: white; padding: 8px 16px; border-radius: 20px; font-size: 16px; font-weight: 600;">';
  htmlBody += (data.design || 'N/A') + ' / 5';
  htmlBody += '</div></div>';
  htmlBody += '</div>';
  
  // IT Projects Section
  if (Array.isArray(data.projects) && data.projects.length > 0) {
    htmlBody += '<div style="padding: 20px; background-color: #f8f9fa;">';
    htmlBody += '<h3 style="color: #202124; margin: 0 0 15px 0; font-size: 16px; font-weight: 500;">IT Projects You Found Interesting</h3>';
    htmlBody += '<ul style="margin: 0; padding-left: 20px; color: #202124; font-size: 14px; line-height: 1.8;">';
    data.projects.forEach(function(project) {
      htmlBody += '<li>' + project + '</li>';
    });
    htmlBody += '</ul></div>';
  }
  
  // Mobile Apps Section
  if (Array.isArray(data.apps) && data.apps.length > 0) {
    htmlBody += '<div style="padding: 20px;">';
    htmlBody += '<h3 style="color: #202124; margin: 0 0 15px 0; font-size: 16px; font-weight: 500;">Mobile Apps You Found Interesting</h3>';
    htmlBody += '<ul style="margin: 0; padding-left: 20px; color: #202124; font-size: 14px; line-height: 1.8;">';
    data.apps.forEach(function(app) {
      htmlBody += '<li>' + app + '</li>';
    });
    htmlBody += '</ul></div>';
  }
  
  // Additional Feedback Section
  if (data.feedback && data.feedback.trim() !== '') {
    htmlBody += '<div style="padding: 20px; background-color: #f8f9fa;">';
    htmlBody += '<h3 style="color: #202124; margin: 0 0 15px 0; font-size: 16px; font-weight: 500;">Your Additional Feedback</h3>';
    htmlBody += '<p style="margin: 0; color: #202124; font-size: 14px; line-height: 1.6; white-space: pre-wrap;">' + data.feedback + '</p>';
    htmlBody += '</div>';
  }
  
  // Footer
  htmlBody += '<div style="padding: 20px; text-align: center; border-top: 1px solid #e0e0e0; background-color: #fafafa;">';
  htmlBody += '<p style="margin: 0 0 5px 0; color: #70757a; font-size: 12px;">This is an automated email. Please do not reply to this message.</p>';
  htmlBody += '<p style="margin: 0; color: #70757a; font-size: 11px;">This form was created by MIPL</p>';
  htmlBody += '</div>';
  
  htmlBody += '</div></body></html>';
  
  // Send the email with both plain text and HTML
  GmailApp.sendEmail(email, subject, plainBody, {
    htmlBody: htmlBody,
    name: 'Chhatrapati Sambhajinagar Feedback'
  });
  
  return true;
}

// STEP 1: Run this function FIRST to authorize email sending
function setupEmailPermissions() {
  Logger.log('Setting up email permissions...');
  
  try {
    var myEmail = Session.getEffectiveUser().getEmail();
    Logger.log('Your email: ' + myEmail);
    
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
    apps: ['Smart Nagrik', 'WhatsApp Chatbot'],
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

// Web app test endpoint
function doGet(e) {
  return ContentService
    .createTextOutput(JSON.stringify({
      'result': 'success',
      'message': 'Web app is running!'
    }))
    .setMimeType(ContentService.MimeType.JSON);
}
