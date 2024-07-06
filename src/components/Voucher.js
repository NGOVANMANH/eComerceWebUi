import React, { useContext } from 'react';
import { Button, Card } from 'react-bootstrap';
import AuthContext from '../context/AuthContext'
import { convertDate } from '../utils/date.util';
import { toast } from 'react-toastify';

const Voucher = (props) => {
    const auth = useContext(AuthContext)
    const handleUserGetVoucher = async () => {
        if (auth?.isAuthenticated) {
            try {
                const response = await fetch(`http://localhost:3010/api/vouchers/user-get-voucher`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        userId: auth?.user?.id,
                        voucherId: props.voucher.id,
                    })
                })
                const data = await response.json();
                if (data.success) {
                    toast.success(data.message)
                }
                else {
                    toast.error(data.message)
                }
            } catch (error) {
                console.error(error)
            }
        }
        else {
            toast.info('Please login to get voucher')
        }
    }

    console.log(props.voucher)

    return (
        props.voucher &&
        <Card
            border={
                props.voucher.is_usable !== undefined && props.voucher.is_usable === 0 && 'danger'
            }
        >
            <Card.Body>
                <Card.Title className='text-warning fs-6'>{props?.voucher?.name} {props.voucher.is_usable !== undefined && props.voucher.is_usable === 0 && '(Not available)'}</Card.Title>
                <Card.Title>Code: {props?.voucher?.code?.toUpperCase()}</Card.Title>
                <Card.Title className='text-danger fs-3'>{props.voucher.discount_type === "fixed_amount" ? props.voucher.discount_value.toLocaleString() + 'đ' : props.voucher.discount_value * 100 + '%'}</Card.Title>
                <Card.Text style={{ height: '40px', fontSize: '13px' }}>
                    {props?.voucher?.description}
                </Card.Text>
            </Card.Body>
            <Card.Footer>
                <small className="text-muted">{convertDate(props?.voucher?.start_date)} to {convertDate(props?.voucher?.end_date)}</small>
            </Card.Footer>
            {props.isShowButton !== false && <Card.Footer>
                <Button size='sm' className='w-100' variant={props.voucher.is_active === 1 ? 'success' : 'secondary'} disabled={props.voucher.is_active !== 1}
                    onClick={handleUserGetVoucher}>Get</Button>
            </Card.Footer>}
        </Card>
    );
}

export default Voucher;
