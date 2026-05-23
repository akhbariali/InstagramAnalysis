import { BrowserRouter, Route, Routes, Navigate  } from "react-router-dom"
import Layout from "./pages/layout.jsx";
import Login from "./pages/Login.jsx";;
import MainPage from "./pages/mainPage.jsx";
import SignUp from "./pages/signUp.jsx";
import WordCloud from "./pages/WordCloud.jsx";

const RouterContainer = ({hasToken, setHasToken}) => {

    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={(hasToken)?<Layout />:<Navigate to="/login" />} >
                    <Route index element={<MainPage />} />
                    <Route path="main" element={<MainPage />} />         
                    <Route path="wordCloud" element={<WordCloud />} />
                </Route>
                <Route path="login" element={<Login setHasToken={setHasToken} />} />              
                <Route path="signup" element={<SignUp setHasToken={setHasToken} />} />              
            </Routes>
        </BrowserRouter>
    )
}
export default RouterContainer      