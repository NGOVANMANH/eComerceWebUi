import { Link, useNavigate, useLocation } from "react-router-dom";
import AuthContext from "../context/AuthContext";
import { useContext } from "react";
import UserInfor from "./UserInfor";
import { Dropdown, NavDropdown } from 'react-bootstrap';
import ShopContext from "../context/ShopContext";

const Nav = (props) => {
    const auth = useContext(AuthContext)
    const shop = useContext(ShopContext)
    const navigate = useNavigate()
    const location = useLocation()

    return (
        <>
            <nav className="navbar sticky-top navbar-expand-lg navbar-light bg-light">
                <div className="container container-fluid">
                    <Link className="navbar-brand" to="">{shop.shopName}</Link>
                    <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                        <span className="navbar-toggler-icon"></span>
                    </button>
                    <div className="collapse navbar-collapse" id="navbarSupportedContent">
                        <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                            {
                                props.isAdmin ? (
                                    <>
                                        <li className="nav-item">
                                            <Link className="nav-link" to="users">Users</Link>
                                        </li>
                                        <li className="nav-item">
                                            <Link className="nav-link" to="products">Products</Link>
                                        </li>
                                        <li className="nav-item">
                                            <Link className="nav-link" to="orders">Orders</Link>
                                        </li>
                                        <li className="nav-item">
                                            <Link className="nav-link" to="vouchers">Vouchers</Link>
                                        </li>
                                    </>
                                ) : (
                                    <>
                                        <NavDropdown title="Brands">
                                            {
                                                shop && shop.brands && shop.brands.map((brand, index) => (
                                                    <NavDropdown.Item key={index}>
                                                        {brand.name}
                                                    </NavDropdown.Item>
                                                ))
                                            }
                                        </NavDropdown>
                                        <NavDropdown title="Categories">
                                            {
                                                shop && shop.categories && shop.categories.map((category, index) => (
                                                    <NavDropdown.Item key={index}>
                                                        {category.name}
                                                    </NavDropdown.Item>
                                                ))
                                            }
                                        </NavDropdown>
                                        {
                                            auth.isAuthenticated && <li className="nav-item">
                                                <Link className="nav-link" to="/cart">Cart</Link>
                                            </li>
                                        }
                                    </>
                                )
                            }
                        </ul>

                        <div class="d-flex">
                            {
                                auth.isAuthenticated ?
                                    <Dropdown style={{ height: "40px" }}>
                                        <Dropdown.Toggle style={{ margin: "0px", padding: "0px", background: "transparent", border: "none" }}>
                                            <UserInfor onlyAvatar image={auth.user.avatar === null ? undefined : auth.user.avatar} />
                                        </Dropdown.Toggle>
                                        <Dropdown.Menu align={"end"}>
                                            <Dropdown.Item onClick={() => navigate('/profile')}>Profile</Dropdown.Item>
                                            {auth && auth.user && auth.user.role === 'admin' && (location.pathname.includes('/admin') ? (
                                                <Dropdown.Item onClick={() => navigate('/')}>To sell page</Dropdown.Item>
                                            ) : (
                                                <Dropdown.Item onClick={() => navigate('/admin')}>To admin page</Dropdown.Item>
                                            ))}

                                            <Dropdown.Item onClick={auth.logout}>Log out</Dropdown.Item>
                                        </Dropdown.Menu>
                                    </Dropdown>
                                    :
                                    <div>
                                        <Link className="nav-link" to="/auth">Login</Link>
                                    </div>
                            }
                        </div>
                    </div>
                </div>
            </nav >
        </>
    );
}

export default Nav;
