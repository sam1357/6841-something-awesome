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
  Heading,
  List,
  Button,
  Group,
  Stack,
  Code,
  HStack,
  StepsCompletedContent,
} from "@chakra-ui/react";
import {
  StepsRoot,
  StepsList,
  StepsItem,
  StepsContent,
  StepsPrevTrigger,
  StepsNextTrigger,
} from "@/components/ui/steps";
import { WriteupInfo } from "@/writeups";
import { Tags } from "@/components/Tags";
import ExternalLink from "@/components/ExternalLink";
import { Alert } from "@/components/ui/alert";

export default function Reflections() {
  const challengeRootPath = "/challenges";

  return (
    <>
      <Center w="100%" p={4}>
        <VStack maxW={{ md: "90%", xl: "60%" }} gap={3}>
          <Text fontSize="2xl" fontWeight={800}>
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
            a good resource for people who are looking to learn more about web
            pen testing as well.
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
          <Separator />
          <Heading size="2xl" fontWeight={800}>
            Overall Learnings
          </Heading>
          <List.Root>
            <List.Item>
              I have learned a lot from doing these challenges - from the many
              different types of web vulnerabilities that exist, how they can be
              exploited, and the tools and techniques that are used in web pen
              testing.
            </List.Item>
            <List.Item>
              In the beginning, I found it difficult to know what exactly I was
              looking for and was to do. I didn't have a clear methodology or
              process to follow. However, as I did more challenges, I started
              taking the time to perform proper recon, plan, research before
              executing the attacks. This helped me follow a more clear-cut
              path, and allowed me to more efficiently and effectively find and
              exploit vulnerabilities.
            </List.Item>
            <List.Item>
              Another key learning was to not spend too much time on a single
              task when trying to solve a challenge. In my earlier challenges, I
              would often find myself going deep into a rabbit hole, thinking
              that I was on the right track, only to find out that I was
              completely wrong. I learned that it is important to take a step
              back, and try to look at the problem from a different perspective,
              using context clues and hints that are given in the challenge. The
              best example of this was with <b>Pop Restaurant</b>, where I was
              stuck for a very long time, until I realised that the name of the
              challenge itself gave a big hint.
            </List.Item>
            <List.Item>
              Using the right tools is also very important, as well as knowing
              when to use tools that already exist. In the beginning, I was
              doing a lot of manual work, realising that there were tools that
              already did the job for me, saving lots of time and effort.
            </List.Item>
            <List.Item>
              Finally, I learnt about the importance of security as a whole.
              Before undertaking these challenges, I had no idea how many
              different vulnerabilities exist out there, and just scrolling
              through HackTricks and other blogging websites made me realise the
              scope of this field. It's crazy to think that with humans
              inventing computing and on the bleeding edge of technology, there
              are also people who have nefarious intents. It's a constant battle
              between the good and the bad, with the bad always trying to find
              new ways to exploit systems and the good always trying to find new
              ways to protect them.
            </List.Item>
          </List.Root>
          <Separator />
          <VStack w="100%">
            <Heading size="2xl" fontWeight={800}>
              Process
            </Heading>
            <Text>
              This is an overview of the process I eventually followed,
              including tips and resources that I found useful.
            </Text>
            <StepsRoot defaultValue={1} count={3} w="100%" colorPalette="teal">
              <StepsList>
                <StepsItem index={0} title="Reconnaissance & Research" />
                <StepsItem index={1} title="Planning" />
                <StepsItem index={2} title="Execution" />
              </StepsList>

              <StepsContent index={0}>
                <Stack>
                  <Text>
                    The first step in doing these kinds of challenges is to
                    gather intel, or the fancy term being reconnaissance. This
                    involves finding out as much information about the target as
                    possible, such as the technologies being used, skimming
                    through the source code (if provided), playing around with
                    the website normally etc.
                  </Text>
                  <Text>What I like to normally look for are:</Text>
                  <List.Root>
                    <List.Item>
                      <b>Source Code:</b> This is a goldmine of information. I
                      like to look for comments, hidden fields, endpoints, etc.
                    </List.Item>
                    <List.Item>
                      <b>Technologies:</b> Knowing the technologies being used
                      can help in finding vulnerabilities that are specific to
                      that technology. These can be found in the{" "}
                      <Code>package.json</Code>, <Code>requirements.txt</Code>,
                      or even the <Code>Dockerfile</Code>.
                    </List.Item>
                    <List.Item>
                      <b>Endpoints:</b> Looking for hidden endpoints, APIs, etc.
                    </List.Item>
                    <List.Item>
                      <b>Where the flag is:</b> This is of course your end goal,
                      so knowing where the flag is can help you plan your
                      attack. Sometimes it's in a config, a variable, most of
                      the time it's in a file. There have been some instances
                      where the flag was copied to a random location (as defined
                      in the Dockerfile), so in these cases RCE of some sort is
                      typically involved.
                    </List.Item>
                    <List.Item>
                      <b>Obvious vulnerability entry points:</b> Sometimes,
                      vulnerabilities can be spotted very quickly - and may have
                      a part to play in the challenge. Keep a mental note (or
                      physical note!) of it.
                    </List.Item>
                  </List.Root>
                  <Text>
                    Sometimes, if you have little idea of what to do by this
                    point, it may be worth starting to consider vulnerabilities
                    being present within libraries. For example, if you see a
                    NextJS website or HAProxy configuration - look for CVEs on
                    Google - this can often lead straight to some form of
                    answer.
                  </Text>
                  <Alert status="warning">
                    Do be careful when checking for CVEs though - there were
                    often times when I got so invested in a particular CVE, just
                    to realise that the version that the challenge was running
                    had been patched. Make sure you check those versions!
                  </Alert>
                  <Text>
                    Other useful resources in discovering/finding out
                    vulnerabilities:
                  </Text>
                  <List.Root>
                    <HStack gap={1}>
                      <List.Item>
                        <ExternalLink
                          href="https://book.hacktricks.xyz/"
                          title="HackTricks"
                        />{" "}
                        - A great resource for finding out about different
                        vulnerabilities and how to exploit them.
                      </List.Item>
                    </HStack>
                    <List.Item>
                      <ExternalLink
                        href="portswigger.net/web-security"
                        title="PortSwigger"
                      />{" "}
                      - An online learning platform with tutorials and labs on
                      web security for various pen-testing techniques.
                    </List.Item>
                    <List.Item>
                      <ExternalLink
                        href="https://www.cvedetails.com/"
                        title="CVE Details"
                      />{" "}
                      - A database of known vulnerabilities and their details.
                    </List.Item>
                    <List.Item>
                      <ExternalLink href="google.com" title="Google!" /> -
                      Google is your best friend. If you're stuck, Google the
                      error message or the technology you're working with.
                    </List.Item>
                  </List.Root>
                  <Alert status="info">
                    Try to avoid getting too deep into anything specific - I
                    found it quite detrimental to the overall flow by getting
                    too side-tracked with one particular thing.
                  </Alert>
                  <Text>
                    This is also the stage to research anything that you are not
                    sure of that you are seeing - without pre-requisite
                    knowledge, it can be very difficult to solve some
                    challenges.
                  </Text>
                </Stack>
              </StepsContent>
              <StepsContent index={1}>
                <Stack>
                  <Text>
                    The planning stage is where you take all the information you
                    have gathered from the reconnaissance stage and start to
                    plan your attack. This is where you can decide where you
                    should start the attack, then how all the potential
                    individual components could link together. More difficult
                    challenges will almost always involve several steps.
                  </Text>
                  <Text>Consider:</Text>
                  <List.Root>
                    <List.Item>
                      <b>What vulnerabilities you have found:</b> Think about
                      the vulnerabilities we have gathered. How could they be
                      exploited and through what means? Also consider that
                      sometimes one vulnerability may have a direct segue to
                      another vulnerability that you may have missed.
                    </List.Item>
                    <List.Item>
                      <b>What tools you are going to use:</b> There are many
                      tools out there for web pen testing - make sure you use
                      them where possible! Software like Burp Suite, OWASP ZAP,
                      and Nmap can be very useful in running along with the
                      vulnerabilities.
                    </List.Item>
                    <List.Item>
                      <b>What your end goal is:</b> This is very important!
                      Always keep in the back of your mind what you are trying
                      to achieve. In these web challenges, they are always to
                      gather a flag - but where is the flag? Do we need to get
                      RCE? Read a file using code? Get admin access?
                    </List.Item>
                  </List.Root>
                </Stack>
              </StepsContent>
              <StepsContent index={2}>
                <Stack>
                  <Alert status="error">
                    Avoid jumping straight to the execution stage! I made this
                    mistake in my earlier challenges, and it made things
                    needlessly difficult. Complete your recon and planning first
                    before diving in.
                  </Alert>
                  <Text>
                    It's go time! In the case of Hack the Box challenges, more
                    often than not they will provide you with the source code of
                    the challenge. I highly recommend you download this and run
                    a local instance of the challenge to test your exploitation
                    plan first, as you have the freedom to do whatever you want,
                    debug, etc.
                  </Text>
                  <Text>
                    In real pen testing, obviously it is not possible to run a
                    local instance. In this case, you will have to be very
                    careful with your attacks, as you could potentially take
                    down the website or cause other issues, which could expose
                    you to legal issues. This is why it is paramount to perform
                    the previous two steps first whenever possible to the
                    greatest extent.
                  </Text>
                </Stack>
              </StepsContent>

              <StepsCompletedContent>
                <Text>
                  And that's it! You've completed the challenge. If you haven't
                  yet, make sure to write a reflection on the challenge you have
                  completed. This will help you remember what you have learned,
                  and can also be a great resource for others who are looking to
                  learn more about web pen testing.
                </Text>
              </StepsCompletedContent>

              <Group>
                <StepsPrevTrigger asChild>
                  <Button variant="outline" size="sm">
                    Prev
                  </Button>
                </StepsPrevTrigger>
                <StepsNextTrigger asChild>
                  <Button variant="outline" size="sm">
                    Next
                  </Button>
                </StepsNextTrigger>
              </Group>
            </StepsRoot>
          </VStack>
        </VStack>
      </Center>
    </>
  );
}
