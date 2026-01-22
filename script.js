// --- CONFIGURAÇÃO DO SLIDER INFINITO (LOGO TRACK) ---
const track = document.getElementById('slider-track');
let currentPos = 0;
const speed = 0.4;
let isDraggingTrack = false;
let startXTrack;

if (track) {
  track.querySelectorAll('img').forEach(img => {
    img.addEventListener('dragstart', (e) => e.preventDefault());
    img.style.userSelect = 'none';
  });

  function animate() {
    if (!isDraggingTrack) {
      currentPos -= speed;
      if (Math.abs(currentPos) >= track.scrollWidth / 2) {
        currentPos = 0;
      }
      track.style.transform = `translateX(${currentPos}px)`;
    }
    requestAnimationFrame(animate);
  }

  track.addEventListener('mousedown', (e) => {
    isDraggingTrack = true;
    track.style.cursor = 'grabbing';
    startXTrack = e.pageX - currentPos;
  });

  window.addEventListener('mouseup', () => {
    isDraggingTrack = false;
    if(track) track.style.cursor = 'grab';
  });

  window.addEventListener('mousemove', (e) => {
    if (!isDraggingTrack || !track) return;
    const x = e.pageX;
    currentPos = x - startXTrack;
    const halfWidth = track.scrollWidth / 2;
    if (currentPos > 0) currentPos -= halfWidth;
    else if (Math.abs(currentPos) >= halfWidth) currentPos += halfWidth;
    track.style.transform = `translateX(${currentPos}px)`;
  });

  animate();
}

// --- CONFIGURAÇÃO DO BANNER PRINCIPAL (SLIDES WRAPPER) ---
const wrapper = document.getElementById('slidesWrapper');
const dots = document.querySelectorAll('.dot');
let currentSlide = 0;
let isDraggingBanner = false;
let startXBanner = 0;

function showSlide(index) {
  if (index < 0) index = dots.length - 1;
  if (index >= dots.length) index = 0;
  
  currentSlide = index;
  wrapper.style.transition = "transform 0.7s cubic-bezier(0.4, 0, 0.2, 1)";
  wrapper.style.transform = `translateX(-${index * 25}%)`; 
  
  dots.forEach(dot => dot.classList.remove('active'));
  if(dots[index]) dots[index].classList.add('active');
}

// Lógica de arraste do Banner
if (wrapper) {
  wrapper.querySelectorAll('img').forEach(img => {
    img.addEventListener('dragstart', (e) => e.preventDefault());
  });

  wrapper.addEventListener('mousedown', (e) => {
    isDraggingBanner = true;
    startXBanner = e.pageX;
    wrapper.style.transition = "none"; 
  });

  wrapper.addEventListener('touchstart', (e) => {
    isDraggingBanner = true;
    startXBanner = e.touches[0].clientX;
    wrapper.style.transition = "none";
  });

  const handleEnd = (e) => {
    if (!isDraggingBanner) return;
    isDraggingBanner = false;

    const endX = (e.type === 'mouseup') ? e.pageX : e.changedTouches[0].clientX;
    const diff = endX - startXBanner;

    // Se arrastou mais de 100px, troca o slide
    if (Math.abs(diff) > 100) {
      if (diff > 0) showSlide(currentSlide - 1); // Arrastou para direita -> anterior
      else showSlide(currentSlide + 1); // Arrastou para esquerda -> próximo
    } else {
      showSlide(currentSlide); // Volta para o lugar se o arraste foi curto
    }
  };

  window.addEventListener('mouseup', handleEnd);
  window.addEventListener('touchend', handleEnd);
}

// Auto-play do Banner
setInterval(() => {
  if (!isDraggingBanner) {
    showSlide((currentSlide + 1) % dots.length);
  }
}, 6000);