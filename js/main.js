/////////////////////animation btn//////////////////////
lottie.loadAnimation({
    container: document.getElementById("startBtnAnim"),
    renderer: "canvas",
    loop: true,
    autoplay: true,
    path: "./assets/lottie/entent-main-button.json",
});

///////////////////////////burger menu//////////////////////
const burger = document.querySelector("[data-burger]");
const mnav = document.querySelector("[data-mnav]");

function toggleMenu() {
    document.body.classList.toggle("menu-open");
    mnav?.classList.toggle("is-open");
    burger?.classList.toggle("is-active");
}

burger?.addEventListener("click", toggleMenu);
mnav?.addEventListener("click", (e) => {
    if (e.target === mnav) closeMenu();
});
mnav?.querySelectorAll("a").forEach((a) => a.addEventListener("click", toggleMenu));

///////////////////////////stats////////////////////////
const stats = document.querySelector(".stats");
const statsRow = document.querySelector(".stats__row");

let startScroll = null;

window.addEventListener("scroll", () => {
    const rect = stats.getBoundingClientRect();
    const windowHeight = window.innerHeight;

    // коли секція входить у viewport — фіксуємо старт
    if (rect.top <= windowHeight && startScroll === null) {
        startScroll = window.scrollY;
    }

    if (startScroll !== null) {
        const distance = window.scrollY - startScroll;

        const move = Math.max(0, Math.min(distance * 0.5, 320));

        statsRow.style.transform = `translateX(-${move}px)`;
    }
});

// slider
const cards = document.querySelectorAll(".card");
const dots = document.querySelectorAll(".dot");

let order = [0, 1, 2];

function update() {
    cards.forEach((c) => {
        c.classList.remove("left", "center", "right");
    });

    cards[order[0]].classList.add("left");
    cards[order[1]].classList.add("center");
    cards[order[2]].classList.add("right");

    dots.forEach((d) => d.classList.remove("active"));
    dots[order[1]].classList.add("active");
}

update();

cards.forEach((card) => {
    card.addEventListener("click", () => {
        if (card.classList.contains("left")) {
            order.unshift(order.pop());
        }

        if (card.classList.contains("right")) {
            order.push(order.shift());
        }

        update();
    });
});

dots.forEach((dot, i) => {
    dot.addEventListener("click", () => {
        while (order[1] !== i) {
            order.push(order.shift());
        }

        update();
    });
});

// payments slider
document.addEventListener("DOMContentLoaded", () => {

    const track = document.querySelector(".pm3-track");
    const cards = document.querySelectorAll(".pm3-card");
    const dots = document.querySelectorAll(".pm3-dot");

    if (!track || !cards.length || !dots.length) return;

    let index = 0;

    function updateSlider() {

        const gap = parseInt(getComputedStyle(track).gap) || 0;
        const cardWidth = cards[0].offsetWidth + gap;

        track.style.transform = `translateX(-${index * cardWidth}px)`;

        cards.forEach(c => c.classList.remove("is-center"));
        cards[index].classList.add("is-center");

        dots.forEach(d => d.classList.remove("active"));
        dots[index].classList.add("active");
    }

    updateSlider();

    dots.forEach((dot, i) => {
        dot.addEventListener("click", () => {
            index = i;
            updateSlider();
        });
    });

});