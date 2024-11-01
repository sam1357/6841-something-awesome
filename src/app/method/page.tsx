"use client";

import {
  VStack,
  Text,
  Center,
  Separator,
  AccordionItem,
  AccordionItemContent,
  AccordionItemTrigger,
  AccordionRoot,
} from "@chakra-ui/react";
import { WriteupInfo } from "@/writeups";
import { Tags } from "@/components/Tags";

export default function Reflections() {
  return (
    <>
      <Center w="100%" p={4}>
        <VStack maxW={{ md: "90%", xl: "60%" }} gap={3}>
          <Text fontSize="2xl" fontWeight={600}>
            Methodology, Tips & Tricks
          </Text>
        </VStack>
      </Center>
    </>
  );
}
