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

  const hamburger = document.querySelector(".hamburger");
const navegacao = document.querySelector(".navegacao");

hamburger.addEventListener("click", () => {
  hamburger.classList.toggle("active");
  navegacao.classList.toggle("active");
});

// Opcional: Fechar o menu ao clicar em um link
document.querySelectorAll(".navegacao a").forEach(link => {
  link.addEventListener("click", () => {
    hamburger.classList.remove("active");
    navegacao.classList.remove("active");
  });
});