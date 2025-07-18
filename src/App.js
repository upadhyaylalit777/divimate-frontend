import './App.css';
import CreateGroup from './pages/CreateGroup';

import GroupSummary from "./pages/GroupSummary";
import Home from "./pages/Home";
import {BrowserRouter,Routes,Route, Navigate} from 'react-router-dom';
import Layout from './Components/Layout';
import Navbar from './Components/Navbar';
import Login from './Components/Login';
import Footer from './Components/Footer';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import ProtectedRoute from './Components/ProtectedRoute';
import LandingPage from './pages/Landing';

const AppRoutes = () => {
  const { isAuthenticated } = useAuth();

  return (
    <Routes>
      <Route path="/home" element={<Home />} />
      <Route path="/" element={isAuthenticated ? <LandingPage /> : <Home />} />
      <Route path="/login" element={<Login />} />
      
      <Route path="/create-group" element={
        <ProtectedRoute>
          <CreateGroup />
        </ProtectedRoute>
      } />
      <Route path="/group/:groupId/summary" element={
        <ProtectedRoute>
          <GroupSummary />
        </ProtectedRoute>
      } />
    </Routes>
  );
}

function App() {
  return (
    <AuthProvider>
      <div className="App footer-wrapper">
        <BrowserRouter>
          <Navbar>
            <div className="main-content">
              <Layout>
                <AppRoutes />
              </Layout>
            </div>
          </Navbar>
          <Footer />
        </BrowserRouter>
      </div>
    </AuthProvider>
  );
}

export default App;
