import { getChatroomByUserId, getChatroomDetailsById } from "@/lib/http";
import { useAuth } from "@/providers/user.context";
import { useQueries, useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { Avatar } from "../ui/avatar";
import { useState } from "react";
import { Skeleton } from "../ui/skeleton";

// Define types if using TypeScript
type Participant = {
  _id: string;
  firstName: string;
  lastName: string;
};

type LastMessage = {
  createdAt: string;
  message: string;
  sender: string;
};

type ChatroomDetails = {
  participants: Participant[];
  lastMessage: LastMessage;
};

// Utility function to generate random colors
const getRandomColor = () => {
  const colors = [
    "#F44336",
    "#E91E63",
    "#9C27B0",
    "#673AB7",
    "#3F51B5",
    "#2196F3",
    "#03A9F4",
    "#00BCD4",
    "#009688",
    "#4CAF50",
    "#8BC34A",
    "#CDDC39",
    "#FFC107",
    "#FF9800",
    "#FF5722",
  ];
  return colors[Math.floor(Math.random() * colors.length)];
};

function ChatRoom() {
  const { loggedInUser } = useAuth();
  const userId = loggedInUser?.user._id;
  const [selectedChatroomId, setSelectedChatroomId] = useState<
    string | null | undefined
  >(null);

  // Fetch the chatroom IDs
  const {
    data: chatroomIds,
    isLoading: isLoadingChatrooms,
    isError: isErrorChatrooms,
  } = useQuery<string[]>({
    queryKey: ["chatrooms"],
    queryFn: () => getChatroomByUserId(userId),
    enabled: !!userId,
    retry: 2,
  });

  // Fetch the details for each chatroom ID
  const chatroomQueries = useQueries({
    queries: (chatroomIds ?? []).map((roomId) => ({
      queryKey: ["chatroomDetails", roomId],
      queryFn: () => getChatroomDetailsById(roomId),
      enabled: !!roomId,
    })),
  });

  if (isLoadingChatrooms)
    return (
      <div>
        <Skeleton className="h-20 rounded-xl mb-2" />
        <Skeleton className="h-20 rounded-xl mb-2" />
        <Skeleton className="h-20 rounded-xl mb-2" />
        <Skeleton className="h-20 rounded-xl mb-2" />
        <Skeleton className="h-20 rounded-xl mb-2" />
      </div>
    );
  if (isErrorChatrooms)
    return (
      <div className="flex flex-col justify-center items-center font-montserrat space-y-3">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 32 32"
          aria-hidden="true"
          role="presentation"
          focusable="false"
          style={{
            display: "block",
            height: "32px",
            width: "32px",
            fill: "currentColor",
          }}
        >
          <path d="M26 1a5 5 0 0 1 5 4.78v10.9a5 5 0 0 1-4.78 5H26a5 5 0 0 1-4.78 5h-4l-3.72 4.36-3.72-4.36H6a5 5 0 0 1-4.98-4.56L1 21.9 1 21.68V11a5 5 0 0 1 4.78-5H6a5 5 0 0 1 4.78-5H26zm-5 7H6a3 3 0 0 0-3 2.82v10.86a3 3 0 0 0 2.82 3h4.88l2.8 3.28 2.8-3.28H21a3 3 0 0 0 3-2.82V11a3 3 0 0 0-3-3zm-1 10v2H6v-2h14zm6-15H11a3 3 0 0 0-3 2.82V6h13a5 5 0 0 1 5 4.78v8.9a3 3 0 0 0 3-2.82V6a3 3 0 0 0-2.82-3H26zM15 13v2H6v-2h9z"></path>
        </svg>
        <h3 className="font-600 flex justify-center items-center text-center text-[14px]">
          You don’t have any messages
        </h3>
        <p className="font-400 flex justify-center items-center text-center text-[14px]">
          When you receive a new message, it will appear here.
        </p>
      </div>
    );

  const isLoadingDetails = chatroomQueries.some((query) => query.isLoading);
  const isErrorDetails = chatroomQueries.some((query) => query.isError);

  if (isLoadingDetails)
    return (
      <div>
        <Skeleton className="h-20 rounded-xl mb-2" />
        <Skeleton className="h-20 rounded-xl mb-2" />
        <Skeleton className="h-20 rounded-xl mb-2" />
        <Skeleton className="h-20 rounded-xl mb-2" />
        <Skeleton className="h-20 rounded-xl mb-2" />
      </div>
    );
  if (isErrorDetails) return <div>Error loading chatroom details</div>;

  return (
    <div className="font-montserrat font-[530]">
      <ul className="space-y-1">
        {chatroomQueries.map((query, index) => {
          const chatroomDetails = query.data as ChatroomDetails;
          const roomId = chatroomIds?.[index];

          // Find the other participant
          const otherParticipant = chatroomDetails?.participants.find(
            (participant) => participant._id !== userId
          );

          if (!otherParticipant) return null;

          const date = new Date(chatroomDetails.lastMessage.createdAt);
          const day = String(date.getDate()).padStart(2, "0");
          const month = String(date.getMonth() + 1).padStart(2, "0");
          const year = date.getFullYear();
          const formattedDate = `${day}/${month}/${year}`;

          return (
            <div
              key={roomId}
              className={`text-[#6A6A6A] w-[270px] hover:bg-[#F7F7F7] p-4 rounded-xl ${
                selectedChatroomId === roomId ? "bg-[#F7F7F7]" : ""
              }`}
              onClick={() => setSelectedChatroomId(roomId)}
            >
              <Link to={`${roomId}`}>
                <div className="flex text-[13px] items-center">
                  <div>
                    <Avatar
                      className="text-2xl mr-3 text-white flex justify-center items-center"
                      style={{ backgroundColor: getRandomColor() }} // Apply random color
                    >
                      {otherParticipant.firstName[0]}
                    </Avatar>
                  </div>
                  <div>
                    <div className="flex justify-between items-center w-48">
                      {`${otherParticipant.firstName} ${otherParticipant.lastName}`}
                      <span>{formattedDate}</span>
                    </div>
                    {userId === chatroomDetails.lastMessage.sender
                      ? `You: ${
                          chatroomDetails.lastMessage.message.length > 20
                            ? `${chatroomDetails.lastMessage.message.slice(
                                0,
                                20
                              )}...`
                            : chatroomDetails.lastMessage.message
                        }`
                      : `${otherParticipant.firstName}: ${
                          chatroomDetails.lastMessage.message.length > 20
                            ? `${chatroomDetails.lastMessage.message.slice(
                                0,
                                20
                              )}...`
                            : chatroomDetails.lastMessage.message
                        }`}
                  </div>
                </div>
              </Link>
            </div>
          );
        })}
      </ul>
    </div>
  );
}

export default ChatRoom;
