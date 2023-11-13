import { handleComputerTurn } from "./computerMove.js" ;

const grids = document.querySelectorAll('.grid') ;
const gridPositionArray = [0, 0, 0, 0, 0, 0, 0, 0, 0] ;
const winningCombinations = [
  [0, 1, 2], [3, 4, 5], [6, 7, 8],
  [0, 3, 6], [1, 4, 7], [2, 5, 8],
  [0, 4, 8], [2, 4, 6]
] ;

const rematchButton = document.getElementById('rematch-button') ;
const playWithComputerButton = document.getElementById('play-with-computer-button') ;

let turnX = true ;
let playingWithComputer = false ;
let gameWon = false ;

grids.forEach(grid => {
  grid.addEventListener('click', handleGridClick) ;
}) ;

rematchButton.addEventListener('click', () => {
  restartGame() ;
}) ;

playWithComputerButton.addEventListener('click', () => {
  if (playingWithComputer) {
    playingWithComputer = false ;
    playWithComputerButton.innerHTML = 'PLAY WITH COMPUTER' ;
    restartGame() ;
  } else {
    playingWithComputer = true ;
    playWithComputerButton.innerHTML = 'PLAY WITH A FRIEND' ;
    restartGame() ;
  }
}) ;

//handle HUMAN grid click on any chosen square, based on turn

function handleGridClick(event) {
  const grid = event.currentTarget ;

  if (!grid.classList.contains('no-change') && !gameWon) {
    const gridPosition = grid.dataset.gridPosition ;

    if (turnX) {
      grid.classList.add('no-change') ;
      turnX = false ;

      grid.innerHTML = `
        <svg width="100" height="100" stroke="rgb(255, 255, 255)" stroke-width="15" stroke-linecap="round">
          <path d="M15,15 L85,85" />
          <path d="M85,15 L15,85" />
        </svg>
      ` ;

      gridPositionArray[gridPosition] = 1 ;
      checkWin(1) ;

      if (playingWithComputer) {
        handleComputerTurn(grids, winningCombinations, gridPositionArray, checkWin) ;
        turnX = true ;
      }
    } else if (!turnX && !playingWithComputer) {
      grid.classList.add('no-change') ;
      turnX = true ;

      grid.innerHTML = `
        <svg width="100" height="100" stroke="rgb(255, 255, 255)" stroke-width="15" fill="none">
          <circle cx="50" cy="50" r="40" />
        </svg>
      ` ;

      gridPositionArray[gridPosition] = 2 ;
      checkWin(2) ;
    }
  }
}

function restartGame() {
  gridPositionArray.forEach((grid, index) => {
    gridPositionArray[index] = 0 ;
  }) ;

  turnX = true ;
  gameWon = false ;

  grids.forEach(grid => {
    grid.innerHTML = '' ;
    grid.classList.remove('no-change') ;
    grid.addEventListener('click', handleGridClick) ;

    document.getElementById('player-won').innerHTML = '' ;
  }) ;
}

//every turn checks if a player has won OR drawn

function checkWin(playerWon) {
  if (!gridPositionArray.includes(0)) {
    gameWon = true ;

    document.getElementById('player-won').innerHTML = 'GAME DRAWN!' ;

    grids.forEach((grid) => grid.removeEventListener('click', handleGridClick)) ;
  }

  for (const combination of winningCombinations) {
    const [a, b, c] = combination ;

    if (gridPositionArray[a] === playerWon && gridPositionArray[b] === playerWon && gridPositionArray[c] === playerWon) {
      gameWon = true ;

      document.getElementById('player-won').innerHTML = `PLAYER ${playerWon} WON!` ;

      grids.forEach((grid) => grid.removeEventListener('click', handleGridClick)) ;

      break ;
    }
  }
}