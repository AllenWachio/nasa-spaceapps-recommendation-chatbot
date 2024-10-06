const messagesDiv = document.getElementById('messages');
const userInput = document.getElementById('user-input');
const sendButton = document.getElementById('send-button');
const fileInput = document.getElementById('file-input'); // File input element
const uploadButton = document.getElementById('upload-button'); // Upload button

// Function to auto-scroll the messages container
const autoScroll = () => {
    messagesDiv.scrollTop = messagesDiv.scrollHeight;
};

// Function to append user messages to the chat
const appendUserMessage = (message) => {
    const userMessageElement = document.createElement('div');
    userMessageElement.className = 'user-message';
    userMessageElement.textContent = `You: ${message}`;
    messagesDiv.appendChild(userMessageElement);
    autoScroll();
};

// Function to append model messages to the chat
const appendModelMessage = (message) => {
    const modelMessageElement = document.createElement('div');
    modelMessageElement.className = 'model-message';
    modelMessageElement.textContent = `Model: ${message}`;
    messagesDiv.appendChild(modelMessageElement);
    autoScroll();
};

// Function to send user input to the server for chat processing
const sendMessageToServer = async (message) => {
    try {
        const response = await fetch('/api/chat', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userMessage: message, chatHistory: [] }),
        });

        if (response.ok) {
            const data = await response.json();
            appendModelMessage(data.response);
        } else {
            console.error('Error communicating with the server');
        }
    } catch (error) {
        console.error('Network error:', error);
    }
};

// Handle message send event
sendButton.addEventListener('click', async () => {
    const message = userInput.value.trim();
    if (message) {
        appendUserMessage(message);
        await sendMessageToServer(message);
        userInput.value = ''; // Clear the input field after sending
    }
});

// Function to upload file to the server and get analyzed response
const uploadFileToServer = async (file) => {
    const formData = new FormData();
    formData.append('file', file);

    try {
        const response = await fetch('/api/upload', {
            method: 'POST',
            body: formData,
        });

        if (response.ok) {
            const data = await response.json();
            appendModelMessage(`PDF Summary: ${data.summary}`);
        } else {
            console.error('Error communicating with the server for file analysis');
        }
    } catch (error) {
        console.error('Network error during file upload:', error);
    }
};

// Handle file upload and analysis
uploadButton.addEventListener('click', async () => {
    const file = fileInput.files[0]; // Get the selected file
    if (file) {
        appendUserMessage(`Uploaded file: ${file.name}`);
        await uploadFileToServer(file);
    } else {
        alert('Please select a PDF file first.');
    }
});
