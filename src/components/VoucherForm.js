import React, { useState, useEffect, useContext } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import FormInput from './FormInput';  // Assuming you have a similar FormInput component
import ShopContext from '../context/ShopContext';  // Adjust the import path as necessary
import Popup from './Popup';  // Adjust the import path as necessary
import { toast } from 'react-toastify';
import { convertDate } from '../utils/date.util';

const voucherSchema = Yup.object().shape({
    code: Yup.string().required('Please enter the voucher code'),
    name: Yup.string().required('Please enter the voucher name'),
    description: Yup.string(),
    discountType: Yup.string().required('Please select the discount type'),
    discountValue: Yup.number().required('Please enter the discount value'),
    startDate: Yup.date().required('Please enter the start date'),
    endDate: Yup.date().required('Please enter the end date'),
    minimumOrderValue: Yup.number().min(0, 'Minimum order value cannot be less than 0').required('Please enter the minimum order value'),
    quantity: Yup.number().integer('Quantity must be an integer').min(0, 'Quantity cannot be less than 0').required('Please enter the quantity'),
});

const VoucherForm = (props) => {
    const [voucher, setVoucher] = useState({});

    useEffect(() => {
        if (props.voucherId) {
            fetch(`http://localhost:3010/api/vouchers/${props.voucherId}`)
                .then(res => res.json())
                .then(data => {
                    if (data.success) {
                        setVoucher(data.data);
                    }
                })
                .catch(console.log);
        }
    }, [props.voucherId]);

    useEffect(() => {
        if (Object.keys(voucher).length > 0) {
            formik.setValues({
                code: voucher.code || '',
                name: voucher.name || '',
                description: voucher.description || '',
                discountType: voucher.discount_type || '',
                discountValue: voucher.discount_value || '',
                startDate: convertDate(voucher.start_date, 0) || '',
                endDate: convertDate(voucher.end_date, 0) || '',
                minimumOrderValue: voucher.minimum_order_value || '',
                quantity: voucher.quantity || '',
            });
        }
    }, [voucher]);

    const formik = useFormik({
        initialValues: {
            code: '',
            name: '',
            description: '',
            discountType: '',
            discountValue: '',
            startDate: '',
            endDate: '',
            minimumOrderValue: '',
            quantity: '',
        },
        onSubmit: (values) => {
            const standardValues = { ...values };
            console.log(standardValues);

            if (Object.keys(voucher).length === 0) {
                fetch('http://localhost:3010/api/vouchers/create', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(standardValues)
                }).then(response => response.json())
                    .then(data => {
                        if (data.success) {
                            props.callback();
                            toast.success(data.message);
                        } else {
                            toast.info(data.message);
                        }
                    });
            } else {
                fetch(`http://localhost:3010/api/vouchers/${props.voucherId}`, {
                    method: 'PATCH',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(standardValues)
                }).then(response => response.json())
                    .then(data => {
                        if (data.success) {
                            props.callback();
                            toast.success(data.message);
                        } else {
                            toast.info(data.message);
                        }
                    });
            }
        },
        validationSchema: voucherSchema,
    });

    const handleDelete = async () => {
        try {
            const response = await fetch(`http://localhost:3010/api/vouchers/${props.voucherId}`, {
                method: 'DELETE'
            })
            const data = await response.json();
            if (data.success) {
                props.callback();
                toast.success(data.message);
            }
            else toast.error('Unable to delete');
        } catch (error) {
            console.error(error);
        }
    }

    return (
        <form onSubmit={formik.handleSubmit} className="d-flex flex-column">

            <FormInput
                className="mb-2"
                fieldName="Voucher Code"
                name="code"
                hint="Voucher Code"
                onChange={formik.handleChange}
                value={formik.values.code}
                errText={formik.errors.code}
                isErr={formik.touched.code && formik.errors.code}
            />
            <FormInput
                className="mb-2"
                fieldName="Voucher Name"
                name="name"
                hint="Voucher Name"
                onChange={formik.handleChange}
                value={formik.values.name}
                errText={formik.errors.name}
                isErr={formik.touched.name && formik.errors.name}
            />
            <FormInput
                className="mb-2"
                fieldName="Description"
                name="description"
                hint="Description"
                onChange={formik.handleChange}
                value={formik.values.description}
                errText={formik.errors.description}
                isErr={formik.touched.description && formik.errors.description}
            />
            {/* <FormInput
                className="mb-2"
                fieldName="Discount Type"
                name="discountType"
                hint="Discount Type"
                onChange={formik.handleChange}
                value={formik.values.discountType}
                errText={formik.errors.discountType}
                isErr={formik.touched.discountType && formik.errors.discountType}
            /> */}
            <select
                className="form-select mb-2"
                name="discountType"
                onChange={formik.handleChange}
                value={formik.values.discountType}
            >
                <option value="">Choose...</option>
                <option value="percentage">Percentage</option>
                <option value="fixed_amount">Fixed amount</option>
            </select>
            {
                formik.touched.discountType && formik.errors.discountType &&
                <div className="form-text mb-2 ms-1 text-danger">
                    {formik.errors.discountType}
                </div>
            }
            <FormInput
                className="mb-2"
                type="number"
                fieldName="Discount Value"
                name="discountValue"
                hint="Discount Value"
                onChange={formik.handleChange}
                value={formik.values.discountValue}
                errText={formik.errors.discountValue}
                isErr={formik.touched.discountValue && formik.errors.discountValue}
            />
            <FormInput
                className="mb-2"
                fieldName="Start Date"
                name="startDate"
                hint="Start Date"
                type="date"
                onChange={formik.handleChange}
                value={formik.values.startDate}
                errText={formik.errors.startDate}
                isErr={formik.touched.startDate && formik.errors.startDate}
            />
            <FormInput
                className="mb-2"
                fieldName="End Date"
                name="endDate"
                hint="End Date"
                type="date"
                onChange={formik.handleChange}
                value={formik.values.endDate}
                errText={formik.errors.endDate}
                isErr={formik.touched.endDate && formik.errors.endDate}
            />
            <FormInput
                className="mb-2"
                fieldName="Minimum Order Value"
                name="minimumOrderValue"
                hint="Minimum Order Value"
                type="number"
                onChange={formik.handleChange}
                value={formik.values.minimumOrderValue}
                errText={formik.errors.minimumOrderValue}
                isErr={formik.touched.minimumOrderValue && formik.errors.minimumOrderValue}
            />
            <FormInput
                className="mb-2"
                fieldName="Quantity"
                name="quantity"
                hint="Quantity"
                type="number"
                onChange={formik.handleChange}
                value={formik.values.quantity}
                errText={formik.errors.quantity}
                isErr={formik.touched.quantity && formik.errors.quantity}
            />
            {props.voucherId && props.voucherId !== null && (
                <button
                    type="button"
                    className="btn btn-danger mb-2"
                    onClick={handleDelete}
                >Delete</button>
            )}
            <button type="submit" className="btn btn-primary">Submit</button>
        </form>
    );
};

export default VoucherForm;
