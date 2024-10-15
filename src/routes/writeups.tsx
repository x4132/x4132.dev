import { Html } from "@elysiajs/html";
import head from "./ui/head";

export default (
    <html lang="en">
        <head>
            {head}
            <script src="https://cdn.jsdelivr.net/npm/xterm@5.3.0/lib/xterm.min.js"></script>
            <link href="https://cdn.jsdelivr.net/npm/xterm@5.3.0/css/xterm.min.css" rel="stylesheet" />
            <title>CTF Writeups</title>
        </head>

        <body class="bg-dark text-light">
            <div id="terminal" ></div>
            <script src="/js/writeups.js" type="module"></script>
        </body>
    </html>
);
