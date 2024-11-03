"use client";

import {
  Text,
  Center,
  Card,
  Stack,
  Heading,
  HStack,
  Link,
  Box,
  Flex,
  Separator,
  LinkOverlay,
} from "@chakra-ui/react";
import { MdTipsAndUpdates } from "react-icons/md";
import { FaBrain, FaCode, FaPencilAlt } from "react-icons/fa";
import { LuExternalLink } from "react-icons/lu";

type cardDetail = {
  title: string;
  description: string;
  icon: JSX.Element;
  href: string;
  isExternal?: boolean;
};

const cardDetails: cardDetail[] = [
  {
    title: "Reflections",
    description:
      "A summary of the reflections on the challenges I have completed, and what I have learnt",
    icon: <FaBrain size="30px" color="teal" />,
    href: "/reflections",
  },
  {
    title: "Challenges & Writeups",
    description: "Details of the challenges I have completed and the writeups",
    icon: <FaPencilAlt size="30px" color="green" />,
    href: "/challenges",
  },
  {
    title: "Methodology and Tips",
    description:
      "Learn more about the overall methodology I went about doing these challenges, and tips and tricks for solving these for yourself",
    icon: <MdTipsAndUpdates size="30px" color="purple" />,
    href: "/method",
  },
  {
    title: "Try it yourself!",
    description: "Complete some Hack the Box challenges for yourself!",
    icon: <FaCode size="30px" color="orange" />,
    href: "https://app.hackthebox.com",
    isExternal: true,
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
          _hover={{ background: "teal.muted" }}
        >
          <LinkOverlay
            href={card.href}
            target={card.isExternal ? "_blank" : "_self"}
          />
          <Card.Header>
            <HStack gap={4}>
              {card.icon}
              <Flex direction="column" gap={0}>
                <HStack>
                  <Heading size="xl">{card.title}</Heading>
                  {card.isExternal && <LuExternalLink />}
                </HStack>
                <Text fontSize="md" fontWeight={100}>
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
    <Center w="100%" p={4}>
      <Flex maxW={{ md: "90%", xl: "50%" }} direction="column" gap={2}>
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
          to exploit web vulnerabilities.
        </Text>
        <Text fontSize="lg" fontWeight={400}>
          It's something that we interact with everyday, so I thought it would
          be interesting to learn more about how engineers can and should
          protect their web applications.
        </Text>
        <Separator />
        <Box py={2}></Box>
        <Cards />
        <Separator />
        <Text
          fontSize="sm"
          fontWeight={200}
          fontStyle="italic"
          color={{ base: "gray.900", _dark: "gray.400" }}
        >
          The idea of this project was heavily inspired by Jason Liu's{" "}
          <Link
            href="https://stegosaurus21.github.io/6841-hack-the-web/"
            target="_blank"
          >
            project <LuExternalLink />
          </Link>
          . However all write-ups, challenges, reflections as well we this
          website are my own.
        </Text>
      </Flex>
    </Center>
  );
}
