
window.modal = { 
    overlay: null,
    isOpen: false,
    selectedOption: 'accommodations',
    option1: null,
    option2: null,
    currentStepElement: null,

    init() {
        this.overlay = document.getElementById('modalOverlay'); 
        if (!this.overlay) {
            console.warn("Modal overlay not found. Modal will not function.");
            return;
        }
        this.setupEventListeners(); 
    },

    setupEventListeners() {
 
        if (this._overlayClickListener) {
            this.overlay.removeEventListener('click', this._overlayClickListener);
        }
        if (this._keydownListener) {
            document.removeEventListener('keydown', this._keydownListener);
        }
        
        this._overlayClickListener = (e) => {
            if (e.target === this.overlay || e.target.classList.contains('modal-close')) {
                window.location.href = '/crvo/pages/landing-page.html'; 
            }
        };
        this.overlay.addEventListener('click', this._overlayClickListener);

        this._keydownListener = (e) => {
            if (e.key === 'Escape' && this.isOpen) {
                window.location.href = '/crvo/pages/landing-page.html'; 
            }
        };
        document.addEventListener('keydown', this._keydownListener);
    },

    initStepOptions() {
        const modalContent = document.getElementById('modalContent');
        if (!modalContent) {
            console.warn("modalContent not found for step options initialization.");
            return;
        }
        this.option1 = modalContent.querySelector('.step-option-1');
        this.option2 = modalContent.querySelector('.step-option-2');

        if (this._option1Listener && this.option1) {
            this.option1.removeEventListener('click', this._option1Listener);
        }
        if (this._option2Listener && this.option2) {
            this.option2.removeEventListener('click', this._option2Listener);
        }

        if (this.option1 && this.option2) {
            this._option1Listener = () => {
                this.selectOption('accommodations');
                localStorage.setItem('preSelectedOption', 'accommodations');
            };
            this._option2Listener = () => {
                this.selectOption('all-inclusive');
                localStorage.setItem('preSelectedOption', 'all-inclusive');
            };

            this.option1.addEventListener('click', this._option1Listener);
            this.option2.addEventListener('click', this._option2Listener);
        }
    },

    selectOption(optionType) {
        if (!this.option1 || !this.option2) {
            this.initStepOptions();
            if (!this.option1 || !this.option2) return; 
        }

        this.selectedOption = optionType;

        this.option1.classList.remove('selected', 'unselected');
        this.option2.classList.remove('selected', 'unselected');

        if (optionType === 'accommodations') {
            this.option1.classList.add('selected');
            this.option2.classList.add('unselected');
        } else {
            this.option2.classList.add('selected');
            this.option1.classList.add('unselected');
        }
    },

    open(selectedOption = 'accommodations') {
        if (this.isOpen || !this.overlay) return;

        this.isOpen = true;
        this.selectedOption = selectedOption;
        document.body.style.overflow = 'hidden';
        document.body.classList.add('modal-open');

        this.selectOption(selectedOption);

        this.overlay.classList.add('show');
    },

    close() {
        if (!this.isOpen || !this.overlay) return;

        this.isOpen = false;
        document.body.style.overflow = '';
        document.body.classList.remove('modal-open');
        this.overlay.classList.remove('show');

        setTimeout(() => {
            const form = this.overlay.querySelector('form');
            if (form) form.reset();
        }, 300);
    },

    renderStepContent() {
        console.log("modal.renderStepContent called. Initializing step-specific elements.");
        this.initStepOptions(); 
        window.checkPreSelected();
    },

    submitForm() {
        const currentStep = window.getCurrentStep();
        const form = document.getElementById(`step${currentStep}Form`); 
        if (!form) {
            alert('No form found for the current step.');
            return;
        }

        const inputs = form.querySelectorAll('input[required]');
        let allFieldsFilled = true;
        for (let input of inputs) {
            if (!input.value.trim()) {
                input.focus();
                alert('Please fill in all required fields');
                allFieldsFilled = false;
                break;
            }
        }
        if (!allFieldsFilled) return;

        const checkbox = form.querySelector('#terms'); 
        if (checkbox && !checkbox.checked) {
            alert('Please accept the terms and conditions');
            return;
        }

        window.saveCurrentStepData(currentStep);

        alert('Form submitted successfully!');
        window.goToNextStep(); 
    }
};

document.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById('modalOverlay')) { 
        window.modal.init();
    }
});