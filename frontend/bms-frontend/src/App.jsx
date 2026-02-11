import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Provider } from 'react-redux'
import Home from './pages/Home'
import Register from './pages/Register'
import Login from './pages/Login'
import store from './redux/store'
import ProtectedRoute from './pages/ProtectedRoute'
import Admin from './pages/Admin'
import Partner from './pages/Partner'
import SingleMovie from './pages/SingleMovie'
import Loader from './pages/Loader'
import BookShow from './pages/BookShow'
import Forget from './pages/Forget'
import Reset from './pages/Reset'

import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';

const stripePromise = loadStripe('pk_test_51SzNDAQjPKa2CLHXObHZkCZQiIv6swxZzmhY1VzhiwmyFyKo4u8k1iL3sGv1yX16wLxmt0UUR1XdYeckrUwCHCTl00KAOBxVte');


function App() {

  return (
    <Provider store={store}>
      <Loader/>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<ProtectedRoute><Home /></ProtectedRoute>}/>
          <Route path='/admin' element={<ProtectedRoute><Admin /></ProtectedRoute>}/>
          <Route path='/partner' element={<ProtectedRoute><Partner/></ProtectedRoute>}/>
          <Route path="/movie/:id" element={<ProtectedRoute><SingleMovie/></ProtectedRoute>}/>
          <Route path="/book-show/:id" element={
            <ProtectedRoute>
              <Elements stripe={stripePromise}>
                <BookShow />
              </Elements>
            </ProtectedRoute>}
          />
          <Route path='/register' element={<Register />}/>
          <Route path='/login' element={<Login />}/>
          <Route path='/forget' element={<Forget />} />
          <Route path='/reset' element={<Reset />} />
        </Routes>
      </BrowserRouter>
    </Provider>
  )
}

export default App
