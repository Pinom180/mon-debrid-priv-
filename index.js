const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch');
const app = express();

app.use(cors());

// 1. LE MANIFEST
app.get('/manifest.json', (req, res) => {
    res.json({
        id: 'org.mabulle.vip',
        version: '1.2.0',
        name: 'MA BULLE VIP',
        description: 'Flux Privés 4K & 1080p',
        resources: ['stream'],
        types: ['movie', 'series'],
        idPrefixes: ['tt', 'tmdb']
    });
});

// 2. LA ROUTE DE RECHERCHE (Correction du "No Streams")
app.get('/stream/:type/:id.json', async (req, res) => {
    const { type, id } = req.params;

    try {
        // Ajout d'un User-Agent pour simuler un navigateur et éviter le blocage
        const response = await fetch(`https://torrentio.strem.fun/stream/${type}/${id}.json`, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
            }
        });
        
        const data = await response.json();

        if (data.streams && data.streams.length > 0) {
            const results = data.streams.slice(0, 15).map(s => {
                const lines = s.title.split('\n');
                const quality = lines[0]; // Récupère 4K, 1080p, etc.

                return {
                    name: `🚀 MA BULLE VIP\n${quality}`,
                    title: s.title,
                    infoHash: s.infoHash,
                    fileIdx: s.fileIdx
                };
            });
            res.json({ streams: results });
        } else {
            res.json({ streams: [] });
        }
    } catch (error) {
        console.error("Erreur de récupération:", error);
        res.json({ streams: [] });
    }
});

app.get('/', (req, res) => {
    res.send('<h1>🚀 MA BULLE VIP V1.2 ACTIVÉE</h1>');
});

const port = process.env.PORT || 10000;
app.listen(port, '0.0.0.0', () => {
    console.log(`Serveur actif sur le port ${port}`);
});
