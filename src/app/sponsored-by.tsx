"use client";

import Image from "next/image";
import { Typography } from "@material-tailwind/react";

const SPONSORS = [
  "Tubulações de gás Industrial/Residencial",
  "Teste de estanqueidade",
  "Manuteções preventivas",
  "Manutenções em fogões Industrial/Residencial",
  "Vistorias Técnicas",
];

export function SponsoredBy() {
  return (
    <section className="py-8 px-8 lg:py-20">
      <div className="container mx-auto text-center">
        <Typography variant="h4" color="blue-gray" className="mb-8">
          Serviços Oferecidos
        </Typography>
        <div className="flex flex-wrap items-center justify-center gap-0 lg:gap-6">
          {SPONSORS.map((name, key) => (
            <Typography variant="h6" color="blue-gray" className="mb-8">{name}</Typography>
          ))}
        </div>
      </div>
    </section>
  );
}

export default SponsoredBy;
