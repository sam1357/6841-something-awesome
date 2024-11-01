"use client";

import { Box, Code } from "@chakra-ui/react";
import { themes } from "prism-react-renderer";
import { Highlight } from "prism-react-renderer";

export function Codeblock({
  language,
  code,
}: {
  language: string;
  code: string;
}) {
  return (
    <Highlight language={language} code={code} theme={themes.okaidia}>
      {({ style, tokens, getLineProps, getTokenProps }) => (
        <Code
          padding={2}
          px={4}
          rounded="md"
          display="block"
          whiteSpace="pre"
          backgroundColor="gray.900"
          overflow="auto"
        >
          {tokens.map((line, i) => (
            <Box key={i} {...getLineProps({ line })}>
              {line.map((token, key) => (
                <Box as="span" key={key} {...getTokenProps({ token })} />
              ))}
            </Box>
          ))}
        </Code>
      )}
    </Highlight>
  );
}
