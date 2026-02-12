"use client";
import { useState, useEffect } from "react";
import axiosInstance from "@/lib/axios";
import { Search, Users } from "lucide-react";
import UserCard from "@/components/UserCard";
import SearchUserPageLoader from "@/components/SkeletonLoders/SearchUserPageLoader";

export default function SearchPage() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  // Search User
  const handleSearch = async (searchTerm: string) => {
    if (!searchTerm.trim()) {
      setResults([]);
      return;
    }
    setLoading(true);
    try {
      const res = await axiosInstance.get(`/auth/search/${searchTerm}`);
      setResults(res.data);
    } catch (error) {
      console.error("Search error:", error);
    } finally {
      setLoading(false);
    }
  };
  // Debouncing
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      handleSearch(query);
    }, 500);
    return () => clearTimeout(delayDebounceFn);
  }, [query]);

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white pt-24 pb-12">
      <div className="max-w-2xl mx-auto px-4">
        {/* Search Header */}
        <div className="mb-8 space-y-2">
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Users className="text-accent" /> Find People
          </h1>
          <p className="text-zinc-500 text-sm">
            Search by username to connect with other developers.
          </p>
        </div>
        {/* Search Input Box */}
        <div className="relative mb-8">
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500">
            <Search size={20} />
          </div>
          {/* Input */}
          <input
            type="text"
            placeholder="Type username"
            className="w-full bg-[#111111] border border-zinc-800 rounded-2xl py-4 pl-12 pr-4 outline-none focus:border-accent focus:ring-1 focus:ring-accent/20 transition-all text-sm"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
        {/* Results Section */}
        {loading ? (
          <SearchUserPageLoader />
        ) : (
          <div className="space-y-3">
            {results.length > 0 ? (
              results.map((user: any) => (
                <UserCard key={user._id} user={user} />
              ))
            ) : query.length > 0 && !loading ? (
              <div className="text-center py-12 bg-[#111111] rounded-2xl border border-dashed border-zinc-800">
                <p className="text-zinc-500 text-sm italic">
                  No users found with username "{query}"
                </p>
              </div>
            ) : (
              // Empty Query
              <div className="text-center py-12">
                <p className="text-zinc-600 text-xs uppercase tracking-widest font-bold">
                  Start typing to see results
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
