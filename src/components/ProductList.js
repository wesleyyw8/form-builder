import { Link } from 'react-router-dom';
import { products } from '../data/products';
import '../styles/ProductList.css';

function ProductList() {
  return (
    <div className="product-list">
      <h1>Nutrition Supplements</h1>
      <div className="products-grid">
        {products.map(product => (
          <Link to={`/product/${product.id}`} key={product.id} className="product-card">
            <img src={product.image} alt={product.name} />
            <h3>{product.name}</h3>
            <p className="price">${product.price}</p>
            <p className="description">{product.description}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default ProductList; 