let courseId = [18300, 11819, 19002];
let selectedCourse;
let players = 0;
let playerIndex;

function getCourseList() {
    return new Promise((resolve, reject) => {
        let xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function() {
            if(this.status === 200 && this.readyState === 4) {
                const COURSES = JSON.parse(this.responseText);
                resolve(COURSES);
            }
        };
        xhttp.open("GET", `https://golf-courses-api.herokuapp.com/courses` , true);
        xhttp.send();
    })
}

getCourseList().then(courses => {
    renderCourseList(courses);
});

getCourseList();

function getCourseInfo(id, event) {
    if(id) {
        return new Promise((resolve, reject) => {
            let x = new XMLHttpRequest();
            x.onreadystatechange = function () {
                if (this.status === 200 && this.readyState === 4) {
                    const COURSE = JSON.parse(this.responseText);
                    selectedCourse = COURSE;
                    console.log(selectedCourse);
                    getThisCourse(COURSE, id, event);
                }
            };
            x.open("GET", `https://golf-courses-api.herokuapp.com/courses/${id}`, true);
            x.send();
        })
    }
}

function renderCourseList(APIcourse) {
    let html = "<div class='card-wrapper'>";
    for(course in APIcourse.courses) {
        let courseNameList = APIcourse.courses[course].name;
        let courseImage = APIcourse.courses[course].image;
        let courseId = APIcourse.courses[course].id;
        html += `<div class="card">
                    <div>${courseNameList}</div>
                    <img style="width: 350px; height: 250px" src="${courseImage}"/>
                    <button onclick="getCourseInfo(${courseId}, event)">Select Tee Type</button>
                    <select id="select${courseId}" onchange="selectedTeeType(event)" class="selectTee">
                        
                    </select>
                </div>`;
    }

    $("#course-chooser").html(html);

}

function getThisCourse(course, id,  event) {
    // $("#course-chooser").hide(300);
    // renderHoles(course.data);
    let teeTypeArray = course.data.holes[0].teeBoxes;
    let teeType = "<option>Select A Tee Type</option>";
    for(tee in teeTypeArray) {
        teeType += `<option value="${teeTypeArray[tee].teeType}">${teeTypeArray[tee].teeType}</option>`;
    }

    document.getElementById(`select${id}`).innerHTML += teeType;

    $(".card").slideUp(350);
    $(event.target.parentNode).slideDown(350);

    setTimeout(function() {
        $(event.target).hide();
        $(".card").hide();
        $(event.target).parent().show();
    }, 350);
}

function renderHoles() {
    let firstNine;
    firstNine += "<div class='title'>Holes</div>"
    for(let hole in selectedCourse.data.holes){
        firstNine += `
            <div id="hole${hole}">
                <div class="square">${selectedCourse.data.holes[hole].hole}</div>
            </div>`;
    }
    document.getElementById("hole-container").innerHTML = firstNine;
    document.getElementById("hole8").outerHTML += `<div class="label" id="out-label">
                                                                <div>OUT</div>
                                                            </div>`;
    document.getElementById("hole17").outerHTML += `<div class="label" id="in-label">
                                                                   <div>IN</div>
                                                                </div>`;
    document.getElementById("in-label").outerHTML += `<div>
                                                                    <div class="label" id="total-label">TOTAL</div>
                                                                </div>`;
    document.getElementById("hole-container").firstChild.remove();
}

function selectedTeeType(event) {
    $(event.target.parentNode).animate({
        opacity: 0
    }, 300, function() {
        event.target.parentNode.display = "none";
        renderHoles();
        $(".card-wrapper").hide();
    })
}

document.getElementById("add-player").addEventListener("click", function() {
    renderPlayers();
})

function renderPlayers() {
    if(players < 4) {
        players += 1;
        let playersHTML;
        playersHTML += `<div class='title' contenteditable='true'>Player${players}</div>`;
        for (let hole in selectedCourse.data.holes) {
            playersHTML += `
                   <div id="player${players}${hole}">
                        <div class="square" onclick="renderPlayerScore(event)" contenteditable="true">0</div>
                    </div>
                    `;
        }
        document.getElementById(`players-container${players}`).innerHTML = playersHTML;
        document.getElementById(`players-container${players}`).firstChild.remove();
        document.getElementById(`player${players}8`).outerHTML += `<div class="label" id="player${players}-out">
                                                                <div>0</div>
                                                            </div>`;
        document.getElementById(`player${players}17`).outerHTML += `<div class="label" id="player${players}-in">
                                                                   <div>0</div>
                                                                </div>`;
        document.getElementById(`player${players}-in`).outerHTML += `<div>
                                                                    <div class="label" id="player${players}-total">0</div>
                                                                </div>`;
        pCollection.add(`player${players}`)

        for(let i = 0; i < 18; i++) {
            pCollection.collection[players - 1].add(0);
        }

    } else {
        console.log("Max of 4 players!");
    }
}

function renderPlayerScore(event) {
        let holeScore = event.target.innerText;
        playerIndex = event.target.parentNode.id.charAt(6);
        let x = event.target.parentNode.id;
        let holeIndex;
        if(x.length === 8) {
            holeIndex = x.charAt(7);
        }
        else if(x.length == 9) {
            holeIndex = x.slice(7, 9);
        }
        let scores = pCollection.collection[playerIndex - 1].scores;
        scores[holeIndex] = Number(holeScore);
        let addedScores = scores.reduce((a, b) => a + b, 0);
        document.getElementById(`player${playerIndex}-total`).innerHTML = addedScores;

        for(let i = 0; i < 9; i++) {
            console.log(document.getElementById(`player${playerIndex}i`));
        }
}


