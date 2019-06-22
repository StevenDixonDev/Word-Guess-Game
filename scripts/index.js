var windowWidth = window.innerWidth;
var incorrectAnswerLimit = 7;
var knightLocation = [];
for(var i = 0; i < incorrectAnswerLimit; i++){
    if(i === 0){
        knightLocation.push(Math.floor(windowWidth/incorrectAnswerLimit) + 0 - document.getElementById('knight').offsetWidth/3);
    }else{
        knightLocation.push(Math.floor(windowWidth/incorrectAnswerLimit) + knightLocation[i-1] - document.getElementById('knight').offsetWidth/3);
    }  
}
//console.log(knightLocation)

var current = 0;

var btn = document.getElementById('move-btn');

btn.addEventListener('click', function(){
    
    document.getElementById('knight').style.left = knightLocation[current] + 'px'; 
    if(current < incorrectAnswerLimit){
        current+=1;
    }else{
        document.getElementById('fire').style.display = 'block';
        document.getElementById('effect').style.display = 'block';
        document.getElementById('banner').style.backgroundColor = '#7c6b6c';
    }
});

let currentWord = '';

const wordList = [
    {word: 'King Arthur', image: "", tune: ""},
    {word: 'The Black Knight', image: "", tune: ""},
    {word: 'Sir Lancelot', image: "", tune: ""},
    {word: 'Ni!', image: "", tune: ""},
    {word: 'The Holy Hand Grenade', image:"", tune: ""},
    {word: 'A shruberry', image: "", tune: ""},
    {word: 'Just a flesh wound', image:"", tune: ""},
    {word: 'A HERRING!', image: "", tune: ""},
    {word: 'A newt?', image: "", tune: ""},
    {word: 'With more Witches!', image: "", tune: ""},
    {word: 'A Duck!', image: "", tune: ""},
    {word: 'Sir Robin', image: "", tune: ""},
    {word: 'Camelot', image: "", tune: ""},
    {word: 'I seek the Grail', images: "", tune: ""},
    {word: 'Tim', images: "", tune: ""},
    {word: 'The French', image: "", tune: ""},
    {word: 'Caerbannog', image: "", tune: ""},
    
];