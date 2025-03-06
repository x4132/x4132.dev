import Head from "next/head";
import Link from "next/link";
import { type HTMLAttributes, useCallback, useEffect, useState } from "react";
import ProjectCard from "~/components/ProjectCard";
import { SkillItem } from "~/components/SkillItem";

export default function Home() {
    return (
        <>
            <Head>
                <title>x4132.dev - Alex&apos;s site</title>
                <meta name="description" content="Alex/x4132's personal page" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <main className="linebox">
                <div className="grid grid-cols-1 md:grid-cols-3 text-center">
                    <h1 className="linebox">X4132.DEV</h1>
                    <h2 className="linebox hidden md:block">
                        SYSTEM: <span className="text-primary">ONLINE</span>
                    </h2>
                    <h3 className="linebox">
                        TIME:&nbsp;
                        <LiveClock /> UTC
                    </h3>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 text-center">
                    <h3 className="linebox">ABOUT</h3>
                    <h3 className="linebox">PROJECTS</h3>
                    <h3 className="linebox">CTF</h3>
                    <h3 className="linebox">CONTACT</h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-5">
                    <div className="linebox col-span-4">
                        <div className="linebox grid grid-cols-2">
                            <h1 className="text-4xl">PERSONNEL FILE</h1>
                            <div className="flex flex-col">
                                <p className="linebox py-0 mx-0">&gt; TABLE: ACTIVE PERSONNEL</p>
                                <p className="linebox py-0 mx-0">&gt; ENTRY: x4132</p>
                            </div>
                        </div>
                        <div className="linebox mt-3">
                            <p>Hello! I&apos;m Alex.</p>
                            <p>I&apos;m a current student at UBC, studying engineering.</p>
                            <p className="mt-2">
                                Apart from my studies, I&apos;m also on UBC Thunderbots, a student team
                                developing soccer-playing robots.
                            </p>
                            <p className="mt-2">
                                I also like to do CTFs (Capture-The-Flag) competitons, which are
                                competitive cybersecurity competitions. I&apos;m currently playing
                                with the UBC team{" "}
                                <Link href="https://maplebacon.org/" className="underline">
                                    Maple Bacon
                                </Link>
                                , a team that has won the{" "}
                                <Link
                                    href="https://defcon.org/html/links/dc-ctf.html"
                                    className="underline"
                                >
                                    DEF CON CTF
                                </Link>{" "}
                                for the last two years, as a member of the alliance MMM.
                            </p>
                            <p>
                                I&apos;m also the winner of N00bzCTF 2024, BTCTF 2024, and Cal Poly
                                SLO&apos;s Cybersecurity Grand Initiative with team NETSI. With the same
                                team, I&apos;ve also scored 10th place in Canada(50th global) in
                                picoCTF 2022.
                            </p>
                        </div>
                        <div className="linebox mt-3">
                            <h3>PERSON&apos;S CAPABILITIES</h3>
                            <div className="grid grid-cols-2 gap-2">
                                <SkillItem label="FRONTEND" value="85%" />
                                <SkillItem label="SECURITY" value="85%" />
                                <SkillItem label="BACKEND" value="85%" />
                                <SkillItem label="FIRMWARE" value="60%" />
                            </div>
                        </div>
                        <div className="linebox mt-3">
                            <section id="projects">
                                <h2 className="text-2xl font-bold mb-4 text-primary border-b-2 border-border pb-2">
                                    PROJECT DATABASE
                                </h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <ProjectCard
                                        title="MOTOR DRIVER FIRMWARE"
                                        code="TBOTS-001"
                                        status="IN DEVELOPMENT"
                                        description="A web application for monitoring system resources in real-time."
                                    />
                                    <ProjectCard
                                        title="SCANDIUM"
                                        code="PRJ-004"
                                        status="PLANNING"
                                        description="Local AI Code Scanner"
                                    />
                                    <ProjectCard
                                        title="MORTAR"
                                        code="PRJ-002"
                                        status="TERMINATED"
                                        description="Interactive question and revision platform."
                                    />
                                    <ProjectCard
                                        title="MODEL CREATOR"
                                        code="PRJ-001"
                                        status="COMPLETE"
                                        description="API gateway service with advanced routing and authentication."
                                    />
                                </div>
                            </section>
                        </div>
                    </div>
                    <div className="linebox hidden md:block col-span-1"></div>
                </div>
            </main>
        </>
    );
}

let currentAnimationFrame: number;
function LiveClock(props: HTMLAttributes<HTMLSpanElement>) {
    const [currentTime, setCurrentTime] = useState("");
    const animationFrame = useCallback(() => {
        const now = new Date();
        const hours = now.getUTCHours().toString().padStart(2, "0");
        const minutes = now.getUTCMinutes().toString().padStart(2, "0");
        const seconds = now.getUTCSeconds().toString().padStart(2, "0");
        const tenths = Math.floor(now.getUTCMilliseconds() / 10)
            .toString()
            .padStart(2, "0");
        setCurrentTime(`${hours}:${minutes}:${seconds}:${tenths}`);

        currentAnimationFrame = requestAnimationFrame(animationFrame);
    }, []);

    useEffect(() => {
        animationFrame();

        return () => {
            cancelAnimationFrame(currentAnimationFrame);
        };
    }, [animationFrame]);

    return <span {...props}>{currentTime}</span>;
}


