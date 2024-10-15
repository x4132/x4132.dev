import { $ } from "./main.js"

function scrollLines() {
    let yStep = 50;
    let lines: {line: HTMLElement, xOffset: number}[] = [];
    let startY: number = $("#hook")?.getBoundingClientRect().bottom || 0;
    let endY: number = Math.min(($("#startMainContent")?.getBoundingClientRect().top || 100) - 100 || 0, startY + 5 * yStep);
    console.log(startY, endY);

    for (let cursor = (Math.round(startY / 10) * 10); cursor <= endY; cursor += yStep) {
        let xOffset = (endY - cursor) * 2;
        lines.push({line: createLine(cursor, xOffset), xOffset: xOffset});
        $("#animation-spacer")?.appendChild(lines[lines.length - 1].line);
    }

    window.addEventListener("scroll", () => {
        let lengthPercentage = Math.min(5 * (window.scrollY / window.innerHeight), 1);
        let maxLen = (window.innerWidth / Math.cos(0.261799));
        lines.forEach((line) => {
            line.line.style.width = `${(maxLen * lengthPercentage) + line.xOffset}px`;
        })
    })
}

function createLine(y: number, xOffset: number) {
    let line = document.createElement("div");
    line.classList.add("rotate-[345deg]", "origin-top-right", "border", "border-dark", "dark:border-light", "h-0", "absolute", "-z-10");
    line.style.top = `${y}px`;
    line.style.right = "0px";
    line.style.width = `${xOffset}px`;

    return line;
}

scrollLines();
