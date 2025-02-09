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


router.post('/new-business-demand', (req, res) => {
  const { created_by, item_name, quantity_per_month, description } = req.body;

  // Input validation
  if (!created_by || !item_name || !quantity_per_month || !description) {
    return res.status(400).json({
      error: 'All fields (created_by, item_name, quantity_per_month, description) are required'
    });
  }

  // Validate quantity is a positive number
  if (!Number.isInteger(quantity_per_month) || quantity_per_month <= 0) {
    return res.status(400).json({
      error: 'Quantity per month must be a positive integer'
    });
  }

  // Validate string lengths according to schema
  if (item_name.length > 200) {
    return res.status(400).json({
      error: 'Item name must not exceed 200 characters'
    });
  }

  if (description.length > 1000) {
    return res.status(400).json({
      error: 'Description must not exceed 1000 characters'
    });
  }

  const query = `
    INSERT INTO business_demand (created_by, item_name, quantity_per_month, description)
    VALUES (?, ?, ?, ?)
  `;

  connection.query(query,
    [created_by, item_name, quantity_per_month, description],
    (err, results) => {
      if (err) {
        if (err.code === 'ER_NO_REFERENCED_ROW_2') {
          return res.status(400).json({
            error: 'Invalid user ID provided'
          });
        }
        console.error('Error inserting business demand:', err);
        return res.status(500).json({
          error: 'Internal Server Error'
        });
      }
      res.status(201).json({
        message: 'Business demand created successfully',
        demandId: results.insertId
      });
    }
  );
});


router.post('/new-production-info', (req, res) => {
  const { created_by, item_label, description, quantity_per_month, costing_per_month } = req.body;

  // Input validation
  if (!created_by || !item_label || !description || !quantity_per_month || !costing_per_month) {
    return res.status(400).json({
      error: 'All fields (created_by, item_label, description, quantity_per_month, costing_per_month) are required'
    });
  }

  // Validate string lengths
  if (item_label.length > 200) {
    return res.status(400).json({
      error: 'Item label must not exceed 200 characters'
    });
  }

  if (description.length > 2000) {
    return res.status(400).json({
      error: 'Description must not exceed 2000 characters'
    });
  }

  // Validate numeric fields
  if (!Number.isInteger(quantity_per_month) || quantity_per_month <= 0) {
    return res.status(400).json({
      error: 'Quantity per month must be a positive integer'
    });
  }

  if (!Number.isInteger(costing_per_month) || costing_per_month <= 0) {
    return res.status(400).json({
      error: 'Costing per month must be a positive integer'
    });
  }

  const query = `
    INSERT INTO production_info (created_by, item_label, description, quantity_per_month, costing_per_month)
    VALUES (?, ?, ?, ?, ?)
  `;

  connection.query(query,
    [created_by, item_label, description, quantity_per_month, costing_per_month],
    (err, results) => {
      if (err) {
        if (err.code === 'ER_NO_REFERENCED_ROW_2') {
          return res.status(400).json({
            error: 'Invalid user ID provided'
          });
        }
        console.error('Error inserting production info:', err);
        return res.status(500).json({
          error: 'Internal Server Error'
        });
      }
      res.status(201).json({
        message: 'Production info created successfully',
        productionInfoId: results.insertId
      });
    }
  );
});

export default router;