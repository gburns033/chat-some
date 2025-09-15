import './App.css';
import ChatRoom from './ChatRoom';
import ChatRoomList from './ChatRoomList';
import React, { useState } from 'react';

function App() {
  const [currentRoom, setCurrentRoom] = useState(null);
  const [rooms, setRooms] = useState(['general', 'games', 'coding']);
  const [userName, setUserName] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleLogin = () => {
    if (userName.trim()) {
      setIsLoggedIn(true);
    }
  };

  const handleBack = () => {
    setCurrentRoom(null);
  };

  const handleAddRoom = (newRoom) => {
    if (!rooms.includes(newRoom)) {
      setRooms([...rooms, newRoom]);
    }
  };

  return (
    <div className="App">
      <img src="logo.png" alt="ChatSome logo" width="200" />
      {!isLoggedIn ? (
        <div>
          <h2>Enter Your Name</h2>
          <input
            type="text"
            placeholder="Your name"
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
          />
          <button onClick={handleLogin}>Submit</button>
        </div>
      ) : currentRoom ? (
        <div>
          <button onClick={handleBack}>Back to Chat Rooms</button>
          <ChatRoom room={currentRoom} userName={userName} />
        </div>
      ) : (
        <ChatRoomList
          rooms={rooms}
          onRoomSelect={setCurrentRoom}
          onAddRoom={handleAddRoom}
        />
      )}
    </div>
  );
}

export default App;
