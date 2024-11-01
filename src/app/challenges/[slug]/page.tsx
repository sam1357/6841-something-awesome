import WriteupWrapper from "@/components/WriteupWrapper";
import { WriteupInfo } from "@/writeups";

export default async function WriteupPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const slug = (await params).slug;

  if (!slug || typeof slug !== "string") {
    return <p>Loading...</p>;
  }

  const writeup = WriteupInfo[slug];

  if (!writeup) {
    return <p>Writeup not found</p>;
  }

  return <WriteupWrapper writeup={writeup} />;
}
