const TelegramBot = require('node-telegram-bot-api');
const express = require('express');

const token = '7911637079:AAGzBVgB_T9ccdflSbtqYjF3rPWZpYbft50'; // your bot token
const bot = new TelegramBot(token, { polling: true });

const app = express();
const port = process.env.PORT || 3000;

// Express route for external integrations (optional)
app.use(express.json());
app.post('/download', (req, res) => {
  const { url } = req.body;
  if (!url || !url.startsWith('http')) {
    return res.status(400).json({ message: 'Invalid URL' });
  }
  console.log(`📥 Received URL: ${url}`);
  return res.status(200).json({ message: 'Downloaded' });
});

// Telegram message handler
bot.on('message', (msg) => {
  const chatId = msg.chat.id;
  console.log(`📨 Received from ${chatId}: ${msg.text}`);
  bot.sendMessage(chatId, 'Hello from Divya!');
});

app.listen(port, () => {
  console.log(`✅ Server + Bot running on port ${port}`);
});
