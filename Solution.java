

import java.util.LinkedList;
import java.util.Queue;

public class Solution {

    private record Step(int row, int column, int bitStamp) {}

    private static final char WALL = '#';
    private static final char START = '@';
    private static final char EMPTY_POINT = '.';
    private static final int PATH_NOT_FOUND = -1;
    private static final int[] POINT_NOT_FOUND = {-1, -1};
    private static final int[][] MOVES = {{-1, 0}, {1, 0}, {0, -1}, {0, 1}};

    private int rows;
    private int columns;
    private char[][] matrix;

    public int shortestPathAllKeys(String[] matrix) {
        rows = matrix.length;
        columns = matrix[0].length();
        fillMatrix(matrix);

        int[] startPoint = findStartPoint();
        int bitStampAllKeys = calculateBitStampAllKeys();

        return searchForShortestPathToGetAllKeys(startPoint, bitStampAllKeys);
    }

    private int searchForShortestPathToGetAllKeys(int[] startPoint, int bitStampAllKeys) {
        Queue<Step> queue = new LinkedList<>();
        queue.add(new Step(startPoint[0], startPoint[1], 0));

        boolean[][][] visitedByBitStamp = new boolean[rows][columns][bitStampAllKeys + 1];
        visitedByBitStamp[startPoint[0]][startPoint[1]][0] = true;

        matrix[startPoint[0]][startPoint[1]] = EMPTY_POINT;
        int shortestPathToGetAllKeys = 0;

        while (!queue.isEmpty()) {
            int stepsInCurrentLevel = queue.size();

            while (stepsInCurrentLevel-- > 0) {
                Step currentStep = queue.poll();
                if (currentStep.bitStamp == bitStampAllKeys) {
                    return shortestPathToGetAllKeys;
                }

                for (int[] move : MOVES) {
                    int nextRow = currentStep.row + move[0];
                    int nextColumn = currentStep.column + move[1];

                    if (!isInMatrix(nextRow, nextColumn) || visitedByBitStamp[nextRow][nextColumn][currentStep.bitStamp]) {
                        continue;
                    }

                    visitedByBitStamp[nextRow][nextColumn][currentStep.bitStamp] = true;

                    if (matrix[nextRow][nextColumn] == EMPTY_POINT
                            || (isLock(matrix[nextRow][nextColumn]) && hasKey(matrix[nextRow][nextColumn], currentStep.bitStamp))) {
                        queue.add(new Step(nextRow, nextColumn, currentStep.bitStamp));
                        continue;
                    }

                    if (isKey(matrix[nextRow][nextColumn])) {
                        int newBitStamp = currentStep.bitStamp | calculateBitStamp(matrix[nextRow][nextColumn]);
                        queue.add(new Step(nextRow, nextColumn, newBitStamp));
                    }

                }
            }
            ++shortestPathToGetAllKeys;
        }
        return PATH_NOT_FOUND;
    }

    private void fillMatrix(String[] matrix) {
        this.matrix = new char[rows][columns];
        for (int r = 0; r < rows; ++r) {
            this.matrix[r] = matrix[r].toCharArray();
        }
    }

    private int[] findStartPoint() {
        int[] startPoint = new int[2];
        for (int r = 0; r < rows; ++r) {
            for (int c = 0; c < columns; ++c) {
                if (matrix[r][c] == START) {
                    startPoint[0] = r;
                    startPoint[1] = c;
                    return startPoint;
                }
            }
        }
        return POINT_NOT_FOUND;
    }

    private int calculateBitStampAllKeys() {
        int bitStampAllKeys = 0;
        for (int r = 0; r < rows; ++r) {
            for (int c = 0; c < columns; ++c) {
                if (isKey(matrix[r][c])) {
                    bitStampAllKeys = bitStampAllKeys | calculateBitStamp(matrix[r][c]);
                }
            }
        }
        return bitStampAllKeys;
    }

    private int calculateBitStamp(char letter) {
        return 1 << (letter - 'a');
    }

    private boolean isInMatrix(int row, int column) {
        return row >= 0 && row < rows && column >= 0 && column < columns;
    }

    private boolean isKey(char letter) {
        return letter >= 'a' && letter <= 'f';
    }

    private boolean isLock(char letter) {
        return letter >= 'A' && letter <= 'F';
    }

    private boolean hasKey(char letter, int currentBitStamp) {
        return (currentBitStamp & calculateBitStamp(Character.toLowerCase(letter))) != 0;
    }
}
