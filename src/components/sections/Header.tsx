import { Link } from 'react-router-dom';
import { Person } from 'react-bootstrap-icons';
import NavItem from '../ui/NavItem';
import logo from '../../assets/branding/logo.svg'

/**
 * Header component for the application, containing navigation links to the main sections.
 */
function Header() {
  return (
    <header className="bg-stridex-black">
      <div className="flex justify-between items-center max-w-7xl mx-auto px-4 py-1">
        {/* Logo and navigation (Left) */}
        <div className="flex">
          <Link to="/" className="shrink-0">
            <img src={logo} alt="StrideX" className="h-[50px] w-auto py-2" />
          </Link>
          <nav className="flex items-center gap-4 mx-4">
            <NavItem to="/" end>Home</NavItem>
            <NavItem to="/events" end>Events</NavItem>
            <NavItem to="/store" end>Store</NavItem>
            <NavItem to="/connections" end>Connections</NavItem>
          </nav>
        </div>
        {/* Profile (Right) */}
        <div>
          <Link to="/profile" className="shrink-0">
            <Person size={30} className="text-white" />
          </Link>
        </div>
      </div>
    </header>
  );
}

export default Header;