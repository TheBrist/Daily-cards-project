const pool = require('./db/connection')
const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const port = process.env.PORT || 8080;
const SECRET = process.env.JWT_SECRET;


const whitelist = ['https://frontend-daily-cards-418901622719.me-west1.run.app', 'http://34.0.69.148', 'http://localhost:5173'];
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

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.get('/', (req, res) => {
    res.send('Backend is running')
});

app.listen(port, () => {
    console.log(`Server listening on port ${port}`)
})

function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // "Bearer TOKEN"

    if (!token) return res.sendStatus(401);

    jwt.verify(token, SECRET, (err, user) => {
        if (err) return res.sendStatus(403);
        req.user = user;
        next();
    });
}

app.post('/login', async (req, res) => {
    const { name, password } = req.body;

    try {
        const result = await pool.query('SELECT * FROM users WHERE name = $1', [name]);

        if (result.rows.length === 0) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        const user = result.rows[0];

        const isPasswordValid = await bcrypt.compare(password, user.pass); // if password is hashed
        if (!isPasswordValid) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        const token = jwt.sign({ id: user.id, name: user.name }, SECRET, { expiresIn: '2h' });
        res.json({ token });
    } catch (err) {
        console.error('Login error:', err);
        res.status(500).json({ error: 'Server error during login' });
    }
});


app.get('/usernames', authenticateToken, async (req, res) => {
    try {
        const result = await pool.query('SELECT name FROM users');
        const usernames = result.rows.map(row => row.name);
        res.json(usernames);
    } catch (error) {
        console.error('Error fetching usernames:', error);
        res.status(500).json({ error: 'Server error fetching usernames' });
    }
});

app.get('/users/:name', authenticateToken, async (req, res) => {
    const { name } = req.params;
    try {
        const result = await pool.query('SELECT * FROM users WHERE name = $1', [name]);
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


app.get('/entries/:date', authenticateToken, async (req, res) => {
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


app.post('/entries', authenticateToken, async (req, res) => {
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
            req.user.name,
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

app.put('/entries/:id', authenticateToken, async (req, res) => {
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
          req.user.name,
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


app.delete('/entries/:id', authenticateToken, async (req, res) => {
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
