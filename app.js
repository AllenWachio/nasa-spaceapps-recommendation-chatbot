// app.js
const { GoogleGenerativeAI } = require("@google/generative-ai");

// Initialize the API client with your API key
const genAI = new GoogleGenerativeAI("AIzaSyDh5WoQgJCHpYmAE7Y7RejpsRSzhimVhFM");
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

async function sendMessageToLLM(chatHistory, userMessage) {
    const chat = model.startChat({ history: chatHistory });
    const result = await chat.sendMessage(userMessage);
    return result.response.text();
}

module.exports = { sendMessageToLLM };
