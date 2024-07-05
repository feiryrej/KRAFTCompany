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
      res.cookie("token", token);
      return res.json({ loginStatus: true });
    } else {
      return res.json({ loginStatus: false, Error: "wrong email or password" });
    }
  });
});

router.post("/add_applicant", (req, res) => {
  const randomNumber1 = Math.floor(1000 + Math.random() * 9000); // Generates a random number between 1000 and 9999
  const randomNumber2 = Math.floor(1000 + Math.random() * 9000); // Generates another random number between 1000 and 9999
  const applicantId = `DLG-${randomNumber1}-${randomNumber2}`;

  const sql =
    "INSERT INTO applicant (`applicant_id`, `name`, `SSS_Number`, `Address`, `Phone_No`, `Email`) VALUES (?, ?, ?, ?, ?, ?)";
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
      if (err.code === "ER_DUP_ENTRY") {
        // Handle duplicate entry error
        return res.json({ status: false, error: "SSN Number must be unique." });
      } else {
        console.error("Error executing query:", err);
        return res.json({ status: false, error: "Query error" });
      }
    }
    return res.json({ status: true, applicantId: applicantId });
  });
});

router.get("/get_applicants", (req, res) => {
  const sql =
    "SELECT Applicant_ID, Name, SSS_number, Address, Phone_No, Email FROM applicant";

  con.query(sql, (err, result) => {
    if (err) {
      console.error("Error executing query:", err);
      return res
        .status(500)
        .json({ status: "Error", error: "Failed to fetch applicants" });
    }
    console.log("Fetched applicants successfully:", result);
    return res.json({ status: "Success", applicants: result });
  });
});

router.get("/applicant/:id", (req, res) => {
  const applicantId = req.params.id;
  const sql =
    "SELECT Applicant_ID, Name, SSS_number, Address, Phone_No, Email FROM applicant WHERE Applicant_ID = ?";

  con.query(sql, [applicantId], (err, result) => {
    if (err) {
      console.error("Error executing query:", err);
      return res
        .status(500)
        .json({ status: "Error", error: "Failed to fetch applicant" });
    }
    return res.json({ status: "Success", Result: result });
  });
});

router.put("/edit_applicant/:id", (req, res) => {
  const applicantId = req.params.id;
  const { Name, SSS_number, Address, Phone_No, Email } = req.body;

  const sql =
    "UPDATE applicant SET Name = ?, SSS_number = ?, Address = ?, Phone_No = ?, Email = ? WHERE Applicant_ID = ?";
  const values = [Name, SSS_number, Address, Phone_No, Email, applicantId];

  con.query(sql, values, (err, result) => {
    if (err) {
      console.error("Error executing query:", err);
      return res
        .status(500)
        .json({ status: "Error", error: "Failed to update applicant" });
    }
    return res.json({ status: "Success" });
  });
});

router.delete("/auth/delete_applicant/:id", async (req, res) => {
  const id = req.params.id;
  try {
    await Promise.all([
      deleteFromTable("applicant", id),
      deleteFromTable("job_application", id),
      deleteFromTable("education_history", id),
      deleteFromTable("employment_history", id),
      deleteFromTable("reference", id),
    ]);
    res.json({ status: true, message: "Applicant and related records deleted successfully" });
  } catch (error) {
    console.error("Error deleting applicant and related records:", error);
    res.status(500).json({ status: false, error: "Failed to delete applicant and related records" });
  }
});

async function deleteFromTable(tableName, id) {
  return new Promise((resolve, reject) => {
    const sql = `DELETE FROM ${tableName} WHERE Applicant_ID = ?`;
    con.query(sql, [id], (err, result) => {
      if (err) {
        console.error(`Error deleting from ${tableName}:`, err);
        reject(err);
      } else {
        resolve(result);
      }
    });
  });
}


router.get("/admin_count", (req, res) => {
  const sql = "SELECT COUNT(id) AS admin FROM admin";
  con.query(sql, (err, result) => {
    if (err) return res.json({ Status: false, Error: "Query Error: " + err });
    return res.json({ Status: true, Result: result });
  });
});

router.get("/applicant_count", (req, res) => {
  const sql = "SELECT COUNT(Applicant_id) AS applicants FROM applicant";
  con.query(sql, (err, result) => {
    if (err) return res.json({ Status: false, Error: "Query Error: " + err });
    return res.json({ Status: true, Result: result });
  });
});

router.get("/application_count", (req, res) => {
  const sql =
    "SELECT COUNT(application_id) AS applications FROM job_application";
  con.query(sql, (err, result) => {
    if (err) return res.json({ Status: false, Error: "Query Error: " + err });
    return res.json({ Status: true, Result: result });
  });
});

router.get("/admin_records", (req, res) => {
  const sql = "SELECT * FROM admin";
  con.query(sql, (err, result) => {
    if (err) return res.json({ Status: false, Error: "Query Error: " + err });
    return res.json({ Status: true, Result: result });
  });
});

router.get("/logout", (req, res) => {
  res.clearCookie("token");
  return res.json({ Status: true });
});

router.post("/add_education", (req, res) => {
  const randomNumber1 = Math.floor(1000 + Math.random() * 9000); // Generates a random number between 1000 and 9999
  const randomNumber2 = Math.floor(1000 + Math.random() * 9000); // Generates another random number between 1000 and 9999
  const educationHistoryId = `EDID-${randomNumber1}-${randomNumber2}`;
  const {
    Applicant_ID,
    Education_School_Name,
    Education_Level,
    Education_Location,
    Education_Years,
    has_Graduated,
    Education_Subjects,
  } = req.body;

  // Check if applicant_id exists
  const checkApplicantSql = "SELECT * FROM applicant WHERE Applicant_ID = ?";
  con.query(checkApplicantSql, [Applicant_ID], (err, result) => {
    if (err) {
      console.error("Error executing query:", err);
      return res.status(500).json({ status: false, error: "Query error" });
    }
    if (result.length === 0) {
      return res
        .status(400)
        .json({ status: false, error: "Applicant ID does not exist" });
    }

    const sql =
      "INSERT INTO education_history (Education_History_ID, Applicant_ID, Education_School_Name, Education_Level, Education_Location, Education_Years, has_Graduated, Education_Subjects) VALUES (?, ?, ?, ?, ?, ?, ?, ?)";
    const values = [
      educationHistoryId,
      Applicant_ID,
      Education_School_Name,
      Education_Level,
      Education_Location,
      Education_Years,
      has_Graduated,
      Education_Subjects,
    ];

    con.query(sql, values, (err, result) => {
      if (err) {
        console.error("Error executing query:", err);
        return res.status(500).json({ status: false, error: "Query error: " + err.message });
      }
      return res.json({ status: true, educationHistoryId: educationHistoryId });
    });
  });
});

// Example backend route with Express
router.get("/get_educations", (req, res) => {
  const sql = "SELECT * FROM education_history";

  con.query(sql, (err, result) => {
    if (err) {
      console.error("Error executing query:", err);
      return res
        .status(500)
        .json({ status: "Error", error: "Failed to fetch education history" });
    }
    console.log("Fetched education history successfully:", result);
    return res.json({ status: "Success", education: result });
  });
});

router.get("/education/:id", (req, res) => {
  const educationId = req.params.id;
  const sql = "SELECT * FROM education_history WHERE Education_History_ID = ?";

  con.query(sql, [educationId], (err, result) => {
    if (err) {
      console.error("Error executing query:", err);
      return res
        .status(500)
        .json({ status: "Error", error: "Failed to fetch education history" });
    }
    return res.json({ status: "Success", education: result });
  });
});

router.put("/edit_education/:id", (req, res) => {
  const educationId = req.params.id;
  const {
    Education_School_Name,
    Education_Level,
    Education_Location,
    Education_Years,
    has_Graduated,
    Education_Subjects,
  } = req.body;

  const sql =
    "UPDATE education_history SET Education_School_Name = ?, Education_Level = ?, Education_Location = ?, Education_Years = ?, has_Graduated = ?, Education_Subjects = ? WHERE Education_History_ID = ?";
  const values = [
    Education_School_Name,
    Education_Level,
    Education_Location,
    Education_Years,
    has_Graduated,
    Education_Subjects,
    educationId,
  ];

  con.query(sql, values, (err, result) => {
    if (err) {
      console.error("Error executing query:", err);
      return res
        .status(500)
        .json({ status: "Error", error: "Failed to update education history" });
    }
    return res.json({ status: "Success" });
  });
});

router.delete("/auth/delete_education/:id", (req, res) => {
  const educationId = req.params.id;
  const sql = "DELETE FROM education_history WHERE Education_History_ID = ?";

  con.query(sql, [educationId], (err, result) => {
    if (err) {
      console.error("Error executing query:", err);
      return res
        .status(500)
        .json({ status: "Error", error: "Failed to delete education history" });
    }
    return res.json({ status: "Success", result });
  });
});

// POST /auth/add_employment
router.post("/add_employment", (req, res) => {
  const {
    Applicant_ID,
    Employment_Start_Date,
    Employment_End_Date,
    Employment_Company_Name,
    Employment_Company_Address,
    Employment_Salary,
    Employment_Position,
    Employment_Reason_For_Leaving,
  } = req.body;

  // Check if applicant_id exists
  const checkApplicantSql = "SELECT * FROM applicant WHERE Applicant_ID = ?";
  con.query(checkApplicantSql, [Applicant_ID], (err, result) => {
    if (err) {
      console.error("Error executing checkApplicantSql:", err);
      return res.status(500).json({ status: false, error: "Query error" });
    }
    if (result.length === 0) {
      return res
        .status(400)
        .json({ status: false, error: "Applicant ID does not exist" });
    }

    const randomNumber1 = Math.floor(1000 + Math.random() * 9000); // Generates a random number between 1000 and 9999
    const randomNumber2 = Math.floor(1000 + Math.random() * 9000); // Generates another random number between 1000 and 9999
    const employmentHistoryId = `EHID-${randomNumber1}-${randomNumber2}`;

    const sql =
      "INSERT INTO employment_history (`Employment_History_ID`, `Applicant_ID`, `Employment_Start_Date`, `Employment_End_Date`, `Employment_Company_Name`, `Employment_Company_Address`, `Employment_Salary`, `Employment_Position`, `Employment_Reason_For_Leaving`) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)";
    const values = [
      employmentHistoryId,
      Applicant_ID,
      Employment_Start_Date,
      Employment_End_Date,
      Employment_Company_Name,
      Employment_Company_Address,
      Employment_Salary,
      Employment_Position,
      Employment_Reason_For_Leaving,
    ];

    con.query(sql, values, (err, result) => {
      if (err) {
        console.error("Error executing insert query:", err);
        return res
          .status(500)
          .json({ status: false, error: "Failed to add employment history" });
      }
      return res.json({ status: true, employmentHistoryId });
    });
  });
});

// GET /auth/get_employments
router.get("/get_employments", (req, res) => {
  const sql = "SELECT * FROM employment_history";

  con.query(sql, (err, result) => {
    if (err) {
      console.error("Error executing query:", err);
      return res
        .status(500)
        .json({ status: "Error", error: "Failed to fetch employment history" });
    }
    console.log("Fetched employment history successfully:", result);
    return res.json({ status: "Success", employment: result });
  });
});

// GET /auth/get_employment/:id
router.get("/get_employment/:id", (req, res) => {
    const employmentId = req.params.id;
    const sql =
      "SELECT * FROM employment_history WHERE Employment_History_ID = ?";
  
    con.query(sql, [employmentId], (err, result) => {
      if (err) {
        console.error("Error executing query:", err);
        return res
          .status(500)
          .json({ status: "Error", error: "Failed to fetch employment history" });
      }
      return res.json({ status: "Success", employment: result });
    });
  });
  

// PUT /auth/edit_employment/:id - Update an employment record
router.put("/edit_employment/:id", (req, res) => {
    const Employment_ID = req.params.id;
    const {
      Employment_Start_Date,
      Employment_End_Date,
      Employment_Company_Name,
      Employment_Company_Address,
      Employment_Salary,
      Employment_Position,
      Employment_Reason_For_Leaving,
    } = req.body;
  
    console.log("Updating Employment:", Employment_ID, req.body);

    let employmentEndDate 
  
    if (Employment_End_Date === "") {
        employmentEndDate = null
    } else {
        employmentEndDate = Employment_End_Date
    }

    // Validate the required fields
    if (!Employment_Start_Date || !Employment_Company_Name || !Employment_Position) {
      return res.status(400).json({ status: "Error", error: "Missing required fields" });
    }
  
    const sql = `UPDATE employment_history SET Employment_Start_Date = ?, Employment_End_Date = ?, Employment_Company_Name = ?, Employment_Company_Address = ?, Employment_Salary = ?, Employment_Position = ?, Employment_Reason_For_Leaving = ? WHERE Employment_history_ID = ?`;
  
    const values = [
      Employment_Start_Date,
      employmentEndDate,
      Employment_Company_Name,
      Employment_Company_Address,
      Employment_Salary,
      Employment_Position,
      Employment_Reason_For_Leaving,
      Employment_ID,
    ];
  
    con.query(sql, values, (err, result) => {
      if (err) {
        console.error("Error executing update query:", err);
        return res.status(500).json({ status: "Error", error: "Failed to update employment record" });
      }
      return res.json({ status: "Success" });
    });
  });
  
  

// DELETE /auth/delete_employment/:id
router.delete("/delete_employment/:id", (req, res) => {
  const employmentId = req.params.id;
  const sql = "DELETE FROM employment_history WHERE Employment_History_ID = ?";

  con.query(sql, [employmentId], (err, result) => {
    if (err) {
      console.error("Error executing query:", err);
      return res
        .status(500)
        .json({
          status: "Error",
          error: "Failed to delete employment history",
        });
    }
    return res.json({ status: "Success", result });
  });
});

// GET /auth/get_applications - Fetch all job applications
router.get("/get_application", (req, res) => {
  const sql = "SELECT * FROM job_application";
  con.query(sql, (err, result) => {
    if (err) {
      console.error("Error executing query:", err);
      return res
        .status(500)
        .json({ status: "Error", error: "Failed to fetch job applications" });
    }
    return res.json({ status: "Success", applications: result });
  });
});

// POST /auth/add_application - Add a new job application
router.post("/add_application", (req, res) => {
  const {
    Applicant_ID,
    Position,
    Date_of_Application,
    Date_can_Start,
    Salary_Desired,
    is_Currently_Employed,
    can_Inquire_Current_Employer,
    has_Applied_Before,
    Applied_Before_Where,
    Applied_Before_When,
    Special_Study_Subject,
    Special_Training,
    Special_Skills,
  } = req.body;

  const Application_ID = `AID-${Math.floor(1000 + Math.random() * 9000)}-${Math.floor(1000 + Math.random() * 9000)}`;

  const sql = `INSERT INTO job_application (Application_ID, Applicant_ID, Position, Date_of_Application, Date_can_Start, Salary_Desired, is_Currently_Employed, can_Inquire_Current_Employer, has_Applied_Before, Applied_Before_Where, Applied_Before_When, Special_Study_Subject, Special_Training, Special_Skills) 
               VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
  const values = [
    Application_ID,
    Applicant_ID,
    Position,
    Date_of_Application,
    Date_can_Start,
    Salary_Desired,
    is_Currently_Employed,
    can_Inquire_Current_Employer,
    has_Applied_Before,
    Applied_Before_Where || null,
    Applied_Before_When || null,
    Special_Study_Subject || null,
    Special_Training || null,
    Special_Skills || null,
  ];

  con.query(sql, values, (err, result) => {
    if (err) {
      console.error("Error executing insert query:", err);
      return res
        .status(500)
        .json({ status: "Error", error: "Failed to add job application" });
    }
    return res.json({ status: "Success", Application_ID });
  });
});


// DELETE /auth/delete_application/:id - Delete a job application
router.delete("/delete_application/:id", (req, res) => {
  const Application_ID = req.params.id;
  const sql = "DELETE FROM job_application WHERE Application_ID = ?";
  con.query(sql, [Application_ID], (err, result) => {
    if (err) {
      console.error("Error executing delete query:", err);
      return res
        .status(500)
        .json({ status: "Error", error: "Failed to delete job application" });
    }
    return res.json({ status: "Success" });
  });
});

// GET /auth/application/:id - Fetch a specific job application by ID
router.get("/application/:id", (req, res) => {
  const Application_ID = req.params.id;
  const sql = "SELECT * FROM job_application WHERE Application_ID = ?";
  con.query(sql, [Application_ID], (err, result) => {
    if (err) {
      console.error("Error executing query:", err);
      return res
        .status(500)
        .json({ status: "Error", error: "Failed to fetch job application" });
    }
    return res.json({ status: "Success", application: result });
  });
});

// PUT /auth/edit_application/:id - Update a job application
router.put("/edit_application/:id", (req, res) => {
  const Application_ID = req.params.id;
  const {
    Applicant_ID,
    Position,
    Date_of_Application,
    Date_can_Start,
    Salary_Desired,
    is_Currently_Employed,
    can_Inquire_Current_Employer,
    has_Applied_Before,
    Applied_Before_Where,
    Applied_Before_When,
    Special_Study_Subject,
    Special_Training,
    Special_Skills,
  } = req.body;

  const sql = `UPDATE job_application SET Applicant_ID = ?, Position = ?, Date_of_Application = ?, Date_can_Start = ?, Salary_Desired = ?, is_Currently_Employed = ?, can_Inquire_Current_Employer = ?, has_Applied_Before = ?, Applied_Before_Where = ?, Applied_Before_When = ?, Special_Study_Subject = ?, Special_Training = ?, Special_Skills = ? WHERE Application_ID = ?`;
  const values = [
    Applicant_ID,
    Position,
    Date_of_Application,
    Date_can_Start,
    Salary_Desired,
    is_Currently_Employed,
    can_Inquire_Current_Employer,
    has_Applied_Before,
    Applied_Before_Where,
    Applied_Before_When,
    Special_Study_Subject,
    Special_Training,
    Special_Skills,
    Application_ID,
  ];

  con.query(sql, values, (err, result) => {
    if (err) {
      console.error("Error executing update query:", err);
      return res
        .status(500)
        .json({ status: "Error", error: "Failed to update job application" });
    }
    return res.json({ status: "Success" });
  });
});

// Add a new reference
router.post("/add_reference", (req, res) => {
  const randomNumber1 = Math.floor(1000 + Math.random() * 9000); // Generates a random number between 1000 and 9999
  const randomNumber2 = Math.floor(1000 + Math.random() * 9000); // Generates another random number between 1000 and 9999
  const referenceId = `REFID-${randomNumber1}-${randomNumber2}`;
  const {
    Applicant_ID,
    Reference_Name,
    Reference_PhoneNo,
    Reference_Profession,
    Reference_Years_Known,
  } = req.body;

  // Check if applicant_id exists
  const checkApplicantSql = "SELECT * FROM applicant WHERE Applicant_ID = ?";
  con.query(checkApplicantSql, [Applicant_ID], (err, result) => {
    if (err) {
      console.error("Error executing query:", err);
      return res.status(500).json({ status: false, error: "Query error" });
    }
    if (result.length === 0) {
      return res
        .status(400)
        .json({ status: false, error: "Applicant ID does not exist" });
    }

    const sql =
      "INSERT INTO reference (`Reference_ID`, `Applicant_ID`, `Reference_Name`, `Reference_PhoneNo`, `Reference_Profession`, `Reference_Years_Known`) VALUES (?, ?, ?, ?, ?, ?)";
    const values = [
      referenceId,
      Applicant_ID,
      Reference_Name,
      Reference_PhoneNo,
      Reference_Profession,
      Reference_Years_Known,
    ];

    con.query(sql, values, (err, result) => {
      if (err) {
        console.error("Error executing query:", err);
        return res.status(500).json({ status: false, error: "Query error" });
      }
      return res.json({ status: true, referenceId: referenceId });
    });
  });
});

// Fetch all references
router.get("/get_references", (req, res) => {
  const sql = "SELECT * FROM reference";

  con.query(sql, (err, result) => {
    if (err) {
      console.error("Error executing query:", err);
      return res
        .status(500)
        .json({ status: "Error", error: "Failed to fetch reference history" });
    }
    console.log("Fetched reference history successfully:", result);
    return res.json({ status: "Success", references: result });
  });
});

// Fetch a single reference by ID
router.get("/reference/:id", (req, res) => {
  const referenceId = req.params.id;
  const sql = "SELECT * FROM reference WHERE Reference_ID = ?";

  con.query(sql, [referenceId], (err, result) => {
    if (err) {
      console.error("Error executing query:", err);
      return res
        .status(500)
        .json({ status: "Error", error: "Failed to fetch reference history" });
    }
    return res.json({ status: "Success", reference: result });
  });
});

router.put("/edit_reference/:id", (req, res) => {
    const referenceId = req.params.id;
    const {
      Reference_Name,
      Reference_PhoneNo,
      Reference_Profession,
      Reference_Years_Known,
    } = req.body;
  
    console.log("Received data:", req.body); // Add this line
  
    if (!Reference_Name || !Reference_PhoneNo || !Reference_Profession || !Reference_Years_Known) {
      return res.status(400).json({ status: "Error", error: "All fields are required" });
    }
  
    const sql = "UPDATE reference SET Reference_Name = ?, Reference_PhoneNo = ?, Reference_Profession = ?, Reference_Years_Known = ? WHERE Reference_ID = ?";
    const values = [
      Reference_Name,
      Reference_PhoneNo,
      Reference_Profession,
      Reference_Years_Known,
      referenceId,
    ];
  
    con.query(sql, values, (err, result) => {
      if (err) {
        console.error("Error executing query:", err);
        return res.status(500).json({ status: "Error", error: "Failed to update reference" });
      }
      if (result.affectedRows === 0) {
        return res.status(404).json({ status: "Error", error: "Reference not found" });
      }
      return res.json({ status: "Success" });
    });
  });
  
  
  

// Delete a reference by ID
router.delete("/delete_reference/:id", (req, res) => {
  const referenceId = req.params.id;
  const sql = "DELETE FROM reference WHERE Reference_ID = ?";

  con.query(sql, [referenceId], (err, result) => {
    if (err) {
      console.error("Error executing query:", err);
      return res
        .status(500)
        .json({ status: "Error", error: "Failed to delete reference history" });
    }
    return res.json({ status: "Success", result });
  });
});

export { router as adminRouter };
