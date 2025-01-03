import { sendmaxnum } from "./DataBase/HandelDataBase.js";
//https://opentdb.com/api.php?amount=10&category=27
import {page1,page2,page3} from "./selectList.js";
//randring
[page1(),page2(),page3()].forEach(ele=>{
    document.querySelector('.selection-list').innerHTML += ele;
});

// the information about the q
let Q ={
    amount:5,
    category:19,
    difficulty:"easy",
    type:"multiple"
}
//information about the user
let userInfo = {
    name:"UnKnown",
    user_ans: {}
    ,score: 0
}

async function getQ(q) {
    const response = await fetch(`https://opentdb.com/api.php?amount=${q.amount}&category=${q.category}&difficulty=${q.difficulty}&type=${q.type}`);
    const data = await response.json();
    return data;
}

let exam_ans = []
let sec = 0;
let data;

function handelANS(){ 
    let  x  = 0;
    data.results.forEach(ele=>{
        exam_ans.push({
            id: x,
            correct_answer: `${ele.correct_answer}`,
        })
        x++;
    })
}


const buttons = document.querySelectorAll('button');
buttons.forEach(button => {
  button.addEventListener('click', event => {
    if(button.getAttribute('key') == 'start'){
        setTimeout(async ()=>{
            data = await getQ(Q);
            handelANS();
            loadQ(data);
        } ,1000);

        
    }else if(button.id == 'sendName'){
        console.log("lol")
        if(document.getElementById('namehandel').value == '' || document.getElementById('namehandel').value == ' '){
            let ele = document.createElement('p')
            ele.style.fontSize = "15px"
            ele.style.fontWeight = "600"
            ele.style.color = "red"
            ele.textContent = 'You must add a name !'
            document.getElementById('namehandel').after(ele);
        }
        else{
        sec = (sec + 1);
        updateCarousel(sec);
    }
    }
    else{
    sec = (sec + 1);
    updateCarousel(sec);
    }
    event.preventDefault();
  });
});

function updateCarousel(index) {
    [document.querySelector('.page1'),document.querySelector('.page2'),document.querySelector('.page3')].forEach(page => {
    page.style.transform = `translateX(-${index * 100}%)`;
  });
}

//here i am handling the category 
function handelcategory() {
    document.querySelectorAll('.page2 p').forEach((ele) => {
            ele.addEventListener('click', (event) => {
            document.querySelectorAll('.page2 p').forEach(p => {
                p.style.background = '#45404b';
            });
            event.target.style.background = '#9B7EBD'
            const categoryKey = ele.getAttribute('key');
            if (categoryKey) {
                Q = { ...Q, category: categoryKey }; 
            }
            event.preventDefault(); // Prevent default behavior (e.g., navigating)
        });
    });
}

handelcategory();

function handeldiff(){
document.querySelectorAll('.Q-diff-cont p').forEach(ele =>{
    ele.addEventListener("click",(event)=>{
        document.querySelectorAll('.Q-diff-cont p').forEach(p => {
            p.style.background = '#45404b';
        });
        event.target.style.background = '#9B7EBD';
        const DiffKey = ele.getAttribute('key');
        if (DiffKey) {
            Q = { ...Q, difficulty: DiffKey }; 
             event.preventDefault();
        }
    })
})
}

handeldiff();
function handelQtype() {
    // Attach click listeners to all Q-type-cont p elements
    document.querySelectorAll('.Q-type-cont p').forEach((ele) => {
      ele.addEventListener('click', (event) => {
        // Reset background for all Q-type-cont p elements
        document.querySelectorAll('.Q-type-cont p').forEach((p) => {
          p.style.background = '#45404b';
        });
  
        // Highlight the clicked element
        event.target.style.background = '#9B7EBD';
  
        const typeKey = ele.getAttribute('key');
        if (typeKey) {
          Q = { ...Q, type: typeKey }; // Update Q object
          event.preventDefault();
        }
  
        // Show the loading alert
        function showLoadingAlert() {
          document.getElementById('loadingAlert').style.display = 'flex';
        }
  
        // Hide the loading alert
        function hideLoadingAlert() {
          document.getElementById('loadingAlert').style.display = 'none';
        }
  
        let Q_mount; // To store the number of questions
  
        // Show loading indicator before fetching
        showLoadingAlert();
  
        // Fetch maxQuestions and dynamically populate .Q-mount
        numofQ()
          .then((maxQuestions) => {
            console.log(maxQuestions);
            Q_mount = maxQuestions;
  
            // Dynamically create Q-mount elements
            let Q_mountEle = '';
            for (let x = 5; x <= Q_mount; x += 5) {
              Q_mountEle += `<p id="${x}">${x}</p>`;
            }
  
            // Add generated elements to .Q-mount
            document.querySelector('.Q-mount').innerHTML = Q_mountEle;
  
            // Reattach event listeners for the new elements
            handelQmount();
          })
          .finally(() => {
            // Always hide the loading alert
            hideLoadingAlert();
          });
      });
    });
  }
  
handelQtype();

function handelQmount(){
    document.querySelectorAll('.Q-mount p').forEach(ele =>{
        ele.addEventListener("click",(Event)=>{
            document.querySelectorAll('.Q-mount p').forEach(p => {
                p.style.background = '#45404b';
            });
            event.target.style.background = '#9B7EBD';

            const QnumId = ele.id;
            if(QnumId){
                Q = {...Q,amount:QnumId}
                Event.preventDefault();
                //console.log(Q)
            }
        })
    })
}

//it gonna take the arr and go over it till the end of it, our goal is to every time i click next i need to increment the index by 1 so every time the index is been changed, it is for changing the data 
// there is also a event listener to know the choosen and compare it to the correct answer so we calc the exam result 
let Q_incrementer = 0;

function handelUserANS(Ans){
    userInfo.user_ans = {...userInfo.user_ans,[Q_incrementer]:Ans}
}

function loadQ(Data) {
    if (Data.response_code == '0' && Array.isArray(Data.results)) {
        questionsHandel(Q_incrementer, Data);
        
    } else {
        console.log("No data or invalid format");
    }
}

function renderQuizSection(Question) {
    const answers = [Question.correct_answer,...Question.incorrect_answers].sort(()=> Math.round() - 0.5);
    let answersHTML = ''
    answers.forEach((ele) => {
        answersHTML += `<p id="Quiz_Ans" key="">${ele}</p>`;
    });

    return `
    <div class="Q-section">
        <h2 class="main-Q" id="${Q_incrementer}">${Question.question}</h2>
        <div class="Answers-sec">${answersHTML}</div>
        <button class="quiz-btn" ${Q_incrementer === Q.amount - 1 ? 'key="lastQ"' : 'key="nextQ"'}>Next</button>
    </div>`;
}

function questionsHandel(index, Data) {
    document.querySelector(".selection-list").innerHTML = renderQuizSection(Data.results[index]);
    
}
document.querySelector(".selection-list").addEventListener('click', (event) => {
    if (event.target.getAttribute('key') === 'nextQ') {
        if (Q_incrementer < data.results.length - 1) {
            Q_incrementer++;
            loadQ(data);
        }

    } else if (event.target.getAttribute('key') === 'lastQ') {
        console.log("End of quiz!");
    }
});

//here i will handle the userName input 

document.getElementById('sendName').addEventListener("click",(Event)=>{
 userInfo.name = document.getElementById('namehandel').value;
 Event.preventDefault();
});

// this function is made to calc handel the user ans
document.addEventListener("click",(Event)=>{
    if(Event.target.id == "Quiz_Ans"){
        document.querySelectorAll('#Quiz_Ans').forEach(ele=>{
            ele.style.color = '#1d1724'
            ele.style.background = 'none'
        })
        Event.target.style.color = '#e8e8e8'
        Event.target.style.background = '#9B7EBD'
        handelUserANS(Event.target.textContent)
    }
});

document.addEventListener("click",(Event)=>{
    if(Event.target.getAttribute('key') == 'lastQ'){
        HandelUserScore();
        setTimeout(()=>{
            HandelresultPage();
            const selectionList = document.querySelector('.selection-list');
            if (selectionList) {
                selectionList.style.justifyContent = 'center';
        } }

        ,500);
    }
});


function HandelUserScore(){
    let score = 0;
    for(let i = 0 ; i< Q.amount;i++){
        if(userInfo.user_ans[`${i}`] == exam_ans[i].correct_answer){
            score++;
        }
    }
    userInfo.score = score;
};
 
function HandelresultPage(){
    document.querySelector(".selection-list").innerHTML = ResultPage();
}

function ResultPage(){
    let condetion = userInfo.score < Q.amount/2 ? "Good luck":"Congratulations";

    return `<div class="result-info-page">
    <h1>${condetion} ${userInfo.name}</h1>
    <p>your score is: ${userInfo.score}</p>
    </div>`
}

//here i am tring to add a method that gives me only the available number of questions using binary search algorithem
//Data.response_code == '0' true

async function numofQ() { 
        await new Promise(resolve => setTimeout(resolve, 5000));
        return sendmaxnum(Q);
}

