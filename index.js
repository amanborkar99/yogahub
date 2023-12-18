const http = require('http');
const url = require('url');
const querystring = require('querystring');
const cors = require('cors');
const mysql = require('mysql');

// MySQL database configuration
const dbConfig = {
    host: 'database-1.chye4e4am70d.ap-south-1.rds.amazonaws.com',
    user: 'admin',
    password: 'aman12345',
    database: 'YogaClassDB',
    port: 3306,
};

// Create a MySQL connection pool
const pool = mysql.createPool(dbConfig);

const server = http.createServer((req, res) => {
    const parsedUrl = url.parse(req.url);
    const parsedQuery = querystring.parse(parsedUrl.query);

    cors()(req, res, () => {});

    if (parsedUrl.pathname === '/register' && req.method === 'POST') {
        let body = '';

        req.on('data', chunk => {
            body += chunk.toString();
        });

        req.on('end', () => {
            const userData = JSON.parse(body);

            if (!userData.name || !userData.age || !userData.batch || !userData.month) {
                res.writeHead(400, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ success: false, message: 'Invalid data' }));
            } else {
                // Use the connection pool to execute the query
                pool.getConnection((error, connection) => {
                    if (error) {
                        console.error('MySQL Connection Error:', error);
                        res.writeHead(500, { 'Content-Type': 'application/json' });
                        res.end(JSON.stringify({ success: false, message: 'Internal Server Error' }));
                        return;
                    }

                    // Check if the user already exists based on name, age, month, and batch
                    const checkUserSql =
                        'SELECT * FROM Registrations WHERE Name = ? AND Age = ? AND Month = ? AND Batch = ?';
                    const checkUserValues = [userData.name, userData.age, userData.month, userData.batch];

                    connection.query(checkUserSql, checkUserValues, (checkUserError, existingUser) => {
                        if (checkUserError) {
                            console.error('MySQL Query Error:', checkUserError);
                            res.writeHead(500, { 'Content-Type': 'application/json' });
                            res.end(JSON.stringify({ success: false, message: 'Internal Server Error' }));
                            connection.release();
                            return;
                        }

                        if (existingUser && existingUser.length > 0) {
                            // User already registered for the given month and batch
                            res.writeHead(400, { 'Content-Type': 'application/json' });
                            res.end(JSON.stringify({ success: false, message: 'User already registered for this month and batch' }));
                            connection.release();
                            return;
                        }

                        // Check if the user already exists based on name, age, and month (regardless of batch)
                        const checkUserWithDifferentMonthSql =
                            'SELECT * FROM Registrations WHERE Name = ? AND Age = ? AND Month = ?';
                        const checkUserWithDifferentMonthValues = [userData.name, userData.age, userData.month];

                        connection.query(
                            checkUserWithDifferentMonthSql,
                            checkUserWithDifferentMonthValues,
                            (checkUserWithDifferentMonthError, existingUserWithDifferentMonth) => {
                                if (checkUserWithDifferentMonthError) {
                                    console.error('MySQL Query Error:', checkUserWithDifferentMonthError);
                                    res.writeHead(500, { 'Content-Type': 'application/json' });
                                    res.end(JSON.stringify({ success: false, message: 'Internal Server Error' }));
                                    connection.release();
                                    return;
                                }

                                if (existingUserWithDifferentMonth && existingUserWithDifferentMonth.length > 0) {
                                    // User already registered for a different month, create a new entry
                                    const insertSql =
                                        'INSERT INTO Registrations (Name, Age, Month, Batch) VALUES (?, ?, ?, ?)';
                                    const insertValues = [userData.name, userData.age, userData.month, userData.batch];

                                    connection.query(insertSql, insertValues, (insertError, insertResults) => {
                                        // Release the connection back to the pool
                                        connection.release();

                                        if (insertError) {
                                            console.error('MySQL Query Error:', insertError);
                                            res.writeHead(500, { 'Content-Type': 'application/json' });
                                            res.end(JSON.stringify({ success: false, message: 'Internal Server Error' }));
                                        } else {
                                            res.writeHead(200, { 'Content-Type': 'application/json' });
                                            res.end(JSON.stringify({ success: true, message: 'Registration successful' }));
                                        }
                                    });
                                } else {
                                    // User does not exist for the given month, return an error
                                    res.writeHead(400, { 'Content-Type': 'application/json' });
                                    res.end(JSON.stringify({ success: false, message: 'You can only change batch in the upcoming month' }));
                                    connection.release();
                                    return;
                                }
                            }
                        );
                    });
                });
            }
        });
    } else if (parsedUrl.pathname === '/users' && req.method === 'GET') {
        // Use the connection pool to execute the query
        pool.getConnection((error, connection) => {
            if (error) {
                console.error('MySQL Connection Error:', error);
                res.writeHead(500, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ success: false, message: 'Internal Server Error' }));
                return;
            }

            const sql = 'SELECT * FROM Registrations';

            connection.query(sql, (queryError, results) => {
                // Release the connection back to the pool
                connection.release();

                if (queryError) {
                    console.error('MySQL Query Error:', queryError);
                    res.writeHead(500, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ success: false, message: 'Internal Server Error' }));
                } else {
                    res.writeHead(200, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify(results));
                }
            });
        });
    } else {
        res.writeHead(200, { 'Content-Type': 'text/plain' });
        res.end('Hello, this is your Node.js server on AWS EC2!\n');
    }
});

const port = 3000;
server.listen(port, () => {
    console.log(`Server running at http://localhost:${port}/`);
});
