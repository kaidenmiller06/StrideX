import { NavLink } from 'react-router-dom';

/**
 * Styled NavItem component for header navigation links
 * @param to - The path to navigate to when the link is clicked
 * @param end - Whether the link should be considered active only when the location is exactly matched
 * @param children - The content of the link 
 */
function NavItem({ to, end, children }: { to: string; end: boolean; children: React.ReactNode }) {
  return(
    <NavLink
      to={to}
      end={end}
      className={({ isActive }) =>
        `font-orbitron font-bold hover:underline active:text-stridex-darkgreen ${
          isActive ? 'text-stridex-green' : 'text-white'
        }`
      }
    >
      {children}
    </NavLink>
  );
}

export default NavItem;