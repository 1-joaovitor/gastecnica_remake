"use client";

import React from "react";
import { Typography, Accordion, AccordionHeader, AccordionBody } from "@material-tailwind/react";

const FAQS = [
  {
    title: "1. Quais são os sinais de que meu fogão precisa de manutenção?",
    desc: "Os sinais comuns incluem chamas irregulares, dificuldade para acender os queimadores, cheiro de gás, e desempenho reduzido do fogão. Se notar algum desses problemas, é hora de uma manutenção.",
  },
  {
    title: "2. Com que frequência devo realizar a manutenção do meu fogão?",
    desc: "Recomenda-se realizar a manutenção do fogão pelo menos uma vez por ano para garantir seu bom funcionamento e segurança. No entanto, se o fogão for usado com muita frequência, a manutenção pode ser necessária com mais regularidade.",
  },
  {
    title: "3. O que inclui a inspeção de tubulação de gás?",
    desc: "A inspeção de tubulação de gás inclui a verificação de possíveis vazamentos, inspeção das conexões e válvulas, e avaliação geral do estado das tubulações. É um processo essencial para garantir a segurança do sistema de gás.",
  },
  {
    title: "4. O que é um teste de estanqueidade?",
    desc: "Um teste de estanqueidade é um procedimento utilizado para verificar a integridade das tubulações de gás, assegurando que não há vazamentos. Este teste é fundamental para garantir a segurança das instalações de gás.",
  },
  {
    title: "5. Vocês oferecem suporte emergencial para reparos de fogões?",
    desc: "Sim, oferecemos suporte emergencial para reparos de fogões. Caso tenha um problema urgente, entre em contato conosco e enviaremos um técnico o mais rápido possível.",
  },
  {
    title: "6. Como posso saber se minha tubulação de gás está com problemas?",
    desc: "Os sinais de problemas na tubulação de gás incluem cheiro de gás, aumento inexplicável no consumo de gás, e problemas nos aparelhos conectados ao sistema de gás. Se suspeitar de qualquer problema, é importante realizar uma inspeção imediatamente.",
  },
  {
    title: "7. Vocês realizam a instalação de novas tubulações de gás?",
    desc: "Sim, realizamos a instalação de novas tubulações de gás, seguindo todos os padrões de segurança e regulamentações. Entre em contato para uma consulta e orçamento.",
  },
  {
    title: "8. Quais são os procedimentos de segurança durante a inspeção de gás?",
    desc: "Durante a inspeção de gás, nossos técnicos utilizam equipamentos especializados para detectar vazamentos, verificam todas as conexões e válvulas, e seguem rigorosamente os protocolos de segurança para garantir que o sistema esteja seguro e em conformidade.",
  },
  {
    title: "9. O que é uma vistoria de gás e por que ela é importante?",
    desc: "Uma vistoria de gás é uma avaliação completa do sistema de gás para garantir que está funcionando corretamente e em segurança. É importante para prevenir acidentes e garantir a eficiência do sistema.",
  },
  {
    title: "10. Com que frequência devo realizar vistorias de gás?",
    desc: "Recomenda-se realizar vistorias de gás pelo menos uma vez por ano. No entanto, se houver qualquer suspeita de problema, é importante realizar uma vistoria imediatamente.",
  },
];


export function Faq() {
  const [open, setOpen] = React.useState(0);
  const handleOpen = (value: number) => setOpen(open === value ? 0 : value);

  return (
    <section className="py-8 px-8 lg:py-20">
      <div className="container mx-auto">
        <div className="text-center">
          <Typography variant="h1" color="blue-gray" className="mb-4">
            Perguntas frequentes
          </Typography>
          <Typography
            variant="lead"
            className="mx-auto mb-24 lg:w-3/5 !text-gray-500"
          >
            Bem-vindo à seção de Perguntas Frequentes. Aqui, você encontrará respostas para as dúvidas mais comuns sobre nossos serviços de manutenção em fogões, tubulação de gás, vistorias e testes de estanqueidade. Estamos aqui para fornecer as informações necessárias para garantir a segurança e eficiência de suas instalações de gás.
          </Typography>
        </div>

        <div className="mx-auto lg:max-w-screen-lg lg:px-20">
          {FAQS.map(({ title, desc }, key) => (
            <Accordion
              key={key}
              open={open === key + 1}
              onClick={() => handleOpen(key + 1)}
            >
              <AccordionHeader className="text-left text-gray-900">
                {title}
              </AccordionHeader>
              <AccordionBody>
                <Typography
                  color="blue-gray"
                  className="font-normal text-gray-500"
                >
                  {desc}
                </Typography>
              </AccordionBody>
            </Accordion>
          ))}
        </div>
      </div>
    </section>
  );
}


export default Faq;
