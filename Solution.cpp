
#include <array>
#include <string>
#include <vector>
using namespace std;

class Solution {

    struct Step {
        int row;
        int column;
        int bitStamp;
        Step(int row, int column, int bitStamp) : row{row}, column{column}, bitStamp{bitStamp}{}
    };

    using coordinates = array<int, 2>;

    static const char WALL = '#';
    static const char START = '@';
    static const char EMPTY_POINT = '.';
    static const int PATH_NOT_FOUND = -1;
    inline static const coordinates POINT_NOT_FOUND{{-1, -1}};
    inline static const array<coordinates, 4> MOVES{{ {-1, 0}, {1, 0}, {0, -1}, {0, 1} }};

    size_t rows;
    size_t columns;
    vector<string> matrix;

public:
    int shortestPathAllKeys(const vector<string>& matrix) {
        rows = matrix.size();
        columns = matrix[0].size();
        fillMatrix(matrix);

        coordinates startPoint = findStartPoint();
        int bitSampAllKeys = calculateBitSampAllKeys();

        return searchForShortestPathToGetAllKeys(startPoint, bitSampAllKeys);
    }

private:
    int searchForShortestPathToGetAllKeys(coordinates startPoint, int bitSampAllKeys) {
        queue<Step> queue;
        queue.emplace(startPoint[0], startPoint[1], 0);

        vector < vector < vector<bool>>> visitedByBitStamp(rows, vector < vector<bool>>(columns, vector<bool>(bitSampAllKeys + 1)));
        visitedByBitStamp[startPoint[0]][startPoint[1]][0] = true;

        matrix[startPoint[0]][startPoint[1]] = EMPTY_POINT;
        int shortestPathToGetAllKeys = 0;

        while (!queue.empty()) {
            size_t stepsInCurrentLevel = queue.size();

            while (stepsInCurrentLevel-- > 0) {
                Step currentStep = queue.front();
                queue.pop();
                if (currentStep.bitStamp == bitSampAllKeys) {
                    return shortestPathToGetAllKeys;
                }

                for (const auto& move : MOVES) {
                    int nextRow = currentStep.row + move[0];
                    int nextColumn = currentStep.column + move[1];

                    if (!isInMatrix(nextRow, nextColumn) || visitedByBitStamp[nextRow][nextColumn][currentStep.bitStamp]) {
                        continue;
                    }

                    visitedByBitStamp[nextRow][nextColumn][currentStep.bitStamp] = true;

                    if (matrix[nextRow][nextColumn] == EMPTY_POINT
                            || (isLock(matrix[nextRow][nextColumn]) && hasKey(matrix[nextRow][nextColumn], currentStep.bitStamp))) {
                        queue.emplace(nextRow, nextColumn, currentStep.bitStamp);
                        continue;
                    }

                    if (isKey(matrix[nextRow][nextColumn])) {
                        int newBitStamp = currentStep.bitStamp | calculateBitSamp(matrix[nextRow][nextColumn]);
                        queue.emplace(nextRow, nextColumn, newBitStamp);
                    }

                }
            }
            ++shortestPathToGetAllKeys;
        }
        return PATH_NOT_FOUND;
    }

    //C++20 alternative to 'const vector<string>&': span<const string>
    void fillMatrix(const vector<string>& matrix) {
        this->matrix.resize(rows);
        for (size_t r = 0; r < rows; ++r) {
            this->matrix[r] = matrix[r];
        }
    }

    coordinates findStartPoint() const {
        coordinates startPoint;
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

    int calculateBitSampAllKeys() const {
        int bitSampAllKeys = 0;
        for (size_t r = 0; r < rows; ++r) {
            for (size_t c = 0; c < columns; ++c) {
                if (isKey(matrix[r][c])) {
                    bitSampAllKeys = bitSampAllKeys | calculateBitSamp(matrix[r][c]);
                }
            }
        }
        return bitSampAllKeys;
    }

    int calculateBitSamp(char letter) const {
        return 1 << (letter - 'a');
    }

    bool isInMatrix(int row, int column) const {
        return row >= 0 && row < rows && column >= 0 && column < columns;
    }

    bool isKey(char letter) const {
        return letter >= 'a' && letter <= 'f';
    }

    bool isLock(char letter) const {
        return letter >= 'A' && letter <= 'F';
    }

    bool hasKey(char letter, int currentBitStamp) const {
        return (currentBitStamp & calculateBitSamp(tolower(letter))) != 0;
    }
};
