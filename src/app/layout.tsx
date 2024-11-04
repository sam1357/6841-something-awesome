import Navbar from "@/components/Navbar";
import { Provider } from "@/components/ui/provider";
import { Box } from "@chakra-ui/react";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "COMP6841 SAP | z5418112",
  description: "Welcome to Sam's Something Awesome COMP6841 Project!",
};

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
