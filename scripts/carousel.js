export function initCarousel() {
    const slides = document.querySelectorAll('[data-carousel-item]');
    const nextBtn = document.querySelector('[data-carousel-next]');
    const prevBtn = document.querySelector('[data-carousel-prev]');
    const indicators = document.querySelectorAll('[data-carousel-slide-to]');

    let currentIndex = 0;

    function showSlide(index) {
        slides.forEach((slide) => slide.classList.add('hidden'));
        indicators.forEach((ind) => ind.setAttribute('aria-current', 'false'));
        slides[index].classList.remove('hidden');
        indicators[index].setAttribute('aria-current', 'true');
    }

    showSlide(currentIndex)
    nextBtn.addEventListener('click', () =>{
        currentIndex++;
        if (currentIndex >= slides.length) currentIndex = 0;
        showSlide(currentIndex);
    });

    prevBtn.addEventListener('click', () =>{
        currentIndex--;
        if (currentIndex < 0) currentIndex = slides.length - 1;
        showSlide(currentIndex);
    });

    indicators.forEach((ind, i) =>{
        ind.addEventListener('click', () =>{
            currentIndex= i;
            showSlide(currentIndex)
        });
    });

 setInterval(() => {
        currentIndex++;
        if (currentIndex >= slides.length) currentIndex = 0;
        showSlide(currentIndex);
    }, 5000); // <- Correct closing here
}