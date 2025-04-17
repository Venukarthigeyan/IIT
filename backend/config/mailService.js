const nodemailer = require("nodemailer");

// Create a transporter using your email service (e.g., Gmail)
const transporter = nodemailer.createTransport({
  service: "gmail", // Change to your email service
  auth: {
    user: process.env.EMAIL_USER, // Your email address
    pass: process.env.EMAIL_PASS, // Your email password or app-specific password
  },
});

// Function to send signup confirmation email
const sendSignupConfirmationEmail = (email, name) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: "Welcome to Digitify!",
    text: `Hi ${name},\n\nThank you for signing up for Digitify. We're excited to have you on board!\n\nBest regards,\nDigitify Team`,
    html: `<p>Hi <strong>${name}</strong>,</p><p>Thank you for signing up for Digitify. We're excited to have you on board!</p><p>Best regards,<br>Digitify Team</p>`,
  };

  // Send email
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error("Error sending signup email:", error);
    } else {
      console.log("Signup email sent: " + info.response);
    }
  });
};

// Function to send password email
const sendPasswordEmail = (email, password) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: "Your Digitify Password",
    text: `Hi,\n\nYour current password is: ${password}\n\nPlease keep it secure and change it if you suspect unauthorized access.\n\nBest regards,\nDigitify Team`,
    html: `<p>Hi,</p><p>Your current password is: <strong>${password}</strong></p><p>Please keep it secure and change it if you suspect unauthorized access.</p><p>Best regards,<br>Digitify Team</p>`,
  };

  // Send email
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error("Error sending password email:", error);
    } else {
      console.log("Password email sent: " + info.response);
    }
  });
};

// Export both functions
module.exports = { sendSignupConfirmationEmail, sendPasswordEmail };
