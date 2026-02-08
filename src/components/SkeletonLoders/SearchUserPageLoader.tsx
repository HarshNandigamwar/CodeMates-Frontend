import Loader from "./Loader";

const SearchUserPageLoader = () => {
  let count = [0];
  for (let i = 0; i < 9; i++) {
    count.push(i);
  }
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
      {count.map(() => (
        <div>
          <span className="flex md:hidden gap-2 items-center p-2">
            <Loader height={60} width={60} circle={true} />
            <Loader height={50} width={300} />
          </span>
          <span className="hidden md:flex gap-2 items-center justify-center p-2">
            <Loader height={60} width={60} circle={true} />
            <Loader height={50} width={600} />
          </span>
        </div>
      ))}
    </div>
  );
};

export default SearchUserPageLoader;
