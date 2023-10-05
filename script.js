
const Gameboard = () => {
    const rows = 3;
    const columns = 3;
    const board = [];
    
    for (let i = 0; i < rows; i++) {
        board[i] = [];
        for (let j = 0; j < columns; j++) {
            board[i].push(Cell());
        }
    }

    const getBoard = () => board;
    
    const dropToken = (row, column, player) => {
        if (board[row][column].getValue() === "") {
        board[row][column].addToken(player);
      } else {
        return;
      }
    }

    const printBoard = () => {
        const boardWithCellValues = board.map((row) => row.map((cell) => cell.getValue()))
        console.log(boardWithCellValues);
    }
    
    return { getBoard, dropToken, printBoard }
}

function Cell() {
    let value = "";
  
    const addToken = (player) => {
      value = player;
    };
  
    const getValue = () => value;
  
    return {
      addToken,
      getValue
    };
}

function GameController(
    playerOneName = "Player One",
    playerTwoName = "Player Two"
  ) {
    const board = Gameboard();
  
    const players = [
      {
        name: playerOneName,
        token: "X"
      },
      {
        name: playerTwoName,
        token: "O"
      }
    ];
  
    let activePlayer = players[0];
  
    const switchPlayerTurn = () => {
      activePlayer = activePlayer === players[0] ? players[1] : players[0];
    };
    const getActivePlayer = () => activePlayer;
  
    const printNewRound = () => {
      board.printBoard();
      console.log(`${getActivePlayer().name}'s turn.`);
    };

    const isGameOver = () => {
        const boardState = board.getBoard();
        let rows = 3;
        let columns = 3;

        for (let i = 0; i < rows; i++) {
            if (
                boardState[i][0].getValue() !== "" &&
                boardState[i][0].getValue() === boardState[i][1].getValue() &&
                boardState[i][0].getValue() === boardState[i][2].getValue()
            ) {
                console.log(`Player ${getActivePlayer().name} wins horizontally!`);
                return {
                    isOver: true,
                    winner: `${getActivePlayer().name}`
                };
            }
        }

        for (let i = 0; i < columns; i++) {
            if (
                boardState[0][i].getValue() !== "" &&
                boardState[0][i].getValue() === boardState[1][i].getValue() &&
                boardState[0][i].getValue() === boardState[2][i].getValue()
            ) {
                console.log(`Player ${getActivePlayer().name} wins vertically!`);
                return {
                    isOver: true,
                    winner: `${getActivePlayer().name}`
                };
            }
        }

        if (
            boardState[0][0].getValue() !== "" &&
            boardState[0][0].getValue() === boardState[1][1].getValue() &&
            boardState[0][0].getValue() === boardState[2][2].getValue()
        ) {
            console.log(`Player ${getActivePlayer().name} wins diagonally!`);
            return {
                isOver: true,
                winner: `${getActivePlayer().name}`
            };
        }

        if (
            boardState[0][2].getValue() !== "" &&
            boardState[0][2].getValue() === boardState[1][1].getValue() &&
            boardState[0][2].getValue() === boardState[2][0].getValue()
        ) {
            console.log(`Player ${getActivePlayer().name} wins diagonally!`);
            return {
                isOver: true,
                winner: `${getActivePlayer().name}`
            };
        }

        const isTie = boardState.every((row) =>
            row.every((cell) => cell.getValue() !== "")
        );
        if (isTie) {
            console.log("It's a tie!");
            return {
                isOver: true,
                winner: null
            };
        }

        return {
            isOver: false,
            winner: null
        };
    };

    const playRound = (column, row) => {
        if (isGameOver().isOver) {
            return;
        }

        if (board.getBoard()[row][column].getValue() !== "") {
            return;
        }

        console.log(
          `Dropping ${getActivePlayer().name}'s token into column ${column}, row ${row}...`
        );
        board.dropToken(row, column, getActivePlayer().token);
        
        const gameOverInfo = isGameOver();
        if (gameOverInfo.isOver) {
            if (gameOverInfo.winner) {
                console.log(`Player ${gameOverInfo.winner} wins!`);
            } else {
                console.log("It's a tie!");
            }
            return;
        }
        
        switchPlayerTurn();
        printNewRound();
    };
    
    printNewRound();
    
    return {
        playRound,
        getActivePlayer,
        getBoard: board.getBoard,
        isGameOver
      };
    }

function ScreenController(
    playerOneName = "Player One",
    playerTwoName = "Player Two"
  ) {
    const game = GameController(playerOneName, playerTwoName);
    const playerTurnDiv = document.querySelector('.turn');
    const boardDiv = document.querySelector('.board');
      
    const updateScreen = () => {
        boardDiv.textContent = "";
      
        const board = game.getBoard();
        const activePlayer = game.getActivePlayer();
      
        playerTurnDiv.textContent = `${activePlayer.name}'s turn...`
      
        board.forEach((row, rowIndex) => {
            row.forEach((cell, columnIndex) => {
                const cellButton = document.createElement("button");
                cellButton.classList.add("cell");
                cellButton.dataset.row = rowIndex;
                cellButton.dataset.column = columnIndex
                cellButton.textContent = cell.getValue();
                boardDiv.appendChild(cellButton);
            })
        })
    }

    function clickHandlerBoard(e) {
        const selectedColumn = e.target.dataset.column;
        const selectedRow = e.target.dataset.row;

        if (!selectedRow || !selectedColumn) return;

        game.playRound(selectedColumn, selectedRow);
        updateScreen();

        const gameOverInfo = game.isGameOver();
        if (gameOverInfo.isOver) {
            if (gameOverInfo.winner) {
                playerTurnDiv.textContent = `${gameOverInfo.winner} wins!`;
            } else {
                playerTurnDiv.textContent = "It's a tie!";
            }
        }
    }
    
    boardDiv.addEventListener("click", clickHandlerBoard);
        
    updateScreen();    
}

const newGameButton = document.getElementById("new-game");
const form = document.querySelector('form');

newGameButton.addEventListener("click", function(event) {
    event.preventDefault();
    // Get the values from the input fields
    const playerOneNameInput = document.getElementById("player-one");
    const playerTwoNameInput = document.getElementById("player-two");

    // Use the values to update player names
    const playerOneName = playerOneNameInput.value || "Player One";
    const playerTwoName = playerTwoNameInput.value || "Player Two";

    // Call ScreenController with updated player names
    ScreenController(playerOneName, playerTwoName);

    form.reset();
});