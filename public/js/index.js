/* eslint-disable */
import '@babel/polyfill';
import { displayMap } from './mapbox';
import { login, logout } from './login';
import { updateSettings } from './updateSettings';
import { resetPassword } from './passwordReset';
import { forgotPassword } from './forgotPassword';
import { signup } from './signup';
import { bookTour } from './stripe';
import { showAlert } from './alerts';

// DOM ELEMENTS
const mapBox = document.getElementById('map');
const loginForm = document.querySelector('.form--login');
const signupForm = document.querySelector('.form--signup');
const resetPasswordForm = document.querySelector('.form--reset-password');
const forgotPasswordForm = document.querySelector('.form--forgot-password');
const logOutBtn = document.querySelector('.nav__el--logout');
const userDataForm = document.querySelector('.form-user-data');
const userPasswordForm = document.querySelector('.form-user-settings');
const bookBtn = document.getElementById('book-tour');

//VALUES

//DELEGATION
if (mapBox) {
  window.addEventListener('scroll', reveal);
  function reveal() {
    let reveals = document.querySelectorAll('.reveal');
    for (let i = 0; i < reveals.length; i++) {
      let windowheight = window.innerHeight;
      let revealtop = reveals[i].getBoundingClientRect().top;
      let revealpoint = 150;
      if (revealtop < windowheight - revealpoint) {
        reveals[i].classList.add('reveal-active');
      } else {
        reveals[i].classList.remove('reveal-active');
      }
    }
  }
  const locations = JSON.parse(mapBox.dataset.locations);
  displayMap(locations);
}
if (loginForm) {
  loginForm.addEventListener('submit',async e => {
    e.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    // console.log(email, password);
    await login(email, password);
  });
}
if (signupForm) {
  signupForm.addEventListener('submit',async  e => {
    e.preventDefault();
    document.querySelector('.btn--signup').textContent = 'Creating...';

    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const passwordConfirm = document.getElementById('passwordConfirm').value;
    // console.log(name,email, password, passwordConfirm);
    await signup(name,email, password, passwordConfirm);

    document.querySelector('.btn--signup').textContent = 'Sign up';
    document.getElementById('name').value = '';
    document.getElementById('email').value = '';
    document.getElementById('password').value = '';
    document.getElementById('passwordConfirm').value = '';
  });
}
if (resetPasswordForm) {
  resetPasswordForm.addEventListener('submit', async e => {
    e.preventDefault();
    const password = document.getElementById('password').value;
    const passwordConfirm = document.getElementById('passwordConfirm').value;
    // console.log(password, passwordConfirm);
    await resetPassword(password, passwordConfirm);
  });
}
if (forgotPasswordForm)
  forgotPasswordForm.addEventListener('submit', async e => {
    e.preventDefault();
    document.querySelector('.btn--save-password').textContent = 'Submiting...';
    const email = document.getElementById('email').value;

    await forgotPassword(email);

    document.querySelector('.btn--save-password').textContent = 'Submit';
    document.getElementById('email').value = '';
  });

if (logOutBtn) logOutBtn.addEventListener('click', logout);

if (userDataForm)
  userDataForm.addEventListener('submit',async e => {
    e.preventDefault();
    const form = new FormData();
    form.append('name', document.getElementById('name').value);
    form.append('email', document.getElementById('email').value);
    form.append('photo', document.getElementById('photo').files[0]);
    await updateSettings(form, 'data');
  });

if (userPasswordForm)
  userPasswordForm.addEventListener('submit', async e => {
    e.preventDefault();
    document.querySelector('.btn--save-password').textContent = 'Updating...';

    const passwordCurrent = document.getElementById('password-current').value;
    const password = document.getElementById('password').value;
    const passwordConfirm = document.getElementById('password-confirm').value;
    await updateSettings(
      { passwordCurrent, password, passwordConfirm },
      'password'
    );

    document.querySelector('.btn--save-password').textContent = 'Save password';
    document.getElementById('password-current').value = '';
    document.getElementById('password').value = '';
    document.getElementById('password-confirm').value = '';
  });

if(bookBtn)
  bookBtn.addEventListener('click', async e => {
    e.target.textContent="Processing...";
    const tourId= e.target.dataset.tourId;
    await bookTour(tourId); 
    e.target.textContent="Book tour now!";
})

const alertMessage = document.querySelector('body').dataset.alert;
if (alertMessage) showAlert('success', alertMessage, 20);