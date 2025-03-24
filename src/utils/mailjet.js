const Mailjet = require('node-mailjet');

const mailjet = new Mailjet({
  apiKey: process.env.MJ_APIKEY_PUBLIC,
  apiSecret: process.env.MJ_APIKEY_PRIVATE
});

exports.sendMail = async ({ to, subject, html }) => {
  try {
    const request = await mailjet.post('send', { version: 'v3.1' }).request({
      Messages: [
        {
          From: {
            Email: "libertsinzo7@gmail.com", 
            Name: "Platform Collaborative",
          },
          To: [
            {
              Email: to
            }
          ],
          Subject: subject,
          HTMLPart: html,
        }
      ]
    });
    return request.body;
  } catch (error) {
    console.error('Error sending email:', error);
    throw new Error('Failed to send email');
  }
};
