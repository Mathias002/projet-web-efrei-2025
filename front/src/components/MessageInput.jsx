import { useState } from 'react';

const MessageInput = ({ discussion }) => {
  const [message, setMessage] = useState('');

  const handleSend = () => {
    // Placeholder: send message to API
    console.log(`Send to ${discussion.name}:`, message);
    setMessage('');
  };

  return (
    <div className="message-input">
      <input
        type="text"
        placeholder="Write a message..."
        value={message}
        onChange={(e) => setMessage(e.target.value)}
      />
      <button onClick={handleSend}>Send</button>
    </div>
  );
};

export default MessageInput;
