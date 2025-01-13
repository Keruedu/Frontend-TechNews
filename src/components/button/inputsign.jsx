import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const InputSign = ({ Text, Icon, Handle, Type, value, onChange }) => {
    return (
        <label className='relative text-[16px]'>
            <div className='absolute inset-y-0 left-0 flex items-center pl-4'>
                <FontAwesomeIcon icon={Icon} />
            </div>
            <input
                className='w-full h-[48px] placeholder:text-slate-400 block bg-slate-100 dark:bg-gray-700 border border-slate-300 dark:border-gray-600 rounded-[12px] py-2 pr-[16px] pl-[40px] shadow-sm focus:outline-none focus:border-sky-500 focus:ring-sky-500 focus:ring-1 sm:text-sm'
                placeholder={Text}
                type={Type}
                value={value}
                onChange={onChange}
            />
        </label>
    );
};

export default InputSign;