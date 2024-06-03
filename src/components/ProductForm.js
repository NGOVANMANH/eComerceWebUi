import { useFormik } from "formik";
import FormInput from "./FormInput";
import * as Yup from "yup";
import { useState, useEffect, useContext } from "react";
import ShopContext from "../context/ShopContext";
import ProductInfo from "./ProductInfo";
import Popup from "./Popup";
import BrandForm from "./BrandForm";
import CategoryForm from "./CategoryForm";
import { toast } from "react-toastify";

const productSchema = Yup.object().shape({
    name: Yup.string().required("Please enter the product name"),
    description: Yup.string(),
    shortDescription: Yup.string(),
    thumbnail: Yup.string().url("Please enter a valid URL").required("Please enter the thumbnail URL"),
    brandId: Yup.number().required("Please select a brand"),
    categoryId: Yup.number().required("Please select a category"),
    attributes: Yup.object().shape({
        size: Yup.string().required("Please enter the size"),
        color: Yup.string().required("Please enter the color"),
    }),
    sku: Yup.string(),
    price: Yup.number().positive("Price must be a positive number").required("Please enter the price"),
    discountPercent: Yup.number().min(0, "Discount percent cannot be less than 0").max(100, "Discount percent cannot be more than 100").required("Please enter the discount percent"),
    quantity: Yup.number().integer("Quantity must be an integer").min(0, "Quantity cannot be less than 0").required("Please enter the quantity"),
});

const ProductForm = (props) => {
    const [product, setProduct] = useState({});
    const shop = useContext(ShopContext);
    const [modalShow, setModalShow] = useState(false)
    const [modalTitle, setModalTitle] = useState('');

    useEffect(() => {
        if (props.productId) {
            fetch(`http://localhost:3010/api/products/${props.productId}`)
                .then(res => res.json())
                .then(data => {
                    if (data.success) {
                        setProduct(data.data);
                    }
                })
                .catch(console.log);
        }
    }, [props.productId]);

    useEffect(() => {
        if (Object.keys(product).length > 0) {
            formik.setValues({
                name: product.name || '',
                description: product.description || '',
                shortDescription: product.short_description || '',
                thumbnail: product.thumbnail || '',
                brandId: product.brand_id || '',
                categoryId: product.category_id || '',
                attributes: {
                    size: product.size || '',
                    color: product.color || '',
                },
                sku: product.sku || '',
                price: product.price || '',
                discountPercent: product.discount_percent || '',
                quantity: product.quantity || '',
            });
        }
    }, [product]);

    const formik = useFormik({
        initialValues: {
            name: '',
            description: '',
            shortDescription: '',
            thumbnail: '',
            brandId: '',
            categoryId: '',
            attributes: {
                size: '',
                color: '',
            },
            sku: '',
            price: '',
            discountPercent: '',
            quantity: '',
        },
        onSubmit: (values) => {
            const standardValues = Object.keys(values).reduce((acc, key) => {
                if (typeof values[key] === 'string') {
                    acc[key] = values[key].toLowerCase();
                } else {
                    acc[key] = values[key];
                }
                return acc;
            }, {});
            console.log(standardValues);

            if (Object.keys(product).length === 0) {
                fetch('http://localhost:3010/api/products/add-detail', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(standardValues)
                }).then(response => response.json())
                    .then(data => {
                        if (data.success) {
                            props.callback();
                            toast.success(data.message)
                        }
                        else toast.info(data.message)
                    })
            } else {
                // Call update API
                fetch(`http://localhost:3010/api/products/${props.productId}`, {
                    method: 'PATCH',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(standardValues)
                }).then(response => response.json())
                    .then(data => {
                        if (data.success) {
                            props.callback();
                            toast.success(data.message)
                        }
                        else toast.info(data.message)
                    })
            }
        },
        validationSchema: productSchema,
    });

    const handleShowModalAddBrand = () => {
        setModalTitle('Add brand');
        setModalShow(true);
    }

    const handleShowModalAddCategory = () => {
        setModalTitle('Add category');
        setModalShow(true);
    }

    const hideModal = () => {
        setModalShow(false);
        shop.reCall();
    }

    const handleDeleteProduct = () => {
        if (props.productId) {
            fetch(`http://localhost:3010/api/products/${props.productId}`, {
                method: 'DELETE',
            }).then(response => response.json())
                .then(data => {
                    if (data.success) {
                        props.callback();
                        toast.success(data.message)
                    }
                    else toast.info(data.message)
                })
        }
    }

    return (
        <form onSubmit={formik.handleSubmit} className="d-flex flex-column">

            <Popup
                className="mt-5"
                title={modalTitle}
                size='sm'
                show={modalShow}
                onHide={hideModal}
                children={modalTitle === 'Add brand' ? <BrandForm callback={hideModal} /> : <CategoryForm callback={hideModal} />}
            />

            <ProductInfo product={{
                ...formik.values,
                brand_name: shop && shop.brands && (shop.brands.find(brand => brand.id === +formik.values.brandId))?.name,
                category_name: shop && shop.categories && (shop.categories.find(item => item.id === +formik.values.categoryId))?.name,
            }} />

            <div className="d-flex flex-row">
                <div className="flex-grow-1">
                    <select className="form-select mb-2"
                        name="brandId"
                        onChange={formik.handleChange}
                        value={formik.values.brandId}
                    >
                        <option value="">Choose brand</option>
                        {shop && shop.brands && shop.brands.map((brand, index) => (
                            <option key={index} value={brand.id}>{brand.name}</option>
                        ))}
                    </select>
                    {formik.touched.brandId && formik.errors.brandId && (
                        <div className="form-text mb-2 ms-1 text-danger">
                            {formik.errors.brandId}
                        </div>
                    )}
                </div>
                <button type="button" className="btn btn-primary mb-2 ms-2" onClick={handleShowModalAddBrand}>New</button>
            </div>

            <div className="d-flex flex-row">
                <div className="flex-grow-1">
                    <select className="form-select mb-2"
                        name="categoryId"
                        onChange={formik.handleChange}
                        value={formik.values.categoryId}
                    >
                        <option value="">Choose category</option>
                        {shop && shop.categories && shop.categories.map((category, index) => (
                            <option key={index} value={category.id}>{category.name}</option>
                        ))}
                    </select>
                    {formik.touched.categoryId && formik.errors.categoryId && (
                        <div className="form-text mb-2 ms-1 text-danger">
                            {formik.errors.categoryId}
                        </div>
                    )}
                </div>
                <button type="button" className="btn btn-primary mb-2 ms-2" onClick={handleShowModalAddCategory}>New</button>
            </div>
            <FormInput
                className="mb-2"
                fieldName="Product Name"
                name="name"
                hint="Product Name"
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
            <FormInput
                className="mb-2"
                fieldName="Short Description"
                name="shortDescription"
                hint="Short Description"
                onChange={formik.handleChange}
                value={formik.values.shortDescription}
                errText={formik.errors.shortDescription}
                isErr={formik.touched.shortDescription && formik.errors.shortDescription}
            />
            <FormInput
                className="mb-2"
                fieldName="Thumbnail"
                name="thumbnail"
                hint="Thumbnail"
                onChange={formik.handleChange}
                value={formik.values.thumbnail}
                errText={formik.errors.thumbnail}
                isErr={formik.touched.thumbnail && formik.errors.thumbnail}
            />
            <FormInput
                className="mb-2"
                fieldName="Size"
                name="attributes.size"
                hint="Size"
                onChange={formik.handleChange}
                value={formik.values.attributes.size}
                errText={formik.errors.attributes?.size}
                isErr={formik.touched.attributes?.size && formik.errors.attributes?.size}
            />
            {/* <FormInput
                className="mb-2"
                fieldName="Color"
                name="attributes.color"
                hint="Color"
                onChange={formik.handleChange}
                value={formik.values.attributes.color}
                errText={formik.errors.attributes?.color}
                isErr={formik.touched.attributes?.color && formik.errors.attributes?.color}
            /> */}

            <input
                type="color"
                name="attributes.color"
                className="form-control form-control-color mb-2"
                value={formik.values.attributes.color}
                onChange={formik.handleChange}
                title="Choose a color" />

            <FormInput
                className="mb-2"
                fieldName="SKU"
                name="sku"
                hint="SKU"
                onChange={formik.handleChange}
                value={formik.values.sku}
                errText={formik.errors.sku}
                isErr={formik.touched.sku && formik.errors.sku}
            />
            <FormInput
                className="mb-2"
                fieldName="Price"
                name="price"
                hint="Price"
                onChange={formik.handleChange}
                value={formik.values.price}
                errText={formik.errors.price}
                isErr={formik.touched.price && formik.errors.price}
            />
            <FormInput
                className="mb-2"
                fieldName="Discount Percent"
                name="discountPercent"
                hint="Discount Percent"
                onChange={formik.handleChange}
                value={formik.values.discountPercent}
                errText={formik.errors.discountPercent}
                isErr={formik.touched.discountPercent && formik.errors.discountPercent}
            />
            <FormInput
                className="mb-2"
                fieldName="Quantity"
                name="quantity"
                hint="Quantity"
                onChange={formik.handleChange}
                value={formik.values.quantity}
                errText={formik.errors.quantity}
                isErr={formik.touched.quantity && formik.errors.quantity}
            />
            {props.productId && props.productId !== null && (
                <button
                    type="button"
                    className="btn btn-danger mb-2"
                    onClick={handleDeleteProduct}
                >Delete</button>
            )}
            <button type="submit" className="btn btn-primary">Submit</button>
        </form>
    );
};

export default ProductForm;
