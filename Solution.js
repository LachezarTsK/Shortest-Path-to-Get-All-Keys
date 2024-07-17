
/**
 * @param {string[]} matrix
 * @return {number}
 */
var shortestPathAllKeys = function (matrix) {
    this.WALL = '#';
    this.START = '@';
    this.EMPTY_POINT = '.';
    this.PATH_NOT_FOUND = -1;
    this.ASCII_LOWER_CASE_A = 97;
    this.POINT_NOT_FOUND = [-1, -1];
    this.MOVES = [[-1, 0], [1, 0], [0, -1], [0, 1]];

    this.rows = matrix.length;
    this.columns = matrix[0].length;
    this.matrix = Array.from(new Array(this.rows), () => new Array(this.columns));

    fillMatrix(matrix);
    const startPoint = findStartPoint();
    const bitStampAllKeys = calculateBitStampAllKeys();

    return searchForShortestPathToGetAllKeys(startPoint, bitStampAllKeys);
};

/**
 * @param {number[]} startPoint
 * @param {number} bitStampAllKeys
 * @return {number} 
 */
function searchForShortestPathToGetAllKeys(startPoint, bitStampAllKeys) {
    //const {Queue} = require('@datastructures-js/queue');
    //Queue<Step>
    const queue = new Queue();
    queue.enqueue(new Step(startPoint[0], startPoint[1], 0));

    const visitedByBitStamp = Array.from(new Array(this.rows), () => new Array(this.columns));
    for (let r = 0; r < this.rows; ++r) {
        for (let c = 0; c < this.columns; ++c) {
            visitedByBitStamp[r][c] = new Array(bitStampAllKeys + 1).fill(false);
        }
    }
    visitedByBitStamp[startPoint[0]][startPoint[1]][0] = true;

    this.matrix[startPoint[0]][startPoint[1]] = this.EMPTY_POINT;
    let shortestPathToGetAllKeys = 0;

    while (!queue.isEmpty()) {
        let stepsInCurrentLevel = queue.size();

        while (stepsInCurrentLevel-- > 0) {
            const currentStep = queue.dequeue();
            if (currentStep.bitStamp === bitStampAllKeys) {
                return shortestPathToGetAllKeys;
            }

            for (let move of this.MOVES) {
                const nextRow = currentStep.row + move[0];
                const nextColumn = currentStep.column + move[1];

                if (!isInMatrix(nextRow, nextColumn) || visitedByBitStamp[nextRow][nextColumn][currentStep.bitStamp]) {
                    continue;
                }

                visitedByBitStamp[nextRow][nextColumn][currentStep.bitStamp] = true;

                if (matrix[nextRow][nextColumn] === EMPTY_POINT
                        || (isLock(matrix[nextRow][nextColumn]) && hasKey(matrix[nextRow][nextColumn], currentStep.bitStamp))) {
                    queue.enqueue(new Step(nextRow, nextColumn, currentStep.bitStamp));
                    continue;
                }

                if (isKey(matrix[nextRow][nextColumn])) {
                    const newBitStamp = currentStep.bitStamp | calculateBitStamp(matrix[nextRow][nextColumn]);
                    queue.enqueue(new Step(nextRow, nextColumn, newBitStamp));
                }

            }
        }
        ++shortestPathToGetAllKeys;
    }
    return this.PATH_NOT_FOUND;
}

/**
 * @param {number} row
 * @param {number} column
 * @param {number} bitStamp
 */
function Step(row, column, bitStamp) {
    this.row = row;
    this.column = column;
    this.bitStamp = bitStamp;
}

/**
 * @param {number[][]} matrix 
 * @return {void} 
 */
function fillMatrix(matrix) {
    for (let r = 0; r < this.rows; ++r) {
        this.matrix[r] = matrix[r].split('');
    }
}

/**
 * @return {number[]} 
 */
function findStartPoint() {
    const startPoint = new Array(2);
    for (let r = 0; r < this.rows; ++r) {
        for (let c = 0; c < this.columns; ++c) {
            if (this.matrix[r][c] === this.START) {
                startPoint[0] = r;
                startPoint[1] = c;
                return startPoint;
            }
        }
    }
    return this.POINT_NOT_FOUND;
}

/**
 * @return {number} 
 */
function calculateBitStampAllKeys() {
    let bitStampAllKeys = 0;
    for (let r = 0; r < this.rows; ++r) {
        for (let c = 0; c < this.columns; ++c) {
            if (isKey(this.matrix[r][c])) {
                bitStampAllKeys = bitStampAllKeys | calculateBitStamp(this.matrix[r][c]);
            }
        }
    }
    return bitStampAllKeys;
}

/**
 * @param {string} letter
 * @return {number} 
 */
function calculateBitStamp(letter) {
    const ASCII_LETTER = letter.codePointAt(0);
    return 1 << (ASCII_LETTER - this.ASCII_LOWER_CASE_A);
}

/**
 * @param {number} row
 * @param {number} column
 * @return {boolean} 
 */
function isInMatrix(row, column) {
    return row >= 0 && row < this.rows && column >= 0 && column < this.columns;
}

/**
 * @param {string} letter
 * @return {boolean} 
 */
function isKey(letter) {
    return letter >= 'a' && letter <= 'f';
}

/**
 * @param {string} letter
 * @return {boolean} 
 */
function isLock(letter) {
    return letter >= 'A' && letter <= 'F';
}

/**
 * @param {string} letter
 * @param {number} currentBitStamp 
 * @return {boolean} 
 */
function hasKey(letter, currentBitStamp) {
    return (currentBitStamp & calculateBitStamp(letter.toLowerCase())) !== 0;
}
