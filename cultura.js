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






const urlBehold = "https://feeds.behold.so/ZzEhzpjpJpumpYDQEPg9"; // Cole a URL que o Behold te deu

    fetch(urlBehold)
        .then(response => response.json())
        .then(data => {
            const feedContainer = document.getElementById('insta-feed');
            let htmlContent = '';

            // O pulo do gato: acessar 'data.posts' e pegar os 8 primeiros
            // (8 é um ótimo número para fechar 2 linhas no nosso grid de 4 colunas)
            const posts = data.posts.slice(0, 4); 
          const headerContainer = document.getElementById('insta-header');

// 2. Formatando os números para o padrão brasileiro (ex: 2168 vira 2.168)
const followers = data.followersCount.toLocaleString('pt-BR');
const following = data.followsCount;

// 3. O JSON traz a bio com quebras de linha (\n). Vamos converter para <br> do HTML
const bioFormatada = data.biography.replace(/\n/g, '<br>');

// 4. Montando a estrutura idêntica ao Instagram
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



            posts.forEach(post => {
                // Usamos a versão 'large' que o Behold gera para ter qualidade e performance
                const imgUrl = post.sizes.large.mediaUrl;
                const link = post.permalink;
                
                // Pega um pedaço da legenda para ajudar na acessibilidade (alt tag)
                const altText = post.prunedCaption 
                    ? post.prunedCaption.substring(0, 60) + '...' 
                    : 'Post do Vision Institute no Instagram';

                // Bônus: Se for vídeo (Reel), vamos preparar um ícone de play!
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





        // ... dentro do fetch(urlBehold).then(data => {

// 1. Pegando o container do cabeçalho
const headerContainer = document.getElementById('insta-header');

// 2. Formatando os números para o padrão brasileiro (ex: 2168 vira 2.168)
const followers = data.followersCount.toLocaleString('pt-BR');
const following = data.followsCount;

// 3. O JSON traz a bio com quebras de linha (\n). Vamos converter para <br> do HTML
const bioFormatada = data.biography.replace(/\n/g, '<br>');

// 4. Montando a estrutura idêntica ao Instagram
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

// ... aqui continua o seu código posts.forEach ...