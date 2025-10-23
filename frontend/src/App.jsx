import { BrowserRouter,Routes,Route } from 'react-router-dom'
import { Signup } from './routes/Signup'
import { Signin } from './routes/Signin'
import { SendMoney } from './routes/SendMoney'
import { Dashboard } from './routes/Dashboard'
function App() {
  return (
    <>
       <BrowserRouter>
        <Routes>
          <Route path="/signup" element={<Signup />} />
          <Route path="/signin" element={<Signin />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/send" element={<SendMoney />} />
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
