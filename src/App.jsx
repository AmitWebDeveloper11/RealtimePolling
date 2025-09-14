import React, { useEffect, useRef, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { load, save } from './storage';
import { subscribe, emit } from './broadcast';

import CreatePoll from './components/CreatePoll';
import PollList from './components/PollList';
import PollDetail from './components/PollDetail';

export default function App() {
  // top-level state shape: { polls: [...] }
  const [state, setState] = useState(() => load());
  const [active, setActive] = useState(null);

  // unique id for this tab — used to ignore events we originated
  const originId = useRef(uuidv4());

  // persist + broadcast when state changes
  useEffect(() => {
    save(state);
    emit('state-update', { state, origin: originId.current, ts: Date.now() });
  }, [state]);

  // listen for updates from other tabs
  useEffect(() => {
    const unsub = subscribe((msg) => {
      if (!msg || msg.event !== 'state-update') return;
      const payload = msg.payload || {};
      if (payload.origin === originId.current) return; // ignore self
      if (payload.state) {
        setState(payload.state);
        // if active poll exists in incoming state, keep current active id
      }
    });
    return unsub;
  }, []);

  function createPoll(poll) {
    setState(prev => ({ polls: [poll, ...(prev.polls || [])] }));
    setActive(poll.id);
  }

  function updatePoll(updated) {
    setState(prev => ({
      polls: prev.polls.map(p => (p.id === updated.id ? updated : p))
    }));
  }

  // ✅ remove poll function
  function removePoll(id) {
    setState(prev => ({
      polls: prev.polls.filter(p => p.id !== id)
    }));

    // agar delete hua poll active tha, to active reset
    if (active === id) {
      setActive(null);
    }
  }

  const activePoll = (state.polls || []).find(p => p.id === active) || null;

  return (
    <div className="app container">
      <header>
        <h1>Realtime Polling — Frontend Only</h1>
      </header>

      <main>
        <div className="left">
          <CreatePoll onCreate={createPoll} />
          <PollList
            polls={state.polls || []}
            onOpen={id => setActive(id)}
            onRemove={removePoll}   // ✅ pass remove handler
          />
        </div>

        <div className="right">
          {activePoll ? (
            <PollDetail poll={activePoll} onVote={updatePoll} />
          ) : (
            <div className="placeholder">Open or create a poll to begin</div>
          )}
        </div>
      </main>

      <footer>
        Frontend-only demo • Created By Amit Pnadey
      </footer>
    </div>
  );
}
