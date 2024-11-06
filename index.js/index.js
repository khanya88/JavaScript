const http = require('http');
const fs = require('fs');
const url = require('url');

const PORT = 3001;
let users = []; // In-memory data store

// Load existing users from a JSON file if it exists
const loadUsers = () => {
    try {
        const data = fs.readFileSync('data.json', 'utf-8');
        users = JSON.parse(data);
    } catch (error) {
        console.error('Could not load users:', error);
    }
};

// Save users to a JSON file
const saveUsers = () => {
    fs.writeFileSync('data.json', JSON.stringify(users, null, 2));
};

// Create the HTTP server
const server = http.createServer((req, res) => {
    const parsedUrl = url.parse(req.url, true);
    const method = req.method;

    // Load existing users at server start
    if (users.length === 0) loadUsers();

    // GET all users
    if (parsedUrl.pathname === '/data' && method === 'GET') {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(users));
        return;
    }

    // POST a new user
    if (parsedUrl.pathname === '/data' && method === 'POST') {
        let body = '';
        req.on('data', chunk => {
            body += chunk.toString();
        });
        req.on('end', () => {
            const newUser = JSON.parse(body);
            newUser.id = users.length + 1; // Assign a new ID
            users.push(newUser);
            saveUsers(); // Save to file
            res.writeHead(201, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify(newUser));
        });
        return;
    }

    // PUT to update an existing user
    if (parsedUrl.pathname.startsWith('/data/') && method === 'PUT') {
        const id = parseInt(parsedUrl.pathname.split('/')[2]);
        const userIndex = users.findIndex(u => u.id === id);
        
        if (userIndex === -1) {
            res.writeHead(404, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ message: 'data not found' }));
            return;
        }

        let body = '';
        req.on('data', chunk => {
            body += chunk.toString();
        });
        req.on('end', () => {
            const updatedUser = JSON.parse(body);
            users[userIndex] = { ...users[userIndex], ...updatedUser }; // Update user data
            saveUsers(); // Save to file
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify(users[userIndex]));
        });
        return;
    }

    // DELETE a user
    if (parsedUrl.pathname.startsWith('/users/') && method === 'DELETE') {
        const id = parseInt(parsedUrl.pathname.split('/')[2]);
        const data =  fs.readFileSync('data.json', 'utf-8'); 
        const index =   JSON.parse(data);
        console.log(index)
        const userIndex = index.findIndex(index => index.id === id);
        
      

        if (userIndex === -1) {
            res.writeHead(404, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ message: 'User not found' }));
            return;
        }

        let DL= index.splice(userIndex, 1); // Remove user from array
        console.log(DL) 
        fs.writeFileSync('data.json', JSON.stringify(index, null, 2))// Save to file
        res.writeHead(204).end();
        return;
    }

    // Handle 404 Not Found
    res.writeHead(404, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ message: 'Not Found' }));
});

// Start the server
server.listen(PORT, () => {
    console.log(`Server running at http://localhost:${3001}/data`);
});
