"use client";

import { Box, Flex, HStack, Link, Text } from "@chakra-ui/react";
import { usePathname } from "next/navigation";

type Link = {
  name: string;
  href: string;
};

const Links: Link[] = [
  {
    name: "Home",
    href: "/",
  },
  {
    name: "Challenges",
    href: "/challenges",
  },
  {
    name: "Reflections",
    href: "/reflections",
  },
];

function NavLink({ link, active }: { link: Link; active: boolean }) {
  return (
    <Link
      px={2}
      pt={1}
      rounded={"lg"}
      _hover={{
        textDecoration: "none",
        bg: "gray.300",
      }}
      bg={active ? "blue.muted" : ""}
      href={link.href}
    >
      {link.name}
    </Link>
  );
}

export default function Navbar() {
  const currentPath = usePathname();

  return (
    <Box px={4} backgroundColor="gray.200" justifyContent="center">
      <Flex h={16} alignItems={"center"} justifyContent={"space-between"}>
        <HStack gap={8} alignItems={"center"}>
          <HStack as={"nav"} gap={4} display={{ base: "none", md: "flex" }}>
            {Links.map((link) => (
              <NavLink
                key={link.name}
                link={link}
                active={currentPath === link.href}
              />
            ))}
          </HStack>
        </HStack>
        <Text fontSize="lg" fontWeight={600}>
          COMP6841 Something Awesome
        </Text>
      </Flex>
    </Box>
  );
}
