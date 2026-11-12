import { Person } from 'react-bootstrap-icons';

type MessageBubbleProps = {
  message: string;
  time: string;
  isOwn?: boolean;
  isFirstInGroup?: boolean;
  isLastInGroup?: boolean;
};

/**
 * The message bubble component that displays a message and the profile icon and time depending on its properties.
 * @param message - The text content of the message.
 * @param time - The timestamp of the message.
 * @param isOwn - Whether the message was sent by the current user.
 * @param isFirstInGroup - Whether the message is the first in a group of messages from the same sender.
 * @param isLastInGroup - Whether the message is the last in a group of messages from the same sender. 
 */
function MessageBubble({
  message,
  time,
  isOwn = false,
  isFirstInGroup = true,
  isLastInGroup = true,
}: MessageBubbleProps) {
  // border radius logic for message bubbles based on ownership and position in group
  const corners = isOwn
    ? `rounded-tl-2xl rounded-bl-2xl rounded-br-none ${
        isFirstInGroup ? 'rounded-tr-2xl' : 'rounded-tr-none'
      }`
    : `rounded-tr-2xl rounded-br-2xl rounded-bl-none ${
        isFirstInGroup ? 'rounded-tl-2xl' : 'rounded-tl-none'
      }`;

  const colors = isOwn
    ? 'bg-stridex-green'
    : 'bg-stridex-grey';

  return (
    <div className={`flex flex-row items-end gap-2 ${isOwn ? 'justify-end' : ''}`}>
      {/* Profile icon for other people's messages */}
      {!isOwn && (
        <div className="w-10 shrink-0">
          {isLastInGroup && <Person size={40} className="text-stridex-lightgrey" />}
        </div>
      )}

      {/* Message content and timestamp */}
      <div className={`flex w-fit max-w-9/10 flex-col ${isOwn ? 'items-end' : 'items-start'}`}>
        <p className={`${corners} ${colors} p-1 px-2 wrap-break-word`}>{message}</p>
        {isLastInGroup && (
          <span className="px-2 text-xs text-stridex-lightgrey">{time}</span>
        )}
      </div>

      {/* Profile icon for your own messages */}
      {isOwn && (
        <div className="w-10 shrink-0">
          {isLastInGroup && <Person size={40} className="text-stridex-lightgrey" />}
        </div>
      )}
    </div>
  );
}

export default MessageBubble;