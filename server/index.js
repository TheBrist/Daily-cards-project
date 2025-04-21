const express = require('express');
const cors = require('cors');
const PORT = process.env.PORT || 8080;

const whitelist = ['https://www.yoursite.com', 'http://127.0.0.1:5500', 'http://localhost:5173'];
const corsOptions = {
    origin: (origin, callback) => {
        if (whitelist.indexOf(origin) !== -1 || !origin) {
            callback(null, true)
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    optionsSuccessStatus: 200
}

const app = express();
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));



app.get('/api', (req, res) => {
    res.send('Backend is running')
});

app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`)
})

let users = [
    'Fentanetanel',
    'Ori Ramos',
    'Ori The Cool',
    'Yeskin the king',
    'Grandpa',
    'Matan',
]

let entries = [
    {
        id: 1,
        userName: 'Fentanetanel',
        date: '2025-04-20',
        yesterday: 'Worked on dashboard',
        today: 'Write Terraform',

    },
    {
        id: 2,
        userName: 'Ori Ramos',
        date: '2025-04-20',
        yesterday: 'Wrote tests',
        today: 'Fix UI bugs',
    },
];

app.get('/api/users', (req, res) => {
    res.json(users);
});

app.get('/api/users/:name', (req, res) => {
    const { name } = req.params;
    if (users.includes(name)) {
        res.json({ name });
    } else {
        res.status(404).json({ error: 'User not found' });
    }
});

app.get('/api/entries', (req, res) => {
    const { date, userName } = req.query;

    let result = entries;
    if (date) result = result.filter(entry => entry.date === date);
    if (userName) result = result.filter(entry => entry.userName === userName);

    res.json(result);
});

app.post('/api/entries', (req, res) => {
    const newEntry = {
        id: parseInt(Math.random() * 10000),
        ...req.body,
    };
    entries.push(newEntry);
    res.status(201).json(newEntry);
});

app.put('/api/entries/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const index = entries.findIndex(e => e.id === id);
    if (index !== -1) {
      entries[index] = { ...entries[index], ...req.body };
      res.json(entries[index]);
    } else {
      res.status(404).json({ error: 'Entry not found' });
    }
  });
  
  app.delete('/api/entries/:id', (req, res) => {
    const id = parseInt(req.params.id);
    entries = entries.filter(e => e.id !== id);
    res.status(204).send();
  });