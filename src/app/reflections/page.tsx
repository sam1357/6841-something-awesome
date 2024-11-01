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
            Reflections & Learnings
          </Text>
          <Text fontSize="lg">
            The reflections of the challenges I have completed in one place.
            They are ordered in the order that I completed them.
          </Text>
          <Separator />
          <VStack width="full">
            <AccordionRoot
              collapsible
              variant="enclosed"
              width="full"
              overflow="hidden"
            >
              {Object.values(WriteupInfo).map((writeup, i) => (
                <AccordionItem
                  key={i}
                  value={writeup.title}
                  w="100%"
                  minW="100%"
                >
                  <AccordionItemTrigger>
                    <Text
                      fontSize="xl"
                      fontWeight={800}
                      py={2}
                      whiteSpace="normal"
                      display="flex"
                      flex="1"
                    >
                      {writeup.title}
                    </Text>
                    <Tags tags={writeup.tags} />
                  </AccordionItemTrigger>
                  <AccordionItemContent pb={4} maxW="100%" minW="100%">
                    {writeup.reflection}
                  </AccordionItemContent>
                </AccordionItem>
              ))}
            </AccordionRoot>
          </VStack>
        </VStack>
      </Center>
    </>
  );
}
