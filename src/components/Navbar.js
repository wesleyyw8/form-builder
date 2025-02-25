import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import '../styles/Navbar.css';

function Navbar() {
  const { cart } = useCart();
  const itemCount = cart.reduce((total, item) => total + item.quantity, 0);

  return (
    <nav className="navbar">
      <Link to="/" className="nav-brand">
        Nutrition Store
      </Link>
      <div className="nav-links">
        <Link to="/" className="nav-link">Products</Link>
        <Link to="/form-builder" className="nav-link">Form Builder</Link>
        <Link to="/saved-forms" className="nav-link">Saved Forms</Link>
        <Link to="/cart" className="nav-link">Cart ({itemCount})</Link>
      </div>
    </nav>
  );
}

export default Navbar; 