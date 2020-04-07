const cron = require("node-cron");
const express = require("express");
const nodemailer = require("nodemailer")

app = express();


    // create mail transporter
    let transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "remynder.notifications@gmail.com",
        pass: "Baseball1!"
      }
    });

    // sending emails at periodic intervals
    cron.schedule("* 2 * * *", function(){
      console.log("---------------------");
      console.log("Running Cron Job");
      let mailOptions = {
        to: "nickwilliams4@gmail.com",
        subject: `Your Requested Remynder`,
        text: `Testing nodemailer`
      };
      transporter.sendMail(mailOptions, function(error, info) {
        if (error) {
          throw error;
        } else {
          console.log("Email successfully sent!");
        }
      });
    });

    app.listen("3128");