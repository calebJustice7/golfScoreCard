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

function getCourseInfo(id) {
    if(id) {
        return new Promise((resolve, reject) => {
            let x = new XMLHttpRequest();
            x.onreadystatechange = function () {
                if (this.status === 200 && this.readyState === 4) {
                    const COURSE = JSON.parse(this.responseText);
                    getThisCourse(COURSE);
                }
            };
            x.open("GET", `https://golf-courses-api.herokuapp.com/courses/${id}`, true);
            x.send();
        })
    }
}

function getThisCourse(course) {
    $("#course-chooser").hide(300);
    renderHoles(course.data);
}

function renderHoles(course) {
    let html;
    for(let hole in course.holes){
        html += `
            <div>
                <div class="hole-display">Hole</div>
                <div>${course.holes[hole].hole}</div>
            </div>`;
    }
    document.getElementById("hole-container").innerHTML = html;
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
                    <img style="width: 200px; height: 140px" src="${courseImage}"/>
                    <button onclick="getCourseInfo(${courseId})">Select Tee Type</button>
                </div>`;
    }
    $("#course-chooser").html(html);
}
