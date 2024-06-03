import { useState, useEffect } from 'react';
import Image from '../../components/Image';
import Search from '../../components/Search';
import Popup from '../../components/Popup';
import ProductForm from '../../components/ProductForm';
import { Pagination, Spinner, Alert } from 'react-bootstrap';

const Products = () => {
    const [products, setProducts] = useState([]);
    const [modalShow, setModalShow] = useState(false);
    const [recallId, setRecallid] = useState(1);
    const [selectedProduct, setSelectedProduct] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const [paginations, setPaginations] = useState({
        total: 0,
        limit: 10,
        offset: 0,
    });

    useEffect(() => {
        const fetchProducts = async () => {
            setLoading(true);
            setError(null);
            try {
                const response = await fetch(`http://localhost:3010/api/products?limit=${paginations.limit}&offset=${paginations.offset}`);
                const data = await response.json();
                if (data.success) {
                    setProducts(data.data.products); // Adjusted based on your API response structure
                    setPaginations(prev => ({
                        ...prev,
                        total: data.data.paginations.total,
                    }));
                } else {
                    setError(data.message || 'Failed to fetch products.');
                }
            } catch (err) {
                setError(err.message || 'An error occurred.');
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, [recallId]);

    const handleClickItem = (id) => {
        setSelectedProduct(id);
        setModalShow(true);
    };

    const reCallAfterAdd = () => {
        setRecallid(recallId + 1);
        setModalShow(false);
    };

    const handlePageChange = (newOffset) => {
        setPaginations(prev => ({ ...prev, offset: newOffset }));
        setRecallid(recallId + 1)
    };

    const handleLimitChange = (event) => {
        const newLimit = event.target.value ? +event.target.value : 10;
        setPaginations(prev => ({ ...prev, limit: newLimit, offset: 0 }));
    };

    const totalPages = Math.ceil(paginations.total / paginations.limit);

    return (
        <div className='container'>
            <div className='d-flex align-items-center'>
                <button type="button" className="btn btn-secondary my-2"
                    onClick={() => {
                        setModalShow(true);
                        setSelectedProduct(null);
                    }}>Add new product</button>
                <Search className="ms-auto" />
            </div>
            <Popup
                title={selectedProduct ? "Update product" : "Add product"}
                show={modalShow}
                onHide={() => setModalShow(false)}
                children={<ProductForm productId={selectedProduct} callback={reCallAfterAdd} />}
            />
            {error && <Alert variant="danger">{error}</Alert>}
            {loading ? (
                <Spinner animation="border" role="status">
                    <span className="visually-hidden">Loading...</span>
                </Spinner>
            ) : (
                <>
                    <table className="table table-hover table-bordered cursor-pointer">
                        <thead>
                            <tr>
                                <th scope="col">#</th>
                                <th scope="col">Thumbnail</th>
                                <th scope="col">Name</th>
                                <th scope="col">Size</th>
                                <th scope="col">Color</th>
                                <th scope="col">Category</th>
                                <th scope="col">Brand</th>
                                <th scope="col">Price</th>
                                <th scope="col">Quantity</th>
                                <th scope="col">Discount</th>
                            </tr>
                        </thead>
                        <tbody>
                            {products && products.map((product, index) => (
                                <tr
                                    key={index}
                                    onClick={() => handleClickItem(product.id)}
                                >
                                    <th className='align-middle' scope="row">{paginations.offset + index + 1}</th>
                                    <td className='align-middle'>
                                        <Image type="brand avatar" src={product.thumbnail} alt={product.name} />
                                    </td>
                                    <td className='align-middle'>{product.name}</td>
                                    <td className='align-middle'>{product.size}</td>
                                    <td className='align-middle'>
                                        <input type="color" value={product.color} disabled />
                                    </td>
                                    <td className='align-middle'>{product.category_name}</td>
                                    <td className='align-middle'>{product.brand_name}</td>
                                    <td className='align-middle text-danger'>{product.price.toLocaleString()} Đ</td>
                                    <td className='align-middle'>{product.quantity}</td>
                                    <td className='align-middle text-danger'>{product.discount_percent * 100.0} %</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    <div className='d-flex'>
                        <input
                            type="number"
                            name="limit"
                            placeholder='Limit'
                            className='form form-control w-auto my-2'
                            value={paginations.limit}
                            onChange={handleLimitChange}
                        />
                        <button className='btn btn-secondary my-2 ms-2' onClick={() => setRecallid(recallId + 1)}>Set limit</button>
                    </div>
                    <Pagination>
                        <Pagination.First onClick={() => handlePageChange(0)} />
                        <Pagination.Prev onClick={() => handlePageChange(Math.max(0, paginations.offset - paginations.limit))} />
                        {[...Array(totalPages).keys()].map(page => (
                            <Pagination.Item
                                key={page}
                                active={page === Math.floor(paginations.offset / paginations.limit)}
                                onClick={() => handlePageChange(page * paginations.limit)}
                            >
                                {page + 1}
                            </Pagination.Item>
                        ))}
                        <Pagination.Next onClick={() => handlePageChange(Math.min((totalPages - 1) * paginations.limit, paginations.offset + paginations.limit))} />
                        <Pagination.Last onClick={() => handlePageChange((totalPages - 1) * paginations.limit)} />
                    </Pagination>
                </>
            )}
        </div>
    );
};

export default Products;
