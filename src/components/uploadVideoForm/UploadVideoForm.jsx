import React from 'react'
import UploadFile from './UploadFile';

const UploadVideoForm = () => {

    return (
        <div className="flex flex-col items-center justify-center bg-gray-100">
            <div className="flex flex-col gap-y-2 bg-white p-6 rounded-2xl shadow-lg max-w-md w-full ">
                <UploadFile />
            </div>
        </div>
    );
}

export default UploadVideoForm;
