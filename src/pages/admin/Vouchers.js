import React, { useState, useEffect } from 'react';
import { Pagination, Spinner, Alert, Badge } from 'react-bootstrap';
import Search from '../../components/Search';
import Popup from '../../components/Popup';
import VoucherForm from '../../components/VoucherForm';

const Vouchers = () => {
    const [vouchers, setVouchers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [recallId, setRecallId] = useState(1);
    const [showModal, setShowModal] = useState(false);
    const [selectedVoucher, setSelectedVoucher] = useState(null);

    const [paginations, setPaginations] = useState({
        total: 0,
        limit: 10,
        offset: 0,
    });

    useEffect(() => {
        const fetchVouchers = async () => {
            setLoading(true);
            setError(null);
            try {
                const response = await fetch(`http://localhost:3010/api/vouchers?limit=${paginations.limit}&offset=${paginations.offset}`);
                const data = await response.json();
                if (data.success) {
                    setVouchers(data.data.vouchers); // Adjust based on your API response structure
                    setPaginations((prev) => ({
                        ...prev,
                        total: data.data.paginations.total,
                    }));
                } else {
                    setError(data.message || 'Failed to fetch vouchers.');
                }
            } catch (err) {
                setError(err.message || 'An error occurred.');
            } finally {
                setLoading(false);
            }
        };

        fetchVouchers();
    }, [recallId]);

    const handlePageChange = (newOffset) => {
        setPaginations((prev) => ({ ...prev, offset: newOffset }));
        setRecallId(recallId + 1);
    };

    const handleLimitChange = (event) => {
        const newLimit = event.target.value ? +event.target.value : 10;
        setPaginations((prev) => ({ ...prev, limit: newLimit, offset: 0 }));
    };

    const totalPages = Math.ceil(paginations.total / paginations.limit);

    const formatDateTime = (isoString) => {
        const date = new Date(isoString);

        const hours = String(date.getUTCHours()).padStart(2, '0');
        const minutes = String(date.getUTCMinutes()).padStart(2, '0');
        const seconds = String(date.getUTCSeconds()).padStart(2, '0');

        const day = String(date.getUTCDate()).padStart(2, '0');
        const month = String(date.getUTCMonth() + 1).padStart(2, '0'); // Months are 0-based in JavaScript
        const year = date.getUTCFullYear();

        return `${hours}:${minutes}:${seconds} ${day}/${month}/${year}`;
    };

    const getStatusBadge = (isActive) => {
        return isActive ? <Badge bg="success">Active</Badge> : <Badge bg="secondary">Inactive</Badge>;
    };

    const handleAfterUpdateData = () => {
        setShowModal(false)
        setRecallId(recallId + 1)
    }

    return (
        <div className="container">
            {error && <Alert variant="danger">{error}</Alert>}
            {loading ? (
                <Spinner animation="border" role="status">
                    <span className="visually-hidden">Loading...</span>
                </Spinner>
            ) : (
                <>
                    <div className='d-flex align-items-center'>
                        <button type="button" className="btn btn-secondary my-2" onClick={() => {
                            setShowModal(true)
                            setSelectedVoucher(null)
                        }}>Add new voucher</button>
                        <Search className="ms-auto" />
                    </div>
                    <Popup
                        title={"Add voucher"}
                        show={showModal}
                        onHide={() => setShowModal(false)}
                        children={<VoucherForm callback={handleAfterUpdateData} voucherId={selectedVoucher ? selectedVoucher.id : null} />}
                    />
                    <table className="table table-hover table-bordered cursor-pointer">
                        <thead>
                            <tr>
                                <th scope="col-1">#</th>
                                <th scope="col">Code</th>
                                <th scope="col">Name</th>
                                <th scope="col">Description</th>
                                <th scope="col">Discount</th>
                                <th scope="col">Start Date</th>
                                <th scope="col">End Date</th>
                                <th scope="col">Min Order Value</th>
                                <th scope="col">Status</th>
                                <th scope="col">Quantity</th>
                                <th scope="col">Created At</th>
                                <th scope="col">Updated At</th>
                            </tr>
                        </thead>
                        <tbody>
                            {vouchers && vouchers.map((voucher, index) => (
                                <tr key={index} onClick={() => {
                                    setSelectedVoucher(voucher)
                                    setShowModal(true)
                                }}>
                                    <th className="align-middle" scope="row">{paginations.offset + index + 1}</th>
                                    <td className="align-middle">{voucher.code}</td>
                                    <td className="align-middle">{voucher.name}</td>
                                    <td className="align-middle">{voucher.description}</td>
                                    <td className="align-middle">
                                        {voucher.discount_type === 'percentage' ? `${voucher.discount_value * 100}%` : `${voucher.discount_value.toLocaleString()} đ`}
                                    </td>
                                    <td className="align-middle">{formatDateTime(voucher.start_date)}</td>
                                    <td className="align-middle">{formatDateTime(voucher.end_date)}</td>
                                    <td className="align-middle">{voucher.minimum_order_value.toLocaleString()} đ</td>
                                    <td className="align-middle">{getStatusBadge(voucher.is_active)}</td>
                                    <td className="align-middle">{voucher.quantity}</td>
                                    <td className="align-middle">{formatDateTime(voucher.created_at)}</td>
                                    <td className="align-middle">{formatDateTime(voucher.updated_at)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    <div className="d-flex">
                        <input
                            type="number"
                            name="limit"
                            placeholder="Limit"
                            className="form form-control w-auto my-2"
                            value={paginations.limit}
                            onChange={handleLimitChange}
                        />
                        <button className="btn btn-secondary my-2 ms-2" onClick={() => setRecallId(recallId + 1)}>Set limit</button>
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

export default Vouchers;
