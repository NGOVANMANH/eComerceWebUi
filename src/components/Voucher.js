import React from 'react';
import { Button, Card } from 'react-bootstrap';
import { convertDate } from '../utils/date.util';

const Voucher = (props) => {
    return (
        props.voucher &&
        <Card>
            <Card.Body>
                <Card.Title className='text-warning'>{props?.voucher?.name}</Card.Title>
                <Card.Title className='text-danger fs-2'>{props.voucher.discount_type === "fixed_amount" ? props.voucher.discount_value.toLocaleString() + 'đ' : props.voucher.discount_value * 100 + '%'}</Card.Title>
                <Card.Text style={{ height: '80px' }}>
                    {props?.voucher?.description}
                </Card.Text>
            </Card.Body>
            <Card.Footer>
                <small className="text-muted">{convertDate(props?.voucher?.start_date)} to {convertDate(props?.voucher?.end_date)}</small>
            </Card.Footer>
            <Card.Footer>
                <Button size='sm' className='w-100' variant={props.voucher.is_active ? 'success' : 'secondary'} disabled={!props.voucher.is_active}>Get</Button>
            </Card.Footer>
        </Card>
    );
}

export default Voucher;
