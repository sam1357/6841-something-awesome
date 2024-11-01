"use client";

import {
  VStack,
  Text,
  Center,
  Card,
  Stack,
  Heading,
  HStack,
  Box,
  Flex,
  Separator,
} from "@chakra-ui/react";
import { FaBrain, FaCode, FaPencilAlt } from "react-icons/fa";

type cardDetail = {
  title: string;
  description: string;
  icon: JSX.Element;
  href: string;
};

const cardDetails: cardDetail[] = [
  {
    title: "Challenges & Writeups",
    description: "Details of the challenges I have completed and the writeups",
    icon: <FaPencilAlt size="30px" color="green" />,
    href: "/challenges",
  },
  {
    title: "Reflections",
    description:
      "A summary of the reflections on the challenges I have completed, and what I have learnt",
    icon: <FaBrain size="30px" color="teal" />,
    href: "/reflections",
  },
  {
    title: "Hack the Box",
    description: "Try out the challenges yourself!",
    icon: <FaCode size="30px" color="blue" />,
    href: "https://app.hackthebox.com/",
  },
];

function Cards() {
  return (
    <Stack gap={4} w="100%">
      {cardDetails.map((card) => (
        <Card.Root
          key={card.title}
          size="md"
          pb={6}
          w="100%"
          shadow="lg"
          _hover={{ background: "gray.100" }}
          cursor="pointer"
          onClick={() => {
            if (card.href) {
              window.location.href = card.href;
            }
          }}
        >
          <Card.Header>
            <HStack gap={4}>
              {card.icon}
              <Flex direction="column" gap={0}>
                <Heading size="xl">{card.title}</Heading>
                <Text fontSize="md" color="gray.600" fontWeight={100}>
                  {card.description}
                </Text>
              </Flex>
            </HStack>
          </Card.Header>
        </Card.Root>
      ))}
    </Stack>
  );
}

export default function Home() {
  return (
    <Center w="100%">
      <VStack maxW="50%">
        <Text fontSize="2xl" fontWeight={600}>
          Welcome to Sam's (z5418112) Something Awesome COMP6841 Project!
        </Text>
        <Text fontSize="lg" fontWeight={400}>
          This website serves as a portfolio of my work for COMP6841. It
          includes a collection of challenges and reflections that I have
          completed throughout the term.
        </Text>
        <Text fontSize="lg" fontWeight={400}>
          These challenges that were completed are hosted on Hack The Box, and I
          encourage you to try them out yourself as well!
        </Text>
        <Text fontSize="lg" fontWeight={400}>
          The reason why I chose to do web challenges for my Something Awesome
          Project is because I wanted to learn more about web security and how
          to exploit web vulnerabilities. It's something that we interact with
          everyday, so I thought it would be interesting to learn more about how
          engineers can and should protect their web applications.
        </Text>
        <Separator />
        <Box py={2}></Box>
        <Cards />
      </VStack>
    </Center>
  );
}
