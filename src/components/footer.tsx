import { Typography, Button, IconButton } from "@material-tailwind/react";

const CURRENT_YEAR = new Date().getFullYear();
const LINKS = ["Company", "About Us", "Team", "Products", "Blog"];

export function Footer() {
  return (
    <footer className="pb-5 p-10 md:pt-10">
      <div className="container flex flex-col mx-auto">
        { /*  <div className="flex !w-full py-10 mb-5 md:mb-20 flex-col justify-center !items-center bg-gray-900 max-w-6xl mx-auto rounded-2xl p-5 ">
          <Typography
            className="text-2xl md:text-3xl text-center font-bold "
            color="white"
          >
            Join now and get 30% OFF!
          </Typography>
          <Typography
            color="white"
            className=" md:w-7/12 text-center my-3 !text-base"
          >
            Don&apos;t miss out on this exclusive offer that will end soon.
          </Typography>
          <div className="flex w-full md:w-fit gap-3 mt-2 flex-col md:flex-row">
            <Button color="white" size="md">
              buy ticket
            </Button>
          </div>
        </div>*/}
        <div className="flex flex-col md:flex-row items-center !justify-between">
          <Typography
            as="a"

            target="_blank"
            variant="h6"
            className="text-gray-900"  placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}          >
            Gastécnica
          </Typography>

          <div className="flex w-fit justify-center gap-2">
            <a href="https://api.whatsapp.com/send?phone=5584999642214&text=Ol%C3%A1%2C%20gast%C3%A9cnica!" >
              <IconButton size="sm" color="gray" variant="text"  placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
                <i className="fa-brands fa-whatsapp text-lg"></i>
              </IconButton>
            </a>
            <a href="https://instagram.com/gastecnica_servicos?igshid=NjZiMGI4OTY=">
              <IconButton size="sm" color="gray" variant="text"  placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
                <i className="fa-brands fa-instagram text-lg" />
              </IconButton>
            </a>



          </div>
        </div>
        <Typography
          color="blue-gray"
          className="text-center mt-12 font-normal !text-gray-700"  placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}        >
          &copy; {CURRENT_YEAR} Gastecnica{" "}
          <a target="_blank">
            todos os direitos
          </a>{" "}

          <a target="_blank">
            reservados
          </a>
          .
        </Typography>
      </div>
    </footer>
  );
}

export default Footer;
