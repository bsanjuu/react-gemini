const PORT = 8000;
const express = require('express');
const cors = require('cors');
const app = express();
app.use(cors());
app.use(express.json());
require('dotenv').config();

const { GoogleGenerativeAI } = require('@google/generative-ai');
const genAI = new GoogleGenerativeAI({ apiKey: process.env.GOOGLE_GEN_AI_KEY });

app.post('/gemini', async (req, res) => {
    try {
        console.log(req.body.history);
        console.log(req.body.message);

        // Get model
        const chatModel = genAI.getGenerativeModel({ model: 'gemini-pro' });

        // Start the chat session
        const chat = chatModel.startChat({
            history: req.body.history
        });

        // Send the user's message to the model
        const result = await chat.sendMessage(req.body.message);

        // Return the response
        res.json({ response: result.response });
    } catch (error) {
        console.error('Error with Gemini AI:', error);
        res.status(500).send('Internal server error');
    }
});

app.listen(PORT, () => console.log(`Listening on Port ${PORT}`));
