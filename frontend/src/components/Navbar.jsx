import { NavLink } from 'react-router-dom'

const links = [
  { to: '/',          icon: '📊', label: 'Dashboard'     },
  { to: '/feedback',  icon: '📋', label: 'All Feedback'  },
  { to: '/submit',    icon: '✏️',  label: 'Submit Feedback' },
  { to: '/search',    icon: '🔍', label: 'Search'        },
]

export default function Navbar() {
  return (
    <aside className="sidebar">
      <div className="sidebar-brand">
        <h2>Feedback Management</h2>
        <span>System v1.0</span>
      </div>
      <nav className="sidebar-nav">
        {links.map(({ to, icon, label }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/'}
            className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}
          >
            <span className="icon">{icon}</span>
            {label}
          </NavLink>
        ))}
      </nav>
    </aside>
  )
}
