function clickNav(clicked_id) {
    divIdString = clicked_id.substring(7)

    document.getElementById("Home").classList.add("inactive")
    document.getElementById("Students").classList.add("inactive");
    document.getElementById("Labs").classList.add("inactive");

    document.getElementById("Home").classList.remove("active");
    document.getElementById("Students").classList.remove("active");
    document.getElementById("Labs").classList.remove("active");

    document.getElementById(divIdString).classList.remove("inactive");
    document.getElementById(divIdString).classList.add("active");


    document.getElementById("navbar-Home").classList.remove("navbar-active");
    document.getElementById("navbar-Students").classList.remove("navbar-active");
    document.getElementById("navbar-Labs").classList.remove("navbar-active");
    document.getElementById(clicked_id).classList.add("navbar-active");



}

function setHash(clicked_id){
    divIdString = clicked_id.substring(7);
    const navTitle = document.title;
    const navUrl = window.location.origin + window.location.pathname + window.location.search + "#"+ divIdString;
    let contentUrl;
    const indexOfIndex = window.location.pathname.indexOf("index.html");
    if(indexOfIndex==-1){
        contentUrl = window.location.origin + window.location.pathname + 'content/'
    } else {
        contentUrl = window.location.origin + window.location.pathname.substr(0,indexOfIndex) + 'content/'
    }

    const navState = {"title":navTitle,"url":navUrl,"contentUrl":contentUrl};

    history.pushState(navState, navTitle, navUrl);
}

function seeMoreAbstract(element) {
    if (element.classList.contains("student-writeup-short") && isOverflown(element)) {
        element.classList.remove("student-writeup-short");
        element.classList.add("student-writeup");


        //create a see less token
        const newdiv = document.createElement("div");
        newdiv.innerHTML = "...See Less<i class=\"arrow up\"></i>";
        newdiv.className = "student-writeup-seeless";
        newdiv.setAttribute("onClick", "seeLessAbstract(this)");
        // newdiv.onclick = "seeLessAbstract(newdiv)";
        element.parentElement.appendChild(newdiv);

        seemore = element.parentElement.getElementsByClassName("student-writeup-seemore")[0];
        seemore.parentElement.removeChild(seemore);


    }
}


function setAbstracts() {
    abstracts = document.getElementsByClassName("student-writeup-short");
    for (let i = 0; i < abstracts.length; i++) {
        let abstract = abstracts.item(i);
        let abstractDone = abstract.parentElement.getElementsByClassName("student-writeup-seemore").length;
        if (isOverflown(abstract) && !abstractDone) {
            //create a see less token
            const newdiv = document.createElement("div");
            newdiv.innerHTML = "...See More<i class=\"arrow down\"></i>";
            newdiv.className = "student-writeup-seemore"
            newdiv.setAttribute("onClick", "seeMoreAbstract(this.parentElement.getElementsByClassName('student-writeup-short')[0])");
            abstract.parentElement.appendChild(newdiv);
        }
    }

}




function seeLessAbstract(element) {
    const abstract = element.parentElement.getElementsByClassName("student-writeup").item(0);
    abstract.classList.remove("student-writeup");
    abstract.classList.add("student-writeup-short");
    const newdiv = document.createElement("div");
    newdiv.innerHTML = "...See More<i class=\"arrow down\"></i>";
    newdiv.className = "student-writeup-seemore"
    newdiv.setAttribute("onClick", "seeMoreAbstract(this.parentElement.getElementsByClassName('student-writeup-short')[0])");
    abstract.parentElement.appendChild(newdiv);
    element.parentNode.removeChild(element);
}



//Touch

function oneRingToSwipemAll(){
    //right-swipe on Home
    document.getElementById('Home').addEventListener('swiped-right', function (e) {
        clickNav("navbar-Labs");
    });
    //left-swipe on Home
    document.getElementById('Home').addEventListener('swiped-left', function (e) {
        clickNav("navbar-Students");
    });


    //right-swipe on Students
    document.getElementById('Students').addEventListener('swiped-right', function (e) {
        clickNav("navbar-Home");
    });
    //left-swipe on Students
    document.getElementById('Students').addEventListener('swiped-left', function (e) {
        clickNav("navbar-Labs");
    });

    //right-swipe on Labs
    document.getElementById('Labs').addEventListener('swiped-right', function (e) {
        clickNav("navbar-Students");
    });
    //left-swipe on Labs
    document.getElementById('Labs').addEventListener('swiped-left', function (e) {
        clickNav("navbar-Home");
    });
}
