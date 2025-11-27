const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const fs = require('fs');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(bodyParser.json());

let history = [];

// POST /api/history - save calculation
app.post('/api/history', (req, res) => {
    const { expression, result } = req.body;
    if (!expression || result === undefined) {
        return res.status(400).json({ error: 'Invalid data' });
    }

    history.push({ expression, result, timestamp: new Date() });
    fs.writeFileSync('history.json', JSON.stringify(history, null, 2));
    res.json({ message: 'Calculation saved!', history });
});

// GET /api/history - get all calculations
app.get('/api/history', (req, res) => {
    res.json(history);
});

app.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}`));
