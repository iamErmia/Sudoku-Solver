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

function isSafe(sudoku, row, col, num){
    /*Chejing if num already exists among col and row numbers */
    for(let x = 0; x < 9; x++){
        if(sudoku[x][col] === num || sudoku[row][x] === num) return false;
    }

    /*Checking if the num already exists in it's sub-square */
    const startRow = row - row%3;
    const startCol = col - col%3;

    for(let i = 0; i < 3; i++){
        for(let j = 0; j < 3; j++){
            if(sudoku[row + i][col + j] === num) return false;
        }
    }
    return true;
}

function findUnassigned(sudoku){
    for(let i = 0; i < 9; i++){
        for(let j = 0; j < 9; j++){
            if(sudoku[i][j] === 0) return [i, j];
        }
    }
    return null;
}

function mrv(sudoku){
    let mincount = Infinity;
    let bestCell = null;

    for(let row = 0; row < 9; row++){
        for(let col = 0; col < 9; col++){
            if(sudoku[row][col] === 0){
                let count = 0;
                for(let num = 1; num <= 9; num++){
                    if(isSafe(sudoku, row, col, num)) count++;
                }
                if(count < mincount){
                    mincount = count;
                    bestCell = [row, col];
                }
            }
        }
    }
    return bestCell;
}

function leastConstrain(sudoku, row, col){
    const numConstraints = Array(10).fill(0);

    for(let num = 1; num <= 9; num++){
        if(isSafe(sudoku, row, col, num)){
            for(let x = 0; x < 9; x++){
                if(isSafe(sudoku, x, col, num) && sudoku[x][col] === 0) numConstraints[num]++;
                if(isSafe(sudoku, row, x, num) && sudoku[row][x] === 0) numConstraints[num]++;
            }
        }

        const startRow = row - row%3;
        const startCol = col - col%3;

        for(let i = 0; i < 3; i++){
            for(let j = 0; j < 3; j++){
                if(sudoku[startRow + i][startCol + j] === 0 && isSafe(sudoku, startRow + i, startCol + j, num)) numConstraints[num]++;
            }
        }
    }

    const sortedValues = [];
    for(let num = 1; num <= 9; num++){
        if(isSafe(sudoku, row, col, num)) sortedValues.push({num, constraints: numConstraints[num]});
    }
    sortedValues.sort((a,b) => a.constraints - b.constraints);
    return sortedValues.map(item => item.num);
}

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