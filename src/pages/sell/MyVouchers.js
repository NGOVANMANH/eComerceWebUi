import React, { useContext } from 'react';
import { Col, Container, Row } from 'react-bootstrap';
import Voucher from '../../components/Voucher';
import AuthContext from '../../context/AuthContext';

const MyVouchers = () => {
    const [vouchers, setVouchers] = React.useState([]);
    const auth = useContext(AuthContext)
    React.useEffect(() => {
        const fetchVouchers = async () => {
            try {
                const response = await fetch(`http://localhost:3010/api/vouchers/user/${auth?.user?.id}`);
                const data = await response.json();
                console.log(data);
                if (data.success) {
                    setVouchers(data.data);
                }
            } catch (error) {
                console.log(error);
            }
        }
        fetchVouchers();
    }, [])
    return (
        <Container className='my-2'>
            <Row xs={1} md={3} className="g-2">
                {
                    vouchers?.map((voucher, idx) => (
                        voucher.is_active === 1 &&
                        <Col key={idx}>
                            <Voucher voucher={voucher} isShowButton={false} />
                        </Col>
                    ))
                }
            </Row>
        </Container>
    );
}

export default MyVouchers;
