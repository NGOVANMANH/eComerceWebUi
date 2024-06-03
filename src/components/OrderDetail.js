import React, { useEffect, useState } from 'react';
import { Row, Col, Button, Form, Dropdown, Badge } from 'react-bootstrap';
import { toast } from 'react-toastify';

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

const OrderDetail = (props) => {
    const [orderInfo, setOrderInfo] = useState(null);
    const [status, setStatus] = useState('');

    useEffect(() => {
        const fetchOrderInfo = async () => {
            try {
                const res = await fetch(`http://localhost:3010/api/orders?id=${props.orderId}`);
                const data = await res.json();
                if (data.success) {
                    setOrderInfo(data.data);
                    setStatus(data.data.status);
                }
            } catch (error) {
                console.log(error);
            }
        };
        if (props.orderId) {
            fetchOrderInfo();
        }
    }, [props.orderId]);

    const handleCancelOrder = async () => {
        if (orderInfo?.status !== 'Pending') return;
        try {
            const res = await fetch(`http://localhost:3010/api/orders/`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ id: props.orderId })
            });
            const data = await res.json();
            if (data.success) {
                toast.success(data.message);
                props.callback();
            }
            else toast.error(data.message);
        } catch (error) {
            console.log(error);
        }
    }

    const handleStatusChange = async (newStatus) => {
        try {
            const res = await fetch(`http://localhost:3010/api/orders/status`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ id: props.orderId, status: newStatus })
            });
            const data = await res.json();
            if (data.success) {
                toast.success(data.message);
                setStatus(newStatus);
                props.callback();
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            console.log(error);
            toast.error('An error occurred while updating the status.');
        }
    };

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

    if (!props.orderId) {
        return <div>Order not found</div>;
    }

    if (!orderInfo) {
        return <div>Loading...</div>;
    }

    return (
        <div className='px-4'>
            {!props.showForAdmin &&
                <h3 className='text-center'>Order Detail</h3>}
            {orderInfo?.items?.map((cartItem, index) => (
                <div key={index}>
                    <Row>
                        <Col lg={3} md={12} className="mb-4 mb-lg-0">
                            <div className="bg-image hover-overlay hover-zoom ripple rounded" data-mdb-ripple-color="light">
                                <img src={cartItem.thumbnail} className="w-100" alt={cartItem.name} />
                                <a href="#!">
                                    <div className="mask" style={{ backgroundColor: "rgba(251, 251, 251, 0.2)" }}></div>
                                </a>
                            </div>
                        </Col>
                        <Col lg={5} md={6} className="mb-4 mb-lg-0">
                            <p><strong>{cartItem.name}</strong></p>
                            <p><input type='color' disabled value={cartItem.color} /></p>
                            <p>Size: {cartItem.size}</p>
                            <p>x {cartItem.quantity}</p>
                        </Col>
                        <Col lg={4} md={6} className="mb-4 mb-lg-0">
                            <p className="text-start text-md-center">
                                <strong>{(cartItem?.price)?.toLocaleString()} đ</strong>
                            </p>
                        </Col>
                    </Row>
                    <hr className="my-4" />
                </div>
            ))}
            <div>
                <p className="fs-6 mb-2">Status: {getStatus(status)}</p>
                <p className="fs-6 mb-2">Address: {orderInfo.address_title}</p>
                <p className="fs-6 mb-2">Phone number: {orderInfo.address_phone_number}</p>
                <p className="fs-6 mb-2">Date: {formatDateTime(orderInfo.created_at)}</p>
                <p className="fs-6 mb-2">Voucher: {(orderInfo.discount_value ? orderInfo.discount_type === 'percentage' ? orderInfo.total * orderInfo.discount_value : orderInfo.discount_value : 0).toLocaleString()} đ</p>
                <p className="fs-6 mb-2">Total: {orderInfo.total.toLocaleString()} đ</p>
            </div>
            {!props.showForAdmin ? (
                <Button variant='danger' disabled={orderInfo.status !== 'Pending'} onClick={handleCancelOrder}>Cancel order</Button>
            ) : (
                <div>
                    <h3>Admin Order Management</h3>
                    <Dropdown onSelect={handleStatusChange}>
                        <Dropdown.Toggle variant={statusMap[status]?.variant || 'secondary'} id="dropdown-basic">
                            {statusMap[status]?.label || 'Unknown'}
                        </Dropdown.Toggle>

                        <Dropdown.Menu>
                            {Object.keys(statusMap).map((key) => (
                                <Dropdown.Item key={key} eventKey={key}>
                                    {statusMap[key].label}
                                </Dropdown.Item>
                            ))}
                        </Dropdown.Menu>
                    </Dropdown>
                </div>
            )}
        </div>
    );
};

export default OrderDetail;
