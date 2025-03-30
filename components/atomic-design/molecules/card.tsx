import React from "react";
import { Image } from "@/components/atomic-design/atoms/images/image";
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
    <div className="border rounded-lg shadow-md p-4 max-w-sm">
      {/* Image */}
      <Image src={imageSrc} alt={title} />

      {/* Text */}
      <div className="mt-4">
        <Title>{text}</Title>
      </div>

      {/* Buttons */}
      <div className="mt-4 flex gap-2">
        {buttons.map((button, index) => (
          <Button key={index} onClick={button.onClick} >
            {button.label}
          </Button>
        ))}
      </div>
    </div>
  );
};