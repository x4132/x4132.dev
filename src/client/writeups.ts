import type { Terminal as TermType, ILink } from "@xterm/xterm";
declare const Terminal: any;

var term:TermType = new Terminal();

term.options.linkHandler = {
  activate: (event, uri) => {
    window.open(uri, '_blank');
  }
};

term.open(document.getElementById('terminal') || document.createElement("div"));
term.write("\nYou are visiting \x1B[1;3;31m\\x41*32\'s\x1B[0m CTF writeups.\r\n");
term.write("This section is currently under construction.\r\n");
term.write("Please come back later.\r\n\n");

term.write("Alternatively, you may also wish to learn about CTFs. \x1b[34m\x1b]8;;https://www.hackthebox.com/blog/what-is-ctf\x07What is a CTF?\x1b]8;;\x07\x1b[0m \r\n")
