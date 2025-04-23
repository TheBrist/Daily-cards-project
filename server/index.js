const pool = require('./db/connection')
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
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

console.log(process.env);

app.get('/', (req, res) => {
    res.send('Backend is running')
});

app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`)
})


app.get('/userspass', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM users');
        res.json(result.rows);
    } catch (error) {
        console.error('Error fetching users with passwords:', error);
        res.status(500).json({ error: 'Server error fetching users' });
    }
});

app.get('/usernames', async (req, res) => {
    try {
        const result = await pool.query('SELECT name FROM users');
        const usernames = result.rows.map(row => row.name);
        res.json(usernames);
    } catch (error) {
        console.error('Error fetching usernames:', error);
        res.status(500).json({ error: 'Server error fetching usernames' });
    }
});

app.get('/users/:name', async (req, res) => {
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


app.get('/entries/:date', async (req, res) => {
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


app.post('/entries', async (req, res) => {
    const {
        username,
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
            username,
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

app.put('/entries/:id', async (req, res) => {
    const { id } = req.params;
    const {
        date,
        help_accepted,
        username,
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
          username,
          dateObj ? dateObj.toISOString().split("T")[0] : null,
          yesterday,
          today,
          needs_help,
          help_accepted,
          helper_name,
          Number(id),
      ];
      
            
        const result = await pool.query(query, values);
        console.log(values);
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


app.delete('/entries/:id', async (req, res) => {
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
