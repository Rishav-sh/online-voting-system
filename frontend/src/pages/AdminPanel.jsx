import { useState, useEffect } from 'react';
import {
  createElection,
  addCandidate,
  getAllElections,
  getElectionResults,
  updateElectionStatus,
} from '../services/api';

const AdminPanel = () => {
  const [activeTab, setActiveTab] = useState('create');

  // Create Election
  const [electionTitle, setElectionTitle] = useState('');
  const [createMsg, setCreateMsg] = useState({ type: '', text: '' });
  const [createLoading, setCreateLoading] = useState(false);

  // Add Candidate
  const [elections, setElections] = useState([]);
  const [selectedElection, setSelectedElection] = useState('');
  const [candidateName, setCandidateName] = useState('');
  const [candidateParty, setCandidateParty] = useState('');
  const [candidateMsg, setCandidateMsg] = useState({ type: '', text: '' });
  const [candidateLoading, setCandidateLoading] = useState(false);

  // Results
  const [resultsElection, setResultsElection] = useState('');
  const [results, setResults] = useState([]);
  const [resultsLoading, setResultsLoading] = useState(false);

  useEffect(() => {
    fetchElections();
  }, []);

  const fetchElections = async () => {
    try {
      const res = await getAllElections();
      setElections(res.data);
    } catch (err) {
      console.error('Failed to fetch elections', err);
    }
  };

  // ======== Create Election ========
  const handleCreateElection = async (e) => {
    e.preventDefault();
    setCreateLoading(true);
    setCreateMsg({ type: '', text: '' });
    try {
      await createElection({ title: electionTitle });
      setCreateMsg({ type: 'success', text: 'Election created successfully!' });
      setElectionTitle('');
      fetchElections();
    } catch (err) {
      setCreateMsg({ type: 'error', text: err.response?.data?.message || 'Failed to create election' });
    } finally {
      setCreateLoading(false);
    }
  };

  // ======== Add Candidate ========
  const handleAddCandidate = async (e) => {
    e.preventDefault();
    setCandidateLoading(true);
    setCandidateMsg({ type: '', text: '' });
    try {
      await addCandidate(selectedElection, { name: candidateName, party: candidateParty });
      setCandidateMsg({ type: 'success', text: `Candidate "${candidateName}" added successfully!` });
      setCandidateName('');
      setCandidateParty('');
      fetchElections();
    } catch (err) {
      setCandidateMsg({ type: 'error', text: err.response?.data?.message || 'Failed to add candidate' });
    } finally {
      setCandidateLoading(false);
    }
  };

  // ======== View Results ========
  const handleViewResults = async () => {
    if (!resultsElection) return;
    setResultsLoading(true);
    try {
      const res = await getElectionResults(resultsElection);
      setResults(res.data);
    } catch (err) {
      console.error('Failed to load results', err);
    } finally {
      setResultsLoading(false);
    }
  };

  // ======== Toggle Election Status ========
  const handleToggleStatus = async (electionId, currentStatus) => {
    const newStatus = currentStatus === 'ACTIVE' ? 'CLOSED' : 'ACTIVE';
    try {
      await updateElectionStatus(electionId, newStatus);
      fetchElections();
    } catch (err) {
      console.error('Failed to update status', err);
    }
  };

  const totalVotes = results.reduce((sum, r) => sum + r.voteCount, 0);

  return (
    <div className="page-container">
      <div className="app-bg" />

      <div className="page-header">
        <h2>⚙️ Admin Panel</h2>
        <p>Manage elections, candidates, and view results</p>
      </div>

      {/* Tabs */}
      <div className="admin-tabs">
        <button className={`admin-tab ${activeTab === 'create' ? 'active' : ''}`} onClick={() => setActiveTab('create')}>
          🗳️ Create Election
        </button>
        <button className={`admin-tab ${activeTab === 'candidate' ? 'active' : ''}`} onClick={() => setActiveTab('candidate')}>
          👤 Add Candidate
        </button>
        <button className={`admin-tab ${activeTab === 'manage' ? 'active' : ''}`} onClick={() => setActiveTab('manage')}>
          📋 Manage Elections
        </button>
        <button className={`admin-tab ${activeTab === 'results' ? 'active' : ''}`} onClick={() => setActiveTab('results')}>
          📊 View Results
        </button>
      </div>

      {/* ======== Create Election Tab ======== */}
      {activeTab === 'create' && (
        <div className="admin-section">
          <div className="admin-form">
            <h3>Create New Election</h3>
            {createMsg.text && (
              <div className={`alert ${createMsg.type === 'success' ? 'alert-success' : 'alert-error'}`}>
                {createMsg.text}
              </div>
            )}
            <form onSubmit={handleCreateElection}>
              <div className="form-group">
                <label htmlFor="election-title">Election Title</label>
                <input
                  id="election-title"
                  type="text"
                  placeholder="e.g. Presidential Election 2026"
                  value={electionTitle}
                  onChange={(e) => setElectionTitle(e.target.value)}
                  required
                />
              </div>
              <button type="submit" className="btn-primary" disabled={createLoading}>
                {createLoading ? 'Creating...' : '🗳️ Create Election'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* ======== Add Candidate Tab ======== */}
      {activeTab === 'candidate' && (
        <div className="admin-section">
          <div className="admin-form">
            <h3>Add Candidate to Election</h3>
            {candidateMsg.text && (
              <div className={`alert ${candidateMsg.type === 'success' ? 'alert-success' : 'alert-error'}`}>
                {candidateMsg.text}
              </div>
            )}
            <form onSubmit={handleAddCandidate}>
              <div className="form-group">
                <label htmlFor="sel-election">Select Election</label>
                <select
                  id="sel-election"
                  value={selectedElection}
                  onChange={(e) => setSelectedElection(e.target.value)}
                  required
                >
                  <option value="">-- Select an Election --</option>
                  {elections.map((el) => (
                    <option key={el.id} value={el.id}>
                      {el.title} ({el.status})
                    </option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label htmlFor="candidate-name">Candidate Name</label>
                <input
                  id="candidate-name"
                  type="text"
                  placeholder="e.g. Rahul Sharma"
                  value={candidateName}
                  onChange={(e) => setCandidateName(e.target.value)}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="candidate-party">Party Name</label>
                <input
                  id="candidate-party"
                  type="text"
                  placeholder="e.g. National Party"
                  value={candidateParty}
                  onChange={(e) => setCandidateParty(e.target.value)}
                  required
                />
              </div>
              <button type="submit" className="btn-primary" disabled={candidateLoading}>
                {candidateLoading ? 'Adding...' : '👤 Add Candidate'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* ======== Manage Elections Tab ======== */}
      {activeTab === 'manage' && (
        <div className="admin-section">
          {elections.length === 0 ? (
            <div className="empty-state">
              <span className="empty-icon">📋</span>
              <h3>No Elections Yet</h3>
              <p>Create your first election in the "Create Election" tab</p>
            </div>
          ) : (
            <div className="elections-grid">
              {elections.map((el, idx) => (
                <div className="election-card" key={el.id} style={{ animationDelay: `${idx * 0.1}s` }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                    <h3>{el.title}</h3>
                    <span className={`election-status ${el.status === 'ACTIVE' ? 'status-active' : 'status-closed'}`}>
                      <span className="status-dot" />
                      {el.status}
                    </span>
                  </div>
                  <p className="candidates-count">
                    🏛️ {el.candidates?.length || 0} candidate{el.candidates?.length !== 1 ? 's' : ''}
                  </p>
                  {el.candidates && el.candidates.length > 0 && (
                    <div style={{ marginTop: '12px' }}>
                      {el.candidates.map((c) => (
                        <div key={c.id} style={{ fontSize: '13px', color: 'var(--text-secondary)', padding: '4px 0' }}>
                          • {c.name} — <span style={{ color: 'var(--accent-primary)' }}>{c.party}</span>
                        </div>
                      ))}
                    </div>
                  )}
                  <button
                    className="btn-vote"
                    onClick={() => handleToggleStatus(el.id, el.status)}
                    style={{
                      background: el.status === 'ACTIVE' ? 'var(--gradient-danger)' : 'var(--gradient-success)',
                    }}
                  >
                    {el.status === 'ACTIVE' ? '🔒 Close Election' : '🔓 Reopen Election'}
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ======== View Results Tab ======== */}
      {activeTab === 'results' && (
        <div className="admin-section">
          <div style={{ display: 'flex', gap: '12px', marginBottom: '24px', alignItems: 'flex-end' }}>
            <div className="form-group" style={{ flex: 1, marginBottom: 0 }}>
              <label htmlFor="results-election">Select Election</label>
              <select
                id="results-election"
                value={resultsElection}
                onChange={(e) => setResultsElection(e.target.value)}
              >
                <option value="">-- Select an Election --</option>
                {elections.map((el) => (
                  <option key={el.id} value={el.id}>
                    {el.title} ({el.status})
                  </option>
                ))}
              </select>
            </div>
            <button
              className="btn-vote"
              onClick={handleViewResults}
              disabled={!resultsElection || resultsLoading}
              style={{ marginTop: 0, whiteSpace: 'nowrap' }}
            >
              {resultsLoading ? 'Loading...' : '📊 View Results'}
            </button>
          </div>

          {results.length > 0 && (
            <div className="results-table-wrapper">
              <table className="results-table">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Candidate</th>
                    <th>Party</th>
                    <th>Votes</th>
                    <th style={{ minWidth: '200px' }}>Progress</th>
                  </tr>
                </thead>
                <tbody>
                  {results
                    .sort((a, b) => b.voteCount - a.voteCount)
                    .map((r, idx) => (
                      <tr key={r.candidateId}>
                        <td style={{ fontWeight: 700, color: idx === 0 ? 'var(--accent-warning)' : 'var(--text-secondary)' }}>
                          {idx === 0 ? '🏆' : idx + 1}
                        </td>
                        <td style={{ fontWeight: 600 }}>{r.name}</td>
                        <td style={{ color: 'var(--text-secondary)' }}>{r.party}</td>
                        <td>
                          <span className="vote-count-badge">🗳️ {r.voteCount}</span>
                        </td>
                        <td>
                          <div className="vote-bar">
                            <div
                              className="vote-bar-fill"
                              style={{ width: totalVotes > 0 ? `${(r.voteCount / totalVotes) * 100}%` : '0%' }}
                            />
                          </div>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AdminPanel;
