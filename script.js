document.getElementById('fileInput').addEventListener('change', readFile);
document.getElementById('solveButton').addEventListener('click', solveSudoku);

let sudoku = [];

function readFile(event){
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function(e){
        const contents = e.target.result;
        sudoku = parseSudoku(contents);
        displaySudoku(sudoku);
    };

    reader.readAsText(file);
}

function parseSudoku(input){
    const rows = input.split('\n').filter(line => line.trim() && !line.include('---'));
    return rows.map(row => row.replace(/\|/g, '').split('').map(char => (char === ' ' ? 0 : parseInt(char, 10))));
}

function displaySudoku(sudoku){
    const table = document.getElementById('sudokuGrid');
    table.innerHTML = '';
    for(let i = 0; i < 9; i++){
        const row = document.createElement('tr');
        for(let j = 0; j < 9; j++){
            const cell = document.createElement('td');
            cell.textContent = sudoku[i][j] === 0 ? '' : sudoku[i][j];
            row.appendChild(cell);
        }
        table.appendChild(row);
    }
}

function solveSudoku(){
    if(cspSolve(sudoku)){
        displaySudoku(sudoku);
        document.getElementById('message').textContent = 'Sudoku Solved!';
    } else {
        document.getElementById('message').textContent = 'No solution exists';
    }
}

function isSafe(){}

function findUnassigned(){}

function mrv(){}

function leastConstrain(){}

function cspSolve(){
    const cell = mrv(sudoku);
    if(!cell) return true;/*No more empty cells left*/

    const [row, col] = cell;
    const values = leastConstrain(sudoku, row, col);

    for (let i = 0; i < values.length; i++){
        const num = values[i];
        if(isSafe(sudoku, row, col, num)){
            sudoku[row][col] = num;
            if (cspSolve(sudoku)) return true;
            sudoku[row][col] = 0;
        }
    }

    return false;
}