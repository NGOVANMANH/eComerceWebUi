import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import SidebarEditUser from './SidebarEditUser';
import { Row, Col } from 'react-bootstrap';
import AddressForm from './AddressForm';
import OrderDetail from './OrderDetail';

const SideNav = (props) => {
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        if (props.show) {
            setVisible(true);
        }
    }, [props.show]);

    const handleTransitionEnd = () => {
        if (!props.show) {
            setVisible(false);
        }
    };

    const getModeComponent = () => {
        switch (props.mode) {
            case 'user':
                return <SidebarEditUser />;
            case 'address':
                return <AddressForm address={props.data} callback={props.callback} />;
            case 'order':
                return <OrderDetail orderId={props.data.id} callback={props.callback} />;
            default:
                return <h1>Hmm</h1>;
        }
    }

    return (
        visible && (
            <Wrapper show={props.show}>
                <Row className='h-100'>
                    <Col md="8" className='bg-opacity' onClick={props.onHide} />
                    <Col
                        md="4"
                        className={`content ${props.show ? 'show' : 'hide'}`}
                        onTransitionEnd={handleTransitionEnd}
                    >
                        {
                            getModeComponent()
                        }
                    </Col>
                </Row>
            </Wrapper>
        )
    );
};

const Wrapper = styled.div`
    position: fixed;
    height: 100vh;
    width: 100vw;
    top: 0;
    left: 0;
    z-index: 10000;
    overflow: scroll;

    .bg-opacity {
        background-color: rgba(0, 0, 0, 0.5);
        top: 0;
        left: 0;
        z-index: 10000;
        overflow: hidden;
        padding: 0;
        transition: opacity 0.5s ease;
        opacity: ${props => (props.show ? 1 : 0)};
    }

    .content {
        background-color: white;
        top: 0;
        right: 0;
        z-index: 10000;
        transition: transform 0.5s ease, opacity 0.5s ease;
        padding: 0;
        transform: translateX(100%); /* Hide by default */
        opacity: 0;
    }

    .content.show {
        transform: translateX(0); /* Show the sidebar */
        opacity: 1;
    }

    .content.hide {
        transform: translateX(100%); /* Hide the sidebar */
        opacity: 0;
    }
`;

export default SideNav;
