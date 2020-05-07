//first time load
document.addEventListener("DOMContentLoaded", start);
//on accessing page via history
window.onpopstate = function(event){reloadonHistory(event.state)};


function start() {
    let contentUrl;
    const indexOfIndex = window.location.pathname.indexOf("index.html");
    if(indexOfIndex==-1){
        contentUrl = window.location.origin + window.location.pathname + 'content/'
    } else {
        contentUrl = window.location.origin + window.location.pathname.substr(0,indexOfIndex) + 'content/'
    }

    //Load Home
    loadHome(contentUrl);
    //Load Students
    loadStudents(contentUrl,"files.list");
    //Load part of page thats relevant
    loadHash();
    //Load Swipes
    oneRingToSwipemAll();

}

function reloadonHistory(eventState){
    if(!eventState){
        window.location.reload();
        return;
    }
    loadHome(eventState.contentUrl);
    loadHash();
}

function loadHash(){
    const hash = window.location.hash;
    if(!hash){
        clickNav("navbar-Home");
    } else if (hash=="#Students"){
        clickNav("navbar-Students");
    } else if (hash=="#Labs"){
        clickNav("navbar-Labs");
    }
}

//Try not to use below function as it's blocking code
function loadFile(filePath) {
    var result = null;
    var xmlhttp = new XMLHttpRequest();
    console.log("filePath=", filePath);
    xmlhttp.open("GET", filePath, false);
    xmlhttp.send();
    if (xmlhttp.status == 200) {
        result = xmlhttp.responseText;
    }
    return result;
}

function loadFileAsync(filePath) {
    var result = null;
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.open("GET", filePath, true);
    xmlhttp.send();
    return xmlhttp;

}

function clickHome(){

    const homeUrl = window.location.origin + window.location.pathname;
    const homeTitle = "Students of MTech AI 2020";

    let contentUrl;
    const indexOfIndex = window.location.pathname.indexOf("index.html");
    if(indexOfIndex==-1){
        contentUrl = window.location.origin + window.location.pathname + 'content/'
    } else {
        contentUrl = window.location.origin + window.location.pathname.substr(0,indexOfIndex) + 'content/'
    }

    const homeState = {"title":homeTitle,"url":homeUrl,"contentUrl":contentUrl};
    history.pushState(homeState, homeTitle, homeUrl);

    loadHome(contentUrl);
}

function clickStudent(talkTitle, talkUrl){

    let contentUrl;
    const indexOfIndex = window.location.pathname.indexOf("index.html");
    if(indexOfIndex==-1){
        contentUrl = window.location.origin + window.location.pathname + 'content/'
    } else {
        contentUrl = window.location.origin + window.location.pathname.substr(0,indexOfIndex) + 'content/'
    }

    const Studentstate = {"title":talkTitle,"url":talkUrl,"contentUrl":contentUrl};
    history.pushState(Studentstate, talkTitle, talkUrl);
    loadHome(contentUrl);
}


function removeChildren(someDiv){
    while (someDiv.hasChildNodes()) {
        someDiv.removeChild(someDiv.firstChild);
    }
}

function loadHome(contentUrl) {
    //Clear Home
    removeChildren(document.getElementById("Home"));
    clickNav("navbar-Home");
    query = getSearchString();
    const studentIndex = query.indexOf("student=")
    if(studentIndex==-1){
        generateHomeHTML(contentUrl);
    } else {
        let studentName = query.substr(studentIndex+8);
        const studentHttp = loadFileAsync(contentUrl+"students/" + studentName + ".md");
        studentHttp.onreadystatechange = function () {
            if (this.readyState == 4 && this.status == 200) {
                generateStudentHTML(this,studentName);
            }
        }
    }
}
function getSearchString(){return window.location.search;}

function generateStudentHTML(studentHTTP,studentName){
    const studentContents = studentHTTP.responseText;
    student = parseContents(studentContents);
    console.log("student = ",student);
    const studentHome = document.createElement("div");
    studentHome.id = "studentHome";
    studentHome.className = "home-text";
    const homeDiv = document.getElementById("Home");
    homeDiv.appendChild(studentHome);
    appendStudentDetailsinDiv(studentHome,student,1)
    // [student, studentDate,studentName] = createStudent(studentContents, studentName + ".md",1);
    //set document title
    document.title = student.name + " | MTech AI IISc"
}

function loadIntroText(introResponse, parentDiv){
    //Introduction
    const introPart = document.createElement("div");
    introPart.className = "home-text"
    para = introResponse.responseText;
    paraS = para.split("~~~");

    for(let i =0;i<paraS.length;i++){
        let para = document.createElement("div");
        para.className = "home-textpara";
        para.innerHTML = paraS[i];
        introPart.appendChild(para);
    }
    parentDiv.appendChild(introPart);
}
function loadstudyAreas(areasResponse,parentDiv){
    //studyAreas Heading
    const areasHeading = document.createElement("div");
    areasHeading.className = "home-header";
    areasHeading.innerHTML = "AI: Extensive scope, broader perspectives";
    areasHeading.id = "study-areas-heading"
    parentDiv.appendChild(areasHeading);

    //Create Page
    const fields = document.createElement("div");
    fields.className= "home-text";
    fields.id = "allFields"
    fieldsData = areasResponse.responseText;
    fieldsDataS = fieldsData.split("+++");
    for (let i = 0;i<fieldsDataS.length;i++){
        let field = document.createElement("div");
        field.className = "field";

        let fieldData =  fieldsDataS[i].trim();
        let fieldDataS =  fieldData.split("\n");

        let fieldName = document.createElement("div");
        fieldName.className = "field-name";
        let fieldLink = document.createElement('a');
        fieldLink.className = "field-name-link";
        fieldLink.target = "_blank";
        fieldNameSplit = fieldDataS[0].split("||");
        fieldLink.href = fieldNameSplit[1];
        fieldLink.innerHTML = fieldNameSplit[0];
        fieldName.appendChild(fieldLink);
        field.appendChild(fieldName);
        uldiv = document.createElement("ul");
        for(let j =1;j<fieldDataS.length;j++){
            let lidiv = document.createElement("li");
            let personName = document.createElement("a");
            personName.className = "name";
            personName.target = "_blank";
            nameSplit = fieldDataS[j].split("||");
            personName.href = nameSplit[1];
            personName.innerHTML = nameSplit[0];
            lidiv.appendChild(personName);
            uldiv.appendChild(lidiv);
        }
        if(fieldDataS.length>1){
            field.appendChild(uldiv);
        }
        fields.appendChild(field);
    }
    parentDiv.appendChild(fields);

}

function generateHomeHTML(dirName){
    //HomePage
    const introhttp = loadFileAsync(dirName+"home/intro.txt");
    const studyAreashttp = loadFileAsync(dirName+"home/studyAreas.txt");

    homeDiv = document.getElementById("Home");
    introHolder = document.createElement("div");
    introHolder.id = "intro-holder"
    studyAreasHolder = document.createElement("div");
    studyAreasHolder.id = "studyAreas-holder"
    homeDiv.appendChild(introHolder);
    homeDiv.appendChild(studyAreasHolder);

    introhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            loadIntroText(this,introHolder);
        }
    }
    studyAreashttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            loadstudyAreas(this,studyAreasHolder);
        }
    }
    //set document title
    document.title = "Students of MTech AI 2020"
}