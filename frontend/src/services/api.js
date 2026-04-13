import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:8080/api',
});

// Attach JWT token to every request automatically
API.interceptors.request.use((config) => {
  const user = JSON.parse(localStorage.getItem('user'));
  if (user && user.token) {
    config.headers.Authorization = `Bearer ${user.token}`;
  }
  return config;
});

// ======== Auth APIs ========
export const login = (data) => API.post('/auth/login', data);
export const register = (data) => API.post('/auth/register', data);

// ======== Public APIs ========
export const getElections = () => API.get('/elections');
export const castVote = (data) => API.post('/vote', data);
export const checkVoted = (electionId) => API.get(`/elections/${electionId}/voted`);

// ======== Admin APIs ========
export const createElection = (data) => API.post('/admin/elections', data);
export const addCandidate = (electionId, data) => API.post(`/admin/elections/${electionId}/candidates`, data);
export const updateElectionStatus = (electionId, status) => API.put(`/admin/elections/${electionId}/status`, { status });
export const getElectionResults = (electionId) => API.get(`/admin/elections/${electionId}/results`);
export const getAllElections = () => API.get('/admin/elections');

export default API;
