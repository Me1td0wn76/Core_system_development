import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import SalesPage from './pages/SalesPage';
import InventoryPage from './pages/InventoryPage';
import CustomerPage from './pages/CustomerPage';
import RequireAuth from './components/RequireAuth';

function App() {
  return (
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
      </Routes>
    </BrowserRouter>
  );
}

export default App;
