const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    res.send('<html><body><h1>Welcome to the US States API</h1><p>Navigate to /states to see the data.</p></body></html>);')
});

module.exports = router;