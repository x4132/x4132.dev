import { Html } from "@elysiajs/html";
import { github, linkedin } from "./socials";

export default (
    <>
        <footer class="w-full mt-auto p-2">
            <hr />
            <div class="mt-4 flex justify-center text-2xl space-x-4">
                <a href={github} class="hover:opacity-75 opacity-20">
                    <i data-feather="github"></i>
                </a>
                <a href={linkedin} class="hover:opacity-75 opacity-20">
                    <i data-feather="linkedin"></i>
                </a>
            </div>
            <div class="mt-4 flex justify-center opacity-20">
                Built with&nbsp;<a href="https://tailwindcss.com" target="_blank">Tailwind</a>,&nbsp;<a href="https://htmx.org" target="_blank" >HTMX</a>, and&nbsp;<a href="https://elysiajs.com" target="_blank" >Elysia</a>
            </div>
        </footer>
        <script src="/js/render_feather.js" async defer></script>
    </>
);
