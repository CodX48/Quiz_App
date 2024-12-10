const optionsArray = [
    { text: "Any Category", id: "any" },
    { text: "General Knowledge", id: "9" },
    { text: "Entertainment: Books", id: "10" },
    { text: "Entertainment: Film", id: "11" },
    { text: "Entertainment: Music", id: "12" },
    { text: "Entertainment: Musicals & Theatres", id: "13" },
    { text: "Entertainment: Television", id: "14" },
    { text: "Entertainment: Video Games", id: "15" },
    { text: "Entertainment: Board Games", id: "16" },
    { text: "Science & Nature", id: "17" },
    { text: "Science: Computers", id: "18" },
    { text: "Science: Mathematics", id: "19" },
    { text: "Mythology", id: "20" },
    { text: "Sports", id: "21" },
    { text: "Geography", id: "22" },
    { text: "History", id: "23" },
    { text: "Politics", id: "24" },
    { text: "Art", id: "25" },
    { text: "Celebrities", id: "26" },
    { text: "Animals", id: "27" },
    { text: "Vehicles", id: "28" },
    { text: "Entertainment: Comics", id: "29" },
    { text: "Science: Gadgets", id: "30" },
    { text: "Entertainment: Japanese Anime & Manga", id: "31" },
    { text: "Entertainment: Cartoon & Animations", id: "32" }
  ];
  let list = ''
  optionsArray.forEach(ele => list+=`<p key="${ele.id}">${ele.text}</p>`);


  function page1(){
    return `<div id="selection" class="page1">
    <div class="welcome-mes"><h1>Welcome to the Ultimate Quiz Challenge! </h1>
    <p>Ready to test your knowledge and have some fun?
This quiz will take you on a journey through fascinating topics and tricky questions.</p>
    </div>
    <form>
    <input id="namehandel" type="text" value="" placeholder="Enter your name..." />
    <button id="sendName">Next</button>
    </form>
    </div>`  
  }
  
  function page2(){
    return `<div id="selection" class="page2">

    <div class="category-selection-cont"><h3> You can choose one of this category: </h3> <p class="selected"></p></div>
    <div class="category-list-cont">${list}</div>

    <button>Next</button>
    </div>`
  }

  function page3(){
    return `<div id="selection" class="page3">

    <div class="Q-diff-cont"><p key="easy">Easy</p> <p key="medium">Medium</p> <p key="hard">Hard</p></div>


    <div class="Q-type-cont"> <p key="multiple">MCQ</p> <p key="boolean">True / False</p> </div>

    <div class="Q-num-cont">
    <h3>How Many Q Do You Need?</h3> 
    <div class="Q-mount"></div>
    </div>

    <button key="start">Start</button>
    
    </div>`
  }

  export {page1,page2,page3};