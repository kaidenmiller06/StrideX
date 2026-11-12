import { Person } from "react-bootstrap-icons";

type ConnectionPillProps = {
  img?: string;
  name: string;
  lastMessage: string;
  timestamp: string;
};

/**
 * The connection pill component that displays a user's profile, name, last message, and timestamp.
 * @param img - The URL of the user's profile image.
 * @param name - The name of the user.
 * @param lastMessage - The last message exchanged with the user.
 * @param timestamp - The timestamp of the last message.
 */
function ConnectionPill({img, name, lastMessage, timestamp}: ConnectionPillProps) {
  return (
    <button className="flex flex-row items-center w-full p-2 px-3 bg-stridex-black rounded-full text-white hover:bg-stridex-hover focus:border-stridex-darkgreen focus:ring-2 focus:ring-stridex-green focus:ring-opacity-50 active:bg-stridex-active transition-colors duration-300">
      {/* Replace with Profile photo */}
      {img ? (
        <img src={img} alt={name} className="w-10 h-10 rounded-full" />
      ) : (
        <Person size={40} className="shrink-0 text-stridex-lightgrey" />
      )}

      {/* Name and last message */}
      <div className="flex min-w-0 flex-1 flex-col ml-2">
        <h6 className="truncate text-sm text-left font-semibold m-0">{name}</h6>
        <p className="truncate text-stridex-lightgrey text-left">{lastMessage}</p>
      </div>

      {/* Timestamp or Date */}
      <div className="flex shrink-0 flex-col ml-2">
        <p className="text-sm text-stridex-lightgrey">{timestamp}</p>
      </div>
    </button>
  );
}

export default ConnectionPill;