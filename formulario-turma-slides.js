/** =========================================
 * FORMULÁRIO "UMA PERGUNTA POR VEZ"
 * ========================================= */
const form = document.getElementById('form-turma-slides');
const todosOsSlides = Array.from(form.querySelectorAll('.slide'));
const slidesPerguntas = todosOsSlides.filter(slide => slide.dataset.slide !== 'final');
const slideFinal = todosOsSlides.find(slide => slide.dataset.slide === 'final');

const barraProgresso = document.getElementById('progresso-barra');
const btnVoltar = document.getElementById('btn-voltar');
const btnAvancar = document.getElementById('btn-avancar');
const btnEnviar = document.getElementById('btn-enviar');
const slideNav = document.querySelector('.slideNav');

const toastErro = document.getElementById('toast-erro');
const toastErroTexto = document.getElementById('toast-erro-texto');
const btnFecharToastErro = document.getElementById('fechar-toast-erro');

let indiceAtual = 0;

function getCampo(slide) {
  return slide.querySelector('input, textarea');
}

function getFocoCampo(slide) {
  return slide.querySelector('.selectTrigger, input:not([type="hidden"]), textarea');
}

function atualizarUI() {
  slidesPerguntas.forEach((slide, i) => {
    slide.classList.toggle('is-active', i === indiceAtual);
  });

  const progresso = ((indiceAtual + 1) / slidesPerguntas.length) * 100;
  barraProgresso.style.width = progresso + '%';

  btnVoltar.classList.toggle('is-visible', indiceAtual > 0);

  const ultimaPergunta = indiceAtual === slidesPerguntas.length - 1;
  btnAvancar.style.display = ultimaPergunta ? 'none' : 'inline-block';
  btnEnviar.style.display = ultimaPergunta ? 'inline-block' : 'none';

  const campo = getFocoCampo(slidesPerguntas[indiceAtual]);
  if (campo) campo.focus();
}

function validarSlideAtual() {
  const slide = slidesPerguntas[indiceAtual];
  const campo = getCampo(slide);
  const valido = campo.value.trim() !== '';

  slide.classList.toggle('is-invalid', !valido);
  return valido;
}

function irParaProxima() {
  if (!validarSlideAtual()) return;
  if (indiceAtual < slidesPerguntas.length - 1) {
    indiceAtual++;
    atualizarUI();
  }
}

function irParaAnterior() {
  if (indiceAtual > 0) {
    indiceAtual--;
    atualizarUI();
  }
}

btnAvancar.addEventListener('click', irParaProxima);
btnVoltar.addEventListener('click', irParaAnterior);

/** =========================================
 * CAMPO DE IDADE (SOMENTE NÚMEROS)
 * ========================================= */
const campoIdade = document.getElementById('idade');

if (campoIdade) {
  campoIdade.addEventListener('input', () => {
    campoIdade.value = campoIdade.value.replace(/\D/g, '');
  });
}

/** =========================================
 * MÁSCARA DO TELEFONE (WHATSAPP)
 * ========================================= */
function formatarTelefone(valor) {
  const digitos = valor.replace(/\D/g, '').slice(0, 11);
  let formatado = '';

  if (digitos.length > 0) formatado += '(' + digitos.slice(0, 2);
  if (digitos.length >= 2) formatado += ') ';
  if (digitos.length > 2) formatado += digitos.slice(2, 7);
  if (digitos.length > 7) formatado += '-' + digitos.slice(7, 11);

  return formatado;
}

const campoWhatsApp = document.getElementById('WhatsApp');

if (campoWhatsApp) {
  campoWhatsApp.addEventListener('input', () => {
    campoWhatsApp.value = formatarTelefone(campoWhatsApp.value);
  });
}

slidesPerguntas.forEach(slide => {
  const campo = getCampo(slide);
  if (!campo) return;

  campo.addEventListener('input', () => slide.classList.remove('is-invalid'));

  campo.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && campo.tagName !== 'TEXTAREA') {
      e.preventDefault();
      if (indiceAtual === slidesPerguntas.length - 1) {
        form.requestSubmit();
      } else {
        irParaProxima();
      }
    }
  });
});

/** =========================================
 * SELECT CUSTOMIZADO
 * ========================================= */
function fecharTodosOsSelects() {
  document.querySelectorAll('.selectOpcoes.is-open').forEach(lista => {
    lista.classList.remove('is-open');
  });
  document.querySelectorAll('.selectTrigger.is-open').forEach(trigger => {
    trigger.classList.remove('is-open');
    trigger.setAttribute('aria-expanded', 'false');
  });
}

document.querySelectorAll('.campoSelect').forEach(campoSelect => {
  const trigger = campoSelect.querySelector('.selectTrigger');
  const valorTexto = campoSelect.querySelector('.selectValorTexto');
  const lista = campoSelect.querySelector('.selectOpcoes');
  const opcoes = Array.from(lista.querySelectorAll('li'));
  const hiddenInput = campoSelect.querySelector('input[type="hidden"]');
  const slide = campoSelect.closest('.slide');
  const ehDDI = campoSelect.classList.contains('campoSelect--ddi');
  let indiceAtivo = -1;

  function listaEstaAberta() {
    return lista.classList.contains('is-open');
  }

  function atualizarOpcaoAtiva() {
    opcoes.forEach((op, i) => op.classList.toggle('is-active', i === indiceAtivo));
    if (indiceAtivo >= 0) {
      opcoes[indiceAtivo].scrollIntoView({ block: 'nearest' });
    }
  }

  function posicionarLista() {
    const rect = trigger.getBoundingClientRect();
    const largura = ehDDI ? 250 : rect.width;
    let left = rect.left;
    if (left + largura > window.innerWidth - 16) {
      left = Math.max(16, window.innerWidth - largura - 16);
    }
    lista.style.top = (rect.bottom + 8) + 'px';
    lista.style.left = left + 'px';
    lista.style.width = largura + 'px';
  }

  function abrirLista() {
    fecharTodosOsSelects();
    if (lista.parentElement !== document.body) {
      document.body.appendChild(lista);
    }
    posicionarLista();
    lista.classList.add('is-open');
    trigger.classList.add('is-open');
    trigger.setAttribute('aria-expanded', 'true');
    indiceAtivo = opcoes.findIndex(op => op.classList.contains('is-selected'));
    atualizarOpcaoAtiva();
  }

  function fecharLista() {
    lista.classList.remove('is-open');
    trigger.classList.remove('is-open');
    trigger.setAttribute('aria-expanded', 'false');
    indiceAtivo = -1;
    opcoes.forEach(op => op.classList.remove('is-active'));
  }

  function selecionarOpcao(opcao) {
    opcoes.forEach(op => op.classList.remove('is-selected'));
    opcao.classList.add('is-selected');
    hiddenInput.value = opcao.dataset.value;
    campoSelect.classList.add('tem-valor');

    if (ehDDI) {
      const bandeiraTrigger = trigger.querySelector('.bandeira');
      if (bandeiraTrigger) bandeiraTrigger.src = `https://flagcdn.com/24x18/${opcao.dataset.iso}.png`;
      valorTexto.textContent = '+' + opcao.dataset.value;
    } else {
      valorTexto.textContent = opcao.dataset.textoCurto || opcao.textContent;
    }

    fecharLista();
    slide.classList.remove('is-invalid');

    if (ehDDI) {
      const campoNumero = slide.querySelector('input[type="tel"]');
      if (campoNumero) campoNumero.focus();
      return;
    }

    setTimeout(() => {
      if (slidesPerguntas[indiceAtual] === slide) irParaProxima();
    }, 280);
  }

  trigger.addEventListener('click', () => {
    listaEstaAberta() ? fecharLista() : abrirLista();
  });

  trigger.addEventListener('keydown', (e) => {
    const teclas = ['ArrowDown', 'ArrowUp', 'Enter', ' ', 'Escape'];
    if (!teclas.includes(e.key)) return;

    if (!listaEstaAberta()) {
      if (e.key !== 'Escape') {
        e.preventDefault();
        abrirLista();
      }
      return;
    }

    e.preventDefault();
    if (e.key === 'ArrowDown') {
      indiceAtivo = Math.min(indiceAtivo + 1, opcoes.length - 1);
      atualizarOpcaoAtiva();
    } else if (e.key === 'ArrowUp') {
      indiceAtivo = Math.max(indiceAtivo - 1, 0);
      atualizarOpcaoAtiva();
    } else if (e.key === 'Enter' || e.key === ' ') {
      if (indiceAtivo >= 0) selecionarOpcao(opcoes[indiceAtivo]);
    } else if (e.key === 'Escape') {
      fecharLista();
    }
  });

  opcoes.forEach(opcao => {
    opcao.addEventListener('click', () => selecionarOpcao(opcao));
  });
});

document.addEventListener('click', (e) => {
  if (!e.target.closest('.campoSelect') && !e.target.closest('.selectOpcoes')) {
    fecharTodosOsSelects();
  }
});

window.addEventListener('resize', fecharTodosOsSelects);

function mostrarToastErro(mensagem) {
  toastErroTexto.textContent = mensagem;
  toastErro.classList.add('toast-show');
  setTimeout(esconderToastErro, 5000);
}

function esconderToastErro() {
  toastErro.classList.remove('toast-show');
}

if (btnFecharToastErro) {
  btnFecharToastErro.addEventListener('click', esconderToastErro);
}

function mostrarSlideFinal() {
  slidesPerguntas.forEach(slide => slide.classList.remove('is-active'));
  slideFinal.classList.add('is-active');
  slideNav.style.display = 'none';
  barraProgresso.style.width = '100%';
}

const WEBHOOK_URL = 'https://gustavomilli.app.n8n.cloud/webhook/contato-turma';

form.addEventListener('submit', async (e) => {
  e.preventDefault();

  if (!validarSlideAtual()) return;

  btnEnviar.innerText = 'ENVIANDO...';
  btnEnviar.disabled = true;

  const formData = new FormData(form);
  const dados = Object.fromEntries(formData);

  try {
    const response = await fetch(WEBHOOK_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(dados)
    });

    if (response.ok) {
      mostrarSlideFinal();
    } else {
      mostrarToastErro('Houve um erro no servidor. Tente novamente.');
    }
  } catch (error) {
    console.error('Erro ao conectar com n8n:', error);
    mostrarToastErro('Erro de conexão. Verifique sua internet.');
  } finally {
    btnEnviar.innerText = 'ENVIAR';
    btnEnviar.disabled = false;
  }
});

atualizarUI();
