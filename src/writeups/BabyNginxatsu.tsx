import {
  Stack,
  Code,
  Text,
  Heading,
  AccordionItem,
  AccordionItemContent,
  AccordionItemTrigger,
  AccordionRoot,
  Icon,
} from "@chakra-ui/react";
import { ReflectionItem, WriteupType } from "./";
import { Medium, PHP, PathTraversal, RainbowTable } from "./tags";
import { FaLock, FaFish, FaTools } from "react-icons/fa";
import { ImageWithCaption } from "@/components/ImageWithCaption";
import CustomAccordion, { AccordionType } from "@/components/CustomAccordion";
import { LuServerOff } from "react-icons/lu";
import { PiPasswordFill } from "react-icons/pi";
import { Codeblock } from "@/components/Codeblock";
import ExternalLink from "@/components/ExternalLink";

const reflectionItems: ReflectionItem[] = [
  {
    value: "misconfigured-servers",
    icon: <LuServerOff />,
    title: "Be careful of misconfigured servers and exposed directories",
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

export const BabyNginxatsu: WriteupType = {
  title: "Baby Nginxatsu",
  slug: "baby-nginxatsu",
  author: "makelaris",
  authorLink: "https://app.hackthebox.com/users/107",
  challengeLink: "https://app.hackthebox.com/challenges/baby%2520nginxatsu",
  tags: [Medium, PHP, PathTraversal, RainbowTable],
  timeTaken: "1 hour",
  synopsis:
    "A website that dynamically generates Nginx configuration files based on user input. What could go wrong?",
  content: (
    <Stack gap={2}>
      <Text>
        When first launching this application, we end up on a simple login and
        registration screen. Just to test out the website a little and see where
        we end up, I just registered an account and logged in, which landed us
        on the following page.
      </Text>
      <ImageWithCaption
        imagePath="/images/nginx-1.png"
        caption="The application at hand"
      />
      <Text>
        Interestingly, we weren't given source code for this particular
        challenge, so we kind of have to go in blind. I first tried to look into
        the source code from inspect element, but it unfortunately didn't seem
        to reveal too many clues as the HTML file itself was difficult to read,
        and the JS files were all in compiled JS.
      </Text>
      <CustomAccordion type={AccordionType.SIDETRACK} title="SQL Injection">
        <Text>
          I first suspected that the login page might have something vulnerable,
          in particular maybe I could utilise SQLi to bypass something and get
          some tables and information about a potential database.
        </Text>
        <Text>
          Using some common tricks from this{" "}
          <ExternalLink
            href="https://book.hacktricks.xyz/pentesting-web/sql-injection"
            title="page"
          />
          , I tried inputting some into the username field. For example:
        </Text>
        <Codeblock language="sql" code="' or '1'='1" />
        <Text>
          Interestingly, this actually is causing the server to crash in some
          way, returning a CONNECTION_RESET error. Unfortunately, this happened
          a lot of the time, and after spending (admittedly) too long going down
          this rabbit hole, I realised that this probably was not the approach
          to take.
        </Text>
      </CustomAccordion>
      <Text>
        Given that the name of this challenge had something to do with Nginx -
        it probably had something to do with the Nginx configurations that the
        website was providing. To get a feel for what the website was doing, I
        requested for a configuration with the default parameters given on the
        website. A configuration was generated, and I opened the file. This was
        what I saw:
      </Text>
      <Codeblock
        language="conf"
        code={`
...
include  /etc/nginx/mime.types;

server {
    listen 80;
    server_name _;

    index index.php;
    root /www/public;

    # We sure hope so that we don't spill any secrets
    # within the open directory on /storage

    location /storage {
        autoindex on;
    }
...
      `}
      />
      <Text>
        "We sure hope so that we don't spill any secrets within the open
        directory on /storage" Well that's interesting isn't it - the /storage
        folder is open. This was re-inforced when clicking on the 'Raw Config'
        button:
      </Text>
      <ImageWithCaption imagePath="/images/nginx-2.png" caption="" />
      <Text>
        From here, we were taking to a URL path that looked something like{" "}
        <Code>/storage/nginx.conf</Code>. By removing the later part of the URL,
        we were able to traverse the directory and access the storage directory
        of the server.
      </Text>
      <ImageWithCaption
        imagePath="/images/nginx-3.png"
        caption="Storage directory accessed"
      />
      <Text>
        I notice that there was a file called <Code>db_backup</Code>. Maybe
        there could be something useful in there for us... Downloading the
        backup, I needed to first untar the file, which landed me with a SQLite
        database file. I opened the database file using SQL Viewer in VSCode.
        The challenge on the page actually gave a little hint in that we were
        looking to get the credentials to the admin account to get the flag.
        There's a users table within the database, and it seems like the API
        token field is a bit of a red herring.
      </Text>
      <ImageWithCaption
        imagePath="/images/nginx-4.png"
        caption="SQLite DB, users table"
      />
      <Text>
        One of the user's emails conveniently had 'adm' in it, which I presumed
        to be the admin account. Of course, the password wasn't just stored in
        plain-text, because that would be too easy. Instead, it was hashed. My
        initial thought was to try and brute-force the hash, but then I had an
        easier thought to try a rainbow table approach first.
      </Text>
      <Text>
        Using{" "}
        <ExternalLink
          href="https://crackstation.net/"
          title="https://crackstation.net/"
        />
        , I put in the hash of the password, and lo-and-behold - the password
        was revealed to be <Code>adminadmin1</Code>. Logging in with these
        credentials...
      </Text>
      <ImageWithCaption imagePath="/images/nginx-5.png" />
      <ImageWithCaption imagePath="/images/nginx-6.png" caption="Flag!" />
    </Stack>
  ),
  reflection: (
    <Stack width="full" minW="100%">
      <AccordionRoot collapsible defaultValue={["info"]} variant="enclosed">
        {reflectionItems.map((item) => (
          <AccordionItem key={item.value} value={item.value} py={2}>
            <AccordionItemTrigger
              cursor="pointer"
              fontWeight={800}
              textAlign="left"
              fontSize="20px"
            >
              <Icon fontSize="28px" color="teal">
                {item.icon}
              </Icon>
              {item.title}
            </AccordionItemTrigger>
            <AccordionItemContent>{item.content}</AccordionItemContent>
          </AccordionItem>
        ))}
      </AccordionRoot>
    </Stack>
  ),
};
