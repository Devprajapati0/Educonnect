import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import { lazy, Suspense } from 'react'
import { SocketProvider } from './socket/Socket.jsx'
import { Loader } from 'lucide-react'
// import AdminLayout from './pages/admin/AdminLayout.jsx'

// import Order from './Order.jsx'
const Home = lazy(() => import('./pages/instituiton/Home.jsx'))
const Features = lazy(() => import('./pages/instituiton/Features.jsx'))
const Pricing = lazy(() => import('./pages/instituiton/Pricing.jsx'))
const About = lazy(() => import('./pages/instituiton/About.jsx'))
const Signup = lazy(() => import('./pages/instituiton/Signup.jsx'))
const Success = lazy(() => import('./pages/instituiton/Success.jsx'))
const Login = lazy(() => import('./pages/instituiton/Login.jsx'))
const Edit = lazy(() => import('./pages/instituiton/Edit.jsx'))
const Profile = lazy(() => import('./pages/instituiton/Profile.jsx'))
const Frontpage = lazy(() => import('./pages/common/Frontpage.jsx'))
const Adminchat = lazy(() => import('./pages/common/Adminchat.jsx'))
const Dashboard = lazy(() => import('./pages/admin/Dashboard.jsx'))
const Adduser = lazy(() => import('./pages/admin/Adduser.jsx'))
const Forgotpassword = lazy(() => import('./pages/common/Forgotpassword.jsx'))
const ProfileUser = lazy(() => import('./pages/common/ProfileUser.jsx'))

// const Adminchat = lazy(() => import('./pages/admin/Adminchat.jsx'))
const App = () => {
  return (
    <Router>
      <SocketProvider>
        <Suspense fallback={
          <div className="flex items-center justify-center h-screen">
          <Loader className="animate-spin text-blue-600" size={48} />
        </div>
        }>
  
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
            <Route path='/profile' element={<Profile/>} />
            <Route path='/profile/edit' element={<Edit/>} />

            <Route path = '/:subdomain/login' element={<Frontpage/>}/>
            <Route path = '/:subdomain/forgot-password' element={<Forgotpassword/>}/>
            <Route path = '/:subdomain/admin/dashboard' element={<Dashboard/>}/>
            <Route path = '/:subdomain/admin/add-user' element={<Adduser/>}/>
            <Route path=  '/:subdomain/:role/update-profile' element={<ProfileUser/>} />
            <Route path = '/:subdomain/:role/chat' element={<Adminchat/>}/>
            <Route path = '/:subdomain/:role/chat/:id' element={<Adminchat/>}/>
            </Routes>
            
            
        </Suspense>
      </SocketProvider>
    </Router>
  )
}

export default App


//#1976d2