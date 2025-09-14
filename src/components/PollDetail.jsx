// PollDetail.jsx
import React, { useState, useEffect } from 'react';
import ResultsChart from './ResultsChart';

export default function PollDetail({ poll, onVote }) {
  const [localPoll, setLocalPoll] = useState(poll);
  const [voted, setVoted] = useState(false);
  const [timeLeft, setTimeLeft] = useState(
    Math.max(0, Math.floor(poll.duration - (Date.now() - poll.createdAt) / 1000))
  );
  const isExpired = timeLeft <= 0;

  useEffect(() => {
    if (isExpired) return;
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [isExpired]);

  function castVote(choiceId) {
    if (voted || isExpired) return;
    const updated = {
      ...localPoll,
      choices: localPoll.choices.map(c =>
        c.id === choiceId ? { ...c, votes: c.votes + 1 } : c
      ),
    };
    setLocalPoll(updated);
    onVote(updated);
    setVoted(true);
  }

  const total = localPoll.choices.reduce((s, c) => s + c.votes, 0);

  return (
    <div className="card poll-detail">
      <h2>{localPoll.title}</h2>

      {isExpired ? (
        <p style={{ color: 'red' }}>❌ Poll Expired</p>
      ) : (
        <p style={{ color: 'green' }}>⏳ Time Left: {timeLeft}s</p>
      )}

      <div className="choices-list">
        {localPoll.choices.map(c => (
          <div key={c.id} className="choice">
            <div className="label">{c.text}</div>
            <div className="vote-area">
              <button
                disabled={voted || isExpired}
                onClick={() => castVote(c.id)}
              >
                Vote
              </button>
              <div className="count">
                {c.votes} ({total ? Math.round((c.votes / total) * 100) : 0}%)
              </div>
            </div>
          </div>
        ))}
      </div>
      <ResultsChart choices={localPoll.choices} />
    </div>
  );
}
