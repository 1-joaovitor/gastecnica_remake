"use client";

import { Typography } from "@material-tailwind/react";
import StatsCard from "@/components/stats-card";

const STATS = [
  {
    count: "1500",
    title: "Clientes Atendidos",
  },
  {
    count: "500",
    title: "Projetos Concluídos",
  },
  {
    count: "20",
    title: "Anos de Experiência",
  },


  {
    count: "95%",
    title: "Taxa de Satisfação do Cliente",
  },

];

export function OurStats() {
  return (
    <section className="container mx-auto grid gap-10 px-8 py-20 lg:grid-cols-1 lg:gap-20 xl:grid-cols-2 xl:place-items-center">
      <div>
        <Typography variant="h6" color="orange" className="mb-6 font-medium" placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
          Nossos Resultados
        </Typography>
        <Typography
          className="text-5xl font-bold leading-tight lg:w-3/4"
          color="blue-gray" placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}        >
          Destaques
        </Typography>
        <Typography
          variant="lead"
          className="mt-3 w-full !text-gray-500 lg:w-9/12" placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}        >
          Com mais de 20 anos de dedicação ao mercado, a Gastécnica continua a
          ser a escolha número um para clientes que buscam experiência e
          compromisso em tubulação de gás e fogões.
        </Typography>
      </div>
      <div>
        <div className="grid grid-cols-2 gap-8 gap-x-28">
          {STATS.map((props, key) => (
            <StatsCard key={key} {...props} />
          ))}
        </div>
      </div>
    </section>
  );
}

export default OurStats;
