import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Provider } from 'react-redux'
import React, { Suspense } from 'react'
import store from './redux/store'
import Loader from './pages/Loader'

import { loadStripe } from '@stripe/stripe-js'
import { Elements } from '@stripe/react-stripe-js'

const stripePromise = loadStripe('pk_test_51SzNDAQjPKa2CLHXObHZkCZQiIv6swxZzmhY1VzhiwmyFyKo4u8k1iL3sGv1yX16wLxmt0UUR1XdYeckrUwCHCTl00KAOBxVte');

// Lazy loaded pages
const Home = React.lazy(() => import('./pages/Home'))
const Register = React.lazy(() => import('./pages/Register'))
const Login = React.lazy(() => import('./pages/Login'))
const ProtectedRoute = React.lazy(() => import('./pages/ProtectedRoute'))
const Admin = React.lazy(() => import('./pages/Admin'))
const Partner = React.lazy(() => import('./pages/Partner'))
const SingleMovie = React.lazy(() => import('./pages/SingleMovie'))
const BookShow = React.lazy(() => import('./pages/BookShow'))
const Forget = React.lazy(() => import('./pages/Forget'))
const Reset = React.lazy(() => import('./pages/Reset'))

function App() {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <Suspense fallback={<Loader />}>
          <Routes>
            <Route path='/' element={
              <ProtectedRoute role='User'>
                <Home />
              </ProtectedRoute>
            }/>

            <Route path='/admin' element={
              <ProtectedRoute role='Admin'>
                <Admin />
              </ProtectedRoute>
            }/>

            <Route path='/partner' element={
              <ProtectedRoute role='Partner'>
                <Partner/>
              </ProtectedRoute>
            }/>

            <Route path="/movie/:id" element={
              <ProtectedRoute role='User'>
                <SingleMovie/>
              </ProtectedRoute>
            }/>

            <Route path="/book-show/:id" element={
              <ProtectedRoute role='User'>
                <Elements stripe={stripePromise}>
                  <BookShow />
                </Elements>
              </ProtectedRoute>
            }/>

            <Route path='/register' element={<Register />}/>
            <Route path='/login' element={<Login />}/>
            <Route path='/forget' element={<Forget />} />
            <Route path='/reset' element={<Reset />} />
          </Routes>
        </Suspense>
      </BrowserRouter>
    </Provider>
  )
}

export default App