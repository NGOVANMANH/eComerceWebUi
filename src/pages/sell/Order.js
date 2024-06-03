import React, { useContext, useEffect, useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import AuthContext from '../../context/AuthContext';
import ShopContext from '../../context/ShopContext';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const Order = () => {
    const auth = useContext(AuthContext);
    const shop = useContext(ShopContext);
    const [voucher, setVoucher] = useState();
    const [voucherCode, setVoucherCode] = useState();
    const [userAddresses, setUserAddresses] = useState([]);
    const [provinces, setProvinces] = useState([]);
    const [districts, setDistricts] = useState([]);
    const [wards, setWards] = useState([]);

    const navigate = useNavigate()

    const callApiAddOrder = async (addressId) => {
        const res = await fetch(`http://localhost:3010/api/orders/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                userId: auth?.user?.id,
                items: shop?.cart?.items?.map(item => ({
                    productSkuId: item.id,
                    quantity: item.quantity,
                    price: item.price
                })),
                voucherCode: voucher?.code || null,
                addressId: addressId || null
            })
        })

        const data = await res.json();
        if (data.success) {
            toast.success(data.message);
            shop.emptyCart();

        } else {
            toast.error(data.message);
        }
    }

    useEffect(() => {
        if (provinces.length > 0) return
        const fetchProvinces = async () => {
            try {
                const res = await fetch('https://vapi.vnappmob.com/api/province/');
                const data = await res.json();
                setProvinces(data.results);
            } catch (error) {
                console.error(error);
            }
        }
        fetchProvinces();
    }, [provinces]);

    useEffect(() => {
        const fetchUseAddresses = async () => {
            try {
                const res = await fetch(`http://localhost:3010/api/addresses?userId=${auth?.user?.id}`);
                const data = await res.json();
                if (data.success) {
                    setUserAddresses(data.data);
                }
            } catch (error) {
                console.error(error);
            }

        }
        fetchUseAddresses()
    }, [auth.user]);

    const handleAddVoucher = async () => {
        try {
            const res = await fetch('http://localhost:3010/api/vouchers', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    userId: auth?.user?.id,
                    voucherCode,
                    orderTotal: shop?.cart?.total
                })
            });

            const data = await res.json();
            if (data.success) {
                setVoucher(data.data);
            } else {
                setVoucher(null);
                toast.info(data.message);
            }
        } catch (error) {
            console.log(error);
        }
    };

    const getVoucherValue = () => {
        return voucher.discount_type === "fixed_amount" ? voucher.discount_value : voucher.discount_value * shop.cart.total;
    };

    const formik = useFormik({
        initialValues: {
            firstName: auth?.user?.first_name || '',
            lastName: auth?.user?.last_name || '',
            username: auth?.user?.username || '',
            email: auth?.user?.email || '',
            addressTitle: '',
            address: '',
            province: '',
            district: '',
            ward: '',
            paymentMethod: 'shipcod',
            ccName: '',
            ccNumber: '',
            ccExpiration: '',
            ccCVV: ''
        },
        validationSchema: Yup.object({
            firstName: Yup.string().required('Valid first name is required.'),
            lastName: Yup.string().required('Valid last name is required.'),
            username: Yup.string().required('Your username is required.'),
            email: Yup.string().email('Invalid email address').optional(),
            phoneNumber: Yup.string().min(8, 'Phone number more than 8 numbers').max(16, 'Invalid phone number').optional(),
            addressTitle: userAddresses.length === 0 ? Yup.string().required('Please enter your shipping address.') : Yup.string().optional(),
            address: userAddresses.length > 0 ? Yup.string().required('Please select your shipping address.') : Yup.string().optional(),
            province: Yup.string().required('Please select a valid country.'),
            district: Yup.string().required('Please provide a valid state.'),
            ward: Yup.string().required('Ward is required.'),
            // ccName: Yup.string().required('Name on card is required.'),
            // ccNumber: Yup.string().required('Credit card number is required.'),
            // ccExpiration: Yup.string().required('Expiration date required.'),
            // ccCVV: Yup.string().required('Security code required.')
            ccName: Yup.string().when('paymentMethod', {
                is: (value) => value !== 'shipcod',
                then: (schema) => schema.required('Name on card is required.'),
            }),
            ccNumber: Yup.string().when('paymentMethod', {
                is: (value) => value !== 'shipcod',
                then: (schema) => schema.required('Credit card number is required.'),
            }),
            ccExpiration: Yup.string().when('paymentMethod', {
                is: (value) => value !== 'shipcod',
                then: (schema) => schema.required('Expiration date required.'),
            }),
            ccCVV: Yup.string().when('paymentMethod', {
                is: (value) => value !== 'shipcod',
                then: (schema) => schema.required('Security code required.'),
            }),
        }),
        onSubmit: async values => {
            // Handle form submission
            if (shop?.cart?.items?.length === 0) {
                toast.error('Your cart is empty');
                return;
            }
            if (values.addressTitle && values.addressTitle !== '') {
                const res = await fetch(`http://localhost:3010/api/addresses/`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        userId: auth?.user?.id,
                        title: values.addressTitle,
                        province: values.province,
                        district: values.district,
                        ward: values.ward,
                        phoneNumber: values.phoneNumber === '' ? null : values.phoneNumber
                    })
                })
                const data = await res.json();

                if (data.success) {
                    callApiAddOrder(data.data.id)
                }
            }
            else callApiAddOrder(values.address)

        }
    });

    useEffect(() => {
        const fetchDistricts = async (provinceId) => {
            try {
                const res = await fetch(`https://vapi.vnappmob.com/api/province/district/${provinceId}`);
                const data = await res.json();
                setDistricts(data.results);
            } catch (error) {
                console.error(error);
            }
        }
        fetchDistricts(formik.values.province);
    }, [formik.values.province]);

    useEffect(() => {
        const fetchWards = async (districtId) => {
            try {
                const res = await fetch(`https://vapi.vnappmob.com/api/province/ward/${districtId}`);
                const data = await res.json();
                setWards(data.results);
            } catch (error) {
                console.error(error);
            }
        }
        fetchWards(formik.values.district);
    }, [formik.values.district]);

    useEffect(() => {
        const foundAddress = userAddresses.find(item => item.id === +formik.values.address)
        if (foundAddress) {
            console.log(foundAddress)
            formik.setFieldValue('province', foundAddress.province_id)
            formik.setFieldValue('district', foundAddress.district_id)
            formik.setFieldValue('ward', foundAddress.ward_id)
        }
    }, [formik.values.address, userAddresses]);

    return (
        <div className="container my-4">
            <main>
                <div className="row g-5">
                    <div className="col-md-5 col-lg-4 order-md-last">
                        <h4 className="d-flex justify-content-between align-items-center mb-3">
                            <span className="text-primary">Your cart</span>
                            <span className="badge bg-primary rounded-pill">{shop?.cart?.items?.length}</span>
                        </h4>
                        <ul className="list-group mb-3">
                            {shop?.cart?.items?.map((cartItem, index) => (
                                <li className="list-group-item d-flex justify-content-between lh-sm cursor-pointer" key={index} onClick={() => navigate(`/products/${cartItem.product_id}`)}>
                                    <div>
                                        <h6 className="my-0">{cartItem.name}</h6>
                                        <small className="text-muted">{cartItem.brand_name}</small>
                                    </div>
                                    <div>
                                        <span className="text-muted d-block">{cartItem?.price?.toLocaleString()}đ</span>
                                        <small className="text-muted">x{cartItem.quantity}</small>
                                    </div>
                                </li>
                            ))}
                            {voucher && (
                                <li className="list-group-item d-flex justify-content-between bg-light">
                                    <div className="text-success">
                                        <h6 className="my-0">Voucher code</h6>
                                        <small>{voucher.code.toUpperCase()}</small>
                                    </div>
                                    <span className="text-success">−{getVoucherValue()?.toLocaleString()}đ</span>
                                </li>
                            )}
                            <li className="list-group-item d-flex justify-content-between">
                                <span>Shipping (đ)</span>
                                <strong>0</strong>
                            </li>
                            <li className="list-group-item d-flex justify-content-between">
                                <span>Total (đ)</span>
                                <strong>{(voucher ? shop?.cart?.total - getVoucherValue() : shop?.cart?.total)?.toLocaleString()}</strong>
                            </li>
                        </ul>

                        <form className="card p-2" onSubmit={(e) => { e.preventDefault(); handleAddVoucher(); }}>
                            <div className="input-group">
                                <input onChange={(e) => setVoucherCode(e.target.value.trim())} type="text" className="form-control" value={voucherCode} placeholder="Voucher code" />
                                <button type="submit" className="btn btn-secondary">Submit</button>
                            </div>
                        </form>
                    </div>
                    <div className="col-md-7 col-lg-8">
                        <h4 className="mb-3">Billing address</h4>
                        <form className="needs-validation" noValidate onSubmit={formik.handleSubmit}>
                            <div className="row g-3">
                                <div className="col-sm-6">
                                    <label htmlFor="firstName" className="form-label">First name</label>
                                    <input
                                        type="text"
                                        className={`form-control ${formik.touched.firstName && formik.errors.firstName ? 'is-invalid' : ''}`}
                                        id="firstName"
                                        {...formik.getFieldProps('firstName')}
                                    />
                                    <div className="invalid-feedback">{formik.errors.firstName}</div>
                                </div>

                                <div className="col-sm-6">
                                    <label htmlFor="lastName" className="form-label">Last name</label>
                                    <input
                                        type="text"
                                        className={`form-control ${formik.touched.lastName && formik.errors.lastName ? 'is-invalid' : ''}`}
                                        id="lastName"
                                        {...formik.getFieldProps('lastName')}
                                    />
                                    <div className="invalid-feedback">{formik.errors.lastName}</div>
                                </div>

                                <div className="col-6">
                                    <label htmlFor="username" className="form-label">Username</label>
                                    <div className="input-group has-validation">
                                        <span className="input-group-text">@</span>
                                        <input
                                            type="text"
                                            className={`form-control ${formik.touched.username && formik.errors.username ? 'is-invalid' : ''}`}
                                            id="username"
                                            {...formik.getFieldProps('username')}
                                        />
                                        <div className="invalid-feedback">{formik.errors.username}</div>
                                    </div>
                                </div>

                                <div className="col-6">
                                    <label htmlFor="phoneNumber" className="form-label">Phone number (Optional)</label>
                                    <input
                                        type="text"
                                        className={`form-control ${formik.touched.phoneNumber && formik.errors.phoneNumber ? 'is-invalid' : ''}`}
                                        id="phoneNumber"
                                        placeholder='Enter phone number'
                                        {...formik.getFieldProps('phoneNumber')}
                                    />
                                    <div className="invalid-feedback">{formik.errors.phoneNumber}</div>
                                </div>

                                <div className="col-12">
                                    <label htmlFor="email" className="form-label">Email <span className="text-muted">(Optional)</span></label>
                                    <input
                                        type="email"
                                        className={`form-control ${formik.touched.email && formik.errors.email ? 'is-invalid' : ''}`}
                                        id="email"
                                        {...formik.getFieldProps('email')}
                                    />
                                    <div className="invalid-feedback">{formik.errors.email}</div>
                                </div>

                                <div className="col-12">
                                    <label htmlFor="address" className="form-label">Address</label>
                                    {
                                        (userAddresses && userAddresses.length > 0) ?
                                            <>
                                                <select
                                                    className={`form-select ${formik.touched.address && formik.errors.address ? 'is-invalid' : ''}`}
                                                    id="address"
                                                    {...formik.getFieldProps('address')}
                                                >
                                                    <option value="">Choose...</option>
                                                    {
                                                        userAddresses.map((item, idx) => (
                                                            <option key={idx} value={item.id}>{item.title}</option>
                                                        ))
                                                    }
                                                </select>
                                                <div className="invalid-feedback">{formik.errors.address}</div>
                                            </>
                                            :
                                            <>
                                                <input
                                                    type="text"
                                                    className={`form-control ${formik.touched.addressTitle && formik.errors.addressTitle ? 'is-invalid' : ''}`}
                                                    id="addressTitle"
                                                    placeholder='Address Title'
                                                    {...formik.getFieldProps('addressTitle')}
                                                />
                                                <div className="invalid-feedback">{formik.errors.addressTitle}</div>
                                            </>
                                    }
                                </div>

                                <div className="col-md-4">
                                    <label htmlFor="province" className="form-label">Province</label>
                                    <select
                                        className={`form-select ${formik.touched.province && formik.errors.province ? 'is-invalid' : ''}`}
                                        id="province"
                                        {...formik.getFieldProps('province')}
                                        value={formik.values.province}
                                    >
                                        <option value="">Choose...</option>
                                        {
                                            provinces.map((province, idx) => (
                                                <option key={idx} value={province.province_id}>{province.province_name}</option>
                                            ))
                                        }
                                    </select>
                                    <div className="invalid-feedback">{formik.errors.province}</div>
                                </div>

                                <div className="col-md-4">
                                    <label htmlFor="district" className="form-label">District</label>
                                    <select
                                        className={`form-select ${formik.touched.district && formik.errors.district ? 'is-invalid' : ''}`}
                                        id="district"
                                        {...formik.getFieldProps('district')}
                                        value={formik.values.district}
                                    >
                                        <option value="">Choose...</option>
                                        {
                                            districts.map((district, idx) => (
                                                <option key={idx} value={district.district_id}>{district.district_name}</option>
                                            ))
                                        }
                                    </select>
                                    <div className="invalid-feedback">{formik.errors.district}</div>
                                </div>

                                <div className="col-md-4">
                                    <label htmlFor="ward" className="form-label">Ward</label>
                                    {/* <input
                                        type="text"
                                        className={`form-control ${formik.touched.ward && formik.errors.ward ? 'is-invalid' : ''}`}
                                        id="ward"
                                        {...formik.getFieldProps('ward')}
                                    /> */}
                                    <select
                                        className={`form-select ${formik.touched.ward && formik.errors.ward ? 'is-invalid' : ''}`}
                                        id="ward"
                                        {...formik.getFieldProps('ward')}
                                        value={formik.values.ward}
                                    >
                                        <option value="">Choose...</option>
                                        {
                                            wards.map((ward, idx) => (
                                                <option key={idx} value={ward.ward_id}>{ward.ward_name}</option>
                                            ))
                                        }
                                    </select>
                                    <div className="invalid-feedback">{formik.errors.ward}</div>
                                </div>
                            </div>

                            <hr className="my-4" />

                            <h4 className="mb-3">Payment</h4>

                            <div className="my-3">
                                <div className="form-check">
                                    <input id="shipcod" name="paymentMethod" type="radio" className="form-check-input" {...formik.getFieldProps('paymentMethod')} value="shipcod" defaultChecked required />
                                    <label className="form-check-label" htmlFor="shipcod">Ship COD</label>
                                </div>
                                <div className="form-check">
                                    <input id="credit" name="paymentMethod" type="radio" className="form-check-input" {...formik.getFieldProps('paymentMethod')} value="credit" required />
                                    <label className="form-check-label" htmlFor="credit">Credit card</label>
                                </div>
                                <div className="form-check">
                                    <input id="debit" name="paymentMethod" type="radio" className="form-check-input" {...formik.getFieldProps('paymentMethod')} value="debit" required />
                                    <label className="form-check-label" htmlFor="debit">Debit card</label>
                                </div>
                                <div className="form-check">
                                    <input id="paypal" name="paymentMethod" type="radio" className="form-check-input" {...formik.getFieldProps('paymentMethod')} value="paypal" required />
                                    <label className="form-check-label" htmlFor="paypal">PayPal</label>
                                </div>
                            </div>
                            {
                                formik.values.paymentMethod !== 'shipcod' &&
                                <>
                                    <div className="row gy-3">
                                        <div className="col-md-6">
                                            <label htmlFor="cc-name" className="form-label">Name on card</label>
                                            <input
                                                type="text"
                                                className={`form-control ${formik.touched.ccName && formik.errors.ccName ? 'is-invalid' : ''}`}
                                                id="cc-name"
                                                {...formik.getFieldProps('ccName')}
                                            />
                                            <small className="text-muted">Full name as displayed on card</small>
                                            <div className="invalid-feedback">{formik.errors.ccName}</div>
                                        </div>

                                        <div className="col-md-6">
                                            <label htmlFor="cc-number" className="form-label">Credit card number</label>
                                            <input
                                                type="text"
                                                className={`form-control ${formik.touched.ccNumber && formik.errors.ccNumber ? 'is-invalid' : ''}`}
                                                id="cc-number"
                                                {...formik.getFieldProps('ccNumber')}
                                            />
                                            <div className="invalid-feedback">{formik.errors.ccNumber}</div>
                                        </div>

                                        <div className="col-md-3">
                                            <label htmlFor="cc-expiration" className="form-label">Expiration</label>
                                            <input
                                                type="text"
                                                className={`form-control ${formik.touched.ccExpiration && formik.errors.ccExpiration ? 'is-invalid' : ''}`}
                                                id="cc-expiration"
                                                {...formik.getFieldProps('ccExpiration')}
                                            />
                                            <div className="invalid-feedback">{formik.errors.ccExpiration}</div>
                                        </div>

                                        <div className="col-md-3">
                                            <label htmlFor="cc-cvv" className="form-label">CVV</label>
                                            <input
                                                type="text"
                                                className={`form-control ${formik.touched.ccCVV && formik.errors.ccCVV ? 'is-invalid' : ''}`}
                                                id="cc-cvv"
                                                {...formik.getFieldProps('ccCVV')}
                                            />
                                            <div className="invalid-feedback">{formik.errors.ccCVV}</div>
                                        </div>
                                    </div>
                                </>
                            }
                            <hr className="my-4" />
                            <button className="w-100 btn btn-primary btn-lg" type="submit">Continue to checkout</button>
                        </form>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default Order;
