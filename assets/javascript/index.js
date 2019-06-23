const audio = new Audio('./assets/audio/hoofs.mp3');
audio.volume = .03;

// create a list of words
const wordList = [
    { word: 'King Arthur', image: "arthur.gif", hint: "You make me sad" },
    { word: 'The Black Knight', image: "black-knight.gif", hint: "The guy who won't die" },
    { word: 'Sir Lancelot', image: "lancelot.gif", hint: "Did you kill those guards?" },
    { word: 'Ni!', image: "ni.gif", hint: "It is said far to much" },
    { word: 'The Holy Hand Grenade', image: "hand-grenade.gif", hint: "Not 1, Not 2, but 3" },
    { word: 'A shruberry', image: "shrubbery.gif", hint: "We require a..." },
    { word: 'Just a flesh wound', image: "flesh-wound.gif", hint: "Your arms off!" },
    { word: 'A HERRING!', image: "herring.gif", hint: "You will have to chop down a tree" },
    { word: 'A Newt?', image: "newt.gif", hint: "It got better..." },
    { word: 'With more witches!', image: "witches.gif", hint: "How do you burn a witch?" },
    { word: 'A Duck!', image: "duck.gif", hint: "What floats on water?" },
    { word: 'Sir Robin', image: "sir-robin.gif", hint: "He's not very brave is he?" },
    { word: 'Camelot', image: "camelot.gif", hint: "It is a funny place, maybe we shouldn't go there." },
    { word: 'I seek the Grail', image: "grail.gif", hint: "What is your quest" },
    { word: 'Tim', image: "tim.gif", hint: "Some people call me..." },
    { word: 'The French', image: "french.gif", hint: "Go and boil your bottoms, you sono f a silly person!" },
    { word: 'Caerbannog', image: "rabbit.gif", hint: "What behind the rabit?" },
    { word: 'Lady of the lake', image: "tart.gif", hint: "Some watery tart" }git
];

const losingImages = [
    "sad.gif", "loser.gif", "fart.gif"
]

//create a game object
const Game = {
    // used for moving knights
    knightLocation: [0],
    // knights current location the array
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
    // the state of the fire sprite
    fireState: false,
    // how many wins the user has
    wins: 0,
    // status of the game
    gameState: 'playing',
    //keep track if the audio is playing so that we dont play to many sounds
    audioState: false,
    createKnightLocations: function () {
        // resets the knight location array if this function is called because of resize
        if (this.knightLocation.length > 1) {
            this.knightLocation = [0];
        }
        // divides the screens width by the number of answers
        // creates an array of locations the knights can be on the screen
        for (let i = 0; i < this.incorrectAnswerLimit - 1; i++) {
            this.knightLocation.push(Math.floor(window.innerWidth / (this.incorrectAnswerLimit - 1)) + this.knightLocation[i] - document.getElementById('knight').offsetWidth / 5);
        }
    },
    moveKnights: function () {
        // updates the knights location
        if (this.knightCurrent < this.incorrectAnswerLimit - 1) {
            this.knightCurrent += 1;
            //check if audio is playing when the knights move
            if (this.audioState === false) {
                // if not set the audio state to true
                this.audioState = true;
                // then play the audio
                audio.play().then(() => {
                    this.audioState = false;
                });
            }
        }
    },
    setKnightScreenLocation() {
        // sets the knights location on screen
        document.getElementById('knight').style.left = this.knightLocation[this.knightCurrent] + 'px';
    },
    //toggles the fire on and off
    toggleFire(state) {
        this.fireState = state;
    },
    handleInput(e) {
        // reset cheat code
        if (e.key === '-') {
            this.startOver();
        }
        // check if the key is a letter and only one character long
        // keep the player from guessing after the game is over
        if (/[a-z]/.test(e.key) && e.key.length === 1 && this.gameState === 'playing') {
            this.checkGuesses(e.key);
        }
    },
    updateGuesses() {
        //sets the number of guesses on the screen
        document.querySelector('#guess-location').innerHTML = this.incorrectAnswerLimit - this.guessed.length;
        document.querySelector('#player-guess').innerHTML = this.guessed;
    },
    checkGuesses(guess) {
        // check if the user already guessed the letter
        if (!this.guessed.includes(guess)) {
            // check if the current work contains that letter
            if (!this.currentWord.word.toUpperCase().includes(guess.toUpperCase())) {
                // handle wrong
                //push the guess in to the guess letter array
                if (this.knightCurrent < this.incorrectAnswerLimit - 1) {
                    this.guessed.push(guess);
                    this.moveKnights();
                } else {
                    this.toggleFire(true);
                    this.handleLose();
                }
            } else {
                // handle right guess
                this.replaceUnderScores(guess.toUpperCase())
                if (!this.hiddenWord.includes('_')) {
                    this.handleWin();
                }
            }
            // update guesses on the screen
            this.render();
        }
    },
    replaceUnderScores(letter) {
        //find all occurences of the letter in the word and replace the _
        let indices = [];
        for (let i in this.currentWord.word) {
            if (this.currentWord.word[i].toUpperCase() === letter) {
                indices.push(Number(i));
            }
        }
        this.hiddenWord = this.hiddenWord.split('').map((letter, index) => {
            if (indices.includes(index)) {
                return this.currentWord.word[index]
            } else {
                return letter;
            }
        }).join("");
    },
    updateWord() {
        const wordLocation = document.querySelector('#word-location');
        wordLocation.innerHTML = this.hiddenWord;
    },
    setGuessWord() {
        //get the location to display the word
        const wordLocation = document.querySelector('#word-location');
        // generate a random number between 0 and the length of the word list
        const random = Math.floor(Math.random() * this.wordList.length);
        // assign the random word to the game
        this.currentWord = this.wordList[random];
        // set the html
        wordLocation.innerHTML = this.createEmptyWord(this.currentWord.word);
    },
    createEmptyWord(word) {
        // create a variable to hold the secret word
        let secret = ''
        // check each letter of the selected word if its a letter replace it with _ else 
        // leave it
        word.split('').forEach(function (letter) {
            if (letter.match(/[\w]/) !== null) {
                secret += '_';
            } else {
                secret += letter;
            }
        })
        // set the games hidden word to the underscore version
        this.hiddenWord = secret;
        return secret;
    },
    closeModals() {
        //close modals on the screen
        document.querySelector('#lose-modal').style.display = 'none';
        document.querySelector('#win-modal').style.display = 'none';
    },
    handleLose() {
        // change the gamestate so players cannot enter more characters
        this.gameState = 'lose';
        this.wins = 0;
    },
    handleWin() {
        // change the gamestate so players cannot enter more characters
        this.gameState = 'win';
        this.wins += 1;
    },
    startOver() {
        // short cut to call init
        this.init(true);
    },
    init: function (reset) {
        // clear variable
        this.gameState = 'playing';
        // set the guessed array to 0
        this.guessed = [];
        // set the knight location back to 0
        this.knightCurrent = 0;
        // Get the guessable word
        this.setGuessWord();
        // Create the location where the knights will be displayed
        this.createKnightLocations();
        // turn the fire off :)
        this.toggleFire(false);
        // render all dom changes
        this.render()
        // create an event listener to listen for key presses
        if (!reset) {
            document.querySelector('body').addEventListener('keyup', this.handleInput.bind(this));
            // create an event listener to check for a screen resize
            window.onresize = this.createKnightLocations.bind(this);
            // set the start over buttons to allow the player to start over
            document.querySelectorAll('.play-again').forEach((element) => {
                element.addEventListener('click', () => {
                    this.startOver();
                })
            })
        }
    },
    render(){
        this.updateGuesses();
        this.updateWord()
        this.setKnightScreenLocation();
        if(this.gameState === 'playing'){
            this.closeModals();
        }
        else if(this.gameState === 'win'){
            document.querySelector('#wins').innerHTML = `Wins: ${this.wins}`;
            document.querySelector("#correct-word").innerHTML = this.currentWord.word;
            document.querySelector('#win-img').src = `./assets/images/${this.currentWord.image}`;
            document.querySelector('#win-modal').style.display = 'flex';
        }
        else if(this.gameState === 'lose'){
            document.querySelector('#wins').innerHTML = `Wins: ${this.wins}`;
            document.querySelector('#lose-img').src = `./assets/images/${losingImages[Math.floor(Math.random() * (losingImages.length))]}`;
            document.querySelector('#lose-modal').style.display = 'flex';
        }
        if (this.fireState) {
            document.getElementById('fire').style.display = 'block';
            document.getElementById('effect').style.display = 'block';
            document.getElementById('banner').style.backgroundColor = '#7c6b6c';
        } else {
            document.getElementById('fire').style.display = 'none';
            document.getElementById('effect').style.display = 'none';
            document.getElementById('banner').style.backgroundColor = '#a1baff';
        }
    }
}

//start the game
Game.init();