import express from 'express';
import fetch from 'node-fetch';
import dotenv from 'dotenv';

dotenv.config();

const app = express();

app.use(express.json());

app.get('/', (req, res) => {
  res.send('Twitch Clip API está funcionando 🚀');
});

app.post('/create-clip', async (req, res) => {
  const broadcasterId = process.env.BROADCASTER_ID;
  const accessToken = process.env.ACCESS_TOKEN;
  const clientId = process.env.CLIENT_ID;

  try {
    const response = await fetch(`https://api.twitch.tv/helix/clips?broadcaster_id=${broadcasterId}`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Client-Id': clientId
      }
    });

    const data = await response.json();

    if (response.ok && data.data.length > 0) {
      res.json({
        success: true,
        message: 'Clip creado con éxito',
        clipUrl: data.data[0].edit_url
      });
    } else {
      res.status(400).json({
        success: false,
        message: 'No se pudo crear el clip',
        error: data
      });
    }
  } catch (error) {
    console.error('Error al crear el clip:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor',
      error: error.message
    });
  }
});

// Exporta la aplicación como un módulo
export default app;
