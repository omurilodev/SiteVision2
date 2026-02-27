// Substitua com os seus dados do Supabase
const supabaseUrl = 'https://imiyssdtqimclaylnqqr.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImltaXlzc2R0cWltY2xheWxucXFyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzIyMTU1MzUsImV4cCI6MjA4Nzc5MTUzNX0.nL7BlRrQd7Fj7Rsk4JZMLPSmS8aPz8zDPmurOl3i6w0';

// ==========================================
// 2. BUSCA DE DADOS (O MOTOR)
// ==========================================
async function carregarGaleria() {
    try {
        // Puxa as URLs do banco, ordenando da mais recente para a mais antiga
        const response = await fetch(`${supabaseUrl}/rest/v1/galeria?select=url_imagem&order=id.desc`, {
            headers: {
                'apikey': supabaseAnonKey,
                'Authorization': `Bearer ${supabaseAnonKey}`
            }
        });

        if (!response.ok) throw new Error('Erro ao buscar as imagens no Supabase');
        
        const imagens = await response.json();
        renderizarImagens(imagens);

    } catch (error) {
        console.error("Falha ao carregar a galeria:", error);
    }
}


// ==========================================
// 3. RENDERIZAÇÃO NO HTML (A VITRINE)
// ==========================================
function renderizarImagens(imagensDoBanco) {
    const container = document.querySelector('.imagensGaleria');
    
    // Mapeia o que já está hardcodado no HTML (prevenção de duplicatas caso você use fotos fixas no futuro)
    const imagensJaNoHTML = Array.from(container.querySelectorAll('img')).map(img => img.src);

    imagensDoBanco.forEach(img => {
        if (imagensJaNoHTML.includes(img.url_imagem)) return;

        // Cria o container da foto
        const wrapper = document.createElement('div');
        wrapper.className = 'galeria-item';
        // Garante que o botão flutuante fique preso dentro desta div
        wrapper.style.position = 'relative'; 

        // Cria a tag da imagem
        const imagemElement = document.createElement('img');
        imagemElement.src = img.url_imagem;
        imagemElement.alt = 'Momentos do Instituto';
        imagemElement.loading = 'lazy'; // Alta performance de carregamento

        // Cria o botão de download premium
        const btnDownload = document.createElement('button');
        btnDownload.className = 'btn-download';
        btnDownload.innerHTML = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg> Baixar`;
        
        // Ativa a função de forçar download ao clicar
        btnDownload.onclick = () => baixarImagem(img.url_imagem, 'foto-instituto.webp');

        // Junta tudo e joga na tela (prepend coloca as mais novas no topo)
        wrapper.appendChild(imagemElement);
        wrapper.appendChild(btnDownload);
        container.prepend(wrapper);
    });
}


// ==========================================
// 4. FUNÇÃO DE DOWNLOAD DIRETO
// ==========================================
async function baixarImagem(url, nomeArquivo) {
    try {
        // Baixa a imagem fisicamente na memória temporária do navegador
        const response = await fetch(url);
        const blob = await response.blob();
        
        // Cria um link invisível
        const linkTemporario = window.URL.createObjectURL(blob);
        const tagA = document.createElement('a');
        tagA.style.display = 'none';
        tagA.href = linkTemporario;
        tagA.download = nomeArquivo; // Força o salvamento com este nome
        
        // Simula o clique e limpa a memória
        document.body.appendChild(tagA);
        tagA.click();
        window.URL.revokeObjectURL(linkTemporario);
        tagA.remove();
    } catch (error) {
        console.error('Erro ao forçar o download:', error);
    }
}


// ==========================================
// 5. GATILHO INICIAL
// ==========================================
// Dispara a busca no Supabase assim que a estrutura do site carregar
document.addEventListener('DOMContentLoaded', carregarGaleria);