const express = require('express');
const app = express();

// 1. CONFIGURATION DU PORT POUR RENDER (TRÈS IMPORTANT)
const port = process.env.PORT || 10000;
const host = '0.0.0.0'; 

// 2. LE MANIFEST (Pour que Stremio et ton HTML voient l'addon)
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

// 3. LA ROUTE DE LECTURE (Celle qui reçoit le hash)
app.get('/stream/:hash', (req, res) => {
    const hash = req.params.hash;
    const key = req.query.key;

    // Vérification de ta clé secrète
    if (key !== 'MA-CLE-SECRET-2026') {
        return res.status(403).send('Clé VIP invalide');
    }

    // Ici, le serveur répond qu'il est prêt à lire le hash
    // (C'est ici que ton moteur de streaming intervient)
    res.send(`Flux vidéo prêt pour le hash : ${hash}`);
});

// 4. PAGE D'ACCUEIL (Pour tester si le site est en ligne)
app.get('/', (req, res) => {
    res.send('<h1>🚀 MA BULLE VIP EST EN LIGNE</h1>');
});

// 5. LANCEMENT DU SERVEUR
app.listen(port, host, () => {
    console.log(`Serveur actif sur http://${host}:${port}`);
});
