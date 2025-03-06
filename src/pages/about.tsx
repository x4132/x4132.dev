import Head from "next/head";
import Navbar from "~/components/navbar";

export default function About() {
    return (
        <>
            <Head>
                <title>x4132.dev - Alex&apos;s site</title>
                <meta name="description" content="Alex/x4132's personal page" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <main className="bg-background">
                <Navbar />
            </main>
        </>
    );
}
