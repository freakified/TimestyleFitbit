import clock from 'clock';
import document from 'document';
import { today } from 'user-activity';
import { HeartRateSensor } from "heart-rate";
import { preferences } from 'user-settings';
import { language_names, weekday_names, month_names } from './localDates'
import * as util from '../common/utils';

// Update the clock every minute
clock.granularity = 'seconds';

let hrm = new HeartRateSensor();
let lastReading = 0;

hrm.onreading = () => {
  heartRate_text.text = (hrm.timestamp === lastReading) ? "--" : hrm.heartRate;

  lastReading = hrm.timestamp;
  hrm.stop();
};

// clock face
const digit_h1 = document.getElementById('digit_h1');
const digit_h2 = document.getElementById('digit_h2');
const digit_m1 = document.getElementById('digit_m1');
const digit_m2 = document.getElementById('digit_m2');

// date widget
const date_dayOfWeek = document.getElementById('date_dayOfWeek');
const date_dayOfMonth = document.getElementById('date_dayOfMonth');
const date_Month = document.getElementById('date_Month');

// steps widget
const steps_text = document.getElementById('steps_text');

// calories widget
const calories_text = document.getElementById('calories_text');

// heart widget
const heartRate_text = document.getElementById('heartRate_text');

// stairs widget
const stairs_text = document.getElementById('stairs_text');


// Update the <text> element every tick with the current time
clock.ontick = (evt) => {
  const now = evt.date;
  const hours = util.zeroPad(
    (preferences.clockDisplay === '12h')
      ? now.getHours()
      : now.getHours() % 12 || 12
  );
  
  const mins = util.zeroPad(now.getMinutes());
  
  digit_h1.href = `digits/default/${hours[0]}.png`;
  digit_h2.href = `digits/default/${hours[1]}.png`;
  digit_m1.href = `digits/default/${mins[0]}.png`;
  digit_m2.href = `digits/default/${mins[1]}.png`;
  
  
  // while we're at it, update the date widget
  date_dayOfWeek.text = weekday_names['en_US'][now.getDay()];
  date_dayOfMonth.text = now.getDate();
  date_Month.text = month_names['en_US'][now.getMonth()];
  
  // let's do the others
  steps_text.text = (today.local.steps.toLocaleString('en_US') || 0);
  calories_text.text = (today.local.calories.toLocaleString('en_US') || 0);
  stairs_text.text = (today.local.elevationGain || 0);
  
  hrm.start();
}
