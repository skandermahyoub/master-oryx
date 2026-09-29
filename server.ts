import express from 'express';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = parseInt(process.env.PORT || '3000', 10);

app.use(express.json({ limit: '10mb' }));

// Shared Gemini Client
const getGeminiClient = () => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error('GEMINI_API_KEY is missing in environment variables');
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
};

// API Endpoint: AI Image Generation
app.post('/api/generate-image', async (req, res) => {
  try {
    const { prompt, aspectRatio = '16:9' } = req.body;
    if (!prompt) {
      return res.status(400).json({ error: 'الرجاء كتابة وصف النص للصورة' });
    }

    const ai = getGeminiClient();
    
    // Enhanced prompt for luxury corporate aesthetics
    const styledPrompt = `High quality, ultra-detailed professional corporate background illustration for business development & smart technology solutions, style: modern cinematic 8k, luxury gold and deep navy theme: ${prompt}`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.1-flash-lite-image',
      contents: styledPrompt,
      config: {
        imageConfig: {
          aspectRatio: aspectRatio as any || '16:9',
        },
      },
    });

    let imageUrl: string | null = null;
    if (response.candidates?.[0]?.content?.parts) {
      for (const part of response.candidates[0].content.parts) {
        if (part.inlineData) {
          imageUrl = `data:${part.inlineData.mimeType || 'image/png'};base64,${part.inlineData.data}`;
          break;
        }
      }
    }

    if (!imageUrl) {
      return res.status(500).json({ error: 'لم يتم استرجاع صورة من نموذج الذكاء الاصطناعي' });
    }

    return res.json({ imageUrl });
  } catch (err: any) {
    console.error('Error generating image with Gemini:', err);
    return res.status(500).json({ 
      error: err.message || 'حدث خطأ أثناء توليد الصورة بالذكاء الاصطناعي' 
    });
  }
});

// Helper route to check server health
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', time: new Date().toISOString() });
});

async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true, port: PORT },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Server listening on http://0.0.0.0:${PORT}`);
  });
}

startServer();
