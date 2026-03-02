const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch'); // Pour aller chercher les streams
const app = express();

app.use(cors());

// 1. LE MANIFEST
app.get('/manifest.json', (req, res) => {
    res.json({
        id: 'org.mabulle.vip',
        version: '1.0.0',
        name: 'MA BULLE VIP',
        description: 'Flux Privés 2026',
        resources: ['stream'],
        types: ['movie', 'series'],
        idPrefixes: ['tt', 'tmdb']
    });
});

// 2. LA ROUTE QUI CHERCHE LES FILMS (STREMIO)
app.get('/stream/:type/:id.json', async (req, res) => {
    const { type, id } = req.params;
    console.log(`Recherche de flux pour : ${id}`);

    try {
        // On interroge Torrentio pour obtenir les sources
        const response = await fetch(`https://torrentio.strem.fun/stream/${type}/${id}.json`);
        const data = await response.json();

        if (data.streams && data.streams.length > 0) {
            // On prend les 5 meilleurs liens et on met ton nom "MA BULLE VIP"
            const results = data.streams.slice(0, 5).map(s => ({
                name: '🚀 MA BULLE VIP',
                title: `${s.title}\n⭐ Source Haute Qualité`,
                infoHash: s.infoHash,
                fileIdx: s.fileIdx
            }));
            res.json({ streams: results });
        } else {
            res.json({ streams: [] });
        }
    } catch (error) {
        console.error("Erreur recherche flux:", error);
        res.json({ streams: [] });
    }
});

// 3. PAGE D'ACCUEIL TEST
app.get('/', (req, res) => {
    res.send('<h1>🚀 MA BULLE VIP EST EN LIGNE</h1>');
});

// 4. CONFIG SERVEUR
const port = process.env.PORT || 10000;
app.listen(port, '0.0.0.0', () => {
    console.log(`Serveur prêt sur le port ${port}`);
});
