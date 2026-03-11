/** =========================================
 * MENU HAMBÚRGUER (Global)
 * ========================================= */
const hamburger = document.querySelector(".hamburger");
const navegacao = document.querySelector(".navegacao");

if (hamburger && navegacao) {
  hamburger.addEventListener("click", () => {
    hamburger.classList.toggle("active");
    navegacao.classList.toggle("active");
  });

  // Fechar o menu ao clicar em um link
  document.querySelectorAll(".navegacao a").forEach(link => {
    link.addEventListener("click", () => {
      hamburger.classList.remove("active");
      navegacao.classList.remove("active");
    });
  });
}

/** =========================================
 * FORMULÁRIO 1: CONTATO
 * ========================================= */
const formContato = document.getElementById('form-contato');

if (formContato) {
  // Pega o botão submit DENTRO deste formulário específico (evita conflito de IDs)
  const btnEnviarContato = formContato.querySelector('button[type="submit"]'); 
  const toastContato = document.getElementById('toast-sucesso'); 
  const btnFecharToast = document.getElementById('fechar-toast');
  let timerContato;

  function mostrarToastCurriculo() {
  // Puxa o elemento na hora H para garantir que ele existe
  const popup = document.getElementById('toast-curriculo'); // ou 'toast-sucesso', dependendo do ID que está no seu HTML
  
  if (popup) {
    // 1. Força o popup a entrar na tela
    popup.style.transition = 'transform 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
    popup.style.transform = 'translateX(0)';
    console.log("Popup forçado a entrar!");

    // 2. Força o popup a sair após 5 segundos
    setTimeout(() => { 
      popup.style.transform = 'translateX(150%)'; 
      console.log("Popup forçado a sair!");
    }, 5000);
  } else {
    console.error("ERRO: O HTML do popup não foi encontrado. Verifique o ID.");
  }
}

  formContato.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const textoOriginal = btnEnviarContato.innerText;
    btnEnviarContato.innerText = "ENVIANDO...";
    btnEnviarContato.disabled = true;

    const formData = new FormData(formContato);
    const dados = Object.fromEntries(formData);
    const WEBHOOK_URL = 'https://neown8n.neowchat.com.br/webhook-test/contato-vision'; // URL Antiga

    try {
      const response = await fetch(WEBHOOK_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dados)
      });

      if (response.ok) {
        mostrarToastContato(); 
        formContato.reset();
      } else {
        alert('Ops! Houve um erro no servidor.');
      }
    } catch (error) {
      console.error('Erro:', error);
      alert('Erro de conexão. Verifique sua internet.');
    } finally {
      btnEnviarContato.innerText = textoOriginal;
      btnEnviarContato.disabled = false;
    }
  });
}

/** =========================================
 * FORMULÁRIO 2: TRABALHE CONOSCO (CURRÍCULOS)
 * ========================================= */
const formTrabalheConosco = document.getElementById('form-trabalhe-conosco');

if (formTrabalheConosco) {
  // Pega o botão submit específico deste form
  const btnEnviarCurriculo = formTrabalheConosco.querySelector('button[type="submit"]');
  // ATENÇÃO: Use um ID diferente no seu HTML para o Toast do currículo!
  const toastCurriculo = document.getElementById('toast-curriculo'); 
  let timerCurriculo;

 function mostrarToastCurriculo() {
  // Puxa o elemento na hora H para garantir que ele existe
  const popup = document.getElementById('toast-curriculo'); // ou 'toast-sucesso', dependendo do ID que está no seu HTML
  
  if (popup) {
    // 1. Força o popup a entrar na tela
    popup.style.transition = 'transform 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
    popup.style.transform = 'translateX(0)';
    console.log("Popup forçado a entrar!");

    // 2. Força o popup a sair após 5 segundos
    setTimeout(() => { 
      popup.style.transform = 'translateX(150%)'; 
      console.log("Popup forçado a sair!");
    }, 5000);
  } else {
    console.error("ERRO: O HTML do popup não foi encontrado. Verifique o ID.");
  }
}

  formTrabalheConosco.addEventListener('submit', async (e) => {
    e.preventDefault();

    const textoOriginal = btnEnviarCurriculo.innerText;
    btnEnviarCurriculo.innerText = "ENVIANDO ARQUIVO...";
    btnEnviarCurriculo.disabled = true;

    const formData = new FormData(formTrabalheConosco);
    const WEBHOOK_URL = 'https://neown8n.neowchat.com.br/webhook-test/recebe-curriculo';

    try {
      const response = await fetch(WEBHOOK_URL, {
        method: 'POST',
        body: formData // Sem headers, multipart natural
      });

      if (response.ok) {
        mostrarToastCurriculo(); 
        formTrabalheConosco.reset();
      } else {
        alert('Ops! Houve um erro no servidor.');
      }
    } catch (error) {
      console.error('Erro:', error);
      alert('Erro de conexão. Verifique sua internet.');
    } finally {
      btnEnviarCurriculo.innerText = textoOriginal;
      btnEnviarCurriculo.disabled = false;
    }
  });
}