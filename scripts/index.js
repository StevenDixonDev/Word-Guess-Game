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
