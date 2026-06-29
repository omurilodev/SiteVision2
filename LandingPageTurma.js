/** =========================================
 * MENU HAMBÚRGUER
 * ========================================= */
const hamburger = document.querySelector(".hamburger");
const navegacao = document.querySelector(".navegacao");

if (hamburger && navegacao) {
  hamburger.addEventListener("click", () => {
    hamburger.classList.toggle("active");
    navegacao.classList.toggle("active");
  });

  document.querySelectorAll(".navegacao a").forEach(link => {
    link.addEventListener("click", () => {
      hamburger.classList.remove("active");
      navegacao.classList.remove("active");
    });
  });
}

/** =========================================
 * FORMULÁRIO
 * ========================================= */
const formulario = document.getElementById('form-contato');
const botao = document.getElementById('enviar');
const toast = document.getElementById('toast-sucesso');
const btnFecharToast = document.getElementById('fechar-toast');

function mostrarToast() {
  toast.classList.add('toast-show');
  setTimeout(() => { esconderToast(); }, 5000);
}

function esconderToast() {
  toast.classList.remove('toast-show');
}

if (btnFecharToast) {
  btnFecharToast.addEventListener('click', esconderToast);
}

if (formulario) {
  formulario.addEventListener('submit', async (e) => {
    e.preventDefault();

    botao.innerText = "ENVIANDO...";
    botao.disabled = true;

    const formData = new FormData(formulario);
    const dados = Object.fromEntries(formData);

    const WEBHOOK_URL = 'https://gustavomilli.app.n8n.cloud/webhook/contato-vision';

    try {
      const response = await fetch(WEBHOOK_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(dados)
      });

      if (response.ok) {
        mostrarToast();
        formulario.reset();
      } else {
        alert('Ops! Houve um erro no servidor.');
      }
    } catch (error) {
      console.error('Erro ao conectar com n8n:', error);
      alert('Erro de conexão. Verifique sua internet.');
    } finally {
      botao.innerText = "LET'S GO!";
      botao.disabled = false;
    }
  });
}

/** =========================================
 * ANIMAÇÃO DE ENTRADA DO CHECKLIST
 * ========================================= */
const checklistItens = document.querySelectorAll('.checklistExecutive li');

if (checklistItens.length) {
  const checklistObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
        checklistObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });

  checklistItens.forEach(item => checklistObserver.observe(item));
}

/** =========================================
 * ANIMAÇÕES DE ENTRADA (FADE-IN SUTIL AO ROLAR)
 * ========================================= */
const revealEls = document.querySelectorAll('.reveal');

if (revealEls.length) {
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });

  revealEls.forEach(el => revealObserver.observe(el));
}
