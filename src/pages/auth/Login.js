import { Link } from "react-router-dom";
import styled from "styled-components";
import thumb from "../../assets/style_3.jpg"
import FormInput from "../../components/FormInput";
import { useFormik } from "formik";
import * as Yup from "yup"
import { useContext } from "react";
import AuthContext from "../../context/AuthContext";
import { toast } from "react-toastify";

const Login = () => {


    const auth = useContext(AuthContext)

    const formik = useFormik({
        initialValues: {
            email: '',
            password: ''
        },
        validationSchema: Yup.object().shape({
            email: Yup.string().required("Please enter your Email or Username"),
            password: Yup.string().required("Please enter your Password")
        }),
        onSubmit: async (values) => {
            let account;
            if (!values.email.includes("@")) {
                account = {
                    username: values.email,
                    password: values.password
                };
            } else {
                account = {
                    email: values.email,
                    password: values.password
                };
            }

            try {
                const response = await fetch('http://localhost:3010/api/auth/login', {
                    method: 'POST',
                    mode: 'cors',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(account)
                });

                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }

                const data = await response.json();
                if (data.success === true) {
                    const user = data.data;
                    auth.login(user)
                    toast.success("Login successful")
                }
                else toast.info(data.message)
                // Handle successful login (e.g., save token, redirect user)
            } catch (error) {
                console.error('Error during login:', error);
                // Handle login error (e.g., show error message)
            }
        }
    });

    return (
        <Wrapper>
            <div className="container py-5">

                <div className="card card-border">
                    <div className='row g-0'>

                        <div className="col-md-6">
                            <img src={thumb} alt="login form" className='rounded-start thumb' />
                        </div>

                        <div className="col-md-6">
                            <div className='card-body d-flex flex-column'>

                                <div className='d-flex flex-row mt-2'>
                                    <span className="h1 fw-bold mb-0">Let's start your style</span>
                                </div>

                                <h5 className="fw-normal my-2 pb-3" style={{ letterSpacing: '1px' }}>Sign into your account</h5>

                                <form className="my-5" onSubmit={formik.handleSubmit}>
                                    <FormInput
                                        name="email"
                                        hint="Username or email"
                                        className="mb-2"
                                        value={formik.values.email}
                                        onChange={formik.handleChange}
                                        errText={formik.errors.email}
                                        isErr={formik.touched.email && formik.errors.email}
                                    />
                                    <FormInput
                                        name="password"
                                        hint="Password"
                                        type="password"
                                        className="mb-2"
                                        value={formik.values.password}
                                        onChange={formik.handleChange}
                                        errText={formik.errors.password}
                                        isErr={formik.touched.password && formik.errors.password}
                                    />
                                    <button type="submit" className="btn btn-secondary w-100 mb-4 px-5" color='dark' size='lg'>Login</button>
                                </form>
                                <Link className="small text-muted" to="#!">Forgot password?</Link>
                                <p className="mb-5 pb-lg-2" style={{ color: '#393f81' }}>Don't have an account? <Link to="/auth/register" style={{ color: '#393f81' }}>Register here</Link></p>

                                <div className='d-flex flex-row justify-content-start'>
                                    <Link to="#!" className="small text-muted me-1">Terms of use.</Link>
                                    <Link to="#!" className="small text-muted">Privacy policy</Link>
                                </div>

                            </div>
                        </div>

                    </div>
                </div>

            </div>
        </Wrapper>
    );
}

const Wrapper = styled.div`
min-height: 100vh;
background: rgb(129,130,93);
background: linear-gradient(236deg, rgba(129,130,93,1) 0%, rgba(142,103,85,1) 100%);
display: flex;
align-items: center;

.card-border {
    border: 1px solid rgba(255,255,255);
}

.thumb {
    object-fit: cover;
    width: 100%;
    height: 700px;
}

`

export default Login;
