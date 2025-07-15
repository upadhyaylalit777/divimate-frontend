import './App.css';
import CreateGroup from './pages/CreateGroup';
import Createuser from './pages/Createuser';
import GroupSummary from "./pages/GroupSummary";
import Home from "./pages/Home";
import {BrowserRouter,Routes,Route} from 'react-router-dom';
import Layout from './Components/Layout';
import Navbar from './Components/Navbar';
import Login from './Components/Login';
import Footer from './Components/Footer';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './Components/ProtectedRoute';

function App() {
  return (
    <AuthProvider>
      <div className="App footer-wrapper">
        <BrowserRouter>
          <Navbar>
            <div className="main-content">
              <Layout>
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/create-user" element={
                    <ProtectedRoute>
                      <Createuser />
                    </ProtectedRoute>
                  } />
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