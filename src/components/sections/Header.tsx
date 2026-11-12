import { Link, NavLink } from 'react-router-dom';
import { Person } from 'react-bootstrap-icons';
import { toast } from 'react-hot-toast';

import NavItem from '../ui/NavItem';
import { authClient, logoutState } from '../../lib/authClient';
import logo from '../../assets/branding/logo.svg';

/**
 * Header component for the application, containing navigation links to the main sections.
 */
function Header() {
  const { data: session } = authClient.useSession();

  const handleLogout = async () => {
    logoutState.intentional = true;
    await authClient.signOut();
    toast.success('You have been logged out', { id: 'logout-success' });
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
              <button
                onClick={handleLogout}
                className="font-orbitron font-bold text-white cursor-pointer hover:underline active:text-stridex-green-active"
              >
                Log out
              </button>

              <NavLink
                to="/profile"
                end
                className={({ isActive }) =>
                  `shrink-0 active:text-stridex-green-active ${
                    isActive ? 'text-stridex-green' : 'text-white'
                  }`
                }
              >
                <Person size={30} />
              </NavLink>
            </>
          ) : (
            <NavItem to="/auth" end>Log in</NavItem>
          )}
        </div>
      </div>
    </header>
  );
}

export default Header;