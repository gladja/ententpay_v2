


/////////////////////animation btn//////////////////////

lottie.loadAnimation({
    container: document.getElementById('startBtnAnim'),
    renderer: 'canvas',
    loop: true,
    autoplay: true,
    path: './assets/lottie/entent-main-button.json'
});


///////////////////////////header//////////////////////

const burger = document.querySelector('[data-burger]');
const mnav = document.querySelector('[data-mnav]');
const closeBtn = document.querySelector('[data-close]');

function openMenu(){ mnav?.classList.add('is-open'); }
function closeMenu(){ mnav?.classList.remove('is-open'); }

burger?.addEventListener('click', openMenu);
closeBtn?.addEventListener('click', closeMenu);
mnav?.addEventListener('click', (e)=>{ if(e.target === mnav) closeMenu(); });
mnav?.querySelectorAll('a').forEach(a => a.addEventListener('click', closeMenu));


// slider
const track = document.querySelector('[data-sol-track]')
const prev = document.querySelector('[data-sol-prev]')
const next = document.querySelector('[data-sol-next]')
const dots = document.querySelectorAll('.dot')

let activeIndex = 1

function updateCards(){

const cards = track.querySelectorAll('.card')

cards.forEach(card=>card.classList.remove('active'))

cards[1].classList.add('active')

dots.forEach(dot=>dot.classList.remove('active'))

dots[activeIndex].classList.add('active')

}

updateCards()

next.addEventListener('click',()=>{

track.appendChild(track.firstElementChild)

activeIndex++

if(activeIndex > dots.length - 1){
activeIndex = 0
}

updateCards()

})

prev.addEventListener('click',()=>{

track.prepend(track.lastElementChild)

activeIndex--

if(activeIndex < 0){
activeIndex = dots.length - 1
}

updateCards()

})

dots.forEach((dot,i)=>{

dot.addEventListener('click',()=>{

while(activeIndex !== i){

if(activeIndex < i){

track.appendChild(track.firstElementChild)
activeIndex++

}else{

track.prepend(track.lastElementChild)
activeIndex--

}

if(activeIndex > dots.length - 1) activeIndex = 0
if(activeIndex < 0) activeIndex = dots.length - 1

}

updateCards()

})

})