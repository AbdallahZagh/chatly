import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useInitializeTheme } from './hooks/useInitializeTheme';
import { useAppStore } from './store/useAppStore';

// Layout Wrappers
// import MainLayout from './components/layout/MainLayout';

// Pages (Placeholder imports - you will create these in your pages folder)
import Landing from './pages/Landing';
import Login from './pages/Auth';
import Chats from './pages/Chats';
import ProfilePage from './pages/Profile';
import ResetPassword from './pages/ResetPassword';
import ForgotPassword from './pages/ForgotPassword';
// import Signup from './pages/Signup';
// import ChatDetail from './pages/ChatDetail';
// import Contacts from './pages/Contacts';
// import Profile from './pages/Profile';

function App() {
  // Initialize the high-performance Tailwind v4 theme
  useInitializeTheme();

  // Simple Auth Guard (logic will be expanded when we add Firebase)
  const user = useAppStore((state) => state.user);

  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={!user ? <Login /> : <Navigate to="/chats" />} />
          <Route path="/chats" element={<Chats />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
        {/* <Route path="/chats" element={user ? <Chats /> : <Navigate to="/login" />} /> */}
        
        {/* Private App Routes (Wrapped in MainLayout) */}
        {/* <Route element={<MainLayout />}>
          <Route path="/chats" element={<Chats />} />
          <Route path="/chat/:id" element={<ChatDetail />} />
          <Route path="/contacts" element={<Contacts />} />
          <Route path="/profile" element={<Profile />} />
        </Route> */}

        {/* 404 Redirect */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;