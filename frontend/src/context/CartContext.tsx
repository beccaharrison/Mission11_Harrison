import { createContext, ReactNode, useContext, useState } from 'react';
import { CartItem } from '../types/CartItem';

interface CartContextType {
  cart: CartItem[];
  total: number;
  addToCart: (item: CartItem) => void;
  removeFromCart: (bookID: number) => void;
  clearCart: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [total, setTotal] = useState<number>(0);

  const addToCart = (item: CartItem) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find((b) => b.bookID === item.bookID);

      const updatedCart = existingItem
        ? prevCart.map((b) =>
            b.bookID === item.bookID
              ? {
                  ...b,
                  quantity: b.quantity + item.quantity,
                  subtotal: (b.quantity + item.quantity) * b.price,
                }
              : b
          )
        : [...prevCart, item];

      setTotal(updatedCart.reduce((sum, i) => sum + i.subtotal, 0));
      return updatedCart;
    });
  };

  const removeFromCart = (bookID: number) => {
    setCart((prevCart) => {
      const updatedCart = prevCart.filter((b) => b.bookID !== bookID);
      setTotal(updatedCart.reduce((sum, i) => sum + i.subtotal, 0));
      return updatedCart;
    });
  };

  const clearCart = () => {
    setCart(() => []);
    setTotal(0);
  };

  return (
    <CartContext.Provider
      value={{ cart, total, addToCart, removeFromCart, clearCart }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
