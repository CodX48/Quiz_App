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
            console.log(data)
            handelANS();
            loadQ(data);
        } ,1000);

        
    }else{
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

function handelQtype(){
    document.querySelectorAll('.Q-type-cont p').forEach(ele =>{
        ele.addEventListener('click',(event)=>{
            document.querySelectorAll('.Q-type-cont p').forEach(p => {
                p.style.background = '#45404b';
            });
            event.target.style.background = '#9B7EBD';
        const typeKey = ele.getAttribute('key');

        if (typeKey) {
            Q = { ...Q, type: typeKey }; 
             event.preventDefault();
        }
        let Q_mount;
    console.log("i came")
    numofQ().then(maxQuestions =>{
        Q_mount = maxQuestions;
        console.log(Q_mount)
        let Q_mountEle = ''
        for(let x  = 5 ; x < Q_mount ; x+=5){
            Q_mountEle += `<p id="${x}">${x}</p>`
        }
        document.querySelector('.Q-mount').innerHTML = Q_mountEle;
    });
    
    });
});
    
}
handelQtype();

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
    let answersHTML = `<p id="Quiz_Ans">${Question.correct_answer}</p>`;
    Question.incorrect_answers.forEach((ele) => {
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
async function numofQ() { // this function gonna be the last function before start the exam so the user can only choose the available amount of Q
    let low = 1;
    let high = 50;
    let mid;

    while (low < high - 1) {
        mid = Math.floor((low + high) / 2);
        let testQ = { ...Q, amount: mid };
        await new Promise(resolve => setTimeout(resolve, 5000));
        try {
            let data = await getQ(testQ);
            if (data.response_code === 0) {
                low = mid; 
            } else {
                high = mid;
            }
        } catch (error) {
            console.error(`Error querying API with mid ${mid}:`, error); // Catch network or API errors
            throw new Error("Failed to query the API.");
        }
    }
    return low;
}




