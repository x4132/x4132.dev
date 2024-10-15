import { Html } from "@elysiajs/html";
import navbar from "./ui/navbar";
import head from "./ui/head";
import footer from "./ui/footer";
import { Children } from "@kitajs/html";

export const VLine = () => (
    <>
        <div class="linebar h-16"></div>
        <div></div>
    </>
)

export const Project = {
    Wrapper: ({ year, children }: { year?: number, children?: Children }) => (
        <div class="text-center col-span-2 mt-2">
            <h3>{year}</h3>
            <Html.Fragment>{children}</Html.Fragment>
        </div>
    ),
    Title: ({ children }: { children?: Children }) => (
        <h2 class="linebar-header">{children}</h2>
    ),
    Body: ({ children }: { children?: Children }) => (
        <p class="mt-2 text-justify">{children}</p>
    )
}

export default (
    <html lang="en">
        <head>
            {head}
            <title>Projects - Alex - 0x41*32</title>
        </head>
        <body>
            {navbar}
            <h1 class="text-4xl text-center mt-16" >Projects</h1>
            <h2 class="text-2xl text-center" >Fullstack Apps, Frontends, UI</h2>

            <div class="flex justify-center">
                <div id="startMainContent" class="grid grid-cols-2 w-full absolute top-[calc(50%-10rem)] max-w-screen-md">
                    <div class="flex items-center justify-center col-span-2">
                        <div class="border rounded-full border-dark dark:border-light h-8 w-8"></div>
                    </div>
                    <VLine />
                    <Project.Wrapper year={2022} >
                        <Project.Title>Mortar - The Revision Tool for IB Math/Sciences</Project.Title>
                        <img src="/public/img/mortar.png" />
                        <Project.Body>
                            I created Mortar, a study site for IB Mathematics & Sciences that was free and accessible to everyone.
                            The site incorporates past exam questions as well as general exam-style questions, and also carries a lot of beneficial UX features such as marking a question as done.
                            Questions are stored in a hybrid HTML and LaTeX-based format that allows questions to be easily stored as text and rendered into images using KaTeX.
                        </Project.Body>
                    </Project.Wrapper>
                    <VLine />
                    <Project.Wrapper year={2021}>
                        <Project.Title>HaloHealthcare.com/YesWellness.com - Brands Index</Project.Title>
                        <img src="/public/img/brands.png" />
                        <Project.Body>
                            At my onsite internship in 2021, I worked not only on SEO, but also on the migration of one of PEHC's sites to Shopify from BigCommerce.
                            As a part of this migration, one of my primary tasks was to create a brands index page. 
                            The final deliverable is a responsive brands page that includes several colums for high information density, while featuring logos for easy brand recognition.
                            Brands are also sorted and indexed alphabetically on the server, but are searched for with client-side fuzzy sorting to reduce server load.
                        </Project.Body>
                    </Project.Wrapper>
                    <VLine />
                    <Project.Wrapper year={2020}>
                        <Project.Title>Custom-order 3D Printed Geographical Models</Project.Title>
                        <img src="/public/img/areaselector.png" />
                        <Project.Body>
                            I worked on a ecommerce website that allowed general consumers to directly order 3D Printed terrain maps.
                            These terrain maps are generally bought to commemorate an event such as a hike or other monumental outdoor trip.
                        </Project.Body>
                    </Project.Wrapper>
                    <div class="col-span-2">{footer}</div>
                </div>
            </div>

        </body>
    </html>
)
