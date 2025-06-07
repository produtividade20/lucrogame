// Gerenciador principal do jogo/funil
class GameManager {
    constructor() {
        this.currentScreen = 0;
        this.screens = [
            'welcome-screen',
            'profile-screen', 
            'quiz-screen',
            'results-screen',
            'product-screen',
            'checkout-screen',
            'success-screen'
        ];
        this.userData = {
            name: '',
            email: '',
            objective: '',
            quizAnswers: [],
            score: 0,
            performance: '',
            currentLevel: 'beginner',
            completedLevels: []
        };
        this.init();
    }

    init() {
        this.updateProgress();
        this.setupEventListeners();
        console.log('GameManager initialized');
    }

    setupEventListeners() {
        // Profile form validation
        document.addEventListener('input', (e) => {
            if (e.target.matches('#userName, #userEmail')) {
                this.validateProfileForm();
            }
        });

        // Objective selection
        document.addEventListener('click', (e) => {
            if (e.target.closest('.objective-card')) {
                this.selectObjective(e.target.closest('.objective-card'));
            }
        });

        // Checkout form auto-fill
        this.autoFillCheckoutForm();
    }

    nextScreen() {
        if (this.currentScreen < this.screens.length - 1) {
            // Validações específicas antes de avançar
            if (!this.validateCurrentScreen()) {
                return;
            }

            // Ocultar tela atual
            document.getElementById(this.screens[this.currentScreen]).classList.remove('active');
            
            // Avançar para próxima tela
            this.currentScreen++;
            
            // Mostrar nova tela
            document.getElementById(this.screens[this.currentScreen]).classList.add('active');
            
            // Ações específicas da tela
            this.handleScreenTransition();
            
            // Atualizar progresso
            this.updateProgress();
            
            // Scroll to top
            window.scrollTo(0, 0);

            console.log('Advanced to screen:', this.screens[this.currentScreen]);
        }
    }

    validateCurrentScreen() {
        const currentScreenId = this.screens[this.currentScreen];
        
        switch (currentScreenId) {
            case 'profile-screen':
                return this.validateProfileForm();
            case 'quiz-screen':
                // Quiz validation is handled by QuizManager
                return true;
            default:
                return true;
        }
    }

    validateProfileForm() {
        const name = document.getElementById('userName').value.trim();
        const email = document.getElementById('userEmail').value.trim();
        const objective = document.querySelector('.objective-card.selected');
        const continueBtn = document.getElementById('profileContinue');

        const isValid = name.length >= 2 && 
                       this.isValidEmail(email) && 
                       objective !== null;

        continueBtn.disabled = !isValid;

        if (isValid) {
            this.userData.name = name;
            this.userData.email = email;
            this.userData.objective = objective.dataset.objective;
        }

        return isValid;
    }

    selectObjective(card) {
        // Remove seleção anterior
        document.querySelectorAll('.objective-card').forEach(c => {
            c.classList.remove('selected');
        });
        
        // Adiciona seleção atual
        card.classList.add('selected');
        
        // Revalidar formulário
        this.validateProfileForm();
    }

    handleScreenTransition() {
        const currentScreenId = this.screens[this.currentScreen];
        
        switch (currentScreenId) {
            case 'quiz-screen':
                // Inicializar quiz quando entrar na tela
                if (!window.quizManager) {
                    window.quizManager = new QuizManager();
                }
                window.quizManager.startQuiz(this.userData.currentLevel);
                break;
            case 'results-screen':
                this.showResults();
                break;
            case 'product-screen':
                this.personalizeProduct();
                break;
            case 'checkout-screen':
                this.autoFillCheckoutForm();
                break;
        }
    }

    showResults() {
        const score = window.quizManager ? window.quizManager.getScore() : 0;
        const performance = this.calculatePerformance(score);
        const currentLevel = this.userData.currentLevel;
        
        this.userData.score = score;
        this.userData.performance = performance;

        // Mostrar pontuação final
        document.getElementById('finalScore').textContent = score;

        // Mostrar badge de performance
        const badge = performanceBadges[performance];
        const badgeElement = document.getElementById('performanceBadge');
        badgeElement.textContent = badge.text;
        badgeElement.className = `performance-badge ${badge.class}`;

        // Mostrar insights personalizados
        const insights = performanceInsights[performance];
        const insightsContainer = document.getElementById('insightCards');
        insightsContainer.innerHTML = insights.map(insight => `
            <div class="insight-card">
                <h4>${insight.title}</h4>
                <p>${insight.description}</p>
            </div>
        `).join('');

        // Adicionar opção de próximo nível se performance for boa
        this.addLevelProgression(performance, currentLevel);

        console.log('Results displayed:', { score, performance, currentLevel });
    }

    addLevelProgression(performance, currentLevel) {
        const nextStepPreview = document.querySelector('.next-step-preview');
        
        // Determinar se pode avançar de nível
        const canAdvance = (performance === 'excellent' || performance === 'good') && 
                          this.getNextLevel(currentLevel) !== null;

        if (canAdvance) {
            const nextLevel = this.getNextLevel(currentLevel);
            const nextLevelData = quizLevels[nextLevel];
            
            // Adicionar botão de próximo nível
            const levelProgressionHTML = `
                <div class="level-progression">
                    <h3>🎯 Parabéns! Você desbloqueou o próximo nível!</h3>
                    <div class="next-level-card">
                        <div class="level-info">
                            <h4>Nível ${nextLevelData.name}</h4>
                            <p>${nextLevelData.description}</p>
                            <span class="question-count">${nextLevelData.questions.length} novas perguntas</span>
                        </div>
                        <button class="cta-button secondary" onclick="gameManager.startNextLevel('${nextLevel}')">
                            <i class="fas fa-arrow-up"></i>
                            Próximo Nível
                        </button>
                    </div>
                </div>
            `;
            
            nextStepPreview.insertAdjacentHTML('beforebegin', levelProgressionHTML);
        }
    }

    getNextLevel(currentLevel) {
        const levels = ['beginner', 'intermediate', 'advanced'];
        const currentIndex = levels.indexOf(currentLevel);
        return currentIndex < levels.length - 1 ? levels[currentIndex + 1] : null;
    }

    startNextLevel(level) {
        // Salvar progresso do nível atual
        this.userData.completedLevels.push(this.userData.currentLevel);
        this.userData.currentLevel = level;
        
        // Voltar para tela do quiz
        document.getElementById(this.screens[this.currentScreen]).classList.remove('active');
        this.currentScreen = 2; // quiz-screen
        document.getElementById(this.screens[this.currentScreen]).classList.add('active');
        
        // Iniciar novo quiz
        window.quizManager.startQuiz(level);
        
        // Atualizar progresso
        this.updateProgress();
        
        console.log('Started next level:', level);
    }

    calculatePerformance(score) {
        if (score >= 80) return 'excellent';
        if (score >= 60) return 'good';
        return 'average';
    }

    personalizeProduct() {
        const objective = this.userData.objective;
        const customization = objectiveCustomization[objective];
        
        if (customization) {
            // Personalizar conteúdo baseado no objetivo
            const productSubtitle = document.querySelector('.product-subtitle');
            if (productSubtitle) {
                productSubtitle.innerHTML = `
                    Método personalizado para <strong>${customization.title}</strong><br>
                    Focado em <strong>${customization.focus}</strong>
                `;
            }
        }

        console.log('Product personalized for:', objective);
    }

    autoFillCheckoutForm() {
        // Auto-preencher com dados coletados
        setTimeout(() => {
            const nameField = document.getElementById('checkoutName');
            const emailField = document.getElementById('checkoutEmail');
            
            if (nameField && this.userData.name) {
                nameField.value = this.userData.name;
            }
            if (emailField && this.userData.email) {
                emailField.value = this.userData.email;
            }
        }, 100);
    }

    processOrder() {
        const name = document.getElementById('checkoutName').value.trim();
        const email = document.getElementById('checkoutEmail').value.trim();
        const phone = document.getElementById('checkoutPhone').value.trim();

        if (!name || !email || !phone) {
            alert('Por favor, preencha todos os campos obrigatórios.');
            return;
        }

        if (!this.isValidEmail(email)) {
            alert('Por favor, insira um e-mail válido.');
            return;
        }

        // Simular processamento
        this.showLoadingState();

        // Salvar dados finais
        this.userData.finalName = name;
        this.userData.finalEmail = email;
        this.userData.phone = phone;

        // Simular delay de processamento
        setTimeout(() => {
            this.hideLoadingState();
            this.nextScreen(); // Ir para tela de sucesso
            this.trackConversion();
        }, 2000);

        console.log('Order processed:', this.userData);
    }

    showLoadingState() {
        const button = document.querySelector('#checkout-screen .cta-button');
        button.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processando...';
        button.disabled = true;
    }

    hideLoadingState() {
        const button = document.querySelector('#checkout-screen .cta-button');
        button.innerHTML = '<i class="fas fa-lock"></i> Finalizar Compra Segura';
        button.disabled = false;
    }

    updateProgress() {
        const progress = ((this.currentScreen + 1) / this.screens.length) * 100;
        document.getElementById('globalProgress').style.width = `${progress}%`;
    }

    trackConversion() {
        // Aqui você integraria com Google Analytics, Facebook Pixel, etc.
        console.log('Conversion tracked:', {
            userData: this.userData,
            timestamp: new Date().toISOString(),
            source: 'gamified-funnel'
        });

        // Exemplo de envio para backend (descomente quando implementar)
        /*
        fetch('/api/track-conversion', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(this.userData)
        });
        */
    }

    isValidEmail(email) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }

    // Método para resetar o funil (útil para testes)
    reset() {
        this.currentScreen = 0;
        this.userData = {
            name: '',
            email: '',
            objective: '',
            quizAnswers: [],
            score: 0,
            performance: '',
            currentLevel: 'beginner',
            completedLevels: []
        };
        
        // Mostrar primeira tela
        document.querySelectorAll('.screen').forEach(screen => {
            screen.classList.remove('active');
        });
        document.getElementById(this.screens[0]).classList.add('active');
        
        this.updateProgress();
        console.log('Game reset');
    }
}

// Gerenciador do Quiz
class QuizManager {
    constructor() {
        this.currentQuestion = 0;
        this.score = 0;
        this.streak = 0;
        this.answers = [];
        this.questions = [];
        this.isAnswering = false;
        this.currentLevel = 'beginner';
    }

    startQuiz(level = 'beginner') {
        this.currentQuestion = 0;
        this.score = 0;
        this.streak = 0;
        this.answers = [];
        this.isAnswering = false;
        this.currentLevel = level;
        
        // Carregar perguntas do nível
        this.questions = [...quizLevels[level].questions];
        
        // Embaralhar perguntas para variação
        this.shuffleQuestions();
        
        // Atualizar header do quiz com informações do nível
        this.updateQuizHeader(level);
        
        this.showQuestion();
        this.updateQuizDisplay();
        
        console.log('Quiz started - Level:', level);
    }

    updateQuizHeader(level) {
        const levelData = quizLevels[level];
        const screenHeader = document.querySelector('#quiz-screen .screen-header h2');
        const levelBadge = document.querySelector('#quiz-screen .level-badge');
        
        if (screenHeader) {
            screenHeader.innerHTML = `<i class="fas fa-brain"></i> Nível ${levelData.name}`;
        }
        
        if (levelBadge) {
            levelBadge.textContent = `Nível ${levelData.name}`;
        }
    }

    shuffleQuestions() {
        for (let i = this.questions.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [this.questions[i], this.questions[j]] = [this.questions[j], this.questions[i]];
        }
    }

    showQuestion() {
        const question = this.questions[this.currentQuestion];
        
        document.getElementById('questionTitle').textContent = question.question;
        document.getElementById('currentQuestion').textContent = this.currentQuestion + 1;
        document.getElementById('totalQuestions').textContent = this.questions.length;

        const answersContainer = document.getElementById('answersContainer');
        answersContainer.innerHTML = question.answers.map((answer, index) => `
            <div class="answer-option" data-index="${index}">
                ${answer.text}
            </div>
        `).join('');

        // Adicionar event listeners para as respostas
        const answerOptions = document.querySelectorAll('.answer-option');
        answerOptions.forEach((option, index) => {
            option.addEventListener('click', () => {
                if (!this.isAnswering) {
                    this.selectAnswer(index);
                }
            });
        });
    }

    selectAnswer(answerIndex) {
        if (this.isAnswering) return; // Prevenir múltiplos cliques
        
        this.isAnswering = true;
        const question = this.questions[this.currentQuestion];
        const selectedAnswer = question.answers[answerIndex];
        const isCorrect = selectedAnswer.correct;

        // Salvar resposta
        this.answers.push({
            questionId: question.id,
            selectedIndex: answerIndex,
            correct: isCorrect,
            question: question.question,
            selectedAnswer: selectedAnswer.text,
            level: this.currentLevel
        });

        // Atualizar pontuação
        if (isCorrect) {
            const points = 20 + (this.streak * 5); // Bonus por sequência
            this.score += points;
            this.streak++;
            this.showFeedback(true, selectedAnswer.explanation, points);
        } else {
            this.streak = 0;
            this.showFeedback(false, question.tip || 'Continue aprendendo!');
        }

        // Desabilitar todas as opções e mostrar resultado
        const answerOptions = document.querySelectorAll('.answer-option');
        answerOptions.forEach((option, index) => {
            option.style.pointerEvents = 'none';
            if (index === answerIndex) {
                option.classList.add(isCorrect ? 'correct' : 'incorrect');
            }
            // Mostrar resposta correta se selecionou errado
            if (!isCorrect && question.answers[index].correct) {
                option.classList.add('correct');
            }
        });

        this.updateQuizDisplay();

        // Próxima pergunta após delay
        setTimeout(() => {
            this.nextQuestion();
        }, 2500);
    }

    showFeedback(isCorrect, message, points = 0) {
        // Criar elemento de feedback temporário
        const feedback = document.createElement('div');
        feedback.className = `quiz-feedback ${isCorrect ? 'correct' : 'incorrect'}`;
        feedback.innerHTML = `
            <div class="feedback-content">
                <i class="fas fa-${isCorrect ? 'check-circle' : 'times-circle'}"></i>
                <p>${message}</p>
                ${points > 0 ? `<span class="points-earned">+${points} pontos!</span>` : ''}
            </div>
        `;

        // Adicionar CSS inline para feedback
        feedback.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: white;
            padding: 20px;
            border-radius: 12px;
            box-shadow: 0 10px 25px rgba(0,0,0,0.2);
            z-index: 1000;
            text-align: center;
            max-width: 300px;
            animation: feedbackSlide 0.3s ease-out;
        `;

        document.body.appendChild(feedback);

        // Remover após delay
        setTimeout(() => {
            feedback.remove();
        }, 2000);
    }

    nextQuestion() {
        this.currentQuestion++;
        this.isAnswering = false; // Permitir cliques novamente
        
        if (this.currentQuestion < this.questions.length) {
            this.showQuestion();
        } else {
            this.finishQuiz();
        }
    }

    finishQuiz() {
        // Avançar para tela de resultados
        if (window.gameManager) {
            window.gameManager.nextScreen();
        }
        console.log('Quiz finished. Final score:', this.score);
    }

    updateQuizDisplay() {
        document.getElementById('currentScore').textContent = this.score;
        document.getElementById('streak').textContent = this.streak;
    }

    getScore() {
        return this.score;
    }

    getAnswers() {
        return this.answers;
    }

    getCurrentLevel() {
        return this.currentLevel;
    }
}

// CSS para feedback do quiz
const feedbackStyles = `
    @keyframes feedbackSlide {
        from {
            opacity: 0;
            transform: translate(-50%, -50%) scale(0.8);
        }
        to {
            opacity: 1;
            transform: translate(-50%, -50%) scale(1);
        }
    }

    .quiz-feedback.correct .feedback-content i {
        color: var(--success);
        font-size: 2rem;
        margin-bottom: 10px;
    }

    .quiz-feedback.incorrect .feedback-content i {
        color: var(--error);
        font-size: 2rem;
        margin-bottom: 10px;
    }

    .points-earned {
        display: block;
        color: var(--accent-gold);
        font-weight: 600;
        margin-top: 5px;
    }
`;

// Adicionar estilos do feedback
const styleSheet = document.createElement('style');
styleSheet.textContent = feedbackStyles;
document.head.appendChild(styleSheet);