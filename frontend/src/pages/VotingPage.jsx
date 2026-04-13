import { useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { castVote } from '../services/api';

const VotingPage = () => {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const election = location.state?.election;

  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  if (!election) {
    return (
      <div className="page-container">
        <div className="empty-state">
          <span className="empty-icon">⚠️</span>
          <h3>Election Not Found</h3>
          <p>Please go back to the dashboard and select an election.</p>
          <button className="btn-primary" style={{ width: 'auto', marginTop: '16px', padding: '12px 32px' }} onClick={() => navigate('/dashboard')}>
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  const handleVote = async () => {
    if (!selectedCandidate) return;
    setLoading(true);
    setError('');
    try {
      const res = await castVote({ electionId: Number(id), candidateId: selectedCandidate });
      setSuccess(res.data.message);
      setTimeout(() => navigate('/dashboard'), 2000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to cast vote');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-container">
      <div className="app-bg" />
      <div className="voting-container">
        <div className="page-header">
          <h2>🗳️ {election.title}</h2>
          <p>Select your preferred candidate and submit your vote</p>
        </div>

        {error && <div className="alert alert-error">{error}</div>}
        {success && <div className="alert alert-success">{success}</div>}

        {!success && (
          <>
            <div className="candidate-list">
              {election.candidates?.map((candidate, index) => (
                <div
                  key={candidate.id}
                  className={`candidate-card ${selectedCandidate === candidate.id ? 'selected' : ''}`}
                  onClick={() => setSelectedCandidate(candidate.id)}
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="candidate-info">
                    <h4>{candidate.name}</h4>
                    <span className="party-name">🏛️ {candidate.party}</span>
                  </div>
                  <div className="radio-circle" />
                </div>
              ))}
            </div>

            <button
              className="btn-primary btn-submit-vote"
              onClick={handleVote}
              disabled={!selectedCandidate || loading}
            >
              {loading ? 'Submitting Vote...' : '✅ Confirm & Submit Vote'}
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default VotingPage;
