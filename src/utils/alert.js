import Swal from 'sweetalert2';
import 'sweetalert2/dist/sweetalert2.min.css';

const baseSwalOptions = {
  customClass: {
    popup: 'bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200',
    title: 'text-lg font-bold',
    confirmButton: 'bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600',
    cancelButton: 'bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600',
  },
  buttonsStyling: false,
};

export const showSuccessAlert = (title, text) => {
  return Swal.fire({
    ...baseSwalOptions,
    icon: 'success',
    title: title,
    text: text,
    confirmButtonText: 'OK',
  });
};

export const showDeniedAlert = (title, text) => {
  Swal.fire({
    ...baseSwalOptions,
    icon: 'error',
    title: title,
    text: text,
    confirmButtonText: 'OK',
  });
};

export const showDangerAlert = (title, text) => {
  Swal.fire({
    ...baseSwalOptions,
    icon: 'warning',
    title: title,
    text: text,
    confirmButtonText: 'OK',
  });
};