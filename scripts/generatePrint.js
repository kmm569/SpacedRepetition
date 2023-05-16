const stylesheet = document.getElementById('themeStyle');
let themeStore = localStorage.getItem('theme');
stylesheet.href = `./styles/themes/${themeStore ? themeStore : "dark"}.css`

const { jsPDF } = window.jspdf;

const mArray = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
];

window.onload = () => {
    const monthContainer = document.getElementById('months');
    const testContainer = document.getElementById('testDate');
    const genContainer = document.getElementById('genDate');
    const backButton = document.getElementById('pageBack');

    let now = new Date(Date.now());
    let pageDate = `${now.getMonth()}-${now.getDate()}-${now.getFullYear()}`

    setPage(monthContainer, testContainer, genContainer);

}

function setPage(monthContainer, testContainer, genContainer) {
    let now = new Date(Date.now());
    let data = sessionStorage.getItem('print');
    let months = data.split('()');
    let testDate = new Date(`${sessionStorage.getItem('test-day')}T00:00`);
    testContainer.innerHTML = `<strong>Test on: ${testDate.getMonth()}/${testDate.getDate()}/${testDate.getFullYear()}</strong>`
    genContainer.innerHTML = `Generated on: ${now.getMonth()}/${now.getDate()}/${now.getFullYear()} ${Math.abs(12 - now.getHours())}:${now.getMinutes()}${now.getHours() > 12 ? 'PM' : 'AM'}`

    for (let m of months) {
        let monthNum = m.split('>')[0].split('-')[0];
        let daysArr = m.split('>')[1];
        let daysEach = daysArr.split('|');
        daysEach = daysEach.sort((a, b) => new Date(`${a.split(',')[0]}`).getDate() - new Date(`${b.split(',')[0]}`).getDate())

        let month = document.createElement('div');
        month.classList.add('indivMonth');
        let header = document.createElement('h3');
        header.classList.add('monthName');
        header.appendChild(document.createTextNode(mArray[monthNum]));
        let studyList = document.createElement('ul');

        for (let date of daysEach) {
            let line = document.createElement('li');
            let dateVal = new Date(`${date.split(',')[0]}`);
            dateVal = `${dateVal.getMonth()+1}/${dateVal.getDate()}/${dateVal.getFullYear()}`
            let topicVal = date.split(',')[1];
            line.appendChild(document.createTextNode(`${dateVal} - ${topicVal}`));
            studyList.appendChild(line);
        };
        month.appendChild(header);
        month.appendChild(studyList);
        monthContainer.appendChild(month);
    }

    let pageDate = `${now.getMonth()}-${now.getDate()}-${now.getFullYear()}`
    savePage(pageDate);
}

function savePage(date) {
    var opt = {
        filename: `${date}-StudySchedule`,
        image: { type: 'png' },
        pagebreak: 'avoid-all',
        jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
    };

    html2pdf(document.getElementById('printPage'), opt).then((img) => {
            img = img.toDataURL("image/png");
            var doc = new jsPDF();
            doc.addImage(img, 'PNG');
            //doc.save();
            window.open(doc.output('bloburl'), '_blank');
        })
        /*
        html2pdf(document.getElementById('printPage')).then((img) => {
            img = img.toDataURL("image/png");
            var doc = new jsPDF();
            doc.addImage(img, 'PNG');
            //doc.save();
            window.open(doc.output('bloburl'), '_blank');
        });
        */
}