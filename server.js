// server.js
const express = require('express');
const path = require('path');
const { sendMessageToLLM } = require('./app');

const app = express();
const PORT = 3000;

// Middleware to parse JSON request bodies
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Serve the main HTML file
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Endpoint to handle chat messages
app.post('/api/chat', async (req, res) => {
    const { userMessage, chatHistory } = req.body;

    try {
        const modelResponse = await sendMessageToLLM(chatHistory, userMessage);
        res.json({ response: modelResponse });
    } catch (error) {
        console.error('Error in chat interaction:', error);
        res.status(500).send('Internal Server Error');
    }
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
