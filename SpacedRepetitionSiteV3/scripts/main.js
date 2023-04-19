let testDate = document.getElementById("dot");
let subjects = document.getElementById("numSub");
let subInfo = document.getElementById("subject-section");
let subTable = document.getElementById("subject-table");
let calendar = document.getElementById("calendar");
let studyAssignment = document.getElementById("study-dates");
let calLinks = document.getElementById("calendar-links");
let submit = document.getElementById("submit");
let back = document.getElementById("goback");
let mainForm = document.getElementById("sbj-form");
let submitDiv = document.getElementsByClassName("submittedTemp")[0];
let saves = document.getElementsByClassName('saveButton');
let removes = document.getElementsByClassName('removeSave');

//import { setCookie, getCookie, checkCookie } from "./save";

var subs;
var currentRows = 0;

subjects.addEventListener("change", function() {
    if (subjects.value > 0) {
        subInfo.style.display = "block";
        //subjectTable(subjects.value);
        if (subjects.value > currentRows) {
            for (var i = 0; i < subjects.value - currentRows; i++) {
                addRow();
            }
            currentRows = subjects.value;
        } else {
            for (var i = 0; i < currentRows - subjects.value; i++) {
                deleteRow();
            }
            currentRows = subjects.value;
        }
    } else {
        subInfo.style.display = "none";
        for (var i = 0; i < currentRows - subjects.value; i++) {
            deleteRow();
        }
        currentRows = 0;
    }
});

submit.addEventListener("click", function() {
    let safe = calcRep();
    if (safe) {
        document.getElementById("errormsg").innerHTML = "";
        submitDiv.style.display = "block";
    }
});

back.addEventListener("click", function() {
    submitDiv.style.display = "none";
    testDate.value = "";
    subjects.value = 0;
    subInfo.style.display = "none";
    for (var i = 0; i < currentRows - subjects.value; i++) {
        deleteRow();
    }
    currentRows = 0;
});

window.onload = (e) => {
    addRemoves();
    for (var i = 0; i < saves.length; i++) {
        saves[i].addEventListener('click', function(event) {
            if (event.target.innerHTML == 'Save') {
                saveSchedule(event);
                addRemoves();
            } else {
                loadSchedule(event);
            }

        })
    }
}

function addRemoves() {
    for (var i = 0; i < removes.length; i++) {
        removes[i].remove();
    }
    saveNames();
    for (var i = 0; i < removes.length; i++) {
        removes[i].addEventListener('click', function(event) {
            console.log('removing ssB' + event.target.id.slice(2, 3));
            removeCookie('ssB' + event.target.id.slice(2, 3));
            addRemoves();
        })
    }
}

function saveSchedule(ev) {
    //ev.preventDefault();
    if (testDate.value == "" || subjects.value == "" || subjects.value <= 0) {
        return alert("Can't save data: Please enter all test data.");
    }
    let rows = [];
    for (var i = 1; i <= subjects.value; i++) {
        console.log("working");
        rowValues = [];
        let name = document.getElementById('sub' + i + 'name').value;
        let learned = document.getElementById('sub' + i + 'learned').value;
        let diff = document.getElementById('sub' + i + 'difficulty').value;
        rowValues.push(name);
        rowValues.push(learned);
        rowValues.push(diff);
        rowValues = rowValues.join('|');
        rows.push(rowValues);
    }
    rows = rows.join('|');
    let info = [];
    let created = Date.now();
    info.push(created);
    info.push(testDate.value);
    info.push(subjects.value);
    info.push(rows);
    info = info.join('|');
    console.log(info);
    setCookie(ev.target.id, info, 365);
}

function loadSchedule(ev) {
    let data = getCookie(ev.target.id).split('|');
    testDate.value = data[1];
    subjects.value = data[2];
    currentRows = data[2];
    subInfo.style.display = "block";

    for (var i = 0; i < data[2]; i++) {
        addRow();
        document.getElementById('sub' + (i + 1) + 'name').value = data[(i * 3) + 3];
        document.getElementById('sub' + (i + 1) + 'learned').value = data[(i * 3) + 4];
        document.getElementById('sub' + (i + 1) + 'difficulty').value = data[(i * 3) + 5];
    }
    let safe = calcRep();
    if (safe) {
        document.getElementById("errormsg").innerHTML = "";
        submitDiv.style.display = "block";
    }
}

function addRow() {
    var table = subTable;
    var rowCount = table.rows.length;
    var row = table.insertRow(rowCount);
    var colCount = table.rows[0].cells.length;

    for (var i = 0; i < colCount; i++) {
        var newcell = row.insertCell(i);
        if (i == 0) {
            newcell.innerHTML =
                '<input class="inputBox subNames" type="string" id="sub' + rowCount + 'name">';
        } else if (i == 1) {
            newcell.innerHTML =
                '<input class="inputBox subDates" type="date" id="sub' + rowCount + 'learned">';
        } else {
            newcell.innerHTML =
                '<input class="subDiff" type="range" min="1" max="5" value="1" id="sub' +
                rowCount +
                'difficulty">';
        }
    }
}

function deleteRow() {
    try {
        var table = subTable;
        var rowCount = table.rows.length;
        table.deleteRow(rowCount - 1);
    } catch (e) {
        alert(e);
    }
}

function calcRep() {
    let mult = [2.175, 2, 1.825, 1.625, 1.45];
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
    let topicNames = document.getElementsByClassName("subNames");
    let topicDates = document.getElementsByClassName("subDates");
    let topicDiff = document.getElementsByClassName("subDiff");

    let monYr = [];
    let studyDates = [];

    monYr.push(
        new Date(new Date(testDate.value).valueOf() + 86400000).getMonth() +
        "-" +
        new Date(testDate.value).getFullYear()
    );

    for (var n in topicNames) {
        if (!topicNames[n].value) {
            topicNames[n].value = Number(n) + 1;
        }
    }

    var i = 0;
    for (var d of topicDates) {
        if (d.value > testDate.value) {
            document.getElementById("errormsg").innerHTML =
                "All topic dates must be before the test date!";
            return false;
        }

        monYr.push(
            new Date(new Date(d.value).valueOf() + 86400000).getMonth() +
            "-" +
            new Date(d.value).getFullYear()
        );

        for (var p = 1; p <= 10; p++) {
            let add = Math.floor(Math.pow(mult[topicDiff[i].value - 1], p));
            let nextDate = new Date(new Date(d.value).valueOf() + add * 86400000);
            if (nextDate < new Date(testDate.value)) {
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

    var calendarDates = studyDates
        .map((v) => new Date(v[0]).toJSON().slice(0, 10) + "|" + v[1])
        .filter((item, i, ar) => ar.indexOf(item) === i);
    var dates = [];
    for (var a of calendarDates) {
        var info = {
            name: "Study " + a.split("|")[1],
            description: "Test on " + testDate.value,
            startDate: a.split("|")[0],
        };
        dates.push(info);
    }

    calLinks.innerHTML =
        '<add-to-calendar-button id="callinks" name="Event Series" dates=\'' +
        JSON.stringify(dates) +
        "' options=\"'Apple','Google','Outlook.com'\" buttonsList hideTextLabelButton buttonStyle=\"round\" lightMode=\"bodyScheme\"></add-to-calendar-button>";

    let unique = monYr.filter((item, i, ar) => ar.indexOf(item) === i);
    unique = unique.sort((a, b) => a.split("-")[0] - b.split("-")[0]);

    for (var k of unique) {
        var monthDiv = document.createElement("div");
        monthDiv.classList.add("perMonth");
        var studyDays = [];
        var stDays = studyDates.filter(
            (a) => new Date(a[0]).getMonth() + "-" + new Date(a[0]).getFullYear() == k
        );
        var uniqueDays = stDays
            .map((d) => new Date(d[0]).getDate())
            .filter((item, i, ar) => ar.indexOf(item) === i)
            .sort((a, b) => a - b);

        for (var o of uniqueDays) {
            var todays = stDays
                .filter((item) => new Date(item[0]).getDate() == o)
                .map((v) => v[1]);
            var monthYr = k.split("-");
            todays = todays.join(", ");
            todays = `${monthYr[0]}/${o}/${monthYr[1]}: ${todays}`;
            studyDays.push(todays);
        }

        var monthTitle = document.createElement("span");
        var monthTxt = document.createTextNode(m[k.split("-")[0]]);
        monthTitle.appendChild(monthTxt);
        monthTitle.classList.add("monTitle");

        studyDays = studyDays.join("<br>");
        var datesContainer = document.createElement("p");
        datesContainer.innerHTML = studyDays;
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
    const testMonYr =
        new Date(testDate.value).getMonth() +
        "-" +
        new Date(testDate.value).getFullYear();
    var testDay = false;

    let mapped = stDays.map((a) => new Date(a[0]).getDate());

    if (testMonYr == monYr) {
        testDay = new Date(testDate.value).getDate();
    }

    let cal = document.createElement("div");
    cal.classList.add("single-cal");

    let month = document.createElement("div");
    let numMon = monYr.split("-")[0];
    let numYr = monYr.split("-")[1];
    month.classList.add("month");
    month.innerHTML =
        "<ul>" +
        '<li id="month-name">' +
        m[numMon] +
        "<br>" +
        '<span style="font-size:18px" id="year">' +
        numYr +
        "</span>" +
        "</li>" +
        "</ul>";

    let dayNames = document.createElement("ul");
    dayNames.classList.add("weekdays");
    dayNames.innerHTML =
        "<li>Su</li>" +
        "<li>Mo</li>" +
        "<li>Tu</li>" +
        "<li>We</li>" +
        "<li>Th</li>" +
        "<li>Fr</li>" +
        "<li>Sa</li>";

    let days = document.createElement("ul");
    days.classList.add("days");

    let totalDays = new Date(numYr, Number(numMon) + 1, 0).getDate();
    let firstDay = new Date(numYr, numMon, 1).getDay();

    for (var i = 0; i < firstDay; i++) {
        let blank = document.createElement("li");
        let blanktxt = document.createTextNode("");
        blank.appendChild(blanktxt);
        days.appendChild(blank);
    }

    for (var k = 0; k < totalDays; k++) {
        let day = document.createElement("li");
        let date = document.createTextNode(k + 1);

        if (testDay != false) {
            if (testDay == k) {
                var sp = document.createElement("span");
                sp.classList.add("active");
                sp.appendChild(date);
                day.appendChild(sp);
            } else {
                day.appendChild(date);
            }
        } else {
            day.appendChild(date);
        }

        let studyTopic = mapped.map((v, i) => (v == k + 1 ? stDays[i][1] : null));
        studyTopic = studyTopic.filter((h) => h != null);

        if (studyTopic.length > 0) {
            var string = studyTopic.join(", ");
            day.innerHTML =
                '<span class="study">' +
                day.innerHTML +
                '<sup title="Study Topics: ' +
                string +
                '">' +
                studyTopic.length +
                "</sup></span>";
        }

        days.appendChild(day);
    }

    var left = firstDay + totalDays;

    if (left < 42) {
        for (var l = 0; l < 42 - left; l++) {
            let blank = document.createElement("li");
            let blanktxt = document.createTextNode("0");
            blank.appendChild(blanktxt);
            blank.style.color = "#EEF4F4";
            days.appendChild(blank);
        }
    }

    cal.appendChild(month);
    cal.appendChild(dayNames);
    cal.appendChild(days);

    calendar.appendChild(cal);
}

function setCookie(cname, cvalue, exdays) {
    const d = new Date();
    d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
    let expires = "expires=" + d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

function getCookie(cname) {
    let name = cname + "=";
    let decodedCookie = decodeURIComponent(document.cookie);
    let ca = decodedCookie.split(';');
    for (let i = 0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}

function checkCookie(cname) {
    let value = getCookie(cname);
    if (value != "") {
        return true;
    } else {
        return false;
    }
}

function removeCookie(cname) {
    console.log('removing ' + cname + ' in func');
    document.cookie = cname + "=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";

}

function saveNames() {
    for (var s of saves) {
        let id = s.id;
        if (checkCookie(id)) {
            let saveData = getCookie(id);
            saveData = saveData.split('|');
            document.getElementById('ss' + id.slice(3, 4)).innerHTML = new Date(Number(saveData[0])).toLocaleString();
            document.getElementById(id).innerHTML = 'Load';

            let remove = document.createElement('span');
            remove.appendChild(document.createTextNode('x '));
            remove.classList.add('removeSave');
            remove.id = 'sd' + id.slice(3, 4);
            document.getElementById('buttonList').insertBefore(remove, document.getElementById('ssB' + (Number(id.slice(3, 4)))));
        } else {
            document.getElementById('ss' + id.slice(3, 4)).innerHTML = "Save Slot " + id.slice(3, 4);
            document.getElementById(id).innerHTML = 'Save';
        }
    }
}