import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import { SocketProvider } from './context/SocketContext';
import ProtectedRoute from './components/ProtectedRoute';
import MainLayout from './components/MainLayout';

// Pages
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import IncidentList from './pages/IncidentList';
import CreateIncident from './pages/CreateIncident';
import IncidentDetails from './pages/IncidentDetails';
import AdminDashboard from './pages/AdminDashboard';

const AppLayout = ({ children }) => (
  <div className="page-wrapper">
    <MainLayout>{children}</MainLayout>
  </div>
);

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <SocketProvider>
          {/* Global toast notifications */}
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 3500,
              style: {
                background: '#1a1a2e',
                color: '#f1f5f9',
                border: '1px solid rgba(99, 102, 241, 0.3)',
                borderRadius: '0.75rem',
                fontSize: '0.875rem',
                fontWeight: 500,
              },
              success: { iconTheme: { primary: '#10b981', secondary: '#f1f5f9' } },
              error: { iconTheme: { primary: '#ef4444', secondary: '#f1f5f9' } },
            }}
          />

          <Routes>
            {/* Public routes — no Navbar */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* Default redirect */}
            <Route path="/" element={<Navigate to="/dashboard" replace />} />

            {/* Protected routes — with Navbar */}
            <Route path="/dashboard" element={
              <ProtectedRoute>
                <AppLayout><Dashboard /></AppLayout>
              </ProtectedRoute>
            } />

            <Route path="/incidents" element={
              <ProtectedRoute>
                <AppLayout><IncidentList /></AppLayout>
              </ProtectedRoute>
            } />

            <Route path="/incidents/create" element={
              <ProtectedRoute>
                <AppLayout><CreateIncident /></AppLayout>
              </ProtectedRoute>
            } />

            <Route path="/incidents/:id" element={
              <ProtectedRoute>
                <AppLayout><IncidentDetails /></AppLayout>
              </ProtectedRoute>
            } />

            {/* Admin-only route */}
            <Route path="/admin" element={
              <ProtectedRoute requireAdmin>
                <AppLayout><AdminDashboard /></AppLayout>
              </ProtectedRoute>
            } />

            {/* Catch-all: redirect to dashboard */}
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </SocketProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
