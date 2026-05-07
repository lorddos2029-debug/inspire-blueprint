import { createContext, useContext, useState, useEffect, ReactNode } from "react";

export interface CartItem {
  id: number;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  tag?: string;
  size?: string;
  color?: string;
  quantity: number;
}

interface CartContextType {
  items: CartItem[];
  addItem: (item: Omit<CartItem, "quantity">, options?: { silent?: boolean }) => void;
  removeItem: (id: number, size?: string, color?: string) => void;
  updateQuantity: (id: number, quantity: number, size?: string, color?: string) => void;
  replaceCart: (items: CartItem[]) => void;
  clearCart: () => void;
  totalItems: number;
  totalPrice: number;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  couponApplied: boolean;
  couponCode: string;
  applyCoupon: (code: string) => boolean;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const loadCart = (): CartItem[] => {
  try {
    const saved = localStorage.getItem("cart_items");
    return saved ? JSON.parse(saved) : [];
  } catch { return []; }
};

const loadCoupon = () => {
  try {
    const saved = localStorage.getItem("cart_coupon");
    return saved ? JSON.parse(saved) : { applied: false, code: "" };
  } catch { return { applied: false, code: "" }; }
};

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [items, setItems] = useState<CartItem[]>(loadCart);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const savedCoupon = loadCoupon();
  const [couponApplied, setCouponApplied] = useState(savedCoupon.applied);
  const [couponCode, setCouponCode] = useState(savedCoupon.code);

  useEffect(() => {
    localStorage.setItem("cart_items", JSON.stringify(items));
  }, [items]);

  useEffect(() => {
    localStorage.setItem("cart_coupon", JSON.stringify({ applied: couponApplied, code: couponCode }));
  }, [couponApplied, couponCode]);

  const addItem = (item: Omit<CartItem, "quantity">, options?: { silent?: boolean }) => {
    setItems((prev) => {
      const existing = prev.find((i) => i.id === item.id && i.size === item.size && i.color === item.color);
      if (existing) {
        return prev.map((i) =>
          i.id === item.id && i.size === item.size && i.color === item.color ? { ...i, quantity: i.quantity + 1 } : i
        );
      }
      return [...prev, { ...item, quantity: 1 }];
    });
    if (!options?.silent) setIsCartOpen(true);
  };

  const removeItem = (id: number, size?: string, color?: string) => {
    setItems((prev) => prev.filter((i) => !(i.id === id && i.size === size && i.color === color)));
  };

  const updateQuantity = (id: number, quantity: number, size?: string, color?: string) => {
    if (quantity <= 0) {
      removeItem(id, size, color);
      return;
    }
    setItems((prev) =>
      prev.map((i) => (i.id === id && i.size === size && i.color === color ? { ...i, quantity } : i))
    );
  };

  const replaceCart = (next: CartItem[]) => {
    setItems(next.map((i) => ({ ...i, quantity: Math.max(1, Number(i.quantity) || 1) })));
  };

  const clearCart = () => {
    setItems([]);
    setCouponApplied(false);
    setCouponCode("");
  };

  const applyCoupon = (code: string): boolean => {
    if (couponApplied) return false;
    const normalized = code.trim().toUpperCase();
    if (normalized === "ALPHA" || normalized === "ALPHA5%" || normalized === "BELLACASA") {
      setCouponApplied(true);
      setCouponCode(normalized);
      return true;
    }
    return false;
  };

  const totalItems = items.reduce((sum, i) => sum + i.quantity, 0);
  const totalPrice = items.reduce((sum, i) => sum + i.price * i.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        updateQuantity,
        replaceCart,
        clearCart,
        totalItems,
        totalPrice,
        isCartOpen,
        setIsCartOpen,
        couponApplied,
        couponCode,
        applyCoupon,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used within CartProvider");
  return context;
};
