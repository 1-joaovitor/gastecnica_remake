import React from "react";
import {
  Navbar as MTNavbar,
  Collapse,

  IconButton,
  Typography,
} from "@material-tailwind/react";
import {
  RectangleStackIcon,
  UserCircleIcon,

  XMarkIcon,
  Bars3Icon,
} from "@heroicons/react/24/solid";

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
        className="flex items-center gap-2 font-medium" placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}      >
        {children}
      </Typography>
    </li>
  );
}

const NAV_MENU = [
  {
    name: "WhatsApp",
    icon: RectangleStackIcon,
  },
  {
    name: "Youtube",
    icon: UserCircleIcon,
  },
  {
    name: "Instagram",
    icon: UserCircleIcon,
    href: "https://www.material-tailwind.com/docs/react/installation",
  },
];

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
      className="fixed top-0 z-50 border-0" placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}    >
      <div className="container mx-auto flex items-center justify-between">
        <Typography
          color={isScrolling ? "blue-gray" : "white"}
          className="text-lg font-bold" placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}        >
          Gastécnica
        </Typography>

        <div className="hidden items-center gap-4 lg:flex">
          {/*<Button color={isScrolling ? "gray" : "white"}>Login</Button>*/}
          <ul
            className={`ml-10 hidden items-center gap-6 lg:flex ${isScrolling ? "text-gray-900" : "text-white"
              }`}
          >
            <a href="https://api.whatsapp.com/send?phone=5584999672214&text=Ol%C3%A1%2C%20gast%C3%A9cnica!">
              <IconButton variant="gradient" placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
                <i className="fa-brands fa-whatsapp text-lg"></i>
              </IconButton>
            </a>
            <a href="https://instagram.com/gastecnicapecaseservicos?igshid=NjZiMGI4OTY=">
              <IconButton variant="gradient" placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
                <i className="fa-brands fa-instagram text-lg"></i>
              </IconButton>
            </a>
            { /*<a href="#buttons-with-link">
              <IconButton variant="gradient">
                <i class="fa-brands fa-youtube text-lg"></i>
              </IconButton>
            </a>*/}
          </ul>
        </div>
        <IconButton
          variant="text"
          color={isScrolling ? "gray" : "white"}
          onClick={handleOpen}
          className="ml-auto inline-block lg:hidden" placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}        >
          {open ? (
            <XMarkIcon strokeWidth={2} className="h-6 w-6" />
          ) : (
            <Bars3Icon strokeWidth={2} className="h-6 w-6" />
          )}
        </IconButton>
      </div>
      <Collapse open={open}>
        <div className="container mx-auto mt-4 rounded-lg bg-white px-6 py-5">
          <ul className="flex  gap-4 text-gray-900 justify-center">
            <a href="https://api.whatsapp.com/send?phone=5584999672214&text=Ol%C3%A1%2C%20gast%C3%A9cnica!" >
              <IconButton variant="gradient" placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
                <i className="fa-brands fa-whatsapp text-lg"></i>
              </IconButton>
            </a>
            <a href="https://instagram.com/gastecnica_servicos?igshid=NjZiMGI4OTY=">
              <IconButton variant="gradient" placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
                <i className="fa-brands fa-instagram text-lg"></i>
              </IconButton>
            </a>
            {/* <a href="#buttons-with-link">
              <IconButton variant="gradient">
                <i class="fa-brands fa-youtube text-lg"></i>
              </IconButton>
            </a>*/}
          </ul>
          <div className="mt-6 flex items-center gap-4 justify-center">
            {/*  <a href="#" target="_blank">
              <Button color="gray">Login</Button>
            </a>*/}
          </div>
        </div>
      </Collapse>
    </MTNavbar>
  );
}

export default Navbar;
