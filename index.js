const express = require('express');
const { exec } = require('child_process');
const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

app.post('/download', (req, res) => {
  const { url } = req.body;
  if (!url) return res.status(400).send({ error: 'Missing URL' });

  exec(`yt-dlp -o "%(title)s.%(ext)s" "${url}"`, (error, stdout, stderr) => {
    if (error) return res.status(500).send({ error: stderr });
    res.send({ message: 'Downloaded', output: stdout });
  });
});

app.listen(port, () => {
  console.log(`Server running at http://0.0.0.0:${port}`);
});
