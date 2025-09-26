

walker SudokuGame {
    has board: list;
    has row: int;
    has col: int;
    has num: int;

    can start with `root entry;
    can process_move with game_state entry;
}

node game_state {
    has board: list;
}

# Main game entry point
with entry:__main__ {
    # partially solved 4x4 Sudoku board (0 represents empty cells)
    initial_board = [1,0,0,2,0,2,0,0,0,0,3,0,4,0,0,1];
    
    print("Welcome to 4x4 Sudoku Game!");
    print("Enter row (1-4), column (1-4), and number (1-4) to make a move.");
    print("The game ends when the board is complete.");
    
    # Start the game walker with initial board
    root spawn SudokuGame(initial_board, 0, 0, 0);
}

impl SudokuGame.start {
    if not [root --> (`?game_state)] {
        next = root ++> game_state(self.board);
    } else {
        next = [root --> (`?game_state)];
    }
    visit next;
}

impl SudokuGame.process_move {
    # Display current board
    print("Sudoku Board:");
    i = 0;
    while i < 4 {
        if i % 2 == 0 and i != 0 {
            print(" - - - - - - - -");
        }
        j = 0;
        while j < 4 {
            if j % 2 == 0 and j != 0 {
                print(" | ");
            }
            idx = i * 4 + j;
            if here.board[idx] == 0 {
                print(" . ");
            } else {
                print(" " + str(here.board[idx]) + " ");
            }
            j = j + 1;
        }
        print("");
        i = i + 1;
    }
    print("");
    
    # Check if game is complete
    complete = True;
    i = 0;
    while i < 16 {
        if here.board[i] == 0 {
            complete = False;
        }
        i = i + 1;
    }
    if complete {
        print("Congratulations! You solved the Sudoku puzzle!");
        disengage;
    }
    
    # Get user input
    row_str = input("Enter row (1-4): ");
    col_str = input("Enter column (1-4): ");
    num_str = input("Enter number (1-4): ");
    
    row = int(row_str) - 1;
    col = int(col_str) - 1;
    num = int(num_str);
    
    # Validate input
    if not (row >= 0 and row < 4 and col >= 0 and col < 4 and num >= 1 and num <= 4) {
        print("Invalid input! Row, column, and number must be between 1-4.");
        visit here;  
    }
    
    idx = row * 4 + col;
    
    # Check if cell is already filled
    if here.board[idx] != 0 {
        print("Cell is already filled! Choose an empty cell.");
        visit here;
    }
    
    # Check if move is valid
    safe = True;
    
    # Check row
    x = 0;
    while x < 4 {
        if here.board[row * 4 + x] == num {
            safe = False;
        }
        x = x + 1;
    }
    
    # Check column
    x = 0;
    while x < 4 {
        if here.board[x * 4 + col] == num {
            safe = False;
        }
        x = x + 1;
    }
    
    # Check 2x2 box
    start_row = row - (row % 2);
    start_col = col - (col % 2);
    box_i = 0;
    while box_i < 2 {
        box_j = 0;
        while box_j < 2 {
            if here.board[(start_row + box_i) * 4 + (start_col + box_j)] == num {
                safe = False;
            }
            box_j = box_j + 1;
        }
        box_i = box_i + 1;
    }
    
    if safe {
        # Create new board with the move
        new_board = here.board.copy();
        new_board[idx] = num;
        
        # Create new game state with updated board
        here ++> game_state(new_board);
        print("Move placed successfully!");
        
        # Move to next state
        if [-->] {
            visit [-->];
        } else {
            visit here;
        }
    } else {
        print("Invalid move! Number violates Sudoku rules.");
        visit here;  # Stay on current state for retry
    }
}