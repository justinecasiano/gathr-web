import type {Metadata} from "next";
import {Instrument_Sans, Inter, Rethink_Sans} from "next/font/google";
import "./globals.css";
import {cn} from "@/lib/utils";
import QueryProvider from "@/providers/query-provider";

const inter = Inter({subsets: ['latin'], variable: '--font-sans'});

const instrumentSans = Instrument_Sans({
    variable: "--font-instrument-sans",
    subsets: ["latin"],
});

const rethinkSans = Rethink_Sans({
    variable: "--font-rethink-sans",
    subsets: ["latin"],
});

export const metadata: Metadata = {
    title: "Gathr Web",
    description: "Gathr Web",
};

export default function RootLayout({
                                       children,
                                   }: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en" className={cn("font-sans", inter.variable)}>
        <body
            className={`${instrumentSans.variable} ${rethinkSans.variable} antialiased`}
        >
        <QueryProvider>
            {children}
        </QueryProvider>
        </body>
        </html>
    );
}
