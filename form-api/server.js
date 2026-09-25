const express = require('express');
const nodemailer = require('nodemailer');
const rateLimit = require('express-rate-limit');

const app = express();
app.set('trust proxy', 1);
app.use(express.json({ limit: '20kb' }));
app.use('/api/send', rateLimit({ windowMs: 10 * 60 * 1000, max: 5 }));

const transporter = nodemailer.createTransport({
  host: 'smtp.yandex.ru',
  port: 465,
  secure: true,
  auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS }
});

const esc = s => String(s).replace(/[&<>"]/g,
  c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

app.post('/api/send', async (req, res) => {
  const { name = '', email = '', phone = '', message = '', _honey = '' } = req.body || {};

  if (_honey) return res.json({ success: true });
  if (!name.trim() || !message.trim() || !/^\S+@\S+\.\S+$/.test(email))
    return res.status(400).json({ success: false });

  try {
    await transporter.sendMail({
      from: `"Сайт ООО «Формат»" <${process.env.SMTP_USER}>`,
      to: process.env.MAIL_TO,
      replyTo: email,
      subject: 'Новая заявка с сайта',
      html: `<p><b>Имя:</b> ${esc(name)}</p>
             <p><b>E-mail:</b> ${esc(email)}</p>
             <p><b>Телефон:</b> ${esc(phone)}</p>
             <p><b>Сообщение:</b><br>${esc(message).replace(/\n/g, '<br>')}</p>`
    });
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false });
  }
});

app.listen(3000, '127.0.0.1');