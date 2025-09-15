import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ChatRoom = ({ room, userName }) => {
    const [messages, setMessages] = useState([]);
    const [message, setMessage] = useState('');
    const [socket, setSocket] = useState(null);

    useEffect(() => {
        const fetchMessages = async () => {
            try {
                const url = `http://localhost:5000/messages/${room}`;
                const response = await axios.get(url);
                setMessages(response.data);
            } catch (error) {
                console.error('Error fetching messages:', error);
            }
        };

        fetchMessages();

        const ws = new WebSocket('ws://localhost:5000');
        setSocket(ws);

        ws.onmessage = (event) => {
            const data = JSON.parse(event.data);
            if (data.room === room) {
                setMessages((prevMessages) => [...prevMessages, data]);
            }
        };

        return () => {
            ws.close();
        };
    }, [room]);

    const sendMessage = async () => {
        try {
            const response = await axios.post(
                `http://localhost:5000/messages/${room}`,
                { user: userName, message }
            );

            // optional: check if backend returns an error field
            if (response.data?.error) {
                alert(response.data.error);
                return;
            }

            setMessage('');
        } catch (error) {
            console.error('❌ Error sending message:', error);
        }
    };

    const formatTimestamp = (timestamp) => {
        const date = new Date(timestamp);
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    return (
        <div>
            <h2>Chat Room: {room}</h2>
            <div className="chat-container">
                <ul>
                    {messages.map((msg, index) => (
                        <li key={index}>
                            <strong>{msg.user}:</strong> {msg.message}{' '}
                            <span style={{ color: 'gray', fontSize: '0.9em' }}>
                                ({formatTimestamp(msg.timestamp)})
                            </span>
                        </li>
                    ))}
                </ul>
            </div>
            <div>
                <input
                    type="text"
                    placeholder="Type your message..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                />
                <button onClick={sendMessage}>Send</button>
            </div>
        </div>
    );
};

export default ChatRoom;
