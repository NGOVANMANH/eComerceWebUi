import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import ProductCard from '../../components/ProductCard';
import { useEffect, useState } from 'react';
import { Pagination } from 'react-bootstrap';


const Home = () => {

    const [products, setProducts] = useState([]);
    const [pagination, setPagination] = useState({
        total: null,
        limit: 10,
        offset: 0,
    })

    useEffect(() => {
        fetch(`http://localhost:3010/api/products?limit=${pagination.limit}&offset=${pagination.offset}`)
            .then(res => res.json())
            .then(data => {
                if (data.success) {
                    setProducts(data.data.products)
                    setPagination(prev => ({
                        ...prev,
                        total: data.data.paginations.total,
                    }))
                }
            })
            .catch(console.error)
    }, [pagination.offset, pagination.limit]);


    const handlePageChange = (newOffset) => {
        setPagination(prev => ({ ...prev, offset: newOffset }));
    };

    const totalPages = Math.ceil(pagination.total / pagination.limit);


    return (
        <div>
            <div className="container py-4">
                <Row xs={1} md={5} className="g-2">
                    {products.map((product, idx) => (
                        <Col key={idx}>
                            <ProductCard productId={product.id} />
                        </Col>
                    ))}
                </Row>
                <Pagination className='my-2'>
                    <Pagination.First onClick={() => handlePageChange(0)} />
                    <Pagination.Prev onClick={() => handlePageChange(Math.max(0, pagination.offset - pagination.limit))} />
                    {Array.from({ length: totalPages }, (_, page) => (
                        <Pagination.Item
                            key={page}
                            active={page === Math.floor(pagination.offset / pagination.limit)}
                            onClick={() => handlePageChange(page * pagination.limit)}
                        >
                            {page + 1}
                        </Pagination.Item>
                    ))}
                    <Pagination.Next onClick={() => handlePageChange(Math.min((totalPages - 1) * pagination.limit, pagination.offset + pagination.limit))} />
                    <Pagination.Last onClick={() => handlePageChange((totalPages - 1) * pagination.limit)} />
                </Pagination>
            </div>
        </div>
    );
}


export default Home;
