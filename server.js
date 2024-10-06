const express = require('express');
const path = require('path');
const multer = require('multer');
const fs = require('fs');
const { sendMessageToLLM, analyzePDFFile } = require('./app'); // Importing necessary functions

const app = express();
const PORT = 3000;

// Multer configuration for file uploads (store files in 'uploads' directory)
const upload = multer({ dest: 'uploads/' });

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
        // Process user chat message with LLM and respond
        const modelResponse = await sendMessageToLLM(chatHistory, userMessage);
        res.json({ response: modelResponse });
    } catch (error) {
        console.error('Error in chat interaction:', error);
        res.status(500).send('Internal Server Error');
    }
});

// Endpoint to handle file uploads and PDF analysis
app.post('/api/upload', upload.single('file'), async (req, res) => {
    const filePath = req.file.path; // Get the uploaded file path

    try {
        const summary = await analyzePDFFile(filePath); // Analyze the PDF file
        res.json({ summary });
    } catch (error) {
        console.error('Error analyzing file:', error);
        res.status(500).send('Internal Server Error');
    } finally {
        // Optionally delete the file after processing
        fs.unlink(filePath, (err) => {
            if (err) console.error('Error deleting file:', err);
        });
    }
});
// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
