import express from "express";
import con from "../utils/db.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import multer from "multer";
import path from "path";

const router = express.Router();

router.post("/adminlogin", (req, res) => {
  const sql = "SELECT * from admin Where email = ? and password = ?";
  con.query(sql, [req.body.email, req.body.password], (err, result) => {
    if (err) return res.json({ loginStatus: false, Error: "Query error" });
    if (result.length > 0) {
      const email = result[0].email;
      const token = jwt.sign(
        { role: "admin", email: email, id: result[0].id },
        "jwt_secret_key",
        { expiresIn: "1d" }
      );
      res.cookie('token', token)
      return res.json({ loginStatus: true });
    } else {
        return res.json({ loginStatus: false, Error:"wrong email or password" });
    }
  });
});

router.post('/add_applicant', (req, res) => {
    const randomNumber = Math.floor(1000 + Math.random() * 9000); // Generates a random number between 1000 and 9999
    const randomString = Math.random().toString(36).substring(2, 6); // Generates a 4-character random string
    const applicantId = `DLG-${randomNumber}-${randomString}`;    

    const sql = "INSERT INTO applicant (`applicant_id`, `name`, `SSS_Number`, `Address`, `Phone_No`, `Email`) VALUES (?, ?, ?, ?, ?, ?)";
    const values = [
        applicantId,
        req.body.Name,
        req.body.SSS_number,
        req.body.Address,
        req.body.Phone_No,
        req.body.Email,
    ];

    con.query(sql, values, (err, result) => {
        if (err) {
            if (err.code === 'ER_DUP_ENTRY') { // Handle duplicate entry error
                return res.json({ status: false, error: "SSN Number must be unique." });
            } else {
                console.error("Error executing query:", err);
                return res.json({ status: false, error: "Query error" });
            }
        }
        return res.json({ status: true, applicantId: applicantId });
    });
});

router.get('/get_applicants', (req, res) => {
    const sql = 'SELECT Applicant_ID, Name, SSS_number, Address, Phone_No, Email FROM applicant';

    con.query(sql, (err, result) => {
        if (err) {
            console.error('Error executing query:', err);
            return res.status(500).json({ status: 'Error', error: 'Failed to fetch applicants' });
        }
        console.log('Fetched applicants successfully:', result);
        return res.json({ status: 'Success', applicants: result });
    });
});




export { router as adminRouter };
