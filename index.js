const http = require('http');
const url = require('url');
const querystring = require('querystring');

// In-memory array to store user data
const users = [];

const server = http.createServer((req, res) => {
    const parsedUrl = url.parse(req.url);
    const parsedQuery = querystring.parse(parsedUrl.query);

    // Registration API endpoint
    if (parsedUrl.pathname === '/register' && req.method === 'POST') {
        let body = '';

        req.on('data', chunk => {
            body += chunk.toString();
        });

        req.on('end', () => {
            const userData = JSON.parse(body);

            // Basic validation
            if (!userData.name || !userData.age || !userData.batch) {
                res.writeHead(400, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ success: false, message: 'Invalid data' }));
            } else {
                // Store user data in the in-memory array
                users.push(userData);

                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ success: true, message: 'Registration successful' }));
            }
        });
    } else if (parsedUrl.pathname === '/users' && req.method === 'GET') {
        // Endpoint to retrieve all registered users
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(users));
    } else {
        // Default response
        res.writeHead(200, { 'Content-Type': 'text/plain' });
        res.end('Hello, this is your Node.js server on AWS EC2!\n');
    }
});

const port = 3000;
server.listen(port, () => {
    console.log(`Server running at http://localhost:${port}/`);
});
