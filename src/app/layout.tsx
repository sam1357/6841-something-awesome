import Navbar from "@/components/Navbar";
import { Providers } from "./providers";
import { Box } from "@chakra-ui/react";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <Providers>
          <Navbar />
          <main>
            <Box p={4} maxW="100vw" maxH="100vh">
              {children}
            </Box>
          </main>
        </Providers>
      </body>
    </html>
  );
}
