import { WriteupType } from ".";
import { Hard, JavaScript, Python, XSS, RCE } from "./tags";

export const DoxPit: WriteupType = {
  title: "DoxPit",
  slug: "doxpit",
  author: "leanthedev",
  authorLink: "https://app.hackthebox.com/users/1338083",
  challengeLink: "https://app.hackthebox.com/challenges/645",
  tags: [Hard, JavaScript, Python, XSS, RCE],
  synopsis:
    "A simple calculator that is poorly designed (using eval) and is vulnerable to a client-side attack.",
  reflection: (
    <>
      <p>
        This challenge was a simple one, but it was a good introduction to the
        concept of client-side attacks. The challenge was to find a way to
        execute code on the server by exploiting the calculator's use of the
        eval function. The eval function is a dangerous function to use in
        JavaScript, as it can execute any code passed to it. This challenge was
        a good reminder of the importance of validating user input and not using
        dangerous functions like eval.
      </p>
    </>
  ),
  content: (
    <>
      <p>
        The challenge was to find a way to execute code on the server by
        exploiting the calculator's use of the eval function. The eval function
        is a dangerous function to use in JavaScript, as it can execute any code
        passed to it. This challenge was a good reminder of the importance of
        validating user input and not using dangerous functions like eval.
      </p>
    </>
  ),
};
