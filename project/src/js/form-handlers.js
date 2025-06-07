// Manipuladores de formulários e validações
class FormHandlers {
    constructor() {
        this.init();
    }

    init() {
        this.setupFormValidation();
        this.setupPhoneFormatting();
        this.setupEmailValidation();
        this.setupAutoComplete();
        console.log('Form handlers initialized');
    }

    setupFormValidation() {
        // Validação em tempo real para campos obrigatórios
        document.addEventListener('input', (e) => {
            this.validateField(e.target);
        });

        // Prevenir envio de formulário com Enter
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' && e.target.matches('input')) {
                e.preventDefault();
                this.handleEnterKey(e.target);
            }
        });
    }

    validateField(field) {
        const fieldName = field.id;
        const value = field.value.trim();
        let isValid = true;
        let errorMessage = '';

        switch (fieldName) {
            case 'userName':
            case 'checkoutName':
                isValid = value.length >= 2;
                errorMessage = 'Nome deve ter pelo menos 2 caracteres';
                break;

            case 'userEmail':
            case 'checkoutEmail':
                isValid = this.isValidEmail(value);
                errorMessage = 'Digite um e-mail válido';
                break;

            case 'checkoutPhone':
                isValid = this.isValidPhone(value);
                errorMessage = 'Digite um telefone válido';
                break;
        }

        this.showFieldValidation(field, isValid, errorMessage);
        return isValid;
    }

    showFieldValidation(field, isValid, errorMessage) {
        // Remover mensagem de erro anterior
        const existingError = field.parentNode.querySelector('.field-error');
        if (existingError) {
            existingError.remove();
        }

        // Atualizar visual do campo
        field.classList.remove('valid', 'invalid');
        
        if (field.value.trim()) {
            field.classList.add(isValid ? 'valid' : 'invalid');
            
            // Mostrar mensagem de erro se inválido
            if (!isValid) {
                const errorDiv = document.createElement('div');
                errorDiv.className = 'field-error';
                errorDiv.textContent = errorMessage;
                errorDiv.style.cssText = `
                    color: var(--error);
                    font-size: 0.75rem;
                    margin-top: 4px;
                `;
                field.parentNode.appendChild(errorDiv);
            }
        }
    }

    setupPhoneFormatting() {
        document.addEventListener('input', (e) => {
            if (e.target.id === 'checkoutPhone') {
                this.formatPhone(e.target);
            }
        });
    }

    formatPhone(input) {
        let value = input.value.replace(/\D/g, '');
        
        if (value.length <= 11) {
            if (value.length <= 2) {
                value = value.replace(/(\d{0,2})/, '($1');
            } else if (value.length <= 7) {
                value = value.replace(/(\d{2})(\d{0,5})/, '($1) $2');
            } else {
                value = value.replace(/(\d{2})(\d{5})(\d{0,4})/, '($1) $2-$3');
            }
        }
        
        input.value = value;
    }

    setupEmailValidation() {
        document.addEventListener('blur', (e) => {
            if (e.target.matches('input[type="email"]')) {
                this.checkEmailDomain(e.target);
            }
        });
    }

    checkEmailDomain(emailField) {
        const email = emailField.value.trim();
        if (!email) return;

        const commonDomains = [
            'gmail.com', 'outlook.com', 'hotmail.com', 'yahoo.com',
            'uol.com.br', 'bol.com.br', 'terra.com.br'
        ];

        const domain = email.split('@')[1];
        if (domain && !commonDomains.includes(domain.toLowerCase())) {
            this.suggestEmailCorrection(emailField, email);
        }
    }

    suggestEmailCorrection(field, email) {
        const domain = email.split('@')[1];
        const suggestions = {
            'gmial.com': 'gmail.com',
            'gmai.com': 'gmail.com',
            'gmail.co': 'gmail.com',
            'outlok.com': 'outlook.com',
            'hotmial.com': 'hotmail.com',
            'yahooo.com': 'yahoo.com'
        };

        const suggestion = suggestions[domain.toLowerCase()];
        if (suggestion) {
            const correctedEmail = email.replace(domain, suggestion);
            
            const suggestionDiv = document.createElement('div');
            suggestionDiv.className = 'email-suggestion';
            suggestionDiv.innerHTML = `
                <p>Você quis dizer: <strong>${correctedEmail}</strong>?</p>
                <button type="button" onclick="this.parentNode.parentNode.querySelector('input').value='${correctedEmail}'; this.parentNode.remove();">
                    Corrigir
                </button>
            `;
            suggestionDiv.style.cssText = `
                background: var(--gray-50);
                border: 1px solid var(--gray-200);
                padding: 8px;
                border-radius: 6px;
                margin-top: 4px;
                font-size: 0.875rem;
            `;

            field.parentNode.appendChild(suggestionDiv);
        }
    }

    setupAutoComplete() {
        // Auto-completar campos baseado em dados já inseridos
        document.addEventListener('focus', (e) => {
            if (e.target.matches('input')) {
                this.loadAutoCompleteData(e.target);
            }
        });
    }

    loadAutoCompleteData(field) {
        // Carregar dados do localStorage se disponíveis
        const savedData = localStorage.getItem('funnelUserData');
        if (savedData) {
            const data = JSON.parse(savedData);
            
            switch (field.id) {
                case 'userName':
                case 'checkoutName':
                    if (data.name && !field.value) {
                        field.value = data.name;
                    }
                    break;
                case 'userEmail':
                case 'checkoutEmail':
                    if (data.email && !field.value) {
                        field.value = data.email;
                    }
                    break;
            }
        }
    }

    handleEnterKey(field) {
        // Comportamento especial para Enter em campos específicos
        switch (field.id) {
            case 'userName':
                document.getElementById('userEmail').focus();
                break;
            case 'userEmail':
                // Verificar se formulário está válido para continuar
                if (gameManager.validateProfileForm()) {
                    gameManager.nextScreen();
                }
                break;
            case 'checkoutName':
                document.getElementById('checkoutEmail').focus();
                break;
            case 'checkoutEmail':
                document.getElementById('checkoutPhone').focus();
                break;
            case 'checkoutPhone':
                if (this.validateField(field)) {
                    gameManager.processOrder();
                }
                break;
        }
    }

    // Salvar dados do formulário para persistência
    saveFormData(data) {
        try {
            localStorage.setItem('funnelUserData', JSON.stringify(data));
        } catch (e) {
            console.warn('Could not save form data:', e);
        }
    }

    // Carregar dados salvos
    loadFormData() {
        try {
            const savedData = localStorage.getItem('funnelUserData');
            return savedData ? JSON.parse(savedData) : null;
        } catch (e) {
            console.warn('Could not load form data:', e);
            return null;
        }
    }

    // Validações auxiliares
    isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    isValidPhone(phone) {
        const cleanPhone = phone.replace(/\D/g, '');
        return cleanPhone.length >= 10 && cleanPhone.length <= 11;
    }

    // Prevenir spam/bots
    setupBotProtection() {
        let formInteractions = 0;
        let startTime = Date.now();

        document.addEventListener('input', () => {
            formInteractions++;
        });

        // Verificar se preenchimento foi muito rápido
        this.validateHumanBehavior = () => {
            const timeSpent = Date.now() - startTime;
            const minTimeExpected = 10000; // 10 segundos mínimo
            
            return timeSpent > minTimeExpected && formInteractions > 3;
        };
    }

    // Analytics de formulário
    trackFormInteraction(action, field) {
        const eventData = {
            action: action,
            field: field,
            timestamp: Date.now(),
            screen: gameManager ? gameManager.screens[gameManager.currentScreen] : 'unknown'
        };

        // Enviar para analytics (implementar conforme necessário)
        console.log('Form interaction:', eventData);
        
        // Exemplo de envio para Google Analytics
        if (typeof gtag !== 'undefined') {
            gtag('event', 'form_interaction', {
                event_category: 'Funnel',
                event_label: `${action}_${field}`,
                custom_parameter: eventData.screen
            });
        }
    }
}

// Adicionar estilos para validação de campos
const formStyles = `
    input.valid {
        border-color: var(--success) !important;
        box-shadow: 0 0 0 3px rgba(34, 197, 94, 0.1) !important;
    }

    input.invalid {
        border-color: var(--error) !important;
        box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.1) !important;
    }

    .field-error {
        animation: errorSlide 0.3s ease-out;
    }

    @keyframes errorSlide {
        from {
            opacity: 0;
            transform: translateY(-5px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }

    .email-suggestion button {
        background: var(--primary-blue);
        color: white;
        border: none;
        padding: 4px 8px;
        border-radius: 4px;
        font-size: 0.75rem;
        cursor: pointer;
        margin-left: 8px;
    }

    .email-suggestion button:hover {
        background: var(--primary-green);
    }
`;

// Adicionar estilos dos formulários
const formStyleSheet = document.createElement('style');
formStyleSheet.textContent = formStyles;
document.head.appendChild(formStyleSheet);