"use client";

import {
  VStack,
  Text,
  Center,
  Separator,
  Heading,
  Grid,
  GridItem,
} from "@chakra-ui/react";
import { Tag } from "@/components/ui/tag";
import { WriteupInfo } from "@/writeups";
import { SummaryCard } from "@/components/WriteupCards";

export default function Challenges() {
  return (
    <>
      <Center w="100%" p={4}>
        <VStack maxW={{ md: "90%", xl: "70%" }} gap={3}>
          <Text fontSize="2xl" fontWeight={600}>
            Challenges
          </Text>
          <Text fontSize="lg">
            Details of the challenges I have completed and the writeups of them.
            They are ordered in the order that I completed them, so you can see
            the way I went about solving them over time.
          </Text>
          <Separator />
          <Heading size="2xl">Tags Legend</Heading>
          <Grid templateColumns="repeat(8, 1fr)" gap={3}>
            <Tag
              size="xl"
              colorPalette="green"
              rounded="2xl"
              justifyContent="center"
            >
              Easy
            </Tag>
            <GridItem colSpan={7} pt="3px">
              <Text>
                Challenges that were easy took little extra research, and/or
                were solved within a little over an hour.
              </Text>
            </GridItem>
            <Tag
              size="xl"
              colorPalette="orange"
              rounded="2xl"
              justifyContent="center"
            >
              Medium
            </Tag>
            <GridItem colSpan={7}>
              <Text>
                Challenges that were medium took a bit more research, and/or
                were solved within a few hours. They often involved either new
                concepts or utilised languages that I was not as familiar with.
              </Text>
            </GridItem>
            <Tag
              size="xl"
              colorPalette="red"
              rounded="2xl"
              justifyContent="center"
            >
              Hard
            </Tag>
            <GridItem colSpan={7}>
              <Text>
                Challenges that were hard took a lot of research, and/or were
                solved over the course of a few days. They often involved steps,
                each of which required a lot of effort to solve.
              </Text>
            </GridItem>
            <Tag
              size="xl"
              colorPalette="purple"
              rounded="2xl"
              justifyContent="center"
            >
              Language
            </Tag>
            <GridItem colSpan={7}>
              <Text>The main languages that were used in the challenge.</Text>
            </GridItem>
            <Tag
              size="xl"
              colorPalette="blue"
              rounded="2xl"
              justifyContent="center"
            >
              Attack Type
            </Tag>
            <GridItem colSpan={7}>
              <Text>
                The main type of attack that was used in the challenge. This
                could be anything from a buffer overflow to a SQL injection.
              </Text>
            </GridItem>
          </Grid>
          <Separator />
          <Grid
            templateColumns={{
              base: "repeat(1, 1fr)",
              md: "repeat(2, 1fr)",
              xl: "repeat(3, 1fr)",
            }}
            gap={4}
            w="100%"
          >
            {Object.values(WriteupInfo).map((writeup, i) => (
              <SummaryCard key={i} writeup={writeup} />
            ))}
          </Grid>
        </VStack>
      </Center>
    </>
  );
}
