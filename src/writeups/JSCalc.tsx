import {
  AccordionItem,
  AccordionItemContent,
  AccordionItemTrigger,
  AccordionRoot,
  Code,
  Heading,
  Icon,
  Stack,
  Text,
} from "@chakra-ui/react";
import { ReflectionItem, WriteupType } from "./";
import { Easy, JavaScript, RCE } from "./tags";
import { ImageWithCaption } from "@/components/ImageWithCaption";
import { Codeblock } from "@/components/Codeblock";
import { GrVulnerability } from "react-icons/gr";
import { FaFilterCircleXmark } from "react-icons/fa6";
import { FaHeadSideVirus } from "react-icons/fa6";

const reflectionItems: ReflectionItem[] = [
  {
    value: "eval-bad",
    icon: <GrVulnerability />,
    title: (
      <Heading fontSize="20px" fontWeight={800}>
        Using <Code size="lg">eval()</Code> is probably a bad idea
      </Heading>
    ),
    content: (
      <Stack gap={1}>
        <Text>
          The use of <Code>eval()</Code> can pose a lot of security risk (as
          evident) in this challenge, exacerbated by the fact that the user
          input was unfiltered.
        </Text>
        <Text>
          Our primary takeaway here is that <Code>eval()</Code> should really
          just not be used whenever possible due to the possibility of RCE and
          DOM Based XSS vulnerabilities. While we didn't utilise an XSS based
          attack in this challenge (since it wasn't needed), there was no reason
          why we couldn't do some other nefarious acts.
        </Text>
        <Text>
          Instead, we should potentially look into using other, safer
          alternatives, such as <Code>JSON.parse()</Code> for parsing JSON, or
          even just utilising robust, popular libraries that handle expression
          evaluation securely.
        </Text>
      </Stack>
    ),
  },
  {
    value: "unfiltered-input-bad",
    icon: <FaFilterCircleXmark />,
    title: "Filter your inputs!",
    content: (
      <Stack gap={1}>
        <Text>
          Whenever a website opens its doors for users to input their own data -
          this could be a potential risk. It is paramount that any user input is
          properly validated and sanitised thoroughly, to ensure that we are
          only parsing and processing data that we know is safe (as much as
          possible).
        </Text>
        <Text>
          Even if there was a need to use <Code>eval()</Code> (which there
          really shouldn't be), the input should at least be filtered.
        </Text>
      </Stack>
    ),
  },
  {
    value: "software-hard",
    icon: <FaHeadSideVirus />,
    title: "Web development (and software) in general is hard",
    content: (
      <Stack gap={1}>
        <Text>
          This first challenge has made me realise that there are so many things
          to think about when working with software in a security context.
          Before taking this course, I had some trivial knowledge of what not to
          do when developing software (e.g. storing passwords in plain text,
          using <Code>env</Code> variables when possible etc.), but this first
          challenge alongside all the CTFs have made me realise the reality.
        </Text>
        <Text>
          This is why it is so important that during code development in teams,
          we have comprehensive code reviews and testing. Sometimes, just having
          an extra pair of eyes could be the difference between a safe website
          and a vulnerable website (like this one), as others can offer another
          perspective over your code that you may not have. Beyond this,
          security and penetration testing could be another way to help mitigate
          vulnerabilities overall.
        </Text>
      </Stack>
    ),
  },
];

export const JSCalc: WriteupType = {
  title: "JSCalc",
  slug: "jscalc",
  author: "makelaris",
  authorLink: "https://app.hackthebox.com/users/107",
  challengeLink: "https://app.hackthebox.com/challenges/jscalc",
  tags: [Easy, JavaScript, RCE],
  timeTaken: "30 minutes",
  synopsis:
    "A simple calculator that is poorly designed (using eval) and is vulnerable to a client-side attack.",
  content: (
    <Stack gap={2}>
      <Text>
        This particular challenge was a simple one, but it was a good
        introduction to the concept of client-side attacks, and as my first CTF
        within this project, I figured it was a good starting point just to warm
        up.
      </Text>
      <ImageWithCaption
        imagePath="/images/jscalc-1.png"
        caption="JSCalc application"
      />
      <Text>
        So, from the little description that was given, it was clear from the
        get-go that this website was using an <Code>eval()</Code> function to
        actually run the calculator. Given that I was already very familiar with
        JavaScript, I knew that this was a very potential vector for remote code
        execution.
      </Text>
      <Text>
        I then downloaded the source code and snooped around in then to look for
        more clues, and to confirm whether or not this attack vector was
        actually feasible.
      </Text>
      <Text>
        Poking around, I see a file called <Code>calculatorHelper.js</Code>.
        Hmm, looks fishy. Let's take a look inside.
      </Text>
      <Codeblock
        language="js"
        code={`
calculate(formula) {
try {
    return eval(\`(function() { return \${formula} ;}())\`);
        `}
      />
      <Text>
        Wow, would you look at that. Un-filtered user input going directly into
        the <Code>eval()</Code> function. Interestingly, it took a little
        playing around for me to figure out what we could do. Given that the
        eval is calling an anonymous function that then returns the formula that
        was given, I figured that we actually needed to use a second{" "}
        <Code>eval</Code> to be able to do whatever I wanted.
      </Text>
      <Text>
        From here, I jumped on a local Node instance just to ensure I was
        getting the syntax right, before I proceeded to try it on the website
        again. I got to this point:
      </Text>
      <ImageWithCaption
        imagePath="/images/jscalc-2.png"
        caption="Testing with listing files"
      />
      <Text>
        Great, our payload is indeed working, but there's no flag file!
        Re-checking the overall structure of the source code, I noticed that the{" "}
        <Code>file.txt</Code> was likely located in the parent folder. No big
        deal, we can change our payload very easily.
      </Text>
      <ImageWithCaption
        imagePath="/images/jscalc-3.png"
        caption="Found the flag file!"
      />
      <Text>
        The rest is history from here - we just change <Code>readdirSync</Code>{" "}
        to <Code>readFileSync</Code> instead.
      </Text>
      <ImageWithCaption imagePath="/images/jscalc-4.png" caption="Pwned :)" />
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
