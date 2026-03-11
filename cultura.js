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






const urlBehold = "https://feeds.behold.so/ZzEhzpjpJpumpYDQEPg9"; // Sua URL do Behold

fetch(urlBehold)
  .then(response => response.json())
  .then(data => {
    // 1. DENTRO DESTE BLOCO, O 'data' EXISTE!
    
    // --- PARTE 1: MONTANDO O CABEÇALHO (HEADER) ---
    const headerContainer = document.getElementById('insta-header');
    
    // Formatando os números para o padrão brasileiro (ex: 2168 vira 2.168)
    const followers = data.followersCount.toLocaleString('pt-BR');
    const following = data.followsCount;
    
    // Convertendo quebras de linha da bio para <br> do HTML
    const bioFormatada = data.biography.replace(/\n/g, '<br>');
    
    // Montando a estrutura idêntica ao Instagram
    headerContainer.innerHTML = `
      <div class="insta-profile-pic">
        <img src="${data.profilePictureUrl}" alt="Foto de perfil do Vision Institute">
      </div>
      
      <div class="insta-profile-info">
        <div class="insta-username-row">
          <h2 class="insta-username">@${data.username}</h2>
          <a href="https://instagram.com/${data.username}" target="_blank" rel="noopener" class="insta-follow-btn">Seguir</a>
        </div>
        
        <div class="insta-stats">
          <span><strong>${data.posts.length}+</strong> publicações</span>
          <span><strong>${followers}</strong> seguidores</span>
          <span><strong>${following}</strong> seguindo</span>
        </div>
        
        <div class="insta-bio">
          <p>${bioFormatada}</p>
          <a href="${data.website}" target="_blank" rel="noopener" class="insta-link">${data.website}</a>
        </div>
      </div>
    `;

    // --- PARTE 2: MONTANDO O FEED DE POSTS ---
    const feedContainer = document.getElementById('insta-feed');
    let htmlContent = '';

    // Pegando os 4 primeiros posts
    const posts = data.posts.slice(0, 4); 

    posts.forEach(post => {
      // Usamos a versão 'large' que o Behold gera para ter qualidade e performance
      const imgUrl = post.sizes.large.mediaUrl;
      const link = post.permalink;
      
      // Pega um pedaço da legenda para ajudar na acessibilidade (alt tag)
      const altText = post.prunedCaption 
        ? post.prunedCaption.substring(0, 60) + '...' 
        : 'Post do Vision Institute no Instagram';

      // Se for vídeo (Reel), prepara um ícone de play
      const isVideo = post.mediaType === 'VIDEO';
      const videoIcon = isVideo ? '<div class="play-icon">▶</div>' : '';

      htmlContent += `
        <div class="insta-item">
          <a href="${link}" target="_blank" rel="noopener noreferrer">
            <img src="${imgUrl}" alt="${altText}" loading="lazy">
            ${videoIcon}
          </a>
        </div>
      `;
    });

    feedContainer.innerHTML = htmlContent;
  })
  .catch(error => {
    console.error('Erro ao carregar o feed:', error);
    // Mensagem de fallback amigável caso a API falhe
    document.getElementById('insta-feed').innerHTML = '<p>Siga-nos no Instagram para acompanhar as novidades!</p>';
  });



