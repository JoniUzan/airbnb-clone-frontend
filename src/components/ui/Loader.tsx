
function Loader() {
  return (
    <div>
      <div className="w-full gap-x-2 flex justify-center items-center">
        <div className="w-5 h-5 animate-pulse bg-gray-400 rounded-full animate-bounce"></div>
        <div className="w-5 h-5 animate-pulse bg-gray-600 rounded-full animate-bounce"></div>
        <div className="w-5 h-5 animate-pulse bg-black rounded-full animate-bounce"></div>
      </div>
    </div>
  );
}

export default Loader;
