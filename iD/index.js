document.addEventListener('DOMContentLoaded', () => {
    function handleSubmit (event) {
        event.preventDefault();

        uploadFile();
    }

    function addIcons(files, options) {
        for (let file of files) {
            const icon = document.createElement('li');
            icon.innerHTML = `
                <img src="https://maps.megafete.ru/icons/${file}" alt="${file}" style="width: 20px; height: 20px"> ${file}
            `;
            icon.onclick = () => {
                updateName(icon);
            };
            options.appendChild(icon);
        }
        return files;
    }

    function getFiles(options) {
        const request = new XMLHttpRequest();
        request.onreadystatechange = () => {
            if (request.readyState === 4) {
                const files = JSON.parse(request.response);
                data = files;
                addIcons(files, options);
            }
        };
        request.open('GET', 'https://maps.megafete.ru/info');
        request.send('');
    }

    function updateName(selectedLi) {
        wrapper.classList.remove('active');
        selectBtn.firstElementChild.innerHTML = selectedLi.innerHTML;
    }

    function uploadFile() {
        if (file.files.length) {
            const reader = new FileReader();

            reader.onload = (event) => {
                const data = event.target.result;
                sendReaquest(data);
            };

            reader.readAsBinaryString(file.files[0]);
        } else {
            sendReaquest(null);
        }
    }

    function sendReaquest(data) {
        let fileName = '';
        if (file.value !== '') {
            fileName = file.value.split(/(\\|\/)/g).pop();
        } else {
            const icon = selectBtn.firstElementChild.innerHTML.trim().split(' ');
            fileName = icon[icon.length - 1];
        }
        const nameField = name.value;

        const json = {
            name: nameField,
            fileName: fileName,
            data: data
        };

        const request = new XMLHttpRequest();
        request.onload = (event) => {
            console.log('request finished');
        };
        request.open('POST', 'https://maps.megafete.ru/add');
        request.setRequestHeader('Content-Type', 'application/json');
        request.send(JSON.stringify(json));
    }

    const openModalButtons = document.querySelectorAll('[data-modal-target]');
    const closeModalButtons = document.querySelectorAll('[data-close-button]');
    const overlay = document.getElementById('overlay');

    const btn = document.querySelector('.btn__submit'),
          name = document.getElementById('name'),
          file = document.getElementById('file'),
          form = document.querySelector('.form');

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

    btn.addEventListener('click', handleSubmit);

    const wrapper = document.querySelector('.icon__select');
    const selectBtn = document.querySelector('.select__btn');
    const options = document.querySelector('.options');
    const searchInput = document.querySelector('.search input');

    var data = undefined;
    getFiles(options);

    searchInput.addEventListener('keyup', () => {
        let arr = [];
        let searchVal = searchInput.value.toLowerCase();
        arr = data.filter(data => {
            return data.toLowerCase().startsWith(searchVal);
        }).map(data => `<img src="https://maps.megafete.ru/icons/${data}" alt="${data}" style="width: 20px; height: 20px"> ${data}`);
        options.replaceChildren();
        arr.forEach(element => {
            const obj = document.createElement('li');
            obj.innerHTML = element;
            obj.onclick = () => {
                updateName(obj);
            };
            options.appendChild(obj);
        });
    });

    selectBtn.addEventListener('click', () => {
        wrapper.classList.toggle('active');
    });
});