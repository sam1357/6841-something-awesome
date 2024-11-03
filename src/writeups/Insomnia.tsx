import {
  Stack,
  Code,
  Text,
  Heading,
  List,
  AccordionItem,
  AccordionItemContent,
  AccordionItemTrigger,
  AccordionRoot,
  Icon,
} from "@chakra-ui/react";
import { ReflectionItem, WriteupType } from "./";
import { Easy, PHP, SSRF } from "./tags";
import { Codeblock } from "@/components/Codeblock";
import { ImageWithCaption } from "@/components/ImageWithCaption";
import { LuTestTube } from "react-icons/lu";
import { SiPersistent } from "react-icons/si";
import CustomAccordion, { AccordionType } from "@/components/CustomAccordion";
import { MdOutlineSecurity } from "react-icons/md";
import ExternalLink from "@/components/ExternalLink";

const reflectionItems: ReflectionItem[] = [
  {
    value: "test",
    icon: <LuTestTube />,
    title: "Test, test, test!",
    content: (
      <Stack gap={1}>
        <Text>
          This challenge serves as a good reminder of the importance of testing
          and code review. The vulnerability in this challenge was a simple
          logic error, but it was one that could have been easily caught with
          some testing.
        </Text>
      </Stack>
    ),
  },
  {
    value: "pragmatism",
    icon: <SiPersistent />,
    title: "Staying persistent but pragmatic",
    content: (
      <Stack gap={1}>
        <Text>
          This challenge was a good reminder of the importance of staying
          persistent but pragmatic. I think it was a good approach to move on
          from testing for SQLi and JWT bypasses when I realised that these were
          probably too complicated for the scope of this challenge. Balancing
          persistence with pragmatism is key in CTFs.
        </Text>
      </Stack>
    ),
  },
  {
    value: "cves",
    icon: <MdOutlineSecurity />,
    title: "CVEs and sidetracks",
    content: (
      <Stack gap={1}>
        <Text>
          I think it's important to remember that not all CVEs are relevant to
          the challenge at hand. It's easy to get sidetracked by vulnerabilities
          that are not present in the version of the software you are working
          with. It's important to stay focused on the challenge and not get lost
          in the weeds of irrelevant CVEs.
        </Text>
      </Stack>
    ),
  },
];

export const Insomnia: WriteupType = {
  title: "Insomnia",
  slug: "insomnia",
  author: "khanhhnahk1",
  authorLink: "https://app.hackthebox.com/users/1051133",
  challengeLink: "https://app.hackthebox.com/challenges/610",
  tags: [Easy, PHP, SSRF],
  timeTaken: "1 hour",
  synopsis:
    "Another web challenge with a PHP backend, with a basic logic error leading to unintended consequences.",
  content: (
    <Stack gap={2}>
      <Text>
        Another PHP challenge this time round. Let's jump right into it.
      </Text>
      <Heading fontWeight={800} fontSize="2xl" color="teal">
        Reconnaissance
      </Heading>
      <Text>
        The first thing I noticed with this particular challenge was that the
        source codebase seems to be massive compared to the other previous
        challenges.
      </Text>
      <ImageWithCaption
        imagePath="/images/insom-1.png"
        caption="The source code for the challenge"
      />
      <Text>
        What on earth - I thought this was meant to be an easy challenge. But as
        I started to look through the code, I realised a lot of the folders
        contained little to no code - this was probably a framework.
      </Text>
      <ImageWithCaption
        imagePath="/images/insom-2.png"
        caption="Reference to framework"
      />
      <Text>
        Ah yep - it's a framework known as CodeIgniter. My first thought was
        that there could be a vulnerability in the framework itself, but
        continued to look through the codebase during this reconnaissance phase.
      </Text>
      <CustomAccordion
        type={AccordionType.SIDETRACK}
        title="CodeIgniter vulnerabilities"
      >
        <Stack gap={1}>
          <Text>
            CodeIgniter has had its fair share of vulnerabilities in the past,
            for example:{" "}
            <ExternalLink
              href="https://nvd.nist.gov/vuln/detail/CVE-2022-40828"
              title="this SQLi vulnerability"
            />
            . Thinking I was on the right track already, I noticed the version -
            below versions 3.1.13. The version we were using in this repo was
            already v4, so this was a no-go.
          </Text>
          <Text>
            Given that this challenge was released in 2021, it was unlikely that
            this vulnerability would be present in this challenge. I decided to
            continue looking through the source code for the challenge.
          </Text>
          <Text>
            Naturally, my next Google search was "CodeIgniter v4
            vulnerabilities". This yielded more results to my surprise!
          </Text>
          <List.Root>
            <List.Item>
              <ExternalLink
                href="https://nvd.nist.gov/vuln/detail/CVE-2022-21715"
                title="CVE-2022-212715"
              />
            </List.Item>
            <List.Item>
              <ExternalLink
                href="https://nvd.nist.gov/vuln/detail/CVE-2023-46240"
                title="CVE-2023-46240"
              />
            </List.Item>
          </List.Root>
          <Text>
            Unfortunately, both CVEs were only present in versions prior to
            4.4.3. We were on 4.4.4 (lol). That was an interesting, but
            ultimately fruitless sidetrack.
          </Text>
        </Stack>
      </CustomAccordion>
      <Text>
        The <Code>entrypoint.sh</Code> contained some interesting information -
        that there was a basic SQLite database with a table named{" "}
        <Code>users</Code> containing a single user with the username{" "}
        <Code>administator</Code> and a random password. There was also no
        mention of the <Code>flag.txt</Code> being randomly named and placed
        somewhere else. There was also a randomly generated{" "}
        <Code>JWT_SECRET</Code>, stored as an env variable.
      </Text>
      <Text>
        Playing around with the website, and in knowing that there are JWTs
        involved, I checked how these JWTs were being stored - as I suspected,
        they were being stored in a cookie.
      </Text>
      <ImageWithCaption imagePath="/images/insom-5.png" />
      <Text>
        Continuing to snoop around the source code - there's this interesting
        file called <Code>ProfileController.php</Code> which contained the
        following code snippet:
      </Text>
      <Codeblock
        language="php"
        code={`
  public function index()
    {
        $token = (string) $_COOKIE["token"] ?? null;
        $flag = file_get_contents(APPPATH . "/../flag.txt");
        if (isset($token)) {
            $key = (string) getenv("JWT_SECRET");
            $jwt_decode = JWT::decode($token, new Key($key, "HS256"));
            $username = $jwt_decode->username;
            if ($username == "administrator") {
                return view("ProfilePage", [
                    "username" => $username,
                    "content" => $flag,
                ]);
                `}
      />
      <Text>
        Well - clearly we need to get admin access to get the flag in this case.
      </Text>
      <Text>
        The actual HTML pages were stored in the <Code>Views</Code> folder, and
        most of these had little interesting code. They mostly contained the
        HTML for the pages. Checking the rest of the folders, it looked like the
        most interesting code was all contained within the{" "}
        <Code>Controllers</Code> folder.
      </Text>
      <Text>
        SQL injection seemed to be a dead end, as the application was using
        prepared statements. I also tried to see if there was any way to bypass
        the JWT token, but that seemed to be far too deep of a rabbit hole to
        look into, surely there was a simpler way.
      </Text>
      <Heading fontWeight={800} fontSize="2xl" color="teal">
        Exploitation
      </Heading>
      <Text>
        Taking a closer look at the <Code>UserController.php</Code> file, we
        have the main logic for the login and registration of users - I
        suspected that this would be the place to look for the vulnerability
        given that our end goal was to get the flag via logging in as the
        administrator.
      </Text>
      <Codeblock
        language="php"
        code={`
$db = db_connect();
$json_data = request()->getJSON(true);
if (!count($json_data) == 2) {
    return $this->respond("Please provide username and password", 404);
}
$query = $db->table("users")->getWhere($json_data, 1, 0);
$result = $query->getRowArray();
if (!$result) {
    return $this->respond("User not found", 404);
} else {
    $key = (string) getenv("JWT_SECRET");
// rest of login logic
          `}
      />
      <Text>
        Wait a minute - the if condition looks a bit off. It's checking if the
        count of the JSON data is not equal to 2 - but it seems to be missing
        some brackets. The placement of the <Code>!</Code> next to the{" "}
        <Code>count</Code> function seems to be a mistake.{" "}
        <Code>count($json_data)</Code> would of course return a number of the
        elements in the JSON data, which would be 2 in a normal login scenario.
        But, because of the <Code>!</Code> operator, we get a boolean value out
        of the LHS, which would never be equal to 2.
      </Text>
      <Text>
        Paying attention to the login logic, all we are doing is querying the
        database based on the fields we provide it. So, if I don't provide a
        password, then there is no need to match the password field in the
        database and I could login as any user. With the flaw in the if logic
        condition, by providing only one key, the if condition would never
        trigger (in fact, it never does).
      </Text>
      <ImageWithCaption imagePath="/images/insom-3.png" />
      <Text>
        Hmm, not quite there. As you can see int he request tab, the password
        field is still present, just empty. The database query would still be
        matching against the empty string, which is of course false, so we
        aren't quite there yet.
      </Text>
      <Text>
        No stress, we can just remove the password field from the request and
        send it manually ourselves, not through the website. I just used
        Firefox's built in dev tools to spoof a request.
      </Text>
      <ImageWithCaption imagePath="/images/insom-4.png" caption="Success!" />
      <Text>
        Nice - we have a token now. Interestingly, the page didn't redirect me
        to the profile page where I could grab the flag. Instead, I manually
        spoofed my own cookie to contain the token for the admin, and navigated
        to the profile page.
      </Text>
      <ImageWithCaption
        imagePath="/images/insom-6.png"
        caption="We have the flag :)"
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
              fontSize="20px"
              textAlign="left"
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
