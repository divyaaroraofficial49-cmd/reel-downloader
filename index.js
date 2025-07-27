const express = require('express');
const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

app.post('/download', (req, res) => {
  const { url } = req.body;

  if (!url || !url.startsWith('http')) {
    return res.status(400).json({ message: 'Invalid URL' });
  }

  console.log(`📥 Received URL: ${url}`);
  return res.status(200).json({ message: 'Downloaded' });
});

app.listen(port, () => {
  console.log(`✅ Server listening on port ${port}`);
});
