import './assets/styles.scss';
import DiscussionList from './components/DiscussionList';
import MessageView from './components/MessageView';
import MessageInput from './components/MessageInput';
import NewDiscussion from './components/NewDiscussion';
import { useState } from 'react';

const App = () => {
  const [selectedDiscussion, setSelectedDiscussion] = useState(null);

  return (
    <div className="app">
      <aside className="sidebar">
        <h2>Discussions</h2>
        <NewDiscussion />
        <DiscussionList onSelect={setSelectedDiscussion} />
      </aside>
      <main className="chat-area">
        {selectedDiscussion ? (
          <>
            <MessageView discussion={selectedDiscussion} />
            <MessageInput discussion={selectedDiscussion} />
          </>
        ) : (
          <p>Select a discussion to start chatting</p>
        )}
      </main>
    </div>
  );
};

export default App;
