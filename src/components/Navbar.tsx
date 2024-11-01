"use client";

import { useState } from "react";
import { Box, Flex, HStack, IconButton, Link, Text } from "@chakra-ui/react";
import { usePathname } from "next/navigation";
import { GiHamburgerMenu } from "react-icons/gi";
import { IoCloseOutline } from "react-icons/io5";

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
  {
    name: "Methodology & Tips",
    href: "/method",
  },
];

function NavLink({ link, active }: { link: Link; active: boolean }) {
  return (
    <Link
      px={2}
      pb={1}
      rounded={"lg"}
      _hover={{
        textDecoration: "none",
        bg: "teal.solid",
      }}
      bg={active ? "teal.muted" : ""}
      href={link.href}
    >
      {link.name}
    </Link>
  );
}

export default function Navbar() {
  const currentPath = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <Box px={4} backgroundColor="teal.900" justifyContent="center">
      <Flex h={16} alignItems={"center"} justifyContent={"space-between"}>
        <HStack gap={8} alignItems={"center"}>
          <IconButton
            aria-label="Menu"
            onClick={toggleMenu}
            px={3}
            rounded="xl"
            display={{ base: "block", md: "none" }}
            variant="ghost"
            colorPalette="teal"
            _hover={{ bg: "teal.muted" }}
          >
            {isMenuOpen ? <IoCloseOutline /> : <GiHamburgerMenu />}
          </IconButton>
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
        <Text
          fontSize="lg"
          fontWeight={600}
          display={{ base: "none", md: "block" }}
        >
          COMP6841 Something Awesome
        </Text>
      </Flex>
      {isMenuOpen && (
        <Box
          py={4}
          bg="teal.900"
          textAlign="center"
          display={{ base: "block", md: "none" }}
        >
          <HStack as={"nav"} direction="column" gap={4}>
            {Links.map((link) => (
              <NavLink
                key={link.name}
                link={link}
                active={currentPath === link.href}
              />
            ))}
          </HStack>
        </Box>
      )}
    </Box>
  );
}
