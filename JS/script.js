let courseId = [18300, 11819, 19002];
let selectedCourse;

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

function selectedTeeType(event) {
    $(event.target.parentNode).animate({
        opacity: 0
    }, 300, function() {
        event.target.parentNode.display = "none";
        renderHoles();
        $(".card-wrapper").hide();
    })
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
    for(let hole in selectedCourse.data.holes){
            firstNine += `
            <div id="hole${hole}">
                <div class="hole-display">Hole</div>
                <div>${selectedCourse.data.holes[hole].hole}</div>
            </div>`;
    }
    document.getElementById("hole-container").innerHTML = firstNine;
    document.getElementById("hole8").outerHTML += `<div id="out-label">
                                                                <div>OUT</div>
                                                            </div>`;
    document.getElementById("hole17").outerHTML += `<div id="in-label">
                                                                   <div>IN</div>
                                                                </div>`;
    document.getElementById("in-label").outerHTML += `<div>
                                                                    <div id="total-label">TOTAL</div>
                                                                </div>`
    document.getElementById("hole-container").firstChild.remove();
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

