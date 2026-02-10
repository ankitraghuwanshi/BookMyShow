import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Provider } from 'react-redux'
import Home from './pages/Home'
import Register from './pages/Register'
import Login from './pages/Login'
import './App.css'
import store from './redux/store'
import ProtectedRoute from './pages/ProtectedRoute'
import Admin from './pages/Admin'
import Partner from './pages/Partner'
import SingleMovie from './pages/SingleMovie'
import Loader from './pages/Loader'

function App() {

  return (
    <Provider store={store}>
      <Loader/>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<ProtectedRoute><Home /></ProtectedRoute>}/>
          <Route path='/admin' element={<ProtectedRoute><Admin /></ProtectedRoute>}/>
          <Route path='/partner' element={<ProtectedRoute><Partner/></ProtectedRoute>}/>
          <Route path="/movie/:id" element={<ProtectedRoute><SingleMovie/></ProtectedRoute>} />
          <Route path='/register' element={<Register />}/>
          <Route path='/login' element={<Login />}/>
        </Routes>
      </BrowserRouter>
    </Provider>
  )
}

export default App
