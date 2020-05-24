/******************************************************************************************************************
* @description          Primary file used by the index.html page to handle the logic for the Tic-Tac-Toe game.
* @createdDate          05/21/2020
* @author               Aggie Wheeler Bateman
*******************************************************************************************************************
* Modification Log
* Developer name        Date                Description of changes
* Steven Bateman        05/23/2020          Modified the computerMove function to check if the HardMode class's
*                                           isEnabled property is true and, if so, use that class's computerMove
*                                           logic to determine where to place the computer's marker
******************************************************************************************************************/
//global variables to use in multiple functions
var userMarker;
var isComputerTurn = false;
var pElementMessageToUser = document.querySelector('p');
var isGameOver = false;

//add element listeners to board and user marker selection selection
function addElementListener(elements){
    for(var i = 0; i < elements.length; i++){
        if(elements[i].id.includes('box')){
            elements[i].addEventListener('click', handleBoardClick);
        } else if(elements[i].id.includes('cross') || elements[i].id.includes('nought')){
            elements[i].addEventListener('click', handleSelectionClick);
        } else if(elements[i].type === 'button'){
            elements[i].addEventListener('click', playAgain);
        }
    }
}

//add event listeners on page load
addElementListener(document.getElementsByTagName('div'));
addElementListener(document.getElementsByTagName('button'));

function handleSelectionClick(event){
    userMarker = event.currentTarget.id;
    var selectionDiv = event.currentTarget.parentNode; //outer div containing selection images
    pElementMessageToUser.textContent = "Good Luck!";
    document.body.setAttribute('id', 'bodyAfter'); //adjust grid layout to remove selection grid
    selectionDiv.innerHTML = ""; //remove outer div containing selection images
    document.getElementById('board-hide').setAttribute('id', 'game-board');
    HardMode.toggleHardModeSliderVisibility();
    initialMove();
}

function chooseFirstPlayer(){
    var players = ['You', 'Computer'];
    var firstPlayer = players[Math.floor(Math.random() * 2)]; //randomly chooses which player will go first
    if(firstPlayer === 'You'){
        pElementMessageToUser.textContent = firstPlayer + " move first!";
    } else {
        pElementMessageToUser.textContent = firstPlayer + " has the first move!";
    }
    return firstPlayer;
}

//function to be called after user marker selection is made
function initialMove(){
    var player = chooseFirstPlayer();
    if(player === "Computer"){
        isComputerTurn = true;
        computerMove();
    }
}

function handleBoardClick(event){
    //event is the object that represents the event fired
    //target is an object that represents the element that fired the event
    //cannot use elements[i] since when the event is fired, i will always be outside of the elements' NodeList indexes
    if(userMarker === 'nought'){
        addMark(event.target, 'nought');
    } else {
        addMark(event.target, 'cross');
    }
    isComputerTurn = true; //set computer to play after user plays
    //check to see if a win has been achieved before the computer makes its move,
    //and prevent it from doing so if there is a win or draw
    if(isGameOver){
        return;
    }
    computerMove();
}

function computerMove(){
    var computerMove;
    if (!HardMode.isEnabled) {
        var unmarkedBoxes = document.getElementsByClassName('unmarked'); //all div boxes that haven't been used
        computerMove = unmarkedBoxes[Math.floor(Math.random() * unmarkedBoxes.length)] //selection of random unused div element box
    } else {
        computerMove = HardMode.computerMove();
    }
    if(userMarker === 'nought'){
        addMark(computerMove, 'cross');
    } else {
        addMark(computerMove, 'nought');
    }
    isComputerTurn = false; //set user to play after computer plays
}

//function to add either a cross or nought mark
function addMark(element, mark){
    var markImageElement = document.createElement('img');
    markImageElement.setAttribute('src', 'media/' + mark + '.png');
    element.appendChild(markImageElement);
    element.removeEventListener('click', handleBoardClick);
    element.removeAttribute('class'); //remove class of 'unmarked'
    //check for victory after each marker placement
    element.setAttribute('class', mark);
    var markElements = document.querySelectorAll('.' + mark);
    checkVictory(markElements);
}

function checkVictory(markedElements){
    //check for a draw by looking to see if all elements have been marked;
    var winningElements = [['a-box', 'b-box', 'c-box'], ['d-box', 'e-box', 'f-box'], ['g-box', 'h-box', 'i-box'], //rows
                           ['a-box', 'd-box', 'g-box'], ['b-box', 'e-box', 'h-box'], ['c-box', 'f-box', 'i-box'], //columns
                           ['a-box', 'e-box', 'i-box'], ['c-box', 'e-box', 'g-box']]; //diagonals
    var markedIds = [];

    //adds all elements that have been marked of a players mark type passed in to an empty array
    for(var i = 0; i < markedElements.length; i++){
        markedIds.push(markedElements[i].id);
    }

    //checks each array in winningElement to see if one matches the markedIds
    for(var i = 0; i < winningElements.length; i++){
        var count = 0;
        for(var j = 0; j < 3; j++){
            if(markedIds.includes(winningElements[i][j])){
                count++;
            }
        }

        //checks for a matching 3 array elements at the end of each winningElement array check
        if(count === 3 && isComputerTurn){
            gameOver("The computer wins!");
            return;
        } else if(count === 3 && !isComputerTurn){
            gameOver("You win!");
            return;
        } else if(document.querySelectorAll('.unmarked').length === 0 && i === winningElements.length - 1){
            gameOver("It's a draw!");
        }
    }
}

//called when there is a winning condition or a draw
function gameOver(userMessage){
    isGameOver = true;
    pElementMessageToUser.textContent = userMessage;
    document.querySelector('button').removeAttribute('id');
    HardMode.toggleHardModeSliderVisibility();
    removeListenerAfterWin();
}


function removeListenerAfterWin(){
    var unmarkedElements = document.getElementsByClassName('unmarked');
    for(var i = 0; i < unmarkedElements.length; i++){
        unmarkedElements[i].removeEventListener('click', handleBoardClick);
    }
}

//next three functions reset the board state, selection state, and adds/removes playAgain button which has an eventListener
function playAgain(){
    document.querySelector('button').setAttribute('id', 'button-hide'); //remove play again button
    resetSelectionState();
    resetGameBoardState();
    addElementListener(document.getElementsByTagName('div')); //reapply board event listeners
    addElementListener(document.getElementsByTagName('button')); //apply replay button event listener

    var gameBoard = document.getElementById('game-board'); //remove game board
    gameBoard.removeAttribute('id');
    gameBoard.setAttribute('id', 'board-hide');

    isGameOver = false;
}

function resetSelectionState(){
    pElementMessageToUser.textContent = "Select cross or nought:"; //add selection div and contents
    document.body.removeAttribute('id');
    var selectionDiv = document.getElementById('selection');
    var crossImageElement = document.createElement('div');
    var noughtImageElement = document.createElement('div');
    var crossImage = document.createElement('img');
    var noughtImage = document.createElement('img');
    crossImage.setAttribute('src', 'media/cross.png');
    noughtImage.setAttribute('src', 'media/nought.png');
    crossImageElement.setAttribute('id', 'cross');
    noughtImageElement.setAttribute('id', 'nought');
    crossImageElement.appendChild(crossImage);
    noughtImageElement.appendChild(noughtImage);
    selectionDiv.appendChild(crossImageElement);
    selectionDiv.appendChild(noughtImageElement);
}

function resetGameBoardState(){
    var crossElements = document.getElementsByClassName('cross');
    //use a while loop since getElementsByClassName is a LIVE NodeList and it dynamically changes the list each time setAttribute changes the class value
    while(crossElements.length){
        crossElements[0].setAttribute('class', 'unmarked');
    }

    var noughtElements = document.getElementsByClassName('nought');
    //use a while loop since getElementsByClassName is a LIVE NodeList and it dynamically changes the list each time setAttribute changes the class value
    while(noughtElements.length){
        noughtElements[0].setAttribute('class', 'unmarked');
    }

    var resetGameBoardElements = document.getElementsByClassName('unmarked');
    for(var i = 0; i < resetGameBoardElements.length; i++){
        if(resetGameBoardElements[i].querySelector('img') != null){
            resetGameBoardElements[i].removeChild(resetGameBoardElements[i].querySelector('img'));
        }
    }
}

var date = new Date();
document.querySelector('footer').innerHTML = "Aggie Wheeler Bateman &copy; " +  date.getFullYear() + "<a href=\"https://www.aggiewheelerbateman.com\" target=\"_blank\">Personal Portfolio</a>";
