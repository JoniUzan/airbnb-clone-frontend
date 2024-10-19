

function NotHaveReservaions() {
  return (
    <div className="w-full mt-6  ">
      <section className="bg-[#F7F7F7] p-20 rounded-2xl space-y-6 flex flex-col items-center">
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
            fill: "rgb(34, 34, 34)",
          }}
        >
          <path d="M24 1a5 5 0 0 1 5 4.78v5.31h-2V6a3 3 0 0 0-2.82-3H8a3 3 0 0 0-3 2.82V26a3 3 0 0 0 2.82 3h5v2H8a5 5 0 0 1-5-4.78V6a5 5 0 0 1 4.78-5H8zm-2 12a9 9 0 1 1 0 18 9 9 0 0 1 0-18zm0 2a7 7 0 1 0 0 14 7 7 0 0 0 0-14zm3.02 3.17 1.36 1.46-6.01 5.64-3.35-3.14 1.36-1.46 1.99 1.86z"></path>
        </svg>
        <p className="text-center max-w-60">
          {"You currently don’t have any Reservations"}
        </p>
      </section>
    </div>
  );
}

export default NotHaveReservaions;
