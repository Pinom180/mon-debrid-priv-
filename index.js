const express = require('express');
const WebTorrent = require('webtorrent');
const app = express();
const client = new WebTorrent();

// MODIFIE TA CLÉ ICI (Garde les guillemets)
const MY_KEY = "MA-CLE-SECRET-2026"; 

app.get('/', (req, res) => {
    res.send("Bulle Active. En attente de clé...");
});

app.get('/stream/:hash', (req, res) => {
    if (req.query.key !== MY_KEY) return res.status(403).send("Clé invalide");

    const magnet = `magnet:?xt=urn:btih:${req.params.hash}`;
    
    // On nettoie les anciens torrents pour ne pas saturer le serveur gratuit
    if (client.torrents.length > 2) {
        client.torrents[0].destroy();
    }

    client.add(magnet, (torrent) => {
        const file = torrent.files.find(f => f.name.match(/\.(mp4|mkv|avi)$/i));
        if (!file) return res.status(404).send("Vidéo non trouvée");

        res.setHeader('Content-Type', 'video/mp4');
        file.createReadStream().pipe(res);
        console.log("Streaming en cours...");
    });
});
