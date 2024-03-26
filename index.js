const formData = require('form-data');
const Mailgun = require('mailgun.js');

const mailgunFormData = new Mailgun(formData);
const mailgunClient = mailgunFormData.client({
  username: 'api',
  key:  '26ba07324a8880213cca41d6ea6b97c3-f68a26c9-f8dcc1ba',
});

// The Cloud Function entry point
exports.sendemail = async (event, context) => {
  try {
    const message = event.data
      ? Buffer.from(event.data, 'base64').toString()
      : '{}';
    const payload = JSON.parse(message);

    const userEmail = payload.username;

    const mailOptions = {
      from: '<mailgun@amreshdev.me>',
      to: [userEmail],  
      subject: 'Email Verification',
      text: 'Please verify your email address.',
      html: '<p>Please verify your email address.</p>',
    };


    const response = await mailgunClient.messages.create('amreshdev.me', mailOptions);
    console.log('Email sent:', response);
  } catch (error) {
    console.error('Failed to send email:', error);
  }
};
