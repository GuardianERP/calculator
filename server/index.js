const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.post('/calculate', (req, res) => {
    const { expression } = req.body;
    
    try {
        // Basic security: only allow numbers and operators
        if (!/^[0-9+\-*/().\s]+$/.test(expression)) {
            return res.status(400).json({ error: 'Invalid characters in expression' });
        }
        
        // Evaluate the expression
        const result = eval(expression);
        
        res.json({ result });
    } catch (error) {
        res.status(400).json({ error: 'Invalid expression' });
    }
});

// Serve client dist static files
app.use(express.static(path.join(__dirname, '../client/dist')));

// Fallback all other GET requests to the React app
app.get('/*splat', (req, res) => {
    res.sendFile(path.join(__dirname, '../client/dist/index.html'));
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

