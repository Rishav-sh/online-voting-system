import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout, isAdmin } = useAuth();
  const location = useLocation();

  if (!user) return null;

  const isActive = (path) => location.pathname === path ? 'nav-link active' : 'nav-link';

  return (
    <nav className="navbar">
      <Link to={isAdmin() ? '/admin' : '/dashboard'} className="navbar-brand">
        <span className="logo-icon">🗳️</span>
        <h1>VoteSecure</h1>
      </Link>

      <div className="navbar-links">
        {isAdmin() ? (
          <Link to="/admin" className={isActive('/admin')}>Admin Panel</Link>
        ) : (
          <Link to="/dashboard" className={isActive('/dashboard')}>Dashboard</Link>
        )}
        <button className="btn-nav-logout" onClick={logout}>
          Logout
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
