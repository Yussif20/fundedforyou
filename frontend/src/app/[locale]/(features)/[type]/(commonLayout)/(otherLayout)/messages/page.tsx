import ConnectSocket from "@/components/Global/connect-socket";
import ChatApp from "@/components/Messages/ChatApp";

export default function page() {
  return (
    <div className="pt-24 lg:pt-40 bg-muted">
      <ConnectSocket />
      <ChatApp />
    </div>
  );
}
