const pool = require('./db/connection')
const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const port = process.env.PORT || 8080;
const SECRET = process.env.JWT_SECRET;


const whitelist = ['https://frontend-daily-cards-418901622719.me-west1.run.app', 'http://34.0.69.148', 'http://localhost:5173', 'http://fentanyl.ondutyschedulers.com/'];
const corsOptions = {
    origin: (origin, callback) => {
        if (whitelist.indexOf(origin) !== -1 || !origin) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    optionsSuccessStatus: 200
};

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.get('/api', (req, res) => {
    res.send('Backend is running')
});

app.listen(port, () => {
    console.log(`Server listening on port ${port}`)
})

function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // "Bearer TOKEN"

    if (!token) return res.sendStatus(401);

    jwt.verify(token, SECRET, (err, username) => {
        if (err) return res.sendStatus(403);
        req.username = username;
        next();
    });
}

app.get('/api/login', async (req, res) => {
    try {
        let username = req.headers.email?.split(':')[1]; 
        if (!username) {
            return res.status(400).json({ error: 'Malformed email' });
        }

        username = username.replace(/^xd\./, '').replace(/@gcp\.idf\.il$/, '');

        // let user = await pool.query('SELECT username FROM users WHERE username = $1', [username]);

        // if (!user.rowCount) {
        //     await pool.query('INSERT INTO users (username, email) VALUES ($1, $2)', [username, email]);
        //     user = await pool.query('SELECT username FROM users WHERE username = $1', [username]);
        // }

        const token = jwt.sign({ name: username }, SECRET, { expiresIn: '2h' });
        res.json({ name: username, token: token });
    } catch (err) {
        console.error('Login DB error:', err);
        res.status(503).json({ error: 'Login failed' });
    }
});


app.get('/api/usernames', authenticateToken, async (req, res) => {
    try {
        const result = await pool.query('SELECT username FROM users');
        const usernames = result.rows.map(row => row.username);
        res.json(usernames);
    } catch (error) {
        console.error('Error fetching usernames:', error);
        res.status(500).json({ error: 'Server error fetching usernames' });
    }
});

app.get('/api/users/:username', authenticateToken, async (req, res) => {
    const { username } = req.params;
    try {
        const result = await pool.query('SELECT * FROM users WHERE username = $1', [username]);
        if (result.rows.length > 0) {
            res.json(result.rows[0]);
        } else {
            res.status(404).json({ error: 'User not found' });
        }
    } catch (error) {
        console.error('Error fetching user:', error);
        res.status(500).json({ error: 'Server error fetching user' });
    }
});


app.get('/api/entries/:date', authenticateToken, async (req, res) => {
    const { date } = req.params;
    if (!date) return res.status(400).send("Date is required");

    try {
        const query = `
        SELECT entries.*
        FROM entries
        WHERE entries.date = $1
      `;

        const result = await pool.query(query, [date]);
        res.json(result.rows);
    } catch (err) {
        console.error("Error fetching entries:", err);
        res.status(500).send("Server error");
    }
});


app.post('/api/entries', authenticateToken, async (req, res) => {
    const {
        yesterday,
        today,
        needs_help,
        help_accepted,
        helper_name,
        date,
    } = req.body;

    try {
        const query = `
        INSERT INTO entries (
          username, yesterday, today,
          needs_help, help_accepted, helper_name, date
        )
        VALUES ($1, $2, $3, $4, $5, $6, $7)
        RETURNING *;
      `;
        const values = [
            req.username,
            yesterday,
            today,
            needs_help,
            help_accepted,
            helper_name,
            date,
        ];


        const result = await pool.query(query, values);
        res.status(201).json(result.rows[0]);
    } catch (err) {
        console.error("Error inserting entry:", err);
        res.status(500).send("Server error");
    }
});

app.put('/api/entries/:id', authenticateToken, async (req, res) => {
    const { id } = req.params;
    const {
        date,
        help_accepted,
        yesterday,
        today,
        needs_help,
        helper_name,
    } = req.body;

    try {
        const query = `
        UPDATE entries
        SET
          username = COALESCE($1, username),
          date = COALESCE($2::date, date),
          yesterday = COALESCE($3, yesterday),
          today = COALESCE($4, today),
          needs_help = COALESCE($5, needs_help),
          help_accepted = COALESCE($6, help_accepted),
          helper_name = COALESCE($7, helper_name)
        WHERE id = $8
        RETURNING *;
      `;

        const dateObj = date ? new Date(date) : null;
        if (dateObj) {
            dateObj.setUTCDate(dateObj.getUTCDate() + 1); // Add one day in UTC
        }

        const values = [
            req.username,
            dateObj ? dateObj.toISOString().split("T")[0] : null,
            yesterday,
            today,
            needs_help,
            help_accepted,
            helper_name,
            Number(id),
        ];


        const result = await pool.query(query, values);
        if (result.rows.length === 0) {
            res.status(404).json({ error: 'Entry not found' });
        } else {
            res.json(result.rows[0]);
        }
    } catch (err) {
        console.error("Error updating entry:", err);
        res.status(500).send("Server error");
    }
});


app.delete('/api/entries/:id', authenticateToken, async (req, res) => {
    const { id } = req.params;

    try {
        const result = await pool.query('DELETE FROM entries WHERE id = $1', [id]);

        if (result.rowCount === 0) {
            return res.status(404).json({ error: 'Entry not found' });
        }

        res.status(204).send();
    } catch (err) {
        console.error("Error deleting entry:", err);
        res.status(500).send("Server error");
    }
});
