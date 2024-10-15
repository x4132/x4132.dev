import { Html } from "@elysiajs/html";
import navbar from "./ui/navbar";
import head from "./ui/head";
import footer from "./ui/footer";

const reactLogo = (style: string) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="-11.5 -10.23174 23 20.46348" style={style} >
        <title>React Logo</title>
        <circle cx="0" cy="0" r="2.05" fill="#61dafb" />
        <g stroke="#61dafb" stroke-width="1" fill="none">
            <ellipse rx="11" ry="4.2" />
            <ellipse rx="11" ry="4.2" transform="rotate(60)" />
            <ellipse rx="11" ry="4.2" transform="rotate(120)" />
        </g>
    </svg>
);

export default (
    <html lang="en">
        <head>
            {head}
            <script src="/js/about.js" type="module" async defer></script>
            <title>Home - Alex - 0x41*32</title>
        </head>

        <body class="relative overflow-x-hidden">
            {navbar}
            <div id="hook" class="lg:ps-4 md:pt-2 ps-2">
                <h1 class="text-2xl">
                    Hello! I'm <b>Alex</b>.
                </h1>
                <p class="text-2xl">
                    I&apos;m a <b>Fullstack Developer</b> <br />
                    with Specialization in <br />
                </p>
                <div class="flex items-center text-2xl">
                    <b>Shopify</b>&nbsp;and&nbsp;<b>React&nbsp;</b>
                    <span class="w-6 h-6 flex items-center p-0 animate-spin-slower">
                        {reactLogo("width: 1.5rem; height: 1.5rem;")}
                    </span>
                    &nbsp;.
                </div>

            </div>
            <div id="animation-spacer" class="h-1/2">
                {/* <div data-scroll-lines="1000" class="rotate-[75deg] origin-top border h-0 absolute top-1/4 -right-1 -z-10"></div> */}
            </div>
            <div class="flex justify-center">
                <div id="startMainContent" class="grid grid-cols-2 w-full absolute top-[calc(100%-3rem)] max-w-screen-md">
                    <div class="flex items-center justify-center col-span-2">
                        <div class="border rounded-full border-dark dark:border-light h-8 w-8"></div>
                    </div>
                    <div class="linebar h-32"></div>
                    <div></div>

                    <div class="linebar">
                        <h3>2024</h3>
                        <h2 class="linebar-header">About Me</h2>
                        <p>
                            My name is Alex. I'm a freshman studying Engineering at the
                            University of British Columbia.
                        </p>
                        <p>
                            Outside of software, some of my hobbies include cycling,
                            Urban Exploration, and working with hardware.
                        </p>
                    </div>
                    <div></div>

                    <div class="linebar"></div>
                    <div class="p-2 pt-16">
                        <h2 class="linebar-header">Software Interests</h2>
                        <p>
                            Outside of my current work developing apps for shopify, I maintain
                            a strong interest in Cybersecurity, participating in CTFs
                            (Cybersecurity Competitions) with Maple Bacon.
                        </p>
                        <p>
                            Some of my recent competitions include n00bzCTF, where I won 1st
                            place with a team of 4, multiple high rank with Maple Bacon, UBC's CTF Team, and 1st place
                            in BTCTF in a small team of 3.
                        </p>
                    </div>

                    <div class="linebar">
                        <h3>2024 - Present</h3>
                        <h2 class="linebar-header">UBC Thunderbots</h2>
                        <p>
                            In addition to my studies at UBC, I have also decided to participate in the UBC Thunderbots Electrical Subteam.
                            The goal of UBC Thunderbots is to create soccer playing robots that play against other robots in a tournament.
                            Currently, I am working on the firmware for a motor driver board, which is used to control the speed and positon of a motor given an input.
                        </p>
                    </div>
                    <div></div>

                    <div class="linebar"></div>
                    <div class="p-2 pt-16 pb-8">
                        <h3>2022 - Present</h3>
                        <h2 class="linebar-header">Planet Earth Healthcare</h2>
                        <p>
                            At PEHC, I worked on both shopify and bigcommerce sites, as well
                            as on fullstack CRUD apps in node.
                        </p>
                        <p>
                            I also maintained pages by migrating and updating the storefronts'
                            platforms. Additionally, I helped to analyze and optimize
                            performance, increasing one site's PageSpeed rank by over 14 points.
                        </p>
                    </div>
                    <div></div>
                    <div class="col-span-2">{footer}</div>
                </div>
            </div>
        </body>
    </html>
);
