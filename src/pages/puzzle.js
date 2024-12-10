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

  return (
    <div className="puzzle-container">
      <h1>Solve the number puzzle with the given clues!</h1>
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
        />
        <button type="submit">Submit</button>
      </form>
      <div className="score">Score: {score}</div>
      <style jsx>{`
        .puzzle-container {
          font-family: Arial, sans-serif;
          text-align: center;
          padding-top: 50px;
          background-color: #f2f2f2;
          display: flex;
          flex-direction: column;
          align-items: center;
        }
        h1 {
          color: #333;
        }
        .clue {
          font-size: 1.2em;
          font-weight: bold;
          margin-bottom: 20px;
        }
        .range {
          font-size: 1.1em;
          margin-bottom: 20px;
        }
        input {
          width: 100px;
          font-size: 1.1em;
          padding: 5px;
          text-align: center;
          margin-right: 10px;
        }
        button {
          font-size: 1.1em;
          padding: 5px 10px;
          cursor: pointer;
        }
        .score {
          font-size: 1.2em;
          margin-top: 30px;
        }
        @media (max-width: 600px) {
          input {
            width: 80px;
          }
        }
      `}</style>
    </div>
  );
};

export default Puzzle;
