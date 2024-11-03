import { WriteupType } from "@/writeups/index";
import {
  Card,
  CardRootProps,
  Flex,
  HStack,
  Heading,
  Text,
} from "@chakra-ui/react";
import { usePathname, useRouter } from "next/navigation";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";
import { Tags } from "./Tags";

interface PrevOrNextProps extends CardRootProps {
  writeup: WriteupType;
  type: string;
}

export function PrevOrNext({ writeup, type, ...rest }: PrevOrNextProps) {
  const curPath = usePathname().split("/").slice(0, -1).join("/");
  const router = useRouter();

  return (
    <Card.Root
      key={writeup.title}
      size="md"
      pb={6}
      shadow="lg"
      _hover={{ background: "teal.muted" }}
      cursor="pointer"
      onClick={() => {
        if (writeup.slug) {
          router.push(`${curPath}/${writeup.slug}`);
        }
      }}
      {...rest}
    >
      <Card.Header>
        <Flex direction="column" gap={0}>
          <HStack>
            {type === "Last" && <FaArrowLeft />}
            <Heading size="xl">{type} Writeup</Heading>
            {type === "Next" && <FaArrowRight />}
          </HStack>
          <Text>{writeup.title}</Text>
        </Flex>
      </Card.Header>
    </Card.Root>
  );
}

export function SummaryCard({ writeup }: { writeup: WriteupType }) {
  const curPath = usePathname();
  const router = useRouter();

  return (
    <Card.Root
      key={writeup.title}
      size="md"
      pb={6}
      w="100%"
      shadow="lg"
      _hover={{ background: "teal.muted" }}
      cursor="pointer"
      onClick={() => {
        if (writeup.slug) {
          router.push(`${curPath}/${writeup.slug}`);
        }
      }}
    >
      <Card.Header>
        <Flex direction="column" gap={0}>
          <Heading size="xl">{writeup.title}</Heading>
        </Flex>
        <Tags tags={writeup.tags} />
        <Text fontSize="md" fontWeight={100}>
          {writeup.synopsis}
        </Text>
      </Card.Header>
    </Card.Root>
  );
}
