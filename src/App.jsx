import React from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import SubtitleVideoForm from "./components/subtitleVideoForm/SubtitleVideoForm";
import Header from "./components/Header";

function App() {
    return (
        <div className="min-h-screen flex flex-col justify-between bg-gray-100">
            <Header/>
            <SubtitleVideoForm/>
            <ToastContainer
                position="top-right"
                autoClose={3000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="colored"
            />
        </div>
    );
}

export default App;
