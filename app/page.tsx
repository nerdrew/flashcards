'use client';

import React from 'react';

const COLORS = [
  "deepskyblue",
  "lightseagreen",
  "lightgreen",
  "lightskyblue",
  "gold",
  "lightsalmon",
  "rebeccapurple",
  "darkorange",
  "lightcoral",
  "lightpink",
  "greenyellow",
  "indigo",
  "blueviolet",
  "chartreuse",
  "chocolate",
  "darkcyan",
  "darkseagreen",
  "forestgreen",
  "palegreen",
  "plum",
]

function NumPad(props: { check: () => void, clear: () => void, numKey: (n: number) => void }) {
  return (
    <div className="num-pad">
      <div className="num-pad-row">
        <div className="num-pad-button" onClick={() => props.numKey(7)}>{7}</div>
        <div className="num-pad-button" onClick={() => props.numKey(8)}>{8}</div>
        <div className="num-pad-button" onClick={() => props.numKey(9)}>{9}</div>
      </div>
      <div className="num-pad-row">
        <div className="num-pad-button" onClick={() => props.numKey(4)}>{4}</div>
        <div className="num-pad-button" onClick={() => props.numKey(5)}>{5}</div>
        <div className="num-pad-button" onClick={() => props.numKey(6)}>{6}</div>
      </div>
      <div className="num-pad-row">
        <div className="num-pad-button" onClick={() => props.numKey(1)}>{1}</div>
        <div className="num-pad-button" onClick={() => props.numKey(2)}>{2}</div>
        <div className="num-pad-button" onClick={() => props.numKey(3)}>{3}</div>
      </div>
      <div className="num-pad-row">
        <div className="num-pad-button" onClick={() => props.numKey(0)}>{0}</div>
      </div>
      <div className="num-pad-row">
        <div className="num-pad-button" onClick={() => props.check()}>Answer!</div>
        <div className="num-pad-button" onClick={() => props.clear()}>Clear</div>
      </div>
    </div>
  )
}

function Box(props: { filled: boolean, color: string }) {
  if (props.filled) {
    return (<div className="box"><div className="circle" style={{ background: props.color }} /></div>);
  } else {
    return (<div className="box" />);
  }
}

function TenFrame(props: { n: number, color: string }) {
  return (
    <div className="ten-frame">
      <div className="row">
        {
          [...Array(5)].map((_item, j) => (<Box key={j} filled={j < props.n} color={props.color} />))
        }
      </div>
      <div className="row">
        {
          [...Array(5)].map((_item, j) => (<Box key={j} filled={j + 5 < props.n} color={props.color}/>))
        }
      </div>
    </div>
  );
}

function TenFrames(props: { n: number }) {
  const count = Math.ceil(props.n / 10);
  const color = COLORS[props.n % COLORS.length]

  return (
    <div className="ten-frames">
      {
        [...Array(count)].map((_item, i) => {
          const filled = props.n - i * 10;
          return (<TenFrame key={i} n={ filled > 10 ? 10 : filled } color={color} />)
        })
      }
    </div>
  )
}

export default function Home() {
  const [guess, setGuess] = React.useState('');
  const [wrong, setWrong] = React.useState(false);
  const [correct, setCorrect] = React.useState(false);
  const [x, setX] = React.useState(0);
  const [y, setY] = React.useState(0);
  const [isClient, setClient] = React.useState(false);

  const check = React.useCallback((newGuess?: string) => {
    const g = parseInt(newGuess ? newGuess : guess)
    if (g == x + y) {
      setWrong(false)
      setCorrect(true)
      setTimeout(() => {
        setX(Math.floor(Math.random() * 20) + 1)
        setY(Math.floor(Math.random() * 20) + 1)
        setCorrect(false)
        setGuess('')
      }, 1_000)
    } else if (!newGuess) {
      setWrong(true)
      setGuess('')
    }
  }, [guess, x, y])

  const updateGuess = React.useCallback((n: number) => {
    if (correct) {
      return
    }
    setCorrect(false)
    setWrong(false)
    const newGuess = `${guess}${n}`
    setGuess(newGuess)
    check(newGuess)
  }, [guess, correct, check])

  const handleKeyDown = React.useCallback((e: KeyboardEvent) => {
    if (e.key === "Enter") {
      check()
    } else {
      const n = parseInt(e.key)
      if (!isNaN(n)) {
        updateGuess(n)
      }
    }
  }, [check, updateGuess])

  const numKey = (n: number) => {
    updateGuess(n)
  }

  const clear = () => {
    setCorrect(false)
    setWrong(false)
    setGuess('')
  }

  React.useEffect(() => {
    setX(Math.ceil(Math.random() * 20))
    setY(Math.ceil(Math.random() * 20))
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
      <TenFrames n={x} />
      <TenFrames n={y} />
      <div className="number">{x} + {y} = {guess === '' ? "?" : guess}
        {correct && " 👌"}
        {wrong && (<span className="wrong">X</span>)}
      </div>

      <NumPad check={check} clear={clear} numKey={numKey} />
    </div>
  );
}
