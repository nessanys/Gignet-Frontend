const modal = {
    overlay: null,
    isOpen: false,
    selectedOption: 'accommodations',
    option1: null,
    option2: null,

    init() {
        this.overlay = document.getElementById('modal-overlay');
        if (!this.overlay) return;

        this.initStepOptions();

        this.overlay.addEventListener('click', (e) => {
            if (e.target === this.overlay || e.target.classList.contains('modal-close')) {
                this.close();
            }
        });

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.isOpen) {
                this.close();
            }
        });
    },

    initStepOptions() {
        this.option1 = this.overlay.querySelector('.step-option-1');
        this.option2 = this.overlay.querySelector('.step-option-2');

        if (!this.option1 || !this.option2) return;

        this.option1.addEventListener('click', () => this.selectOption('accommodations'));
        this.option2.addEventListener('click', () => this.selectOption('all-inclusive'));
    },

    selectOption(optionType) {
        if (!this.option1 || !this.option2) return;

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

    submitForm() {
        const form = this.overlay.querySelector('form');
        const inputs = form.querySelectorAll('input[required]');
        const checkbox = this.overlay.querySelector('#terms');

        for (let input of inputs) {
            if (!input.value.trim()) {
                input.focus();
                alert('Please fill in all required fields');
                return;
            }
        }

        if (!checkbox.checked) {
            alert('Please accept the terms and conditions');
            return;
        }

        alert('Form submitted successfully!');
        setTimeout(() => this.close(), 1000);
    }
};

function openModal(selectedOption = 'accommodations') {
    modal.open(selectedOption);
}

function handleNextClick(event) {
    console.log('Next clicked with option:', modal.selectedOption);
    window.location.href = './step-2.html';
}

document.addEventListener('DOMContentLoaded', () => {
    modal.init();
});