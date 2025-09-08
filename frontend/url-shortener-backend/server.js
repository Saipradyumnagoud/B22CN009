const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const PORT = 4000;

const urlDatabase = {};
const generateShortcode = () => {
    return Math.random().toString(36).substring(2, 8);
};

app.use(bodyParser.json());

app.use(cors());

app.post('/api/shorten', (req, res) => {
    const { longUrl, validity, customCode } = req.body;

    if (!longUrl) {
        return res.status(400).json({ error: 'Original URL is required.' });
    }

    let shortcode = customCode || generateShortcode();

    while (urlDatabase[shortcode]) {
        if (customCode) {
            return res.status(409).json({ error: 'Custom shortcode already in use.' });
        }
        shortcode = generateShortcode();
    }

    urlDatabase[shortcode] = {
        longUrl,
        validity: validity || 30,
        createdAt: Date.now(),
        clicks: 0,
    };

    const shortUrl = `http://localhost:${PORT}/${shortcode}`;
    res.status(201).json({ shortUrl, longUrl, shortcode });
});

app.get('/:shortcode', (req, res) => {
    const { shortcode } = req.params;
    const urlEntry = urlDatabase[shortcode];

    if (urlEntry) {
        urlEntry.clicks++;
        return res.redirect(302, urlEntry.longUrl);
    } else {
        res.status(404).sendFile(path.join(__dirname, '404.html'));
    }
});



app.listen(PORT, () => {
    console.log(`URL Shortener backend running on http://localhost:${PORT}`);
});