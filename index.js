const formData = require('form-data');
const Mailgun = require('mailgun.js');
const Sequelize = require('sequelize');
const sequelize = require('./connection');
const User = require('./userSchema');
const dotenv=require('dotenv');

dotenv.config();


const mailgunFormData = new Mailgun(formData);
const mailgunClient = mailgunFormData.client({
  username: 'api',
  key:  process.env.MAILGUN_API_KEY,
});

exports.sendemail = async (event, context) => {
  console.log("trying");
  try {
    const message = event.data
      ? Buffer.from(event.data, 'base64').toString()
      : '{}';
    const payload = JSON.parse(message);

    const userEmail = payload.username;
    const userId=payload.id;
    const verificationLink=`http://amreshdev.me:2500/v1/user/verify?id=${userId}`;

    const mailOptions = {
      from: '<mailgun@amreshdev.me>',
      to: [userEmail],  
      subject: 'Email Verification',
      text: 'Please verify your email address.',
      html: `<p>Verify your email address: <a href="${verificationLink}">link</a></p>`,
    };


    const response = await mailgunClient.messages.create(process.env.DOMAIN_NAME, mailOptions);
    console.log('Email sent:', response);
    if (response.id) {
 
      const user = await User.findOne({ where: { username: userEmail } });
      if (user) {
        await user.update({ token_sent_timestamp: new Date() });
        console.log('User updated with token_sent_timestamp:', user.toJSON());
      } else {
        console.log('User not found.');
      }
    } else {
      console.log('Email sending failed.');
    }
  } catch (error) {
    console.error('Failed to send email:', error);
  }
};
