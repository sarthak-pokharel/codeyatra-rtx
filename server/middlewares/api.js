import express from 'express';
import connection from './db.js'; //mysql connection
const router = express.Router();

router.get('/', (req, res) => {
  res.send('API Home');
});


router.post('/new-user', (req, res) => {
  const { contact_num, country_code, first_name, middle_name, last_name, gender, contact_email, location_raw } = req.body;

  // Input validation
  if (!contact_num || !first_name) {
    return res.status(400).json({
      error: 'Contact number and first name are required'
    });
  }

  // Validate contact number format (assuming phone numbers)
  const phoneRegex = /^\d{7,15}$/;
  if (!phoneRegex.test(contact_num)) {
    return res.status(400).json({
      error: 'Invalid contact number format'
    });
  }

  // Validate email format if provided
  if (contact_email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(contact_email)) {
      return res.status(400).json({
        error: 'Invalid email format'
      });
    }
  }

  const query = `
    INSERT INTO users (contact_num, country_code, first_name, middle_name, last_name, gender, contact_email, location_raw)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `;

  connection.query(query, 
    [contact_num, country_code || '977', first_name, middle_name, last_name, gender, contact_email, location_raw],
    (err, results) => {
      if (err) {
        if (err.code === 'ER_DUP_ENTRY') {
          return res.status(409).json({
            error: 'Contact number already exists'
          });
        }
        console.error('Error inserting new user:', err);
        return res.status(500).json({
          error: 'Internal Server Error'
        });
      }
      res.status(201).json({
        message: 'User registered successfully',
        userId: results.insertId
      });
    }
  );
});




export default router;