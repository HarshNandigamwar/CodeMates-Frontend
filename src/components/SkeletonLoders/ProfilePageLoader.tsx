import Loader from "./Loader";
import Skeleton from "react-loading-skeleton";

const ProfilePageLoader = () => {
  return (
    <div className=" bg-[#0a0a0a] text-white pb-20">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* PC */}
        <div className="hidden md:flex mt-24 flex-col md:flex-row md:gap-6">
          {/* Profile Picture */}
          <div className="h-32 w-32 md:h-44 md:w-44">
            <Skeleton
              baseColor="#27272a"
              highlightColor="#22c55e"
              height={170}
              width={170}
              className="opacity-50 rounded-2xl"
            />
          </div>

          {/* Basic Info */}
          <div className="mt-4 pt-5 md:mb-4 flex-1">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h1>
                  <Skeleton
                    baseColor="#27272a"
                    highlightColor="#22c55e"
                    height={30}
                    width={500}
                    className="opacity-50 rounded-2xl"
                  />
                </h1>
                <Skeleton
                  baseColor="#27272a"
                  highlightColor="#22c55e"
                  height={20}
                  width={500}
                  className="opacity-50 rounded-2xl"
                />{" "}
                <Skeleton
                  baseColor="#27272a"
                  highlightColor="#22c55e"
                  height={20}
                  width={300}
                  className="opacity-50 rounded-2xl"
                />
              </div>
            </div>
          </div>
        </div>
        {/* Mobile */}
        <div className="flex md:hidden mt-24 flex-col items-center gap-5 p-5 ">
          {/* Profile Picture */}
          <div>
            <Skeleton
              baseColor="#27272a"
              highlightColor="#22c55e"
              height={170}
              width={170}
              className="opacity-50 rounded-2xl"
            />
          </div>

          {/* Basic Info */}
          <div className="pt-1">
            <div className="flex flex-col text-center">
              <div>
                <h1>
                  <Skeleton
                    baseColor="#27272a"
                    highlightColor="#22c55e"
                    height={30}
                    width={280}
                    className="opacity-50 rounded-2xl"
                  />
                </h1>
                <Skeleton
                  baseColor="#27272a"
                  highlightColor="#22c55e"
                  height={20}
                  width={200}
                  className="opacity-50 rounded-2xl mt-2"
                />{" "}
                <Skeleton
                  baseColor="#27272a"
                  highlightColor="#22c55e"
                  height={20}
                  width={200}
                  className="opacity-50 rounded-2xl mt-2"
                />
              </div>
            </div>
          </div>
        </div>

        {/*Stats Bar */}
        <div className="flex items-center justify-center gap-6 mt-8 py-4">
          <div className="text-center">
            <Loader width={80} />
          </div>
          <div className="text-center">
            <Loader width={80} />
          </div>
          <div className="text-center">
            <Loader width={80} />
          </div>
        </div>

        {/* pc */}
        <div className="hidden p-2 md:flex  gap-5">
          <Loader height={200} width={450} />
          <Loader height={200} width={450} />
        </div>
        <div className="hidden p-2 md:flex  gap-5">
          <Loader height={200} width={450} />
          <Loader height={200} width={450} />
        </div>
        {/* phone */}
        <div className="p-2 md:hidden flex flex-col gap-5">
          <Loader height={200} width={380} />
          <Loader height={200} width={380} />
          <Loader height={200} width={380} />
        </div>
      </div>
    </div>
  );
};

export default ProfilePageLoader;
