import React from 'react';
import { Col, Row, Image } from 'react-bootstrap';

const SearchItem = ({ product }) => {
    return (
        product ?
            <div className='bg-white'>
                <Row>
                    <Col md='auto'>
                        <Image
                            src={product.thumbnail}
                            style={{
                                width: "60px",
                                height: "60px",
                                objectFit: "cover"
                            }}
                            alt={product.name} />
                    </Col>
                    <Col>
                        <Row>
                            <Col>{product.name}</Col>
                        </Row>
                        <Row>
                            <Col>{(product.price * (1 - product.discount_percent ? product.discount_percent : 0))?.toLocaleString()} đ</Col>
                        </Row>
                    </Col>
                </Row>
            </div> :
            <div>
                <Row>
                    <Col>
                        <p>No products found</p>
                    </Col>
                </Row>
            </div>);
}

export default SearchItem;
