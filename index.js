const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch');
const app = express();

app.use(cors());

// TA CLÉ VIP (Tu peux la changer ici)
const VIP_KEY = "MA-CLE-SECRET-2026";

app.get('/manifest.json', (req, res) => {
    res.json({
        id: 'org.mabulle.vip',
        version: '3.0.0',
        name: 'MA BULLE VIP',
        description: 'Flux Torrentio VIP - Sécurisé',
        resources: ['stream'],
        types: ['movie', 'series'],
        idPrefixes: ['tt']
    });
});

// ROUTE SÉCURISÉE : Ton site web appellera cette route avec la clé
// Exemple : /stream/movie/tt12345.json?key=MA-CLE-SECRET-2026
app.get('/stream/:type/:id.json', async (req, res) => {
    const { type, id } = req.params;
    const userKey = req.query.key;

    // 1. VÉRIFICATION DE LA CLÉ (Optionnel pour Stremio, mais vital pour ton site)
    // Note : Stremio ne peut pas envoyer de ?key= facilement, donc on laisse passer Stremio
    // mais on pourra bloquer les autres plus tard.
    
    try {
        // 2. ON APPELLE TORRENTIO (Configuration par défaut optimale)
        const torrentioUrl = `https://torrentio.strem.fun/providers=yts,eztv,rarbg,1337x,thepiratebay,kickasstorrents|language=french/stream/${type}/${id}.json`;
        
        const response = await fetch(torrentioUrl, {
            headers: { 'User-Agent': 'Mozilla/5.0' }
        });
        const data = await response.json();

        if (data.streams && data.streams.length > 0) {
            // 3. ON RE-BRANDE LES LIENS EN "MA BULLE VIP"
            const results = data.streams.slice(0, 10).map(s => {
                const quality = s.title.split('\n')[0];
                return {
                    name: `🚀 MA BULLE VIP\n${quality}`,
                    title: `✨ ACCÈS PREMIUM ✨\n${s.title}`,
                    infoHash: s.infoHash,
                    fileIdx: s.fileIdx
                };
            });
            res.json({ streams: results });
        } else {
            res.json({ streams: [] });
        }
    } catch (error) {
        res.json({ streams: [] });
    }
});

const port = process.env.PORT || 10000;
app.listen(port, '0.0.0.0', () => console.log("Serveur VIP Opérationnel"));
