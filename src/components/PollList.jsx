import React from 'react';

export default function PollList({ polls = [], onOpen, onRemove }) {
  return (
    <div className="card list">
      <h3>Recent Polls</h3>
      <ul>
        {polls.map((p) => (
          <li key={p.id} className="flex justify-between items-center">
            <div
              className="flex-1 cursor-pointer"
              onClick={() => onOpen(p.id)}
            >
              <div className="title font-medium">{p.title}</div>
              <div className="meta text-sm opacity-75">
                {p.choices.length} choices •{" "}
                {new Date(p.createdAt).toLocaleString()}
              </div>
            </div>

            {/* ❌ Remove Button */}
            <button
              className="ml-2 text-red-500 hover:text-red-700"
              onClick={(e) => {
                e.stopPropagation(); // poll open na ho delete pe
                onRemove(p.id);
              }}
            >
              ❌
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
