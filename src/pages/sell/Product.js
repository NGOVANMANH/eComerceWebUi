import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import ProductInfo from '../../components/ProductInfo';

const Product = () => {
    const [products, setProducts] = useState(null);
    const { productId } = useParams()
    const navigate = useNavigate()

    useEffect(() => {

        if (!productId) {
            navigate('/dasdadas')
        }

        const fetchProductSkus = async () => {
            try {
                const res = await fetch(`http://localhost:3010/api/products/product-skus/${productId}`);
                const data = await res.json();
                if (data.success) {
                    setProducts(data.data);
                }
            } catch (error) {
                console.log(error);
            }
        }

        fetchProductSkus()
    }, [productId, navigate]);

    return (
        <div className='container my-4'>
            {
                products &&
                <ProductInfo products={products} isPage={true} />
            }
        </div>
    );
}

export default Product;
