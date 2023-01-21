const express = require("express");
const nodemailer = require("nodemailer");
const smtpTransport = require("nodemailer-smtp-transport");
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
app.use(express.urlencoded({ extended: true }));
// app.use((req, res, next) => {
//   res.set("Content-Type", "application/json");
//   res.set("Authorization", "Bearer YOUR_ACCESS_TOKEN");
//   next();
// });

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

app.post("/sendmail", verifyToken, async (req, res) => {
  try {
    const { sendFrom, sendTo, sendSubject, sendHtml } = req.body;
    if (sendFrom === "info@dubaigreenproperties.com") {
      let mailOptions = {
        from: sendFrom,
        to: sendTo,
        subject: sendSubject,
        html: `${sendHtml}`,
      };
      console.log(mailOptions);

      await transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
          //  console.log(error);
          res.status(500).json({
            status: "FAILED",
            message: "An error occurred. Check your network and try again",
            error: error,
          });
        } else {
          //   console.log("Email sent: " + info.response);
          res.status(200).json({
            status: "Email sent",
            message: info.response,
          });
        }
      });
    } else {
      res.status(404).json({
        status: "FAILED",
        message: "NO BE OUR MAIL BE THAT.",
      });
    }
  } catch (err) {
    res.status(500).json({
      status: "FAILED",
      message: "wahala, pls try again",
      error: err,
    });
    //res.render("./home");
  }
});

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
