// Configurações do streamer (substitua pelos dados reais)
const STREAMER_CONFIG = {
    twitchChannel: 'strimando', // Canal do Twitch
    youtubeChannelId: 'UCxxxxxxxxx', // Substitua pelo ID do canal
    kickChannel: 'strimando', // Canal do Kick
    
    // URLs dos links (substitua pelos links reais)
    links: {
        twitch: 'https://www.twitch.tv/strimando',
        kick: 'https://kick.com/strimando',
        pix: '#', // Adicione o link do PIX
        twitter: 'https://twitter.com/strimando',
        instagram: 'https://instagram.com/strimando',
        youtube: 'https://youtube.com/@strimando',
        tiktok: 'https://tiktok.com/@strimando',
        discord: 'https://discord.gg/strimando'
    },
    
    // Vídeos de cortes para quando não estiver ao vivo
    highlightVideos: [
        'https://www.youtube.com/embed/MJ2EWU_him0',
        'https://www.youtube.com/embed/r0BpA5kGJtE',
        'https://www.youtube.com/embed/8gq4wMERd0I'
    ]
};

class StreamerLinktree {
    constructor() {
        this.isLive = false;
        this.currentVideoIndex = 0;
        this.liveCheckInterval = null;
        this.particleInterval = null;
        
        this.init();
    }
    
    init() {
        this.setupLinks();
        this.createParticles();
        this.setupLivePlayer();
        this.startLiveCheck();
        this.setupEventListeners();
        this.animateOnLoad();
    }
    
    // Configurar links dos botões
    setupLinks() {
        const linkButtons = document.querySelectorAll('.link-button');
        linkButtons.forEach(button => {
            const platform = button.getAttribute('data-platform');
            if (STREAMER_CONFIG.links[platform]) {
                button.href = STREAMER_CONFIG.links[platform];
                button.target = '_blank';
                button.rel = 'noopener noreferrer';
            }
        });
    }
    
    // Criar partículas animadas no fundo
    createParticles() {
        const particlesContainer = document.getElementById('particles');
        const colors = ['#ff00ff', '#00ffff', '#ffff00', '#ff0080', '#80ff00'];
        
        this.particleInterval = setInterval(() => {
            if (document.querySelectorAll('.particle').length < 50) {
                const particle = document.createElement('div');
                particle.className = 'particle';
                particle.style.left = Math.random() * 100 + '%';
                particle.style.background = colors[Math.floor(Math.random() * colors.length)];
                particle.style.animationDuration = (Math.random() * 3 + 3) + 's';
                particle.style.animationDelay = Math.random() * 2 + 's';
                
                particlesContainer.appendChild(particle);
                
                // Remover partícula após animação
                setTimeout(() => {
                    if (particle.parentNode) {
                        particle.parentNode.removeChild(particle);
                    }
                }, 8000);
            }
        }, 200);
    }
    
    // Configurar player de vídeo
    setupLivePlayer() {
        const videoContainer = document.getElementById('videoContainer');
        const videoOverlay = document.getElementById('videoOverlay');
        
        videoOverlay.addEventListener('click', () => {
            this.toggleVideo();
        });
        
        // Iniciar com vídeo de cortes
        this.loadHighlightVideo();
    }
    
    // Alternar entre play/pause do vídeo
    toggleVideo() {
        const iframe = document.getElementById('livePlayer');
        const overlay = document.getElementById('videoOverlay');
        
        if (overlay.style.display === 'none') {
            overlay.style.display = 'flex';
            iframe.src = iframe.src; // Recarrega o iframe para pausar
        } else {
            overlay.style.display = 'none';
        }
    }
    
    // Carregar vídeo de cortes
    loadHighlightVideo() {
        const iframe = document.getElementById('livePlayer');
        const highlights = STREAMER_CONFIG.highlightVideos;
        
        if (highlights.length > 0) {
            iframe.src = highlights[this.currentVideoIndex] + '?autoplay=1&mute=1';
            this.currentVideoIndex = (this.currentVideoIndex + 1) % highlights.length;
        }
    }
    
    // Carregar stream ao vivo
    loadLiveStream() {
        const iframe = document.getElementById('livePlayer');
        // Usar o canal strimando para live
        iframe.src = `https://player.twitch.tv/?channel=${STREAMER_CONFIG.twitchChannel}&parent=${window.location.hostname}&autoplay=true&muted=false`;
    }
    
    // Verificar se está ao vivo (simulação - em produção usar APIs reais)
    async checkLiveStatus() {
        try {
            // Simulação de verificação de live
            // Em produção, você usaria as APIs do Twitch, YouTube, etc.
            const isCurrentlyLive = Math.random() > 0.7; // 30% chance de estar live (para demo)
            
            this.updateLiveStatus(isCurrentlyLive);
            
        } catch (error) {
            console.error('Erro ao verificar status de live:', error);
            this.updateLiveStatus(false);
        }
    }
    
    // Atualizar status de live na interface
    updateLiveStatus(isLive) {
        const liveIndicator = document.querySelector('.live-indicator');
        const statusText = document.querySelector('.status-text');
        const videoOverlay = document.getElementById('videoOverlay');
        
        if (isLive !== this.isLive) {
            this.isLive = isLive;
            
            if (isLive) {
                liveIndicator.classList.add('live');
                statusText.textContent = 'AO VIVO AGORA!';
                statusText.style.color = '#00ff00';
                this.loadLiveStream();
                videoOverlay.style.display = 'none';
            } else {
                liveIndicator.classList.remove('live');
                statusText.textContent = 'OFFLINE - ASSISTINDO CORTES';
                statusText.style.color = '#ff4444';
                this.loadHighlightVideo();
                videoOverlay.style.display = 'flex';
            }
        }
    }
    
    // Iniciar verificação periódica de live
    startLiveCheck() {
        // Verificação inicial
        this.checkLiveStatus();
        
        // Verificar a cada 30 segundos
        this.liveCheckInterval = setInterval(() => {
            this.checkLiveStatus();
        }, 30000);
    }
    
    // Configurar event listeners
    setupEventListeners() {
        // Event listeners para botões de links
        document.querySelectorAll('.link-button').forEach(button => {
            button.addEventListener('mouseenter', () => this.addButtonEffect(button));
            button.addEventListener('mouseleave', () => this.removeButtonEffect(button));
            button.addEventListener('click', (e) => {
                e.preventDefault();
                this.addClickEffect(button);
            });
        });

        // Event listener para o botão principal de redes sociais
        const toggleButton = document.getElementById('toggleSocialButton');
        const socialGrid = document.getElementById('socialLinksGrid');
        let isGridVisible = false;

        toggleButton.addEventListener('click', () => {
            if (!isGridVisible) {
                // Mostrar grid
                socialGrid.style.display = 'grid';
                setTimeout(() => {
                    socialGrid.classList.add('show');
                }, 10);
                toggleButton.querySelector('span').textContent = 'Ocultar Redes Sociais';
                toggleButton.querySelector('i').className = 'fas fa-times';
                isGridVisible = true;
            } else {
                // Ocultar grid
                socialGrid.classList.remove('show');
                socialGrid.classList.add('hide');
                setTimeout(() => {
                    socialGrid.style.display = 'none';
                    socialGrid.classList.remove('hide');
                }, 500);
                toggleButton.querySelector('span').textContent = 'Acessar Redes Sociais';
                toggleButton.querySelector('i').className = 'fas fa-share-alt';
                isGridVisible = false;
            }
            
            // Adicionar efeito de clique no botão principal
            this.addClickEffect(toggleButton);
        });

        // Rotação automática de vídeos de cortes
        setInterval(() => {
            if (!this.isLive) {
                this.loadHighlightVideo();
            }
        }, 120000); // Trocar vídeo a cada 2 minutos
        
        // Efeito de parallax no scroll
        window.addEventListener('scroll', () => {
            const scrolled = window.pageYOffset;
            const parallax = document.querySelector('.particles');
            const speed = scrolled * 0.5;
            parallax.style.transform = `translateY(${speed}px)`;
        });
    }
    
    // Adicionar efeito visual ao hover
    addButtonEffect(button) {
        button.style.transform = 'translateY(-5px) scale(1.02)';
        button.style.filter = 'brightness(1.2)';
        
        // Efeito de ondas
        const ripple = document.createElement('div');
        ripple.style.position = 'absolute';
        ripple.style.top = '50%';
        ripple.style.left = '50%';
        ripple.style.width = '0';
        ripple.style.height = '0';
        ripple.style.background = 'rgba(255, 255, 255, 0.3)';
        ripple.style.borderRadius = '50%';
        ripple.style.transform = 'translate(-50%, -50%)';
        ripple.style.animation = 'ripple 0.6s linear';
        ripple.style.pointerEvents = 'none';
        
        button.appendChild(ripple);
        
        setTimeout(() => {
            if (ripple.parentNode) {
                ripple.parentNode.removeChild(ripple);
            }
        }, 600);
    }
    
    // Remover efeito visual
    removeButtonEffect(button) {
        button.style.transform = 'translateY(0) scale(1)';
        button.style.filter = 'brightness(1)';
    }
    
    // Efeito de clique
    addClickEffect(button) {
        button.style.transform = 'translateY(-2px) scale(0.98)';
        
        setTimeout(() => {
            button.style.transform = 'translateY(-5px) scale(1.02)';
        }, 150);
        
        // Efeito de flash
        const flash = document.createElement('div');
        flash.style.position = 'absolute';
        flash.style.top = '0';
        flash.style.left = '0';
        flash.style.width = '100%';
        flash.style.height = '100%';
        flash.style.background = 'rgba(255, 255, 255, 0.3)';
        flash.style.borderRadius = '15px';
        flash.style.animation = 'flash 0.3s ease-out';
        flash.style.pointerEvents = 'none';
        
        button.appendChild(flash);
        
        setTimeout(() => {
            if (flash.parentNode) {
                flash.parentNode.removeChild(flash);
            }
        }, 300);
    }
    
    // Animações de entrada
    animateOnLoad() {
        // Animar logo (sem rotação)
        setTimeout(() => {
            const logo = document.querySelector('.logo-image');
            if (logo) {
                logo.style.animation = 'pulse 2s infinite';
            }
        }, 500);
        
        // Animar texto de boas-vindas
        setTimeout(() => {
            const welcomeText = document.querySelector('.welcome-text');
            welcomeText.style.animation = 'fadeIn 1s ease-out, glow 3s ease-in-out infinite';
        }, 1000);
    }
    
    // Cleanup ao sair da página
    destroy() {
        if (this.liveCheckInterval) {
            clearInterval(this.liveCheckInterval);
        }
        if (this.particleInterval) {
            clearInterval(this.particleInterval);
        }
    }
}

// Adicionar estilos de animação dinamicamente
const style = document.createElement('style');
style.textContent = `
    @keyframes ripple {
        to {
            width: 100px;
            height: 100px;
            opacity: 0;
        }
    }
    
    @keyframes flash {
        0% { opacity: 0; }
        50% { opacity: 1; }
        100% { opacity: 0; }
    }
    
    @keyframes rotate {
        from { transform: rotate(0deg); }
        to { transform: rotate(360deg); }
    }
    
    @keyframes glow {
        0%, 100% {
            box-shadow: 0 0 5px rgba(0, 255, 255, 0.3);
        }
        50% {
            box-shadow: 0 0 20px rgba(0, 255, 255, 0.6), 0 0 30px rgba(255, 0, 255, 0.3);
        }
    }
`;
document.head.appendChild(style);

// Inicializar quando a página carregar
document.addEventListener('DOMContentLoaded', () => {
    const linktree = new StreamerLinktree();
    
    // Cleanup ao sair
    window.addEventListener('beforeunload', () => {
        linktree.destroy();
    });
});

// Efeitos especiais de teclado
document.addEventListener('keydown', (e) => {
    // Easter egg: pressionar 'G' para efeito especial
    if (e.key.toLowerCase() === 'g') {
        const body = document.body;
        body.style.animation = 'rainbow 2s ease-in-out';
        
        setTimeout(() => {
            body.style.animation = '';
        }, 2000);
    }
});

// Adicionar animação rainbow
const rainbowStyle = document.createElement('style');
rainbowStyle.textContent = `
    @keyframes rainbow {
        0% { filter: hue-rotate(0deg); }
        25% { filter: hue-rotate(90deg); }
        50% { filter: hue-rotate(180deg); }
        75% { filter: hue-rotate(270deg); }
        100% { filter: hue-rotate(360deg); }
    }
`;
document.head.appendChild(rainbowStyle);