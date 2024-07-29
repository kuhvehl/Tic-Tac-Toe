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
        console.log(boardWithCellValues);
        return boardWithCellValues;
    };

    function makeMove(player, row, column) {
        if (row < 0 || (rowsAndColumns - 1) > 2 || column < 0 || (rowsAndColumns - 1) > 2 || board[row][column] !== null) {
            console.log('fart');
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
    printBoard();
    return { getBoard, makeMove, checkForWinner, newBoard, printBoard };
})();

const player = function(name, symbol) {
    return { name, symbol };
}

const game = (function(playerOne = player("Player One", 'X'), playerTwo = player("Player Two", 'O')) {
    const players = [playerOne, playerTwo];

    let activePlayer = players[0];
    const getActivePlayer = () => activePlayer;

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

        // let row = Number(prompt('Row?'));
        // let column = Number(prompt('Column?')); 

        let currentMove = gameboard.makeMove(activePlayer, row, column)
        if (currentMove) {
            return;
        } 

        if ((gameboard.checkForWinner())) {
            winner = gameboard.checkForWinner();
            console.log(`${winner.name} wins`)
            return winner;
        } else {
            switchPlayerTurn();
            console.log(gameboard.printBoard());
        }
    }

    return { getActivePlayer, playRound, getWinner }
})();

const display = (function() {
    const gameboardDisplay = document.querySelector('.gameboard');

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
        })
    }

    function clickHandlerBoard(e) {
        const selectedRowIndex = e.target.dataset.rowIndex;
        const selectedColIndex = e.target.dataset.colIndex;
        if (!selectedRowIndex || !selectedColIndex) return;
        
        game.playRound(selectedRowIndex, selectedColIndex);
        updateScreen();
    }
    
    gameboardDisplay.addEventListener("click", clickHandlerBoard);
    
    updateScreen();
})()