import { useEffect, useState, useRef, useCallback, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Person, SendFill } from "react-bootstrap-icons";
import { toast } from "react-hot-toast";

import Header from "./Header";
import ConnectionPill from "../ui/ConnectionPill";
import MessageBubble from "../ui/MessageBubble";
import { authClient } from "../../lib/authClient";
import { socket } from "../../lib/socket";
import { formatTimestamp, timeGap } from "../../scripts/time";
import type { Connection, Message } from "../../types/connection";
import Button from "../ui/Button";


/**
 * The messaging interface component that allows users to view their connections and send messages to them.
 */
function Connections() {
  const { data: session, isPending } = authClient.useSession();
  const { username } = useParams<{ username: string }>();
  const navigate = useNavigate();

  const [connections, setConnections] = useState<Connection[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [message, setMessage] = useState("");

  const [typingUserId, setTypingUserId] = useState<string | null>(null);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [sending, setSending] = useState(false);

  const activeConnection = connections.find((c) => c.username === username);
  const userId = session?.user?.id;
  const bottomRef = useRef<HTMLDivElement>(null);

  // orders connections by last message time, with no messages at the bottom
  const sortedConnections = useMemo(() => {
    const time = (c: Connection) =>
      c.lastMessageTime ? new Date(c.lastMessageTime).getTime() : -Infinity;
    return [...connections].sort((a, b) => time(b) - time(a));
  }, [connections]);

  // time gap between messages to consider them part of the same group
  const GROUP_GAP_MS = 10 * 60 * 1000;


  // -----------------------------------------------------
  // Functions to load connections and messages, and to send messages
  // -----------------------------------------------------

  /**
   * Fetches the user's connections from the server and updates the state.
   * @param signal - An optional AbortSignal to cancel the request if needed.
   */
  const loadConnections = useCallback(async (signal?: AbortSignal) => {
    try {
      const res = await fetch('/api/connection', { signal });
      if (res.status === 404) { setConnections([]); return; }
      if (!res.ok) throw new Error(`Connection request failed: ${res.status}`);
      const data = await res.json();
      setConnections(data.connections ?? []);
    } catch (err) {
      if (signal?.aborted) return;
      console.error(err);
      toast.error("Could not fetch connections", { id: 'connections-error' });
    }
  }, []);

  /**
   * Fetches the messages for a specific user from the server and updates the state.
   * @param signal - An optional AbortSignal to cancel the request if needed.
   */
  const loadMessages = useCallback(async (signal?: AbortSignal) => {
    if (!username) { setMessages([]); return; }
    setLoadingMessages(true);
    try {
      const res = await fetch(`/api/message/${encodeURIComponent(username)}`, { signal });
      if (res.status === 404) return setMessages([]);
      if (!res.ok) throw new Error(`Message request failed: ${res.status}`);
      const data = await res.json();
      setMessages(data.messages ?? []);
    } catch (err) {
      if (signal?.aborted) return;
      console.error(err);
      toast.error("Could not fetch messages", { id: 'messages-error' });
    } finally {
      if (!signal?.aborted) setLoadingMessages(false);
    }
  }, [username]);
  
  /**
   * Sends a message to the currently selected connection and updates the state with the new message.
   */
  const sendMessage = async () => {
    const text = message.trim();
    if (!text || !username || sending) return;

    setSending(true);
    try {
        const res = await fetch(`/api/message/${encodeURIComponent(username)}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text }),
      });

      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error || `Message send failed: ${res.status}`);
      }

      const { message: saved } = await res.json();
      setMessages((prev) => [...prev, saved]);
      setMessage("");
      setConnections((prev) =>
        prev.map((c) => c.username === username
          ? { ...c, lastMessage: saved.text, lastMessageSenderId: saved.senderId, lastMessageTime: saved.createdAt }
          : c
        )
      );
    } catch (error) {
      console.error(error);
      toast.error("Could not send message", { id: 'send-message-error' });
    } finally {
      setSending(false);
    }
  }


  // -----------------------------------------------------
  // Effects to load connections and messages, handle socket
  // events, and scroll to the bottom of the message list
  // -----------------------------------------------------

  /**
   * Loads the user's connections from the server.
   */
  useEffect(() => {
    if (!userId) return;
    const controller = new AbortController();

    loadConnections(controller.signal);
    return () => { controller.abort(); }
  }, [userId, loadConnections]);

  /**
   * Load messages when selected connection changes
   */
  useEffect(() => {
    setTypingUserId(null);
    setMessages([]);
    const controller = new AbortController();

    loadMessages(controller.signal);
    return () => { controller.abort(); }
  }, [loadMessages]);

  /**
   * Refetch after dropped connection is re-established
   */
  useEffect(() => {
    if (!userId) return;
    setTypingUserId(null);
    const onReconnect = () => { loadConnections(); loadMessages(); }
    socket.io.on('reconnect', onReconnect);
    return () => { socket.io.off('reconnect', onReconnect); }
  }, [userId, loadConnections, loadMessages]);

  /**
   * Scroll to the bottom of the message list when new messages are added
   */
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  /**
   * Handle incoming messages and typing events from the socket server, updating the state accordingly.
   * @param m - The incoming message object.
   * @param p - The typing event payload containing the user ID and typing status.
   */
  useEffect(() => {
    const onMessage = (m: Message) => {
      setConnections((prev) =>
        prev.map((c) =>
          c.userId === m.senderId
            ? { ...c, lastMessage: m.text, lastMessageTime: m.createdAt, lastMessageSenderId: m.senderId }
            : c
        )
      );
      // Append to the open chat only if it's from the person you're viewing
      if (activeConnection?.userId === m.senderId) {
        setMessages((prev) => (prev.some((x) => x.id === m.id) ? prev : [...prev, m]));
        setTypingUserId(null);
      }
    };

    const onTyping = (p: { fromUserId: string; isTyping: boolean }) => {
      setTypingUserId(p.isTyping ? p.fromUserId : null);
    };

    socket.on('message:new', onMessage);
    socket.on('typing', onTyping);
    return () => {
      socket.off('message:new', onMessage);
      socket.off('typing', onTyping);
    };
  }, [activeConnection?.userId]);


  // -----------------------------------------------------
  // JSX rendering of the connections list and messaging interface
  // -----------------------------------------------------

  return(
    <div className="flex h-dvh flex-col">
      <Header />
      <main className="min-h-0 flex-1 bg-stridex-grey">
        <div className="mx-auto grid h-full max-w-7xl grid-cols-1 gap-4 p-4 md:grid-cols-[300px_minmax(0,1fr)]">
          {/* Connection list */}
          <aside className="flex flex-col min-h-0 overflow-y-auto -m-1 p-1 gap-2">
            <h1 className="text-xl font-bold text-white mb-1">Connections</h1>

            {sortedConnections.map((c) => (
              <ConnectionPill
                key={c.id}
                img={c.image}
                name={c.name}
                lastMessage={
                  c.lastMessage
                    ? `${c.lastMessageSenderId === userId ? '' : `${c.name.split(' ')[0]}: `} ${c.lastMessage}`
                    : null
                }
                timestamp={c.lastMessageTime ? formatTimestamp(c.lastMessageTime) : ''}
                active={c.username === username}
                onClick={() => navigate(`/connections/${c.username}`)}
              />
            ))}
          </aside>

          {/* Messaging interface */}
          <section className="flex min-h-0 flex-col rounded-xl bg-stridex-black text-white">
            {!username ? (
              <div className="flex flex-col items-center justify-center h-full">
                <p className="text-stridex-lightgrey text-lg">Select a connection to start messaging</p>
              </div>
            ) : (
              <>
                {/* Message header */}
                <div className="flex flex-row items-center justify-between p-4">
                  <ConnectionPill
                    img={activeConnection?.image ?? null}
                    name={activeConnection?.name ?? 'Unknown User'}
                    variant="header"
                    onClick={() => navigate(`/profile/${activeConnection?.username}`)}
                  />
                  <span className="flex flex-row items-center px-3 py-2 rounded-full text-white bg-stridex-grey">Status: {activeConnection?.status}</span>
                </div>

                <div className="flex min-h-0 flex-1 flex-col overflow-y-auto">
                  <div className="flex flex-1 flex-col gap-1 p-4">

                    {/* Message bubbles or empty state */}
                    {loadingMessages ? null : messages.length === 0 ? (
                      <p className="text-stridex-lightgrey">No messages yet</p>
                    ) : (
                      messages.map((m, i) => {
                        const prev = messages[i - 1];
                        const next = messages[i + 1];

                        const isFirstInGroup = !prev || prev.senderId !== m.senderId || timeGap(prev, m) > GROUP_GAP_MS;
                        const isLastInGroup  = !next || next.senderId !== m.senderId || timeGap(m, next) > GROUP_GAP_MS;

                        return (
                          <MessageBubble
                            key={m.id}
                            message={m.text}
                            time={formatTimestamp(m.createdAt)}
                            isOwn={m.senderId === session?.user.id}
                            isFirstInGroup={isFirstInGroup}
                            isLastInGroup={isLastInGroup}
                          />
                        );
                      })
                    )}
                    {/* Typing indicator */}
                    {typingUserId && typingUserId === activeConnection?.userId && (
                      <div className="flex items-center gap-2">
                        <div className="h-3 w-3 rounded-full bg-stridex-lightgrey animate-bounce" />
                        <p className="text-stridex-lightgrey text-sm">{activeConnection?.name.split(' ')[0]} is typing...</p>
                      </div>
                    )}
                    <div ref={bottomRef} />
                  </div>

                  {/* Message input */}
                  <div className="sticky bottom-0 flex rounded-b-xl shrink-0 items-end gap-2 bg-linear-to-t from-stridex-black from-70% to-transparent px-4 pb-4 pt-6">
                    <textarea
                      name="message"
                      rows={1}
                      maxLength={500}
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                          e.preventDefault();
                          sendMessage();
                        }
                      }}
                      className="field-sizing-content max-h-40 min-w-0 flex-1 resize-none scrollbar-hidden rounded-2xl bg-stridex-grey px-4 py-2 transition-colors duration-300 hover:bg-stridex-grey-hover focus:bg-stridex-grey-active focus:outline-none"
                      placeholder="Type a message..."
                    />
                    <Button
                      variant="primary"
                      className="shrink-0 inline-flex h-10 w-10 items-center justify-center"
                      loading={sending}
                      disabled={!message.trim()}
                      onClick={sendMessage}
                      aria-label="Send"
                    >
                      <SendFill size={20} />
                    </Button>
                  </div>
                </div>
              </>
            )}
          </section>
        </div>
      </main>
    </div>
  );
}

export default Connections;