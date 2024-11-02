import { Icon, HStack, Heading } from "@chakra-ui/react";
import {
  AccordionItem,
  AccordionItemContent,
  AccordionItemTrigger,
  AccordionRoot,
} from "@/components/ui/accordion";
import { FaFish } from "react-icons/fa";
import { FaArrowsTurnToDots } from "react-icons/fa6";

export enum AccordionType {
  RED_HERRING,
  SIDETRACK,
}

export default function CustomAccordion({
  type,
  title,
  children,
}: {
  type: AccordionType;
  title: string;
  children: JSX.Element[];
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
        <AccordionItemTrigger>
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
