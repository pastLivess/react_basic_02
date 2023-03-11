// ReactDOM函数 React18之后 需要从这里引入 react-dom/client

import ReactDOM from 'react-dom/client'
import App from './App'

const root = ReactDOM.createRoot(document.getElementById('root'))
root.render(<App />)
