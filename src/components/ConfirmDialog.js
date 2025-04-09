import Swal from 'sweetalert2';

export const confirmDialog = async ({ title, text, icon = 'warning' }) => {
  const result = await Swal.fire({
    title,
    text,
    icon,
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Yes',
    cancelButtonText: 'Cancel'
  });

  return result.isConfirmed;
};
