const express = require('express');
const router = express.Router();
const db = require('../config/db'); // Adjust path based on your db connection module

// GET all services
// Route: GET /api/services
router.get('/', async (req, res) => {
    try {
        const [rows] = await db.query('SELECT id, name, description, price_monthly, speed_mbps, data_allowance_gb FROM services ORDER BY price_monthly ASC');
        res.json(rows);
    } catch (error) {
        console.error('Error fetching services:', error);
        res.status(500).json({ message: 'Error fetching services from database' });
    }
});

// GET a single service by ID
// Route: GET /api/services/:id
router.get('/:id', async (req, res) => {
    try {
        const serviceId = req.params.id;
        const [rows] = await db.query('SELECT id, name, description, price_monthly, speed_mbps, data_allowance_gb FROM services WHERE id = ?', [serviceId]);
        if (rows.length === 0) {
            return res.status(404).json({ message: 'Service not found' });
        }
        res.json(rows[0]);
    } catch (error) {
        console.error('Error fetching service by ID:', error);
        res.status(500).json({ message: 'Error fetching service from database' });
    }
});

// POST a new service (Example for admin or testing - consider auth for real app)
// Route: POST /api/services
router.post('/', async (req, res) => {
    try {
        const { name, description, price_monthly, speed_mbps, data_allowance_gb } = req.body;
        
        // Basic validation
        if (!name || !price_monthly || !speed_mbps) {
            return res.status(400).json({ message: 'Missing required fields: name, price_monthly, speed_mbps' });
        }

        const [result] = await db.query(
            'INSERT INTO services (name, description, price_monthly, speed_mbps, data_allowance_gb) VALUES (?, ?, ?, ?, ?)',
            [name, description, price_monthly, speed_mbps, data_allowance_gb]
        );
        
        res.status(201).json({ id: result.insertId, name, description, price_monthly, speed_mbps, data_allowance_gb });
    } catch (error) {
        console.error('Error adding new service:', error);
        res.status(500).json({ message: 'Error adding new service to database' });
    }
});

module.exports = router;
