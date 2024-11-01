import Navbar from "@/components/Navbar";
import { Provider } from "@/components/ui/provider";
import { Box } from "@chakra-ui/react";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <Provider>
          <Navbar />
          <main>
            <Box maxW="100vw" maxH="100vh">
              {children}
            </Box>
          </main>
        </Provider>
      </body>
    </html>
  );
}
