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


/** FORMULÁRIO */
const formulario = document.getElementById('form-contato');
const botao = document.getElementById('enviar');

// Captura os elementos do nosso Popup (Toast)
const toast = document.getElementById('toast-sucesso');
const btnFecharToast = document.getElementById('fechar-toast');

// Funções para controlar a exibição do popup
function mostrarToast() {
  toast.classList.add('toast-show');
  // Esconde automaticamente após 5 segundos
  setTimeout(() => { esconderToast(); }, 5000);
}

function esconderToast() {
  toast.classList.remove('toast-show');
}

// Evento para fechar no botão "X"
if (btnFecharToast) {
  btnFecharToast.addEventListener('click', esconderToast);
}

formulario.addEventListener('submit', async (e) => {
  e.preventDefault(); // Impede o recarregamento da página

  // Muda o texto do botão para dar feedback ao usuário
  botao.innerText = "ENVIANDO...";
  botao.disabled = true;

  // Captura os dados de forma automática
  const formData = new FormData(formulario);
  const dados = Object.fromEntries(formData);

  // URL do Webhook do n8n (Lembre-se de mudar para a URL de Produção depois)
  const WEBHOOK_URL = 'https://neown8n.neowchat.com.br/webhook-test/contato-vision';

  try {
    const response = await fetch(WEBHOOK_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(dados)
    });

    if (response.ok) {
      // Dispara o popup premium no lugar do alert()
      mostrarToast(); 
      formulario.reset(); // Limpa o formulário
    } else {
      alert('Ops! Houve um erro no servidor.');
    }
  } catch (error) {
    console.error('Erro ao conectar com n8n:', error);
    alert('Erro de conexão. Verifique sua internet.');
  } finally {
    // Restaura o botão
    botao.innerText = "LET'S GO!";
    botao.disabled = false;
  }
});