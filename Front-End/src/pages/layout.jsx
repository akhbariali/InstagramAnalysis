import { Outlet } from "react-router-dom";
import { MySidebar } from "../Components/Sidebar/Sidebar";

const Layout = () => {
    return(
        <div className="">
            <MySidebar/>
            <Outlet />
        </div>
    );
}
export default Layout;
