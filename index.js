const express = require('express');
const cors = require('cors'); // Obligatoire pour Stremio
const app = express();

// 1. Autoriser les connexions externes (CORS)
app.use(cors());

// 2. Le Manifest (Carte d'identité pour Stremio)
app.get('/manifest.json', (req, res) => {
    res.json({
        id: 'org.mabulle.vip',
        version: '1.0.0',
        name: 'MA BULLE VIP',
        description: 'Serveur Privé 2026',
        resources: ['stream'],
        types: ['movie', 'series'],
        idPrefixes: ['tt', 'tmdb']
    });
});

// 3. La Route de Stream (Utilisée par Stremio et ton site)
app.get('/stream/:type/:id.json', (req, res) => {
    // Cette route est spécifique à l'installation Stremio
    res.json({ streams: [] }); 
});

// 4. Ta route personnalisée pour ton site HTML
app.get('/stream/:hash', (req, res) => {
    const hash = req.params.hash;
    const key = req.query.key;

    if (key !== 'MA-CLE-SECRET-2026') {
        return res.status(403).send('Clé VIP invalide');
    }

    // Ici le serveur simule le flux vidéo pour le hash
    res.send(`Lecture du flux pour le hash : ${hash}`);
});

// 5. Page d'accueil pour tester dans le navigateur
app.get('/', (req, res) => {
    res.send('<h1>🚀 MA BULLE VIP EST EN LIGNE</h1>');
});

// 6. Lancement du serveur (Config Render)
const port = process.env.PORT || 10000;
const host = '0.0.0.0';

app.listen(port, host, () => {
    console.log(`Serveur actif sur le port ${port}`);
});
