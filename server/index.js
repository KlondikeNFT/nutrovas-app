const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const sqlite3 = require('sqlite3').verbose();
const { body, validationResult } = require('express-validator');
const axios = require('axios');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Database setup
const db = new sqlite3.Database('./users.db', (err) => {
  if (err) {
    console.error('Error opening database:', err.message);
  } else {
    console.log('Connected to SQLite database');
    createTables();
  }
});

// Create tables
function createTables() {
  const createUsersTable = `
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT UNIQUE NOT NULL,
      email TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      firstName TEXT NOT NULL,
      lastName TEXT NOT NULL,
      dateOfBirth TEXT NOT NULL,
      height TEXT,
      weight TEXT,
      sports TEXT NOT NULL,
      allergies TEXT NOT NULL,
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
      updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `;

  db.run(createUsersTable, (err) => {
    if (err) {
      console.error('Error creating users table:', err.message);
    } else {
      console.log('Users table created or already exists');
      
      // Add height and weight columns if they don't exist (for existing databases)
      db.run('ALTER TABLE users ADD COLUMN height TEXT', (err) => {
        if (err && !err.message.includes('duplicate column name')) {
          console.error('Error adding height column:', err.message);
        }
      });
      
      db.run('ALTER TABLE users ADD COLUMN weight TEXT', (err) => {
        if (err && !err.message.includes('duplicate column name')) {
          console.error('Error adding weight column:', err.message);
        }
      });
    }
  });

  // Create user pantry table
  const createPantryTable = `
    CREATE TABLE IF NOT EXISTS user_pantry (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      userId INTEGER NOT NULL,
      productId INTEGER NOT NULL,
      productName TEXT NOT NULL,
      brandName TEXT,
      upcSku TEXT,
      servingSize TEXT,
      quantity INTEGER DEFAULT 1,
      addedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (userId) REFERENCES users (id),
      UNIQUE(userId, productId)
    )
  `;

  db.run(createPantryTable, (err) => {
    if (err) {
      console.error('Error creating user_pantry table:', err.message);
    } else {
      console.log('User pantry table created or already exists');
    }
  });

  // Create custom supplements table
  const createCustomSupplementsTable = `
    CREATE TABLE IF NOT EXISTS custom_supplements (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      userId INTEGER NOT NULL,
      productName TEXT NOT NULL,
      brandName TEXT,
      upcSku TEXT,
      servingSize TEXT,
      productType TEXT,
      description TEXT,
      addedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (userId) REFERENCES users (id)
    )
  `;

  db.run(createCustomSupplementsTable, (err) => {
    if (err) {
      console.error('Error creating custom_supplements table:', err.message);
    } else {
      console.log('Custom supplements table created or already exists');
    }
  });

  // Create supplement tracking table
  const createSupplementTrackingTable = `
    CREATE TABLE IF NOT EXISTS supplement_tracking (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      userId INTEGER NOT NULL,
      supplementId INTEGER NOT NULL,
      supplementName TEXT NOT NULL,
      brandName TEXT,
      dosage TEXT NOT NULL,
      unit TEXT NOT NULL,
      takenAt DATETIME NOT NULL,
      notes TEXT,
      source TEXT DEFAULT 'pantry',
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (userId) REFERENCES users (id)
    )
  `;

  db.run(createSupplementTrackingTable, (err) => {
    if (err) {
      console.error('Error creating supplement_tracking table:', err.message);
    } else {
      console.log('Supplement tracking table created or already exists');
    }
  });

  // Create Strava connections table
  const createStravaConnectionsTable = `
    CREATE TABLE IF NOT EXISTS strava_connections (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      userId INTEGER NOT NULL,
      stravaId INTEGER UNIQUE NOT NULL,
      accessToken TEXT NOT NULL,
      refreshToken TEXT NOT NULL,
      expiresAt DATETIME NOT NULL,
      athleteData TEXT,
      connectedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
      lastSyncAt DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (userId) REFERENCES users (id)
    )
  `;

  db.run(createStravaConnectionsTable, (err) => {
    if (err) {
      console.error('Error creating strava_connections table:', err.message);
    } else {
      console.log('Strava connections table created or already exists');
    }
  });

  // Create user activities table
  const createUserActivitiesTable = `
    CREATE TABLE IF NOT EXISTS user_activities (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      userId INTEGER NOT NULL,
      stravaActivityId INTEGER UNIQUE NOT NULL,
      activityType TEXT NOT NULL,
      activityName TEXT,
      distance REAL,
      distanceUnit TEXT DEFAULT 'meters',
      duration INTEGER,
      startDate DATETIME NOT NULL,
      averageSpeed REAL,
      maxSpeed REAL,
      averageHeartRate REAL,
      maxHeartRate REAL,
      averagePower REAL,
      maxPower REAL,
      calories INTEGER,
      elevationGain REAL,
      description TEXT,
      rawData TEXT,
      syncedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (userId) REFERENCES users (id)
    )
  `;

  db.run(createUserActivitiesTable, (err) => {
    if (err) {
      console.error('Error creating user_activities table:', err.message);
    } else {
      console.log('User activities table created or already exists');
    }
  });
}

// Validation middleware
const validateSignup = [
  body('username')
    .isLength({ min: 3 })
    .withMessage('Username must be at least 3 characters long')
    .matches(/^[a-zA-Z0-9_]+$/)
    .withMessage('Username can only contain letters, numbers, and underscores'),
  body('email')
    .isEmail()
    .withMessage('Please provide a valid email address'),
  body('password')
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters long'),
  body('firstName')
    .notEmpty()
    .withMessage('First name is required'),
  body('lastName')
    .notEmpty()
    .withMessage('Last name is required'),
  body('dateOfBirth')
    .notEmpty()
    .withMessage('Date of birth is required'),
  body('sports')
    .isArray({ min: 1 })
    .withMessage('At least one sport must be selected'),
  body('allergies')
    .isArray()
    .withMessage('Allergies must be an array')
];

// Routes
app.post('/api/auth/signup', validateSignup, async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        message: 'Validation failed', 
        errors: errors.array() 
      });
    }

    const {
      username,
      email,
      password,
      firstName,
      lastName,
      dateOfBirth,
      sports,
      allergies
    } = req.body;

    // Check if user already exists
    db.get(
      'SELECT id FROM users WHERE username = ? OR email = ?',
      [username, email],
      async (err, row) => {
        if (err) {
          console.error('Database error:', err);
          return res.status(500).json({ message: 'Database error' });
        }

        if (row) {
          return res.status(400).json({ 
            message: 'Username or email already exists' 
          });
        }

        // Hash password
        const saltRounds = 12;
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        // Insert new user
        const insertUser = `
          INSERT INTO users (username, email, password, firstName, lastName, dateOfBirth, sports, allergies)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        `;

        db.run(insertUser, [
          username,
          email,
          hashedPassword,
          firstName,
          lastName,
          dateOfBirth,
          JSON.stringify(sports),
          JSON.stringify(allergies)
        ], function(err) {
          if (err) {
            console.error('Error inserting user:', err);
            return res.status(500).json({ message: 'Error creating user' });
          }

          res.status(201).json({
            message: 'User created successfully',
            userId: this.lastID
          });
        });
      }
    );

  } catch (error) {
    console.error('Server error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Login endpoint
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    // Find user by email
    db.get(
      'SELECT * FROM users WHERE email = ?',
      [email],
      async (err, user) => {
        if (err) {
          console.error('Database error:', err);
          return res.status(500).json({ message: 'Database error' });
        }

        if (!user) {
          return res.status(401).json({ message: 'Invalid email or password' });
        }

        // Check password
        const isValidPassword = await bcrypt.compare(password, user.password);
        if (!isValidPassword) {
          return res.status(401).json({ message: 'Invalid email or password' });
        }

        // Create a simple token (in production, use JWT)
        const token = Buffer.from(`${user.id}:${Date.now()}`).toString('base64');

        // Parse JSON fields
        user.sports = JSON.parse(user.sports);
        user.allergies = JSON.parse(user.allergies);

        res.json({
          message: 'Login successful',
          token,
          user: {
            id: user.id,
            username: user.username,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            dateOfBirth: user.dateOfBirth,
            sports: user.sports,
            allergies: user.allergies
          }
        });
      }
    );

  } catch (error) {
    console.error('Server error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Get user profile by token
app.get('/api/auth/profile', (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'No token provided' });
    }

    const token = authHeader.substring(7); // Remove 'Bearer ' prefix
    
    // Decode the simple token (in production, verify JWT)
    const decoded = Buffer.from(token, 'base64').toString('utf-8');
    const [userId] = decoded.split(':');
    
    if (!userId || isNaN(userId)) {
      return res.status(401).json({ message: 'Invalid token' });
    }

    // Get user by ID
    db.get(
      'SELECT id, username, email, firstName, lastName, dateOfBirth, sports, allergies, createdAt FROM users WHERE id = ?',
      [userId],
      (err, row) => {
        if (err) {
          console.error('Database error:', err);
          return res.status(500).json({ message: 'Database error' });
        }

        if (!row) {
          return res.status(404).json({ message: 'User not found' });
        }

        // Parse JSON fields
        row.sports = JSON.parse(row.sports);
        row.allergies = JSON.parse(row.allergies);

        res.json({
          user: {
            id: row.id,
            username: row.username,
            email: row.email,
            firstName: row.firstName,
            lastName: row.lastName,
            dateOfBirth: row.dateOfBirth,
            height: row.height,
            weight: row.weight,
            sports: row.sports,
            allergies: row.allergies
          }
        });
      }
    );

  } catch (error) {
    console.error('Server error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Update user profile
app.put('/api/auth/profile', (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'No token provided' });
    }

    const token = authHeader.substring(7); // Remove 'Bearer ' prefix
    
    // Decode the simple token (in production, verify JWT)
    const decoded = Buffer.from(token, 'base64').toString('utf-8');
    const [userId] = decoded.split(':');
    
    if (!userId || isNaN(userId)) {
      return res.status(401).json({ message: 'Invalid token' });
    }

    const { firstName, lastName, dateOfBirth, height, weight, sports, allergies } = req.body;

    // Validate required fields
    if (!firstName || !lastName || !dateOfBirth || !sports || !allergies) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    // Update user profile
    db.run(
      `UPDATE users 
       SET firstName = ?, lastName = ?, dateOfBirth = ?, height = ?, weight = ?, 
           sports = ?, allergies = ?, updatedAt = CURRENT_TIMESTAMP 
       WHERE id = ?`,
      [firstName, lastName, dateOfBirth, height || null, weight || null, 
       JSON.stringify(sports), JSON.stringify(allergies), userId],
      function(err) {
        if (err) {
          console.error('Database error:', err);
          return res.status(500).json({ message: 'Database error' });
        }

        if (this.changes === 0) {
          return res.status(404).json({ message: 'User not found' });
        }

        res.json({ message: 'Profile updated successfully' });
      }
    );

  } catch (error) {
    console.error('Server error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Get user profile by ID (existing endpoint)
app.get('/api/users/:id', (req, res) => {
  const userId = req.params.id;
  
  db.get(
    'SELECT id, username, email, firstName, lastName, dateOfBirth, height, weight, sports, allergies, createdAt FROM users WHERE id = ?',
    [userId],
    (err, row) => {
      if (err) {
        console.error('Database error:', err);
        return res.status(500).json({ message: 'Database error' });
      }

      if (!row) {
        return res.status(404).json({ message: 'User not found' });
      }

      // Parse JSON fields
      row.sports = JSON.parse(row.sports);
      row.allergies = JSON.parse(row.allergies);

      res.json(row);
    }
  );
});

// Search DSLD database
app.get('/api/dsld/search', (req, res) => {
  try {
    const { query } = req.query;
    
    if (!query || query.trim().length < 2) {
      return res.status(400).json({ message: 'Search query must be at least 2 characters long' });
    }

    const fs = require('fs');
    const path = require('path');
    const dsldDir = path.join(__dirname, '../DSLD-full-database-JSON');
    
    if (!fs.existsSync(dsldDir)) {
      return res.status(500).json({ message: 'DSLD database not found' });
    }

    const searchResults = [];
    const searchTerm = query.toLowerCase();
    
    // Read all JSON files in the DSLD directory
    const files = fs.readdirSync(dsldDir).filter(file => file.endsWith('.json'));
    
    for (const file of files) {
      try {
        const filePath = path.join(dsldDir, file);
        const content = fs.readFileSync(filePath, 'utf8');
        const product = JSON.parse(content);
        
        // Search in product name, brand name, and UPC
        const productName = (product.fullName || '').toLowerCase();
        const brandName = (product.brandName || '').toLowerCase();
        const upcSku = (product.upcSku || '').toLowerCase();
        
        if (productName.includes(searchTerm) || 
            brandName.includes(searchTerm) || 
            upcSku.includes(searchTerm)) {
          
          searchResults.push({
            id: product.id,
            fullName: product.fullName,
            brandName: product.brandName,
            upcSku: product.upcSku,
            servingSize: product.servingSizes?.[0]?.unit || 'N/A',
            productType: product.productType?.langualCodeDescription || 'N/A'
          });
        }
        
        // Limit results to prevent overwhelming response
        if (searchResults.length >= 20) {
          break;
        }
      } catch (err) {
        console.error(`Error reading file ${file}:`, err);
        continue;
      }
    }
    
    res.json({ results: searchResults });
    
  } catch (error) {
    console.error('Search error:', error);
    res.status(500).json({ message: 'Search failed' });
  }
});

// Get user pantry
app.get('/api/pantry', (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'No token provided' });
    }

    const token = authHeader.substring(7);
    const decoded = Buffer.from(token, 'base64').toString('utf-8');
    const [userId] = decoded.split(':');
    
    if (!userId || isNaN(userId)) {
      return res.status(401).json({ message: 'Invalid token' });
    }

    // Get both pantry items and custom supplements
    db.all(
      `SELECT 
        'pantry' as source,
        id,
        userId,
        productId,
        productName,
        brandName,
        upcSku,
        servingSize,
        quantity,
        addedAt
      FROM user_pantry 
      WHERE userId = ?
      UNION ALL
      SELECT 
        'custom' as source,
        id as productId,
        userId,
        id,
        productName,
        brandName,
        upcSku,
        servingSize,
        1 as quantity,
        addedAt
      FROM custom_supplements 
      WHERE userId = ?
      ORDER BY addedAt DESC`,
      [userId, userId],
      (err, rows) => {
        if (err) {
          console.error('Database error:', err);
          return res.status(500).json({ message: 'Database error' });
        }

        res.json({ pantry: rows });
      }
    );

  } catch (error) {
    console.error('Server error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Add product to user pantry
app.post('/api/pantry/add', (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'No token provided' });
    }

    const token = authHeader.substring(7);
    const decoded = Buffer.from(token, 'base64').toString('utf-8');
    const [userId] = decoded.split(':');
    
    if (!userId || isNaN(userId)) {
      return res.status(401).json({ message: 'Invalid token' });
    }

    const { productId, productName, brandName, upcSku, servingSize, quantity = 1 } = req.body;

    if (!productId || !productName) {
      return res.status(400).json({ message: 'Product ID and name are required' });
    }

    db.run(
      'INSERT OR REPLACE INTO user_pantry (userId, productId, productName, brandName, upcSku, servingSize, quantity) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [userId, productId, productName, brandName, upcSku, servingSize, quantity],
      function(err) {
        if (err) {
          console.error('Database error:', err);
          return res.status(500).json({ message: 'Error adding to pantry' });
        }

        res.status(201).json({
          message: 'Product added to pantry',
          pantryId: this.lastID
        });
      }
    );

  } catch (error) {
    console.error('Server error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Remove product from user pantry
app.delete('/api/pantry/:productId', (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'No token provided' });
    }

    const token = authHeader.substring(7);
    const decoded = Buffer.from(token, 'base64').toString('utf-8');
    const [userId] = decoded.split(':');
    
    if (!userId || isNaN(userId)) {
      return res.status(401).json({ message: 'Invalid token' });
    }

    const { productId } = req.params;
    const { source } = req.query; // 'pantry' or 'custom'

    if (source === 'custom') {
      // Remove from custom supplements
      db.run(
        'DELETE FROM custom_supplements WHERE userId = ? AND id = ?',
        [userId, productId],
        function(err) {
          if (err) {
            console.error('Database error:', err);
            return res.status(500).json({ message: 'Error removing custom supplement' });
          }

          if (this.changes === 0) {
            return res.status(404).json({ message: 'Custom supplement not found' });
          }

          res.json({ message: 'Custom supplement removed' });
        }
      );
    } else {
      // Remove from pantry (default behavior)
      db.run(
        'DELETE FROM user_pantry WHERE userId = ? AND productId = ?',
        [userId, productId],
        function(err) {
          if (err) {
            console.error('Database error:', err);
            return res.status(500).json({ message: 'Error removing from pantry' });
          }

          if (this.changes === 0) {
            return res.status(404).json({ message: 'Product not found in pantry' });
          }

          res.json({ message: 'Product removed from pantry' });
        }
      );
    }

  } catch (error) {
    console.error('Server error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Add custom supplement
app.post('/api/custom-supplements/add', (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'No token provided' });
    }

    const token = authHeader.substring(7);
    const decoded = Buffer.from(token, 'base64').toString('utf-8');
    const [userId] = decoded.split(':');
    
    if (!userId || isNaN(userId)) {
      return res.status(401).json({ message: 'Invalid token' });
    }

    const { productName, brandName, upcSku, servingSize, productType, description } = req.body;

    if (!productName) {
      return res.status(400).json({ message: 'Product name is required' });
    }

    db.run(
      'INSERT INTO custom_supplements (userId, productName, brandName, upcSku, servingSize, productType, description) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [userId, productName, brandName, upcSku, servingSize, productType, description],
      function(err) {
        if (err) {
          console.error('Database error:', err);
          return res.status(500).json({ message: 'Error adding custom supplement' });
        }

        res.status(201).json({
          message: 'Custom supplement added',
          customSupplementId: this.lastID
        });
      }
    );

  } catch (error) {
    console.error('Server error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Get user's custom supplements
app.get('/api/custom-supplements', (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'No token provided' });
    }

    const token = authHeader.substring(7);
    const decoded = Buffer.from(token, 'base64').toString('utf-8');
    const [userId] = decoded.split(':');
    
    if (!userId || isNaN(userId)) {
      return res.status(401).json({ message: 'Invalid token' });
    }

    db.all(
      'SELECT * FROM custom_supplements WHERE userId = ? ORDER BY addedAt DESC',
      [userId],
      (err, rows) => {
        if (err) {
          console.error('Database error:', err);
          return res.status(500).json({ message: 'Error fetching custom supplements' });
        }

        res.json({ customSupplements: rows });
      }
    );

  } catch (error) {
    console.error('Server error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Check for duplicate products
app.post('/api/check-duplicates', (req, res) => {
  try {
    const { productName, brandName, upcSku } = req.body;

    if (!productName) {
      return res.status(400).json({ message: 'Product name is required' });
    }

    let query = '';
    let params = [];

    // If UPC/SKU is provided, search by that first (most reliable)
    if (upcSku && upcSku.trim()) {
      query = `
        SELECT 
          'dsld' as source,
          id as productId,
          fullName as productName,
          brandName,
          upcSku,
          servingSize,
          'DSLD Database' as productType
        FROM dsld_products 
        WHERE upcSku = ?
        UNION ALL
        SELECT 
          'custom' as source,
          id as productId,
          productName,
          brandName,
          upcSku,
          servingSize,
          productType
        FROM custom_supplements 
        WHERE upcSku = ?
        ORDER BY source DESC
      `;
      params = [upcSku.trim(), upcSku.trim()];
    } else {
      // Search by product name and brand name (fuzzy match)
      query = `
        SELECT 
          'dsld' as source,
          id as productId,
          fullName as productName,
          brandName,
          upcSku,
          servingSize,
          'DSLD Database' as productType
        FROM dsld_products 
        WHERE LOWER(fullName) LIKE LOWER(?) 
        ${brandName ? 'AND LOWER(brandName) LIKE LOWER(?)' : ''}
        UNION ALL
        SELECT 
          'custom' as source,
          id as productId,
          productName,
          brandName,
          upcSku,
          servingSize,
          productType
        FROM custom_supplements 
        WHERE LOWER(productName) LIKE LOWER(?) 
        ${brandName ? 'AND LOWER(brandName) LIKE LOWER(?)' : ''}
        ORDER BY source DESC
      `;
      
      const namePattern = `%${productName.trim()}%`;
      const brandPattern = brandName ? `%${brandName.trim()}%` : null;
      
      if (brandName) {
        params = [namePattern, brandPattern, namePattern, brandPattern];
      } else {
        params = [namePattern, namePattern];
      }
    }

    db.all(query, params, (err, rows) => {
      if (err) {
        console.error('Database error:', err);
        return res.status(500).json({ message: 'Error checking for duplicates' });
      }

      // Filter results to show only close matches
      const duplicates = rows.filter(row => {
        const nameSimilarity = calculateSimilarity(
          productName.toLowerCase(), 
          row.productName.toLowerCase()
        );
        
        // If UPC/SKU matches exactly, it's definitely a duplicate
        if (upcSku && upcSku.trim() && row.upcSku && 
            upcSku.trim().toLowerCase() === row.upcSku.toLowerCase()) {
          return true;
        }
        
        // If name similarity is high (>80%) and brand matches, it's likely a duplicate
        if (nameSimilarity > 0.8) {
          if (brandName && row.brandName) {
            const brandSimilarity = calculateSimilarity(
              brandName.toLowerCase(), 
              row.brandName.toLowerCase()
            );
            return brandSimilarity > 0.7;
          }
          return true;
        }
        
        return false;
      });

      res.json({ 
        hasDuplicates: duplicates.length > 0,
        duplicates: duplicates,
        message: duplicates.length > 0 ? 
          `Found ${duplicates.length} similar product(s)` : 
          'No duplicates found'
      });
    });

  } catch (error) {
    console.error('Server error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Helper function to calculate string similarity (Levenshtein distance based)
function calculateSimilarity(str1, str2) {
  if (str1 === str2) return 1.0;
  
  const len1 = str1.length;
  const len2 = str2.length;
  
  if (len1 === 0) return len2 === 0 ? 1.0 : 0.0;
  if (len2 === 0) return 0.0;
  
  const matrix = [];
  
  for (let i = 0; i <= len2; i++) {
    matrix[i] = [i];
  }
  
  for (let j = 0; j <= len1; j++) {
    matrix[0][j] = j;
  }
  
  for (let i = 1; i <= len2; i++) {
    for (let j = 1; j <= len1; j++) {
      if (str2.charAt(i - 1) === str1.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1,
          matrix[i][j - 1] + 1,
          matrix[i - 1][j] + 1
        );
      }
    }
  }
  
  const distance = matrix[len2][len1];
  const maxLen = Math.max(len1, len2);
  
  return 1 - (distance / maxLen);
}

// Supplement tracking endpoints
app.post('/api/supplement-tracking/log', (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'No token provided' });
    }

    const token = authHeader.substring(7);
    const decoded = Buffer.from(token, 'base64').toString('utf-8');
    const [userId] = decoded.split(':');
    
    if (!userId || isNaN(userId)) {
      return res.status(401).json({ message: 'Invalid token' });
    }

    const { 
      supplementId, 
      supplementName, 
      brandName, 
      dosage, 
      unit, 
      takenAt, 
      notes, 
      source = 'pantry' 
    } = req.body;

    if (!supplementName || !dosage || !unit || !takenAt) {
      return res.status(400).json({ 
        message: 'Supplement name, dosage, unit, and taken time are required' 
      });
    }

    db.run(
      `INSERT INTO supplement_tracking 
       (userId, supplementId, supplementName, brandName, dosage, unit, takenAt, notes, source) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [userId, supplementId, supplementName, brandName, dosage, unit, takenAt, notes, source],
      function(err) {
        if (err) {
          console.error('Database error:', err);
          return res.status(500).json({ message: 'Error logging supplement intake' });
        }

        res.status(201).json({
          message: 'Supplement intake logged successfully',
          trackingId: this.lastID
        });
      }
    );

  } catch (error) {
    console.error('Server error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

app.get('/api/supplement-tracking', (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'No token provided' });
    }

    const token = authHeader.substring(7);
    const decoded = Buffer.from(token, 'base64').toString('utf-8');
    const [userId] = decoded.split(':');
    
    if (!userId || isNaN(userId)) {
      return res.status(401).json({ message: 'Invalid token' });
    }

    const { startDate, endDate } = req.query;
    let query = 'SELECT * FROM supplement_tracking WHERE userId = ?';
    let params = [userId];

    if (startDate && endDate) {
      query += ' AND DATE(takenAt) BETWEEN ? AND ?';
      params.push(startDate, endDate);
    }

    query += ' ORDER BY takenAt DESC';

    db.all(query, params, (err, rows) => {
      if (err) {
        console.error('Database error:', err);
        return res.status(500).json({ message: 'Error fetching supplement tracking data' });
      }

      res.json({ tracking: rows });
    });

  } catch (error) {
    console.error('Server error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

app.delete('/api/supplement-tracking/:trackingId', (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'No token provided' });
    }

    const token = authHeader.substring(7);
    const decoded = Buffer.from(token, 'base64').toString('utf-8');
    const [userId] = decoded.split(':');
    
    if (!userId || isNaN(userId)) {
      return res.status(401).json({ message: 'Invalid token' });
    }

    const { trackingId } = req.params;

    db.run(
      'DELETE FROM supplement_tracking WHERE id = ? AND userId = ?',
      [trackingId, userId],
      function(err) {
        if (err) {
          console.error('Database error:', err);
          return res.status(500).json({ message: 'Error deleting supplement tracking entry' });
        }

        if (this.changes === 0) {
          return res.status(404).json({ message: 'Tracking entry not found' });
        }

        res.json({ message: 'Tracking entry deleted successfully' });
      }
    );

  } catch (error) {
    console.error('Server error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Server is running' });
});

// Strava OAuth endpoints
app.get('/api/auth/strava/connect', (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'No token provided' });
    }

    const token = authHeader.substring(7);
    const decoded = Buffer.from(token, 'base64').toString('utf-8');
    const [userId] = decoded.split(':');
    
    if (!userId || isNaN(userId)) {
      return res.status(401).json({ message: 'Invalid token' });
    }

    const clientId = process.env.STRAVA_CLIENT_ID || 'your_client_id';
    const redirectUri = process.env.STRAVA_REDIRECT_URI || 'http://localhost:3001/api/auth/strava/callback';
    
    const stravaAuthUrl = `https://www.strava.com/oauth/authorize?client_id=${clientId}&response_type=code&redirect_uri=${redirectUri}&scope=read,activity:read_all&state=${userId}`;
    
    res.json({ authUrl: stravaAuthUrl });
  } catch (error) {
    console.error('Strava connect error:', error);
    res.status(500).json({ message: 'Error generating Strava auth URL' });
  }
});

app.get('/api/auth/strava/callback', async (req, res) => {
  try {
    const { code, state } = req.query;
    
    if (!code || !state) {
      return res.status(400).json({ message: 'Missing authorization code or state' });
    }

    const userId = parseInt(state);
    
    // Exchange code for access token
    const tokenResponse = await axios.post('https://www.strava.com/oauth/token', {
      client_id: process.env.STRAVA_CLIENT_ID || 'your_client_id',
      client_secret: process.env.STRAVA_CLIENT_SECRET || 'your_client_secret',
      code,
      grant_type: 'authorization_code'
    });

    const { access_token, refresh_token, expires_at, athlete } = tokenResponse.data;
    
    // Save connection to database
    db.run(
      `INSERT OR REPLACE INTO strava_connections 
       (userId, stravaId, accessToken, refreshToken, expiresAt, athleteData) 
       VALUES (?, ?, ?, ?, ?, ?)`,
      [userId, athlete.id, access_token, refresh_token, new Date(expires_at * 1000).toISOString(), JSON.stringify(athlete)],
      function(err) {
        if (err) {
          console.error('Database error saving Strava connection:', err);
          return res.status(500).json({ message: 'Error saving Strava connection' });
        }
        
        // Redirect to frontend with success
        res.redirect(`http://localhost:3000/dashboard?strava=connected`);
      }
    );
  } catch (error) {
    console.error('Strava callback error:', error);
    res.redirect(`http://localhost:3000/dashboard?strava=error`);
  }
});

// Get user's Strava connection status
app.get('/api/auth/strava/status', (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'No token provided' });
    }

    const token = authHeader.substring(7);
    const decoded = Buffer.from(token, 'base64').toString('utf-8');
    const [userId] = decoded.split(':');
    
    if (!userId || isNaN(userId)) {
      return res.status(401).json({ message: 'Invalid token' });
    }

    db.get(
      'SELECT * FROM strava_connections WHERE userId = ?',
      [userId],
      (err, row) => {
        if (err) {
          console.error('Database error:', err);
          return res.status(500).json({ message: 'Error checking Strava connection' });
        }

        if (row) {
          const isExpired = new Date(row.expiresAt) < new Date();
          res.json({
            connected: true,
            expired: isExpired,
            athleteData: JSON.parse(row.athleteData),
            lastSync: row.lastSyncAt
          });
        } else {
          res.json({ connected: false });
        }
      }
    );
  } catch (error) {
    console.error('Strava status error:', error);
    res.status(500).json({ message: 'Error checking Strava status' });
  }
});

// Sync user's Strava activities
app.post('/api/auth/strava/sync', async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'No token provided' });
    }

    const token = authHeader.substring(7);
    const decoded = Buffer.from(token, 'base64').toString('utf-8');
    const [userId] = decoded.split(':');
    
    if (!userId || isNaN(userId)) {
      return res.status(401).json({ message: 'Invalid token' });
    }

    // Get user's Strava connection
    db.get(
      'SELECT * FROM strava_connections WHERE userId = ?',
      [userId],
      async (err, connection) => {
        if (err) {
          console.error('Database error:', err);
          return res.status(500).json({ message: 'Error getting Strava connection' });
        }

        if (!connection) {
          return res.status(400).json({ message: 'No Strava connection found' });
        }

        // Check if token is expired and refresh if needed
        let accessToken = connection.accessToken;
        if (new Date(connection.expiresAt) < new Date()) {
          try {
            const refreshResponse = await axios.post('https://www.strava.com/oauth/token', {
              client_id: process.env.STRAVA_CLIENT_ID || 'your_client_id',
              client_secret: process.env.STRAVA_CLIENT_SECRET || 'your_client_secret',
              grant_type: 'refresh_token',
              refresh_token: connection.refreshToken
            });

            const { access_token, refresh_token, expires_at } = refreshResponse.data;
            accessToken = access_token;
            
            // Update tokens in database
            db.run(
              'UPDATE strava_connections SET accessToken = ?, refreshToken = ?, expiresAt = ? WHERE userId = ?',
              [access_token, refresh_token, new Date(expires_at * 1000).toISOString(), userId]
            );
          } catch (refreshError) {
            console.error('Token refresh error:', refreshError);
            return res.status(401).json({ message: 'Error refreshing Strava token' });
          }
        }

        // Fetch activities from Strava
        try {
          const activitiesResponse = await axios.get('https://www.strava.com/api/v3/athlete/activities', {
            headers: { 'Authorization': `Bearer ${accessToken}` },
            params: { per_page: 200, page: 1 }
          });

          const activities = activitiesResponse.data;
          let syncedCount = 0;

          // Process and save each activity
          for (const activity of activities) {
            const activityData = {
              userId,
              stravaActivityId: activity.id,
              activityType: activity.type,
              activityName: activity.name,
              distance: activity.distance,
              distanceUnit: 'meters',
              duration: activity.moving_time,
              startDate: new Date(activity.start_date).toISOString(),
              averageSpeed: activity.average_speed,
              maxSpeed: activity.max_speed,
              averageHeartRate: activity.average_heartrate,
              maxHeartRate: activity.max_heartrate,
              averagePower: activity.average_watts,
              maxPower: activity.max_watts,
              calories: activity.calories,
              elevationGain: activity.total_elevation_gain,
              description: activity.description,
              rawData: JSON.stringify(activity)
            };

            // Insert or update activity
            db.run(
              `INSERT OR REPLACE INTO user_activities 
               (userId, stravaActivityId, activityType, activityName, distance, distanceUnit, 
                duration, startDate, averageSpeed, maxSpeed, averageHeartRate, maxHeartRate,
                averagePower, maxPower, calories, elevationGain, description, rawData) 
               VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
              Object.values(activityData),
              function(err) {
                if (err) {
                  console.error('Error saving activity:', err);
                } else {
                  syncedCount++;
                }
              }
            );
          }

          // Update last sync time
          db.run(
            'UPDATE strava_connections SET lastSyncAt = ? WHERE userId = ?',
            [new Date().toISOString(), userId]
          );

          res.json({ 
            message: 'Activities synced successfully', 
            syncedCount,
            totalActivities: activities.length
          });
        } catch (stravaError) {
          console.error('Strava API error:', stravaError);
          res.status(500).json({ message: 'Error fetching activities from Strava' });
        }
      }
    );
  } catch (error) {
    console.error('Strava sync error:', error);
    res.status(500).json({ message: 'Error syncing Strava activities' });
  }
});

// Get user's activities
app.get('/api/activities', (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'No token provided' });
    }

    const token = authHeader.substring(7);
    const decoded = Buffer.from(token, 'base64').toString('utf-8');
    const [userId] = decoded.split(':');
    
    if (!userId || isNaN(userId)) {
      return res.status(401).json({ message: 'Invalid token' });
    }

    const { page = 1, limit = 50, activityType } = req.query;
    const offset = (page - 1) * limit;

    let query = 'SELECT * FROM user_activities WHERE userId = ?';
    let params = [userId];

    if (activityType) {
      query += ' AND activityType = ?';
      params.push(activityType);
    }

    query += ' ORDER BY startDate DESC LIMIT ? OFFSET ?';
    params.push(limit, offset);

    db.all(query, params, (err, rows) => {
      if (err) {
        console.error('Database error:', err);
        return res.status(500).json({ message: 'Error fetching activities' });
      }

      res.json({ activities: rows, page, limit, total: rows.length });
    });
  } catch (error) {
    console.error('Activities fetch error:', error);
    res.status(500).json({ message: 'Error fetching activities' });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Health check: http://localhost:${PORT}/api/health`);
});

// Graceful shutdown
process.on('SIGINT', () => {
  console.log('Shutting down server...');
  db.close((err) => {
    if (err) {
      console.error('Error closing database:', err.message);
    } else {
      console.log('Database connection closed');
    }
    process.exit(0);
  });
});
