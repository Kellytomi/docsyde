import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { PrismaClient } from '@prisma/client';
import * as admin from 'firebase-admin';

// Initialize environment variables
dotenv.config();

// Initialize Firebase Admin
admin.initializeApp({
  credential: admin.credential.applicationDefault(),
  projectId: process.env.FIREBASE_PROJECT_ID,
});

// Initialize Prisma
const prisma = new PrismaClient();

// Create Express app
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Authentication middleware
const authenticateUser = async (req: any, res: any, next: any) => {
  try {
    const token = req.headers.authorization?.split('Bearer ')[1];
    if (!token) {
      return res.status(401).json({ error: 'No token provided' });
    }

    const decodedToken = await admin.auth().verifyIdToken(token);
    req.user = decodedToken;
    next();
  } catch (error) {
    res.status(401).json({ error: 'Invalid token' });
  }
};

// Routes
app.get('/api/documents', authenticateUser, async (req: any, res) => {
  try {
    const documents = await prisma.document.findMany({
      where: { userId: req.user.uid },
      include: { blocks: true },
    });
    res.json(documents);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch documents' });
  }
});

app.post('/api/documents', authenticateUser, async (req: any, res) => {
  try {
    const { title, blocks } = req.body;
    const document = await prisma.document.create({
      data: {
        title,
        userId: req.user.uid,
        blocks: {
          create: blocks.map((block: any) => ({
            content: block.content,
            positionX: block.position.x,
            positionY: block.position.y,
            width: block.size.width,
            height: block.size.height,
          })),
        },
      },
      include: { blocks: true },
    });
    res.json(document);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create document' });
  }
});

app.get('/api/documents/:id', authenticateUser, async (req: any, res) => {
  try {
    const document = await prisma.document.findUnique({
      where: { id: req.params.id },
      include: {
        blocks: true,
        comments: {
          include: { user: true },
        },
        signature: true,
      },
    });

    if (!document) {
      return res.status(404).json({ error: 'Document not found' });
    }

    if (document.userId !== req.user.uid) {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    res.json(document);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch document' });
  }
});

app.post('/api/documents/:id/sign', authenticateUser, async (req: any, res) => {
  try {
    const { name } = req.body;
    const signature = await prisma.signature.create({
      data: {
        name,
        documentId: req.params.id,
      },
    });
    res.json(signature);
  } catch (error) {
    res.status(500).json({ error: 'Failed to sign document' });
  }
});

// Start server
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
}); 