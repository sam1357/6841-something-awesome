import {
  Stack,
  Code,
  AccordionRoot,
  AccordionItem,
  AccordionItemTrigger,
  Icon,
  Text,
  AccordionItemContent,
  Heading,
  Separator,
} from "@chakra-ui/react";
import { FaDatabase, FaLock } from "react-icons/fa";
import { MdWarning } from "react-icons/md";
import { SiKnowledgebase } from "react-icons/si";
import { WriteupType } from "./";
import { Hard, JavaScript, Python, XSS, RCE, SSTI, SSRF } from "./tags";
import { ImageWithCaption } from "@/components/ImageWithCaption";
import { Codeblock } from "@/components/Codeblock";
import CustomAccordion, { AccordionType } from "@/components/CustomAccordion";
import ExternalLink from "@/components/ExternalLink";

const reflectionItems = [
  {
    value: "sqli",
    icon: <FaDatabase />,
    title: "SQLi is still a thing",
    content: (
      <Stack gap={1}>
        <Text>
          This challenge was a good reminder that SQLi is still a thing, and
          that it can still be a very powerful attack vector. In this case, the
          SQLi was used to bypass the login page, and gain access to the admin
          dashboard. Sanitise your inputs people!
        </Text>
      </Stack>
    ),
  },
  {
    value: "2fa-brute-force",
    icon: <FaLock />,
    title: "Brute forcing 2FA",
    content: (
      <Stack gap={1}>
        <Text>
          This challenge was also a good reminder of why 2FA is so important.
          Even though we were able to bypass the 2FA, it was still a good
          reminder of why 2FA is so important. In this case, the 2FA was a
          simple 4 digit code, which meant that we could easily brute force it.
          In the real world, 2FA would be more secure, as it would be time-based
          and would (typically) be a longer code.
        </Text>
        <Text>
          In a different context, this also shows why passwords and hashes
          should be long - the longer the password, the less susceptible they
          are to brute force attacks, as the bits of work required become
          exponentially larger.
        </Text>
      </Stack>
    ),
  },
  {
    value: "x-forwarded-for",
    icon: <MdWarning />,
    title: "X-Forwarded-For header - and its dangers",
    content: (
      <Stack gap={1}>
        <Text>
          <Code>X-Forwarded-For</Code> can be a dangerous header when not
          handled correctly, since it is so easily spoofed. In this particular
          case, it was probably safest to rate limit based on the IP address of
          the client, rather than the IP address in the header.
        </Text>
        <Text>
          To add an extra layer of security, the application could utilise user
          authentication and/or API keys to reduce the reliance on the IP
          address of the client for rate-limiting.
        </Text>
      </Stack>
    ),
  },
  {
    value: "frameworks",
    icon: <SiKnowledgebase />,
    title: "Know (or learn) your frameworks",
    content: (
      <Stack gap={1}>
        <Text>
          Knowledge of the frameworks that you are using can be very beneficial
          in a CTF scenario. In this case, knowledge of Flask and uWSGI was
          beneficial in understanding how the application was working, and how
          the different components were interacting with each other.
        </Text>
      </Stack>
    ),
  },
];

export const DoxPit: WriteupType = {
  title: "DoxPit",
  slug: "doxpit",
  author: "leanthedev",
  authorLink: "https://app.hackthebox.com/users/1338083",
  challengeLink: "https://app.hackthebox.com/challenges/645",
  tags: [Hard, JavaScript, Python, SSTI, RCE, SSRF],
  timeTaken: "10 hours (that string template injection was a pain)",
  synopsis:
    "A hidden Python Flask application hiding behind a basic front-end that is susceptible to some crazy SSTI.",
  content: (
    <Stack gap={2}>
      <Text>
        This challenge was an interesting one to begin with, given that the repo
        contains two applications. One application is a basic front-end written
        in JavaScript, while the other is a Python Flask application that isn't
        actually exposed to the user. Based on the context of the application, I
        suspect that the currently exposed frontend was hastily put together,
        and the Flask application was meant to be the main, original
        application.
      </Text>
      <ImageWithCaption
        imagePath="/images/dox-1.png"
        caption="The exposed front-end"
      />
      <Heading fontWeight={800} fontSize="2xl" color="teal">
        Reconnaissance
      </Heading>
      <Text>
        Let's take a look at what we have in the codebase. As from previous
        challenges, I first checked and scoped out where a final goal is - the{" "}
        <Code>flag.txt</Code> was within the root directory of the codebase, and
        the Dockerfile didn't hint at any particular renaming or randomness to
        the file location. Cool.
      </Text>
      <Text>
        Next, I decided to take a look at the exposed front-end. The front-end
        was a simple application that had very little functionality - most of
        the pages on the navbar redirected you to an error page.
      </Text>
      <Text>
        In fact, there was little to no functionality on the front-end, most of
        the code was just HTML and CSS. The only interesting part was some use
        of JavaScript, and a reference to a <Code>doRedirect</Code> function
        that is referenced to the <Code>serverActions.tsx</Code> file. Could be
        worth looking into later.
      </Text>
      <Codeblock
        language="typescript"
        code={`
export async function doRedirect() {
  redirect("/error");
}
      `}
      />
      <Text>
        Moving swiftly on, I decided to take a look at the Flask application.
        The Flask application was also pretty simple, with some basic
        authentication, and the main webpage being some sort of virus scanning
        page, where a user scans a particular directory for viruses.
      </Text>
      <CustomAccordion type={AccordionType.SIDETRACK} title="Authentication">
        <Stack gap={2}>
          <Text>
            Overall, the authentication seemed to be handled relatively well -
            granted there could be some potential vulnerabilities (such as the
            potential of spoofing tokens), but nothing that jumped out at me
            immediately (see code below). Keeping this in mind, but I doubted
            that this would be the main attack vector, if at all involved. On
            top of that, there is no obvious reason why we would want to spoof a
            request anyway - any user can create an account and scan a directory
            for viruses - the main purpose of this application.
          </Text>
          <Codeblock
            language="python"
            widthOffset="70px"
            code={`
def auth_middleware(func):
  def check_user(*args, **kwargs):
    db_session = Database()

    if not session.get("loggedin"):
      if request.args.get("token") and db_session.check_token(request.args.get("token")):
        return func(*args, **kwargs)
      else:
        return redirect("/login")

    return func(*args, **kwargs)

  check_user.__name__ = func.__name__
  return check_user
      `}
          />
        </Stack>
      </CustomAccordion>
      <Text>From here - I notice that there is the code below:</Text>
      <Codeblock
        language="python"
        code={`
@web.route("/home", methods=["GET", "POST"])
@auth_middleware
def feed():
  directory = request.args.get("directory")

  if not directory:
    dirs = os.listdir(os.getcwd())
    return render_template("index.html", title="home", dirs=dirs)

  if any(char in directory for char in invalid_chars):
    return render_template("error.html", title="error", error="invalid directory"), 400

  try:
    with open("./application/templates/scan.html", "r") as file:
        template_content = file.read()
        results = scan_directory(directory)
        template_content = template_content.replace("{{ results.date }}", results["date"])
        template_content = template_content.replace("{{ results.scanned_directory }}", results["scanned_directory"])
        return render_template_string(template_content, results=results)
      `}
      />
      <Text>
        The code above is the main function that is called when a user scans a
        directory for viruses. The function takes a directory as an argument
        (with some filtering), and then scans the directory for viruses. The
        results of the scan are then displayed on the page, through the{" "}
        <Code>render_template_string</Code> method. I smell a potential SSTI
        vulnerability here.
      </Text>
      <Text>
        I was also curious what invalid characters were being filtered out:
      </Text>
      <Codeblock
        language="python"
        code={`
invalid_chars = ["{{", "}}", ".", "_", "[", "]","\\", "x"]
      `}
      />
      <Text>
        Not too sure why these are being filtered out just yet, but to me it
        does look like some form of SSTI protection.
      </Text>
      <CustomAccordion
        type={AccordionType.SIDETRACK}
        title="Learning about Python's Templating Library"
      >
        <Stack gap={2}>
          <Text>
            Now I wasn't familiar with Python's Templating libraries, so I
            needed to take some time to understand how it worked before I went
            deeper.
          </Text>
          <Text>
            Python's templating library is known as Jinja2. Jinja2 works
            similarly to other templating libraries, such as Handlebars or EJS,
            in that it allows you to inject variables into your HTML. The main
            difference is that Jinja2 uses double curly braces to denote
            variables, and also allows for more complex operations, such as
            loops and conditionals.
          </Text>
          <Text>
            From here, I decided to loook on HackTricks to see if there was any
            potential SSTI payloads that I could use.
          </Text>
          <ImageWithCaption
            imagePath="/images/dox-2.png"
            caption="HackTricks SSTI payloads"
          />
          <Text>
            There were plenty. The filtered character list is now starting to
            make a bit more sense.
          </Text>
          <Text>
            I now wanted to understand what all the <Code>mro</Code> and{" "}
            <Code>__class__</Code> stuff was about. Essentially, the whole idea
            is that everything is an object in Python, and that objects have a
            method resolution order (mro) that determines how the object is
            constructed. The <Code>__class__</Code> attribute is a reference to
            the class that the object was created from. This is important, as it
            allows us to access the class's methods and attributes, which when
            we start stacking all together, can lead to some pretty powerful
            payloads.
          </Text>
          <Text>
            For example, the payload below can start from a string, and then
            access os.system to execute a command:
          </Text>
          <Codeblock
            language="python"
            code={`
''.__class__.mro()[1].__subclasses__()[396]('cat flag.txt',shell=True,stdout=-1).communicate()[0].strip()
          `}
          />
          <Text>
            This was crazy to me. Essentially, we get the string object, ask for
            its class (str), then ask for the method resolution order, and then
            ask for the 396th subclass (which is the subprocess.Popen class). We
            then execute the command "cat flag.txt" and return the output.
          </Text>
          <Text>
            We can use this to execute any command we want on the server, but as
            we'll see later on, it's not quite as simple (subtle foreshadowing).
          </Text>
        </Stack>
      </CustomAccordion>
      <CustomAccordion type={AccordionType.SIDETRACK} title="NextJS CVE">
        <Stack gap={2}>
          <Text>
            As previously mentioned, the front-end had a <Code>doRedirect</Code>{" "}
            function that was referenced to the <Code>serverActions.tsx</Code>{" "}
            file. I decided to take a look at this file to see what was going
            on. Realising that this was a NextJS application, I decided to take
            a look at the NextJS CVEs to see if there was anything that I could
            use to my advantage, as this particular redirect function seemed to
            be a potential attack vector.
          </Text>
          <Text>
            <ExternalLink
              href="https://nvd.nist.gov/vuln/detail/CVE-2024-34351"
              title="CVE-2024-34351"
            />
            . Certainly didn't take too long, and the description of the CVE is
            exactly what I was looking for - being able to redirect to an
            external site. On top of this, we were on NextJS 14.1.0 - the
            vulnerability was not patched until 14.1.1, nice!
          </Text>
          <Text>
            In a nutshell, the vulnerability allowed for an attacker to redirect
            to an external site by spoofing the Host and Origin headers. This
            worked as the NextJS application was not properly validating the
            Host and Origin headers, and would redirect to the site specified in
            the headers, thinking that it was a valid request.
          </Text>
        </Stack>
      </CustomAccordion>
      <Separator />
      <Heading fontWeight={800} fontSize="2xl" color="teal">
        Planning
      </Heading>
      <Text>
        From here, I decided to plan out my attack. I knew that I had to first
        exploit the NextJS vulnerability, as that was seemingly my only
        entrypoint. I could then potentially spoof the request to redirect to
        the Flask application, and then exploit the SSTI vulnerability via the
        innocuous NextJS frontend. We will probably have to figure out a way to
        circumvent the filtered characters list, however.
      </Text>
      <Separator />
      <Heading fontWeight={800} fontSize="2xl" color="teal">
        Execution
      </Heading>
      <Text>
        Let's exploit the NextJS vulnerability first. I first decided to see if
        we could indeed get this to work, so I spun up Burp Suite interceptor to
        intercept requests. I knew that the redirect was called whenever one of
        the links within the tables was clicked, so that was what I did.
      </Text>
      <ImageWithCaption
        imagePath="/images/dox-3.png"
        caption="Intercepting the request"
      />
      <Text>
        As outlined in the research I did earlier, I needed to modify my Host
        and Origin headers - so I pointed them both to example.com to see if the
        redirect would work. Pay attention that the Host header needs to be set
        without the protocol (http/https).
      </Text>
    </Stack>
  ),
  reflection: (
    <Stack width="full" minW="100%">
      <AccordionRoot collapsible defaultValue={["info"]} variant="enclosed">
        {reflectionItems.map((item) => (
          <AccordionItem key={item.value} value={item.value} py={2}>
            <AccordionItemTrigger
              cursor="pointer"
              textAlign="left"
              fontWeight={800}
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
