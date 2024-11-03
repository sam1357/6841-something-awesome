"use client";

import { FC, useEffect, useState } from "react";
import { WriteupType, WriteupInfo } from "@/writeups";
import {
  Box,
  Flex,
  Center,
  Separator,
  Link,
  Text,
  Button,
  HStack,
} from "@chakra-ui/react";
import { FaArrowUp, FaClock } from "react-icons/fa";
import {
  BreadcrumbCurrentLink,
  BreadcrumbLink,
  BreadcrumbRoot,
} from "@/components/ui/breadcrumb";
import { Tooltip } from "@/components/ui/tooltip";
import { Tags } from "./Tags";
import { PrevOrNext } from "./WriteupCards";
import { LuExternalLink } from "react-icons/lu";

interface WriteupWrapperProps {
  writeup: WriteupType;
}

const WriteupWrapper: FC<WriteupWrapperProps> = ({ writeup }) => {
  const [isVisible, setIsVisible] = useState(false);

  const writeups = Object.values(WriteupInfo);
  const currentIndex = writeups.findIndex((w) => w.title === writeup.title);
  const prevWriteup = writeups[currentIndex - 1];
  const nextWriteup = writeups[currentIndex + 1];

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.scrollY > 800) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener("scroll", toggleVisibility);

    return () => window.removeEventListener("scroll", toggleVisibility);
  }, []);

  return (
    <>
      {isVisible && (
        <Tooltip content="Scroll to top" openDelay={0} closeDelay={100}>
          <Box
            onClick={scrollToTop}
            position="fixed"
            bottom="20px"
            right="16px"
            zIndex={3}
          >
            <Button
              size={"xl"}
              colorPalette="teal"
              variant="surface"
              rounded="2xl"
            >
              <FaArrowUp />
            </Button>
          </Box>
        </Tooltip>
      )}
      <Center p={4}>
        <Flex maxW={{ md: "90%", xl: "60%" }} gap={3} direction="column">
          <BreadcrumbRoot size="md">
            <BreadcrumbLink href="/challenges">Challenges</BreadcrumbLink>
            <BreadcrumbCurrentLink>{writeup.title}</BreadcrumbCurrentLink>
          </BreadcrumbRoot>
          <Separator />
          <Link
            href={writeup.challengeLink}
            colorPalette="teal"
            target="_blank"
            variant="underline"
            fontSize={30}
            fontWeight={900}
          >
            {writeup.title} <LuExternalLink />
          </Link>
          <Text fontWeight={700}>
            By:{" "}
            <Link
              href={writeup.authorLink}
              fontWeight={400}
              variant="underline"
              target="_blank"
              colorPalette="teal"
            >
              {writeup.author} <LuExternalLink />
            </Link>
          </Text>
          <HStack>
            <FaClock />
            <Text>{writeup.timeTaken}</Text>
          </HStack>
          <Tags tags={writeup.tags} />
          <Separator />
          <Box>{writeup.content}</Box>
          <Separator />
          <Text fontSize="xl" fontWeight={800}>
            Reflection and Learnings
          </Text>
          <Box>{writeup.reflection}</Box>
          <Separator />
          <Flex
            justifyContent={{ base: "center", md: "space-between" }}
            flexDirection={{ base: "column", md: "row" }}
            gap={{ base: 4, md: 0 }}
            flexWrap="wrap"
          >
            {prevWriteup ? (
              <PrevOrNext writeup={prevWriteup} type="Last" />
            ) : (
              <Box flex="1" display={{ base: "none", md: "flex" }} />
            )}
            {nextWriteup ? (
              <PrevOrNext writeup={nextWriteup} type="Next" />
            ) : (
              <Box flex="1" display={{ base: "none", md: "flex" }} />
            )}
          </Flex>
        </Flex>
      </Center>
    </>
  );
};

export default WriteupWrapper;
