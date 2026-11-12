import { Link } from 'react-router-dom';
import { Person } from 'react-bootstrap-icons';
import NavItem from '../ui/NavItem';
import logo from '../../assets/branding/logo.svg';
import { authClient } from '../../lib/authClient';

/**
 * Header component for the application, containing navigation links to the main sections.
 */
function Header() {
  const { data: session } = authClient.useSession();

  const handleLogout = async () => {
    await authClient.signOut();
  };

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
            {session && <NavItem to="/store" end>Store</NavItem>}
            {session && <NavItem to="/connections" end>Connections</NavItem>}
          </nav>
        </div>
        {/* Auth and Profile (Right) */}
        <div className="flex items-center gap-4">
          {session ? (
            <>
              <button onClick={handleLogout} className="font-orbitron font-bold text-white hover:underline active:text-stridex-darkgreen">
                Log out
              </button>
              <Link to="/profile" className="shrink-0">
                <Person size={30} className="text-white" />
              </Link>
            </>
          ) : (
            <Link to="/auth" className="font-orbitron font-bold text-white hover:underline active:text-stridex-darkgreen">
              Log in
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}

export default Header;