require('dotenv').config(); // Load environment variables from .env file
const express = require('express');
const nodemailer = require('nodemailer');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Serve the HTML file from the root directory
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Nodemailer transporter setup using Mailtrap
const transporter = nodemailer.createTransport({
  host: process.env.MAILTRAP_HOST,
  port: process.env.MAILTRAP_PORT,
  auth: {
    user: process.env.MAILTRAP_USER,
    pass: process.env.MAILTRAP_PASS,
  },
});

// Endpoint to send email
app.post('/send-email', async (req, res) => {
  const { email, latitude, longitude } = req.body;

  const mailOptions = {
    from: process.env.MAILTRAP_USER, // Can be any email as it's a testing environment
    to: email,
    subject: 'GPS Location Alert',
    html: `<p>Here is the GPS location:</p>
           <p>Latitude: ${latitude}</p>
           <p>Longitude: ${longitude}</p>`,
  };

  try {
    const result = await transporter.sendMail(mailOptions);
    res.json({ message: 'Email sent successfully!' });
  } catch (error) {
    console.error('Error sending email:', error);
    res.status(500).json({ message: 'Error sending email. Please try again.' });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});



 
