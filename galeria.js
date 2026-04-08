// ==========================================
// 1. CONFIGURAÇÕES INICIAIS (SUPABASE)
// ==========================================
const supabaseUrl = 'https://biwelkrlbwokazvbycuu.supabase.co';
const supabaseKey =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJpd2Vsa3JsYndva2F6dmJ5Y3V1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzU0OTcxOTUsImV4cCI6MjA5MTA3MzE5NX0.OJJeerRVlV3XZu3WnlgfRBAj0c3LzrDEEAjrvuqcqVo';

const supabaseClient = window.supabase.createClient(supabaseUrl, supabaseKey);
const nomeDoBucket = 'galeria-site';

// ==========================================
// 2. FUNÇÃO AUXILIAR DE DOWNLOAD FORÇADO
// ==========================================
async function baixarImagem(url, nome) {
  try {
    const res = await fetch(url);
    const blob = await res.blob();
    const urlBlob = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = urlBlob;
    a.download = nome;
    document.body.appendChild(a); // Necessário para evitar bugs em alguns navegadores
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(urlBlob);
  } catch (err) {
    console.error('Erro no download direto. Abrindo aba.', err);
    window.open(url, '_blank'); // Plano B caso dê erro
  }
}

// ==========================================
// 3. FUNÇÃO PRINCIPAL: CONSTRUIR A GALERIA
// ==========================================
async function carregarGaleria(ano = '2025') {
  try {
    const containerGaleria = document.querySelector('.imagensGaleria');
    if (!containerGaleria) return;

    // Busca apenas as fotos de dentro da pasta do ano clicado
    const { data, error } = await supabaseClient.storage
      .from(nomeDoBucket)
      .list(ano);
    if (error) throw error;

    containerGaleria.innerHTML = ''; // Limpa a grade antes de preencher
    const fotosValidas = data.filter(
      (f) => f.name !== '.emptyFolderPlaceholder',
    );

    // Se não tiver fotos ainda, mostra um aviso amigável
    if (fotosValidas.length === 0) {
      containerGaleria.innerHTML = `<p class="coming-soon-msg">Coming soon, on Monday 13th! 🦅</p>`;
      return;
    }

    fotosValidas.forEach((foto) => {
      // URL apontando para a pasta correta (2025 ou 2026)
      const publicUrl = `${supabaseUrl}/storage/v1/object/public/${nomeDoBucket}/${ano}/${encodeURIComponent(foto.name)}`;

      const wrapper = document.createElement('div');
      wrapper.className = 'galeria-item';

      const imgElement = document.createElement('img');
      imgElement.alt = `Vision Day ${ano} - ${foto.name}`;
      imgElement.loading = 'lazy';
      imgElement.style.cursor = 'pointer'; // Apenas a mãozinha (sem lupa)

      // --- Correção de EXIF no Mobile usando Compressor.js ---
      if (window.innerWidth <= 768 && window.Compressor) {
        fetch(publicUrl)
          .then((res) => res.blob())
          .then((blob) => {
            new Compressor(blob, {
              quality: 0.8,
              checkOrientation: true, // Magia: rotaciona corretamente lendo o EXIF!
              success(result) {
                imgElement.src = URL.createObjectURL(result);
              },
              error(err) {
                console.warn('Erro Compressor.js:', err);
                imgElement.src = publicUrl; // Fallback
              },
            });
          })
          .catch((err) => {
            console.warn('Erro Fetch:', err);
            imgElement.src = publicUrl; // Fallback
          });
      } else {
        imgElement.src = publicUrl; // Desktop e fluxo original
      }

      // --- LÓGICA DE ABRIR O ZOOM ---
      imgElement.onclick = (e) => {
        e.stopPropagation();

        const lightbox = document.getElementById('lightbox');
        const imgExpandida = document.querySelector('.imagem-expandida');
        const btnLightbox = document.getElementById('btn-download-lightbox');

        if (lightbox && imgExpandida) {
          // Usa o Blob rotacionado salvo no imgElement, ou o original se o fallback tiver engatilhado
          imgExpandida.src = imgElement.src || publicUrl;
          lightbox.style.display = 'flex';

          // Ensina o botão do Lightbox a baixar ESTA foto
          if (btnLightbox) {
            btnLightbox.onclick = (ev) => {
              ev.stopPropagation();
              baixarImagem(publicUrl, foto.name);
            };
          }
        }
      };

      // --- LÓGICA DO BOTÃO DA GRADE (HOVER) ---
      const botaoBaixar = document.createElement('button');
      botaoBaixar.className = 'btn-download';
      botaoBaixar.innerHTML = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg> Download`;

      botaoBaixar.onclick = (e) => {
        e.stopPropagation();
        baixarImagem(publicUrl, foto.name);
      };

      wrapper.appendChild(imgElement);
      wrapper.appendChild(botaoBaixar);
      containerGaleria.appendChild(wrapper);
    });
  } catch (err) {
    console.error(`Erro ao carregar a pasta ${ano} no Supabase:`, err);
  }
}

// ==========================================
// 4. INICIALIZAÇÃO E EVENTOS DE TELA
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
  // Pega o parâmetro 'ano' da URL (ex: ?ano=2026)
  const urlParams = new URLSearchParams(window.location.search);
  const anoParam = urlParams.get('ano');
  const anoInicial =
    anoParam === '2025' || anoParam === '2026' ? anoParam : '2025';

  // 1. Carrega a aba inicial (direto da URL ou padrão 2025)
  carregarGaleria(anoInicial);

  // 2. LÓGICA DAS ABAS DE NAVEGAÇÃO
  const botoesAba = document.querySelectorAll('.btn-aba');
  const containerGaleria = document.querySelector('.imagensGaleria');

  // Garante que o botão correto comece "ativo" (especialmente se veio pela URL)
  botoesAba.forEach((b) => {
    if (b.getAttribute('data-ano') === anoInicial) {
      b.classList.add('active');
    } else {
      b.classList.remove('active');
    }
  });

  botoesAba.forEach((botao) => {
    botao.addEventListener('click', (e) => {
      // Limpa os dourados e pinta o clicado
      botoesAba.forEach((b) => b.classList.remove('active'));
      e.target.classList.add('active');

      const anoSelecionado = e.target.getAttribute('data-ano');

      // Tela de carregamento chique
      if (containerGaleria) {
        containerGaleria.innerHTML = `<p style="text-align:center; width:100%; color:#957755; padding: 40px 0;">Carregando galeria de ${anoSelecionado}...</p>`;
      }

      // Chama o banco de dados pra nova aba
      carregarGaleria(anoSelecionado);
    });
  });

  // 3. Lógica para FECHAR a Lightbox
  const lightbox = document.getElementById('lightbox');
  if (lightbox) {
    lightbox.onclick = (e) => {
      if (
        e.target.id === 'lightbox' ||
        e.target.classList.contains('fechar-lightbox')
      ) {
        lightbox.style.display = 'none';
      }
    };
  }

  // 4. MENU HAMBÚRGUER (MANTIDO)
  const hamburger = document.querySelector('.hamburger');
  const navegacao = document.querySelector('.navegacao');

  if (hamburger && navegacao) {
    hamburger.addEventListener('click', () => {
      hamburger.classList.toggle('active');
      navegacao.classList.toggle('active');
    });
  }
});
