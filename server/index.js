import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { S3Client, PutObjectCommand, GetObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { randomUUID } from 'crypto';
import path from 'path';

const app = express();
const PORT = process.env.UPLOAD_SERVER_PORT || 3001;

const required = ['AWS_ACCESS_KEY_ID', 'AWS_SECRET_ACCESS_KEY', 'AWS_REGION', 'AWS_S3_BUCKET'];
for (const key of required) {
  if (!process.env[key]) {
    console.error(`Missing environment variable: ${key}`);
    process.exit(1);
  }
}

const s3 = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

const BUCKET = process.env.AWS_S3_BUCKET;
const ALLOWED_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
const MAX_FILE_SIZE = 10 * 1024 * 1024;

app.use(cors({ origin: true }));
app.use(express.json());

const sanitizeDocType = (docType) => {
  const allowed = ['photograph', 'panCard', 'aadhaarCard'];
  return allowed.includes(docType) ? docType : 'document';
};

app.post('/api/upload/presign', async (req, res) => {
  try {
    const { fileName, contentType, docType } = req.body;

    if (!fileName || !contentType) {
      return res.status(400).json({ error: 'fileName and contentType are required' });
    }
    if (!ALLOWED_TYPES.includes(contentType)) {
      return res.status(400).json({ error: 'Only JPEG, PNG, and WebP images are allowed' });
    }

    const ext = path.extname(fileName).toLowerCase() || '.jpg';
    const folder = `partner-uploads/${randomUUID()}`;
    const key = `${folder}/${sanitizeDocType(docType)}${ext}`;

    const command = new PutObjectCommand({
      Bucket: BUCKET,
      Key: key,
      ContentType: contentType,
    });

    const uploadUrl = await getSignedUrl(s3, command, { expiresIn: 900 });

    res.json({ uploadUrl, key, bucket: BUCKET });
  } catch (error) {
    console.error('Presign upload error:', error);
    res.status(500).json({ error: 'Failed to generate upload URL' });
  }
});

app.get('/api/upload/view', async (req, res) => {
  try {
    const { key } = req.query;
    if (!key || typeof key !== 'string') {
      return res.status(400).json({ error: 'key is required' });
    }
    if (key.startsWith('http://') || key.startsWith('https://')) {
      return res.json({ url: key });
    }

    const command = new GetObjectCommand({
      Bucket: BUCKET,
      Key: key,
    });

    const url = await getSignedUrl(s3, command, { expiresIn: 3600 });
    res.json({ url });
  } catch (error) {
    console.error('Presign view error:', error);
    res.status(500).json({ error: 'Failed to generate view URL' });
  }
});

app.get('/api/health', (_req, res) => {
  res.json({ ok: true, bucket: BUCKET, region: process.env.AWS_REGION });
});

app.listen(PORT, () => {
  console.log(`S3 upload server running on http://localhost:${PORT}`);
});
