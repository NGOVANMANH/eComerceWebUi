import { useState, useEffect } from 'react';
import { Pagination, Spinner, Alert, Badge } from 'react-bootstrap';
import Popup from '../../components/Popup';
import Search from '../../components/Search';
import OrderDetail from '../../components/OrderDetail';
import { useNavigate } from 'react-router-dom';

const Orders = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [recallId, setRecallId] = useState(1);
    const [showModal, setShowModal] = useState(false);
    const [orderSelected, setOrderSelected] = useState(null)
    const navigate = useNavigate()

    const [paginations, setPaginations] = useState({
        total: 0,
        limit: 10,
        offset: 0,
    });

    const statusMap = {
        Pending: { variant: 'warning', label: 'Pending' },
        Awaiting_Payment: { variant: 'primary', label: 'Awaiting Payment' },
        Confirmed: { variant: 'info', label: 'Confirmed' },
        Processing: { variant: 'info', label: 'Processing' },
        On_Hold: { variant: 'secondary', label: 'On Hold' },
        In_Progress: { variant: 'info', label: 'In Progress' },
        Shipped: { variant: 'primary', label: 'Shipped' },
        Out_For_Delivery: { variant: 'primary', label: 'Out For Delivery' },
        Delivered: { variant: 'success', label: 'Delivered' },
        Cancelled: { variant: 'danger', label: 'Cancelled' }
    };

    const getStatus = (status) => {
        const { variant, label } = statusMap[status] || { variant: 'secondary', label: 'Unknown' };
        return <Badge bg={variant}>{label}</Badge>;
    }

    useEffect(() => {
        const fetchOrders = async () => {
            setLoading(true);
            setError(null);
            try {
                const response = await fetch(`http://localhost:3010/api/orders/o?limit=${paginations.limit}&offset=${paginations.offset}`);
                const data = await response.json();
                if (data.success) {
                    setOrders(data.data.orders); // Adjust based on your API response structure
                    setPaginations(prev => ({
                        ...prev,
                        total: data.data.paginations.total,
                    }));
                } else {
                    setError(data.message || 'Failed to fetch orders.');
                }
            } catch (err) {
                setError(err.message || 'An error occurred.');
            } finally {
                setLoading(false);
            }
        };

        fetchOrders();
    }, [recallId]);

    const handlePageChange = (newOffset) => {
        setPaginations(prev => ({ ...prev, offset: newOffset }));
        setRecallId(recallId + 1);
    };

    const handleLimitChange = (event) => {
        const newLimit = event.target.value ? +event.target.value : 10;
        setPaginations(prev => ({ ...prev, limit: newLimit, offset: 0 }));
    };

    const totalPages = Math.ceil(paginations.total / paginations.limit);

    function formatDateTime(isoString) {
        const date = new Date(isoString);

        const hours = String(date.getUTCHours()).padStart(2, '0');
        const minutes = String(date.getUTCMinutes()).padStart(2, '0');
        const seconds = String(date.getUTCSeconds()).padStart(2, '0');

        const day = String(date.getUTCDate()).padStart(2, '0');
        const month = String(date.getUTCMonth() + 1).padStart(2, '0'); // Months are 0-based in JavaScript
        const year = date.getUTCFullYear();

        return `${hours}:${minutes}:${seconds} ${day}/${month}/${year}`;
    }

    const handleSelectOrder = (id) => {
        setShowModal(true)
        setOrderSelected(id)
    }

    const reacallApiAfterUpdate = () => {
        setShowModal(false);
        setRecallId(recallId + 1);
    }

    return (
        <div className='container'>
            {error && <Alert variant="danger">{error}</Alert>}
            {loading ? (
                <Spinner animation="border" role="status">
                    <span className="visually-hidden">Loading...</span>
                </Spinner>
            ) : (
                <>
                    <div className='d-flex align-items-center'>
                        <button type="button" className="btn btn-secondary my-2"
                            onClick={() => navigate('/admin/make-order')}
                        >Add new order</button>
                        <Search className="ms-auto" />
                    </div>
                    <Popup
                        title={'Order detail'}
                        show={showModal}
                        children={<OrderDetail orderId={orderSelected ? orderSelected : null} showForAdmin="true" callback={reacallApiAfterUpdate} />}
                        onHide={() => setShowModal(false)}
                    />
                    <table className="table table-hover table-bordered cursor-pointer">
                        <thead>
                            <tr>
                                <th scope="col-1">#</th>
                                <th scope="col">Customer Name</th>
                                <th scope="col">Total Amount</th>
                                <th scope="col">Address</th>
                                <th scope="col">Status</th>
                                <th scope="col">Time</th>
                                <th scope="col">Voucher</th>
                            </tr>
                        </thead>
                        <tbody>
                            {orders && orders.map((order, index) => (
                                <tr key={index} onClick={() => handleSelectOrder(order.id)}>
                                    <th className='align-middle' scope="row">{paginations.offset + index + 1}</th>
                                    <td className='align-middle'>{order.customer_name}</td>
                                    <td className='align-middle text-danger'>{order.total.toLocaleString()} đ</td>
                                    <td className='align-middle'>{order.address_title}</td>
                                    <td className='align-middle'>{getStatus(order.status)}</td>
                                    <td className='align-middle'>{formatDateTime(order.created_at)}</td>
                                    <td className='align-middle'>{(order.discount_value ? order.discount_type === 'percentage' ? order.total * order.discount_value : order.discount_value : 0).toLocaleString()} đ</td>
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
                        <button className='btn btn-secondary my-2 ms-2' onClick={() => setRecallId(recallId + 1)}>Set limit</button>
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

export default Orders;
