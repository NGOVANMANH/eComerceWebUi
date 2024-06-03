import React, { useContext, useState } from 'react';
import AuthContext from '../context/AuthContext';
import { toast } from 'react-toastify';

const Sidebar = (props) => {
    // Khởi tạo state cho các giá trị của form và lỗi
    const auth = useContext(AuthContext)
    const [formData, setFormData] = useState({
        avatarUrl: auth?.user?.avatar || '',
        firstName: auth?.user?.first_name || '',
        lastName: auth?.user?.last_name || '',
        birthdate: auth?.user?.birth_of_date?.split('T')[0] || '',
        phoneNumber: auth?.user?.phone_number || ''
    });

    console.log(formData)

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
        if (!formData.avatarUrl) tempErrors.avatarUrl = 'Avatar URL is required';
        if (!formData.firstName) tempErrors.firstName = 'First name is required';
        if (!formData.lastName) tempErrors.lastName = 'Last name is required';
        if (!formData.birthdate) tempErrors.birthdate = 'Birthdate is required';
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
                const res = await fetch('http://localhost:3010/api/users', {
                    method: 'PATCH',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        email: auth?.user.email,
                        avatar: formData.avatarUrl,
                        firstName: formData.firstName,
                        lastName: formData.lastName,
                        birthDate: formData.birthdate,
                        phoneNumber: formData.phoneNumber,
                    })
                });
                const data = await res.json();

                console.log(data);

                if (data.success) {
                    auth.updateUser(data.data);
                    toast.success(data.message);
                }
                else {
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
            <div className="sidebar-sticky fs-3 text-bold text-center">edit user</div>
            <form onSubmit={handleSubmit}>
                <div className="form-group mb-2">
                    <label htmlFor="avatarUrl">Avatar url</label>
                    <input
                        type="text"
                        className={`form-control ${errors.avatarUrl ? 'is-invalid' : ''}`}
                        id="avatarUrl"
                        name="avatarUrl"
                        value={formData.avatarUrl}
                        onChange={handleChange}
                        placeholder="Enter avatar URL"
                    />
                    {errors.avatarUrl && <div className="invalid-feedback">{errors.avatarUrl}</div>}
                </div>
                <div className="form-group mb-2">
                    <label htmlFor="firstName">First name</label>
                    <input
                        type="text"
                        className={`form-control ${errors.firstName ? 'is-invalid' : ''}`}
                        id="firstName"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleChange}
                        placeholder="Enter first name"
                    />
                    {errors.firstName && <div className="invalid-feedback">{errors.firstName}</div>}
                </div>
                <div className="form-group mb-2">
                    <label htmlFor="lastName">Last name</label>
                    <input
                        type="text"
                        className={`form-control ${errors.lastName ? 'is-invalid' : ''}`}
                        id="lastName"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleChange}
                        placeholder="Enter last name"
                    />
                    {errors.lastName && <div className="invalid-feedback">{errors.lastName}</div>}
                </div>
                <div className="form-group mb-2">
                    <label htmlFor="birthdate">Birthdate</label>
                    <input
                        type="date"
                        className={`form-control ${errors.birthdate ? 'is-invalid' : ''}`}
                        id="birthdate"
                        name="birthdate"
                        value={formData.birthdate}
                        onChange={handleChange}
                    />
                    {errors.birthdate && <div className="invalid-feedback">{errors.birthdate}</div>}
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

export default Sidebar;
