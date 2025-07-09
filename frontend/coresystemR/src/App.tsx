import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import SalesPage from './pages/SalesPage';
import InventoryPage from './pages/InventoryPage';
import CustomerPage from './pages/CustomerPage';
import HistoryPage from './pages/HistoryPage';
import OrdersPage from './pages/OrdersPage';
import UserManagementPage from './pages/UserManagementPage';
import axios from 'axios';

function App() {
  axios.get('http://localhost:8080/api/notifications');

  return (
    <div
      style={{
        minHeight: '100vh',
        minWidth: '100vw',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#222',
      }}
    >
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/sales" element={<SalesPage />} />
          <Route path="/inventory" element={<InventoryPage />} />
          <Route path="/customers" element={<CustomerPage />} />
          <Route path="/history" element={<HistoryPage />} />
          <Route path="/orders" element={<OrdersPage />} />
          <Route path="/users" element={<UserManagementPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
