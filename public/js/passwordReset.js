/* eslint-disable */
import axios from 'axios';
import { showAlert } from './alerts';

export const resetPassword = async (password,passwordConfirm) => {
  try {
    const res = await axios({
      method: 'PATCH',
      url: document.URL,
      data: {
        password,
        passwordConfirm
      }
    });

    if (res.data.status === 'success') {
      showAlert('success', 'Reset successfully!');
      window.setTimeout(() => {
        location.assign('/overview');
      }, 1);
    }
  } catch (err) {
    showAlert('error', err.response.data.message);
  }
};