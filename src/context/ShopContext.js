// AuthContext.js
import { createContext, useEffect, useState } from "react";
import { toast } from "react-toastify";

const ShopContext = createContext();

export const ShopProvider = ({ children }) => {
    const [brands, setBrands] = useState();
    const [categories, setCategories] = useState();
    const [cart, setCart] = useState({});
    const [reCallApi, setRecallApi] = useState(1);
    const shopName = 'DemShop'

    useEffect(() => {
        const fetchData = async () => {

            fetch('http://localhost:3010/api/brands')
                .then(res => res.json())
                .then(data => {
                    if (data.success) {
                        setBrands(data.data)
                    }
                })
                .catch(console.log)

            fetch('http://localhost:3010/api/categories')
                .then(res => res.json())
                .then(data => {
                    if (data.success) {
                        setCategories(data.data)
                    }
                })
                .catch(console.log)
        }

        fetchData()
    }, [reCallApi])


    const reCall = () => {
        setRecallApi(reCallApi + 1)
    }


    const getCart = async () => {

        const user = JSON.parse(localStorage.getItem('user'));

        if (!user) {
            return;
        }

        try {
            const res = await fetch(`http://localhost:3010/api/carts?userId=${user.id}`);
            const data = await res.json();
            if (data.success) {
                setCart(data.data)
            }
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        getCart()
    }, []);


    const addToCart = ({ userId, productSkuId, quantity }) => {
        if (!userId) {
            toast.error('Please login first');
            return
        }
        const addProduct = async () => {
            try {
                const res = await fetch('http://localhost:3010/api/carts', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ userId, productSkuId, quantity })
                });
                const data = await res.json();
                if (data.success) {
                    getCart()
                    toast.success('add success')
                }
            } catch (error) {
                console.log(error);
            }
        }

        addProduct()
    }


    const updateQuantity = (productId, quantity) => {
        const updateProduct = async () => {
            try {
                const res = await fetch(`http://localhost:3010/api/carts?cartId=${cart.cart_id}`, {
                    method: 'PATCH',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ productSkuId: productId, quantity })
                });
                const data = await res.json();
                if (data.success) {
                    getCart()
                }
            } catch (error) {
                console.log(error);
            }
        }

        updateProduct()
    }

    const removeFromCart = (productSkuId) => {
        const remove = async () => {
            try {
                const res = await fetch(`http://localhost:3010/api/carts/${cart.cart_id}`, {
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ productSkuId })
                });
                const data = await res.json();
                if (data.success) {
                    getCart()
                }
            } catch (error) {
                console.log(error);
            }
        }
        remove()
    }

    const emptyCart = () => {
        const empty = async () => {
            try {
                const res = await fetch(`http://localhost:3010/api/carts?cartId=${cart.cart_id}`, {
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });
                const data = await res.json();
                if (data.success) {
                    getCart()
                }
            } catch (error) {
                console.log(error);
            }
        }
        empty()
    }

    return <ShopContext.Provider value={{ shopName, brands, categories, reCall, cart, addToCart, updateQuantity, removeFromCart, emptyCart }}>
        {children}
    </ShopContext.Provider>
};

export default ShopContext;
