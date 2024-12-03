//https://opentdb.com/api.php?amount=10&category=27
import {page1,page2,page3} from "./selectList.js";
//randring
[page1(),page2(),page3()].forEach(ele=>{
    document.querySelector('.selection-list').innerHTML += ele;
});

// the information about the q
let Q ={
    amount:0,
    category:'any',
    difficulty:"easy",
    type:"multiple"
}

document.querySelectorAll('button').forEach(ele => 
    ele.addEventListener('click',()=>{
    if(ele.getAttribute('key') === 'start'){
        setTimeout(async ()=>{
            let data = await getQ();
            console.log(data);
        } ,2000);

    }
}))
async function getQ() {
    const response = await fetch(`https://opentdb.com/api.php?amount=5&category=${Q.category}&difficulty=${Q.difficulty}&type=${Q.type}`);
    const data = await response.json();
    return data;
}

let sec = 0;
const buttons = document.querySelectorAll('button');

buttons.forEach(button => {
  button.addEventListener('click', event => {
    sec = sec === 2 ? 2 : (sec + 1) % 3;
    updateCarousel(sec);
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



