// create a list of words
const wordList = [
    { word: 'King Arthur', image: "", hint: "You make me sad" },
    { word: 'The Black Knight', image: "", hint: "The guy who won't die" },
    { word: 'Sir Lancelot', image: "", hint: "Did you kill those guards?" },
    { word: 'Ni!', image: "", hint: "It is said far to much" },
    { word: 'The Holy Hand Grenade', image: "", hint: "Not 1, Not 2, but 3" },
    { word: 'A shruberry', image: "", hint: "We require a..." },
    { word: 'Just a flesh wound', image: "", hint: "" },
    { word: 'A HERRING!', image: "", hint: "You will have to chop down a tree" },
    { word: 'A Newt?', image: "", hint: "It got better..." },
    { word: 'With more witches!', image: "", hint: "How do you burn a witch?" },
    { word: 'A Duck!', image: "", hint: "What floats on water?" },
    { word: 'Sir Robin', image: "", hint: "He's not very brave is he?" },
    { word: 'Camelot', image: "", hint: "It is a funny place, maybe we shouldn't go there." },
    { word: 'I seek the Grail', images: "", hint: "What is your quest" },
    { word: 'Tim', images: "", hint: "Some people call me..." },
    { word: 'The French', image: "", hint: "Go and boil your bottoms, you sono f a silly person!" },
    { word: 'Caerbannog', image: "", hint: "What behind the rabit?" },
    { word: 'Lady of the lake', image: "", hint: "Some watery tart" }
];

//create a game object

const Game = {
    // used for moving knights
    knightLocation: [0],
    knightCurrent: 0,
    // sets the limit of incorrect answers a player can provide
    incorrectAnswerLimit: 7,
    // the current word picked at random
    currentWord: '',
    // the current word with the 
    hiddenWord: '',
    // list of word from above
    wordList,
    // array of words guessed by player
    guessed: [],
    fireState: false,
    wins: 0,
    createKnightLocations: function () {
        // resets the knight location array if this function is called because of resize
        if (this.knightLocation.length > 1) {
            this.knightLocation = [0];
        }
        // divides the screens width by the number of answers
        // creates an array of locations the knights can be on the screen
        for (let i = 0; i < this.incorrectAnswerLimit; i++) {
            this.knightLocation.push(Math.floor(window.innerWidth / this.incorrectAnswerLimit) + this.knightLocation[i] - document.getElementById('knight').offsetWidth / 5);
        }
        //sets the knight location in case the knights location actually is different
        this.setKnightScreenLocation();
    },
    moveKnights: function () {
        // updates the knights location
        if (this.knightCurrent < this.incorrectAnswerLimit) {
            this.knightCurrent += 1;
        } else {
            this.toggleFire(true);
        }
        // set the knights location on screen 
        this.setKnightScreenLocation();
    },
    setKnightScreenLocation() {
        // sets the knights location on screen
        document.getElementById('knight').style.left = this.knightLocation[this.knightCurrent] + 'px';
    },
    //toggles the fire on and off
    toggleFire(state) {
        this.fireState = state;
        if (this.fireState) {
            document.getElementById('fire').style.display = 'block';
            document.getElementById('effect').style.display = 'block';
            document.getElementById('banner').style.backgroundColor = '#7c6b6c';
        } else {
            document.getElementById('fire').style.display = 'none';
            document.getElementById('effect').style.display = 'none';
            document.getElementById('banner').style.backgroundColor = '#a1baff';
        }
    },
    init: function (reset) {
        // clear variable
        this.guessed = [];
        this.knightCurrent = 0;
        // Get the guessable word
        this.setGuessWord();
        // Create the location where the knights will be displayed
        this.createKnightLocations();
        // Write the number of guess left and how many on the screen
        this.updateGuesses()
        // turn the fire off :)
        this.toggleFire(false);
        // create an event listener to listen for key presses
        if(!reset){
        document.querySelector('body').addEventListener('keyup', this.handleInput.bind(this));
        // create an event listener to check for a screen resize
        window.onresize = this.createKnightLocations.bind(this);
        }
    },
    handleInput(e) {
        if (e.key === '-'){
            this.startOver();
        }
        if (/[a-z]/.test(e.key) && e.key.length === 1) {
            this.checkGuesses(e.key);
        }
    },
    updateGuesses(){
        //sets the number of guesses on the screen
        document.querySelector('#guess-location').innerHTML = this.incorrectAnswerLimit - this.guessed.length;
        document.querySelector('#player-guess').innerHTML = this.guessed;
    },
    checkGuesses(guess){
        // check if the user already guessed the letter
        if(!this.guessed.includes(guess)){
            console.log(guess)
            // check if the current work contains that letter
            if(!this.currentWord.word.toUpperCase().includes(guess.toUpperCase())){
                // handle wrong
                //push the guess in to the guess letter array
                console.log('wrong');
                this.guessed.push(guess);
                this.moveKnights();
                if(this.knightCurrent >= this.incorrectAnswerLimit){
                    this.handleLose();
                }
            }else{
                console.log('right');
                // handle right
                this.replaceUnderScores(guess.toUpperCase())
                this.updateWord();
                if(!this.hiddenWord.includes('_')){
                    this.handleWin();
                }
            }
            this.updateGuesses();
        }
    },
    replaceUnderScores(letter){
        //find all occurences of the letter in the word and replace the _
        let indices = [];
        for(let i in this.currentWord.word){
            if(this.currentWord.word[i].toUpperCase() === letter){
                indices.push(Number(i));
            }
        }
        this.hiddenWord = this.hiddenWord.split('').map((letter, index)=>{
            if(indices.includes(index)){
                return this.currentWord.word[index]
            }else{
                return letter;
            }
        }).join("")
    },
    updateWord(){
        const wordLocation = document.querySelector('#word-location');
        wordLocation.innerHTML = this.hiddenWord;
    },
    setGuessWord(){
        //get the location to display the word
        const wordLocation = document.querySelector('#word-location');
        // generate a random number between 0 and the length of the word list
        const random = Math.floor(Math.random() * this.wordList.length);
        // assign the random word to the game
        this.currentWord = this.wordList[random];
        wordLocation.innerHTML = this.createEmptyWord(this.currentWord.word);
    },
    createEmptyWord(word){
        let secret = ''
        word.split('').forEach(function(letter){
            console.log(letter)
            if(letter.match(/[\w]/) !== null){
                secret += '_';
            }else{
                secret += letter;
            }
        })
        this.hiddenWord = secret;
        return secret;
    },
    handleLose(){
        console.log('you lose')
    },
    handleWin(){
        console.log('you win');
    },
    startOver(){
        this.init();
    }
}

Game.init();