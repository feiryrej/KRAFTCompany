import mysql from 'mysql';

const con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "Historiareiss06",
    database: "dbKraft"
});

con.connect(function(err) {
    if (err) {
        console.error("Connection error:", err);
    } else {
        console.log("Connected to the database");

        // Test the connection
        con.query('SELECT 1 + 1 AS solution', (err, results) => {
            if (err) {
                console.error('Database connection test failed:', err);
            } else {
                console.log('Database connection test passed:', results);
            }
        });
    }
});

export default con;
