const knex = require('knex')
const app = require('./app')
const { DATABASE_URL, PORT } = require('./config')
const moment = require('moment')
const cron = require("node-cron");
const nodemailer = require("nodemailer")
const { GMAIL_PASSWORD } = require('./config')
const NotesService = require('./notes/notes-service')
const UsersService = require('./users/users-service')


const db = knex({
  client: 'pg',
  connection: DATABASE_URL,
})

app.set('db', db)

function updateReminderTimeStamp(note) {
  // 3. re-stamp each one after the relevant email goes out
  const hoursToIncrementBy = parseInt(note.remynder);
   const units = hoursToIncrementBy == 5 ? 'minutes' : 'hours'
  const updatedRemynderDate = moment.unix(note.next_remynder).utc().add(hoursToIncrementBy, units).unix();
   
  console.log('increment hours', hoursToIncrementBy);
  console.log('current date in database', moment(note.next_remynder));
  console.log('attempted update date', updatedRemynderDate);
  
  NotesService.updateNote(db, note.id, {next_remynder: updatedRemynderDate});
}

function sendEmailToUserForNote(user, note) {
  let mailOptions = {
    to: user.user_name,
    subject: `Your Requested Remynder - ${note.title}`,
    text: note.content
  };
  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      throw error;
    } else {
      console.log("Email successfully sent!");
    }
  });
}

// 2. send out an email for each note
function sendEmailAndUpdateDate(note) {
  UsersService.getUserByID(db, note.author_id)
    .then(user => {
      sendEmailToUserForNote(user, note);
      updateReminderTimeStamp(note);
    })
    .catch(error => console.log('error getting user', error));
}

// create mail transporter
let transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "remynder.notifications@gmail.com",
    pass: GMAIL_PASSWORD
  }
});

// sending emails at periodic intervals - 0 */1 * * *"
cron.schedule("* * * * *", function () {
  console.log("---------------------");
  console.log("Running Cron Job");

  // 1. query "notes" table to get all past-due reminders
  const knexInstance = app.get('db')
  NotesService.getAllPastDueNotes(knexInstance)
    .then(notes => notes.forEach(note => sendEmailAndUpdateDate(note)))
    .catch(error => console.log('Error fetching notes: ', error));
});

app.listen(PORT, function(){
  console.log('server started')
})