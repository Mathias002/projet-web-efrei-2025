const messages = [
  { id: 1, sender: 'me', text: 'Hello' },
  { id: 2, sender: 'Alice', text: 'Hi there!' }
  // random data
];

const MessageView = ({ discussion }) => (
  <div className="message-view">
    <h3>Conversation with {discussion.name}</h3>
    {messages.map(msg => (
      <div key={msg.id} className={`message ${msg.sender === 'me' ? 'me' : 'other'}`}>
        {msg.text}
      </div>
    ))}
  </div>
);

export default MessageView;
