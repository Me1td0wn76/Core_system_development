import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import SalesPage from './pages/SalesPage';
import InventoryPage from './pages/InventoryPage';
import CustomerPage from './pages/CustomerPage';
import RequireAuth from './components/RequireAuth';

function App() {
  return (
    <div
      style={{
        minHeight: '100vh',
        minWidth: '100vw',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#222', // 必要に応じて背景色を調整
      }}
    >
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/dashboard" element={
            <RequireAuth>
              <Dashboard />
            </RequireAuth>
          } />
          <Route path="/sales" element={
            <RequireAuth>
              <SalesPage />
            </RequireAuth>
          } />
          <Route path="/inventory" element={
            <RequireAuth>
              <InventoryPage />
            </RequireAuth>
          } />
          <Route path="/customers" element={
            <RequireAuth>
              <CustomerPage />
            </RequireAuth>
          } />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
