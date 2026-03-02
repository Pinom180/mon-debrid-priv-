const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch');
const app = express();

app.use(cors());

// 1. LE MANIFEST
app.get('/manifest.json', (req, res) => {
    res.json({
        id: 'org.mabulle.vip',
        version: '1.1.0',
        name: 'MA BULLE VIP',
        description: 'Flux Privés 4K & 1080p',
        resources: ['stream'],
        types: ['movie', 'series'],
        idPrefixes: ['tt', 'tmdb']
    });
});

// 2. LA ROUTE DE RECHERCHE DE FLUX (4K, 1080p, etc.)
app.get('/stream/:type/:id.json', async (req, res) => {
    const { type, id } = req.params;

    try {
        // On récupère les sources réelles via Torrentio
        const response = await fetch(`https://torrentio.strem.fun/stream/${type}/${id}.json`);
        const data = await response.json();

        if (data.streams && data.streams.length > 0) {
            // On transforme les sources pour afficher la qualité sous ton nom
            const results = data.streams.slice(0, 15).map(s => {
                
                // On extrait la première ligne du titre original (ex: 4K, 1080p)
                const qualityLabel = s.title.split('\n')[0] || "";
                
                return {
                    name: `🚀 MA BULLE VIP\n${qualityLabel}`,
                    title: s.title, // Contient la taille (GB) et les Seeds
                    infoHash: s.infoHash,
                    fileIdx: s.fileIdx,
                    behaviorHints: {
                        bingeGroup: "mabulle-vip-streams"
                    }
                };
            });
            res.json({ streams: results });
        } else {
            res.json({ streams: [] });
        }
    } catch (error) {
        console.error("Erreur serveur:", error);
        res.json({ streams: [] });
    }
});

// 3. PAGE TEST
app.get('/', (req, res) => {
    res.send('<h1>🚀 MA BULLE VIP EST EN LIGNE (V1.1 - Multi-Qualité)</h1>');
});

// 4. LANCEMENT
const port = process.env.PORT || 10000;
app.listen(port, '0.0.0.0', () => {
    console.log(`Serveur actif sur le port ${port}`);
});
