const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const { WebSocketServer } = require('ws');
const ChatMessage = require('./models/ChatMessage');

const inappropriateWords = ['fuck', 'shit', 'ass', 'bitch', 'bastard', 'dick', 'clit', 'slut', 'whore', 'twat'];

require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

const server = app.listen(process.env.PORT || 5000, () =>
    console.log(`Server running on port ${process.env.PORT || 5000}`)
);

const wss = new WebSocketServer({ server });

const broadcast = (data) => {
    wss.clients.forEach((client) => {
        if (client.readyState === 1) {
            client.send(JSON.stringify(data));
        }
    });
};

wss.on('connection', (ws) => {
    console.log('New WebSocket connection');
});

app.get('/messages/:room', async (req, res) => {
    const { room } = req.params;

    try {
        const messages = await ChatMessage.find({ room }).sort({ timestamp: 1 });
        res.json(messages);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching messages' });
    }
});

app.post('/messages/:room', async (req, res) => {
    const { room } = req.params;
    const { user, message } = req.body;

    try {
        const containsInappropriateWords = inappropriateWords.some((word) =>
            message.toLowerCase().includes(word)
        );

        if (containsInappropriateWords) {
            return res.status(400).json({ error: 'Your message contains inappropriate language.' });
        }

        const newMessage = new ChatMessage({ room, user, message });
        await newMessage.save();

        broadcast({ room, user, message, timestamp: newMessage.timestamp });

        res.status(201).json(newMessage);
    } catch (error) {
        res.status(500).json({ error: 'Error creating message' });
    }
});
