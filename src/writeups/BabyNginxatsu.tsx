import { WriteupType } from ".";
import { Medium, JavaScript, XSS, RCE } from "./tags";

export const BabyNginxatsu: WriteupType = {
  title: "Baby Nginxatsu",
  slug: "baby-nginxatsu",
  author: "makelaris",
  authorLink: "https://app.hackthebox.com/users/107",
  challengeLink: "https://app.hackthebox.com/challenges/baby%2520nginxatsu",
  tags: [Medium],
  synopsis:
    "A website that dynamically generates Nginx configuration files based on user input. What could go wrong?",
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
