import express from 'express';
import puppeteer from 'puppeteer';
import axios from 'axios';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const app = express();
app.use(express.json());

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.post('/process_reel', async (req, res) => {
  const { instagram_url } = req.body;

  if (!instagram_url || !instagram_url.includes('instagram.com/reel')) {
    return res.status(400).json({ status: 'error', message: 'Invalid Instagram URL' });
  }

  try {
    const browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });

    const page = await browser.newPage();
    await page.goto(instagram_url, { waitUntil: 'networkidle2' });

    await page.waitForSelector('video');
    const videoSrc = await page.evaluate(() => {
      const video = document.querySelector('video');
      return video?.src;
    });

    await browser.close();

    if (!videoSrc) throw new Error('Video src not found');

    const filePath = path.join(__dirname, 'reel.mp4');
    const writer = fs.createWriteStream(filePath);
    const response = await axios({ method: 'GET', url: videoSrc, responseType: 'stream' });
    response.data.pipe(writer);

    writer.on('finish', () => {
      res.json({
        status: 'success',
        output_url: videoSrc
      });
    });

    writer.on('error', err => {
      console.error(err);
      res.status(500).json({ status: 'error', message: 'Video download failed' });
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ status: 'error', message: err.message });
  }
});

app.get('/', (req, res) => {
  res.send('✅ Reel Downloader is running!');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
