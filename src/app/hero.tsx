"use client";

import { IconButton, Button, Typography } from "@material-tailwind/react";
import { PlayIcon } from "@heroicons/react/24/solid";

function Hero() {
  return (
    <div className="relative min-h-screen w-full bg-[url('https://images.pexels.com/photos/4063198/pexels-photo-4063198.png?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1')] bg-cover bg-no-repeat">
      <div className="absolute inset-0 h-full w-full bg-gray-900/60" />
      <div className="grid min-h-screen px-8">
        <div className="container relative z-10 my-auto mx-auto grid place-items-center text-center">
          <Typography variant="h1" color="white" className="lg:max-w-3xl">
            Seja bem-vindo à Gastécnica!
          </Typography>
          <Typography
            variant="lead"
            color="white"
            className="mt-1 mb-12 w-full md:max-w-full lg:max-w-2xl"
          >
            Sua parceira confiável em tubulações de gás e cuidados com fogões.
            Estamos aqui para garantir que tudo funcione perfeitamente.
          </Typography>

        </div>
      </div>
    </div>
  );
}

export default Hero;
