import { TagInfo } from "@/writeups/tags";
import { HStack } from "@chakra-ui/react";
import { Tag } from "@/components/ui/tag";

export function Tags({ tags }: { tags: TagInfo[] }) {
  return (
    <HStack gap={2}>
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
    </HStack>
  );
}
