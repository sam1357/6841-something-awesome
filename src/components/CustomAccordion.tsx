import { Icon, HStack, Heading } from "@chakra-ui/react";
import {
  AccordionItem,
  AccordionItemContent,
  AccordionItemTrigger,
  AccordionRoot,
} from "@/components/ui/accordion";
import { FaFish } from "react-icons/fa";
import { FaArrowsTurnToDots, FaCode } from "react-icons/fa6";
import React from "react";
import { BiCode } from "react-icons/bi";

export enum AccordionType {
  RED_HERRING,
  SIDETRACK,
  CODE,
}

export default function CustomAccordion({
  type,
  title,
  children,
}: {
  type: AccordionType;
  title: string;
  children: React.ReactNode;
}) {
  let icon: JSX.Element;
  let colour: string;
  let titleType: string;

  switch (type) {
    case AccordionType.RED_HERRING:
      icon = <FaFish />;
      colour = "red";
      titleType = "Red Herring";
      break;
    case AccordionType.SIDETRACK:
      icon = <FaArrowsTurnToDots />;
      colour = "green";
      titleType = "Sidetrack";
      break;
    case AccordionType.CODE:
      icon = <FaCode />;
      colour = "purple";
      titleType = "Code";
      break;
  }

  return (
    <AccordionRoot
      collapsible
      defaultValue={["info"]}
      variant="enclosed"
      shadow="lg"
      size="lg"
    >
      <AccordionItem value={title}>
        <AccordionItemTrigger cursor="pointer">
          <HStack gap={2}>
            <Icon fontSize="xl" color={colour}>
              {icon}
            </Icon>
            <Heading fontWeight={800}>
              {titleType} - {title}
            </Heading>
          </HStack>
        </AccordionItemTrigger>
        <AccordionItemContent>{children}</AccordionItemContent>
      </AccordionItem>
    </AccordionRoot>
  );
}
