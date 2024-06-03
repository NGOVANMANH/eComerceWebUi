import { Outlet } from "react-router-dom";
import Nav from "../Nav";
import Footer from "../Footer";

const DefaultLayout = () => {
    return (
        <>
            <Nav />
            <div className="mx-2" style={{ background: "f4f5f7" }}>
                <Outlet />
            </div>
            <Footer />
        </>
    );
}

export default DefaultLayout;
