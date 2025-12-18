const express = require('express');
const fs = require('fs');
const path = require('path');
const multer = require('multer');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const dotenv = require('dotenv');
const mime = require('mime-types');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;
const CLIENT_ORIGIN = process.env.CLIENT_ORIGIN || 'http://localhost:5173';

app.use(cors({ origin: CLIENT_ORIGIN }));
app.use(express.json());

// Serve frontend in production when built into server/public
const PUBLIC_DIR = path.join(__dirname, '..', 'public');
if (process.env.NODE_ENV === 'production' && fs.existsSync(PUBLIC_DIR)) {
  app.use(express.static(PUBLIC_DIR));
  app.get('*', (req, res) => {
    res.sendFile(path.join(PUBLIC_DIR, 'index.html'));
  });
}

// storage
const VIDEOS_DIR = path.join(__dirname, '..', 'videos');
if (!fs.existsSync(VIDEOS_DIR)) fs.mkdirSync(VIDEOS_DIR, { recursive: true });

// Multer
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, VIDEOS_DIR);
  },
  filename: function (req, file, cb) {
    // keep original name; in production you'd sanitize
    cb(null, Date.now() + '-' + file.originalname);
  }
});
const upload = multer({ storage });

// Login - returns JWT for uploader
app.post('/login', (req, res) => {
  const { password } = req.body;
  if (!password) return res.status(400).json({ error: 'No password provided' });
  if (password !== process.env.UPLOAD_PASSWORD) return res.status(401).json({ error: 'Invalid password' });
  const token = jwt.sign({ role: 'uploader' }, process.env.JWT_SECRET || 'dev-secret', { expiresIn: '12h' });
  res.json({ token });
});

// List videos
app.get('/videos', (req, res) => {
  const files = fs.readdirSync(VIDEOS_DIR).filter(f => !f.startsWith('.'));
  const videos = files.map(f => {
    const stats = fs.statSync(path.join(VIDEOS_DIR, f));
    return { name: f, size: stats.size };
  });
  res.json(videos);
});

// Stream video with Range support
app.get('/videos/:name', (req, res) => {
  const name = req.params.name;
  const filePath = path.join(VIDEOS_DIR, name);
  if (!fs.existsSync(filePath)) return res.status(404).send('Not found');

  const stat = fs.statSync(filePath);
  const fileSize = stat.size;
  const range = req.headers.range;

  const contentType = mime.lookup(filePath) || 'application/octet-stream';
  if (range) {
    const parts = range.replace(/bytes=/, '').split('-');
    const start = parseInt(parts[0], 10);
    const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;
    const chunkSize = (end - start) + 1;
    const file = fs.createReadStream(filePath, { start, end });
    res.writeHead(206, {
      'Content-Range': `bytes ${start}-${end}/${fileSize}`,
      'Accept-Ranges': 'bytes',
      'Content-Length': chunkSize,
      'Content-Type': contentType,
    });
    file.pipe(res);
  } else {
    res.writeHead(200, {
      'Content-Length': fileSize,
      'Content-Type': contentType,
    });
    fs.createReadStream(filePath).pipe(res);
  }
});

// Protected upload
const { requireAuth } = require('./middleware/auth');
app.post('/upload', requireAuth, upload.single('file'), (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'No file' });
  res.json({ filename: req.file.filename, originalname: req.file.originalname });
});

app.listen(PORT, () => {
  console.log(`Video Supplier server running on http://localhost:${PORT}`);
});
