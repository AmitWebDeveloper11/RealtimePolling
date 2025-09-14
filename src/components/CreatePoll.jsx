// CreatePoll.jsx
import React, { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';

export default function CreatePoll({ onCreate }) {
  const [title, setTitle] = useState('');
  const [choices, setChoices] = useState(['', '']);
  const [duration, setDuration] = useState(30); // default 30 sec

  function updateChoice(i, v) {
    const c = [...choices]; c[i] = v; setChoices(c);
  }

  function addChoice() { setChoices(c => [...c, '']); }
  function removeChoice(i) { setChoices(c => c.filter((_, idx) => idx !== i)); }

  function submit(e) {
    e.preventDefault();
    const formatted = choices.filter(Boolean).map(c => ({
      id: uuidv4(), text: c, votes: 0
    }));
    const poll = {
      id: uuidv4(),
      title,
      choices: formatted,
      createdAt: Date.now(),
      duration, // store duration in seconds
    };
    onCreate(poll);
    setTitle('');
    setChoices(['', '']);
    setDuration(30);
  }

  return (
    <form className="card create" onSubmit={submit}>
      <h2>Create Poll</h2>
      <input
        value={title}
        onChange={e => setTitle(e.target.value)}
        placeholder="Poll title"
        required
      />
      {choices.map((c, i) => (
        <div key={i} className="choice-row">
          <input
            value={c}
            onChange={e => updateChoice(i, e.target.value)}
            placeholder={`Choice ${i + 1}`}
            required
          />
          {choices.length > 2 && (
            <button type="button" onClick={() => removeChoice(i)}>Remove</button>
          )}
        </div>
      ))}

      <label>Poll Duration (seconds):</label>
      <input
        type="number"
        value={duration}
        onChange={e => setDuration(Number(e.target.value))}
        min="10"
        required
      />

      <div className="row">
        <button type="button" onClick={addChoice}>Add Choice</button><br /><br />
        <button type="submit">Create</button>
      </div>
    </form>
  );
}
