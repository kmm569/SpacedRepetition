async function buildMonth(m, stDays) {
    location.href = '../print-page.html';

    console.log(document);

    const testDate = document.getElementById('testDate');
    const monthContainer = document.getElementById('months');

    console.log(monthContainer);

    let month = document.createElement('div');
    month.classList.add('indivMonth');
    let header = document.createElement('h3');
    header.appendChild(document.createTextNode(m));
    let studyList = document.createElement('ul');
    stDays.forEach(day => {
        let line = document.createElement('li');
        line.classList.add('stDay');
        line.appendChild(document.createTextNode(day));
        studyList.appendChild(line);
    });
    header.appendChild(studyList);
    month.appendChild(header);
    monthContainer.innerHTML = month;

    return true;
}

export { buildMonth };