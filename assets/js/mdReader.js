function loadStudents(contentUrl, filesListPath) {
    dirName = contentUrl + 'students/'
    filesListPath = "files.list";
    const filesListHttp = loadFileAsync(dirName + filesListPath);
    filesListHttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            const filesListRaw = this.responseText.trim();
            const filenames = filesListRaw.split('\n');
            for (let i = 1; i < filenames.length; i++) {
                let studentFile = filenames[i];
                let studenthttp = loadFileAsync(dirName + studentFile);
                //create holders so that it does not go out of place in async
                const studentFileName = studentFile.slice(0, -3);
                const studentHolder = document.createElement("div");
                studentHolder.className = "student-holder"
                studentHolder.id = studentFileName
                document.getElementById("list-of-students").appendChild(studentHolder);

                studenthttp.onreadystatechange = function (studentFileName) {
                    //We need current value of studentFileName, so creating an outer function that returns an inner function
                    innerFunc = function (event) {
                        if (this.readyState == 4 && this.status == 200) {
                            student = parseContents(this.responseText);
                            appendStudentDetailsinDiv(studentHolder,student,0);
                            const articleDiv = studentHolder.getElementsByClassName('student-writeup-short')[0]
                            if(articleDiv){
                                setAbstractsforDiv();
                            }
                        }
                    }
                    return innerFunc;
                }(studentFileName);
            }
        }
    }
}


function setAbstractsforDiv(abstractdiv) {
    const abstractDone = abstractdiv.parentElement.getElementsByClassName("student-writeup-seemore").length;
    if (isOverflown(abstractdiv) && !abstractDone) {
        //create a see less token
        const newdiv = document.createElement("div");
        newdiv.innerHTML = "...See More<i class=\"arrow down\"></i>";
        newdiv.className = "student-writeup-seemore"
        newdiv.setAttribute("onClick", "seeMoreAbstract(this.parentElement.getElementsByClassName('student-writeup-short')[0])");
        abstractdiv.parentElement.appendChild(newdiv);
    }
}

function isOverflown(element) {
    return element.scrollHeight > element.clientHeight || element.scrollWidth > element.clientWidth;
}

function createTalk(talkContents, talkFile, divLocation) {
    const talkKV = parseContents(talkContents);
    const seminar = document.createElement("div");

    let seminarDate = new Date();
    seminar.className = "seminar";
    if (talkKV.title) {
        let metadiv = document.createElement("div");
        if (divLocation == 0) {
            const talkName = talkFile.slice(0, talkFile.indexOf("."))
            metadiv.id = talkName;
            const baseUrl = window.location.origin + window.location.pathname;
            let talkUrl = baseUrl + "?talk=" + talkName;
            metadiv.onclick = function () {
                clickStudent(talkKV.title.valueOf(), talkUrl.valueOf())
            };
        }
        metadiv.innerHTML = talkKV.title;
        metadiv.className = "seminar-title"
        seminar.appendChild(metadiv);
    }
    if (talkKV.author) {
        const metadiv = document.createElement("div");
        metadiv.innerHTML = talkKV.author;
        metadiv.className = "seminar-speaker"
        seminar.appendChild(metadiv);
    }
    if (talkKV.date || talkKV.location) {
        const metadivholder = document.createElement("div");
        metadivholder.className = "seminar-dateloc"
        if (talkKV.date) {
            const metadiv = document.createElement("div");
            let dateStartTime = new Date(talkKV.date);
            seminarDate = dateStartTime;
            if (talkKV.date_end) {
                let dateEndTime = new Date(talkKV.date_end);
                if (dateEndTime.getDate() == dateStartTime.getDate()) {
                    metadiv.innerHTML = dateStartTime.toLocaleString() + '-' + dateEndTime.toLocaleTimeString();
                } else {
                    metadiv.innerHTML = dateStartTime.toLocaleString() + '-' + dateEndTime.toLocaleString();
                }

            } else {
                metadiv.innerHTML = dateStartTime.toLocaleString();
            }
            metadiv.className = "seminar-time"
            metadiv.classList.add("seminar-dateloc-child");
            metadivholder.appendChild(metadiv);
        }
        if (talkKV.location) {
            const metadiv = document.createElement("div");
            metadiv.innerHTML = talkKV.location;
            metadiv.className = "seminar-location"
            metadiv.classList.add("seminar-dateloc-child");
            metadivholder.appendChild(metadiv);
        }
        seminar.appendChild(metadivholder);
    }
    if (talkKV.article) {
        const metadiv = document.createElement("div");
        metadiv.innerHTML = talkKV.article;
        if (divLocation == 0) {
            metadiv.className = "student-writeup-short"
        } else if (divLocation == 1) {
            metadiv.className = "student-writeup"
        } else {
            metadiv.className = "student-writeup-short"
        }

        metadiv.setAttribute("onClick", "seeMoreAbstract(this)")
        seminar.appendChild(metadiv);
    }
    if (divLocation == 1) {
        if (talkKV.notes) {
            const metadiv = document.createElement("div");
            metadiv.innerHTML = talkKV.notes;
            metadiv.className = "seminar-notes"
            seminar.appendChild(metadiv);
        }
        if (talkKV.link_to_paper) {
            const metadiv = document.createElement("div");
            metadiv.innerHTML = talkKV.link_to_paper;
            metadiv.className = "seminar-paper"
            seminar.appendChild(metadiv);
        }
        if (talkKV.link_to_recording) {
            const metadiv = document.createElement("div");
            metadiv.innerHTML = talkKV.link_to_recording;
            metadiv.className = "seminar-recording"
            seminar.appendChild(metadiv);
        }
    }
    return [seminar, seminarDate,talkKV.title];


}

function parseContents(contents) {
    //Remove comments from string: https://stackoverflow.com/questions/5989315/regex-for-match-replacing-javascript-comments-both-multiline-and-inline
    contents = contents.replace(/\/\*[\s\S]*?\*\/|([^\\:]|^)\/\/.*$/gm, '$1');
    const contentLines = contents.split("\n");
    const contentKV = {};
    let inMeta = 0;
    let inContent = 0;
    let lineNo = 0;
    let multiline = "";
    let multilineKey = "";
    for (lineNo = 0; lineNo < contentLines.length && !inContent; lineNo++) {
        if (!inMeta && contentLines[lineNo].trim() == "+++") {
            inMeta = 1;
            continue;
        } else if (inMeta && contentLines[lineNo].trim() == '+++') {
            inContent = 1;
        } else if (inMeta && multiline != "") {
            multiline = multiline.concat('\n', contentLines[lineNo].trim());
            if (multiline.slice(-3) == "'''") {
                contentKV[multilineKey] = multiline.slice(0, -3);
                multiline = "";
                multilineKey = "";

            }

        } else if (inMeta && multiline == "") {
            keyval = contentLines[lineNo].split(/=(.+)/);
            if (keyval.length > 1) {
                let key = keyval[0].trim();
                let val = keyval[1].trim();
                if (val[0] == "\"") {
                    val = val.slice(1, -1);
                    contentKV[key] = val;
                }
                if (val.length > 3 && (val.slice(0, 3) == "'''")) {
                    multilineKey = key;
                    multiline = val.slice(3).trim();
                    if (multiline.slice(-3) == "'''") {
                        contentKV[multilineKey] = multiline.slice(0, -3)
                        multiline = "";
                        multilineKey = "";
                    }
                }
            }
        }


    }

    contentKV.article = contentLines.slice(lineNo).join('\n').trim();
    return contentKV;


}
