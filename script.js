const gameboard = (function() {
    function cell(value) {
        return value;
    }

    const rowsAndColumns = 3;
    const board = [];

    function newBoard() {
        for (let i = 0; i < rowsAndColumns; i++) {
            board[i] = [];
            for (let j = 0; j < rowsAndColumns; j++) {
                board[i].push(cell(null));
            }
        }
    }

    function getBoard() {
        return board;
    }

    const printBoard = () => {
        const boardWithCellValues = board.map((row) => row.map((cell) => {
            if (cell) {
                return cell.symbol
            }
            return cell;
        }))
        return boardWithCellValues;
    };

    function makeMove(player, row, column) {
        if (row < 0 || (rowsAndColumns - 1) > 2 || column < 0 || (rowsAndColumns - 1) > 2 || board[row][column] !== null) {
            return true;
        }
        board[row][column] = cell(player); 
    }

    function checkForWinner() {
        let count = 0;
        let current;
        //check diagonals
        for (let i = 0; i < rowsAndColumns; i++) {
            if (board[i][i] === current && board[i][i] !== null) {
                count++  
            }
            if (count === (rowsAndColumns - 1)) {
                return board[i][i];
            }
            current = board[i][i];
        }
        // check more diagonals
        count = 0;
        current = '';
        for (let i = 0; i < rowsAndColumns; i++) {
            if (board[i][(rowsAndColumns - 1 - i)] === current && board[i][(rowsAndColumns - 1 - i)] !== null) {
                count++
            }
            if (count === (rowsAndColumns - 1)) {
                return board[i][(rowsAndColumns - 1 - i)];
            }
            current = board[i][(rowsAndColumns - 1 - i)];
        }   
        //check rows
        for (let i = 0; i < rowsAndColumns; i++) {
            count = 0;
            current = '';
            for (let j = 0; j < rowsAndColumns; j++) {
                if (board[i][j] === current && board[i][j] !== null) {
                    count++  
                }
                if (count === (rowsAndColumns - 1)) {
                    return board[i][j];
                }
                current = board[i][j];
            }
        }
        //check columns
        for (let i = 0; i < rowsAndColumns; i++) {
            count = 0;
            current = '';
            for (let j = 0; j < rowsAndColumns; j++) {
                if (board[j][i] === current && board[j][i] !== null) {
                    count++ 
                }
                if (count === (rowsAndColumns - 1)) {
                    return board[j][i];
                }
                current = board[j][i];
            }
        }
        //check for tie
        const notNullRows = []
        for (let i = 0; i < rowsAndColumns; i++) {
            let currentRow = board[i].filter((cellVal) => cellVal !== null);
            if (currentRow.length === 3) {
                notNullRows.push(currentRow);
            }
            if (notNullRows.length === 3) {
                return 'Tie';
            }
        }
    }

    newBoard();
    return { getBoard, makeMove, checkForWinner, newBoard, printBoard };
})();

const player = function(name, symbol) {
    return { name, symbol };
}

const game = function(playerOne = player("Player One", 'X'), playerTwo = player("Player Two", 'O')) {
    gameboard.newBoard();

    let players = [playerOne, playerTwo];

    let activePlayer = players[0];
    const getActivePlayer = () => activePlayer;

    function updatePlayers(newPlayerOne, newPlayerTwo) {
        players = [newPlayerOne, newPlayerTwo];
        activePlayer = players[0];
    }

    let winner = '';
    const getWinner = () => winner;

    const switchPlayerTurn = () => {
        activePlayer = activePlayer === players[0] ? players[1] : players[0];
    };

    const playRound = (row, column) => {
        if (gameboard.checkForWinner()) {
            gameboard.newBoard();
            winner = '';
        }

        let currentMove = gameboard.makeMove(activePlayer, row, column)
        if (currentMove) {
            return;
        } 

        if ((gameboard.checkForWinner())) {
            winner = gameboard.checkForWinner();
            return winner;
        } else {
            switchPlayerTurn();
        }
    }

    return { getActivePlayer, playRound, getWinner, updatePlayers }
};

const display = (function() {
    let currentGame;
    let currentPlayer;
    const gameboardDisplay = document.querySelector('.gameboard');
    const playerOneDiv = document.querySelector('.player-one');
    const playerTwoDiv = document.querySelector('.player-two');
    const gameStatusDiv = document.querySelector('.game-status>h2');
    const addPlayers = document.querySelector(".start-button");
    const dialog = document.querySelector('dialog');
    const form = document.querySelector("form");
    const playerOneInput = document.querySelector('#playerOne')
    const playerTwoInput = document.querySelector('#playerTwo')

    const updateScreen = () => {
        gameboardDisplay.textContent = "";
        gameboard.printBoard().forEach((row, rowIndex) => {
            row.forEach((cell, colIndex) => {
                const cellButton = document.createElement("button");
                cellButton.classList.add("cell");
                cellButton.dataset.rowIndex = rowIndex;
                cellButton.dataset.colIndex = colIndex;
                cellButton.textContent = cell;
                gameboardDisplay.appendChild(cellButton)
            })

            if (currentGame) {
                if (currentGame.getWinner()) {
                    currentGame = ''
                    return;
                }
                currentPlayer = currentGame.getActivePlayer()
                gameStatusDiv.textContent = `${currentPlayer.name}'s turn`
            }
        })

        if (currentGame) {
            if (currentPlayer.symbol === 'X') {
                playerOneDiv.classList.add('current');
                playerTwoDiv.classList.remove('current')
            } else {
                playerTwoDiv.classList.add('current');
                playerOneDiv.classList.remove('current')
            }
        }
    }

    addPlayers.addEventListener("click", () => {  
        playerOneInput.value = ''
        playerTwoInput.value = '' 
        dialog.showModal();
    });

    dialog.addEventListener('close', (e) => {
        if (dialog.returnValue === 'submit') {
            const playerOneValue = form.playerOne.value;
            const playerTwoValue = form.playerTwo.value

            currentGame = game(player(playerOneValue, 'X'), player(playerTwoValue, 'O'));
            playerOneDiv.textContent = `${playerOneValue}: X`;
            playerTwoDiv.textContent = `${playerTwoValue}: O`;
            updateScreen();
        }
    })

    function clickHandlerBoard(e) {
        const selectedRowIndex = e.target.dataset.rowIndex;
        const selectedColIndex = e.target.dataset.colIndex;
        if (!selectedRowIndex || !selectedColIndex || !currentGame) return;
        
        currentGame.playRound(selectedRowIndex, selectedColIndex);
        if (currentGame.getWinner()) {
            if (currentGame.getWinner() === 'Tie') {
                gameStatusDiv.textContent = 'Tie'
                updateScreen();
                return   
            }
            gameStatusDiv.textContent = `${currentGame.getWinner().name} Wins`;
        }
        updateScreen();
    }
    
    gameboardDisplay.addEventListener("click", clickHandlerBoard);
    
    updateScreen();
})()