import express from "express";
import con from "../utils/db.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import multer from "multer";
import path from "path";

const router = express.Router();

// Route for handling admin login
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

// Route for adding a new applicant
router.post("/add_applicant", (req, res) => {
  const randomNumber1 = Math.floor(1000 + Math.random() * 9000); 
  const randomNumber2 = Math.floor(1000 + Math.random() * 9000); 
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

// Route for fetching all applicants
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

// Route for fetching a specific applicant by their ID
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

// Route for editing an existing applicant by their ID
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

// Route for deleting an applicant and related records by ID
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

// Async function to delete records from a specified table by Applicant_ID
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

// Router for counting the number of admin
router.get("/admin_count", (req, res) => {
  const sql = "SELECT COUNT(id) AS admin FROM admin";
  con.query(sql, (err, result) => {
    if (err) return res.json({ Status: false, Error: "Query Error: " + err });
    return res.json({ Status: true, Result: result });
  });
});

// Router for counting the number of applicant
router.get("/applicant_count", (req, res) => {
  const sql = "SELECT COUNT(Applicant_id) AS applicants FROM applicant";
  con.query(sql, (err, result) => {
    if (err) return res.json({ Status: false, Error: "Query Error: " + err });
    return res.json({ Status: true, Result: result });
  });
});

// Router for counting the number of application
router.get("/application_count", (req, res) => {
  const sql =
    "SELECT COUNT(application_id) AS applications FROM job_application";
  con.query(sql, (err, result) => {
    if (err) return res.json({ Status: false, Error: "Query Error: " + err });
    return res.json({ Status: true, Result: result });
  });
});

// Router for fetching admin record
router.get("/admin_records", (req, res) => {
  const sql = "SELECT * FROM admin";
  con.query(sql, (err, result) => {
    if (err) return res.json({ Status: false, Error: "Query Error: " + err });
    return res.json({ Status: true, Result: result });
  });
});

// Route for logging out (clearing the token cookie)
router.get("/logout", (req, res) => {
  res.clearCookie("token");
  return res.json({ Status: true });
});

// Route for adding a new education history
router.post("/add_education", (req, res) => {
  const randomNumber1 = Math.floor(1000 + Math.random() * 9000); 
  const randomNumber2 = Math.floor(1000 + Math.random() * 9000); 
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

// Route for fetching all education history
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

// Route for fetching a specific education history by their ID
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

// Route for editing an existing education history by their ID
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

// Route for deleting an existing education history by their ID
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

// Route for adding a new employment history
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

// Route for fetching all employment history
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

// Route for fetching a specific employment history by their ID
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
  

// Route for editing an existing employment history by their ID
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
  
// Route for deleting a specific employment history by their ID
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

// Route for fetching all application
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

// Route for adding a new application
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

  // Check if the applicant has already applied this year
  const year = new Date().getFullYear();
  const sqlCheckYear = `SELECT * FROM job_application WHERE Applicant_ID = ? AND YEAR(Date_of_Application) = ?`;
  con.query(sqlCheckYear, [Applicant_ID, year], (err, result) => {
    if (err) {
      console.error("Error checking application for the year:", err);
      return res.status(500).json({ status: "Error", error: "Failed to check application" });
    }

    if (result.length > 0) {
      return res.status(400).json({ status: "Error", error: "Applicant has already applied this year" });
    }

    // Check if the applicant has already applied to the same position
    const sqlCheckPosition = `SELECT * FROM job_application WHERE Applicant_ID = ? AND Position = ?`;
    con.query(sqlCheckPosition, [Applicant_ID, Position], (err, result) => {
      if (err) {
        console.error("Error checking application for the position:", err);
        return res.status(500).json({ status: "Error", error: "Failed to check application" });
      }

      if (result.length > 0) {
        return res.status(400).json({ status: "Error", error: "Applicant has already applied to this position" });
      }

      // If checks pass, proceed with inserting the new application
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
          return res.status(500).json({ status: "Error", error: "Failed to add job application" });
        }
        return res.json({ status: "Success", Application_ID });
      });
    });
  });
});


// Route for editing an existing application by their ID
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

// Route for adding a new reference
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

// Route for fetching all applicants references
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

// Route for fetching a specific reference by their ID
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

// Route for editing an existing reference by their ID
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

// Route for deleting a specific reference by their ID
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

// Router for easy query 1 
router.get("/applications_with_high_salary", (req, res) => {
  const sql = "SELECT * FROM job_application WHERE Salary_Desired > ?";
  const salaryThreshold = 50000;

  con.query(sql, [salaryThreshold], (err, result) => {
    if (err) {
      console.error("Error executing query:", err);
      return res.status(500).json({ status: "Error", error: "Failed to fetch job applications" });
    }
    return res.json({ status: "Success", applications: result });
  });
});

// Router for easy query 2
router.get('/get_applicants_sorted_by_name', (req, res) => {
  const sql = 'SELECT * FROM Applicant ORDER BY Name';

  con.query(sql, (err, result) => {
    if (err) {
      console.error('Error executing query:', err);
      return res.status(500).json({ status: 'Error', error: 'Failed to fetch applicants sorted by name' });
    }
    console.log('Fetched applicants sorted by name successfully:', result);
    return res.json({ status: 'Success', applicants: result });
  });
});

// Router for easy query 3
router.get("/applicants_in_makati", (req, res) => {
  const sql = "SELECT * FROM Applicant WHERE Address LIKE '%Makati%';";

  con.query(sql, (err, result) => {
    if (err) {
      console.error("Error executing query:", err);
      return res.status(500).json({ status: "Error", error: "Failed to fetch applicants in Makati" });
    }
    console.log("Fetched applicants in Makati successfully:", result);
    return res.json({ status: "Success", applicants: result });
  });
});

// Router for moderate query 1 
router.get("/application_counts", (req, res) => {
  const sql = "SELECT Position, COUNT(*) AS Application_Count FROM job_application GROUP BY Position;";

  con.query(sql, (err, result) => {
    if (err) {
      console.error("Error executing query:", err);
      return res.status(500).json({ status: "Error", error: "Failed to fetch application counts" });
    }
    console.log("Fetched application counts successfully:", result);
    return res.json({ status: "Success", applicationCounts: result });
  });
});

// Router for moderate query 2
router.get("/avg_salary_by_position", (req, res) => {
  const sql = "SELECT Employment_Position, AVG(Employment_Salary) AS Avg_Salary FROM Employment_History GROUP BY Employment_Position";

  con.query(sql, (err, result) => {
    if (err) {
      console.error("Error executing query:", err);
      return res.status(500).json({ status: "Error", error: "Failed to fetch average salaries by position" });
    }
    console.log("Fetched average salaries by position successfully:", result);
    return res.json({ status: "Success", avgSalariesByPosition: result });
  });
});

// Router for moderate query 3
router.get("/applicants_with_previous_applications", (req, res) => {
  const sql = "SELECT Applicant_ID, Applied_Before_Where FROM job_Application WHERE has_Applied_Before = 1;";

  con.query(sql, (err, result) => {
    if (err) {
      console.error("Error executing query:", err);
      return res.status(500).json({ status: "Error", error: "Failed to fetch applicants with previous applications" });
    }
    console.log("Fetched applicants with previous applications successfully:", result);
    return res.json({ status: "Success", applicantsWithPreviousApplications: result });
  });
});

// Router for moderate query 4
router.get("/education_levels", (req, res) => {
  const sql = "SELECT Education_Level, COUNT(*) AS Applicant_Count FROM Education_History GROUP BY Education_Level";

  con.query(sql, (err, result) => {
    if (err) {
      console.error("Error executing query:", err);
      return res.status(500).json({ status: "Error", error: "Failed to fetch education levels" });
    }
    console.log("Fetched education levels successfully:", result);
    return res.json({ status: "Success", educationLevels: result });
  });
});

// Router for difficult query 1 
router.get("/detailed_applicants", (req, res) => {
  console.log('Received GET request at /auth/detailed_applicants');
  const sql = `
    SELECT A.Applicant_ID, A.Name, A.SSS_Number, A.Address, A.Phone_No, A.Email,
           E.Employment_History_ID, E.Employment_Start_Date, E.Employment_End_Date,
           E.Employment_Company_Name, E.Employment_Company_Address, E.Employment_Salary,
           E.Employment_Position, E.Employment_Reason_For_Leaving
    FROM Applicant A
    JOIN Employment_History E ON A.Applicant_ID = E.Applicant_ID
  `;

  con.query(sql, (err, result) => {
    if (err) {
      console.error("Error executing query:", err);
      return res.status(500).json({ status: "Error", error: "Failed to fetch detailed applicants with employment history" });
    }
    console.log("Fetched detailed applicants with employment history successfully:", result);
    return res.json({ status: "Success", detailedApplicants: result });
  });
});

// Router for difficult query 2
router.get("/difficult_query_2", (req, res) => {
  console.log('Received GET request at /auth/difficult_query_2');
  const sql = `
    SELECT 
      a.Name AS Applicant_Name,
      eh.Education_Subjects AS Education_Background,
      ap.Special_Training AS Specialized_Training,
      ap.Position AS Latest_Applied_Position,
      ap.Date_of_Application AS Latest_Application_Date
    FROM 
      Applicant a
    JOIN 
      Education_History eh ON a.Applicant_ID = eh.Applicant_ID
    JOIN 
      job_application ap ON a.Applicant_ID = ap.Applicant_ID
    WHERE 
      (eh.Education_Subjects LIKE '%Computer Science%' OR eh.Education_Subjects LIKE '%Information Technology%')
      AND ap.Date_of_Application = (SELECT MAX(ap2.Date_of_Application) 
                                    FROM job_application ap2 
                                    WHERE ap2.Applicant_ID = a.Applicant_ID);
  `;

  con.query(sql, (err, result) => {
    if (err) {
      console.error("Error executing query:", err);
      return res.status(500).json({ status: "Error", error: "Failed to fetch applicants with specialized training" });
    }
    console.log("Fetched applicants with specialized training successfully:", result);
    return res.json({ status: "Success", applicants: result });
  });
});

// Router for difficult query 3
router.get("/difficult_query_3", (req, res) => {
  console.log('Received GET request at /auth/difficult_query_3');
  const sql = `
    SELECT 
      a.Name AS Applicant_Name,
      ap.Position AS Last_Applied_Position,
      ap.Date_of_Application AS Last_Application_Date,
      r.Reference_Name AS Reference_Name,
      r.Reference_Years_KNown AS Reference_Years_KNown
    FROM 
      Applicant a
    JOIN 
      Reference r ON a.Applicant_ID = r.Applicant_ID
    JOIN 
      job_application ap ON a.Applicant_ID = ap.Applicant_ID
    WHERE 
      r.Reference_Years_KNown > 5
      AND ap.Date_of_Application = (SELECT MAX(ap2.Date_of_Application) 
                                    FROM job_application ap2 
                                    WHERE ap2.Applicant_ID = a.Applicant_ID);
  `;

  con.query(sql, (err, result) => {
    if (err) {
      console.error("Error executing query:", err);
      return res.status(500).json({ status: "Error", error: "Failed to fetch applicants with references" });
    }
    console.log("Fetched applicants with references successfully:", result);
    return res.json({ status: "Success", applicants: result });
  });
});


export { router as adminRouter };
