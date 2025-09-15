import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './ChatRoomList.css';

const ChatRoomList = ({ onRoomSelect }) => {
    const [rooms, setRooms] = useState([
        { _id: '1', name: 'general' },
        { _id: '2', name: 'games' },
        { _id: '3', name: 'coding' },
    ]);

    useEffect(() => {
        const fetchRooms = async () => {
            try {
                const response = await axios.get('http://localhost:5000/rooms');
                setRooms(response.data);
            } catch (error) {
                console.error('Error fetching rooms:', error);
            }
        };

        fetchRooms();
    }, []);

    return (
        <div>
            <h2>Available Chat Rooms</h2>
            <ul className="chatroom-list">
                {rooms.map((room) => (
                    <li key={room._id || room.name} className="chatroom-item">
                        <button className="room-name" onClick={() => onRoomSelect(room.name)}>
                            {room.name}
                        </button>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default ChatRoomList;
