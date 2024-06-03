import { Link, useNavigate } from "react-router-dom";
import styled from "styled-components";
import thumb from "../../assets/style_3.jpg";
import FormInput from "../../components/FormInput";
import { useFormik } from "formik";
import * as Yup from "yup";
import { toast } from "react-toastify";

const Register = () => {
    const navigate = useNavigate();

    const formik = useFormik({
        initialValues: {
            email: '',
            username: '',
            password: '',
            confirmPassword: ''
        },
        validationSchema: Yup.object().shape({
            email: Yup.string().email("Invalid email address").required("Please enter your Email"),
            username: Yup.string().required("Please enter your Username"),
            password: Yup.string().required("Please enter your Password"),
            confirmPassword: Yup.string()
                .oneOf([Yup.ref('password'), null], "Passwords must match")
                .required("Please confirm your Password")
        }),
        onSubmit: async (values) => {
            try {
                const response = await fetch('http://localhost:3010/api/auth/register', {
                    method: 'POST',
                    mode: 'cors',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(values)
                });

                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }

                const data = await response.json();
                if (data.success === true) {
                    toast.success("Registration successful");

                    setTimeout(() => {
                        navigate('/auth');
                    }, 500);
                } else {
                    toast.info(data.message);
                }
            } catch (error) {
                console.error('Error during registration:', error);
                toast.error('Registration failed. Please try again.');
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
                                <h5 className="fw-normal my-2 pb-3" style={{ letterSpacing: '1px' }}>Create your account</h5>
                                <form className="my-5" onSubmit={formik.handleSubmit}>
                                    <FormInput
                                        name="email"
                                        hint="Email"
                                        className="mb-2"
                                        value={formik.values.email}
                                        onChange={formik.handleChange}
                                        errText={formik.errors.email}
                                        isErr={formik.touched.email && formik.errors.email}
                                    />
                                    <FormInput
                                        name="username"
                                        hint="Username"
                                        className="mb-2"
                                        value={formik.values.username}
                                        onChange={formik.handleChange}
                                        errText={formik.errors.username}
                                        isErr={formik.touched.username && formik.errors.username}
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
                                    <FormInput
                                        name="confirmPassword"
                                        hint="Confirm password"
                                        type="password"
                                        className="mb-2"
                                        value={formik.values.confirmPassword}
                                        onChange={formik.handleChange}
                                        errText={formik.errors.confirmPassword}
                                        isErr={formik.touched.confirmPassword && formik.errors.confirmPassword}
                                    />
                                    <button type="submit" className="btn btn-secondary mb-4 px-5" color='dark' size='lg'>Register</button>
                                </form>
                                <a className="small text-muted" href="#!">Forgot password?</a>
                                <p className="mb-5 pb-lg-2" style={{ color: '#393f81' }}>You have an account? <Link to="/auth" style={{ color: '#393f81' }}>Sign in here</Link></p>
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
background: linear-gradient(40deg, rgba(129,130,93,1) 0%, rgba(142,103,85,1) 100%);
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
`;

export default Register;
