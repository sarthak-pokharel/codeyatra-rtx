
import express from 'express';
import connection from './db.js'; //mysql connection
import "dotenv/config";
import fetch from 'node-fetch';
import jwt from 'jsonwebtoken';
import { verifyToken } from './jwtverify.js';


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


router.post('/user-details', verifyToken, (req, res) => {
  const query = `
    SELECT id, first_name, last_name, contact_email, contact_num, country_code, gender, location_raw
    FROM users
    WHERE id = ?
    LIMIT 1
  `;

  connection.query(query, [req.userId], (err, results) => {
    if (err) {
      console.error('Error fetching user details:', err);
      return res.status(500).json({
        error: 'Internal Server Error'
      });
    }

    if (results.length === 0) {
      return res.status(404).json({
        error: 'User not found'
      });
    }

    res.json({
      message: 'User details retrieved successfully',
      data: results[0]
    });
  });
});

router.put('/edit-user/:id', (req, res) => {
  const { id } = req.params;
  const { contact_num, country_code, first_name, middle_name, last_name, gender, contact_email, location_raw } = req.body;

  // Input validation
  if (!contact_num && !first_name && !last_name && !gender && !contact_email && !location_raw) {
    return res.status(400).json({
      error: 'At least one field must be provided for update'
    });
  }

  // Validate contact number format if provided
  if (contact_num) {
    const phoneRegex = /^\d{7,15}$/;
    if (!phoneRegex.test(contact_num)) {
      return res.status(400).json({
        error: 'Invalid contact number format'
      });
    }
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

  // Build dynamic update query
  let updateFields = [];
  const queryParams = [];

  if (contact_num) {
    updateFields.push('contact_num = ?');
    queryParams.push(contact_num);
  }
  if (country_code) {
    updateFields.push('country_code = ?');
    queryParams.push(country_code);
  }
  if (first_name) {
    updateFields.push('first_name = ?');
    queryParams.push(first_name);
  }
  if (middle_name) {
    updateFields.push('middle_name = ?');
    queryParams.push(middle_name);
  }
  if (last_name) {
    updateFields.push('last_name = ?');
    queryParams.push(last_name);
  }
  if (gender) {
    updateFields.push('gender = ?');
    queryParams.push(gender);
  }
  if (contact_email) {
    updateFields.push('contact_email = ?');
    queryParams.push(contact_email);
  }
  if (location_raw) {
    updateFields.push('location_raw = ?');
    queryParams.push(location_raw);
  }

  // Add id as last parameter
  queryParams.push(id);

  const query = `
    UPDATE users 
    SET ${updateFields.join(', ')}
    WHERE id = ?
  `;

  connection.query(query, queryParams, (err, results) => {
    if (err) {
      console.error('Error updating user:', err);
      return res.status(500).json({
        error: 'Internal Server Error'
      });
    }

    if (results.affectedRows === 0) {
      return res.status(404).json({
        error: 'User not found'
      });
    }

    res.json({
      message: 'User updated successfully'
    });
  });
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


router.post('/new-expert-profile', verifyToken, (req, res) => {
  const { title, services, description } = req.body;
  const created_by = req.userId; // Extracted from the verified token

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
    item_name,   
    district     // Added district parameter
  } = req.query;

  let query = `
    SELECT p.*, u.first_name, u.last_name,
           DATE_FORMAT(p.posted_at, '%Y-%m-%d %H:%i:%s') as posted_at
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

  // Added case-insensitive district filter
  if (district) {
    query += ` AND LOWER(p.district) LIKE LOWER(?)`;
    queryParams.push(`%${district}%`);
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

router.get('/production-info/:id', (req, res) => {
  const { id } = req.params;

  if (!id || isNaN(id)) {
    return res.status(400).json({
      error: 'Valid production ID is required'
    });
  }

  const query = `
    SELECT p.*, u.first_name, u.last_name,
           DATE_FORMAT(p.posted_at, '%Y-%m-%d %H:%i:%s') as posted_at
    FROM production_info p
    JOIN users u ON p.created_by = u.id
    WHERE p.id = ?
  `;

  connection.query(query, [id], (err, results) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({
        error: 'Internal server error'
      });
    }

    if (results.length === 0) {
      return res.status(404).json({
        error: 'Production info not found'
      });
    }

    res.json({
      data: results[0]
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
    SELECT b.*, u.first_name, u.last_name,
           DATE_FORMAT(b.posted_at, '%Y-%m-%d %H:%i:%s') as posted_at
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

router.get('/business-demands/:id', (req, res) => {
  const { id } = req.params;

  if (!id || isNaN(id)) {
    return res.status(400).json({
      error: 'Valid business demand ID is required'
    });
  }

  const query = `
    SELECT b.*, u.first_name, u.last_name,
           DATE_FORMAT(b.posted_at, '%Y-%m-%d %H:%i:%s') as posted_at 
    FROM business_demand b
    JOIN users u ON b.created_by = u.id
    WHERE b.id = ?
  `;

  connection.query(query, [id], (err, results) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({
        error: 'Internal server error'
      });
    }

    if (results.length === 0) {
      return res.status(404).json({
        error: 'Business demand not found'
      });
    }

    res.json({
      data: results[0]
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
    SELECT p.*, u.first_name, u.last_name,
           COALESCE(r.reply_count, 0) as reply_count
    FROM posts p
    JOIN users u ON p.created_by = u.id
    LEFT JOIN (
      SELECT of_post, COUNT(*) as reply_count
      FROM post_replies
      GROUP BY of_post
    ) r ON p.id = r.of_post
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
    case 'replies':
      query += ` ORDER BY reply_count DESC, p.posted_at DESC`;
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

router.post('/create-post-reply', (req, res) => {
  const { of_post, replied_by, content } = req.body;

  // Input validation
  if (!of_post || !replied_by || !content) {
    return res.status(400).json({
      error: 'All fields (of_post, replied_by, content) are required'
    });
  }

  // Validate content length
  if (content.length > 2000) {
    return res.status(400).json({
      error: 'Content must not exceed 2000 characters'
    });
  }

  // Validate that post_id and user_id are positive integers
  if (!Number.isInteger(of_post) || of_post <= 0) {
    return res.status(400).json({
      error: 'Invalid post ID'
    });
  }

  if (!Number.isInteger(replied_by) || replied_by <= 0) {
    return res.status(400).json({
      error: 'Invalid user ID'
    });
  }

  const query = `
    INSERT INTO post_replies (of_post, replied_by, content)
    VALUES (?, ?, ?)
  `;

  connection.query(query,
    [of_post, replied_by, content],
    (err, results) => {
      if (err) {
        // Handle foreign key constraint violations
        if (err.code === 'ER_NO_REFERENCED_ROW_2') {
          return res.status(400).json({
            error: 'Invalid post ID or user ID provided'
          });
        }
        console.error('Error creating reply:', err);
        return res.status(500).json({
          error: 'Internal Server Error'
        });
      }
      res.status(201).json({
        message: 'Reply created successfully',
        replyId: results.insertId
      });
    }
  );
});

router.get('/posts/:id', (req, res) => {
  const { id } = req.params;

  if (!id || isNaN(id)) {
    return res.status(400).json({
      error: 'Valid post ID is required'
    });
  }

  // First query to get post details
  const postQuery = `
    SELECT p.*, 
           u.first_name, u.last_name,
           DATE_FORMAT(p.posted_at, '%Y-%m-%d %H:%i:%s') as posted_at,
           COUNT(pr.id) as reply_count
    FROM posts p
    JOIN users u ON p.created_by = u.id
    LEFT JOIN post_replies pr ON p.id = pr.of_post
    WHERE p.id = ?
    GROUP BY p.id
  `;

  // Second query to get all replies with user details
  const repliesQuery = `
    SELECT pr.*,
           u.first_name, u.last_name,
           DATE_FORMAT(pr.posted_at, '%Y-%m-%d %H:%i:%s') as posted_at
    FROM post_replies pr
    JOIN users u ON pr.replied_by = u.id
    WHERE pr.of_post = ?
    ORDER BY pr.posted_at ASC
  `;

  // Execute both queries in parallel using Promise.all
  Promise.all([
    new Promise((resolve, reject) => {
      connection.query(postQuery, [id], (err, results) => {
        if (err) reject(err);
        resolve(results);
      });
    }),
    new Promise((resolve, reject) => {
      connection.query(repliesQuery, [id], (err, results) => {
        if (err) reject(err);
        resolve(results);
      });
    })
  ])
    .then(([postResults, repliesResults]) => {
      if (postResults.length === 0) {
        return res.status(404).json({
          error: 'Post not found'
        });
      }

      res.json({
        message: 'Post details retrieved successfully',
        data: {
          post: postResults[0],
          replies: repliesResults
        }
      });
    })
    .catch(err => {
      console.error('Error fetching post details:', err);
      res.status(500).json({
        error: 'Internal Server Error'
      });
    });
});

// Add these routes before the export default router

router.put('/posts/:id', (req, res) => {
  const { id } = req.params;
  const { title, description, keywords } = req.body;

  // Input validation
  if (!title && !description && !keywords) {
    return res.status(400).json({
      error: 'At least one field (title, description, or keywords) must be provided'
    });
  }

  // Validate string lengths
  if (title && title.length > 200) {
    return res.status(400).json({
      error: 'Title must not exceed 200 characters'
    });
  }

  if (description && description.length > 2000) {
    return res.status(400).json({
      error: 'Description must not exceed 2000 characters'
    });
  }

  if (keywords && keywords.length > 500) {
    return res.status(400).json({
      error: 'Keywords must not exceed 500 characters'
    });
  }

  // Build dynamic update query
  let updateFields = [];
  const queryParams = [];

  if (title) {
    updateFields.push('title = ?');
    queryParams.push(title);
  }
  if (description) {
    updateFields.push('description = ?');
    queryParams.push(description);
  }
  if (keywords) {
    updateFields.push('keywords = ?');
    queryParams.push(keywords);
  }

  // Add id as last parameter
  queryParams.push(id);

  const query = `
    UPDATE posts 
    SET ${updateFields.join(', ')}
    WHERE id = ?
  `;

  connection.query(query, queryParams, (err, results) => {
    if (err) {
      console.error('Error updating post:', err);
      return res.status(500).json({
        error: 'Internal Server Error'
      });
    }

    if (results.affectedRows === 0) {
      return res.status(404).json({
        error: 'Post not found'
      });
    }

    res.json({
      message: 'Post updated successfully'
    });
  });
});

router.put('/post-replies/:id', (req, res) => {
  const { id } = req.params;
  const { content } = req.body;

  // Input validation
  if (!content) {
    return res.status(400).json({
      error: 'Content is required'
    });
  }

  // Validate content length
  if (content.length > 2000) {
    return res.status(400).json({
      error: 'Content must not exceed 2000 characters'
    });
  }

  const query = `
    UPDATE post_replies 
    SET content = ?
    WHERE id = ?
  `;

  connection.query(query, [content, id], (err, results) => {
    if (err) {
      console.error('Error updating reply:', err);
      return res.status(500).json({
        error: 'Internal Server Error'
      });
    }

    if (results.affectedRows === 0) {
      return res.status(404).json({
        error: 'Reply not found'
      });
    }

    res.json({
      message: 'Reply updated successfully'
    });
  });
});

// Add this route before export default router
router.post('/request-otp', async (req, res) => {
  const { phone_number } = req.body;

  // Input validation
  if (!phone_number) {
    return res.status(400).json({
      error: 'Phone number is required'
    });
  }

  // Validate phone number format (Nepali numbers)
  const phoneRegex = /^[0-9]{10}$/;
  if (!phoneRegex.test(phone_number)) {
    return res.status(400).json({
      error: 'Invalid phone number format. Must be 10 digits.'
    });
  }

  // Generate 6-digit OTP
  const otp = Math.floor(100000 + Math.random() * 900000);

  // Set expiration time (15 minutes from now)
  const expiresAt = new Date();
  expiresAt.setMinutes(expiresAt.getMinutes() + 15);

  try {
    // Store OTP in database
    const storeOtpQuery = `
      INSERT INTO otp_verification (phone_number, otp, expires_at)
      VALUES (?, ?, ?)
      ON DUPLICATE KEY UPDATE
      otp = VALUES(otp),
      expires_at = VALUES(expires_at)
    `;

    await new Promise((resolve, reject) => {
      connection.query(storeOtpQuery, [phone_number, otp, expiresAt], (err) => {
        if (err) reject(err);
        resolve();
      });
    });
    // Send OTP via SparrowSMS
    const smsResponse = await fetch('http://api.sparrowsms.com/v2/sms/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        token: process.env.SPARROW_SMS_TOKEN,
        from: "Demo",
        to: phone_number,
        text: `Your AgriFusion verification code is ${otp}. Valid for 15 minutes. Please donot share.`
      })
    });
    const smsResult = await smsResponse.json();
    console.log(smsResult);
    if (smsResult.response_code !== 200) {
      throw new Error('SMS sending failed');
    }

    res.json({
      message: 'OTP sent successfully',
      expires_at: expiresAt
    });

  } catch (error) {
    console.error('Error in OTP process:', error);
    res.status(500).json({
      error: 'Failed to send OTP'
    });
  }
});

router.post('/verify-otp', async (req, res) => {
  const { phone_number, otp } = req.body;

  // Input validation
  if (!phone_number || !otp) {
    return res.status(400).json({
      error: 'Phone number and OTP are required'
    });
  }

  try {
    // Check OTP validity
    const verifyQuery = `
      SELECT * FROM otp_verification 
      WHERE phone_number = ? 
      AND otp = ? 
      AND expires_at > NOW()
      AND used = 0
      LIMIT 1
    `;
    console.log(phone_number)

    const otpResult = await new Promise((resolve, reject) => {
      connection.query(verifyQuery, [phone_number, otp], (err, results) => {
        if (err) reject(err);
        resolve(results);
      });
    });

    if (otpResult.length === 0) {
      return res.status(400).json({
        error: 'Invalid or expired OTP'
      });
    }

    // Mark OTP as used
    await new Promise((resolve, reject) => {
      connection.query(
        'UPDATE otp_verification SET used = 1 WHERE phone_number = ? AND otp = ?',
        [phone_number, otp],
        (err) => {
          if (err) reject(err);
          resolve();
        }
      );
    });

    // Check if user exists
    const userQuery = `
      SELECT id, first_name, last_name 
      FROM users 
      WHERE contact_num = ?
      LIMIT 1
    `;

    const userResult = await new Promise((resolve, reject) => {
      connection.query(userQuery, [phone_number], (err, results) => {
        if (err) reject(err);
        resolve(results);
      });
    });

    if (userResult.length === 0) {
      // User is not registered
      return res.json({
        message: 'Phone number verified but user is not registered',
        verified: true,
        isRegistered: false
      });
    }

    // User is registered, generate JWT token
    const user = userResult[0];
    const token = jwt.sign(
      { id: user.id, first_name: user.first_name, last_name: user.last_name },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );
    res.json({
      message: 'OTP verified successfully',
      verified: true,
      isRegistered: true,
      user: user,
      token: token
    });

  } catch (error) {
    console.error('Error in OTP verification:', error);
    res.status(500).json({
      error: 'Failed to verify OTP'
    });
  }
});



export default router;