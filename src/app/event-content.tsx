"use client";

import {
  Tab,
  Tabs,
  TabsHeader,
  Typography,
} from "@material-tailwind/react";

import EventContentCard from "@/components/event-content-card";


const EVENT_CONTENT = [
  {
    title: "Condomínios e Hotéis",
    des: "Oferecemos serviços de manutenção em fogões, inspeção e manutenção de tubulação de gás, além de vistorias e testes de estanqueidade. Garantimos a segurança e o funcionamento eficiente das instalações de gás em condomínios e hotéis.",



    img: "https://images.pexels.com/photos/6482408/pexels-photo-6482408.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
  },
  {
    title: "Comercial",
    des: "Nossos serviços comerciais incluem manutenção especializada em fogões industriais, inspeção e manutenção de sistemas de tubulação de gás, bem como vistorias e testes de estanqueidade. Trabalhamos para garantir que seus equipamentos e instalações estejam sempre em conformidade com os padrões de segurança.",



    img: "https://images.pexels.com/photos/21710446/pexels-photo-21710446/free-photo-of-restaurante-homem-garcom-cozinha.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
  },
  {
    title: "Residencial",
    des: "Para residências, oferecemos serviços completos de manutenção de fogões, inspeção de tubulações de gás, e realização de vistorias e testes de estanqueidade. Nossa equipe garante a segurança e o bom funcionamento do seu sistema de gás doméstico.",

    img: "https://images.pexels.com/photos/1475938/pexels-photo-1475938.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
  },
];

export function EventContent() {
  return (
    <section className="py-8 px-8 lg:py-20">
      <Tabs value="Day1" className="mb-8">
        <div className="w-full flex mb-8 flex-col items-center">
          <Typography variant="h2" className="text-center" color="blue-gray">
            Áreas de atuação
          </Typography>
        </div>
      </Tabs>
      <div className="mx-auto container">
        {EVENT_CONTENT.map((props, idx) => (
          <EventContentCard key={idx} {...props} />
        ))}
      </div>
    </section>
  );
}

export default EventContent;
