function goToNextStep() {
    const currentStep = getCurrentStep();

    if (currentStep === 3) {
        const selectedCountryInput = document.getElementById('selectedCountry');
        const quintanaRooRadios = document.querySelectorAll('input[name="quintanaRooResident"]');
        
        if (!selectedCountryInput || !selectedCountryInput.value) {
            alert('Please select your country.');
            return; 
        }

        if (selectedCountryInput.value === 'MX') {
            let quintanaRooAnswered = false;
            quintanaRooRadios.forEach(radio => {
                if (radio.checked) {
                    quintanaRooAnswered = true;
                }
            });

            if (!quintanaRooAnswered) {
                alert('Please answer the Quintana Roo resident question.');
                return;
            }
        }
    }
    saveCurrentStepData(currentStep);

    const step3Data = getStepData(3); 

    if (currentStep === 3 && step3Data && step3Data.quintanaRooResident === 'no') {
        window.navigateTo('thank-you.html');
        return; 
    }

    const nextStep = currentStep + 1;
    window.navigateTo(`./modal.html?step=${nextStep}`);
}

function goToConfirmationPage() {
    window.navigateTo('confirmation-page.html');
}

function goToStep(targetStep) {
    const currentStep = getCurrentStep();

    saveCurrentStepData(currentStep);
    window.navigateTo(`./modal.html?step=${targetStep}`);
}

function getCurrentStep() {
    const urlParams = new URLSearchParams(window.location.search);
    const stepFromUrl = urlParams.get('step');
    if (stepFromUrl) {
        return parseInt(stepFromUrl);
    }
    
    const forms = document.querySelectorAll('form[id*="step"]');
    for (let form of forms) {
        const match = form.id.match(/step(\d+)Form/);
        if (match) {
            return parseInt(match[1]);
        }
    }

    const stepText = document.querySelector('.step-container-left-text p');
    if (stepText) {
        const text = stepText.textContent.toLowerCase();
        if (text.includes('contact') || text.includes('information')) {
            return 1;
        } else if (text.includes('travel') || text.includes('partner')) {
            return 2;
        } else if (text.includes('step 3') || text.includes('final')) {
            return 3;
        }
    }
    
    const progressLines = document.querySelectorAll('.progress-line-selected, .progress-line-active');
    if (progressLines.length > 0) {
        return progressLines.length;
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

    switch(currentStep) {
        case 1:
            if (typeof selectedOption !== 'undefined' && selectedOption) {
                data.selectedOption = selectedOption;
                data.optionText = selectedOption === 1 ? 'Accommodations only' : 'All inclusive';
            }
            break;
        case 2:
            if (typeof selectedTravelOption !== 'undefined' && selectedTravelOption) {
                data.selectedTravelOption = selectedTravelOption;
            }
            break;
        case 3:
            if (typeof selectedCountryOption !== 'undefined' && selectedCountryOption) {
                data.selectedCountryOption = selectedCountryOption;
            }

            const quintanaRooRadio = document.querySelector('input[name="quintanaRooResident"]:checked');
            if (quintanaRooRadio) {
                data.quintanaRooResident = quintanaRooRadio.value;
            }
            break;
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
        window.navigateTo(`./modal.html?step=${previousStep}`);
    } else {
        window.navigateTo('info.html');
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