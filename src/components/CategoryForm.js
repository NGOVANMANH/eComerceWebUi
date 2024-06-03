import React, { useState, useEffect } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { toast } from 'react-toastify';

const CategoryForm = (props) => {
    const [categories, setCategories] = useState([]);

    useEffect(() => {
        // Fetch categories for parentId select options
        fetch('http://localhost:3010/api/categories')
            .then(res => res.json())
            .then(data => setCategories(data.data))
            .catch(console.error);
    }, []);

    const formik = useFormik({
        initialValues: {
            parentId: '',
            name: '',
            shortDescription: '',
            description: ''
        },
        validationSchema: Yup.object({
            parentId: Yup.number().nullable(),
            name: Yup.string().required('Please enter the category name'),
            shortDescription: Yup.string(),
            description: Yup.string()
        }),
        onSubmit: values => {
            // Handle form submission, e.g., send data to API
            if (values.parentId === '') {
                values.parentId = null;
            }
            fetch('http://localhost:3010/api/categories', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(values)
            })
                .then(res => res.json())
                .then(data => {
                    console.log(data)
                    if (data.success) {
                        toast.success(data.message)
                    }
                    else toast.info(data.message)
                    props.callback();
                })
        }
    });

    return (
        <form onSubmit={formik.handleSubmit}>
            <div className="mb-2">
                <select
                    id="parentId"
                    name="parentId"
                    className="form-select"
                    onChange={formik.handleChange}
                    value={formik.values.parentId}
                >
                    <option value="">Select parent category</option>
                    {categories.map(category => (
                        <option key={category.id} value={category.id}>
                            {category.name}
                        </option>
                    ))}
                </select>
            </div>
            <div className="mb-2">
                <input
                    id="name"
                    name="name"
                    type="text"
                    className="form-control"
                    placeholder="Category Name"
                    onChange={formik.handleChange}
                    value={formik.values.name}
                />
                {formik.touched.name && formik.errors.name && (
                    <div className="form-text text-danger">{formik.errors.name}</div>
                )}
            </div>
            <div className="mb-2">
                <input
                    id="shortDescription"
                    name="shortDescription"
                    type="text"
                    className="form-control"
                    placeholder="Short Description"
                    onChange={formik.handleChange}
                    value={formik.values.shortDescription}
                />
                {formik.touched.shortDescription && formik.errors.shortDescription && (
                    <div className="form-text text-danger">{formik.errors.shortDescription}</div>
                )}
            </div>
            <div className="mb-2">
                <textarea
                    id="description"
                    name="description"
                    className="form-control"
                    placeholder="Description"
                    onChange={formik.handleChange}
                    value={formik.values.description}
                ></textarea>
                {formik.touched.description && formik.errors.description && (
                    <div className="form-text text-danger">{formik.errors.description}</div>
                )}
            </div>
            <button type="submit" className="btn btn-primary">Submit</button>
        </form>
    );
}

export default CategoryForm;
