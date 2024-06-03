import { Placeholder, Button, Card } from 'react-bootstrap';
import productPlaceholderImage from '../assets/No-Image-Placeholder.svg.png'
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

function ProductCard(props) {

    const [product, setProduct] = useState(null);

    useEffect(() => {
        const fetchProductById = async () => {
            try {
                const res = await fetch(`http://localhost:3010/api/products/${props.productId}`);
                const data = await res.json();
                if (data.success) {
                    setProduct(data.data);
                }
            } catch (error) {
                console.error(error)
            }
        }

        if (props.productId) {
            fetchProductById();
        }
    }, [props.productId]);

    const navigate = useNavigate()

    const toProductPage = (id) => {
        navigate('/products/' + id)
    }

    return (
        product ?
            <Card style={{ height: "100%" }}>
                <Card.Img variant="top" src={product.thumbnail} style={{ height: "420px", objectFit: "cover" }} />
                <Card.Body>
                    <Card.Title style={{ display: 'block', height: '120px' }}>{product.name.toUpperCase()}</Card.Title>
                    <Card.Text>
                        {product.short_description || "Sản phẩm đang được bán"}
                    </Card.Text>
                    <Card.Text>
                        {product.brand_name}
                    </Card.Text>
                    <Card.Text className='text-danger'>
                        Sale: {(product.discount_percent || 0) * 100}%
                    </Card.Text>
                    <Button
                        variant="outline-secondary"
                        className='w-100'
                        onClick={() => toProductPage(product.product_id)}>{product.price.toLocaleString()} đ</Button>
                </Card.Body>
            </Card> :
            <Card>
                <Card.Img variant="top" src={productPlaceholderImage} />
                <Card.Body>
                    <Placeholder as={Card.Title} animation="glow">
                        <Placeholder xs={6} />
                    </Placeholder>
                    <Placeholder as={Card.Text} animation="glow">
                        <Placeholder xs={7} /> <Placeholder xs={4} /> <Placeholder xs={4} />{' '}
                        <Placeholder xs={6} /> <Placeholder xs={8} />
                    </Placeholder>
                    <Placeholder.Button variant="primary" xs={6} />
                </Card.Body>
            </Card>
    );
}

export default ProductCard;