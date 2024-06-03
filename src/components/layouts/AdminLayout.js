import { Outlet } from "react-router-dom";
import Nav from "../Nav";
import Footer from "../Footer";
import { useContext, useEffect, useState } from "react";
import AuthContext from "../../context/AuthContext";

const AdminLayout = () => {

    const [isAdmin, setIsAdmin] = useState(false);
    const auth = useContext(AuthContext)

    useEffect(() => {
        if (auth.user && auth.user.role === 'admin') {
            setIsAdmin(true)
        }
    }, [auth])

    return (
        isAdmin &&
        <>
            <Nav isAdmin={true} />
            <div className="mx-2">
                <Outlet />
            </div>
            <Footer />
        </>
    );
}

export default AdminLayout;
