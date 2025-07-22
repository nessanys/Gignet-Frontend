const modal = {
    overlay: null,
    isOpen: false,
    
    init() {
        this.overlay = document.getElementById('modal-overlay');
        if (!this.overlay) return;

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

    open() {
        if (this.isOpen || !this.overlay) return;
        this.isOpen = true;
        document.body.style.overflow = 'hidden';
        document.body.classList.add('modal-open');
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

function openModal() {
    modal.open();
}

function handleNextClick(event) {
    window.location.href = './step-2.html';
}

document.addEventListener('DOMContentLoaded', () => {
    modal.init();
});
