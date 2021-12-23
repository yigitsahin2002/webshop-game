import {
    createContext,
    useState,
    useEffect,
    useCallback,
    useContext,
    useMemo
  } from 'react';
import { useSession } from './AuthProvider';

  export const CartContext = createContext();
  export const useShoppingCart = () => useContext(CartContext);

  export const CartProvider = ({
    children
  }) => {
    const [initialLoad, setInitialLoad] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [shoppingCart, setShoppingCart] = useState([]);

    const { ready : authReady } = useSession();

    const refreshShoppingCart = useCallback(() => {
      try {
        setError();
        setLoading(true);
        const data =  window.sessionStorage.getItem("shoppingCart");
        const newShoppingCart = data? JSON.parse(data) : [] 
        setShoppingCart(newShoppingCart);
        return newShoppingCart;
      } catch (error) {
        setError(error);
      } finally {
        setLoading(false)
      }

    }, []);

    useEffect(() => {
      if (authReady && !initialLoad) {
        refreshShoppingCart();
        setInitialLoad(true);
      }
    }, [authReady, initialLoad, refreshShoppingCart]);

    const addToCart = useCallback(({id, aantal}) => {
      setLoading(true);
      setError();
      try {
          let newShoppingCart;

          const order = shoppingCart.find(c => c.id === id);

          if (order) {
            const sum = Number(order.aantal) + Number(aantal);
            order.aantal = sum;

            if (sum > 1000) {
              order.aantal = 1000;
            }

            newShoppingCart = [...shoppingCart.filter(c => c.id !== id), order]
          } else {
            if (aantal > 1000) {
              aantal = 1000;
            }
            newShoppingCart = [...shoppingCart, {id: id, aantal: aantal}];
          }
          
          window.sessionStorage.setItem("shoppingCart", JSON.stringify(newShoppingCart));

          refreshShoppingCart();
        return newShoppingCart;
      } catch (error) {
        console.error(error);
        throw error;
      } finally {
        setLoading(false)
      }
    }, [refreshShoppingCart, shoppingCart]);

    const deleteFromCart = useCallback((id) => {
        setLoading(true);
        setError();
        try {
          
          let newShoppingCart;

          if (typeof id === "object") {
            newShoppingCart = shoppingCart.filter(g => !id.includes(g.id));
          } else {
            newShoppingCart = shoppingCart.filter(g => g.id !== id);
          }
            window.sessionStorage.setItem("shoppingCart", JSON.stringify(newShoppingCart));
  
            refreshShoppingCart();
        } catch (error) {
          console.error(error);
          throw error;
        } finally {
          setLoading(false)
        }
      }, [refreshShoppingCart, shoppingCart]);

    const changeValueOfOrder = useCallback((id, newTotal) => {
      try {
        setLoading(true);
        setError('');

        let index = shoppingCart.findIndex(c => c.id === id);

        let newShoppingCart = shoppingCart;
        if (Number(newTotal) > 1000) {
          newShoppingCart[index].aantal = 1000;
        } else {
          newShoppingCart[index].aantal = newTotal;
        }

        window.sessionStorage.setItem("shoppingCart", JSON.stringify(newShoppingCart));

        refreshShoppingCart();
      } catch (error) {
        console.error(error);
        throw error;
      } finally {
        setLoading(false);
      }
    }, [refreshShoppingCart, shoppingCart]);

    const emptyShoppingCart = useCallback(() => {
      setShoppingCart([]);

      window.sessionStorage.setItem("shoppingCart", JSON.stringify(shoppingCart));
    }, [shoppingCart]);

    const value = useMemo(() => ({
      addToCart,
      deleteFromCart,
      changeValueOfOrder,
      emptyShoppingCart,
      error,
      loading,
      shoppingCart,
    }), [shoppingCart, error, loading, addToCart, deleteFromCart, changeValueOfOrder, emptyShoppingCart])

    return (
      <CartContext.Provider value={value}>
        {children}
      </CartContext.Provider>
    );
  };