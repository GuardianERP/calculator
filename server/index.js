const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.post('/calculate', (req, res) => {
    const { expression, isDegree } = req.body;
    
    try {
        if (!expression) {
            return res.status(400).json({ error: 'Expression is empty' });
        }

        // Allow list of mathematical functions and constants
        const allowedTokens = ['sin', 'cos', 'tan', 'asin', 'acos', 'atan', 'log', 'ln', 'sqrt', 'pi', 'e', 'fact'];
        
        let sanitized = expression
            .toLowerCase()
            .replace(/\^/g, '**');

        // Replace allowed words with empty string, using word boundary to avoid partial matches
        allowedTokens.forEach(token => {
            const regex = new RegExp(`\\b${token}\\b`, 'g');
            sanitized = sanitized.replace(regex, '');
        });

        // Strip numbers, basic operators, spaces, parentheses, dots
        sanitized = sanitized
            .replace(/[0-9+\-*/().\s]/g, '')
            .replace(/\*\*/g, ''); // strip leftover exponents

        if (sanitized.length > 0) {
            return res.status(400).json({ error: 'Invalid or unauthorized characters in expression' });
        }

        // Map constants and mathematical functions for eval lexical scope
        const pi = Math.PI;
        const e = Math.E;
        
        const sin = isDegree ? (x) => Math.sin(x * Math.PI / 180) : Math.sin;
        const cos = isDegree ? (x) => Math.cos(x * Math.PI / 180) : Math.cos;
        const tan = isDegree ? (x) => Math.tan(x * Math.PI / 180) : Math.tan;
        const asin = isDegree ? (x) => Math.asin(x) * 180 / Math.PI : Math.asin;
        const acos = isDegree ? (x) => Math.acos(x) * 180 / Math.PI : Math.acos;
        const atan = isDegree ? (x) => Math.atan(x) * 180 / Math.PI : Math.atan;
        
        const log = Math.log10;
        const ln = Math.log;
        const sqrt = Math.sqrt;
        
        const fact = (x) => {
            if (x < 0) return NaN;
            if (x === 0 || x === 1) return 1;
            let res = 1;
            for (let i = 2; i <= Math.floor(x); i++) {
                res *= i;
            }
            return res;
        };

        // Prepare expression by replacing ^ with **
        const evalExpression = expression.toLowerCase().replace(/\^/g, '**');
        
        // Evaluate the expression with safe scope
        const result = eval(evalExpression);
        
        // Format result to prevent floating point issues (e.g. 0.1 + 0.2 = 0.30000000000000004)
        const formattedResult = typeof result === 'number' && !isNaN(result) ? parseFloat(result.toFixed(10)) : result;

        res.json({ result: formattedResult });
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

