import { Link } from "react-router-dom";
import logo from "../../assets/airbnb-logo.webp";

function IconHeader() {
  return (
    <nav className="flex justify-between items-center p-6 px-6 border-b">
      <Link to="/">
        <img className="w-[105px] h-[60px]" src={logo} alt="" />
      </Link>
    </nav>
  );
}

export default IconHeader;
