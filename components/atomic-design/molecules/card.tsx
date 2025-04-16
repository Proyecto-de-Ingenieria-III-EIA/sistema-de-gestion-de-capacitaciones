import React from "react";
import { Img } from "@/components/atomic-design/atoms/images/image";
import { Button } from "@/components/ui/button";
import { Title } from "../atoms/texts/title";

interface CardProps {
  imageSrc: string;
  title: string;
  text: string;
  buttons: { label: string; onClick: () => void }[];
}

export const Card: React.FC<CardProps> = ({ imageSrc, title, text, buttons }) => {
  return (
    <div className="border rounded-lg shadow-md p-1" style={{ width: "200", height: "300" }}>
      {/* Image */}
      <div className="relative mx-auto w-[250px] h-[120px]">
        <Img src={imageSrc} alt={title} className="rounded" />
      </div>

      {/* Text */}
      <div className="mt-4">
        <Title>{title}</Title>
        <h2 className="text-lg font-semibold">{text}</h2>
      </div>

      {/* Buttons */}
      <div className="mt-4 flex gap-2 p-2">
        {buttons.map((button, index) => (
          <Button key={index} onClick={button.onClick} >
            {button.label}
          </Button>
        ))}
      </div>
    </div>
  );
};