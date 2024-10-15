import { Html } from "@elysiajs/html";
export const logo = (style: string) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="currentColor"
    viewBox="0 0 16 16"
    class="bi bi-bezier"
    style={style}
  >
    <path
      fill-rule="evenodd"
      d="M0 10.5A1.5 1.5 0 0 1 1.5 9h1A1.5 1.5 0 0 1 4 10.5v1A1.5 1.5 0 0 1 2.5 13h-1A1.5 1.5 0 0 1 0 11.5zm1.5-.5a.5.5 0 0 0-.5.5v1a.5.5 0 0 0 .5.5h1a.5.5 0 0 0 .5-.5v-1a.5.5 0 0 0-.5-.5zm10.5.5A1.5 1.5 0 0 1 13.5 9h1a1.5 1.5 0 0 1 1.5 1.5v1a1.5 1.5 0 0 1-1.5 1.5h-1a1.5 1.5 0 0 1-1.5-1.5zm1.5-.5a.5.5 0 0 0-.5.5v1a.5.5 0 0 0 .5.5h1a.5.5 0 0 0 .5-.5v-1a.5.5 0 0 0-.5-.5zM6 4.5A1.5 1.5 0 0 1 7.5 3h1A1.5 1.5 0 0 1 10 4.5v1A1.5 1.5 0 0 1 8.5 7h-1A1.5 1.5 0 0 1 6 5.5zM7.5 4a.5.5 0 0 0-.5.5v1a.5.5 0 0 0 .5.5h1a.5.5 0 0 0 .5-.5v-1a.5.5 0 0 0-.5-.5z"
    ></path>
    <path d="M6 4.5H1.866a1 1 0 1 0 0 1h2.668A6.517 6.517 0 0 0 1.814 9H2.5c.123 0 .244.015.358.043a5.517 5.517 0 0 1 3.185-3.185A1.503 1.503 0 0 1 6 5.5zm3.957 1.358A1.5 1.5 0 0 0 10 5.5v-1h4.134a1 1 0 1 1 0 1h-2.668a6.517 6.517 0 0 1 2.72 3.5H13.5c-.123 0-.243.015-.358.043a5.517 5.517 0 0 0-3.185-3.185z"></path>
  </svg>
);

export default (
  <nav
    class="p-2 h-20 flex items-center sticky top-0 bg-light dark:bg-dark z-10"
    id="mainNav"
  >
    <span class="rounded-full w-16 h-16 p-4 flex items-center justify-center">
      {logo("height: 3rem; width: 3rem;")}
    </span>
    <a class="text-2xl font-bold ms-2" href="/">
      <h1>&bsol;x41*32</h1>
    </a>
    <button
      class="ms-auto me-3 md:hidden"
      data-action="toggle"
      data-target="#navcol-1"
      data-toggle="opacity-0,opacity-100,invisible"
    >
      <span class="hidden">Toggle navigation</span>
      <i data-feather="menu"></i>
    </button>
    <ul
      class="invisible md:visible flex md:flex flex-grow flex-col md:flex-row space-x-4 space-y-2 items-end justify-end absolute md:static w-full top-16 left-0 pe-4 opacity-0 md:opacity-100   transition-opacity duration-1000 motion-reduce:transition-none text-xl bg-light dark:bg-dark z-10 pb-2 md:pb-0"
      id="navcol-1"
    >
      <li class="">
        <a class="" href="/">
          About Me
        </a>
      </li>
      <li class="">
        <a class="" href="/projects">
          Projects
        </a>
      </li>
      <li class="">
        <a class="" href="/writeups">
          CTF Writeups
        </a>
      </li>
    </ul>
  </nav>
);
