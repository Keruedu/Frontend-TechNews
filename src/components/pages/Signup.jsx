import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Logo from '../../assets/logo.svg';
import InputSign from '../button/inputsign';
import { signup } from '../api/auth';
import CustomButton from '../button/custombutton.jsx';
import { faEnvelope } from '@fortawesome/free-regular-svg-icons';
import { faLock, faUser } from '@fortawesome/free-solid-svg-icons';

const Signup = () => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleSignup = async (e) => {
        e.preventDefault();
        console.log('Form values:', { username, email, password }); // Kiểm tra giá trị của form trước khi gửi
        const result = await signup(username, email, password);
        if (result.success) {
            navigate('/login');
        } else {
            console.error('Signup failed:', result.message);
        }
    };

    return (
        <div className='h-[100vh] text-[#a8b3cf] dark:text-[#d1d5db]'>
            <div className='px-[40px] py-[32px]'>
                <a href="./"><img src={Logo} alt="error logo" className='h-[30px]' /></a>
            </div>
            <div className='flex flex-col items-center w-[31.6%] mx-auto p-[60px] gap-[40px] '>
                <p className='text-[40px] text-black dark:text-white font-bold'>Sign up</p>
                <form onSubmit={handleSignup} className='flex flex-col w-full gap-[25px]'>
                    <InputSign Icon={faUser} Text='Username' Type='text' value={username} onChange={(e) => setUsername(e.target.value)} />
                    <InputSign Icon={faEnvelope} Text='Email' Type='email' value={email} onChange={(e) => setEmail(e.target.value)} />
                    <InputSign Icon={faLock} Text='Password' Type='password' value={password} onChange={(e) => setPassword(e.target.value)} />
                    <CustomButton white={true} width='w-[36.1%]' content={<span className='text-[16px] font-bold'>Sign up</span>} />
                </form>
                <div className='flex justify-center pt-[14px] border-t-[1px] w-full border-gray-700'>
                    <span className='text-[14px] text-center'>Already using TechNew? <a href="./login" className='text-blue-500 dark:text-blue-300 underline'> Login</a></span>
                </div>
            </div>

            <footer className='flex flex-row text-[12px] justify-center gap-[10px]'>
                <a href="./" className='text-black dark:text-white'>@ 2024 DevsNoob</a>
                <a href="./" className='text-black dark:text-white'>Guidelines</a>
                <a href="./" className='text-black dark:text-white'>Tags</a>
                <a href="./" className='text-black dark:text-white'>Explore</a>
                <a href="./" className='text-black dark:text-white'>Source</a>
                <a href="./" className='text-black dark:text-white'>Techology</a>
                <a href="./" className='text-black dark:text-white'>Leaderboard</a>
            </footer>
        </div>
    );
};

export default Signup;