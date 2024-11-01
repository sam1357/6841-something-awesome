import { Image, Text, BoxProps, ImageProps, Flex } from "@chakra-ui/react";
import React from "react";

interface ImageWithCaptionProps extends BoxProps {
  imagePath: string;
  caption: string;
  imageProps?: ImageProps;
}

export function ImageWithCaption({
  imagePath,
  caption,
  imageProps,
}: ImageWithCaptionProps) {
  return (
    <Flex alignItems="center" direction="column">
      <Image src={imagePath} alt={caption} {...imageProps} rounded="xl" />
      <Text mt={2} fontStyle="italic" fontWeight={600}>
        {caption}
      </Text>
    </Flex>
  );
}
