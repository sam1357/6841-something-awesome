import { TagInfo } from "@/writeups/tags";
import { Flex, FlexProps } from "@chakra-ui/react";
import { Tag } from "@/components/ui/tag";

interface TagProps extends FlexProps {
  tags: TagInfo[];
}

export function Tags({ tags, ...rest }: TagProps) {
  return (
    <Flex flexWrap="wrap" gap={2} {...rest}>
      {tags.map((tag, i) => (
        <Tag
          key={i}
          colorPalette={tag.color}
          size="xl"
          rounded="xl"
          justifyContent="center"
        >
          {tag.name}
        </Tag>
      ))}
    </Flex>
  );
}
