import React, { useState, useRef } from 'react';

const Puzzle = () => {
  const [clue, setClue] = useState('Click to start');
  const [range, setRange] = useState('Range: - to -');
  const [guess, setGuess] = useState('');
  const [score, setScore] = useState(0);

  const secretNumberRef = useRef();
  const minRangeRef = useRef();
  const maxRangeRef = useRef();

  const startGame = () => {
    secretNumberRef.current = Math.floor(Math.random() * 100) + 1;
    minRangeRef.current = 1;
    maxRangeRef.current = 100;
    setScore(0);
    giveClue();
  };

  const giveClue = () => {
    setClue("Is your number higher or lower than your last guess?");
    setRange(`Range: ${minRangeRef.current} to ${maxRangeRef.current}`);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const guessValue = parseInt(guess);

    if (guessValue === secretNumberRef.current) {
      alert(`Congratulations! You solved the puzzle in ${score} clues.`);
      startGame();
    } else if (guessValue < minRangeRef.current || guessValue > maxRangeRef.current) {
      alert(`Your guess is out of the current range (${minRangeRef.current} to ${maxRangeRef.current}).`);
    } else {
      setScore(score + 1);

      if (guessValue < secretNumberRef.current) {
        minRangeRef.current = guessValue + 1;
        setClue("Your number is higher than your last guess.");
      } else if (guessValue > secretNumberRef.current) {
        maxRangeRef.current = guessValue - 1;
        setClue("Your number is lower than your last guess.");
      }

      setRange(`Range: ${minRangeRef.current} to ${maxRangeRef.current}`);
    }

    setGuess('');
  };

  const resetGame = () => {
    setGuess('');
    setScore(0);
    setClue('Click to start');
    setRange('Range: - to -');
  };

  return (
    <div className="puzzle-container">
      <h1>Solve the Number Puzzle!</h1>
      <div className="clue">{clue}</div>
      <div className="range">{range}</div>
      <form onSubmit={handleSubmit}>
        <input
          type="number"
          value={guess}
          onChange={(e) => setGuess(e.target.value)}
          min="1"
          max="100"
          required
          className="guess-input"
        />
        <button type="submit" className="submit-button">Submit</button>
      </form>
      <button onClick={resetGame} className="reset-button">Reset</button>
      <div className="score">Score: {score}</div>
      <style jsx>{`
        :root {
          --primary-color: #4a90e2;
          --secondary-color: #50e3c2;
          --background-color: #f5f7fa;
          --text-color: #333;
          --button-color: #4a90e2;
          --button-hover-color: #357ab8;
        }
        .puzzle-container {
          font-family: 'Roboto', sans-serif;
          text-align: center;
          padding: 50px 20px;
          background-color: var(--background-color);
          display: flex;
          flex-direction: column;
          align-items: center;
          min-height: 100vh;
          justify-content: center;
        }
        h1 {
          color: var(--primary-color);
          margin-bottom: 20px;
        }
        .clue, .range, .score {
          font-size: 1.2em;
          margin-bottom: 15px;
          color: var(--text-color);
        }
        .guess-input {
          width: 100px;
          font-size: 1.1em;
          padding: 10px;
          text-align: center;
          margin-right: 10px;
          border: 2px solid var(--primary-color);
          border-radius: 5px;
          transition: border-color 0.3s;
        }
        .guess-input:focus {
          border-color: var(--secondary-color);
          outline: none;
        }
        .submit-button, .reset-button {
          font-size: 1.1em;
          padding: 10px 20px;
          cursor: pointer;
          background-color: var(--button-color);
          color: white;
          border: none;
          border-radius: 5px;
          transition: background-color 0.3s;
        }
        .submit-button:hover, .reset-button:hover {
          background-color: var(--button-hover-color);
        }
        @media (max-width: 600px) {
          .guess-input {
            width: 80px;
          }
        }
      `}</style>
    </div>
  );
};

export default Puzzle;
