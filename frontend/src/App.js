import React, { useEffect, useState } from 'react';
import axios from 'axios';

function App() {
  const [contestants, setContestants] = useState([]);
  const [selected, setSelected] = useState(null);
  const [results, setResults] = useState(null);
  const [user, setUser] = useState(null);
  const [message, setMessage] = useState('');

  useEffect(() => {
    axios.get('http://localhost:5001/contestants').then(res => setContestants(res.data));
  }, []);

  const handleVote = async () => {
    const deviceIp = await axios.get('https://api.ipify.org?format=json').then(res => res.data.ip);
    try {
      await axios.post('http://localhost:5002/vote', { user_id: user.id, contestant_id: selected, device_ip: deviceIp });
      const result = await axios.get('http://localhost:5003/results');
      setResults(result.data);
    } catch (e) {
      setMessage(e.response.data.error);
    }
  };

  return (
    <div>
      <h1>BiggBoss Voting</h1>
      {!user ? (
        <Login onLogin={setUser} />
      ) : (
        <>
          <div>
            <h2>Contestants</h2>
            <ul>
              {contestants.map(c =>
                <li key={c.Id}>
                  <input type="radio" value={c.Id} checked={selected === c.Id} onChange={() => setSelected(c.Id)} />
                  {c.Name}
                </li>
              )}
            </ul>
            <button onClick={handleVote} disabled={!selected}>Vote</button>
            {message && <div>{message}</div>}
            {results && (
              <div>
                <h2>Results</h2>
                <ul>
                  {results.map(r =>
                    <li key={r.id}>{r.name}: {r.percentage}%</li>
                  )}
                </ul>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}

function Login({ onLogin }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const handleLogin = async () => {
    const deviceIp = await axios.get('https://api.ipify.org?format=json').then(res => res.data.ip);
    const res = await axios.post('http://localhost:5000/login', { username, password, device_ip: deviceIp });
    onLogin(res.data);
  };
  return (
    <div>
      <h2>Login</h2>
      <input value={username} onChange={e => setUsername(e.target.value)} placeholder="Username" />
      <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Password" />
      <button onClick={handleLogin}>Login</button>
    </div>
  );
}

export default App;
