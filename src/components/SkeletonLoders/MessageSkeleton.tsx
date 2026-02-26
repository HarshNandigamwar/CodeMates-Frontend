const MessageSkeleton = () => {
  return (
    <div className="flex flex-col gap-4 w-full">
      {[1, 2, 3, 4, 5].map((i) => (
        <div
          key={i}
          className={`flex ${i % 2 === 0 ? "justify-end" : "justify-start"}`}
        >
          <div className="h-12 w-48 bg-zinc-800/50 animate-pulse rounded-2xl" />
        </div>
      ))}
    </div>
  );
};

export default MessageSkeleton;
