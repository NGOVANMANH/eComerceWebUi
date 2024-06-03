import React, { useContext } from 'react';
import { Container, Row, Col, Card, Button, Form } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrashAlt, faMinus, faPlus, faHeart } from '@fortawesome/free-solid-svg-icons';
import ShopContext from '../../context/ShopContext';
import { convertDate } from '../../utils/date.util';
import { useNavigate } from 'react-router-dom';

const Cart = () => {
    const shop = useContext(ShopContext);

    const navigate = useNavigate()

    const handleRemoveFromCart = (pId) => {
        shop.removeFromCart(pId)
    }
    const handelUpadateQuantity = (pId, value) => {
        const thisProduct = shop?.cart?.items.find(item => item.id === pId)
        const quantity = thisProduct?.quantity + value;
        if (quantity > 0) {
            shop.updateQuantity(pId, quantity)
        } else {
            shop.removeFromCart(pId)
        }
    }

    const DisplayDateRange = () => {
        const today = new Date();
        const tomorrow = new Date(today);
        const nextWeek = new Date(today);

        // Correctly calculate the dates
        tomorrow.setDate(today.getDate() + 1);
        nextWeek.setDate(today.getDate() + 7);

        return (
            <p className="mb-0">
                {convertDate(tomorrow)} - {convertDate(nextWeek)}
            </p>
        );
    }

    return (
        <section className="h-100">
            <Container className="py-4">
                <Row className="d-flex justify-content-center my-4">
                    <Col md={8}>
                        <Card className="mb-4">
                            <Card.Header className="py-3">
                                <h5 className="mb-0">Cart - {shop?.cart?.items?.length || 0} items</h5>
                            </Card.Header>
                            <Card.Body>
                                {/* Single item */}
                                {
                                    shop?.cart?.items?.map((cartItem, index) => (
                                        <div key={index}>
                                            <Row>
                                                <Col lg={3} md={12} className="mb-4 mb-lg-0">
                                                    <div className="bg-image hover-overlay hover-zoom ripple rounded" data-mdb-ripple-color="light">
                                                        <img src={cartItem.thumbnail} className="w-100" alt="Blue Jeans Jacket" />
                                                        <a href="#!">
                                                            <div className="mask" style={{ backgroundColor: "rgba(251, 251, 251, 0.2)" }}></div>
                                                        </a>
                                                    </div>
                                                </Col>
                                                <Col lg={5} md={6} className="mb-4 mb-lg-0">
                                                    <p><strong>{cartItem.name}</strong></p>
                                                    <p><input type='color' disabled value={cartItem.color} /></p>
                                                    <p>Size: {cartItem.size}</p>
                                                    <Button variant="primary" size="sm" className="me-1 mb-2" title="Remove item" onClick={() => handleRemoveFromCart(cartItem.id)}>
                                                        <FontAwesomeIcon icon={faTrashAlt} />
                                                    </Button>
                                                    <Button variant="danger" size="sm" className="mb-2" title="Move to the wish list">
                                                        <FontAwesomeIcon icon={faHeart} />
                                                    </Button>
                                                </Col>
                                                <Col lg={4} md={6} className="mb-4 mb-lg-0">
                                                    <div className="d-flex mb-4" style={{ maxWidth: '300px' }}>
                                                        <Button variant="primary" className="px-3 me-2" onClick={() => handelUpadateQuantity(cartItem.id, -1)}>
                                                            <FontAwesomeIcon icon={faMinus} />
                                                        </Button>
                                                        <Form.Control type="number" min="0" id="form1" name="quantity" value={cartItem.quantity} className="form-control" />
                                                        <Button variant="primary" className="px-3 ms-2" onClick={() => handelUpadateQuantity(cartItem.id, +1)}>
                                                            <FontAwesomeIcon icon={faPlus} />
                                                        </Button>
                                                    </div>
                                                    <p className="text-start text-md-center">
                                                        <strong>{(cartItem.quantity * cartItem.price).toLocaleString()} đ</strong>
                                                    </p>
                                                </Col>
                                            </Row>
                                            <hr className="my-4" />
                                        </div>
                                    ))
                                }
                                {/* Another Single item */}
                            </Card.Body>
                        </Card>
                        <Card className="mb-4">
                            <Card.Body>
                                <p><strong>Expected shipping delivery</strong></p>
                                <p className="mb-0">
                                    {DisplayDateRange()}
                                </p>
                            </Card.Body>
                        </Card>
                        <Card className="mb-4 mb-lg-0">
                            <Card.Body>
                                <p><strong>We accept</strong></p>
                                <img className="me-2" width="45px" src="https://mdbcdn.b-cdn.net/wp-content/plugins/woocommerce-gateway-stripe/assets/images/visa.svg" alt="Visa" />
                                <img className="me-2" width="45px" src="https://mdbcdn.b-cdn.net/wp-content/plugins/woocommerce-gateway-stripe/assets/images/amex.svg" alt="American Express" />
                                <img className="me-2" width="45px" src="https://mdbcdn.b-cdn.net/wp-content/plugins/woocommerce-gateway-stripe/assets/images/mastercard.svg" alt="Mastercard" />
                                <img className="me-2" width="45px" src="https://icons.veryicon.com/png/o/miscellaneous/font-awesome-1/cc-paypal-4.png" alt="PayPal acceptance mark" />
                            </Card.Body>
                        </Card>
                    </Col>
                    <Col md={4}>
                        <Card className="mb-4">
                            <Card.Header className="py-3">
                                <h5 className="mb-0">Summary</h5>
                            </Card.Header>
                            <Card.Body>
                                <ul className="list-group list-group-flush">
                                    <li className="list-group-item d-flex justify-content-between align-items-center border-0 px-0 pb-0">
                                        Products
                                        <span>{
                                            shop?.cart?.total?.toLocaleString()
                                        } đ</span>
                                    </li>
                                    <li className="list-group-item d-flex justify-content-between align-items-center px-0">
                                        {/* Shipping
                                        <span>Free</span> */}
                                    </li>
                                    <li className="list-group-item d-flex justify-content-between align-items-center border-0 px-0 mb-3">
                                        <div>
                                            <strong>Total amount</strong>
                                            <strong>
                                                <p className="mb-0">(including VAT)</p>
                                            </strong>
                                        </div>
                                        <span><strong>{shop?.cart?.total?.toLocaleString()} đ</strong></span>
                                    </li>
                                </ul>
                                <Button variant="primary" block onClick={() => navigate('/order')}>
                                    Go to checkout
                                </Button>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            </Container>
        </section>
    );
};

export default Cart;
