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
import ExternalLink from "@/components/ExternalLink";

export default function Reflections() {
  const challengeRootPath = "/challenges";

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
          <Text>
            I have found that writing reflections on the challenges I have
            completed has been very beneficial in helping me understand the
            concepts and techniques that I have learned. It has also helped me
            to remember what I should do in future challenges, and can serve as
            a good resource for people who are looking to learn more about
            penetration testing as well.
          </Text>
          <Separator />
          <VStack width="full">
            <AccordionRoot
              multiple
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
                  <AccordionItemTrigger cursor="pointer">
                    <Text
                      fontSize="xl"
                      fontWeight={800}
                      py={2}
                      whiteSpace="normal"
                      display="flex"
                      textAlign="left"
                      flex="1"
                    >
                      <ExternalLink
                        href={`${challengeRootPath}/${writeup.slug}`}
                        title={writeup.title}
                      />
                    </Text>
                    <Tags tags={writeup.tags} flexDirection="row-reverse" />
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
