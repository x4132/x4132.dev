import use_theme from "./use_theme.js";

export const $$ = document.querySelectorAll.bind(document);
export const $ = document.querySelector.bind(document);

function renderTogglers() {
    $$("[data-action=toggle]").forEach((toggler) => {
        const toggleeSelector = toggler.getAttribute("data-target");
        const togglee = $(toggleeSelector + "");
        if (togglee !== null) {
            toggler.addEventListener("click", () => {
                const toggleList = (toggler.getAttribute("data-toggle") + "").split(
                    ",",
                );
                toggleList.forEach((className) => {
                    togglee.classList.toggle(className);
                });
            });
        }
    });
}


window.addEventListener("DOMContentLoaded", function() {
    renderTogglers();
    use_theme();
});
