import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';

const AddressForm = (props) => {
    // Khởi tạo state cho các giá trị của form và lỗi
    const [formData, setFormData] = useState({
        addressId: props.address.id || '',
        title: props.address.title || '',
        province: props.address.province_id || '',
        district: props.address.district_id || '',
        ward: props.address.ward_id || '',
        phoneNumber: props.address.phone_number || ''
    });

    const [provinces, setProvinces] = useState([]);
    const [districts, setDistricts] = useState([]);
    const [wards, setWards] = useState([]);

    useEffect(() => {
        if (provinces.length > 0) return;
        const fetchProvinces = async () => {
            try {
                const res = await fetch('https://vapi.vnappmob.com/api/province/');
                const data = await res.json();
                setProvinces(data.results);
            } catch (error) {
                console.error(error);
            }
        };
        fetchProvinces();
    }, [provinces]);

    useEffect(() => {
        const fetchDistricts = async (provinceId) => {
            try {
                const res = await fetch(`https://vapi.vnappmob.com/api/province/district/${provinceId}`);
                const data = await res.json();
                setDistricts(data.results);
            } catch (error) {
                console.error(error);
            }
        };
        fetchDistricts(formData.province);
    }, [formData.province]);

    useEffect(() => {
        const fetchWards = async (districtId) => {
            try {
                const res = await fetch(`https://vapi.vnappmob.com/api/province/ward/${districtId}`);
                const data = await res.json();
                setWards(data.results);
            } catch (error) {
                console.error(error);
            }
        };
        fetchWards(formData.district);
    }, [formData.district]);

    const [errors, setErrors] = useState({});

    // Hàm xử lý thay đổi input
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
        setErrors({
            ...errors,
            [name]: ''
        });
    };

    // Hàm kiểm tra lỗi
    const validate = () => {
        let tempErrors = {};
        if (!formData.title) tempErrors.title = 'Title is required';
        if (!formData.province) tempErrors.province = 'Province is required';
        if (!formData.district) tempErrors.district = 'District is required';
        if (!formData.ward) tempErrors.ward = 'Ward is required';
        if (!formData.phoneNumber) tempErrors.phoneNumber = 'Phone number is required';
        setErrors(tempErrors);
        return Object.keys(tempErrors).length === 0;
    };

    // Hàm xử lý submit form
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (validate()) {
            // Thực hiện các hành động khi form được submit, ví dụ như gửi dữ liệu tới server
            try {
                const res = await fetch('http://localhost:3010/api/addresses', {
                    method: 'PATCH',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        addressId: formData.addressId,
                        title: formData.title,
                        province: formData.province,
                        district: formData.district,
                        ward: formData.ward,
                        phoneNumber: formData.phoneNumber
                    })
                });
                const data = await res.json();

                console.log(data);

                if (data.success) {
                    // Xử lý thành công
                    toast.success(data.message);
                    props.callback();
                }
                else {
                    // Xử lý thất bại
                    toast.error(data.message);
                }
            } catch (error) {
                console.error(error);
                toast.error('An error occurred. Please try again.');
            }
            console.log('Form submitted:', formData);
        } else {
            console.log('Form has errors:', errors);
        }
    };

    return (
        <div className="col-md-12 bg-light h-100 px-4">
            <div className="sidebar-sticky fs-3 text-bold text-center">Edit Address</div>
            <form onSubmit={handleSubmit}>
                <div className="form-group mb-2">
                    <label htmlFor="title">Title</label>
                    <input
                        type="text"
                        className={`form-control ${errors.title ? 'is-invalid' : ''}`}
                        id="title"
                        name="title"
                        value={formData.title}
                        onChange={handleChange}
                        placeholder="Enter title"
                    />
                    {errors.title && <div className="invalid-feedback">{errors.title}</div>}
                </div>
                <div className="form-group mb-2">
                    <label htmlFor="province">Province</label>
                    <select
                        className={`form-control ${errors.province ? 'is-invalid' : ''}`}
                        id="province"
                        name="province"
                        value={formData.province}
                        onChange={handleChange}
                    >
                        <option value="">Select province</option>
                        {provinces.map((province) => (
                            <option key={province.province_id} value={province.province_id}>
                                {province.province_name}
                            </option>
                        ))}
                    </select>
                    {errors.province && <div className="invalid-feedback">{errors.province}</div>}
                </div>
                <div className="form-group mb-2">
                    <label htmlFor="district">District</label>
                    <select
                        className={`form-control ${errors.district ? 'is-invalid' : ''}`}
                        id="district"
                        name="district"
                        value={formData.district}
                        onChange={handleChange}
                    >
                        <option value="">Select district</option>
                        {districts.map((district) => (
                            <option key={district.district_id} value={district.district_id}>
                                {district.district_name}
                            </option>
                        ))}
                    </select>
                    {errors.district && <div className="invalid-feedback">{errors.district}</div>}
                </div>
                <div className="form-group mb-2">
                    <label htmlFor="ward">Ward</label>
                    <select
                        className={`form-control ${errors.ward ? 'is-invalid' : ''}`}
                        id="ward"
                        name="ward"
                        value={formData.ward}
                        onChange={handleChange}
                    >
                        <option value="">Select ward</option>
                        {wards.map((ward) => (
                            <option key={ward.ward_id} value={ward.ward_id}>
                                {ward.ward_name}
                            </option>
                        ))}
                    </select>
                    {errors.ward && <div className="invalid-feedback">{errors.ward}</div>}
                </div>
                <div className="form-group mb-2">
                    <label htmlFor="phoneNumber">Phone number</label>
                    <input
                        type="text"
                        className={`form-control ${errors.phoneNumber ? 'is-invalid' : ''}`}
                        id="phoneNumber"
                        name="phoneNumber"
                        value={formData.phoneNumber}
                        onChange={handleChange}
                        placeholder="Enter phone number"
                    />
                    {errors.phoneNumber && <div className="invalid-feedback">{errors.phoneNumber}</div>}
                </div>
                <button type="submit" className="btn btn-primary">Submit</button>
            </form>
        </div>
    );
}

export default AddressForm;
