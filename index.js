const express = require('express');
const WebTorrent = require('webtorrent');
const app = express();
const client = new WebTorrent();

const PORT = process.env.PORT || 10000;
const MA_CLE = "MA-CLE-SECRET-2026"; 

app.get('/', (req, res) => res.send("La bulle est active !"));

app.get('/stream/:hash', (req, res) => {
    if (req.query.key !== MA_CLE) return res.status(403).send("Clé interdite");
    
    const magnet = `magnet:?xt=urn:btih:${req.params.hash}`;
    
    client.torrents.forEach(t => t.destroy());

    client.add(magnet, (torrent) => {
        const file = torrent.files.find(f => f.name.match(/\.(mp4|mkv|avi)$/i));
        if (!file) return res.status(404).send("Pas de vidéo");

        res.setHeader('Content-Type', 'video/mp4');
        file.createReadStream().pipe(res);
    });
});

app.listen(PORT, () => console.log("Serveur prêt !"));
