import React from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import FormInput from './FormInput';
import Image from './Image'; // Assuming you have a FormInput component
import { toast } from 'react-toastify';

const BrandForm = (props) => {
    const formik = useFormik({
        initialValues: {
            name: '',
            description: '',
            shortDescription: '',
            logoUrl: ''
        },
        validationSchema: Yup.object({
            name: Yup.string().required('Please enter the brand name'),
            description: Yup.string(),
            shortDescription: Yup.string(),
            logoUrl: Yup.string().url('Invalid URL').required('Please enter the logo URL')
        }),
        onSubmit: values => {
            // Handle form submission, e.g., send data to API
            fetch('http://localhost:3010/api/brands', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(values)
            })
                .then(res => res.json())
                .then(data => {
                    if (data.success) {
                        toast.success(data.message);
                        props.callback();
                    }
                    else {
                        toast.info(data.message);
                    }
                })
        }
    });

    return (
        <form onSubmit={formik.handleSubmit}>
            <div className='d-flex justify-content-center mb-2'>
                <Image src={formik.values.logoUrl !== '' ? formik.values.logoUrl : "https://bobui.vn/assets/img/logo/bbsg_b.png"} type='avatar' />
            </div>
            <FormInput
                name="name"
                hint="Brand Name"
                className="mb-2"
                value={formik.values.name}
                onChange={formik.handleChange}
                errText={formik.errors.name}
                isErr={formik.touched.name && formik.errors.name}
            />
            <FormInput
                name="description"
                hint="Description (optional)"
                className="mb-2"
                value={formik.values.description}
                onChange={formik.handleChange}
                errText={formik.errors.description}
                isErr={formik.touched.description && formik.errors.description}
            />
            <FormInput
                name="shortDescription"
                hint="Short Description (optional)"
                className="mb-2"
                value={formik.values.shortDescription}
                onChange={formik.handleChange}
                errText={formik.errors.shortDescription}
                isErr={formik.touched.shortDescription && formik.errors.shortDescription}
            />
            <FormInput
                name="logoUrl"
                hint="Logo URL"
                className="mb-2"
                value={formik.values.logoUrl}
                onChange={formik.handleChange}
                errText={formik.errors.logoUrl}
                isErr={formik.touched.logoUrl && formik.errors.logoUrl}
            />
            <button type="submit" className="btn btn-primary w-100">Submit</button>
        </form>
    );
}

export default BrandForm;
