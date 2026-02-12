"use client";
import Sidebar from "./Sidebar";
import { usePathname } from "next/navigation";

export default function ChatLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isChatOpen = pathname.split("/").length > 2;

  return (
    <div className="flex bg-[#0a0a0a] pt-16 ">
      <div className={`${
        isChatOpen ? "hidden md:block" : "block"
      } w-full md:w-80 flex-shrink-0 border-r border-zinc-800`}>
        <Sidebar />
      </div>

      <div className={`${
        isChatOpen ? "block" : "hidden md:block"
      } flex-1 h-full overflow-hidden`}>
        {children}
      </div>
    </div>
  );
}
