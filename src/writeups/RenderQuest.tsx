import {
  AccordionItem,
  AccordionItemContent,
  AccordionItemTrigger,
  AccordionRoot,
  Code,
  Heading,
  Icon,
  Separator,
  Stack,
  Text,
} from "@chakra-ui/react";
import { FaBrain, FaList } from "react-icons/fa";
import { FaGolang } from "react-icons/fa6";
import { ReflectionItem, WriteupType } from "./";
import { Medium, Golang, SSTI } from "./tags";
import { ImageWithCaption } from "@/components/ImageWithCaption";
import { Codeblock } from "@/components/Codeblock";
import CustomAccordion, { AccordionType } from "@/components/CustomAccordion";
import { MdGppBad } from "react-icons/md";
import ExternalLink from "@/components/ExternalLink";

const reflectionItems: ReflectionItem[] = [
  {
    value: "complacency",
    icon: <FaBrain />,
    title: "Complacency is the enemy",
    content: (
      <Stack gap={1}>
        <Text>
          This challenge was a good reminder to me that complacency is quite a
          problem - my initial thoughts thinking that the challenge would be
          easy due to the familiarity of the language was a mistake. The
          challenge - while not particularly difficult - had a lot of red
          herrings that complicated the process of identifying the core
          vulnerability.
        </Text>
        <Text>
          This underlined a lesson - familiarity with a language is good, but
          doesn't translate to ease, especially in a security context. Luckily,
          from previous challenges, I had already learnt to not dwell too long
          on a particular idea if I wasn't getting too far with it - which
          helped me to not get too bogged down in the red herrings.
        </Text>
      </Stack>
    ),
  },
  {
    value: "solid-plan",
    icon: <FaList />,
    title: "Having a plan is key!",
    content: (
      <Stack gap={1}>
        <Text>
          A key change in the way I approached this challenge I think was the
          fact that I took a bit more time to note down the things that I found
          interesting, before I went in to start planning an approach - you may
          notice a specific reconnaissance section in the more recent writeups.
          This helped me scope out the challenge, get a feel for what I was
          working with, before jumping in.
        </Text>
        <Text>
          Not only did this prove very useful in not getting too far down any
          particular rabbit holes, it also helped me to keep track of what I had
          already tried, and what I hadn't. In addition to this, keeping track
          of some of the things I noticed (e.g. the <Code>FetchServerInfo</Code>{" "}
          function) helped me to quickly make the connection once I found the
          right vulnerability, despite it first seeming to be a red herring.
        </Text>
        <Text>
          I do also realise the importance of not diving in too quickly in real
          web penetration testing - starting immediately with no plan could lead
          to wasted time, and giving time for the target to potentially detect
          you.
        </Text>
      </Stack>
    ),
  },
  {
    value: "ssti-bad",
    icon: <MdGppBad />,
    title: "SSTI can hurt... a lot",
    content: (
      <Stack gap={1}>
        <Text>
          This challenge was my first encounter with Server-Side Template
          Injection (SSTI), and it was quite an interesting experience. When
          used correctly, SSTI is a powerful tool for generating dynamic
          content, but when used incorrectly, it can lead to a lot of pain.
        </Text>
        <Text>
          This once again underlines the importance of input validation and
          sanitisation - the vulnerability was present because the application
          allowed for the rendering of any template file given by the user.
        </Text>
      </Stack>
    ),
  },
  {
    value: "modern",
    icon: <FaGolang />,
    title: "Even modern languages can have vulnerabilities",
    content: (
      <Stack gap={1}>
        <Text>
          Of course, we hear all the time that we should keep our tech stack up
          to date to avoid accumulation of tech debt leading to vulnerabilities.
        </Text>
        <Text>
          I certainly hope and think that I'm not the only one who thought that
          this translated to modern languages being fully secure. This challenge
          was a good reminder that even modern languages can have
          vulnerabilities, and that it's important to keep up to date with the
          latest security practices.
        </Text>
        <Text>
          Even with a modern language, the biggest vulnerability will always
          boil down to the person writing the code.
        </Text>
      </Stack>
    ),
  },
];

export const RenderQuest: WriteupType = {
  title: "Render Quest",
  slug: "render-quest",
  author: "leanthedev",
  authorLink: "https://app.hackthebox.com/users/1338083",
  challengeLink: "https://app.hackthebox.com/challenges/537",
  tags: [Medium, Golang, SSTI],
  timeTaken: "3 hours",
  synopsis:
    "A Go web application that allows users to provide a link to a template file and render it.",
  content: (
    <Stack gap={2}>
      <Text>
        This challenge was quite a fun one to solve, and with experience in
        Golang, I figured it shouldn't be too difficult to figure out. Funnily
        enough, this particular challenge had a lot of red herrings, which made
        it a bit more difficult to pin-point what the actual vulnerability was.
      </Text>
      <ImageWithCaption
        imagePath="/images/rq-1.png"
        caption="The application"
      />
      <Separator />
      <Heading fontWeight={800} fontSize="2xl" color="teal">
        Reconnaissance
      </Heading>
      <Text>
        From previous challenges, I started taking a bit more time to note down
        the things that I found interesting, before I went in to start planning
        an approach.
      </Text>
      <ImageWithCaption imagePath="/images/rq-2.png" caption="Dockerfile" />
      <Text>
        Taking a look inside the Dockerfile - once again we have a random flag
        file name, we will most likely have to get some form of RCE to be able
        to figure out the name of the flag.
      </Text>
      <Text>
        There is a static folder - but this doesn't seem to have much to it -
        just looks like the CSS for a simple bootstrap theme, and its
        corresponding JS scripts. There is also a custom JS script file, which
        contains some basic cookie setting and some script to run a function to
        get the template file. There's nothing particularly interesting other
        than the fact that we can put in any link for the template file,
        seemingly.
      </Text>
      <Codeblock
        language="js"
        code={`
window.onload = async () => {
    document.getElementById("templateButton").addEventListener("click", () => {
        window.location.href = "/render?use_remote=true&page=" + document.getElementById("templateLink").value;
    });

    if (isCookieSet("user_ip")) {
        return;
    }

    const response = await fetch("https://freeipapi.com/api/json/");

    if (response.status === 200) {
        const ipData = await response.json();

        const trueClientIP = ipData.ipAddress;

        document.cookie = \`user_ip=\${trueClientIP}; path=/\`;
    } else {
        console.error("Failed to fetch IP data");
    }
}`}
      />
      <Text>
        Now, we get to the main meat of the program: the <Code>main.go</Code>{" "}
        file. There are a few interesting things to note here, let's explore
        them - a lot of which were unfortunately red herrings, or at least was
        not the immediate vulnerability.
      </Text>
      <Separator />
      <Heading fontWeight={800} fontSize="2xl" color="teal">
        Red Herring Central
      </Heading>
      <CustomAccordion
        type={AccordionType.RED_HERRING}
        title="Potential path traversal vulnerability"
      >
        <Stack gap={2}>
          <Text>
            The first thing I saw was the exposure and serving of the{" "}
            <Code>/static</Code> folder on the server:
          </Text>
          <Codeblock
            widthOffset="70px"
            language="go"
            code={`
mux := http.NewServeMux()

mux.HandleFunc("/", getIndex)
mux.HandleFunc("/render", getTpl)
mux.Handle("/static/", http.StripPrefix("/static/", http.FileServer(http.Dir("static"))))
  `}
          />
          <ImageWithCaption
            imagePath="/images/rq-3.png"
            caption="Static folder exposed"
          />
          <Text>
            I thought that this could potentially be a path traversal
            vulnerability - but after testing it out using some tricks from
            previous challenges and online resources, I found that it probably
            wasn't possible (or at least easily). It would appear that the{" "}
            <Code>http.StripPrefix</Code> function was sanitising the input,
            with the <Code>mux</Code> library safely handling the serving of the
            static files.
          </Text>
          <Text>
            From previous reflections and challenges, I learnt to not dwell too
            long on a specific idea if it doesn't work out, so I move on to the
            next potential vulnerability, keeping this in the back of my mind.
          </Text>
        </Stack>
      </CustomAccordion>
      <CustomAccordion type={AccordionType.RED_HERRING} title="Reading files?">
        <Stack gap={2}>
          <Text>
            The next thing I noticed was the possibility of reading files
            locally:
          </Text>
          <Codeblock
            widthOffset="70px"
            language="go"
            code={`
if remote == "true" {
		tmplFile, err = readRemoteFile(page)

		if err != nil {
			http.Error(w, "Internal Server Error", http.StatusInternalServerError)
			return
		}
	} else {
		tmplFile, err = readFile(TEMPLATE_DIR+"/"+page, "./")

		if err != nil {
			http.Error(w, "Internal Server Error", http.StatusInternalServerError)
			return
		}
	}
        `}
          />
          <Text>
            In particular, the else block (when <Code>remote</Code> is not true)
            seemingly allows the possibility of reading files outside of the{" "}
            <Code>TEMPLATE_DIR</Code> directory. However, after briefly testing
            this out, I found that the <Code>readFile</Code> function was
            sanitising the input, and only allowing the reading of files within
            the <Code>TEMPLATE_DIR</Code> directory.
          </Text>
          <Codeblock
            widthOffset="70px"
            language="go"
            code={`
func readFile(filepath string, basePath string) (string, error) {
	if !isSubdirectory(basePath, filepath) {
		fmt.Println("Invalid filepath")
		return "", fmt.Errorf("Invalid filepath")
	}
`}
          />
          <Text>
            The <Code>isSubdirectory</Code> function was checking to see if the
            filepath was a subdirectory of the base path, and if not, it would
            return an error. It also utilises relative pathing to break down any
            path to be broken down and simplified. For example if the path was
            <Code>../../../../../etc/passwd</Code>, it would be simplified to
            <Code>/etc/passwd</Code>. It probably would be possible to bypass
            this filter in some way - but I didn't spend too much time on it.
          </Text>
          <Text>
            Nothing much to see here, it seems - another slight red herring.
            Moving on.
          </Text>
        </Stack>
      </CustomAccordion>
      <CustomAccordion type={AccordionType.RED_HERRING} title="FetchServerInfo">
        <Stack gap={2}>
          <Text>
            The next thing I noticed was the <Code>FetchServerInfo</Code>{" "}
            function in the <Code>main.go</Code> file:
          </Text>
          <Codeblock
            widthOffset="70px"
            language="go"
            code={`
func (p RequestData) FetchServerInfo(command string) string {
	out, err := exec.Command("sh", "-c", command).Output()

	if err != nil {
		return ""
	}
	return string(out)
}
          `}
          />
          <Text>
            A function that takes in a command as an argument and directly runs
            it? Seems suspicious. Looking through the references to this
            particular function, I found only 4 references:
          </Text>
          <Codeblock
            widthOffset="70px"
            language="go"
            code={`
reqData.ServerInfo.Hostname = reqData.FetchServerInfo("hostname")
reqData.ServerInfo.OS = reqData.FetchServerInfo("cat /etc/os-release | grep PRETTY_NAME | cut -d '\"' -f 2")
reqData.ServerInfo.KernelVersion = reqData.FetchServerInfo("uname -r")
reqData.ServerInfo.Memory = reqData.FetchServerInfo("free -h | awk '/^Mem/{print $2}'")
          `}
          />
          <Text>
            These all used hard coded commands - not user input. Might not be
            directly possible through this method, so at the moment, going to
            move along.
          </Text>
          <Text>
            One thing to pay attention to though, is the fact that the function
            for running commands is defined in the <Code>RequestData</Code>{" "}
            struct as a receiver method - similar to methods associated with
            classes. Not sure why this was written as such, given that the
            struct data is never even used, but it was something to keep in
            mind.
          </Text>
        </Stack>
      </CustomAccordion>
      <Separator />
      <Heading fontWeight={800} fontSize="2xl" color="teal">
        The Vulnerability
      </Heading>
      <Text>
        Then it hit me - the whole entire purpose of this website allowed one to
        render any potential given URL with a template. This was a classic
        Server-Side Template Injection (SSTI) vulnerability. While I had heard
        about SSTI vulnerabilities before, I had never actually encountered one
        in the wild. This was a good opportunity to learn more about it.
      </Text>
      <Text>
        Using our good friend{" "}
        <ExternalLink
          href="https://book.hacktricks.xyz/pentesting-web/ssti-server-side-template-injection"
          title="HackTricks"
        />
        , I found that the Go template engine was quite powerful, and could be
        used to execute arbitrary code. How? Well - the Go template engine
        essentially allows for the substitution of certain Go code within the
        template for values.
      </Text>
      <Text>
        I have a free Oracle Cloud instance that I use for testing, so I decided
        to use that to host a simple file hosting service using the default
        Python HTTP server. (Why are there no basic file hosting services
        without fancy bells and whistles?)
      </Text>
      <ImageWithCaption
        imagePath="/images/rq-4.png"
        caption="File hosting service"
      />
      <CustomAccordion type={AccordionType.SIDETRACK} title="XSS attempt">
        <Stack gap={2}>
          <Text>
            In <Code>b.go</Code>, I placed in some basic XSS code to test the
            templating and see if my SSTI was working:
          </Text>
          <Codeblock
            widthOffset="70px"
            language="go"
            code={`
{{"<script>alert(1)</script>"}}
`}
          />
          <ImageWithCaption imagePath="/images/rq-5.png" />
          <Text>
            Whoops - I realised that the template engine we were using was{" "}
            <Code>html/template</Code>, which is more complicated and safer than{" "}
            <Code>text/template</Code>. No worries, HackTricks to the rescue
            with a different payload:
          </Text>
          <Codeblock
            widthOffset="70px"
            language="go"
            code={`
{{define "T1"}}alert(1){{end}} {{template "T1"}}
`}
          />
          <ImageWithCaption imagePath="/images/rq-6.png" />
          <Text>
            Huh - nothing. But then I realised - why am I performing an XSS
            attack? I have a Go templating engine, I could probably execute Go
            code rather than JavaScript code. Unnecessary side track on my part.
          </Text>
        </Stack>
      </CustomAccordion>
      <Text>Testing a different SSTI payload, I used this:</Text>
      <Codeblock
        language="go"
        code={`
{{ . }}
`}
      />
      <ImageWithCaption imagePath="/images/rq-7.png" />
      <Text>
        Ooh now we're talking. This particular payload allowed me to see the
        underlying data structure in the context that we were in, and proved
        that our Go SSTI was working.
      </Text>
      <Text>
        Further reading on HackTricks showed me that I could access other
        methods within Go templates:
      </Text>
      <ImageWithCaption
        imagePath="/images/rq-8.png"
        caption="Source: hacktricks.com"
      />
      <Text>
        Remember the <Code>FetchServerInfo</Code> function that I mentioned
        earlier? Because it was defined in the <Code>RequestData</Code> struct
        and we were working within the context of the struct, I was able to call
        it directly in the template:
      </Text>
      <Codeblock
        language="go"
        code={`
{{.FetchServerInfo "ls ../flag*.txt | xargs cat"}}
        `}
      />
      <ImageWithCaption imagePath="/images/rq-9.png" />
      <Text>And there we have it - the flag!</Text>
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
