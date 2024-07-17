
using System;
using System.Collections.Generic;

public class Solution
{
    private record Step(int row, int column, int bitStamp) {}

    private static readonly char WALL = '#';
    private static readonly char START = '@';
    private static readonly char EMPTY_POINT = '.';
    private static readonly int PATH_NOT_FOUND = -1;
    private static readonly int[] POINT_NOT_FOUND = {-1, -1};
    private static readonly int[][] MOVES = { new int[]{-1, 0}, new int[]{1, 0}, new int[]{0, -1}, new int[]{0, 1} };

    private int rows;
    private int columns;
    private char[,] matrix;
    public int ShortestPathAllKeys(string[] matrix)
    {
        rows = matrix.Length;
        columns = matrix[0].Length;
        FillMatrix(matrix);

        int[] startPoint = FindStartPoint();
        int bitStampAllKeys = CalculateBitStampAllKeys();

        return SearchForShortestPathToGetAllKeys(startPoint, bitStampAllKeys);
    }


    private int SearchForShortestPathToGetAllKeys(int[] startPoint, int bitStampAllKeys)
    {
        Queue<Step> queue = new Queue<Step>();
        queue.Enqueue(new Step(startPoint[0], startPoint[1], 0));

        bool[,,] visitedByBitStamp = new bool[rows, columns, bitStampAllKeys + 1];
        visitedByBitStamp[startPoint[0], startPoint[1], 0] = true;

        matrix[startPoint[0], startPoint[1]] = EMPTY_POINT;
        int shortestPathToGetAllKeys = 0;

        while (queue.Count != 0)
        {
            int stepsInCurrentLevel = queue.Count;

            while (stepsInCurrentLevel-- > 0)
            {
                Step currentStep = queue.Dequeue();
                if (currentStep.bitStamp == bitStampAllKeys)
                {
                    return shortestPathToGetAllKeys;
                }

                foreach (int[] move in MOVES)
                {
                    int nextRow = currentStep.row + move[0];
                    int nextColumn = currentStep.column + move[1];

                    if (!IsInMatrix(nextRow, nextColumn) || visitedByBitStamp[nextRow, nextColumn, currentStep.bitStamp])
                    {
                        continue;
                    }

                    visitedByBitStamp[nextRow, nextColumn, currentStep.bitStamp] = true;

                    if (matrix[nextRow, nextColumn] == EMPTY_POINT
                            || (IsLock(matrix[nextRow, nextColumn]) && HasKey(matrix[nextRow, nextColumn], currentStep.bitStamp)))
                    {
                        queue.Enqueue(new Step(nextRow, nextColumn, currentStep.bitStamp));
                        continue;
                    }

                    if (IsKey(matrix[nextRow, nextColumn]))
                    {
                        int newBitStamp = currentStep.bitStamp | CalculateBitStamp(matrix[nextRow, nextColumn]);
                        queue.Enqueue(new Step(nextRow, nextColumn, newBitStamp));
                    }
                }
            }
            ++shortestPathToGetAllKeys;
        }
        return PATH_NOT_FOUND;
    }

    private void FillMatrix(String[] matrix)
    {
        this.matrix = new char[rows, columns];
        for (int r = 0; r < rows; ++r)
        {
            for (int c = 0; c < columns; ++c)
            {
                this.matrix[r, c] = matrix[r][c];
            }
        }
    }

    private int[] FindStartPoint()
    {
        int[] startPoint = new int[2];
        for (int r = 0; r < rows; ++r)
        {
            for (int c = 0; c < columns; ++c)
            {
                if (matrix[r, c] == START)
                {
                    startPoint[0] = r;
                    startPoint[1] = c;
                    return startPoint;
                }
            }
        }
        return POINT_NOT_FOUND;
    }

    private int CalculateBitStampAllKeys()
    {
        int bitStampAllKeys = 0;
        for (int r = 0; r < rows; ++r)
        {
            for (int c = 0; c < columns; ++c)
            {
                if (IsKey(matrix[r, c]))
                {
                    bitStampAllKeys = bitStampAllKeys | CalculateBitStamp(matrix[r, c]);
                }
            }
        }
        return bitStampAllKeys;
    }

    private int CalculateBitStamp(char letter)
    {
        return 1 << (letter - 'a');
    }

    private bool IsInMatrix(int row, int column)
    {
        return row >= 0 && row < rows && column >= 0 && column < columns;
    }

    private bool IsKey(char letter)
    {
        return letter >= 'a' && letter <= 'f';
    }

    private bool IsLock(char letter)
    {
        return letter >= 'A' && letter <= 'F';
    }

    private bool HasKey(char letter, int currentBitStamp)
    {
        return (currentBitStamp & CalculateBitStamp(Char.ToLower(letter))) != 0;
    }
}
