"use client";

import { Typography } from "@material-tailwind/react";
import AboutCard from "@/components/about-card";

const EVENT_INFO = [
  {
    title: "Manutenção em Fogões",
    description:
      "Assegure a segurança e eficiência dos seus fogões a gás com nossa manutenção especializada.",
    subTitle: "Serviço Completo",
    img: "https://images.pexels.com/photos/6937447/pexels-photo-6937447.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
  },
  {
    title: "Manutenção Preventiva",
    description:
      "Mantenha sua cozinha sempre funcional e evite problemas futuros com nossa manutenção preventiva.",
    subTitle: "Revisão Periódica",
    img: "https://images.pexels.com/photos/10324702/pexels-photo-10324702.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
  },
];


export function AboutEvent() {
  return (
    <section className="container mx-auto flex flex-col items-center px-4 py-10">
      <Typography variant="h3" className="text-center" color="blue-gray">
        Por que escolher a Gastécnica?
      </Typography>
      <Typography
        variant="lead"
        className="mt-2 lg:max-w-4xl mb-8 w-full text-center font-normal !text-gray-500"
      >
        Opte pela Gastécnica e tenha a certeza de contar com uma equipe
        especializada e comprometida em oferecer serviços de alta qualidade e
        resultados duradouros.
      </Typography>
      <div className="mt-8 w-full grid grid-cols-1 md:grid-cols-2 gap-4 ">
        {EVENT_INFO.map((props, idx) => (
          <AboutCard key={idx} {...props} />
        ))}
      </div>
    </section>
  );
}

export default AboutEvent;
