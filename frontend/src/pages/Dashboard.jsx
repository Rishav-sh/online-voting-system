import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getElections, checkVoted } from '../services/api';
import { useAuth } from '../context/AuthContext';

const Dashboard = () => {
  const [elections, setElections] = useState([]);
  const [votedMap, setVotedMap] = useState({});
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetchElections();
  }, []);

  const fetchElections = async () => {
    try {
      const res = await getElections();
      setElections(res.data);

      // Check voted status for each election
      const voteStatus = {};
      for (const el of res.data) {
        try {
          const voteRes = await checkVoted(el.id);
          voteStatus[el.id] = voteRes.data.hasVoted;
        } catch {
          voteStatus[el.id] = false;
        }
      }
      setVotedMap(voteStatus);
    } catch (err) {
      console.error('Failed to load elections', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="page-container">
        <div className="loading-spinner"><div className="spinner" /></div>
      </div>
    );
  }

  return (
    <div className="page-container">
      <div className="app-bg" />

      <div className="page-header">
        <h2>👋 Hello, {user?.name}</h2>
        <p>Browse active elections and cast your vote</p>
      </div>

      {elections.length === 0 ? (
        <div className="empty-state">
          <span className="empty-icon">🗳️</span>
          <h3>No Active Elections</h3>
          <p>There are no active elections right now. Check back later!</p>
        </div>
      ) : (
        <div className="elections-grid">
          {elections.map((election, index) => (
            <div
              className="election-card"
              key={election.id}
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                <h3>{election.title}</h3>
                <span className={`election-status ${election.status === 'ACTIVE' ? 'status-active' : 'status-closed'}`}>
                  <span className="status-dot" />
                  {election.status}
                </span>
              </div>

              <p className="candidates-count">
                🏛️ {election.candidates?.length || 0} candidate{election.candidates?.length !== 1 ? 's' : ''} registered
              </p>

              {votedMap[election.id] ? (
                <button className="btn-vote btn-voted" disabled>
                  ✅ Vote Submitted
                </button>
              ) : (
                <button
                  className="btn-vote"
                  onClick={() => navigate(`/vote/${election.id}`, { state: { election } })}
                  disabled={election.status !== 'ACTIVE'}
                >
                  🗳️ Cast Your Vote
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Dashboard;
