import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import ProductList from './components/ProductList';
import ProductDetail from './components/ProductDetail';
import Cart from './components/Cart';
import FormBuilder from './components/FormBuilder';
import SavedForms from './components/SavedForms';
import ViewForm from './components/ViewForm';
import { CartProvider } from './context/CartContext';

const App: React.FC = () => {
  return (
    <CartProvider>
      <Router>
        <div className="App">
          <Navbar />
          <Routes>
            <Route path="/" element={<ProductList />} />
            <Route path="/product/:id" element={<ProductDetail />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/form-builder" element={<FormBuilder />} />
            <Route path="/saved-forms" element={<SavedForms />} />
            <Route path="/view-form/:formIndex" element={<ViewForm />} />
          </Routes>
        </div>
      </Router>
    </CartProvider>
  );
};

export default App; 