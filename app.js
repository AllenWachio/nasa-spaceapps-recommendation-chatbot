const { GoogleGenerativeAI } = require('@google/generative-ai');
const { GoogleAIFileManager } = require('@google/generative-ai/server'); // Import GoogleAIFileManager
const fs = require('fs').promises;

// Initialize GoogleGenerativeAI and GoogleAIFileManager with your API_KEY.
const genAI = new GoogleGenerativeAI("AIzaSyDh5WoQgJCHpYmAE7Y7RejpsRSzhimVhFM");
const fileManager = new GoogleAIFileManager("AIzaSyDh5WoQgJCHpYmAE7Y7RejpsRSzhimVhFM"); // Initialize fileManager


// Initialize the generative model (ensure you're using the correct model ID).
const model = genAI.getGenerativeModel({
  model: 'gemini-1.5-flash',
});

// Function to handle PDF upload and analysis
async function analyzePDFFile(filePath) {
    try {
        // Upload the file to Google Generative AI
        const uploadResponse = await fileManager.uploadFile(filePath, {
            mimeType: 'application/pdf',
            displayName: 'Uploaded PDF Document', // Customize based on your needs
        });

        console.log(`Uploaded file ${uploadResponse.file.displayName} as: ${uploadResponse.file.uri}`);

        // Now use the file URI in the request to generate content
        const result = await model.generateContent([
            {
                fileData: {
                    mimeType: uploadResponse.file.mimeType,
                    fileUri: uploadResponse.file.uri,
                },
            },
            { text: 'Can you give recommendatios based on the farming parameters entered for maize. If a value is an anomaly kindly give recommendations based on the data on a way to improve farming practices.' },
        ]);

        // Return the generated content
        return result.response.text();
    } catch (error) {
        console.error('Error analyzing PDF file:', error);
        throw error;
    }
}


async function sendMessageToLLM(chatHistory, userMessage) {
    const chat = model.startChat({ history: chatHistory });
    const result = await chat.sendMessage(userMessage);
    return result.response.text();
}

module.exports = { sendMessageToLLM, analyzePDFFile };



