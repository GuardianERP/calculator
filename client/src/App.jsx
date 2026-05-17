import { useState } from 'react'

function App() {
  const [currentValue, setCurrentValue] = useState('')
  const [previousValue, setPreviousValue] = useState('')
  const [operation, setOperation] = useState(null)
  const [loading, setLoading] = useState(false)

  const appendNumber = (number) => {
    if (number === '.' && currentValue.includes('.')) return
    setCurrentValue(currentValue + number)
  }

  const chooseOperation = (op) => {
    if (currentValue === '') return
    if (previousValue !== '') {
      compute()
    }
    setOperation(op)
    setPreviousValue(currentValue)
    setCurrentValue('')
  }

  const clear = () => {
    setCurrentValue('')
    setPreviousValue('')
    setOperation(null)
  }

  const compute = async () => {
    let expression = ""
    if (operation && previousValue !== "" && currentValue !== "") {
      expression = `${previousValue}${operation}${currentValue}`
    } else if (currentValue !== "") {
      expression = currentValue
    } else {
      return
    }

    setLoading(true)
    const API_URL = import.meta.env.DEV ? 'http://localhost:5000/calculate' : '/calculate'
    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ expression }),
      })

      const data = await response.json()
      if (data.error) {
        alert(data.error)
      } else {
        setCurrentValue(data.result.toString())
        setPreviousValue('')
        setOperation(null)
      }
    } catch (error) {
      console.error('Calculation error:', error)
      alert('Could not connect to backend server.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="app-container">
      <header>
        <h1>Nebula Calc</h1>
        <p>Powered by Node.js Backend</p>
      </header>

      <div className="calculator-card">
        <div className="display">
          <div className="previous-op">
            {previousValue} {operation}
          </div>
          <div className="current-op">
            {loading ? "..." : currentValue || "0"}
          </div>
        </div>

        <div className="keypad">
          <button onClick={clear} className="span-two btn-clear">AC</button>
          <button onClick={() => setCurrentValue(currentValue.slice(0, -1))} className="btn-clear">DEL</button>
          <button onClick={() => chooseOperation('/')} className="btn-operator">÷</button>
          
          <button onClick={() => appendNumber('7')}>7</button>
          <button onClick={() => appendNumber('8')}>8</button>
          <button onClick={() => appendNumber('9')}>9</button>
          <button onClick={() => chooseOperation('*')} className="btn-operator">×</button>
          
          <button onClick={() => appendNumber('4')}>4</button>
          <button onClick={() => appendNumber('5')}>5</button>
          <button onClick={() => appendNumber('6')}>6</button>
          <button onClick={() => chooseOperation('+')} className="btn-operator">+</button>
          
          <button onClick={() => appendNumber('1')}>1</button>
          <button onClick={() => appendNumber('2')}>2</button>
          <button onClick={() => appendNumber('3')}>3</button>
          <button onClick={() => chooseOperation('-')} className="btn-operator">−</button>
          
          <button onClick={() => appendNumber('.')}>.</button>
          <button onClick={() => appendNumber('0')}>0</button>
          <button onClick={compute} className="span-two btn-action">=</button>
        </div>
      </div>
    </div>
  )
}

export default App
