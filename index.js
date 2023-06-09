const express = require("express");
const bodyParser = require("body-parser");
const nodemailer = require("nodemailer");
const smtpTransport = require("nodemailer-smtp-transport");
const cors = require("cors");
const verifyToken = require("./Authorization");

// import express from "express";
// import dotenv from "dotenv";
// import nodemailer from "nodemailer";
// import smtpTransport from "nodemailer-smtp-transport";

// dotenv.config();
// .Env config
require("dotenv").config();

const app = express();
app.use(express.json());
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.urlencoded({ extended: true }));
// app.use((req, res, next) => {
//   res.set("Content-Type", "application/json");
//   res.set("Authorization", "Bearer YOUR_ACCESS_TOKEN");
//   next();
// });
//middleware
app.use(cors({ credentials: true, origin: "https://www.zintopinto.com" }));

const PORT = process.env.PORT || 6001;

let transporter = nodemailer.createTransport(
  smtpTransport({
    service: "gmail",
    host: "smtp.gmail.com",
    auth: {
      user: process.env.AUTH_EMAIL,
      pass: process.env.AUTH_PASS,
    },
  })
);

transporter.verify((error, success) => {
  if (error) {
    console.log(error);
  } else {
    console.log("Mail Is Ready");
    console.log(success);
  }
});

app.get("/", (req, res) => {
  res.status(200).json({
    status: "SEE MUMU",
    message: "Wetin you dey look for?",
    // error: err,
  });
});

app.post("/zintopinto/sendmail", async (req, res) => {
  try {
    let { name, email, subject, message } = req.body;
    email = email.trim();
    name = name.trim();

    let mailOptions = await {
      from: "Zinto-Pinto <contact@zintopinto.com>",
      to: "Zinto-Pinto <contact@zintopinto.com>",
      subject: `Message from ${
        name[0].toUpperCase() + name.slice(1)
      } : ${subject}`,
      html: `<!DOCTYPE html>
      <html>
      <head>
        <title>Email Template</title>
        <style>
          /* CSS styling for the email template */
          body {
            font-family: Arial, sans-serif;
            background-color: #f2f2f2;
            margin: 0;
            padding: 0;
          }
      
          .container {
            max-width: 600px;
            margin: 20px auto;
            background-color: #ffffff;
            border: 1px solid #e8e8e8;
            border-radius: 5px;
            overflow: hidden;
          }
      
          .header {
            background-color: #007bff;
            color: #fff;
            padding: 20px;
          }
      
          .content {
            padding: 20px;
          }
      
          .form-group {
            margin-bottom: 20px;
          }
      
          .form-group label {
            display: block;
            margin-bottom: 5px;
            font-weight: bold;
            color: #333;
          }
      
          .form-group p {
            margin: 0;
            font-weight: normal;
            color: #555;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1 style="margin: 0;">ZINTO-PINTO</h1>
          </div>
          <div class="content">
            <div class="form-group">
              <label for="name">Name:</label>
              <p>${name[0].toUpperCase() + name.slice(1)}</p>
            </div>
      
            <div class="form-group">
              <label for="email">Email:</label>
              <p>${email}</p>
            </div>
      
            <div class="form-group">
              <label for="subject">Subject:</label>
              <p>${subject}</p>
            </div>
      
            <div class="form-group">
              <label for="message">Message:</label>
              <p>${message}</p>
            </div>
          </div>
        </div>
      </body>
      </html>
      `,
    };
    await transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        //  console.log(error);
        res.status(500).json({
          status: "FAILED",
          message: "An error occurred. Check your network and try again",
          error: error,
        });
      } else {
        res.redirect('https://www.zintopinto.com/demo2/success.php');
        //   console.log("Email sent: " + info.response);
//         res.status(200).json({
//           status: "Email sent",
//           message: info.response,
//         });
      }
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      status: "FAILED",
      message: "wahala, pls try again",
      error: error,
    });
  }
});

// app.post("/sendmail", verifyToken, async (req, res) => {
//   try {
//     const { name, sendFrom, sendTo, sendSubject, sendHtml } = req.body;
//     if (sendFrom !== "info@dubaigreenproperties.com") {
//       res.status(404).json({
//         status: "FAILED",
//         message: "NO BE OUR MAIL BE THAT.",
//       });
//     } else {
//       let mailOptions = {
//         from: sendFrom,
//         to: sendTo,
//         subject: sendSubject,
//         html: `${sendHtml}`,
//       };
//       console.log(mailOptions);

//       await transporter.sendMail(mailOptions, function (error, info) {
//         if (error) {
//           //  console.log(error);
//           res.status(500).json({
//             status: "FAILED",
//             message: "An error occurred. Check your network and try again",
//             error: error,
//           });
//         } else {
//           //   console.log("Email sent: " + info.response);
//           res.status(200).json({
//             status: "Email sent",
//             message: info.response,
//           });
//         }
//       });
//     }
//   } catch (err) {
//     res.status(500).json({
//       status: "FAILED",
//       message: "wahala, pls try again",
//       error: err,
//     });
//     //res.render("./home");
//   }
// });

app.listen(PORT, () => console.log(`Server Port: ${PORT}`));

// let token = req.header("Authorization");

// if (!token) {
//   return res.status(403).send("Access Denied");
// }

// if (token.startsWith("Bearer ")) {
//   console.log(token);
//   token = token.slice(7, token.length).trimLeft();
// } else {
//   return res.status(403).send("Wetin you dey look for?");
// }
// console.log(token);

// const verified = jwt.verify(token, "bobai");
// req.user = verified;
// let { sendFrom, sendTo, sendSubject, sendHtml } = req.params;

// if (
//   sendFrom === "" ||
//   sendTo === "" ||
//   sendSubject === "" ||
//   sendHtml === ""
// ) {
//   // res.redirect('/from');
//   res.status(404).json({
//     status: "FAILED",
//     message: "Empty credentials supplied.",
//   });
// }
