const testDate = document.getElementById("dot");
const subjects = document.getElementById("numSub");
const subInfo = document.getElementById("subject-section");
const subTable = document.getElementById("subject-table");
const calendar = document.getElementById("calendar");
const studyAssignment = document.getElementById("study-dates");
const calLinks = document.getElementById("calendar-links");
const submit = document.getElementById("submit");
const back = document.getElementById("goback");
const mainForm = document.getElementById("sbj-form");
const submitDiv = document.querySelector(".submittedTemp");
const themeValue = document.getElementById('themeInput');
const themes = document.getElementsByClassName('themeSelect');
const stylesheet = document.getElementById('themeStyle');
const blackout = document.getElementById('blackout');
const themePopup = document.getElementById('themepopup');
const themeButton = document.getElementById('themebutton');
const yearButton = document.getElementById('carryYear');

let currentRows = 0;
let sameYear;
let chosen = -1;

themeValue.addEventListener('input', () => {
    stylesheet.href = `./styles/themes/${themeValue.value}.css`;
});

blackout.addEventListener('click', () => {
    themePopup.style.display = 'none';
    blackout.style.display = "none";
});

themeButton.addEventListener('click', () => {
    themePopup.style.display = 'flex';
    blackout.style.display = 'block';

});

yearButton.addEventListener('click', () => {
    chosen *= -1;

    if (chosen == 1) {
        const rowCount = subTable.rows.length;
        let tableDivs = subTable.getElementsByTagName(`div`);

        for (var row = 1; row < rowCount; row++) {
            tableDivs.item(row - 1).getElementsByTagName('input').item(2).value = new Date(`${testDate.value}T00:00`).getFullYear();
        }
    }
})

subjects.addEventListener("change", () => {
    subInfo.style.display = subjects.value > 0 ? "block" : "none";
    submit.style.display = subjects.value > 0 ? "inline-block" : "none";
    updateRows(subjects.value);
});

submit.addEventListener("click", () => {
    if (calcRep()) {
        document.getElementById("errormsg").innerHTML = "";
        submitDiv.style.display = "block";
        back.style.display = 'inline-block';
    }
});

back.addEventListener("click", () => {
    submitDiv.style.display = "none";
    testDate.value = "";
    subjects.value = 0;
    subInfo.style.display = "none";
    updateRows(0);
});



const updateRows = (newRowCount) => {
    if (newRowCount > currentRows) {
        for (let i = 0; i < newRowCount - currentRows; i++) {
            addRow();
        }
    } else {
        for (let i = 0; i < currentRows - newRowCount; i++) {
            deleteRow();
        }
    }
    currentRows = newRowCount;
};

function addRow() {
    const rowCount = subTable.rows.length;
    const row = subTable.insertRow(rowCount);
    let yrVal;

    if (chosen == 1 && testDate.value) {
        yrVal = `value="${new Date(`${testDate.value}T00:00`).getFullYear()}"`
    } else {
        yrVal = '';
    }

    const cells = [
        `<input class="inputBox subNames" type="string" id="sub${rowCount}name">`,
        `<div class="newDateBoxes"><input class="inputBox subMonthVal indvDate" min="0" max="12" type="number" id="sub${rowCount}Month"><input class="inputBox subDayVal indvDate" min="0" max="31" type="number" id="sub${rowCount}Day"><input class="inputBox subYearVal indvDate" min="0" max="2050" type="number" ${yrVal} id="sub${rowCount}Year"><input class="calPicker" type="date" id="sub${rowCount}Picker"></div>`,
        `<input class="subDiff" type="range" min="1" max="5" value="1" id="sub${rowCount}difficulty">`,
    ];

    cells.forEach((cellContent, i) => {
        const newCell = row.insertCell(i);
        newCell.innerHTML = cellContent;
    });
    document.getElementById(`sub${rowCount}Picker`).addEventListener('change', () => {
        let dateVals = document.getElementById(`sub${rowCount}Picker`).value;
        dateVals = dateVals.split('-');
        document.getElementById(`sub${rowCount}Month`).value = dateVals[1];
        document.getElementById(`sub${rowCount}Day`).value = dateVals[2];
        document.getElementById(`sub${rowCount}Year`).value = dateVals[0];
    })
}

function deleteRow() {
    try {
        const rowCount = subTable.rows.length;
        subTable.deleteRow(rowCount - 1);
    } catch (e) {
        alert(e);
    }
}

function getMonthYear(dateValue) {
    const dateObj = new Date(dateValue);
    return `${dateObj.getMonth()}-${dateObj.getFullYear()}`;
}

function calcRep() {
    const mult = [2.175, 2, 1.825, 1.625, 1.45];
    const months = [
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
    const topicNames = document.getElementsByClassName("subNames");
    //const topicDates = document.getElementsByClassName("subDates");

    let topicDates = [];
    const topicMonths = document.getElementsByClassName('subMonthVal');
    const topicDays = document.getElementsByClassName('subDayVal');
    const topicYears = document.getElementsByClassName('subYearVal');


    for (var k = 0; k < topicMonths.length;k++) {
        if (topicYears[k].value == "" || topicMonths[k].value == '' || topicDays[k].value == '') {
            document.getElementById("errormsg").innerHTML = "Please enter all topic dates before continuing!";
            return false;
        } else {
            topicDates.push(`${topicYears[k].value}-${topicMonths[k].value}-${topicDays[k].value}`);
        }
    };

    const topicDiff = document.getElementsByClassName("subDiff");

    let monYr = [];
    let studyDates = [];

    monYr.push(getMonthYear(new Date(`${testDate.value}T00:00`).valueOf()));

    for (let n in topicNames) {
        if (!topicNames[n].value) {
            topicNames[n].value = Number(n) + 1;
        }
    }

    let i = 0;
    for (let d of topicDates) {
        const dateValue = new Date(d).valueOf();
        const testDateValue = new Date(`${testDate.value}T00:00`).valueOf();

        if (dateValue > testDateValue) {
            document.getElementById("errormsg").innerHTML = "All topic dates must be before the test date!";
            return false;
        }

        monYr.push(getMonthYear(dateValue + 86400000));

        for (let p = 1; p <= 10; p++) {
            const add = Math.floor(Math.pow(mult[topicDiff[i].value - 1], p));
            const nextDate = new Date(dateValue + add * 86400000);
            if (nextDate < testDateValue) {
                studyDates.push([nextDate, topicNames[i].value]);
                monYr.push(getMonthYear(nextDate + 86400000));
            } else {
                break;
            }
        }
        i++;
    }

    calLinks.innerHTML = "";
    studyAssignment.innerHTML = "";
    calendar.innerHTML = "";

    const calendarDates = studyDates
        .map(([date, name]) => new Date(date).toJSON().slice(0, 10) + "|" + name)
        .filter((item, i, ar) => ar.indexOf(item) === i);

    const dates = calendarDates.map(a => {
        const [startDate, name] = a.split("|");
        return {
            name: "Study " + name,
            description: "Test on " + testDate.value,
            startDate
        };
    });

    calLinks.innerHTML = '<add-to-calendar-button id="callinks" name="Event Series" dates=\'' +
        JSON.stringify(dates) +
        "' options=\"'Apple','Google','Outlook.com'\" buttonsList hideTextLabelButton buttonStyle=\"round\" lightMode=\"bodyScheme\"></add-to-calendar-button>";

    let unique = [...new Set(monYr)].sort((a, b) => a.split("-")[0] - b.split("-")[0]);

    for (let k of unique) {
        const monthDiv = document.createElement("div");
        monthDiv.classList.add("perMonth");
        const studyDays = [];
        const stDays = studyDates.filter(a => getMonthYear(a[0]) == k);
        const uniqueDays = [...new Set(stDays.map(d => new Date(d[0]).getDate()))].sort((a, b) => a - b);

        for (let o of uniqueDays) {
            const todays = stDays
                .filter(item => new Date(item[0]).getDate() == o)
                .map((v) => v[1]);
            const monthYr = k.split("-");
            const todaysStr = todays.join(", ");
            const dateString = `${Number(monthYr[0])+1}/${o}/${monthYr[1]}: ${todaysStr}`;
            studyDays.push(dateString);
        }
        const monthTitle = document.createElement("span");
        const monthTxt = document.createTextNode(months[k.split("-")[0]]);
        monthTitle.appendChild(monthTxt);
        monthTitle.classList.add("monTitle");

        const studyDaysStr = studyDays.join("<br>");
        const datesContainer = document.createElement("p");
        datesContainer.innerHTML = studyDaysStr;
        datesContainer.classList.add("dateList");

        monthDiv.appendChild(monthTitle);
        monthDiv.appendChild(datesContainer);

        studyAssignment.appendChild(monthDiv);
        buildCalendar(k, stDays);
    }

    return true;
}

function buildCalendar(monYr, stDays) {
    const m = [
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

    const testDateValue = new Date(`${testDate.value}T00:00`);
    const testMonYr = `${testDateValue.getMonth()}-${testDateValue.getFullYear()}`;
    const testDay = testMonYr === monYr ? testDateValue.getDate() : false;

    const mapped = stDays.map((a) => new Date(a[0]).getDate());
    const [numMon, numYr] = monYr.split("-");

    if (!m[numMon]) {
        return;
    }

    const cal = document.createElement("div");
    cal.classList.add("single-cal");

    const month = document.createElement("div");
    month.classList.add("month");
    month.innerHTML = `
      <ul>
        <li id="month-name">
          ${m[numMon]}
          <br>
          <span style="font-size:18px" id="year">${numYr}</span>
        </li>
      </ul>`;

    const dayNames = document.createElement("ul");
    dayNames.classList.add("weekdays");
    dayNames.innerHTML = "<li>Su</li><li>Mo</li><li>Tu</li><li>We</li><li>Th</li><li>Fr</li><li>Sa</li>";

    const days = document.createElement("ul");
    days.classList.add("days");

    const totalDays = new Date(numYr, Number(numMon) + 1, 0).getDate();
    const firstDay = new Date(numYr, numMon, 1).getDay();

    for (let i = 0; i < firstDay; i++) {
        days.insertAdjacentHTML("beforeend", "<li></li>");
    }

    for (let k = 0; k < totalDays; k++) {
        const studyTopic = mapped
            .map((v, i) => (v === k + 1 ? stDays[i][1] : null))
            .filter((h) => h !== null);
        //const studyTopicString = studyTopic.length > 0 ? `<span class="study"><sup title="Study Topics: ${studyTopic.join(", ")}">${studyTopic.length}</sup></span>` : "";
        const studyClass = studyTopic.length > 0 ? ` class='study'` : "";
        const activeClass = testDay !== false && testDay === (k+1) ? " class='active'" : "";
        const sup = studyTopic.length > 0 ? `<sup title="Study Topics: ${studyTopic.join(', ')}">${studyTopic.length}</sup>` : "";
        days.insertAdjacentHTML("beforeend", `<li><span${studyClass}><span${activeClass}>${k+1}</span>${sup}</span></li>`);
    }

    const left = firstDay + totalDays;
    if (left < 42) {
        for (let l = 0; l < 42 - left; l++) {
            days.insertAdjacentHTML("beforeend", '<li style="color:#EEF4F4">0</li>');
        }
    }

    cal.append(month, dayNames, days);
    calendar.appendChild(cal);
}
