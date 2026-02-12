import { MessageSquare } from "lucide-react";
import AuthWrapper from "@/components/AuthWrapper";

export default function ChatPlaceholder() {
  return (
    <AuthWrapper>
      <div className="flex flex-col items-center justify-center h-full text-zinc-500 bg-[#0a0a0a] md:mt-30">
        <div className="p-6 bg-zinc-900/30 rounded-full mb-4 border border-zinc-800">
          <MessageSquare size={48} className="text-zinc-700" />
        </div>
        <h2 className="text-xl font-semibold text-zinc-300">
          Select a conversation
        </h2>
        <p className="text-sm">
          Choose a contact from the sidebar to start chatting
        </p>
      </div>
    </AuthWrapper>
  );
}
