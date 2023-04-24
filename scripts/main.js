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

let currentRows = 0;

subjects.addEventListener("change", () => {
    subInfo.style.display = subjects.value > 0 ? "block" : "none";
    submit.style.display = subjects.value > 0 ? "inline-block" : "none";
    updateRows(subjects.value);
});

submit.addEventListener("click", () => {
    if (calcRep()) {
        document.getElementById("errormsg").innerHTML = "";
        submitDiv.style.display = "block";
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

    const cells = [
        `<input class="inputBox subNames" type="string" id="sub${rowCount}name">`,
        `<input class="inputBox subDates" type="date" id="sub${rowCount}learned">`,
        `<input class="subDiff" type="range" min="1" max="5" value="1" id="sub${rowCount}difficulty">`,
    ];

    cells.forEach((cellContent, i) => {
        const newCell = row.insertCell(i);
        newCell.innerHTML = cellContent;
    });
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
    const topicDates = document.getElementsByClassName("subDates");
    const topicDiff = document.getElementsByClassName("subDiff");

    let monYr = [];
    let studyDates = [];

    monYr.push(getMonthYear(new Date(testDate.value).valueOf() + 86400000));

    for (let n in topicNames) {
        if (!topicNames[n].value) {
            topicNames[n].value = Number(n) + 1;
        }
    }

    let i = 0;
    for (let d of topicDates) {
        const dateValue = new Date(d.value).valueOf();
        const testDateValue = new Date(testDate.value).valueOf();

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
            const dateString = `${monthYr[0]}/${o}/${monthYr[1]}: ${todaysStr}`;
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

    const testDateValue = new Date(testDate.value);
    const testMonYr = `${testDateValue.getMonth()}-${testDateValue.getFullYear()}`;
    const testDay = testMonYr === monYr ? testDateValue.getDate() : false;

    const mapped = stDays.map((a) => new Date(a[0]).getDate());

    const cal = document.createElement("div");
    cal.classList.add("single-cal");

    const [numMon, numYr] = monYr.split("-");

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
        const activeClass = testDay !== false && testDay === k ? " class='active'" : "";
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