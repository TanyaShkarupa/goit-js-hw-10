import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';

import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';

const datetimePicker = document.querySelector('#datetime-picker');
const startButton = document.querySelector('[data-start]');

const daysValue = document.querySelector('[data-days]');
const hoursValue = document.querySelector('[data-hours]');
const minutesValue = document.querySelector('[data-minutes]');
const secondsValue = document.querySelector('[data-seconds]');

let userSelectedDate = null;
let timerId = null;

startButton.disabled = true;

const options = {
  enableTime: true,
  time_24hr: true,
  defaultDate: new Date(),
  minuteIncrement: 1,

  onClose(selectedDates) {
    const selectedDate = selectedDates[0];

    if (!selectedDate) {
      userSelectedDate = null;
      startButton.disabled = true;
      return;
    }

    if (selectedDate <= new Date()) {
      userSelectedDate = null;
      startButton.disabled = true;

      iziToast.error({
        title: 'Error',
        message: 'Please choose a date in the future',
      });

      return;
    }

    userSelectedDate = selectedDate;
    startButton.disabled = false;
  },
};

flatpickr(datetimePicker, options);

startButton.addEventListener('click', () => {
  if (!userSelectedDate) {
    return;
  }

  startButton.disabled = true;
  datetimePicker.disabled = true;

  updateTimer();

  timerId = setInterval(updateTimer, 1000);
});

function updateTimer() {
  const currentTime = new Date();
  const diff = userSelectedDate - currentTime;

  if (diff <= 0) {
    clearInterval(timerId);

    datetimePicker.disabled = false;
    startButton.disabled = true;

    updateTimerDisplay(0);

    return;
  }

  updateTimerDisplay(diff);
}

function updateTimerDisplay(ms) {
  const time = convertMs(ms);

  daysValue.textContent = addLeadingZero(time.days);
  hoursValue.textContent = addLeadingZero(time.hours);
  minutesValue.textContent = addLeadingZero(time.minutes);
  secondsValue.textContent = addLeadingZero(time.seconds);
}

function addLeadingZero(value) {
  return String(value).padStart(2, '0');
}

function convertMs(ms) {
  const second = 1000;
  const minute = second * 60;
  const hour = minute * 60;
  const day = hour * 24;

  const days = Math.floor(ms / day);
  const hours = Math.floor((ms % day) / hour);
  const minutes = Math.floor(((ms % day) % hour) / minute);
  const seconds = Math.floor((((ms % day) % hour) % minute) / second);

  return {
    days,
    hours,
    minutes,
    seconds,
  };
}
