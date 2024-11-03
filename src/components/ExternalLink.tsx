import { Link } from "@chakra-ui/react";
import { LuExternalLink } from "react-icons/lu";

export default function ExternalLink({
  href,
  title,
}: {
  href: string;
  title: string;
}) {
  return (
    <Link href={href} colorPalette="teal" target="_blank">
      {title} <LuExternalLink />
    </Link>
  );
}
