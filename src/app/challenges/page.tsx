"use client";

import { VStack, Text, Center, Separator } from "@chakra-ui/react";

export default function Challenges() {
  return (
    <Center w="100%">
      <VStack maxW="50%">
        <Text fontSize="2xl" fontWeight={600}>
          Challenges
        </Text>
        <Text fontSize="lg">
          Details of the challenges I have completed and the writeups of them.
          They are ordered in the order that I completed them, so you can see
          the way I went about solving them over time.
        </Text>
        <Separator />
      </VStack>
    </Center>
  );
}
