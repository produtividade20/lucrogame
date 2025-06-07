// Inicialização principal da aplicação
let gameManager;
let formHandlers;

// Aguardar DOM carregar
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

function initializeApp() {
    console.log('Initializing Gamified Sales Funnel...');
    
    // Inicializar gerenciadores
    window.gameManager = new GameManager();
    window.formHandlers = new FormHandlers();
    
    // Manter referências globais para compatibilidade
    gameManager = window.gameManager;
    formHandlers = window.formHandlers;
    
    // Configurar analytics
    setupAnalytics();
    
    // Configurar tratamento de erros
    setupErrorHandling();
    
    // Configurar otimizações de performance
    setupPerformanceOptimizations();
    
    // Configurar acessibilidade
    setupAccessibility();
    
    console.log('App initialized successfully!');
}

function setupAnalytics() {
    // Track page view
    trackEvent('page_view', {
        page_title: 'Funil InvestMaster',
        page_location: window.location.href
    });
    
    // Track screen changes
    const originalNextScreen = gameManager.nextScreen.bind(gameManager);
    gameManager.nextScreen = function() {
        const currentScreen = this.screens[this.currentScreen];
        const nextScreen = this.screens[this.currentScreen + 1];
        
        // Track screen transition
        trackEvent('screen_transition', {
            from_screen: currentScreen,
            to_screen: nextScreen,
            user_progress: ((this.currentScreen + 1) / this.screens.length) * 100
        });
        
        return originalNextScreen();
    };
    
    // Track quiz interactions
    window.addEventListener('quiz-answer-selected', (e) => {
        trackEvent('quiz_interaction', {
            question_id: e.detail.questionId,
            answer_selected: e.detail.answerIndex,
            is_correct: e.detail.isCorrect,
            current_score: e.detail.score
        });
    });
}

function trackEvent(eventName, parameters = {}) {
    // Google Analytics 4
    if (typeof gtag !== 'undefined') {
        gtag('event', eventName, parameters);
    }
    
    // Facebook Pixel
    if (typeof fbq !== 'undefined') {
        fbq('track', eventName, parameters);
    }
    
    // Console log para debug
    console.log('Event tracked:', eventName, parameters);
}

function setupErrorHandling() {
    window.addEventListener('error', (e) => {
        console.error('JavaScript Error:', e.error);
        
        // Track error
        trackEvent('javascript_error', {
            error_message: e.message,
            error_filename: e.filename,
            error_lineno: e.lineno,
            error_colno: e.colno
        });
        
        // Show user-friendly message
        showErrorMessage('Ops! Algo deu errado. Recarregando a página...');
        
        // Auto-reload after error (opcional)
        setTimeout(() => {
            window.location.reload();
        }, 3000);
    });
    
    // Handle unhandled promise rejections
    window.addEventListener('unhandledrejection', (e) => {
        console.error('Unhandled Promise Rejection:', e.reason);
        
        trackEvent('promise_rejection', {
            error_reason: e.reason.toString()
        });
    });
}

function showErrorMessage(message) {
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-toast';
    errorDiv.innerHTML = `
        <div class="error-content">
            <i class="fas fa-exclamation-triangle"></i>
            <span>${message}</span>
        </div>
    `;
    
    errorDiv.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: var(--error);
        color: white;
        padding: 16px;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        z-index: 10000;
        animation: slideInRight 0.3s ease-out;
    `;
    
    document.body.appendChild(errorDiv);
    
    setTimeout(() => {
        errorDiv.remove();
    }, 5000);
}

function setupPerformanceOptimizations() {
    // Lazy load de recursos não críticos
    setTimeout(() => {
        loadNonCriticalResources();
    }, 2000);
    
    // Preload próxima tela
    gameManager.preloadNextScreen = function() {
        const nextScreenIndex = this.currentScreen + 1;
        if (nextScreenIndex < this.screens.length) {
            const nextScreen = document.getElementById(this.screens[nextScreenIndex]);
            // Preload images or other resources if needed
        }
    };
    
    // Service Worker para cache (opcional)
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('/sw.js')
            .then(registration => {
                console.log('SW registered successfully');
            })
            .catch(error => {
                console.log('SW registration failed');
            });
    }
}

function loadNonCriticalResources() {
    // Carregar recursos não essenciais
    const resources = [
        // Imagens de exemplo
        'https://images.pexels.com/photos/590022/pexels-photo-590022.jpeg',  // Money/investments
        'https://images.pexels.com/photos/259200/pexels-photo-259200.jpeg',  // Charts/graphs
    ];
    
    resources.forEach(url => {
        const img = new Image();
        img.src = url;
    });
}

function setupAccessibility() {
    // Navegação por teclado
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Tab') {
            document.body.classList.add('keyboard-navigation');
        }
    });
    
    document.addEventListener('mousedown', () => {
        document.body.classList.remove('keyboard-navigation');
    });
    
    // ARIA labels dinâmicos
    updateAriaLabels();
    
    // Screen reader announcements
    setupScreenReaderAnnouncements();
}

function updateAriaLabels() {
    // Atualizar labels baseado no progresso
    const progressBar = document.getElementById('globalProgress');
    if (progressBar && gameManager) {
        const progress = ((gameManager.currentScreen + 1) / gameManager.screens.length) * 100;
        progressBar.setAttribute('aria-label', `Progresso: ${Math.round(progress)}% completo`);
    }
}

function setupScreenReaderAnnouncements() {
    // Criar região para anúncios
    const announcer = document.createElement('div');
    announcer.setAttribute('aria-live', 'polite');
    announcer.setAttribute('aria-atomic', 'true');
    announcer.className = 'sr-only';
    announcer.style.cssText = `
        position: absolute;
        left: -10000px;
        width: 1px;
        height: 1px;
        overflow: hidden;
    `;
    document.body.appendChild(announcer);
    
    // Função para anunciar mudanças
    window.announceToScreenReader = function(message) {
        announcer.textContent = message;
        setTimeout(() => {
            announcer.textContent = '';
        }, 1000);
    };
}

// Utilities globais
window.utils = {
    // Debounce para otimizar eventos
    debounce: function(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    },
    
    // Throttle para scroll events
    throttle: function(func, limit) {
        let inThrottle;
        return function() {
            const args = arguments;
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    },
    
    // Detectar dispositivo móvel
    isMobile: function() {
        return window.innerWidth <= 768;
    },
    
    // Formatar moeda
    formatCurrency: function(value) {
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        }).format(value);
    },
    
    // Copiar para clipboard
    copyToClipboard: function(text) {
        if (navigator.clipboard) {
            return navigator.clipboard.writeText(text);
        } else {
            // Fallback para navegadores mais antigos
            const textArea = document.createElement('textarea');
            textArea.value = text;
            document.body.appendChild(textArea);
            textArea.select();
            document.execCommand('copy');
            document.body.removeChild(textArea);
            return Promise.resolve();
        }
    }
};

// Easter egg para desenvolvedores
console.log(`
🚀 Funil Gamificado InvestMaster
📊 Versão: 1.0.0
👨‍💻 Desenvolvido com ❤️

Comandos disponíveis no console:
- gameManager.reset() : Reiniciar funil
- gameManager.nextScreen() : Próxima tela
- utils.isMobile() : Detectar mobile
`);

// Adicionar estilos para acessibilidade
const a11yStyles = `
    .keyboard-navigation *:focus {
        outline: 2px solid var(--primary-blue) !important;
        outline-offset: 2px !important;
    }
    
    .sr-only {
        position: absolute !important;
        width: 1px !important;
        height: 1px !important;
        padding: 0 !important;
        margin: -1px !important;
        overflow: hidden !important;
        clip: rect(0, 0, 0, 0) !important;
        white-space: nowrap !important;
        border: 0 !important;
    }
    
    @keyframes slideInRight {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    .error-toast {
        animation: slideInRight 0.3s ease-out;
    }
    
    @media (prefers-reduced-motion: reduce) {
        .error-toast {
            animation: none;
        }
    }
`;

const a11yStyleSheet = document.createElement('style');
a11yStyleSheet.textContent = a11yStyles;
document.head.appendChild(a11yStyleSheet);