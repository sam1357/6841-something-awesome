"use client";

import { Box, Code } from "@chakra-ui/react";
import { themes } from "prism-react-renderer";
import { Highlight } from "prism-react-renderer";
import { useColorMode } from "./ui/color-mode";

export function Codeblock({
  language,
  code,
  widthOffset = "32px",
}: {
  language: string;
  code: string;
  widthOffset?: string;
}) {
  const { colorMode } = useColorMode();

  return (
    <Highlight
      language={language}
      code={code}
      theme={colorMode === "light" ? themes.nightOwlLight : themes.nightOwl}
    >
      {({ tokens, getLineProps, getTokenProps }) => (
        <Code
          p={2}
          px={4}
          rounded="md"
          display="block"
          whiteSpace="pre"
          overflowX="scroll"
          maxWidth={`calc(100vw - ${widthOffset})`}
        >
          {tokens.map((line, i) => (
            <Box key={i} {...getLineProps({ line })} maxWidth="100%">
              {line.map((token, key) => (
                <Box
                  as="span"
                  maxWidth="100%"
                  key={key}
                  {...getTokenProps({ token })}
                />
              ))}
            </Box>
          ))}
        </Code>
      )}
    </Highlight>
  );
}
