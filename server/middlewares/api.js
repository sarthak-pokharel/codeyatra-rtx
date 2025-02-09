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


router.post('/new-expert-profile', (req, res) => {
  const { created_by, title, services, description } = req.body;

  // Input validation
  if (!created_by || !title || !services || !description) {
    return res.status(400).json({
      error: 'All fields (created_by, title, services, description) are required'
    });
  }

  // Validate string lengths according to schema
  if (title.length > 200) {
    return res.status(400).json({
      error: 'Title must not exceed 200 characters'
    });
  }

  if (services.length > 300) {
    return res.status(400).json({
      error: 'Services must not exceed 300 characters'
    });
  }

  if (description.length > 2000) {
    return res.status(400).json({
      error: 'Description must not exceed 2000 characters'
    });
  }

  const query = `
    INSERT INTO expert_profile (created_by, title, services, description)
    VALUES (?, ?, ?, ?)
  `;

  connection.query(query,
    [created_by, title, services, description],
    (err, results) => {
      if (err) {
        if (err.code === 'ER_NO_REFERENCED_ROW_2') {
          return res.status(400).json({
            error: 'Invalid user ID provided'
          });
        }
        console.error('Error creating expert profile:', err);
        return res.status(500).json({
          error: 'Internal Server Error'
        });
      }
      res.status(201).json({
        message: 'Expert profile created successfully',
        profileId: results.insertId
      });
    }
  );
});

router.get('/production-info', (req, res) => {
  const {
    created_by,
    min_quantity,
    max_quantity,
    min_cost,
    max_cost,
    search_term,
    item_name    // Added new parameter
  } = req.query;

  let query = `
    SELECT p.*, u.first_name, u.last_name 
    FROM production_info p
    JOIN users u ON p.created_by = u.id
    WHERE 1=1
  `;
  const queryParams = [];

  // Add filters if provided
  if (created_by) {
    query += ` AND p.created_by = ?`;
    queryParams.push(created_by);
  }

  if (min_quantity) {
    query += ` AND p.quantity_per_month >= ?`;
    queryParams.push(parseInt(min_quantity));
  }

  if (max_quantity) {
    query += ` AND p.quantity_per_month <= ?`;
    queryParams.push(parseInt(max_quantity));
  }

  if (min_cost) {
    query += ` AND p.costing_per_month >= ?`;
    queryParams.push(parseInt(min_cost));
  }

  if (max_cost) {
    query += ` AND p.costing_per_month <= ?`;
    queryParams.push(parseInt(max_cost));
  }

  // Added case-insensitive item name search using LOWER()
  if (item_name) {
    query += ` AND LOWER(p.item_label) LIKE LOWER(?)`;
    queryParams.push(`%${item_name}%`);
  }

  // Case-insensitive general search across item_label and description
  if (search_term) {
    query += ` AND (LOWER(p.item_label) LIKE LOWER(?) OR LOWER(p.description) LIKE LOWER(?))`;
    const searchPattern = `%${search_term}%`;
    queryParams.push(searchPattern, searchPattern);
  }

  // Add ordering
  query += ` ORDER BY p.id DESC`;

  connection.query(query, queryParams, (err, results) => {
    if (err) {
      console.error('Error fetching production info:', err);
      return res.status(500).json({
        error: 'Internal Server Error'
      });
    }
    res.json({
      message: 'Production info retrieved successfully',
      count: results.length,
      data: results
    });
  });
});


router.get('/business-demands', (req, res) => {
  const {
    created_by,
    min_quantity,
    max_quantity,
    search_term,
    item_name
  } = req.query;

  let query = `
    SELECT b.*, u.first_name, u.last_name 
    FROM business_demand b
    JOIN users u ON b.created_by = u.id
    WHERE 1=1
  `;
  const queryParams = [];

  // Add filters if provided
  if (created_by) {
    query += ` AND b.created_by = ?`;
    queryParams.push(created_by);
  }

  if (min_quantity) {
    query += ` AND b.quantity_per_month >= ?`;
    queryParams.push(parseInt(min_quantity));
  }

  if (max_quantity) {
    query += ` AND b.quantity_per_month <= ?`;
    queryParams.push(parseInt(max_quantity));
  }

  // Case-insensitive item name search
  if (item_name) {
    query += ` AND LOWER(b.item_name) LIKE LOWER(?)`;
    queryParams.push(`%${item_name}%`);
  }

  // Case-insensitive general search across item_name and description
  if (search_term) {
    query += ` AND (LOWER(b.item_name) LIKE LOWER(?) OR LOWER(b.description) LIKE LOWER(?))`;
    const searchPattern = `%${search_term}%`;
    queryParams.push(searchPattern, searchPattern);
  }

  // Add ordering by most recent first
  query += ` ORDER BY b.id DESC`;

  connection.query(query, queryParams, (err, results) => {
    if (err) {
      console.error('Error fetching business demands:', err);
      return res.status(500).json({
        error: 'Internal Server Error'
      });
    }
    res.json({
      message: 'Business demands retrieved successfully',
      count: results.length,
      data: results
    });
  });
});


router.get('/expert-profiles', (req, res) => {
  const {
    created_by,
    search_term,
    service_type,
    sort_by = 'recent' // Default sorting by most recent
  } = req.query;

  let query = `
    SELECT e.*, u.first_name, u.last_name 
    FROM expert_profile e
    JOIN users u ON e.created_by = u.id
    WHERE 1=1
  `;
  const queryParams = [];

  // Add filters if provided
  if (created_by) {
    query += ` AND e.created_by = ?`;
    queryParams.push(created_by);
  }

  // Case-insensitive service type filter
  if (service_type) {
    query += ` AND LOWER(e.services) LIKE LOWER(?)`;
    queryParams.push(`%${service_type}%`);
  }

  // Case-insensitive general search across title, services and description
  if (search_term) {
    query += ` AND (
      LOWER(e.title) LIKE LOWER(?) OR 
      LOWER(e.services) LIKE LOWER(?) OR 
      LOWER(e.description) LIKE LOWER(?)
    )`;
    const searchPattern = `%${search_term}%`;
    queryParams.push(searchPattern, searchPattern, searchPattern);
  }

  // Add sorting based on the sort_by parameter
  switch (sort_by) {
    case 'title':
      query += ` ORDER BY e.title ASC`;
      break;
    case 'services':
      query += ` ORDER BY e.services ASC`;
      break;
    case 'recent':
    default:
      query += ` ORDER BY e.id DESC`;
  }

  connection.query(query, queryParams, (err, results) => {
    if (err) {
      console.error('Error fetching expert profiles:', err);
      return res.status(500).json({
        error: 'Internal Server Error'
      });
    }
    res.json({
      message: 'Expert profiles retrieved successfully',
      count: results.length,
      data: results
    });
  });
});


router.post('/create-new-post', (req, res) => {
  const { created_by, title, description, keywords } = req.body;

  // Input validation
  if (!created_by || !title || !description || !keywords) {
    return res.status(400).json({
      error: 'All fields (created_by, title, description, keywords) are required'
    });
  }

  // Validate string lengths 
  // Note: The schema shows title and description as int(11) which seems incorrect
  // Using reasonable string lengths for validation
  if (title.length > 200) {
    return res.status(400).json({
      error: 'Title must not exceed 200 characters'
    });
  }

  if (description.length > 2000) {
    return res.status(400).json({
      error: 'Description must not exceed 2000 characters'
    });
  }

  if (keywords.length > 500) {
    return res.status(400).json({
      error: 'Keywords must not exceed 500 characters'
    });
  }

  const query = `
    INSERT INTO posts (created_by, title, description, keywords)
    VALUES (?, ?, ?, ?)
  `;

  connection.query(query,
    [created_by, title, description, keywords],
    (err, results) => {
      if (err) {
        if (err.code === 'ER_NO_REFERENCED_ROW_2') {
          return res.status(400).json({
            error: 'Invalid user ID provided'
          });
        }
        console.error('Error creating post:', err);
        return res.status(500).json({
          error: 'Internal Server Error'
        });
      }
      res.status(201).json({
        message: 'Post created successfully',
        postId: results.insertId
      });
    }
  );
});

router.get('/posts', (req, res) => {
  const {
    created_by,
    search_term,
    keywords,
    sort_by = 'recent'  // Default sorting by most recent
  } = req.query;

  let query = `
    SELECT p.*, u.first_name, u.last_name 
    FROM posts p
    JOIN users u ON p.created_by = u.id
    WHERE 1=1
  `;
  const queryParams = [];

  // Add filters if provided
  if (created_by) {
    query += ` AND p.created_by = ?`;
    queryParams.push(created_by);
  }

  // Case-insensitive keywords filter
  if (keywords) {
    query += ` AND LOWER(p.keywords) LIKE LOWER(?)`;
    queryParams.push(`%${keywords}%`);
  }

  // Case-insensitive general search across title and description
  if (search_term) {
    query += ` AND (
      LOWER(CAST(p.title AS CHAR)) LIKE LOWER(?) OR 
      LOWER(CAST(p.description AS CHAR)) LIKE LOWER(?) OR
      LOWER(p.keywords) LIKE LOWER(?)
    )`;
    const searchPattern = `%${search_term}%`;
    queryParams.push(searchPattern, searchPattern, searchPattern);
  }

  // Add sorting based on the sort_by parameter
  switch (sort_by) {
    case 'title':
      query += ` ORDER BY p.title ASC`;
      break;
    case 'recent':
    default:
      query += ` ORDER BY p.posted_at DESC`;
  }

  connection.query(query, queryParams, (err, results) => {
    if (err) {
      console.error('Error fetching posts:', err);
      return res.status(500).json({
        error: 'Internal Server Error'
      });
    }
    res.json({
      message: 'Posts retrieved successfully',
      count: results.length,
      data: results
    });
  });
});

export default router;