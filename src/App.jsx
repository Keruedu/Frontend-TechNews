import { useState, useEffect } from 'react'
import AppRouter from './components/router/AppRouter.jsx';
//Notification when user follow up post
function App() {
  useEffect(() => {
    const darkMode = localStorage.getItem('darkMode');
    if (darkMode === 'enabled') {
        document.body.classList.add('dark');
    } else {
        document.body.classList.remove('dark');
    }
  });
  return (
    <div className='max-w-[1580px] m-auto bg-white text-[#333] dark:bg-[#0e1217] dark:text-[#fff]'>
      <AppRouter></AppRouter>
    </div>
  ) 

//   return (
//     <div>
//         <AppRouter />
//     </div>
// );
  
}

export default App
