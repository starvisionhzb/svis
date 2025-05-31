const express = require('express');
const router = express.Router();
const db = require('../config/db'); // Path to your db connection module

// POST a new enquiry
// Route: POST /api/enquiries
router.post('/', async (req, res) => {
    try {
        const { name, email, phone, service_id, message } = req.body;

        // Basic validation
        if (!name || !email || !message) {
            return res.status(400).json({ message: 'Missing required fields: name, email, message' });
        }
        
        // Validate email format (simple regex)
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({ message: 'Invalid email format' });
        }

        // service_id can be null if it's a general enquiry
        const finalServiceId = service_id ? parseInt(service_id) : null;

        const [result] = await db.query(
            'INSERT INTO enquiries (name, email, phone, service_id, message) VALUES (?, ?, ?, ?, ?)',
            [name, email, phone, finalServiceId, message]
        );
        
        res.status(201).json({ 
            id: result.insertId, 
            name, 
            email, 
            phone, 
            service_id: finalServiceId, 
            message, 
            message: 'Enquiry submitted successfully!' 
        });
    } catch (error) {
        console.error('Error submitting enquiry:', error);
        // Check for foreign key constraint error if service_id is invalid
        if (error.code === 'ER_NO_REFERENCED_ROW_2') {
             return res.status(400).json({ message: 'Invalid service ID provided.' });
        }
        res.status(500).json({ message: 'Error submitting enquiry to database' });
    }
});

module.exports = router;
