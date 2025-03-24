const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const sgMail = require('@sendgrid/mail');
require('dotenv').config();

const app = express();
const PORT = 5000;

app.use(cors());
app.use(bodyParser.json());

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

app.post('/api/send-confirmation', async (req, res) => {
  const { email, cart } = req.body;

  const itemsHtml = cart.map(item => `<li>${item.name} - £${item.price}</li>`).join('');
  const total = cart.reduce((sum, item) => sum + item.price, 0);

  const msg = {
    to: email,
    from: 'no-reply@functionoverform.com',
    subject: 'Your Order Confirmation',
    html: `<h1>Thanks for your order!</h1><ul>${itemsHtml}</ul><p><strong>Total: £${total}</strong></p>`,
  };

  try {
    await sgMail.send(msg);
    res.status(200).json({ message: 'Email sent successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to send email' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});