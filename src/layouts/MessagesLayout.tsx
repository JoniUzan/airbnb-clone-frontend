import ChatRoom from "@/components/general-components/ChatRoom";
import { Outlet } from "react-router-dom";

function MessagesLayout() {
  return (
    <>
      <div className="flex font-montserrat">
        <div className="h-full text-xl font-600 w-1/4 p-8 pl-12">
          <h1 className="pb-4">Messages</h1>
          <ChatRoom />
        </div>
        <div className="w-3/4 h-full">
          <Outlet />
        </div>
      </div>
    </>
  );
}

export default MessagesLayout;
