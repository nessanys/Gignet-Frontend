function goToNextStep() {
    const currentStep = getCurrentStep();

    if (currentStep === 1) {
        const form = document.getElementById('step1Form');
        const firstName = form.elements['firstName'] ? form.elements['firstName'].value.trim() : '';
        const lastName = form.elements['lastName'] ? form.elements['lastName'].value.trim() : '';
        const email = form.elements['email'] ? form.elements['email'].value.trim() : '';
        const phone = form.elements['phone'] ? form.elements['phone'].value.trim() : '';

        if (!firstName || !lastName || !email || !phone) {
            showToast('Fields cannot be left empty.');
            return;
        }
        if (!/^[A-Za-z]{2,}$/.test(firstName)) {
            showToast('First name must contain only letters (no spaces, numbers or special characters).');
            return;
        }
        if (!/^[A-Za-z]{2,}$/.test(lastName)) {
            showToast('Last name must contain only letters (no spaces, numbers or special characters).');
            return;
        }
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            showToast('Enter a valid email address.');
            return;
        }
        if (!/^\d{7,}$/.test(phone)) {
            showToast('Enter a valid phone number (numbers only, at least 7 digits).');
            return;
        }
        if (!document.getElementById('termsCheckbox').checked) {
            showToast('You must accept the terms and conditions.');
            return;
        }
    }

    if (currentStep === 3) {
        const selectedCountryInput = document.getElementById('selectedCountry');
        const quintanaRooQuestionDiv = document.getElementById('quintanaRooQuestion');
        const quintanaRooRadios = document.querySelectorAll('input[name="quintanaRooResident"]');
        
        function showCountryError(message) {
        if (typeof showToast === 'function') {
            showToast(message);
        }
        }

        if (!selectedCountryInput || !selectedCountryInput.value) {
            showCountryError('Please select your country.');
            return;
        }

        function showCountryError(message) {
        if (typeof showToast === 'function') {
            showToast(message);
        }
    }

        if (selectedCountryInput.value === 'MX') {
            let quintanaRooAnswered = false;
            quintanaRooRadios.forEach(radio => {
                if (radio.checked) {
                    quintanaRooAnswered = true;
                }
            });

            if (!quintanaRooAnswered) {
                showCountryError('Please answer the Quintana Roo resident question.');
                return;
            }
        }
    }
    saveCurrentStepData(currentStep);

    const step3Data = getStepData(3); 

    if (currentStep === 3 && step3Data && step3Data.quintanaRooResident === 'yes') {
        window.navigateTo('thank-you.html'); 
        return; 
    }

    const nextStep = currentStep + 1;

    if (nextStep <= 4) {
        if (typeof window.loadStep === 'function') { 
            window.loadStep(nextStep);
        } else {
            console.error("loadStep function not found in window object.");
            window.location.href = `./modal.html?step=${nextStep}`; 
        }
    } else {
        window.navigateTo('confirmation-page.html');
    }
}

function goToConfirmationPage() {
    window.navigateTo('confirmation-page.html');
}

function goToStep(targetStep) {
    const currentStep = getCurrentStep();
    saveCurrentStepData(currentStep);

    if (typeof window.loadStep === 'function') {
        window.loadStep(targetStep);
    } else {
        console.error("loadStep function not found in window object for goToStep.");
        window.location.href = `./modal.html?step=${targetStep}`;
    }
}

function getCurrentStep() {
    const urlParams = new URLSearchParams(window.location.search);
    const stepFromUrl = urlParams.get('step');
    if (stepFromUrl) {
        return parseInt(stepFromUrl);
    }

    return 1; 
}

function saveCurrentStepData(currentStep) {
    const form = document.getElementById(`step${currentStep}Form`); 
    if (!form) {
        console.warn(`No se encontró formulario para step ${currentStep}`);
        return;
    }
    
    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());

    if (currentStep === 1 && window.modal) {
        data.selectedOption = window.modal.selectedOption;
        data.optionText = window.modal.selectedOption === 'accommodations' ? 'Accommodations only' : 'All inclusive';
    }

    if (currentStep === 3) {
        const quintanaRooRadio = document.querySelector('input[name="quintanaRooResident"]:checked');
        if (quintanaRooRadio) {
            data.quintanaRooResident = quintanaRooRadio.value;
        }
    }

    localStorage.setItem(`step${currentStep}Data`, JSON.stringify(data));

    const allData = getAllStepData();
    allData[`step${currentStep}`] = data;
    localStorage.setItem('allStepData', JSON.stringify(allData));
    
    console.log(`Datos guardados para step ${currentStep}:`, data);
}

function getAllStepData() {
    const allData = localStorage.getItem('allStepData');
    return allData ? JSON.parse(allData) : {};
}

function getStepData(stepNumber) {
    const stepData = localStorage.getItem(`step${stepNumber}Data`);
    return stepData ? JSON.parse(stepData) : null;
}

function clearAllStepData() {
    for (let i = 1; i <= 10; i++) { 
        localStorage.removeItem(`step${i}Data`);
    }
    localStorage.removeItem('allStepData');
}

function goToPreviousStep() {
    const currentStep = getCurrentStep();
    const previousStep = currentStep - 1;
    
    if (previousStep >= 1) {
        if (typeof window.loadStep === 'function') {
            window.loadStep(previousStep);
        } else {
            console.error("loadStep function not found in window object for goToPreviousStep.");
            window.location.href = `./modal.html?step=${previousStep}`;
        }
    } else {
        window.location.href = 'landing-page.html'; 
    }
}

window.goToNextStep = goToNextStep;
window.goToStep = goToStep;
window.getCurrentStep = getCurrentStep;
window.saveCurrentStepData = saveCurrentStepData;
window.getAllStepData = getAllStepData;
window.getStepData = getStepData;
window.clearAllStepData = clearAllStepData;
window.goToPreviousStep = goToPreviousStep;