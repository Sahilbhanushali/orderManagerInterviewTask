import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Customers from './pages/Customer';
import Products from './pages/Products';
import Orders from './pages/Orders';
import Dashboard from './pages/Dashboard';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/customers" element={<Customers />} />
        <Route path="/products" element={<Products />} />
        <Route path="/orders" element={<Orders />} />
      </Routes>
    </BrowserRouter>
  );
}
