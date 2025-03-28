import { useNavigate, useParams } from 'react-router-dom';
import WelcomeBand from '../components/WelcomeBand';
import { useCart } from '../context/CartContext';
import { useState } from 'react';
import { CartItem } from '../types/CartItem';

function PurchasePage() {
  const navigate = useNavigate();
  const { title, bookID, price } = useParams();
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState<number>(1);

  const handleAddToCart = () => {
    const newItem: CartItem = {
      bookID: Number(bookID),
      title: title || 'No title found',
      price: Number(price),
      quantity,
      subtotal: Number(price) * quantity,
    };
    addToCart(newItem);
    navigate('/cart');
  };

  return (
    <>
      <WelcomeBand />
      <h2>Purchase {title}?</h2>

      <div>
        <label>
          Quantity:
          <input
            type="number"
            value={quantity}
            onChange={(q) => setQuantity(Math.max(1, Number(q.target.value)))}
            min="1"
          />
        </label>
        <p>
          <strong>Subtotal:</strong> ${(Number(price) * quantity).toFixed(2)}
        </p>
        <button onClick={handleAddToCart}>Add to Cart</button>
      </div>

      <button onClick={() => navigate('/books')}>Go Back</button>
    </>
  );
}

export default PurchasePage;
