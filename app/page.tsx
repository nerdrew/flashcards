'use client';

import React from 'react';
import Button from '@mui/material/Button';

function Box(props: { filled: boolean }) {
  if (props.filled) {
    return (<div className="box"><div className="circle" /></div>);
  } else {
    return (<div className="box" />);
  }
}

function TenFrame(props: { n: number }) {
  const COLS = 10
  const rows = Math.floor(props.n / COLS);
  const filled = props.n % COLS;
  const unfilled = filled == 0 ? 0 : COLS - filled;
  return (
    <div className="ten-frame">
      <div className="number">{ props.n }</div>
      {
        [...Array(rows)].map((_item, i) => {
          const className = i > 0 && i % 2 == 1 ? "row ten" : "row"
          return (
            <div key={i} className={className}>
              {
                [...Array(COLS)].map((_item, j) => (<Box key={j} filled={true} />))
              }
            </div>
          )
        })
      }
      <div className="row">
        {
          [...Array(filled)].map((_item, i) => (<Box key={i} filled={true} />))
        }
        {
          [...Array(unfilled)].map((_item, i) => (<Box key={i} filled={false} />))
        }
      </div>
    </div>
  );
}

export default function Home() {
  const [guess, setGuess] = React.useState('');
  const [wrong, setWrong] = React.useState(false);
  const [correct, setCorrect] = React.useState(false);
  const [x, setX] = React.useState(0);
  const [y, setY] = React.useState(0);
  const [isClient, setClient] = React.useState(false);

  const check = React.useCallback(async () => {
    const g = parseInt(guess)

    if (g == x + y) {
      setWrong(false)
      setCorrect(true)
      setTimeout(() => {
        setX(Math.floor(Math.random() * 20) + 1)
        setY(Math.floor(Math.random() * 20) + 1)
        setCorrect(false)
      }, 1_000)
    } else {
      setWrong(true)
    }

    setGuess('')
  }, [guess, x, y])

  const handleKeyDown = React.useCallback(async (e: KeyboardEvent) => {
    console.log(`key=${e.key}`)
    if (e.key === "Enter") {
      check()
    } else {
      const n = parseInt(e.key)
      if (!isNaN(n)) {
        setGuess((guess) => `${guess}${n}`)
        setWrong(false)
      }
    }
  }, [check])

  const numKey = async (n: number) => {
    setCorrect(false)
    setWrong(false)
    setGuess(`${guess}${n}`)
  }
  const clear = async () => {
    setCorrect(false)
    setWrong(false)
    setGuess('')
  }

  React.useEffect(() => {
    setX(Math.floor(Math.random() * 20) + 1)
    setY(Math.floor(Math.random() * 20) + 1)
    setClient(true);
  }, [])

  React.useEffect(() => {
    window.scrollTo(0,1)
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleKeyDown])

  if (!isClient) {
    return (<div/>)
  }

  return (
    <div className="App">
      <TenFrame n={x} />
      <div className="number">+</div>
      <TenFrame n={y} />
      <div className="guess">
        {guess !== '' && guess}
        {correct && (<span className="correct">👌</span>)}
        {wrong && (<span className="wrong">X</span>)}
      </div>

      <div className="num-pad">
        <div>
        <Button size="large" variant="outlined" onClick={() => numKey(7)}>{7}</Button>
        <Button size="large" variant="outlined" onClick={() => numKey(8)}>{8}</Button>
        <Button size="large" variant="outlined" onClick={() => numKey(9)}>{9}</Button>
        </div>
        <div>
        <Button size="large" variant="outlined" onClick={() => numKey(4)}>{4}</Button>
        <Button size="large" variant="outlined" onClick={() => numKey(5)}>{5}</Button>
        <Button size="large" variant="outlined" onClick={() => numKey(6)}>{6}</Button>
        </div>
        <div>
        <Button size="large" variant="outlined" onClick={() => numKey(1)}>{1}</Button>
        <Button size="large" variant="outlined" onClick={() => numKey(2)}>{2}</Button>
        <Button size="large" variant="outlined" onClick={() => numKey(3)}>{3}</Button>
        </div>
        <div>
        <Button size="large" variant="outlined" onClick={() => numKey(0)}>{0}</Button>
        </div>
        <div>
        <Button size="large" variant="outlined" onClick={() => check()}>Guess!</Button>
        <Button size="large" variant="outlined" onClick={() => clear()}>Clear!</Button>
        </div>
      </div>
    </div>
  );
}
