import { useFormik } from "formik";
import FormInput from "./FormInput";
import * as Yup from "yup";
import userDefaultImage from "../assets/user_default.jpg"
import UserInfor from "./UserInfor";
import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { convertDate } from "../utils/date.util";

const userSchema = Yup.object().shape({
    firstName: Yup.string().required("Please enter your First name"),
    lastName: Yup.string().required("Please enter your Last name"),
    username: Yup.string().required("Please enter your Username"),
    email: Yup.string().email("Invalid email address").required("Please enter your Email"),
    password: Yup.string().required("Please enter your Password"),
    birthDate: Yup.date().required("Please enter your Birth date"),
    phoneNumber: Yup.string().required("Please enter your Phone number"),
    role: Yup.string().required("Please choose Role"),
});

const UserForm = (props) => {
    const [avtPreview, setavtPreview] = useState(null);
    const [user, setUser] = useState({});

    useEffect(() => {
        if (props.userId) {
            fetch(`http://localhost:3010/api/users/${props.userId}`)
                .then(res => res.json())
                .then(data => {
                    if (data.success) {
                        setUser(data.data);
                        setavtPreview(data.data.avatar);
                    }
                })
                .catch(console.log)
        }
    }, [props.userId])

    useEffect(() => {
        if (Object.keys(user)) {
            formik.setValues({
                avatar: user.avatar || userDefaultImage,
                firstName: user.first_name || '',
                lastName: user.last_name || '',
                email: user.email || '',
                username: user.username || '',
                birthDate: convertDate(user.birth_of_date, 2) || '',
                phoneNumber: user.phone_number || '',
                role: user.role || '',
                password: Object.keys(user).length !== 0 ? 'xxxxxx' : '',
            });
        }
    }, [user])

    const formik = useFormik({
        initialValues: {
            avatar: userDefaultImage,
            firstName: '',
            lastName: '',
            email: '',
            username: '',
            birthDate: '',
            phoneNumber: '',
            role: '',
            password: '',
        },
        onSubmit: async (values) => {
            const standardValues = Object.keys(values).reduce((acc, key) => {
                acc[key] = values[key].toLowerCase();
                return acc;
            }, {});
            // console.log(standardValues)

            if (Object.keys(user).length === 0) {
                // call insert api
                try {
                    const response = await fetch('http://localhost:3010/api/users', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify(standardValues)
                    });
                    if (!response.ok) {
                        throw new Error('Failed to insert user');
                    }
                    const data = await response.json();

                    if (data.success) {
                        toast.success(data.message);
                        setTimeout(() => {
                            props.callback();
                        }, 500);
                    }
                    else {
                        toast.info(data.message);
                    }
                } catch (error) {
                    console.error('Error inserting user:', error);
                    // Handle error (e.g., show error message to user)
                }
            }
            else {
                //  call update api
                try {
                    const response = await fetch('http://localhost:3010/api/users', {
                        method: 'PATCH',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify(standardValues)
                    })
                    const data = await response.json()
                    if (data.success) {
                        toast.success(data.message);
                        setTimeout(() => {
                            props.callback();
                        }, 500);
                    }
                    else {
                        toast.info(data.message);
                    }
                } catch (error) {
                    console.error('Error during login:', error);
                    // Handle login error (e.g., show error message)
                }
                console.log('update')
            }
        },
        validationSchema: userSchema,
    })

    const handleDeleteUser = () => {
        // call api delete
        console.log('delete user', props.userId)

    }

    return (
        <form onSubmit={formik.handleSubmit} className="d-flex flex-column">
            <UserInfor
                image={avtPreview}
                fullName={formik.values.firstName + ' ' + formik.values.lastName}
                email={formik.values.email} />
            <FormInput
                className="mb-2"
                fieldName="Avatar"
                name="avatar"
                hint="Avatar"
                type="file"
                onChange={(event) => {
                    const file = event.target.files[0];
                    if (file) {
                        const filePath = URL.createObjectURL(file)
                        setavtPreview(filePath);
                        formik.setFieldValue('avatar', filePath);
                    }
                    return formik.handleChange
                }}
                errText={formik.errors.avatar}
                isErr={formik.touched.avatar && formik.errors.avatar}
            />

            <FormInput
                className="mb-2"
                fieldName="Email"
                disabled={props.userId ? true : false}
                name="email"
                hint="Email"
                onChange={formik.handleChange}
                value={formik.values.email}
                errText={formik.errors.email}
                isErr={formik.touched.email && formik.errors.email}
            />

            <FormInput
                className="mb-2"
                fieldName="Username"
                name="username"
                hint="Username"
                onChange={formik.handleChange}
                value={formik.values.username}
                errText={formik.errors.username}
                isErr={formik.touched.username && formik.errors.username}
            />


            <FormInput
                disabled={props.userId ? true : false}
                className="mb-2"
                fieldName="Password"
                name="password"
                hint="Password"
                type="password"
                onChange={formik.handleChange}
                value={formik.values.password}
                errText={formik.errors.password}
                isErr={formik.touched.password && formik.errors.password}
            />

            <FormInput
                className="mb-2"
                fieldName="First name"
                name="firstName"
                hint="First name"
                onChange={formik.handleChange}
                errText={formik.errors.firstName}
                value={formik.values.firstName}
                isErr={formik.touched.firstName && formik.errors.firstName}
            />
            <FormInput
                className="mb-2"
                fieldName="Last name"
                name="lastName"
                hint="Last name"
                onChange={formik.handleChange}
                value={formik.values.lastName}
                errText={formik.errors.lastName}
                isErr={formik.touched.lastName && formik.errors.lastName}
            />

            <FormInput
                className="mb-2"
                fieldName="Birth date"
                name="birthDate"
                hint="Birth date"
                type="date"
                onChange={formik.handleChange}
                value={formik.values.birthDate}
                errText={formik.errors.birthDate}
                isErr={formik.touched.birthDate && formik.errors.birthDate}
            />

            <FormInput
                className="mb-2"
                fieldName="Phone number"
                name="phoneNumber"
                hint="Phone number"
                onChange={formik.handleChange}
                value={formik.values.phoneNumber}
                errText={formik.errors.phoneNumber}
                isErr={formik.touched.phoneNumber && formik.errors.phoneNumber}
            />

            <select
                className="form-select mb-2"
                name="role"
                onChange={formik.handleChange}
                value={formik.values.role}
            >
                <option value="">Role</option>
                <option value="admin">Admin</option>
                <option value="customer">Customer</option>
                <option value="employee">Employee</option>
            </select>
            {
                formik.touched.role && formik.errors.role &&
                <div className="form-text mb-2 ms-1 text-danger">
                    {formik.errors.role}
                </div>
            }

            {
                props.userId && props.userId !== null &&
                <button
                    type="button"
                    className="btn btn-danger mb-2"
                    onClick={handleDeleteUser}
                >Delete</button>
            }

            <button type="submit" className="btn btn-primary">Submit</button>
        </form>
    );
}

export default UserForm;
