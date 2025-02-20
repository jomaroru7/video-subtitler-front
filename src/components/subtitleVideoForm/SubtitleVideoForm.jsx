import React from 'react'
import UploadFile from './UploadFile';
import DownloadButton from './DownloadButton';
import useFileStore from '../../stores/fileStore';

const SubtitleVideoForm = () => {
    const {videoUrl} = useFileStore();

    return (
        <div className="flex flex-col items-center justify-center bg-gray-100">
            <div className="flex flex-col gap-y-2 bg-white p-6 rounded-2xl shadow-lg max-w-md w-full ">
                <UploadFile />
                {videoUrl && <DownloadButton />}
            </div>
        </div>
    );
}

export default SubtitleVideoForm;
