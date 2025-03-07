import { FaLinkedin, FaGithub } from "react-icons/fa";

const Footer = () => {
    return (
        <footer className="bg-gray-900 text-white py-6 text-center w-full">
            <div className="container mx-auto flex flex-col items-center">
                <h2 className="text-lg font-semibold">About</h2>
                <div className="flex flex-row gap-4">
                    <div className="flex flex-col">
                        <h2>Carlos Perales Gonzales</h2>
                        <div className="flex space-x-4 mt-2 justify-center">
                            <a
                                href="https://www.linkedin.com/in/carlos-perales-cperales/"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-400 hover:text-blue-500 transition"
                            >
                                <FaLinkedin size={24} />
                            </a>
                            <a
                                href="https://github.com/cperales"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-gray-400 hover:text-gray-500 transition"
                            >
                                <FaGithub size={24} />
                            </a>
                        </div>
                    </div>
                    <div className="flex flex-col">
                        <h2>José María Romero Ruiz</h2>
                        <div className="flex space-x-4 mt-2 justify-center">
                            <a
                                href="https://www.linkedin.com/in/jomaroru/"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-400 hover:text-blue-500 transition"
                            >
                                <FaLinkedin size={24} />
                            </a>
                            <a
                                href="https://github.com/jomaroru7"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-gray-400 hover:text-gray-500 transition"
                            >
                                <FaGithub size={24} />
                            </a>
                        </div>
                    </div>

                </div>
            </div>
        </footer>
    );
};

export default Footer;