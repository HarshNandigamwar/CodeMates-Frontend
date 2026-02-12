// "use client";
import Link from "next/link";
import { UserPlus } from "lucide-react";

interface UserCardProps {
  user: {
    _id: string;
    username: string;
    name: string;
    profilePic: string;
    bio?: string;
  };
}

export default function UserCard({ user }: UserCardProps) {
  return (
    <Link
      href={`/profile/${user.username}`}
      className="flex items-center justify-between p-4 bg-[#111111] border border-zinc-800 rounded-xl hover:border-accent/50 transition-all group"
    >
      <div className="flex items-center gap-4">
        {/* Profile Picture */}
        <img
          src={user.profilePic || "https://placehold.co/100x100"}
          alt={user.username}
          loading="lazy"
          className="w-12 h-12 rounded-full object-cover border border-zinc-700 group-hover:border-accent transition-colors"
        />

        {/* User Info */}
        <div>
          <h3 className="text-white font-bold text-sm group-hover:text-accent transition-colors">
            {user.name}
          </h3>
          <p className="text-zinc-500 text-xs">{user.username}</p>
          {user.bio && (
            <p className="text-zinc-400 text-[11px] mt-1 line-clamp-1 italic">
              {user.bio}
            </p>
          )}
        </div>
      </div>

      <div className="text-accent opacity-0 group-hover:opacity-100 transition-opacity">
        <UserPlus size={20} />
      </div>
    </Link>
  );
}
