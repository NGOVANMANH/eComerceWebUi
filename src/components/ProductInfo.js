import React, { useContext } from 'react';
import Image from './Image';
import productDefaultImage from '../assets/download.png';
import { Col, Row } from 'react-bootstrap';
import styled from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCartPlus } from '@fortawesome/free-solid-svg-icons'
import ShopContext from '../context/ShopContext';
import AuthContext from '../context/AuthContext';
import { toast } from 'react-toastify';

const ProductInfo = (props) => {

    const shop = useContext(ShopContext);
    const auth = useContext(AuthContext);

    const handleAddToCart = (product) => {
        if (!auth.isAuthenticated) {
            toast.error("Please login to add to cart");
            return;
        }

        shop.addToCart({ userId: auth.user.id, productSkuId: product.id, quantity: 1 })
    }

    return (
        <>
            {!props.isPage ? (
                <div className="d-flex flex-row mb-2">
                    <Image
                        src={props.product?.thumbnail ? props.product.thumbnail : productDefaultImage}
                        alt="Product img"
                        type="product"
                    />
                    <div className="ms-2 d-flex flex-column justify-content-center">
                        <div>{props.product.name}</div>
                        <div>{props.product.brand_name}</div>
                        <div>{props.product.category_name}</div>
                        <div>{(props.product.price * (1 - props.product.discountPercent)).toLocaleString()} Đ</div>
                        <div>{props.product.size}</div>
                        <div>
                            <input type="color" value={props.product.attributes.color} disabled />
                        </div>
                        <div>quantity: {props.product.quantity}</div>
                    </div>
                </div>
            ) : (
                <>
                    {props?.products && (
                        <Row>
                            <Col md='auto'>
                                <ImagePage src={props.products[0].thumbnail} alt="product" />
                            </Col>

                            <Col>
                                <table className="table align-middle mb-0 bg-white">
                                    <thead className="bg-light">
                                        <tr>
                                            <th>Name</th>
                                            <th>Size</th>
                                            <th>Color</th>
                                            <th>Quantity</th>
                                            <th>Price</th>
                                            <th>Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {props.products.map((product, index) => (
                                            <tr key={index}>
                                                <td>
                                                    {product.name}
                                                </td>
                                                <td>
                                                    {product.size}
                                                </td>
                                                <td>
                                                    <input type='color' value={product.color} disabled />
                                                </td>
                                                <td>{product.quantity}</td>
                                                <td>
                                                    {(product.price * (1 - product.discount_percent || 0)).toLocaleString()} đ
                                                </td>
                                                <td>
                                                    <button type="button" className="btn btn-link btn-sm btn-rounded" onClick={() => handleAddToCart(product)}>
                                                        <FontAwesomeIcon icon={faCartPlus} />
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </Col>
                        </Row>
                    )}
                </>
            )
            }
        </>
    );
};

const ImagePage = styled.img`
  height: 600px;
`;

export default ProductInfo;
