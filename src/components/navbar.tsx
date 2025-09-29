import React from "react";
import {
  Navbar as MTNavbar,
  Collapse,
  IconButton,
  Typography,
  Button,
} from "@material-tailwind/react";
import {
  XMarkIcon,
  Bars3Icon,
} from "@heroicons/react/24/solid";
import Link from "next/link";

interface NavItemProps {
  children: React.ReactNode;
  href?: string;
}

function NavItem({ children, href }: NavItemProps) {
  return (
    <li>
      <Typography
        as="a"
        href={href || "#"}
        target={href ? "_blank" : "_self"}
        variant="paragraph"
        className="flex items-center gap-2 font-medium" placeholder={undefined} >
        {children}
      </Typography>
    </li>
  );
}

export function Navbar() {
  const [open, setOpen] = React.useState(false);
  const [isScrolling, setIsScrolling] = React.useState(false);

  const handleOpen = () => setOpen((cur) => !cur);

  React.useEffect(() => {
    window.addEventListener(
      "resize",
      () => window.innerWidth >= 960 && setOpen(false)
    );
  }, []);

  React.useEffect(() => {
    function handleScroll() {
      if (window.scrollY > 0) {
        setIsScrolling(true);
      } else {
        setIsScrolling(false);
      }
    }

    window.addEventListener("scroll", handleScroll);

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <MTNavbar
      shadow={false}
      fullWidth
      blurred={false}
      color={isScrolling ? "white" : "transparent"}
      className="fixed top-0 z-50 border-0" placeholder={undefined} >
      <div className="container mx-auto flex items-center justify-between">
        <Typography
          color={isScrolling ? "blue-gray" : "white"}
          className="text-lg font-bold" placeholder={undefined}  >
          Gastécnica
        </Typography>

        <div className="hidden items-center gap-4 lg:flex">
          <ul
            className={`ml-10 hidden items-center gap-6 lg:flex ${isScrolling ? "text-gray-900" : "text-white"
              }`}
          >
            <a href="https://api.whatsapp.com/send?phone=5584999672214&text=Ol%C3%A1%2C%20gast%C3%A9cnica!">
              <IconButton variant="gradient" placeholder={undefined} >
                <i className="fa-brands fa-whatsapp text-lg"></i>
              </IconButton>
            </a>
            <a href="https://instagram.com/gastecnica__servicos?igshid=NjZiMGI4OTY=">
              <IconButton variant="gradient" placeholder={undefined} >
                <i className="fa-brands fa-instagram text-lg"></i>
              </IconButton>
            </a>
            <Link href="/login" passHref>
              <Button size="lg" variant="gradient" className="flex items-center gap-3" placeholder={undefined} >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                  <path fillRule="evenodd"
                    d="M18.685 19.097A9.723 9.723 0 0021.75 12c0-5.385-4.365-9.75-9.75-9.75S2.25 6.615 2.25 12a9.723 9.723 0 003.065 7.097A9.716 9.716 0 0012 21.75a9.716 9.716 0 006.685-2.653zm-12.54-1.285A7.486 7.486 0 0112 15a7.486 7.486 0 015.855 2.812A8.224 8.224 0 0112 20.25a8.224 8.224 0 01-5.855-2.438zM15.75 9a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z"
                    clipRule="evenodd"></path>
                </svg>
                Login
              </Button>
            </Link>
          </ul>
        </div>
        <IconButton
          variant="text"
          color={isScrolling ? "gray" : "white"}
          onClick={handleOpen}
          className="ml-auto inline-block lg:hidden" placeholder={undefined}>
          {open ? (
            <XMarkIcon strokeWidth={2} className="h-6 w-6" />
          ) : (
            <Bars3Icon strokeWidth={2} className="h-6 w-6" />
          )}
        </IconButton>
      </div>
      <Collapse open={open}>
        <div className="container mx-auto mt-4 rounded-lg bg-white px-6 py-5">
          <ul className="flex gap-4 text-gray-900 justify-center">
            <a href="https://api.whatsapp.com/send?phone=5584999672214&text=Ol%C3%A1%2C%20gast%C3%A9cnica!" >
              <IconButton variant="gradient" placeholder={undefined} >
                <i className="fa-brands fa-whatsapp text-lg"></i>
              </IconButton>
            </a>
            <a href="https://instagram.com/gastecnica__servicos?igshid=NjZiMGI4OTY=">
              <IconButton variant="gradient" placeholder={undefined} >
                <i className="fa-brands fa-instagram text-lg"></i>
              </IconButton>
            </a>
          </ul>
          <div className="mt-6 flex items-center gap-4 justify-center">

            <Link href="/login" passHref>
              <Button size="lg" className="flex items-center gap-3" placeholder={undefined}>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                  <path fillRule="evenodd"
                    d="M18.685 19.097A9.723 9.723 0 0021.75 12c0-5.385-4.365-9.75-9.75-9.75S2.25 6.615 2.25 12a9.723 9.723 0 003.065 7.097A9.716 9.716 0 0012 21.75a9.716 9.716 0 006.685-2.653zm-12.54-1.285A7.486 7.486 0 0112 15a7.486 7.486 0 015.855 2.812A8.224 8.224 0 0112 20.25a8.224 8.224 0 01-5.855-2.438zM15.75 9a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z"
                    clipRule="evenodd"></path>
                </svg>
                Login
              </Button>
            </Link>
          </div>
        </div>
      </Collapse>
    </MTNavbar>
  );
}

export default Navbar;
