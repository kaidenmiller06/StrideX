import { SendFill } from "react-bootstrap-icons";
import Header from "./Header";
import ConnectionPill from "../ui/ConnectionPill";
import MessageBubble from "../ui/MessageBubble";

/**
 * The messaging interface component that allows users to view their connections and send messages to them.
 */
function Connections() {
  return(
    <div className="flex h-dvh flex-col">
      <Header />
      <main className="min-h-0 flex-1 bg-stridex-grey">
        <div className="mx-auto grid h-full max-w-7xl grid-cols-1 gap-4 p-4 md:grid-cols-[300px_minmax(0,1fr)]">
          {/* Connection list */}
          <aside className="flex flex-col min-h-0 overflow-y-auto -m-1 p-1 gap-2">
            <h1 className="text-xl font-bold text-white mb-1">Connections</h1>

            <ConnectionPill name="John Doe" lastMessage="You: most recent message here" timestamp="12:49 PM" />
            <ConnectionPill name="Jane Smith" lastMessage="Jane: another message" timestamp="1:05 PM" />
          </aside>

          {/* Messaging interface - need to update header and message list with db data */}
          <section className="flex min-h-0 flex-col rounded-xl bg-stridex-black text-white">
            <div className="flex flex-row items-center justify-between p-4">
              <h2 className="text-lg font-semibold">John Doe</h2>
            </div>

            <div className="min-h-0 flex-1 overflow-y-auto">
              <div className="flex flex-col gap-1 p-4">
                <MessageBubble message="Hey, how's it going?" time="12:45 PM" isLastInGroup={false} />
                <MessageBubble message="Pretty good, just working on a project." time="12:46 PM" isFirstInGroup={false} isLastInGroup={false} />
                <MessageBubble message="Nice! What kind of project?" time="12:47 PM" isFirstInGroup={false} />
                <MessageBubble message="Hey, how's it going?" time="12:45 PM" isOwn={true} />
                <MessageBubble message="Hey, how's it going?" time="12:45 PM" isLastInGroup={false} />
                <MessageBubble message="Pretty good, just working on a project." time="12:46 PM" isFirstInGroup={false} isLastInGroup={false} />
                <MessageBubble message="Nice! What kind of project?" time="12:47 PM" isFirstInGroup={false} />
                <MessageBubble message="Hey, how's it going?" time="12:45 PM" isOwn={true} />
                <MessageBubble message="Hey, how's it going?" time="12:45 PM" isLastInGroup={false} />
                <MessageBubble message="Pretty good, just working on a project." time="12:46 PM" isFirstInGroup={false} isLastInGroup={false} />
                <MessageBubble message="Nice! What kind of project?" time="12:47 PM" isFirstInGroup={false} />
                <MessageBubble message="Hey, how's it going?" time="12:45 PM" isOwn={true} />
                <MessageBubble message="Hey, how's it going?" time="12:45 PM" isLastInGroup={false} />
                <MessageBubble message="Pretty good, just working on a project." time="12:46 PM" isFirstInGroup={false} isLastInGroup={false} />
                <MessageBubble message="Nice! What kind of project?" time="12:47 PM" isFirstInGroup={false} />
                <MessageBubble message="Hey, how's it going?" time="12:45 PM" isOwn={true} />
                <MessageBubble message="Hey, how's it going?" time="12:45 PM" isLastInGroup={false} />
                <MessageBubble message="Pretty good, just working on a project." time="12:46 PM" isFirstInGroup={false} isLastInGroup={false} />
                <MessageBubble message="Nice! What kind of project?" time="12:47 PM" isFirstInGroup={false} />
                <MessageBubble message="Hey, how's it going?" time="12:45 PM" isOwn={true} />
                <MessageBubble message="Hey, how's it going?" time="12:45 PM" isLastInGroup={false} />
                <MessageBubble message="Pretty good, just working on a project." time="12:46 PM" isFirstInGroup={false} isLastInGroup={false} />
                <MessageBubble message="Nice! What kind of project?" time="12:47 PM" isFirstInGroup={false} />
                <MessageBubble message="Hey, how's it going?" time="12:45 PM" isOwn={true} />
                <MessageBubble message="Hey, how's it going?" time="12:45 PM" isLastInGroup={false} />
                <MessageBubble message="Pretty good, just working on a project." time="12:46 PM" isFirstInGroup={false} isLastInGroup={false} />
                <MessageBubble message="Nice! What kind of project?" time="12:47 PM" isFirstInGroup={false} />
                <MessageBubble message="Hey, how's it going?" time="12:45 PM" isOwn={true} />
                <MessageBubble message="Hey, how's it going?" time="12:45 PM" isLastInGroup={false} />
                <MessageBubble message="Pretty good, just working on a project." time="12:46 PM" isFirstInGroup={false} isLastInGroup={false} />
                <MessageBubble message="Nice! What kind of project?" time="12:47 PM" isFirstInGroup={false} />
                <MessageBubble message="Hey, how's it going?" time="12:45 PM" isOwn={true} />
              </div>

              {/* Message input - need to implement send functionality */}
              <div className="sticky bottom-0 bg-linear-to-t from-stridex-black from-70% to-transparent rounded-b-2xl px-4 pb-4 pt-6">
                <div className="flex items-end gap-2 rounded-3xl bg-stridex-grey p-2">
                  <textarea
                    rows={1}
                    maxLength={500}
                    className="field-sizing-content max-h-40 min-w-0 flex-1 resize-none scrollbar-hidden bg-transparent px-2 py-1 focus:outline-none"
                    placeholder="Type a message..."
                  />
                  <button aria-label="Send" className="shrink-0 aspect-square inline-flex items-center justify-center p-2 text-white rounded-full border border-white hover:bg-stridex-lightgrey focus:border-stridex-darkgreen focus:ring-2 focus:ring-stridex-green focus:ring-opacity-50 active:bg-white transition-colors duration-300">
                    <SendFill size={15} />
                  </button>
                </div>
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}

export default Connections;