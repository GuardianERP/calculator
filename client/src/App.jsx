import { useState } from 'react'

function App() {
  const [currentValue, setCurrentValue] = useState('')
  const [previousValue, setPreviousValue] = useState('')
  const [operation, setOperation] = useState(null)
  const [loading, setLoading] = useState(false)
  const [isDarkMode, setIsDarkMode] = useState(true)
  const [isScientific, setIsScientific] = useState(false)
  const [isDegree, setIsDegree] = useState(false)

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode)
    if (isDarkMode) {
      document.body.classList.add('light-theme')
    } else {
      document.body.classList.remove('light-theme')
    }
  }

  const appendNumber = (number) => {
    // In scientific mode, let's allow multiple decimals if they are in different terms of the expression
    if (!isScientific && number === '.' && currentValue.includes('.')) return
    setCurrentValue(currentValue + number)
  }

  const appendFunction = (func) => {
    setCurrentValue(currentValue + func)
  }

  const chooseOperation = (op) => {
    if (isScientific) {
      setCurrentValue(currentValue + op)
    } else {
      if (currentValue === '') return
      if (previousValue !== '') {
        compute()
      }
      setOperation(op)
      setPreviousValue(currentValue)
      setCurrentValue('')
    }
  }

  const clear = () => {
    setCurrentValue('')
    setPreviousValue('')
    setOperation(null)
  }

  const compute = async () => {
    let expression = ""
    if (!isScientific && operation && previousValue !== "" && currentValue !== "") {
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
        body: JSON.stringify({ expression, isDegree }),
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
        <div className="header-container">
          <div className="header-title">
            <h1>Nebula Calc</h1>
            <p>Powered by Node.js Backend</p>
          </div>
          <div className="header-actions">
            <button onClick={() => setIsScientific(!isScientific)} className="mode-toggle-btn" title="Toggle Scientific Mode">
              {isScientific ? '🔢 Simple' : '🧪 Scientific'}
            </button>
            <button onClick={toggleTheme} className="theme-toggle-btn" title="Toggle Light/Dark Theme">
              {isDarkMode ? '☀️' : '🌙'}
            </button>
          </div>
        </div>
      </header>

      <div className={`calculator-card ${isScientific ? 'scientific' : ''}`}>
        <div className="display">
          <div className="previous-op">
            {!isScientific && `${previousValue} ${operation || ''}`}
          </div>
          <div className="current-op">
            {loading ? "..." : currentValue || "0"}
          </div>
        </div>

        {isScientific && (
          <div className="scientific-controls">
            <button 
              onClick={() => setIsDegree(false)} 
              className={`control-btn ${!isDegree ? 'active' : ''}`}
            >
              RAD
            </button>
            <button 
              onClick={() => setIsDegree(true)} 
              className={`control-btn ${isDegree ? 'active' : ''}`}
            >
              DEG
            </button>
          </div>
        )}

        {!isScientific ? (
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
        ) : (
          <div className="keypad scientific">
            {/* Row 1 */}
            <button onClick={() => appendFunction('sin(')} className="btn-scientific">sin</button>
            <button onClick={() => appendFunction('cos(')} className="btn-scientific">cos</button>
            <button onClick={() => appendFunction('tan(')} className="btn-scientific">tan</button>
            <button onClick={() => appendFunction('log(')} className="btn-scientific">log</button>
            <button onClick={() => appendFunction('ln(')} className="btn-scientific">ln</button>

            {/* Row 2 */}
            <button onClick={clear} className="btn-clear">AC</button>
            <button onClick={() => setCurrentValue(currentValue.slice(0, -1))} className="btn-clear">DEL</button>
            <button onClick={() => appendNumber('(')} className="btn-operator">(</button>
            <button onClick={() => appendNumber(')')} className="btn-operator">)</button>
            <button onClick={() => chooseOperation('/')} className="btn-operator">÷</button>

            {/* Row 3 */}
            <button onClick={() => appendNumber('7')}>7</button>
            <button onClick={() => appendNumber('8')}>8</button>
            <button onClick={() => appendNumber('9')}>9</button>
            <button onClick={() => appendNumber('^')} className="btn-operator">^</button>
            <button onClick={() => chooseOperation('*')} className="btn-operator">×</button>

            {/* Row 4 */}
            <button onClick={() => appendNumber('4')}>4</button>
            <button onClick={() => appendNumber('5')}>5</button>
            <button onClick={() => appendNumber('6')}>6</button>
            <button onClick={() => appendFunction('sqrt(')} className="btn-scientific">√</button>
            <button onClick={() => chooseOperation('+')} className="btn-operator">+</button>

            {/* Row 5 */}
            <button onClick={() => appendNumber('1')}>1</button>
            <button onClick={() => appendNumber('2')}>2</button>
            <button onClick={() => appendNumber('3')}>3</button>
            <button onClick={() => appendFunction('fact(')} className="btn-scientific">x!</button>
            <button onClick={() => chooseOperation('-')} className="btn-operator">−</button>

            {/* Row 6 */}
            <button onClick={() => appendNumber('pi')} className="btn-scientific">π</button>
            <button onClick={() => appendNumber('e')} className="btn-scientific">e</button>
            <button onClick={() => appendNumber('.')}>.</button>
            <button onClick={() => appendNumber('0')}>0</button>
            <button onClick={compute} className="btn-action">=</button>
          </div>
        )}
      </div>
    </div>
  )
}

export default App
