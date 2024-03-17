document.addEventListener('DOMContentLoaded', () => {
    const openModalButtons = document.querySelectorAll('[data-modal-target]');
    const closeModalButtons = document.querySelectorAll('[data-close-button]');
    const overlay = document.getElementById('overlay');

    openModalButtons.forEach(button => {
        button.addEventListener('click', () => {
            const modal = document.querySelector(button.dataset.modalTarget);
            openModal(modal);
        });
    });

    closeModalButtons.forEach(button => {
        button.addEventListener('click', () => {
            const modal = button.closest('.modal');
            closeModal(modal);
        });
    });

    function openModal(modal) {
        if (modal === null) return;
        modal.classList.add('active');
        overlay.classList.add('active');
    }

    function closeModal(modal) {
        if (modal === null) return;
        modal.classList.remove('active');
        overlay.classList.remove('active');
    }

    const btn = document.querySelector('.btn__submit'),
          fields = document.querySelectorAll('.field');

    btn.addEventListener('click', () => {
        const nameField = fields[0];
        const iconField = fields[1];
        console.log(iconField.value);
        const json = {
            name: nameField.value,
            icon: iconField.value
        };
        const request = new XMLHttpRequest();
        request.onload = (event) => {
            console.log('request finished');
        };
        request.open('POST', 'http://localhost:4000/add');
        request.setRequestHeader('Content-Type', 'application/json');
        request.send(JSON.stringify(json));
        location.reload();
    });
});