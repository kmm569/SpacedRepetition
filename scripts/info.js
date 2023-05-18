const stylesheet = document.getElementById('themeStyle');
let themeStore = localStorage.getItem('theme');
stylesheet.href = `./styles/themes/${themeStore ? themeStore : "dark"}.css`

window.onload = () => {
    const openButton = document.querySelector('[data-open-modal]');
    const closeButton = document.querySelector('[data-close-modal]');
    const modal = document.querySelector('[data-modal]');
    const themeVal = document.querySelector('[data-theme]');
    const saveButton = document.getElementById('savebutton');
    const saveModal = document.querySelector('[save-modal]');
    document.getElementById('hm').classList.add('selected');


    openButton.addEventListener('click', () => {
        modal.showModal();
        themeVal.value = localStorage.getItem('theme');
    })

    modal.addEventListener('close', () => {
        localStorage.setItem('theme', themeVal.value);
        stylesheet.href = `./styles/themes/${themeVal.value}.css`;
    })

    modal.addEventListener("click", e => {
        const dialogDimensions = modal.getBoundingClientRect()
        if (
            e.clientX < dialogDimensions.left ||
            e.clientX > dialogDimensions.right ||
            e.clientY < dialogDimensions.top ||
            e.clientY > dialogDimensions.bottom
        ) {
            modal.close()
        }
    })

}