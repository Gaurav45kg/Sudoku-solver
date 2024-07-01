// src/SudokuBoard.jsx
import React, { useState, useRef } from 'react';
import './SudokuBoard.css';

const initialBoard = Array(9).fill(null).map(() => Array(9).fill(''));

const SudokuBoard = () => {
  const [board, setBoard] = useState(initialBoard);
  const inputRefs = useRef(Array.from({ length: 9 }, () => Array(9).fill(null)));

  const handleChange = (row, col, value) => {
    if (value === '' || /^[1-9]$/.test(value)) {
      const newBoard = board.map((r, i) =>
        r.map((cell, j) => (i === row && j === col ? value : cell))
      );
      setBoard(newBoard);

      // Move focus to the next cell
      if (value !== '') {
        if (col < 8) {
          inputRefs.current[row][col + 1].focus();
        } else if (row < 8) {
          inputRefs.current[row + 1][0].focus();
        }
      }
    }
  };

  const handleKeyPress = (e, row, col) => {
    if (e.key === 'Enter') {
      if (col < 8) {
        inputRefs.current[row][col + 1].focus();
      } else if (row < 8) {
        inputRefs.current[row + 1][0].focus();
      }
    } else if (e.key === 'Backspace' && !board[row][col]) {
      if (col > 0) {
        inputRefs.current[row][col - 1].focus();
      } else if (row > 0) {
        inputRefs.current[row - 1][8].focus();
      }
    }
  };

  const isValid = (board, row, col, value) => {
    for (let i = 0; i < 9; i++) {
      if (board[row][i] === value && i !== col) return false;
      if (board[i][col] === value && i !== row) return false;
      if (
        board[3 * Math.floor(row / 3) + Math.floor(i / 3)][
          3 * Math.floor(col / 3) + (i % 3)
        ] === value &&
        !(3 * Math.floor(row / 3) + Math.floor(i / 3) === row && 3 * Math.floor(col / 3) + (i % 3) === col)
      )
        return false;
    }
    return true;
  };

  const validateBoard = (board) => {
    for (let row = 0; row < 9; row++) {
      for (let col = 0; col < 9; col++) {
        if (board[row][col] !== '') {
          const value = board[row][col];
          board[row][col] = '';  // Temporarily remove the value to check for validity
          if (!isValid(board, row, col, value)) {
            board[row][col] = value;  // Restore the value
            return false;
          }
          board[row][col] = value;  // Restore the value
        }
      }
    }
    return true;
  };

  const solveSudoku = (board) => {
    const findEmpty = (board) => {
      for (let i = 0; i < 9; i++) {
        for (let j = 0; j < 9; j++) {
          if (board[i][j] === '') {
            return [i, j];
          }
        }
      }
      return null;
    };

    const emptySpot = findEmpty(board);
    if (!emptySpot) return true;

    const [row, col] = emptySpot;
    for (let num = 1; num <= 9; num++) {
      const value = num.toString();
      if (isValid(board, row, col, value)) {
        board[row][col] = value;
        if (solveSudoku(board)) {
          return true;
        }
        board[row][col] = '';
      }
    }
    return false;
  };

  const handleSolve = () => {
    const newBoard = board.map((row) => row.slice());

    if (validateBoard(newBoard) && solveSudoku(newBoard)) {
      setBoard(newBoard);
    } else {
      alert("Invalid input");
    }
  };

  const handleClear = () => {
    setBoard(initialBoard);
  };

  return (
    <div className="container">
      <h1 className="title">GAURAV SUDOKU SOLVER </h1>
      <div className="sudoku-board">
        {board.map((row, rowIndex) => (
          <div key={rowIndex} className="sudoku-row">
            {row.map((cell, colIndex) => (
              <input
                key={colIndex}
                type="text"
                value={cell}
                onChange={(e) =>
                  handleChange(rowIndex, colIndex, e.target.value)
                }
                onKeyDown={(e) => handleKeyPress(e, rowIndex, colIndex)}
                maxLength="1"
                ref={(el) => inputRefs.current[rowIndex][colIndex] = el}
                className="sudoku-cell"
              />
            ))}
          </div>
        ))}
      </div>
      <div className="button-group">
        <button onClick={handleSolve}>Solve</button>
        <button onClick={handleClear}>Clear</button>
      </div>
    </div>
  );
};

export default SudokuBoard;
