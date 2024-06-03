import React, { useContext, useEffect, useState } from 'react';
import { Container, Row, Col, Card, Image, Button, Table, Badge } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUserEdit } from '@fortawesome/free-solid-svg-icons'
import AuthContext from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import SideNav from '../../components/SideNav';
import { convertDate } from '../../utils/date.util'
import Popup from '../../components/Popup'
const Profile = () => {

    const auth = useContext(AuthContext)
    const navigate = useNavigate()
    const [user, setUser] = useState(null)
    const [addresses, setAddresses] = useState([])
    const [orders, setOrders] = useState([])
    const [showSidenav, setShowSidenav] = useState(false)
    const [editMode, setEditMode] = useState()
    const [selected, setSelected] = useState({
        address: null,
        order: null,
    })

    const [recallApi, setRecallApi] = useState(1);

    useEffect(() => {
        if (!auth.isAuthenticated) {
            navigate('/auth')
        }
        else {
            setUser(auth.user)
        }
    }, [auth.isAuthenticated, navigate, auth.user]);

    useEffect(() => {
        const fetchAdresses = async () => {
            try {
                const res = await fetch(`http://localhost:3010/api/addresses?userId=${user.id}`)
                const data = await res.json()
                if (data.success) {
                    setAddresses(data.data)
                }
            } catch (error) {
                console.error(error)
            }
        }
        const fetchOrders = async () => {
            try {
                const res = await fetch(`http://localhost:3010/api/orders/u/${user.id}`)
                const data = await res.json()
                if (data.success) {
                    setOrders(data.data)
                }
            } catch (error) {
                console.error(error)
            }
        }

        if (user) {
            fetchAdresses()
            fetchOrders()
        }

    }, [user, recallApi]);

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

    const handleEditUserInfo = () => {
        setEditMode('user')
        setShowSidenav(true)
    }
    const handleEditUserAddress = (address) => {
        setEditMode('address')
        setSelected(prev => ({
            ...prev,
            address: address,
        }))
        setShowSidenav(true)
    }
    const handleEditOrder = (order) => {
        setEditMode('order')
        setSelected(prev => ({
            ...prev,
            order: order,
        }))
        setShowSidenav(true)
    }

    const updateNewDataAfterEdit = () => {
        setRecallApi(recallApi + 1);
        setShowSidenav(false)
    }

    const [showModal, setShowModal] = useState(false)

    const handleAddAddress = () => {
        setShowModal(true)
    }

    return (
        <div>
            <Popup
                title={'Add address'}
                show={showModal}
                children={<>Addressform</>}
                onHide={() => setShowModal(false)}
            />
            <SideNav show={showSidenav} onHide={() => setShowSidenav(false)} mode={editMode}
                data={editMode === 'address' ? selected.address : editMode === 'order' ? selected.order : null} callback={updateNewDataAfterEdit} />
            <Container className="py-4">
                <Row className="d-flex justify-content-center align-items-center">
                    <Col className="mb-4 mb-lg-0">
                        <Card className="mb-3" style={{ borderRadius: '.5rem' }}>
                            <Row className="g-0">
                                <Col md={4} className="text-center text-white" style={{ background: 'linear-gradient(45deg, #6a11cb, #2575fc)', borderTopLeftRadius: '.5rem', borderBottomLeftRadius: '.5rem' }}>
                                    <Image src={user?.avatar || "https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-chat/ava1-bg.webp"} alt="Avatar" className="img-fluid my-5" style={{ width: '80px', height: '80px' }} roundedCircle />
                                    <h6>@{user?.username}</h6>
                                    <h5>{user?.first_name + user?.last_name}</h5>
                                    <p>{convertDate(user?.birth_of_date)}</p>
                                    <p>{user?.role}</p>
                                    <Button variant="link" className="text-white mb-5"><FontAwesomeIcon icon={faUserEdit}
                                        onClick={handleEditUserInfo}
                                    /></Button>
                                </Col>
                                <Col md={8}>
                                    <Card.Body className="p-4">
                                        <h6>Information</h6>
                                        <hr className="mt-0 mb-4" />
                                        <Row className="pt-1">
                                            <Col xs={6} className="mb-3">
                                                <h6>Email</h6>
                                                <p className="text-muted">{user?.email}</p>
                                            </Col>
                                            <Col xs={6} className="mb-3">
                                                <h6>Phone</h6>
                                                <p className="text-muted">{user?.phone_number}</p>
                                            </Col>
                                        </Row>
                                        <h6>About user</h6>
                                        <hr className="mt-0 mb-4" />
                                        <Row className="pt-1">
                                            <Col xs={6} className="mb-3">
                                                <h6>Addresses<Button className='ms-2' variant='outline-secondary' size='sm' onClick={handleAddAddress}>+</Button></h6>
                                                <Table hover>
                                                    <thead>
                                                        <tr>
                                                            <th>#</th>
                                                            <th>Title</th>
                                                            <th>Phone</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {
                                                            addresses.map((address, index) => (
                                                                <tr key={index} className='cursor-pointer' onClick={() => handleEditUserAddress(address)}>
                                                                    <td>{index + 1}</td>
                                                                    <td>{address.title}</td>
                                                                    <td>{address.phone_number}</td>
                                                                </tr>
                                                            ))
                                                        }
                                                    </tbody>
                                                </Table>
                                            </Col>
                                            <Col xs={6} className="mb-3">
                                                <h6>Orders</h6>
                                                <Table hover>
                                                    <thead>
                                                        <tr>
                                                            <th>#</th>
                                                            <th>Total</th>
                                                            <th>Status</th>
                                                            <th>Time</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {
                                                            orders.map((order, index) => (
                                                                <tr key={index} className='cursor-pointer' onClick={() => handleEditOrder(order)}>
                                                                    <td>{index + 1}</td>
                                                                    <td>{order.total.toLocaleString()} đ</td>
                                                                    <td>
                                                                        {getStatus(order.status)}
                                                                    </td>
                                                                    <td>{convertDate(order.created_at)}</td>
                                                                </tr>
                                                            ))
                                                        }
                                                    </tbody>
                                                </Table>
                                            </Col>
                                        </Row>
                                        <div className="d-flex justify-content-start">
                                            <a href="#!" className="me-3"><i className="fab fa-facebook-f fa-lg"></i></a>
                                            <a href="#!" className="me-3"><i className="fab fa-twitter fa-lg"></i></a>
                                            <a href="#!"><i className="fab fa-instagram fa-lg"></i></a>
                                        </div>
                                    </Card.Body>
                                </Col>
                            </Row>
                        </Card>
                    </Col>
                </Row>
            </Container>
        </div>
    );
}

export default Profile;
