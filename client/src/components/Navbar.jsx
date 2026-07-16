import { Link, useLocation } from 'react-router-dom'
import './Navbar.css'

function Navbar() {
  const location = useLocation()

  return (
    <nav className="navbar">
      <Link to="/" className="navbar-brand">
        <span className="navbar-logo">⟐</span>
        <span className="navbar-title">AI Code Auditor</span>
      </Link>

      <div className="navbar-links">
        <Link
          to="/"
          className={`navbar-link ${location.pathname === '/' ? 'active' : ''}`}
        >
          Home
        </Link>
        <Link
          to="/history"
          className={`navbar-link ${location.pathname === '/history' ? 'active' : ''}`}
        >
          History
        </Link>
      </div>
    </nav>
  )
}

export default Navbar
