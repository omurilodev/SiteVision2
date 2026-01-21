const track = document.getElementById('slider-track');
let currentPos = 0;
const speed = 0.4;
let isDragging = false;
let startX;

// 1. Bloqueia o arraste nativo de imagem, mas mantém o clique ativo
track.querySelectorAll('img').forEach(img => {
  img.addEventListener('dragstart', (e) => e.preventDefault());
  // Garante que o usuário não selecione a imagem acidentalmente
  img.style.userSelect = 'none';
  img.style.webkitUserDrag = 'none';
});

function animate() {
  if (!isDragging) {
    currentPos -= speed;
    if (Math.abs(currentPos) >= track.scrollWidth / 2) {
      currentPos = 0;
    }
    track.style.transform = `translateX(${currentPos}px)`;
  }
  requestAnimationFrame(animate);
}

// 2. Evento de clique (funciona nas imagens agora)
track.addEventListener('mousedown', (e) => {
  isDragging = true;
  track.style.cursor = 'grabbing';
  // Usamos e.clientX ou e.pageX para pegar a posição do mouse no clique
  startX = e.pageX - currentPos;
});

window.addEventListener('mouseup', () => {
  isDragging = false;
  track.style.cursor = 'grab';
});

window.addEventListener('mousemove', (e) => {
  if (!isDragging) return;
  e.preventDefault();
  
  const x = e.pageX;
  currentPos = x - startX;

  // Lógica de loop para manter a esteira infinita durante o arraste
  const halfWidth = track.scrollWidth / 2;
  if (currentPos > 0) {
    currentPos -= halfWidth;
    startX = x - currentPos;
  } else if (Math.abs(currentPos) >= halfWidth) {
    currentPos += halfWidth;
    startX = x - currentPos;
  }

  track.style.transform = `translateX(${currentPos}px)`;
});

animate();