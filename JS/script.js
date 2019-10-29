function getCourseList() {
    return new Promise((resolve, reject) => {
        let xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function() {
            if(this.status == 200 && this.readyState == 4) {
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

function renderCourseList(APIcourse) {
    console.log(APIcourse);
    let html = "<div class='card-wrapper'>";
    for(course in APIcourse.courses) {
        let courseNameList = APIcourse.courses[course].name;
        let courseImage = APIcourse.courses[course].image;
        html += `<div class="card">
                    <div>${courseNameList}</div>
                    <img style="width: 200px; height: 140px" src="${courseImage}"/>
                    <button>Select Tee Type</button>
                </div>`;
    }
    document.getElementById("course-chooser").innerHTML = html;
}