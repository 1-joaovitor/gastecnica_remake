"use client";
import Image from "next/image";
import { Button } from "@material-tailwind/react";

export function FixedPlugin() {
  return (
    <a href={`https://api.whatsapp.com/send?phone=5584999642214&text=Ol%C3%A1%2C%20gast%C3%A9cnica!`} target="_blank">
      <Button
        color="green"
        size="sm"
        className="!fixed bottom-4 right-4 flex gap-1 pl-2 items-center border border-blue-gray-50"
      >
        <i class="fa-brands fa-whatsapp text-lg"></i>
        Mande uma mensagem
      </Button>
    </a>
  );
}
