let courseId = [18300, 11819, 19002];
let selectedCourse;
let players = 0;
let playerIndex;
let selectedCourseTeeType;
let teeTypesArray = [];
let teeIndex;

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
                    <select style="display: none;" id="select${courseId}" onchange="selectedTeeType(event)" class="selectTee">
                        
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


    $(event.target).hide();
    $(".card").hide();
    $(event.target).parent().show();
    $(event.target.nextSibling.nextSibling).show();
}

function renderHoles() {
    document.getElementById("course-title").innerHTML = selectedCourse.data.name;
    let firstNine;
    firstNine += "<div class='title'>Holes</div>"
    for(let hole in selectedCourse.data.holes){
        firstNine += `
            <div id="hole${hole}">
                <div class="square">${selectedCourse.data.holes[hole].hole}</div>
            </div>`;
    }
    firstNine += "<div>";
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

    document.getElementById("add-player").style.display = "block";
    document.getElementById("gear").style.display = "block";
    renderPar();
}

function selectedTeeType(event) {
    $(event.target.parentNode).animate({
        opacity: 0
    }, 300, function() {
        event.target.parentNode.display = "none";
        renderHoles();
        $(".card-wrapper").hide();
    })
    selectedCourseTeeType = event.srcElement.value;
}

function renderPar() {
    let html = "<div class='title'>Par</div>";
    for(let i = 0; i < 18; i++) {
        let y = selectedCourse.data.holes[i].teeBoxes;
        let z;
        for(let j = 0; j < y.length; j++) {
            z = y[j].teeType;
            teeTypesArray.push(z);
        }
    }

    teeTypesArray.length = selectedCourse.data.holes[0].teeBoxes.length;
    teeIndex = teeTypesArray.indexOf(selectedCourseTeeType);

    let totalPar = 0;
    let outPar = 0;
    let inPar = 0;
    for(let hole in selectedCourse.data.holes) {
        html += `<div id="parDisplay${hole}">
                    <div class="square">${selectedCourse.data.holes[hole].teeBoxes[teeIndex].par}</div>
                </div>`;

        totalPar += selectedCourse.data.holes[hole].teeBoxes[teeIndex].par;
    }

    for(let i = 0; i < 9; i++) {
        outPar += selectedCourse.data.holes[i].teeBoxes[teeIndex].par;
    }
    for(let i = 9; i < 18; i++) {
        inPar += selectedCourse.data.holes[i].teeBoxes[teeIndex].par;
    }

    html += "<div>";

    document.getElementById("par-container").innerHTML = html;

    document.getElementById("parDisplay8").outerHTML += `<div class="label" id="out-par-total">
                                                                        <div>${outPar}</div>
                                                                    </div>`;
    document.getElementById("parDisplay17").outerHTML += `<div class="label" id="in-par-total">
                                                                        <div>${inPar}</div>
                                                                    </div>`;
    document.getElementById("in-par-total").outerHTML += `<div>
                                                                        <div class="label" id="par-total-label">${totalPar}</div>
                                                                    </div>`;

    renderYardage();
}

function renderYardage() {

  let html = `<div class='title'>Yardage(${selectedCourseTeeType})</div>`;
  for(let hole in selectedCourse.data.holes) {
      html += `<div id="yard${hole}">
                    <div class="square">${selectedCourse.data.holes[hole].teeBoxes[teeIndex].yards}</div>
                </div>`;
  }

  let outYards = 0;
  let inYards = 0;
  let totalYards = 0;

  for(let i = 0; i < 9; i++) {
      outYards += Number(selectedCourse.data.holes[i].teeBoxes[teeIndex].yards);
  }

  for(let i = 9; i < 18; i++) {
      inYards += Number(selectedCourse.data.holes[i].teeBoxes[teeIndex].yards);
  }

  totalYards = inYards + outYards;


  html += "<div>";
  document.getElementById("yard-container").innerHTML = html;

    document.getElementById("yard8").outerHTML += `<div class="label" id="out-yard-total">
                                                                        <div>${outYards}</div>
                                                                    </div>`;
    document.getElementById("yard17").outerHTML += `<div class="label" id="in-yard-total">
                                                                        <div>${inYards}</div>
                                                                    </div>`;
    document.getElementById("in-yard-total").outerHTML += `<div>
                                                                        <div class="label" id="yard-total-label">${totalYards}</div>
                                                                    </div>`;
};


document.getElementById("add-player").addEventListener("click",function(){
    renderPlayers();

});



function renderPlayers() {
    if(players < 4) {
        players += 1;
        let playersHTML;
        playersHTML += `<div class='title' contenteditable='true'>Player${players}</div>`;
        for (let hole in selectedCourse.data.holes) {
            playersHTML += `
                   <div id="player${players}${hole}">
                        <div class="square" onkeyup="renderPlayerScore(event)" contenteditable="true"></div>
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
        if(isNaN(event.target.innerText)) {
            console.log("enter a number");
            event.target.innerText = "";
        }
        else if(event.keyCode === 39 || event.keyCode === 37 || event.keyCode === 8) {
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

                for(let i = 0; i < 9; i++) {
                    outScore += scores[i];
                }
                for(let i = 9; i < 18; i++) {
                    inScore += scores[i];
                }
                document.getElementById(`player${playerIndex}-out`).innerText = outScore;
                document.getElementById(`player${playerIndex}-in`).innerText = inScore;
        }
}