import { Link } from "react-router-dom";

function NotFoundPage() {
  return (
    <>
      <div className="flex justify-evenly items-center h-screen">
        <div className="text-[#484848] max-w-[500px] space-y-4">
          <Link to="/">
            <img
              src="src/assets/airbnb-logo-black.png"
              alt="airbnb-logo"
              className="w-[150px]"
            />
          </Link>
          <h1 className="text-[9rem] font-bold font-montserrat">Oops!</h1>
          <h3 className="text-3xl">
            We can't seem to find the page you're looking for.
          </h3>
          <p className="font-bold text-[#767676]">Error code: 404</p>
        </div>
        <div>
          <img
            src="https://a0.muscache.com/airbnb/static/error_pages/404-Airbnb_final-d652ff855b1335dd3eedc3baa8dc8b69.gif"
            alt="icecream"
          />
        </div>
      </div>
    </>
  );
}

export default NotFoundPage;
