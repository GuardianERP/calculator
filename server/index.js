const express = require('express');
const cors = require('cors');

const app = express();
const PORT = 5000;

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
        // Note: In a real production app, use a proper math library like mathjs
        const result = eval(expression);
        
        res.json({ result });
    } catch (error) {
        res.status(400).json({ error: 'Invalid expression' });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
