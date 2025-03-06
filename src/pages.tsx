import type React from "react";

import { useState, useEffect } from "react";
import { Terminal, Mail, Github } from "lucide-react";
import Link from "next/link";

export default function Home() {
    const [bootSequence, setBootSequence] = useState(true);
    const [menuOpen, setMenuOpen] = useState(false);
    const [currentTime, setCurrentTime] = useState("");

    useEffect(() => {
        // Simulate boot sequence
        const timer = setTimeout(() => {
            setBootSequence(false);
        }, 3000);

        // Update time
        const timeInterval = setInterval(() => {
            const now = new Date();
            const hours = now.getHours().toString().padStart(2, "0");
            const minutes = now.getMinutes().toString().padStart(2, "0");
            const seconds = now.getSeconds().toString().padStart(2, "0");
            const tenths = Math.floor(now.getMilliseconds() / 100);
            setCurrentTime(`${hours}:${minutes}:${seconds}:${tenths}`);
        }, 100);

        return () => {
            clearTimeout(timer);
            clearInterval(timeInterval);
        };
    }, []);

    if (bootSequence) {
        return <BootSequence />;
    }

    return (
        <div className="min-h-screen bg-black text-cyan-400 font-mono flex flex-col p-4">
            <div className="container mx-auto max-w-6xl">
                {/* Main frame */}
                <div className="border-2 border-blue-500 p-1 bg-black">
                    {/* Header section */}
                    <div className="grid grid-cols-3 gap-1 mb-1">
                        <div className="border-2 border-blue-500 p-2 flex items-center justify-center">
                            <h1 className="text-xl md:text-2xl font-bold tracking-wider">
                                X4132.DEV
                            </h1>
                        </div>
                        <div className="border-2 border-blue-500 p-2 flex items-center justify-center">
                            <span className="text-lg md:text-xl">SYSTEM ONLINE</span>
                        </div>
                        <div className="border-2 border-blue-500 p-2 flex items-center justify-center">
                            <span className="text-lg md:text-xl">TIME: {currentTime}</span>
                        </div>
                    </div>

                    {/* Navigation */}
                    <div className="grid grid-cols-4 gap-1 mb-1">
                        <NavButton href="#about" label="ABOUT" />
                        <NavButton href="#projects" label="PROJECTS" />
                        <NavButton href="#contact" label="CONTACT" />
                        <NavButton href="https://github.com/x4132" label="GITHUB" />
                    </div>

                    {/* Main content area */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-1">
                        {/* Main display area */}
                        <div className="md:col-span-2 border-2 border-blue-500 p-1 min-h-[70vh]">
                            <div className="border-2 border-blue-500 p-4 h-full bg-black relative overflow-auto">
                                {/* Crosshair markers */}
                                <div className="absolute top-4 left-4 text-blue-500 text-2xl">
                                    +
                                </div>
                                <div className="absolute bottom-4 left-4 text-blue-500 text-2xl">
                                    +
                                </div>
                                <div className="absolute top-4 right-4 text-blue-500 text-2xl">
                                    +
                                </div>
                                <div className="absolute bottom-4 right-4 text-blue-500 text-2xl">
                                    +
                                </div>

                                {/* Content sections */}
                                <section id="about" className="mb-16 pt-8">
                                    <h2 className="text-2xl font-bold mb-4 text-cyan-400 border-b-2 border-blue-500 pb-2">
                                        PERSONNEL FILE
                                    </h2>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <p className="mb-4 text-cyan-400">
                                                {"> DEVELOPER PROFILE: X4132"}
                                            </p>
                                            <p className="mb-4 text-cyan-400">
                                                {"> STATUS: ACTIVE"}
                                            </p>
                                            <p className="mb-4 text-cyan-400">
                                                I am a developer with expertise in building web
                                                applications and systems. My mission is to create
                                                elegant solutions to complex problems.
                                            </p>
                                            <p className="mb-4 text-cyan-400">
                                                With a background in computer science and a passion
                                                for technology, I specialize in modern web
                                                development, system architecture, and UI/UX design.
                                            </p>
                                        </div>
                                        <div className="border-2 border-blue-500 p-4">
                                            <h3 className="text-xl font-bold mb-2 text-cyan-400">
                                                SYSTEM CAPABILITIES
                                            </h3>
                                            <div className="grid grid-cols-2 gap-2">
                                                <SkillItem label="FRONTEND" value="98.6%" />
                                                <SkillItem label="BACKEND" value="92.3%" />
                                                <SkillItem label="DATABASE" value="87.5%" />
                                                <SkillItem label="DEVOPS" value="76.2%" />
                                                <SkillItem label="UI/UX" value="89.7%" />
                                                <SkillItem label="SECURITY" value="82.1%" />
                                            </div>
                                        </div>
                                    </div>
                                </section>

                                <section id="projects" className="mb-16 pt-8">
                                    <h2 className="text-2xl font-bold mb-4 text-cyan-400 border-b-2 border-blue-500 pb-2">
                                        PROJECT DATABASE
                                    </h2>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <ProjectCard
                                            title="PROJECT ALPHA"
                                            code="PRJ-001"
                                            status="COMPLETE"
                                            description="A web application for monitoring system resources in real-time."
                                        />
                                        <ProjectCard
                                            title="DEEP SPACE"
                                            code="PRJ-002"
                                            status="ACTIVE"
                                            description="Interactive data visualization platform for complex datasets."
                                        />
                                        <ProjectCard
                                            title="NEXUS CORE"
                                            code="PRJ-003"
                                            status="ACTIVE"
                                            description="API gateway service with advanced routing and authentication."
                                        />
                                        <ProjectCard
                                            title="ORBITAL"
                                            code="PRJ-004"
                                            status="PLANNING"
                                            description="Mobile application for tracking satellite positions and data."
                                        />
                                    </div>
                                </section>

                                <section id="contact" className="pt-8">
                                    <h2 className="text-2xl font-bold mb-4 text-cyan-400 border-b-2 border-blue-500 pb-2">
                                        COMMUNICATION SYSTEMS
                                    </h2>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="border-2 border-blue-500 p-4">
                                            <h3 className="text-xl font-bold mb-4 text-cyan-400">
                                                TRANSMISSION FORM
                                            </h3>
                                            <form className="space-y-4">
                                                <div>
                                                    <label className="block text-xs text-cyan-400 mb-1">
                                                        SENDER ID:
                                                    </label>
                                                    <input
                                                        type="text"
                                                        className="w-full bg-black border-2 border-blue-500 p-2 text-cyan-400 focus:border-cyan-500 focus:outline-none"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-xs text-cyan-400 mb-1">
                                                        COMM CHANNEL:
                                                    </label>
                                                    <input
                                                        type="email"
                                                        className="w-full bg-black border-2 border-blue-500 p-2 text-cyan-400 focus:border-cyan-500 focus:outline-none"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-xs text-cyan-400 mb-1">
                                                        MESSAGE CONTENT:
                                                    </label>
                                                    <textarea
                                                        rows={4}
                                                        className="w-full bg-black border-2 border-blue-500 p-2 text-cyan-400 focus:border-cyan-500 focus:outline-none"
                                                    ></textarea>
                                                </div>
                                                <button
                                                    type="submit"
                                                    className="bg-black border-2 border-blue-500 text-cyan-400 px-4 py-2 hover:bg-blue-900/30 transition-colors w-full"
                                                >
                                                    TRANSMIT
                                                </button>
                                            </form>
                                        </div>
                                        <div className="border-2 border-blue-500 p-4">
                                            <h3 className="text-xl font-bold mb-4 text-cyan-400">
                                                COMM CHANNELS
                                            </h3>
                                            <div className="space-y-4">
                                                <ContactItem
                                                    icon={<Mail />}
                                                    label="EMAIL"
                                                    value="contact@x4132.dev"
                                                />
                                                <ContactItem
                                                    icon={<Github />}
                                                    label="GITHUB"
                                                    value="github.com/x4132"
                                                />
                                                <ContactItem
                                                    icon={<Terminal />}
                                                    label="TERMINAL"
                                                    value="x4132.dev"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </section>
                            </div>
                        </div>

                        {/* Status panel */}
                        <div className="border-2 border-blue-500 p-1">
                            <div className="border-2 border-blue-500 p-4 h-full bg-black">
                                <h2 className="text-xl font-bold mb-4 text-cyan-400 border-b-2 border-blue-500 pb-2">
                                    SYSTEM STATUS
                                </h2>

                                <div className="space-y-6">
                                    <StatusSection
                                        title="PRESENT P.O.R."
                                        items={[
                                            { label: "LOCATION", value: "SECTOR 7G" },
                                            { label: "SYSTEM", value: "X4132.DEV" },
                                            { label: "STATUS", value: "ONLINE" },
                                        ]}
                                    />

                                    <StatusSection
                                        title="SYSTEM METRICS"
                                        items={[
                                            { label: "CPU LOAD", value: "32.6%" },
                                            { label: "MEMORY", value: "48.2%" },
                                            { label: "STORAGE", value: "76.5%" },
                                            { label: "NETWORK", value: "ACTIVE" },
                                        ]}
                                    />

                                    <StatusSection
                                        title="ENVIRONMENT"
                                        items={[
                                            { label: "CONDITION", value: "NOMINAL" },
                                            { label: "SECURITY", value: "ENABLED" },
                                            { label: "BACKUPS", value: "CURRENT" },
                                        ]}
                                    />

                                    <div className="border-2 border-blue-500 p-2 mt-4">
                                        <h3 className="text-lg font-bold mb-2 text-cyan-400">
                                            AUTODECCOUNT
                                        </h3>
                                        <div className="w-full bg-blue-900/30 h-4 border border-blue-500">
                                            <div
                                                className="bg-cyan-400 h-full"
                                                style={{ width: "65%" }}
                                            ></div>
                                        </div>
                                        <div className="text-right text-sm mt-1">3534.934</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="border-2 border-blue-500 p-2 mt-1 text-center">
                        <p className="text-cyan-400">
                            NOSTROMO TERMINAL SYSTEM v2.0.25 © {new Date().getFullYear()} X4132.DEV
                        </p>
                    </div>
                </div>
            </div>

            {/* Overlay effects */}
            <div className="pointer-events-none fixed inset-0 bg-scanline opacity-10 z-50"></div>
            <div className="pointer-events-none fixed inset-0 bg-crt opacity-30 z-50"></div>
        </div>
    );
}

function BootSequence() {
    return (
        <div className="min-h-screen bg-black text-cyan-400 font-mono flex flex-col items-center justify-center p-4">
            <div className="w-full max-w-2xl border-2 border-blue-500 p-1">
                <div className="border-2 border-blue-500 p-6 bg-black">
                    <h1 className="text-2xl font-bold mb-6 text-center">
                        NOSTROMO TERMINAL SYSTEM
                    </h1>
                    <div className="terminal-text">
                        <p>{"> INITIALIZING BOOT SEQUENCE..."}</p>
                        <p>{"> CHECKING SYSTEM INTEGRITY..."}</p>
                        <p>{"> LOADING CORE MODULES..."}</p>
                        <p>{"> ESTABLISHING DATABASE CONNECTION..."}</p>
                        <p>{"> CONFIGURING INTERFACE..."}</p>
                        <p>{"> SYSTEM BOOT SEQUENCE COMPLETE"}</p>
                        <p className="mt-4 animate-pulse">{"> COMMENCE FINAL"}</p>
                    </div>
                </div>
            </div>
        </div>
    );
}

function NavButton({ href, label }: { href: string; label: string }) {
    return (
        <Link
            href={href}
            className="border-2 border-blue-500 p-2 flex items-center justify-center hover:bg-blue-900/30 transition-colors"
        >
            <span className="text-lg">{label}</span>
        </Link>
    );
}

function SkillItem({ label, value }: { label: string; value: string }) {
    return (
        <div className="flex flex-col">
            <span className="text-cyan-400 text-sm">{label}</span>
            <div className="flex justify-between items-center">
                <div className="w-full bg-blue-900/30 h-2 border border-blue-500 mr-2">
                    <div className="bg-cyan-400 h-full" style={{ width: value }}></div>
                </div>
                <span className="text-cyan-400 text-xs whitespace-nowrap">{value}</span>
            </div>
        </div>
    );
}

function ProjectCard({
    title,
    code,
    status,
    description,
}: {
    title: string;
    code: string;
    status: string;
    description: string;
}) {
    return (
        <div className="border-2 border-blue-500 p-3 hover:bg-blue-900/20 transition-colors">
            <div className="flex justify-between mb-2">
                <h3 className="font-bold text-cyan-400">{title}</h3>
                <span className="text-xs text-cyan-400">{code}</span>
            </div>
            <p className="mb-2 text-cyan-400 text-sm">{description}</p>
            <div className="flex justify-between items-center">
                <span className="text-xs text-cyan-400">STATUS:</span>
                <span
                    className={`text-xs ${status === "COMPLETE" ? "text-green-400" : status === "ACTIVE" ? "text-amber-400" : "text-red-400"}`}
                >
                    {status}
                </span>
            </div>
        </div>
    );
}

function ContactItem({
    icon,
    label,
    value,
}: {
    icon: React.ReactNode;
    label: string;
    value: string;
}) {
    return (
        <div className="flex items-center gap-3">
            <div className="text-cyan-400">{icon}</div>
            <div>
                <div className="text-xs text-cyan-400">{label}:</div>
                <div className="text-cyan-400">{value}</div>
            </div>
        </div>
    );
}

function StatusSection({
    title,
    items,
}: {
    title: string;
    items: { label: string; value: string }[];
}) {
    return (
        <div className="border-2 border-blue-500 p-2">
            <h3 className="text-lg font-bold mb-2 text-cyan-400">{title}</h3>
            <div className="space-y-2">
                {items.map((item, index) => (
                    <div key={index} className="flex justify-between text-sm">
                        <span className="text-cyan-400">{item.label}</span>
                        <span className="text-cyan-400">{item.value}</span>
                    </div>
                ))}
            </div>
        </div>
    );
}
