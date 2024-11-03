import { LinkButton } from "@/components/ui/link-button";
import WriteupWrapper from "@/components/WriteupWrapper";
import { WriteupInfo } from "@/writeups";
import { Flex, Heading, Text } from "@chakra-ui/react";

export default async function WriteupPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const slug = (await params).slug;

  if (!slug || typeof slug !== "string") {
    return <Heading size="lg">Loading...</Heading>;
  }

  const writeup = WriteupInfo[slug];

  if (!writeup) {
    return (
      <Flex
        textAlign="center"
        flexDir="column"
        p={5}
        h="calc(100vh - 70px)"
        justifyContent="center"
        alignContent="center"
      >
        <Heading size="lg">Oops! Writeup Not Found</Heading>
        <Text mt={2}>
          It seems that the writeup you are looking for doesn't exist.
        </Text>
        <Flex justifyContent="center">
          <LinkButton
            href="/challenges"
            mt={4}
            colorPalette="teal"
            w={{ base: "70%", md: "30%", xl: "10%" }}
          >
            Return to challenges
          </LinkButton>
        </Flex>
      </Flex>
    );
  }

  return <WriteupWrapper writeup={writeup} />;
}
