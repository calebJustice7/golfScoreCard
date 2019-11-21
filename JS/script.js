function mobileShow() {
    if (screen.width >= 900) {
        $("#show-players").hide();
    } else {
        $("#show-players").show();
    }
}

$("#show-players").click(function () {
    for (let i = 1; i < players + 1; i++) {
        document.getElementById(`players-container${i}`).style.display = "flex";
        $("#hole-container").hide();
        $("#par-container").hide();
        $("#hdc-container").hide();
        $("#yard-container").hide();
        $("#show-players").hide();
        $("#hide-players").show();
    }
})

$("#hide-players").click(function () {
    for (let i = 1; i < players + 1; i++) {
        document.getElementById(`players-container${i}`).style.display = "none";
        $("#hole-container").show();
        $("#par-container").show();
        $("#hdc-container").show();
        $("#yard-container").show();
        $("#hide-players").hide();
        $("#show-players").show();
    }
})

$("#modal-container").fadeOut(0);

function modal() {
    $("#modal-container").fadeIn(300);
}

function closeModal() {
    $("#modal-container").fadeOut(400);
}

if (screen.width >= 900) {
    $("#message").animate({
        marginLeft: "-450"
    }, 0);
} else {
    $("#message").animate({
        marginLeft: "-400"
    }, 0);
}

let courseId = [18300, 11819, 19002];
let selectedCourse;
let selectedCourseId;
let players = 0;
let playerIndex;
let selectedCourseTeeType;
let teeTypesArray = [];
let teeIndex;
let nameArr = [];

function getCourseList() {
    return new Promise((resolve, reject) => {
        let xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function () {
            if (this.status === 200 && this.readyState === 4) {
                const COURSES = JSON.parse(this.responseText);
                resolve(COURSES);
            }
        };
        xhttp.open("GET", `https://golf-courses-api.herokuapp.com/courses`, true);
        xhttp.send();
    })
}

getCourseList().then(courses => {
    renderCourseList(courses);
});

getCourseList();

function getCourseInfo(id, event) {
    if (id) {
        return new Promise((resolve, reject) => {
            let x = new XMLHttpRequest();
            x.onreadystatechange = function () {
                if (this.status === 200 && this.readyState === 4) {
                    selectedCourse = JSON.parse(this.responseText);
                    selectedCourseId = id;
                    getThisCourse(event);
                }
            };
            x.open("GET", `https://golf-courses-api.herokuapp.com/courses/${id}`, true);
            x.send();
        })
    }
}

function renderCourseList(APIcourse) {
    let html = "<div class='card-wrapper'>";
    for (course in APIcourse.courses) {
        let courseNameList = APIcourse.courses[course].name;
        let courseImage = APIcourse.courses[course].image;
        let courseId = APIcourse.courses[course].id;
        html += `<div class="card">
                    <i class="fas fa-arrow-left" onclick="mainScreen(event)"></i>
                    <div>${courseNameList}</div>
                    <img src="${courseImage}"/>
                    <button onclick="getCourseInfo(${courseId}, event)" class="selectTeeBtn">Select Tee Type</button>
                    <select style="display: none;" id="select${courseId}" onchange="selectedTeeType(event)" class="selectTee">
                        
                    </select>
                </div>`;
    }

    $("#title").hide();
    $("#course-chooser").html(html);

}

function mainScreen(event) {
    $(".card").show(400);
    $(".fa-arrow-left").hide();
    $(".selectTeeBtn").show(400);
    $(".selectTee").hide();
    for (let i = 0; i < 3; i++) {
        let el = document.getElementById(`select${courseId[i]}`);
        el.innerHTML = "";
    }
    if (screen.width < 900) {
        $("body").css("height", "1400px");
    }

}

function getThisCourse(event) {
    let course = selectedCourse;
    let id = selectedCourseId;

    let teeTypeArray = course.data.holes[0].teeBoxes;
    let teeType = "<option>Select A Tee Type</option>";
    for (tee in teeTypeArray) {
        teeType += `<option value="${teeTypeArray[tee].teeType}">${teeTypeArray[tee].teeType}</option>`;
    }

    document.getElementById(`select${id}`).innerHTML += teeType;

    if (event) {
        if (screen.width < 900) {
            $("body").css("height", "800px");
        }
        $(event.target).hide(200);
        $(".card").hide(200);
        $(event.target).parent().show(200);
        $(event.target.nextSibling.nextSibling).show(200);
        $(".fa-arrow-left").show(200);
    }
}

function renderHoles() {
    mobileShow();
    if (screen.width < 900) {
        $("body").css("height", "1200px");
    }

    document.getElementById("course-title").innerHTML = selectedCourse.data.name;
    let firstNine;
    firstNine += "<div class='title'>Holes</div>"
    for (let hole in selectedCourse.data.holes) {
        firstNine += `
            <div id="hole${hole}">
                <div class="square">${selectedCourse.data.holes[hole].hole}</div>
            </div>`;
    }
    firstNine += "<div>";
    document.getElementById("hole-container").innerHTML = firstNine;
    document.getElementById("hole8").outerHTML += `<div class="label" id="out-label"><div>OUT</div></div>`;
    document.getElementById("hole17").outerHTML += `<div class="label" id="in-label"><div>IN</div></div>`;
    document.getElementById("in-label").outerHTML += `<div><div class="label" id="total-label">TOTAL</div></div>`;
    document.getElementById("hole-container").firstChild.remove();
    document.getElementById("add-player").style.display = "block";
    document.getElementById("gear").style.display = "block";
    $("#hole-container").slideUp(0);
    $("#hole-container").slideDown(400);
    $("#title").show();
    renderPar();
}


function selectedTeeType(event) {
    $(event.target.parentNode).animate({
        opacity: 0
    }, 300, function () {
        event.target.parentNode.display = "none";
        renderHoles();
        $(".card-wrapper").hide();
    })
    selectedCourseTeeType = event.srcElement.value;
}

function renderPar() {
    $("#player-count").show();
    $("#par-container").slideUp(0);
    let html = "<div class='title'>Par</div>";
    for (let i = 0; i < 18; i++) {
        let y = selectedCourse.data.holes[i].teeBoxes;
        let z;
        for (let j = 0; j < y.length; j++) {
            z = y[j].teeType;
            teeTypesArray.push(z);
        }
    }

    teeTypesArray.length = selectedCourse.data.holes[0].teeBoxes.length;
    teeIndex = teeTypesArray.indexOf(selectedCourseTeeType);

    let totalPar = 0;
    let outPar = 0;
    let inPar = 0;
    for (let hole in selectedCourse.data.holes) {
        html += `<div id="parDisplay${hole}">
                    <div class="square">${selectedCourse.data.holes[hole].teeBoxes[teeIndex].par}</div>
                </div>`;

        totalPar += selectedCourse.data.holes[hole].teeBoxes[teeIndex].par;
    }

    for (let i = 0; i < 9; i++) {
        outPar += selectedCourse.data.holes[i].teeBoxes[teeIndex].par;
    }
    for (let i = 9; i < 18; i++) {
        inPar += selectedCourse.data.holes[i].teeBoxes[teeIndex].par;
    }

    html += "<div>";

    document.getElementById("par-container").innerHTML = html;

    document.getElementById("parDisplay8").outerHTML += `<div class="label" id="out-par-total"><div>${outPar}</div></div>`;
    document.getElementById("parDisplay17").outerHTML += `<div class="label" id="in-par-total"><div>${inPar}</div></div>`;
    document.getElementById("in-par-total").outerHTML += `<div><div class="label" id="par-total-label">${totalPar}</div></div>`;
    $("#par-container").slideDown(400);
    renderYardage();
}

function renderYardage() {
    let html = `<div class='title'>Yardage(${selectedCourseTeeType})</div>`;
    for (let hole in selectedCourse.data.holes) {
        html += `<div id="yard${hole}">
                    <div class="square">${selectedCourse.data.holes[hole].teeBoxes[teeIndex].yards}</div>
                </div>`;
    }

    let outYards = 0;
    let inYards = 0;
    let totalYards = 0;

    for (let i = 0; i < 9; i++) {
        outYards += Number(selectedCourse.data.holes[i].teeBoxes[teeIndex].yards);
    }
    for (let i = 9; i < 18; i++) {
        inYards += Number(selectedCourse.data.holes[i].teeBoxes[teeIndex].yards);
    }
    totalYards = inYards + outYards;


    html += "<div>";
    document.getElementById("yard-container").innerHTML = html;

    document.getElementById("yard8").outerHTML += `<div class="label" id="out-yard-total"><div>${outYards}</div></div>`;
    document.getElementById("yard17").outerHTML += `<div class="label" id="in-yard-total"><div>${inYards}</div></div>`;
    document.getElementById("in-yard-total").outerHTML += `<div><div class="label" id="yard-total-label">${totalYards}</div></div>`;

    renderHandicap();

}

function renderHandicap() {
    let html = "<div class='title'>Handicap</div>";
    for (let hole in selectedCourse.data.holes) {
        let hcp = selectedCourse.data.holes[hole].teeBoxes[teeIndex].hcp;
        html += `<div id="hdc${hole}">
                    <div class="square">${hcp}</div>
                </div>`;
    }
    html += "<div>";

    let hcpIn = 0;
    let hcpOut = 0;
    let totalHcp = 0;

    for (let i = 0; i < 9; i++) {
        hcpOut += selectedCourse.data.holes[i].teeBoxes[teeIndex].hcp;
    }

    for (let i = 9; i < 18; i++) {
        hcpIn += selectedCourse.data.holes[i].teeBoxes[teeIndex].hcp;
    }

    totalHcp = hcpOut + hcpIn;

    document.getElementById("hdc-container").innerHTML = html;

    document.getElementById("hdc8").outerHTML += `<div class="label" id="out-hdc-total"><div>${hcpOut}</div></div>`;
    document.getElementById("hdc17").outerHTML += `<div class="label" id="in-hdc-total"><div>${hcpIn}</div></div>`;
    document.getElementById("in-hdc-total").outerHTML += `<div><div class="label" id="hdc-total-label">${totalHcp}</div></div>`;
}
document.getElementById("add-player").addEventListener("click", function () {
    renderPlayers();

});

function modalShowPlayers() {
    for(let i = 0; i < players; i++) {
        let state = pCollection.collection[i].active ? "far fa-check-circle" : "far fa-circle"
        let activeState = pCollection.collection[i].active ? "Active" : "Not Active";
        document.getElementById(`player${i + 1}`).innerHTML = `
        <div>${nameArr[i]}</div>
        <div>${activeState}</div>
        <i class="${state}" onclick="changeState(event, ${i})" />
        `;
    }
}

function changeState(event, i) {
    let className = event.target.className;
    if(className === "far fa-check-circle") {
        pCollection.collection[i].active = false;
        let x = document.getElementById(`players-container${i + 1}`);
        $(x).animate({
            opacity: 0,
            marginBottom: "-50px"
        });
    } else {
        pCollection.collection[i].active = true;
        let x = document.getElementById(`players-container${i + 1}`);
        $(x).animate({
            opacity: 1,
            marginBottom: "0px"
        });
    }
    modalShowPlayers();
}

function renderPlayers() {
    if (players < 4) {
        players += 1;
        $("#player-count").html("Players: " + players);
        let width = screen.width;
        nameArr.push(`player${players}`);
        let playersHTML;
        playersHTML += `<input class='title' type="text" onkeyup="changeName(event)" placeholder="Player${players}" />`;
        for (let hole in selectedCourse.data.holes) {
            playersHTML += `
                   <div id="player${players}${hole}">
                        <div class="square" onkeyup="renderPlayerScore(event)" contenteditable="true"></div>
                    </div>
                    `;
        }
        document.getElementById(`players-container${players}`).innerHTML = playersHTML;
        document.getElementById(`players-container${players}`).firstChild.remove();
        document.getElementById(`player${players}8`).outerHTML += `<div class="label" id="player${players}-out"><div>0</div></div>`;
        document.getElementById(`player${players}17`).outerHTML += `<div class="label" id="player${players}-in">   <div>0</div></div>`;
        document.getElementById(`player${players}-in`).outerHTML += `<div><div class="label" id="player${players}-total">0</div></div>`;
        pCollection.add(`player${players}`);
        $(`#players-container${players}`).animate({
            marginLeft: "0"
        }, 300);

        for (let i = 0; i < 18; i++) {
            pCollection.collection[players - 1].add(0);
        }

        if (width < 900) {
            if (document.getElementById("hole-container").style.display == "none") {
                // nothing
            } else {
                for (let i = 1; i < players + 1; i++) {
                    document.getElementById(`players-container${i}`).style.display = "none";
                }
            }
        }
        modalShowPlayers();
    } else {
        alert("Max of 4 players!");
    }
}

function changeName(event) {
    if (event.keyCode == 13) {
        playerIndex = event.target.nextSibling.nextSibling.id.charAt(6);
        let newName = event.target.value;

        if (playerIndex == 1) {
            if (nameArr[1] === newName || nameArr[2] === newName || nameArr[3] === newName) {
                event.target.value = "";
            } else {
                nameArr[0] = newName;
                $(event.target).css("color", "black");
            }
        } else if (playerIndex == 2) {
            if (nameArr[0] === newName || nameArr[2] === newName || nameArr[3] === newName) {
                event.target.value = "";
            } else {
                nameArr[1] = newName;
                $(event.target).css("color", "black");
            }
        } else if (playerIndex == 3) {
            if (nameArr[0] === newName || nameArr[1] === newName || nameArr[3] === newName) {
                event.target.value = "";
            } else {
                nameArr[2] = newName;
                $(event.target).css("color", "black");
            }
        } else if (playerIndex == 4) {
            if (nameArr[0] === newName || nameArr[1] === newName || nameArr[2] === newName) {
                event.target.value = "";
            } else {
                nameArr[3] = newName;
                $(event.target).css("color", "black");
            }
        }
        modalShowPlayers();
    }
}

function renderPlayerScore(event) {
    if (isNaN(event.target.innerText)) {
        console.log("enter a number");
        event.target.innerText = "";

    }
    else if (event.keyCode === 39 || event.keyCode === 37 || event.keyCode === 8 || event.keyCode === 9 || event.keyCode === 32) {
        console.log("enter characters");
    }
    else {
        let holeScore = event.target.innerText;
        playerIndex = event.target.parentNode.id.charAt(6);
        let x = event.target.parentNode.id;
        let holeIndex;
        if (x.length === 8) {
            holeIndex = x.charAt(7);
        } else if (x.length == 9) {
            holeIndex = x.slice(7, 9);
        }
        let scores = pCollection.collection[playerIndex - 1].scores;
        scores[holeIndex] = Number(holeScore);
        let addedScores = scores.reduce((a, b) => a + b, 0);
        document.getElementById(`player${playerIndex}-total`).innerHTML = addedScores;
        event.target.innerText = holeScore;

        let outScore = 0;
        let inScore = 0;

        for (let i = 0; i < 9; i++) {
            outScore += scores[i];
        }
        for (let i = 9; i < 18; i++) {
            inScore += scores[i];
        }
        document.getElementById(`player${playerIndex}-out`).innerText = outScore;
        document.getElementById(`player${playerIndex}-in`).innerText = inScore;

        sendNote(holeIndex);
        finalMessage(event);
    }
}

function sendNote(index) {
    let playerScore = pCollection.collection[playerIndex - 1].scores;
    let holes = selectedCourse.data.holes;
    let parArray = [];
    for (let i = 0; i < holes.length; i++) {
        parArray.push(holes[i].teeBoxes[teeIndex].par);
    }

    let message;

    if (playerScore[index] == 1) {
        message = "HOLE IN ONE!! Congrats";
    }
    else if (parArray[index] == playerScore[index]) {
        message = "Nice! Right on par";
    }
    else if (parArray[index] > playerScore[index]) {
        message = "Wow! Ahead of par";
    } else {
        message = "Behind par!";
    }

    let offset = parArray[index] - playerScore[index];

    let left = "";

    if (screen.width >= 900) {
        left = "500";
    } else {
        left = "40";
    }

    $("#message").html(message + ". " + offset);
    $("#message").animate({
        marginLeft: left
    }, 250, function () {
        setTimeout(function () {
            $("#message").animate({
                marginLeft: "-450"
            }, 200)
        }, 1500)
    });
}

function finalMessage(event) {
    let holeNum = Number(event.target.parentNode.id.charAt(8));

    if (holeNum === 7) {
        let holes = selectedCourse.data.holes;
        let parArray = [];
        let totalPar = 0;
        let scoreArray = [];
        let totalScore = 0;
        for (let i = 0; i < holes.length; i++) {
            parArray.push(holes[i].teeBoxes[teeIndex].par);
        }
        for (let i = 0; i < parArray.length; i++) {
            totalPar += parArray[i];
        }
        for (let i = 0; i < holes.length; i++) {
            scoreArray.push(pCollection.collection[playerIndex - 1].scores[i]);
        }
        for (let i = 0; i < scoreArray.length; i++) {
            totalScore += scoreArray[i];
        }
        let parOffset = totalPar - totalScore;
        let message;
        if (parOffset > 0) {
            message = "Total Score! Above Par Congrats! +" + parOffset;
        } else if (parOffset === 0) {
            message = "You Were right on par! Total Score!";
        } else {
            message = "Total Score! Behind Par " + parOffset;
        }
        let allScoresEntered = false;
        let scoresNot0 = 0;
        for (let i = 0; i < scoreArray.length - 1; i++) {
            if (scoreArray[i] != 0) {
                scoresNot0++;
            }
            if (scoresNot0 == 17) {
                allScoresEntered = true;
            }
        }
        if (allScoresEntered === true) {
            $("#message").html(message);
            $("#message").animate({
                marginLeft: "500"
            }, 250, function () {
                setTimeout(function () {
                    $("#message").animate({
                        marginLeft: "-500"
                    }, 200)
                }, 1500)
            });
        }
    }
}