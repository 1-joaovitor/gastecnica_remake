import {
  Card,
  CardBody,
  Typography,
  Button,
  CardHeader,
} from "@material-tailwind/react";
import Image from "next/image";
interface AboutCardProp {
  title: string;
  subTitle: string;
  description: string;
  img: string
}

export function AboutCard({ title, description, subTitle, img }: AboutCardProp) {
  return (
    <Card className="w-full max-w-[48rem] flex-row" placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
      <CardHeader
        shadow={false}
        floated={false}
        className="m-0 w-2/5 shrink-0 rounded-r-none" placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}      >
        <Image
          height={200}
          width={200}
          src={img}
          alt="card-image"
          className="h-full w-full object-cover"
        />
      </CardHeader>
      <CardBody placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
        <Typography variant="h6" color="gray" className="mb-4 uppercase" placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
          {subTitle}
        </Typography>
        <Typography variant="h4" color="blue-gray" className="mb-2" placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
          {title}
        </Typography>
        <Typography color="gray" className="mb-8 font-normal" placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
          {description}
        </Typography>

      </CardBody>
    </Card>
  );
}


export default AboutCard;
