import { Codeblock } from "@/components/Codeblock";
import CustomAccordion, { AccordionType } from "@/components/CustomAccordion";
import { ImageWithCaption } from "@/components/ImageWithCaption";
import {
  Stack,
  Code,
  AccordionRoot,
  AccordionItem,
  AccordionItemTrigger,
  Icon,
  Heading,
  AccordionItemContent,
  Text,
} from "@chakra-ui/react";
import Link from "next/link";
import { LuExternalLink, LuServerOff } from "react-icons/lu";
import { WriteupType } from ".";
import { Hard, PHP, XSS, RCE } from "./tags";
import { FaLock, FaFish, FaTools } from "react-icons/fa";
import { PiPasswordFill } from "react-icons/pi";

const reflectionItems = [
  {
    value: "misconfigured-servers",
    icon: <LuServerOff />,
    title: (
      <Heading>
        Be careful with misconfigured servers and exposed directories!
      </Heading>
    ),
    content: (
      <Stack gap={1}>
        <Text>
          It was pretty clear that the main vulnerability of this challenge was
          the misconfiguration in the setup of the server, which inadvertently
          allowed for the external exposure of sensitive directories, like{" "}
          <Code>/storage</Code>.
        </Text>
        <Text>
          In this case here, they were using the folder to allow for people to
          see the raw configuration files that they are generating. At the very
          least, they should have placed the generated files into a different
          folder, and used a network configuration that would lock down the
          access to that specific folder so such file traversal attack swouldn't
          be possible.
        </Text>
      </Stack>
    ),
  },
  {
    value: "sensitive-data",
    icon: <FaLock />,
    title: "Handling Sensitive Data",
    content: (
      <Stack gap={1}>
        <Text>
          It's important to note that the database backup file was stored in the
          <Code>/storage</Code> directory, which was exposed to the public. This
          is a huge security risk, as it clearly was the downfall of this
          particular website. While the misconfigured directory access was the
          main issue, the fact that this database backup was also stored within
          the same folder was also an oversight in itself.
        </Text>
        <Text>
          Backups like these should be encrypted and stored in a secure
          location, and not in a directory that is accessible to the public.
        </Text>
      </Stack>
    ),
  },
  {
    value: "weak-passwords",
    icon: <PiPasswordFill />,
    title: "Be careful of weak passwords!",
    content: (
      <Stack gap={1}>
        <Text>
          The password for the admin account was <Code>adminadmin1</Code>.
          Clearly, this was a weak password, and this particular challenge
          exposed why we should avoid using weak passwords in the first place.
          There are plenty of websites out there that provide a rainbow table of
          common passwords to their leaked hashes, and it's really not difficult
          to find the corresponding password to a hash.
        </Text>
        <Text>
          While the developer's minds were in the right place in regards to
          storing the passwords as a hash, they should have also enforced a
          password policy that would have prevented the use of such a weak
          password. In addition, the MD5 hash that was used was also a weak
          hashing algorithm, and should have been replaced with a more secure
          hashing algorithm like bcrypt, which includes a salt to prevent
          brute-force attacks.
        </Text>
      </Stack>
    ),
  },
  {
    value: "red-herrings",
    icon: <FaFish />,
    title: "Be careful of red herrings!",
    content: (
      <Stack gap={1}>
        <Text>
          Since this challenge didn't provide the source code, it was difficult
          to determine what we were looking for, and what would we be useful. In
          my case, I spent too long trying to exploit the SQLi vulnerability
          that I thought was there, when in fact, it was a red herring (I'm not
          entirely sure whether or not there was a SQLi vulnerability in the
          end).
        </Text>
        <Text>
          This could be a problem if I was actually doing real web penetration
          testing, as the time that I wasted on the SQLi could have been better
          spent on looking for the actual vulnerability, and it would be giving
          the developers and maintainers more time to identify that I was trying
          to exploit their website. From here, I started thinking about giving
          myself some time limits on certain tasks, and if I can't find anything
          within that time, then I should move on to something else, but keep it
          in the back of my mind.
        </Text>
      </Stack>
    ),
  },
  {
    value: "existing-tools",
    icon: <FaTools />,
    title: "Use existing tools!",
    content: (
      <Stack gap={1}>
        <Text>
          From this challenge, I realised the usefulness of using existing
          tools, like using the rainbow table website to crack the password
          hash, instead of relying on brute-force methods and writing my own
          script for it. This can help save a lot of time and effort.
        </Text>
      </Stack>
    ),
  },
];

export const PopRestaurant: WriteupType = {
  title: "Pop Restaurant",
  slug: "pop-restaurant",
  author: "khanhhnahk1",
  authorLink: "https://app.hackthebox.com/users/1051133",
  challengeLink: "https://app.hackthebox.com/challenges/770",
  tags: [Hard, PHP, XSS, RCE],
  synopsis:
    "A simple ordering system that is vulnerable to a client-side attack.",
  content: (
    <Stack gap={2}>
      <Text>
        When first launching this application, we end up on a simple login and
        registration screen. Just to test out the website a little and see where
        we end up, I just registered an account and logged in, which landed us
        on the following page.
      </Text>
    </Stack>
  ),
  reflection: (
    <Stack width="full" minW="100%">
      <AccordionRoot collapsible defaultValue={["info"]} variant="enclosed">
        {reflectionItems.map((item) => (
          <AccordionItem key={item.value} value={item.value} py={2}>
            <AccordionItemTrigger>
              <Icon fontSize="28px" color="teal">
                {item.icon}
              </Icon>
              <Heading>{item.title}</Heading>
            </AccordionItemTrigger>
            <AccordionItemContent>{item.content}</AccordionItemContent>
          </AccordionItem>
        ))}
      </AccordionRoot>
    </Stack>
  ),
};
