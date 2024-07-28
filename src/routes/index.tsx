import { Html } from "@elysiajs/html";
import navbar from "./ui/navbar";
import headBoilerplate from "./head-boilerplate";

export default (
    <html data-bs-theme="light" lang="en">
        <head>
            {headBoilerplate}
            <title>Home - Alex - 0x41*32</title>
        </head>

        <body>
            {navbar}
            
        </body>

    </html>
)