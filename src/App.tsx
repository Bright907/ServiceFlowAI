import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import { AuthProvider } from '@/context/AuthContext';
import ProtectedRoute from '@/components/ProtectedRoute';
import LandingPage from '@/pages/LandingPage';
import SignupPage from '@/pages/SignupPage';
import LoginPage from '@/pages/LoginPage';
import DashboardPage from '@/pages/DashboardPage';
import WidgetPage from '@/pages/WidgetPage';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <DashboardPage />
              </ProtectedRoute>
            }
          />
          <Route path="/widget/:contractorId" element={<WidgetPage />} />
          <Route
            path="*"
            element={
              <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 px-6 text-center">
                <h1 className="text-4xl font-bold text-slate-900 mb-2">404</h1>
                <p className="text-sm text-slate-500 mb-6">This page doesn't exist.</p>
                <Link to="/" className="text-sm font-semibold text-blue-600 hover:text-blue-700">
                  Back to home
                </Link>
              </div>
            }
          />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
