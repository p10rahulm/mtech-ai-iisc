
function loadStudents(contentUrl) {

    dirName = contentUrl + 'students/';
    allStudentsFile = "students.txt";
    const allStudentsFileHttp = loadFileAsync(dirName + allStudentsFile);
    allStudentsFileHttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            removeChildren(document.getElementById("list-of-students"));
            parseStudents(this.responseText);
        }
    }
}

function parseStudents(textFile) {
    const trimStudentsFile = textFile.trim()
    studentsArr = trimStudentsFile.split("\n");
    studentsObjectArray = []
    for (let i = 1; i < studentsArr.length; i++) {
        studentsObjectArray.push(getStudentDetails(studentsArr[i]));
    }
    generateStudentsHTML(studentsObjectArray);
}


function getStudentDetails(studentLine) {
    studentLine = studentLine.trim();
    student = {};
    studentDetailsArray = studentLine.split("||");
    student.email = studentDetailsArray[0].trim();
    student.name = studentDetailsArray[2].trim();
    student.profName = studentDetailsArray[3].trim();
    student.labName = studentDetailsArray[4].trim();
    student.labWebsite = studentDetailsArray[5].trim();
    student.mlInterests = studentDetailsArray[6].trim();
    student.hobbies = studentDetailsArray[7].trim();
    student.websiteLink = studentDetailsArray[8].trim();
    student.photoLink = studentDetailsArray[9].trim();
    return student
}

function generateStudentsHTML(studentsArray){
    const allstudents = document.getElementById("list-of-students");
    for(let i =0;i<studentsArray.length;i++){
        student = studentsArray[i];
        let studentDiv = document.createElement("div");
        studentDiv.id = student.name.replace(/\s+/g, '-').toLowerCase();
        studentDiv.className = "student-holder"
        appendStudentDetailsinDiv(studentDiv,student);
        allstudents.appendChild(studentDiv)

    }
}

function appendStudentDetailsinDiv(studentDiv,student){
    studentPhotoHolder = document.createElement("div");
    studentPhotoHolder.className = "student-photo-holder";
    studentMetaHolder = document.createElement("div");
    studentMetaHolder.className = "student-meta-holder";
    studentDiv.appendChild(studentPhotoHolder);
    studentDiv.appendChild(studentMetaHolder);

    studentPhoto = document.createElement("img");
    if(student.photoLink){
        studentPhoto.src = student.photoLink
        studentPhoto.alt = student.name;
        studentPhoto.setAttribute("loading", "lazy");
        studentPhoto.width = "150"
        studentPhoto.height = "175"
    } else {
        studentPhoto.src = "assets/images/placeholder_img.png"
    }
    studentPhoto.className = "student-photo";
    studentPhotoHolder.appendChild(studentPhoto);



    if(student.name){
        studentName = document.createElement("div");
        studentName.className = "student-name"

        if(student.websiteLink){
            studentNameLink = document.createElement("a");
            studentNameLink.href = student.websiteLink;
            studentNameLink.target = "_blank";
            studentNameLink.className = "student-name-link";
            studentNameLink.innerHTML = student.name;
            studentName.appendChild(studentNameLink);
        } else {
            studentName.innerHTML = student.name
        }
        studentMetaHolder.appendChild(studentName)
    }
    if(student.labName){
        studentlabName = document.createElement("div");
        studentlabName.className = "student-lab-name"

        if(student.labWebsite){
            studentLabLink = document.createElement("a");
            studentLabLink.href = student.labWebsite;
            studentLabLink.target = "_blank";
            studentLabLink.className = "student-lab-name-link";
            studentLabLink.innerHTML = student.labName
            studentlabName.appendChild(studentLabLink);
        } else {
            studentlabName.innerHTML = student.labName
        }
        studentMetaHolder.appendChild(studentlabName)
    }
    if(student.mlInterests){
        studentMLInterests = document.createElement("div");
        studentMLInterests.className = "students-ml-interests"
        studentMLInterests.innerHTML = student.mlInterests
        studentMetaHolder.appendChild(studentMLInterests)
    }
    if(student.hobbies){
        studentHobbies = document.createElement("div");
        studentHobbies.className = "students-hobbies"

        studentHobbiesLabel = document.createElement("span");
        studentHobbiesLabel.className = "students-hobbies-label"
        studentHobbiesLabel.classList.add("student-meta-label");
        studentHobbiesLabel.innerHTML = "Hobbies: "

        studentHobbiesContent = document.createElement("span");
        studentHobbiesContent.className = "students-hobbies-content";
        studentHobbiesContent.classList.add("student-meta-content");
        studentHobbiesContent.innerHTML = student.hobbies;

        studentHobbies.appendChild(studentHobbiesLabel);
        studentHobbies.appendChild(studentHobbiesContent);
        studentMetaHolder.appendChild(studentHobbies);
    }
    // generateDownloads(student);
    return studentDiv;
}
function generateDownloads(student){
    docName = student.name.replace(/\s+/g, '-').toLowerCase() + ".md";
    docText = generateDocument(student);
    console.log("docName=",docName);
    console.log("docText=",docText);
    download(docName,docText);
}
function generateDocument(studentObj){
    let doc = "";
    doc = doc.concat("+++\n");
    for (let [key, value] of Object.entries(studentObj)) {
        doc = doc.concat(key," = \"",value,"\"\n");
    }
    doc = doc.concat("+++\n\n");
    doc = doc.concat("This is some placeholder text. Please fill your required text here. You may use html tags");
    return doc;
}

function download(filename, text) {
    var element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
    element.setAttribute('download', filename);

    element.style.display = 'none';
    document.body.appendChild(element);

    element.click();

    document.body.removeChild(element);
}