import Col from 'react-bootstrap/Col';
import { useParams } from 'react-router-dom'
import Row from 'react-bootstrap/Row';
import ProductCard from '../../components/ProductCard';
import { useEffect, useState } from 'react';

const Home = () => {

    const [products, setProducts] = useState([]);

    const { key } = useParams()

    useEffect(() => {
        if (!key) return

        fetch(`http://localhost:3010/api/products/search/${key}`)
            .then(res => res.json())
            .then(data => {
                if (data.success) {
                    setProducts(data.data)
                }
            })
            .catch(console.error)
    }, [key])

    return (
        products.length === 0 ? <h1 className='text-center m-5'>No products found</h1> :
            <div>
                <div className="container py-4">
                    <Row xs={1} md={5} className="g-2">
                        {products.map((product, idx) => (
                            <Col key={idx}>
                                <ProductCard productId={product.id} />
                            </Col>
                        ))}
                    </Row>
                </div>
            </div>
    );
}


export default Home;
