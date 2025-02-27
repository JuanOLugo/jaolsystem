import {
  Barcode,
  Bug,
  ChevronLeft,
  ChevronRight,
  House,
  Package,
  PackagePlus,
  Settings,
  ShoppingBasket,
  User,
} from "lucide-react";
import { ReactNode, useState } from "react";
import { Link, useLocation } from "react-router-dom";
function Navbar({ children }: { children: ReactNode }) {
  const [NavbarState, setNavbarState] = useState(true);
  const location = useLocation()
  const urls = [
    {
      href: "/",
      text: "Dashboard",
      icon: <House />,
    },
    {
      href: "/products",
      text: "Products",
      icon: <Package />,
    },
    {
      href: "/create",
      text: "Create Products",
      icon: <PackagePlus />,
    },
    {
      href: "/sales",
      text: "Sales",
      icon: <ShoppingBasket />,
    },
    {
      href: "/invoicing",
      text: "Invoicing",
      icon: <Barcode />,
    },
    {
      href: "/users",
      text: "Users",
      icon: <User />,
    },
    {
      href: "/reports",
      text: "Reports",
      icon: <Bug />,
    },
    {
      href: "/settings",
      text: "Settings",
      icon: <Settings />,
    },
  ];

  return (
    <div >
      <div className="flex ">
        <div
          className={`${
            NavbarState ? "w-52" : "w-14 items-center "
          }  h-screen bg-blue-400 transition-all flex flex-col  `}
        >
          <div className={`flex items-center justify-center `}>
            {NavbarState ? (
              <h1 className="mx-2  font-bold text-white text-xl">
                Jaol System
              </h1>
            ) : null}
            <button
              className="mx-3 text-white p-2 cursor-pointer "
              onClick={() => setNavbarState(!NavbarState)}
            >
              {NavbarState ? <ChevronLeft /> : <ChevronRight />}
            </button>
          </div>

          <div className="space-y-2 my-5 ">
            {urls.map((url, index) => {
              return (
                <Link
                  to={url.href}
                  key={index}
                  className={`flex ${
                    NavbarState ? "mr-5 ml-1" : ""
                  } font-light p-2  rounded-lg  ${location.pathname === url.href ? "bg-blue-50 text-blue-400" : "hover:text-blue-400 text-white  hover:bg-blue-50" } `}
                >
                  <label htmlFor="" className=" ">
                    {url.icon}
                  </label>
                  {NavbarState ? <p className=" ml-3">{url.text}</p> : null}
                </Link>
              );
            })}
          </div>
        </div>
        <div className="w-full bg-blue-50">{children}</div>
      </div>
    </div>
  );
}

export default Navbar;
