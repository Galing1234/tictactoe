export function handleComputerTurn(grids, winningCombinations, gridPositionArray, checkWin) {
  const result = checkWinner(winningCombinations, gridPositionArray) ;
  if (result !== null) {
    if (result === 1) {
      return -1 ;
    } else if (result === 2) {
      return 1 ;
    } else {
      return 0 ;
    }
  }
  
  const bestMove = getBestMove(winningCombinations, gridPositionArray) ;
  const grid = grids[bestMove] ;

  grid.classList.add('no-change') ;
  grid.innerHTML = `
    <svg width="100" height="100" stroke="rgb(255, 255, 255)" stroke-width="15" fill="none">
      <circle cx="50" cy="50" r="40" />
    </svg>
  ` ;

  gridPositionArray[grid.dataset.gridPosition] = 2 ;
  checkWinner(winningCombinations, gridPositionArray) ;
  checkWin(2) ;
}

function getBestMove(winningCombinations, gridPositionArray) {
  let bestMove ;
  let bestScore = -Infinity ;
  
  for (let i = 0 ; i < gridPositionArray.length ; i++) {
    if (gridPositionArray[i] === 0) {
      gridPositionArray[i] = 2 ; // Simulate AI's move
      const score = minimax(winningCombinations, gridPositionArray, 0, false) ;
      gridPositionArray[i] = 0 ; // Undo the move

      if (score > bestScore) {
        bestScore = score ;
        bestMove = i ;
      }
    }
  }

  return bestMove ;
}

function minimax(winningCombinations, gridPositionArray, depth, isMaximizing) {
  const result = checkWinner(winningCombinations, gridPositionArray) ;
  if (result !== null) {
    if (result === 1) {
      return -1 ;
    } else if (result === 2) {
      return 1 ;
    } else {
      return 0 ;
    }
  }

  if (isMaximizing) {
    let bestScore = -Infinity ;
    for (let i = 0 ; i < gridPositionArray.length ; i++) {
      if (gridPositionArray[i] === 0) {
        gridPositionArray[i] = 2 ;
        const score = minimax(winningCombinations, gridPositionArray, depth + 1, false) ;
        gridPositionArray[i] = 0 ;
        bestScore = Math.max(score, bestScore) ;
      }
    }
    return bestScore ;
  } else {
    let bestScore = Infinity ;
    for (let i = 0 ; i < gridPositionArray.length ; i++) {
      if (gridPositionArray[i] === 0) {
        gridPositionArray[i] = 1 ;
        const score = minimax(winningCombinations, gridPositionArray, depth + 1, true) ;
        gridPositionArray[i] = 0 ;
        bestScore = Math.min(score, bestScore) ;
      }
    }
    return bestScore ;
  }
}

function checkWinner(winningCombinations, gridPositionArray) {
  for (const winningCombination of winningCombinations) {
    const [a, b, c] = winningCombination ;
    if (
      gridPositionArray[a] &&
      gridPositionArray[a] === gridPositionArray[b] &&
      gridPositionArray[a] === gridPositionArray[c]
    ) {
      return gridPositionArray[a] ;
    }
  }

  if (gridPositionArray.includes(0)) {
    return null ; // Game still ongoing
  } else {
    return 0 ; // It's a draw
  }
}
