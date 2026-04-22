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
const modal = document.querySelector("#contact-modal");
const form = document.querySelector(".contact-form");

// MENU
function openMenu() {
    document.body.classList.add("menu-open");
    mnav?.classList.add("is-open");
    burger?.classList.add("is-active");
}

function closeMenu() {
    document.body.classList.remove("menu-open");
    mnav?.classList.remove("is-open");
    // ❗️бургер не чіпаємо тут (важливо)
}

function toggleMenu() {
    if (document.body.classList.contains("menu-open")) {
        closeMenu();
        burger?.classList.remove("is-active");
    } else {
        openMenu();
    }
}

// MODAL
function getScrollbarWidth() {
    return window.innerWidth - document.documentElement.clientWidth;
}

function openModal() {
    const scrollBarWidth = getScrollbarWidth();

    modal?.classList.add("is-open");
    document.body.classList.add("modal-open", "no-scroll");

    document.body.style.paddingRight = scrollBarWidth + "px";
    // ❗️бургер стає хрестиком
    burger?.classList.add("is-active");
}

function closeModal() {
    modal?.classList.remove("is-open");
    document.body.classList.remove("modal-open", "no-scroll");

    document.body.style.paddingRight = "";
    // ❗️бургер назад у полоски
    burger?.classList.remove("is-active");
}


// BURGER CLICK
burger?.addEventListener("click", () => {
    // якщо відкрита модалка → закриваємо її
    if (document.body.classList.contains("modal-open")) {
        closeModal();
        return;
    }
    // інакше працюємо як меню
    toggleMenu();
});


// CONTACT BUTTONS
document.querySelectorAll('a[href="#contacts-modal"]').forEach((btn) => {
    btn.addEventListener("click", (e) => {
        e.preventDefault();

        if (document.body.classList.contains("menu-open")) {
            closeMenu();
            // ⏱ чекаємо поки меню закриється
            setTimeout(() => {
                openModal();
            }, 100); // під transition
        } else {
            openModal();
        }
    });
});

// CLOSE MODAL (overlay + ✕)
modal?.addEventListener("click", (e) => {
    if (e.target.closest("[data-close]") || e.target === modal) {
        closeModal();
    }
});

// CLICK ON MENU LINKS
mnav?.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
        closeMenu();
    });
});

form?.addEventListener("submit", (e) => {
    e.preventDefault(); // ❗️ головне — прибирає скрол і перезавантаження

    // тут можеш додати fetch / відправку

    // очистка форми (опціонально)
    form.reset();

    // закриваємо модалку
    closeModal();
});

///////////////////////////stats////////////////////////
// const stats = document.querySelector(".stats");
// const statsRow = document.querySelector(".stats__row");

// let startScroll = null;

// window.addEventListener("scroll", () => {
//     const rect = stats.getBoundingClientRect();
//     const windowHeight = window.innerHeight;

//     // коли секція входить у viewport — фіксуємо старт
//     if (rect.top <= windowHeight && startScroll === null) {
//         startScroll = window.scrollY;
//     }

//     if (startScroll !== null) {
//         const distance = window.scrollY - startScroll;

//         const move = Math.max(0, Math.min(distance * 0.5, 320));

//         statsRow.style.transform = `translateX(-${move}px)`;
//     }
// });

///////////////////////////slider///////////////////////////
const cards = document.querySelectorAll(".card");
const dots = document.querySelectorAll(".solutions__dot");

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
    const track = document.querySelector(".payment__track");
    const dots = document.querySelectorAll(".payment__dot");

    if (!track || !dots.length) return;

    let currentCardIndex = 0;
    let startX = 0;
    let currentX = 0;
    let isDragging = false;
    let isAnimating = false;
    let hasDragged = false;
    let ignoreClick = false;

    function getCards() {
        return Array.from(track.querySelectorAll(".payment-card"));
    }

    function getTotalCards() {
        return getCards().length;
    }

    function normalizeIndex(index) {
        const totalCards = getTotalCards();
        if (!totalCards) return 0;
        return (index + totalCards) % totalCards;
    }

    function getCardWidth() {
        const cards = getCards();
        if (!cards.length) return 0;
        const gap = parseInt(getComputedStyle(track).gap) || 0;
        return cards[0].offsetWidth + gap;
    }

    function updatePaymentState() {
        const cards = getCards();

        cards.forEach(c => c.classList.remove("is-center"));
        if (cards[0]) cards[0].classList.add("is-center");

        dots.forEach((d, i) => {
            d.classList.toggle("active", i === currentCardIndex);
        });
    }

    function moveCards(steps, duration = 400) {
        if (isAnimating || steps === 0) return;

        const totalCards = getTotalCards();
        if (!totalCards) return;

        const cardWidth = getCardWidth();
        const isForward = steps > 0;
        const absSteps = Math.abs(steps);

        isAnimating = true;
        track.style.transition = `transform ${duration}ms cubic-bezier(0.4, 0, 0.2, 1)`;
        track.style.transform = isForward ? `translateX(-${cardWidth * absSteps}px)` : `translateX(${cardWidth * absSteps}px)`;

        const handleTransitionEnd = (event) => {
            if (event.propertyName !== 'transform') return;

            track.removeEventListener("transitionend", handleTransitionEnd);

            for (let i = 0; i < absSteps; i++) {
                const cards = getCards();

                if (isForward) {
                    track.appendChild(cards[0]);
                } else {
                    track.insertBefore(cards[cards.length - 1], cards[0]);
                }
            }

            currentCardIndex = normalizeIndex(currentCardIndex + steps);

            track.style.transition = "none";
            track.style.transform = `translateX(0px)`;
            updatePaymentState();

            isAnimating = false;
        };

        track.addEventListener("transitionend", handleTransitionEnd);
    }

    function goToCard(cardIndex) {
        const totalCards = getTotalCards();
        if (!totalCards || isAnimating) return;

        const targetIndex = normalizeIndex(cardIndex);
        if (currentCardIndex === targetIndex) return;

        const stepsForward = normalizeIndex(targetIndex - currentCardIndex);
        const stepsBackward = normalizeIndex(currentCardIndex - targetIndex);
        const steps = stepsForward <= stepsBackward ? stepsForward : -stepsBackward;

        moveCards(steps);
    }

    // Інічіалізація
    const initialCards = getCards();
    initialCards.forEach((card, index) => {
        card.dataset.paymentIndex = index;
    });
    updatePaymentState();

    // 🔥 DOTS - КЛІК ДЛЯ НАВІГАЦІЇ
    dots.forEach((dot, dotIndex) => {
        dot.addEventListener("click", () => {
            goToCard(dotIndex);
        });
    });

    track.addEventListener("click", (e) => {
        const card = e.target.closest(".payment-card");
        if (!card || !track.contains(card)) return;

        if (ignoreClick || hasDragged) {
            ignoreClick = false;
            return;
        }

        goToCard(Number(card.dataset.paymentIndex));
    });
    
    // 🖱️ DRAG / SWIPE
    function startDrag(e) {
        if (isAnimating) return;

        isDragging = true;
        startX = e.touches ? e.touches[0].clientX : e.clientX;
        currentX = startX;
        hasDragged = false;
        ignoreClick = false;
        track.style.transition = "none";
    }

    function moveDrag(e) {
        if (!isDragging) return;

        currentX = e.touches ? e.touches[0].clientX : e.clientX;
        const diff = currentX - startX;

        if (Math.abs(diff) > 5) {
            hasDragged = true;
            ignoreClick = true;
        }

        track.style.transform = `translateX(${diff}px)`;
    }

    function endDrag() {
        if (!isDragging) return;

        isDragging = false;

        const diff = currentX - startX;
        const threshold = 50;

        if (diff < -threshold) {
            // Свайп вліво
            moveCards(1, 600);
        } else if (diff > threshold) {
            // Свайп вправо
            moveCards(-1, 600);
        } else {
            // Свайп занадто короткий
            track.style.transition = "transform 0.3s ease";
            track.style.transform = `translateX(0px)`;
            hasDragged = false;
        }
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

///////////////////////////canvas animation business///////////////////////////
(function () {
    const canvas = document.querySelector(".business__canvas");
    const bg = document.querySelector(".business__bg");
    const items = document.querySelectorAll(".business__item");
    if (!canvas || !bg || !items.length) return;

    const ctx = canvas.getContext("2d");
    let startTime = null;

    function resize() {
        canvas.width = bg.offsetWidth;
        canvas.height = bg.offsetHeight;
    }

    resize();
    window.addEventListener("resize", resize);

    function tick(ts) {
        if (!startTime) startTime = ts;
        const t = (ts - startTime) / 9000;
        const angle = t * Math.PI * 2;

        // Вісімка
        const dy = Math.sin(angle) * 0.4;
        const dx = Math.sin(angle * 2) * 0.15;

        const W = canvas.width;
        const H = canvas.height;

        // Центр градієнта рухається по вісімці
        const cx = W / 2 + dx * W;
        const cy = H / 2 + dy * H;

        ctx.clearRect(0, 0, W, H);

        items.forEach((item) => {
            const bgRect = bg.getBoundingClientRect();
            const itemRect = item.getBoundingClientRect();

            // Позиція картки відносно canvas
            const x = itemRect.left - bgRect.left;
            const y = itemRect.top - bgRect.top;
            const w = itemRect.width;
            const h = itemRect.height;

            // border-radius залежно від розміру екрану
            const r = window.innerWidth <= 768 ? 16 : 24;

            // Обрізаємо по формі картки
            ctx.save();
            ctx.beginPath();
            ctx.roundRect(x, y, w, h, r);
            ctx.clip();

            // Єдиний градієнт відносно всього canvas
            const grad = ctx.createLinearGradient(cx - W * 0.6, cy - H * 0.6, cx + W * 0.6, cy + H * 0.6);
            // grad.addColorStop(0, '#FC6701');
            // grad.addColorStop(1, '#9B6FE8');
            grad.addColorStop(0, "#fc650188"); // оранжевий
            // grad.addColorStop(0.35, "#DE65F8"); // рожевий
            grad.addColorStop(0.65, "#5f53bd7c"); // фіолетовий
            grad.addColorStop(1, "#13044C"); // темно-синій

            ctx.fillStyle = grad;
            ctx.fillRect(x, y, w, h);

            ctx.restore();
        });

        requestAnimationFrame(tick);
    }

    requestAnimationFrame(tick);
})();

///////////////////////////faq///////////////////////////
document.querySelectorAll(".faq__question").forEach((btn) => {
    btn.addEventListener("click", () => {
        const item = btn.closest(".faq__item");
        const isOpen = item.classList.contains("active");

        // закриваємо всі
        document.querySelectorAll(".faq__item").forEach((el) => {
            el.classList.remove("active");
            el.querySelector(".faq__question").setAttribute("aria-expanded", "false");
        });

        // відкриваємо якщо був закритий
        if (!isOpen) {
            item.classList.add("active");
            btn.setAttribute("aria-expanded", "true");
        }
    });
});


///////////////////////////scroll to top button///////////////////////////
const btn = document.getElementById('scrollTopBtn');
let lastScroll = 0;

window.addEventListener('scroll', () => {
  const currentScroll = window.pageYOffset;

  // не показываем в самом верху
  if (currentScroll < 200) {
    btn.classList.remove('show');
    return;
  }

  if (currentScroll < lastScroll) {
    // скролл вверх
    btn.classList.add('show');
  } else {
    // скролл вниз
    btn.classList.remove('show');
  }

  lastScroll = currentScroll;
});

// клик — вверх
btn.addEventListener('click', () => {
  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  });
});
