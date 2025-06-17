const discussions = [
  { id: 1, name: 'Alice' },
  { id: 2, name: 'Bob' }
  // random data
];

const DiscussionList = ({ onSelect }) => (
  <ul className="discussion-list">
    {discussions.map(d => (
      <li key={d.id} onClick={() => onSelect(d)}>
        {d.name}
      </li>
    ))}
  </ul>
);

export default DiscussionList;
