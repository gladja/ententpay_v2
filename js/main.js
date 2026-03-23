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

///////////////////////////slider///////////////////////////
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
 
// drag / swipe
(function () {
    const solTrack = document.querySelector("[data-sol-track]");
    if (!solTrack) return;
 
    let solStartX = 0;
    let solCurrentX = 0;
    let solDragging = false;
 
    function solStartDrag(e) {
        solDragging = true;
        solStartX = e.touches ? e.touches[0].clientX : e.clientX;
        solCurrentX = solStartX;
    }
 
    function solMoveDrag(e) {
        if (!solDragging) return;
        solCurrentX = e.touches ? e.touches[0].clientX : e.clientX;
    }
 
    function solEndDrag() {
        if (!solDragging) return;
        solDragging = false;
 
        const diff = solCurrentX - solStartX;
        const threshold = 50;
 
        if (diff < -threshold) {
            // свайп вліво — наступна картка
            order.push(order.shift());
            update();
        } else if (diff > threshold) {
            // свайп вправо — попередня картка
            order.unshift(order.pop());
            update();
        }
    }
 
    // mouse
    solTrack.addEventListener("mousedown", solStartDrag);
    window.addEventListener("mousemove", solMoveDrag);
    window.addEventListener("mouseup", solEndDrag);
 
    // touch
    solTrack.addEventListener("touchstart", solStartDrag, { passive: true });
    solTrack.addEventListener("touchmove", solMoveDrag, { passive: true });
    solTrack.addEventListener("touchend", solEndDrag);
})();

///////////////////////////payments slider///////////////////////////
document.addEventListener("DOMContentLoaded", () => {

    const track = document.querySelector(".pm3-track");
    const cards = document.querySelectorAll(".pm3-card");
    const dots = document.querySelectorAll(".pm3-dot");

    if (!track || !cards.length || !dots.length) return;

    let index = 0;

    let startX = 0;
    let currentX = 0;
    let isDragging = false;

    function getCardWidth() {
        const gap = parseInt(getComputedStyle(track).gap) || 0;
        return cards[0].offsetWidth + gap;
    }

    function updateSlider(animate = true) {
        const cardWidth = getCardWidth();

        track.style.transition = animate ? "transform 0.4s ease" : "none";
        track.style.transform = `translateX(-${index * cardWidth}px)`;

        cards.forEach(c => c.classList.remove("is-center"));
        cards[index].classList.add("is-center");

        dots.forEach(d => d.classList.remove("active"));
        dots[index].classList.add("active");
    }

    updateSlider();

    // 🔥 DOTS
    dots.forEach((dot, i) => {
        dot.addEventListener("click", () => {
            index = i;
            updateSlider();
        });
    });

    // -------------------
    // 🖱️ DRAG / SWIPE
    // -------------------
    function startDrag(e) {
        isDragging = true;
        startX = e.touches ? e.touches[0].clientX : e.clientX;
        track.style.transition = "none";
    }

    function moveDrag(e) {
        if (!isDragging) return;

        currentX = e.touches ? e.touches[0].clientX : e.clientX;
        const diff = currentX - startX;

        const cardWidth = getCardWidth();
        const baseTranslate = -index * cardWidth;

        track.style.transform = `translateX(${baseTranslate + diff}px)`;
    }

    function endDrag() {
        if (!isDragging) return;

        isDragging = false;

        const diff = currentX - startX;
        const threshold = 50; // мінімальний свайп

        if (diff < -threshold && index < cards.length - 1) {
            index++;
        } else if (diff > threshold && index > 0) {
            index--;
        }

        updateSlider();
    }

    // 🖱️ mouse
    track.addEventListener("mousedown", startDrag);
    window.addEventListener("mousemove", moveDrag);
    window.addEventListener("mouseup", endDrag);

    // 📱 touch
    track.addEventListener("touchstart", startDrag);
    track.addEventListener("touchmove", moveDrag);
    track.addEventListener("touchend", endDrag);

});