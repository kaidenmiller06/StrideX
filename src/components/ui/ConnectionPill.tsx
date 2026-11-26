import { Person } from "react-bootstrap-icons";

type ConnectionPillProps = {
  img: string | null;
  name: string;
  lastMessage?: string | null;
  timestamp?: string | null;
  variant?: 'default' | 'header';
  active?: boolean;
  onClick?: () => void;
};

const defaultStyles = 'bg-stridex-black hover:bg-stridex-black-hover active:bg-stridex-black-active focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-stridex-green-hover focus-visible:ring-opacity-50';
const headerStyles = 'pe-4 bg-stridex-grey hover:bg-stridex-grey-hover active:bg-stridex-grey-active focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-stridex-green-hover focus-visible:ring-opacity-50'; 
const activeStyles = 'bg-stridex-green hover:bg-stridex-green-hover active:bg-stridex-green-active focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-stridex-green-hover focus-visible:ring-opacity-50';

/**
 * The connection pill component that displays a user's profile, name, last message, and timestamp.
 * @param img - The URL of the user's profile image.
 * @param name - The name of the user.
 * @param lastMessage - The last message exchanged with the user.
 * @param timestamp - The timestamp of the last message.
 * @param active - Whether the connection is currently active.
 * @param variant - The variant of the connection pill.
 * @param onClick - The function to call when the connection is clicked.
 */
function ConnectionPill({img, name, lastMessage, timestamp, variant='default', active, onClick}: ConnectionPillProps) {
  return (
    <button
      onClick={onClick}
      aria-current={active ? 'true' : 'false'}
      className={`flex flex-row items-center px-3 py-2 rounded-full text-white cursor-pointer select-none
        transform-gpu will-change-transform
        transition-all duration-200 motion-reduce:transition-none
        active:scale-95 motion-reduce:active:scale-100
        ${active ? activeStyles : variant === 'header' ? headerStyles : defaultStyles}`}
      >
      {img ? (
        <img src={img} alt={name} className="w-10 h-10 rounded-full" />
      ) : (
        <Person size={variant === 'header' ? 24 : 40} className={`shrink-0 ${active ? 'text-white' : 'text-stridex-lightgrey'}`} />
      )}

      {/* Name and last message */}
      <div className="flex min-w-0 flex-1 flex-col ml-2">
        <span className="truncate text-sm text-left font-orbitron font-semibold m-0">{name}</span>
        {variant === 'default' && (
          lastMessage ? (
            <p className={`truncate ${active ? 'text-white' : 'text-stridex-lightgrey'} text-left`}>{lastMessage}</p>
          ) : (
            <p className={`truncate ${active ? 'text-white' : 'text-stridex-lightgrey'} text-left italic`}>No messages yet</p>
          )
        )}
      </div>

      {/* Timestamp or Date */}
      {variant === 'default' && (
        <div className="flex shrink-0 flex-col ml-2">
          <p className={`text-sm ${active ? 'text-white' : 'text-stridex-lightgrey'}`}>{timestamp}</p>
        </div>
      )}
    </button>
  );
}

export default ConnectionPill;