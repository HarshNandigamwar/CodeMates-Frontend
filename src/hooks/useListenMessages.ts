// import { useEffect } from "react";
// import { useSocketContext } from "@/context/SocketContext"; // Aapka socket context
// import { useDispatch, useSelector } from "react-redux";
// import { setMessages } from "@/store/slices/chatSlice"; // Redux ya state manage karne ke liye

// const useListenMessages = () => {
//   const { socket } = useSocketContext();
//   const { messages } = useSelector((state: any) => state.chat);
//   const dispatch = useDispatch();

//   useEffect(() => {
//     socket?.on("newMessage", (newMessage: any) => {
//       // Jab naya message aaye, use purani list mein add kardo
//       dispatch(setMessages([...messages, newMessage]));
//     });

//     return () => socket?.off("newMessage");
//   }, [socket, setMessages, messages]);
// };
