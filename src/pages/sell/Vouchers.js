import React from 'react';
import { Row, Col, Container } from 'react-bootstrap';
import Voucher from '../../components/Voucher';

const Vouchers = () => {

    const [vouchers, setVouchers] = React.useState([]);

    React.useEffect(() => {
        const fetchVouchers = async () => {
            try {
                const response = await fetch(`http://localhost:3010/api/vouchers`);
                const data = await response.json();
                if (data.success) {
                    setVouchers(data.data.vouchers);
                }
            } catch (error) {
                console.error(error);
            }
        }

        fetchVouchers();
    }, [])

    return (
        <Container className='my-2'>
            <Row xs={1} md={4} className="g-2">
                {
                    vouchers?.map((voucher, idx) => (
                        <Col key={idx}>
                            <Voucher voucher={voucher} />
                        </Col>
                    ))
                }
            </Row>
        </Container>
    );
}

export default Vouchers;
