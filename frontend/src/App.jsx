import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import { lazy, Suspense } from 'react'

// import Order from './Order.jsx'
const Home = lazy(() => import('./pages/instituiton/Home.jsx'))
const Features = lazy(() => import('./pages/instituiton/Features.jsx'))
const Pricing = lazy(() => import('./pages/instituiton/Pricing.jsx'))
const About = lazy(() => import('./pages/instituiton/About.jsx'))
const Signup = lazy(() => import('./pages/instituiton/Signup.jsx'))
const Success = lazy(() => import('./pages/instituiton/Success.jsx'))
const Login = lazy(() => import('./pages/instituiton/Login.jsx'))
const App = () => {
  return (
    <Router>
      {/* <SocketProvider> */}
        {/* <Suspense fallback={< />}> */}
          <Routes>
            {/* <Route path="/order" element={<Order />} />
            <Route path="/success" element={} />
            <Route path="*" element={<div>404</div>} /> */}
            <Route path="/" element={<Home />} />
            <Route path="/features" element={<Features />} />
            <Route path="/pricing" element={<Pricing />} />
            <Route path="/about" element={<About />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/success" element={<Success />} />
            <Route path='/login' element={<Login />} />
            
          </Routes>
        {/* </Suspense> */}
      {/* </SocketProvider> */}
    </Router>
  )
}

export default App
