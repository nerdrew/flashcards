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

interface Operation {
  symbol: string;
  check: (x: number, y: number, z: number) => boolean;
}

const ADD = {
  symbol: "+",
  check: (x: number, y: number, z: number) => x + y === z,
};

const SUB = {
  symbol: "-",
  check: (x: number, y: number, z: number) => x - y === z,
  // TODO add default max?
};

function Menu(props: { op: Operation, setOp: (op: Operation) => void, max: number, setMax: (max: number) => void, setShowMenu: (_: boolean) => void }) {
  const save = (formData: FormData) => {
    // console.log(`formData=${JSON.stringify(Array.from(formData.entries()))}`)

    if (formData.get("max") !== "") {
      const max = parseInt(formData.get("max")! as string)
      props.setMax(max)
    }

    const op = formData.get("op")! as string
    if (op === ADD.symbol) {
      props.setOp(ADD);
    } else if (op === SUB.symbol) {
      props.setOp(SUB);
    } else {
      console.log(`unexpected op=${op}`);
    }
    props.setShowMenu(false);
  }

  return (
    <div className="Menu">
      <form action={save}>
        <label>
          Max: <input type="text" inputMode="decimal" maxLength={2} name="max" placeholder={props.max.toString()} />
        </label>
        <br/>
        <select name="op" id="operation-select" defaultValue={props.op.symbol}>
          <option value={ADD.symbol}>{ADD.symbol}</option>
          <option value={SUB.symbol}>{SUB.symbol}</option>
        </select>
        <br/>
        <button className="num-pad-button" type="submit">Save</button>
      </form>
      <br/>
      <button className="num-pad-button" type="submit" onClick={() => props.setShowMenu(false)}>Cancel</button>
    </div>
  )
}

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
        <div className="num-pad-button" onClick={() => props.check()}>Check</div>
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
  const [showMenu, setShowMenu] = React.useState(false);
  const [max, setMax] = React.useState(20);
  const [op, setOp] = React.useState(ADD);

  const newNumbers = React.useCallback(() => {
    const x = Math.ceil(Math.random() * max)
    const y = Math.ceil(Math.random() * max)
    if (op === SUB && y > x) {
      setX(y)
      setY(x)
    } else {
      setX(x)
      setY(y)
    }
  }, [max, op])

  const check = React.useCallback((newGuess?: string, soft?: boolean) => {
    const g = parseInt(newGuess ? newGuess : guess)
    if (op.check(x, y, g)) {
      setWrong(false)
      setCorrect(true)
      setTimeout(() => {
        newNumbers()
        setCorrect(false)
        setGuess('')
      }, 1_000)
    } else if (!soft) {
      setWrong(true)
      setGuess('')
    }
  }, [guess, x, y, op, newNumbers])

  const updateGuess = React.useCallback((n: number) => {
    if (correct) {
      return
    }
    setCorrect(false)
    setWrong(false)
    const newGuess = `${guess}${n}`
    if (newGuess.length > 2) {
      setGuess(newGuess)
      check(newGuess, false)
    } else {
      setGuess(newGuess)
      check(newGuess, true)
    }
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
    newNumbers()
    setClient(true)
  }, [newNumbers])

  React.useEffect(() => {
    if (!showMenu) {
      window.addEventListener('keydown', handleKeyDown);

      return () => {
        window.removeEventListener('keydown', handleKeyDown);
      };
    }
  }, [handleKeyDown, showMenu])

  if (!isClient) {
    return (<div/>)
  }

  if (showMenu) {
    return (
      <Menu op={op} setOp={setOp} max={max} setMax={setMax} setShowMenu={setShowMenu} />
    )
  }

  return (
    <div className="App">
      <div onDoubleClick={() => setShowMenu(true)}>
        <TenFrames n={x} />
        <TenFrames n={y} />
      </div>
      <div className="number">
        {x} {op.symbol} {y} = {guess === '' ? "?" : guess}
        {correct && " 👌"}
        {wrong && (<span className="wrong">X</span>)}
      </div>

      <NumPad check={check} clear={clear} numKey={numKey} />
    </div>
  );
}
