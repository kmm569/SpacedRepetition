const stylesheet = document.getElementById('themeStyle');
let themeStore = localStorage.getItem('theme');
stylesheet.href = `./styles/themes/${themeStore ? themeStore : "dark"}.css`

window.onload = () => {
    const openButton = document.querySelector('[data-open-modal]');
    const closeButton = document.querySelector('[data-close-modal]');
    const modal = document.querySelector('[data-modal]');
    const themeVal = document.querySelector('[data-theme]');
    document.getElementById('hm').classList.add('selected');


    openButton.addEventListener('click', () => {
        modal.showModal();
    })

    modal.addEventListener('close', () => {
        localStorage.setItem('theme', themeVal.value);
        stylesheet.href = `./styles/themes/${themeVal.value}.css`;
    })

}