/* eslint-disable */
import axios from 'axios';
import { showAlert } from './alerts';

export const forgotPassword = async email => {
  try {
    const res = await axios({
      method: 'POST',
      url: 'http://localhost:3000/api/v1/users/forgotPassword',
      data: {
        email
      }
    });
    
    if (res.data.status === 'success') {
      showAlert('success', 'Email sent successfully!');
    }
  } catch (err) {
    showAlert('error', err.response.data.message);
  }
};
