import { useState, useEffect, useRef } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import { getChatHistory, sendMessage } from "@/lib/http";
import { useAuth } from "@/providers/user.context";
import { Avatar } from "@radix-ui/react-avatar";
import { ArrowUp, CircleAlert, Loader } from "lucide-react";
import { Button } from "@/components/ui/button";
import io from "socket.io-client"; // Import Socket.IO client

const BASE_URL = import.meta.env.VITE_BACKEND_BASE_URL;
const socket = io(BASE_URL); // Replace with your server URL

export interface ChatMessage {
  _id: string;
  sender: string;
  message: string;
  createdAt: string; // or Date if you parse it
}

interface Participant {
  _id: string;
  firstName: string;
  lastName: string;
}

interface ChatRoom {
  participants: Participant[];
  messages: ChatMessage[];
}

function ChatRoomPage() {
  const { roomId } = useParams<{ roomId: string }>();
  const [message, setMessage] = useState<string>("");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const { loggedInUser } = useAuth();
  const senderId = loggedInUser?.user._id;
  const chatEndRef = useRef<HTMLDivElement>(null);

  const {
    data: RoomChat,
    isLoading,
    isError,
  } = useQuery<ChatRoom>({
    queryKey: ["chatroom", roomId],
    queryFn: () => getChatHistory(roomId),
    enabled: !!roomId,
    retry: 2,
  });

  const mutation = useMutation({
    mutationFn: () => sendMessage(roomId, senderId, message),
    onSuccess: () => {
      setMessage(""); // Clear input field after sending
    },
    onError: (error: unknown) => {
      console.error("Error sending message:", error);
    },
  });

  useEffect(() => {
    if (RoomChat) {
      setMessages(RoomChat.messages);
    }
  }, [RoomChat]);

  useEffect(() => {
    socket.emit("joinRoom", roomId);

    socket.on("message", (newMessage: ChatMessage) => {
      setMessages((prevMessages) => [...prevMessages, newMessage]);
    });

    return () => {
      socket.off("message");
      socket.emit("leaveRoom", roomId);
    };
  }, [roomId]);

  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: "instant" });
    }
  }, [messages]);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (message.trim()) {
      mutation.mutate();
      socket.emit("sendMessage", {
        roomId,
        senderId,
        message,
      });
    }
  };

  if (isLoading)
    return (
      <div className="flex justify-center items-center mt-10">
        <Loader />
      </div>
    );
  if (isError)
    return (
      <div className="flex flex-col justify-between h-[700px] overflow-y-auto border-l-[1px] border-gray-200">
        <div className="sticky top-0 flex bg-white p-6 px-10 gap-4 items-center border-b-[1px] border-gray-200"></div>
        <div className="flex px-10 items-center">
          <CircleAlert className="bg-red-500 w-10 h-10 mr-4 p-2 rounded-full text-white" />
          <div>
            <h3 className="text-[14px] font-600">
              We weren't able to find this conversation.
            </h3>
            <p className="text-[14px] text-gray-400 font-400">
              Please select another conversation.
            </p>
          </div>
        </div>
      </div>
    );

  // Find the other participant
  const otherParticipant = RoomChat?.participants.find(
    (participant) => participant._id !== senderId
  );

  return (
    <div className="flex flex-col justify-between h-[800px] overflow-y-auto border-l-[1px] border-gray-200">
      <div className="sticky top-0 flex bg-white p-6 px-10 gap-4 items-center border-b-[1px] border-gray-200">
        <Avatar className="text-2xl w-8 rounded-full bg-[#6A6A6A] text-white flex justify-center items-center">
          {otherParticipant?.firstName[0]}
        </Avatar>
        <h1 className="font-600 text-2xl">
          {otherParticipant?.firstName.toLocaleLowerCase()}
        </h1>
      </div>
      <div className="flex flex-col px-10 mt-6">
        {messages.map((msg) => (
          <div
            key={msg._id}
            className={`rounded-2xl flex items-center ${
              msg.sender !== senderId ? "self-start" : "self-end"
            }`}
          >
            {msg.sender !== senderId && (
              <div>
                <Avatar className="text-2xl bg-[#6A6A6A] text-white flex justify-center items-center rounded-full w-8 mr-3 mt-4">
                  {otherParticipant?.firstName[0]}
                </Avatar>
              </div>
            )}
            <div>
              <p className="pl-4 mb-1 font-500 text-xs">
                {msg.sender !== senderId ? (
                  <>
                    {otherParticipant?.firstName.toLocaleLowerCase()}{" "}
                    {otherParticipant?.lastName.toLocaleLowerCase()} •{" "}
                    <span className="font-300">
                      {new Date(msg.createdAt).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </>
                ) : (
                  <>
                    <span className="font-300 flex justify-end items-end pr-4">
                      {new Date(msg.createdAt).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </>
                )}
              </p>

              <p
                className={`mb-4 p-3 rounded-2xl max-w-2xl ${
                  msg.sender !== senderId
                    ? "bg-[#F7F7F7] text-black self-start rounded-bl-none"
                    : "bg-[#3F3F3F] text-white self-end rounded-br-none"
                }`}
                style={{
                  overflowWrap: "break-word",
                  wordBreak: "break-word",
                }}
              >
                {msg.message}
              </p>
            </div>
          </div>
        ))}
        <div ref={chatEndRef} /> {/* Empty div to serve as the scroll target */}
      </div>
      <form
        onSubmit={handleSubmit}
        className="flex sticky bottom-0 bg-white p-4"
      >
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type your message"
          className="ml-4 flex-1 border border-gray-300 rounded-3xl p-3 w-10 font-500"
          required
        />
        <Button
          variant="new"
          type="submit"
          className="rounded-full bg-black p-2 text-white absolute right-6 mt-1"
          disabled={mutation.status === "pending" || message.length === 0}
        >
          <ArrowUp />
        </Button>
      </form>
    </div>
  );
}

export default ChatRoomPage;
