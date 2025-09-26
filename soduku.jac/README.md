# 4x4 Sudoku Game

A simple 4x4 Sudoku puzzle game implemented in the JAC programming language.

## Description

This is a command-line based Sudoku game where players fill a 4x4 grid with numbers 1-4. The game ensures that each row, column, and 2x2 subgrid contains unique numbers. The game starts with a partially filled board and prompts the user for moves until the puzzle is complete.

## Prerequisites

- JAC language runtime installed (jac-env is included in the project directory).

## How to Run

1. Navigate to the project directory: `cd soduku.jac`
2. Run the game: `jac run soduku.jac`

## Gameplay

- The game displays the current 4x4 Sudoku board.
- Enter the row (1-4), column (1-4), and number (1-4) to place in the cell.
- The game validates moves to ensure Sudoku rules are followed:
  - No duplicate numbers in any row.
  - No duplicate numbers in any column.
  - No duplicate numbers in any 2x2 subgrid.
- Invalid moves are rejected with an error message.
- The game continues until the board is fully filled, at which point it congratulates the player.

## Rules

- Fill the 4x4 grid so that each row, each column, and each 2x2 subgrid contains the numbers 1 through 4 exactly once.
- Empty cells are represented by dots (`.`).
- The board is divided into four 2x2 subgrids separated by lines.

## Example Board Display

```
 1 . | . 2
 . 2 | . .
---------
 . . | 3 .
 4 . | . 1
```

## Features

- Interactive command-line interface.
- Real-time validation of moves.
- Automatic win detection when the puzzle is solved.

## License

This project is open-source. Feel free to modify and distribute.
