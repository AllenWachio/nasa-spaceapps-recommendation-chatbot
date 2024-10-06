const messagesDiv = document.getElementById('messages');
const userInput = document.getElementById('user-input');
const sendButton = document.getElementById('send-button');

// Function to auto-scroll the messages container
const autoScroll = () => {
    messagesDiv.scrollTop = messagesDiv.scrollHeight;
};

// Add an event listener for the send button
sendButton.addEventListener('click', async () => {
    const message = userInput.value; // Get the user's input message
    if (message.trim()) {
        // Append user message to messagesDiv
        const userMessageElement = document.createElement('div');
        userMessageElement.className = 'user-message';
        userMessageElement.textContent = `You: ${message}`;
        messagesDiv.appendChild(userMessageElement);
        
        // Clear the input field
        userInput.value = '';

        try {
            // Send the message to your backend for processing
            const response = await fetch('/api/chat', { // Updated endpoint to match server
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ 
                    userMessage: message, 
                    chatHistory: [] // Send empty chat history or modify as needed
                }),
            });

            if (response.ok) {
                const data = await response.json();
                const modelMessageElement = document.createElement('div');
                modelMessageElement.className = 'model-message';
                modelMessageElement.textContent = `Model: ${data.response}`;
                messagesDiv.appendChild(modelMessageElement);
            } else {
                console.error('Error communicating with the server');
            }
        } catch (error) {
            console.error('Network error:', error);
        }
    }
});

