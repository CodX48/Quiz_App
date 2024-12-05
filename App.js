//https://opentdb.com/api.php?amount=10&category=27
import {page1,page2,page3} from "./selectList.js";
//randring
[page1(),page2(),page3()].forEach(ele=>{
    document.querySelector('.selection-list').innerHTML += ele;
});

// the information about the q
let Q ={
    amount:5,
    category:'any',
    difficulty:"easy",
    type:"multiple"
}
//information about the user

let userInfo = {
    name:"",
    user_ans: []
    ,score: 0
}

async function getQ() {
    const response = await fetch(`https://opentdb.com/api.php?amount=${Q.amount}&category=${Q.category}&difficulty=${Q.difficulty}&type=${Q.type}`);
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

function handelUserANS(Ans){
    userInfo.user_ans.push({
        selectedANS:Ans
    })

}

const buttons = document.querySelectorAll('button');
buttons.forEach(button => {
  button.addEventListener('click', event => {
    if(button.getAttribute('key') == 'start'){
        setTimeout(async ()=>{
            data = await getQ();
            handelANS();
            //console.log(exam_ans)
            loadQ(data)
            //console.log(data.results);
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
                 //console.log(Q); 
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
             //console.log(Q); 
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
             //console.log(Q); 
             event.preventDefault();
        }
        })
    })
}
handelQtype();

//he gonna take the arr and go over it till the end of it, our goal is to every time i click next i need to increment the index by 1 so every time the index is been changed, it is for changing the data 
// there is also a event listener to know the choosen and compare it to the correct answer so we calc the exam result 
let Q_incrementer = 0;

function loadQ(Data) {
    if (Data.response_code == '0' && Array.isArray(Data.results)) {
        questionsHandel(Q_incrementer, Data);
        //console.log(Data)
    } else {
        console.log("No data or invalid format");
    }
}

function renderQuizSection(Question) {
    let answersHTML = `<p id="Quiz_Ans">${Question.correct_answer}</p>`;
    Question.incorrect_answers.forEach((ele) => {
        answersHTML += `<p id="Quiz_Ans">${ele}</p>`;
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
 //console.log(userInfo.name);
 Event.preventDefault();
});

// this function is made to calc handel the user ans
document.addEventListener("click",(Event)=>{
    if(Event.target.id == "Quiz_Ans"){
        handelUserANS(Event.target.textContent)
        //console.log()
    }
});

document.addEventListener("click",(Event)=>{
    if(Event.target.getAttribute('key') == 'lastQ'){
        console.log(userInfo)
        console.log(exam_ans)
    }
})

