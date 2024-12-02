const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3000;

// Middleware
app.use(express.json());

// Path to the JSON file
const usersFilePath = path.join(__dirname, 'users.json');

// Route to add a new user
app.post('/addUser', (req, res) => {
    const { name, age, email } = req.body;

    // Read the existing users from the JSON file
    fs.readFile(usersFilePath, 'utf8', (err, data) => {
        if (err) {
            return res.status(500).json({ message: 'Error reading users file.' });
        }

        let users = JSON.parse(data);

        // Check for unique email
        const emailExists = users.find(user => user.email === email);
        if (emailExists) {
            return res.status(400).json({ message: 'Email already exists.' });
        }

        // Generate new user ID
        const newUserId = users.length ? users[users.length - 1].id + 1 : 1;

        // Create new user object
        const newUser = { id: newUserId, name, age, email };

        // Add new user to the users array
        users.push(newUser);

        // Write the updated users back to the JSON file
        fs.writeFile(usersFilePath, JSON.stringify(users, null, 2), (err) => {
            if (err) {
                return res.status(500).json({ message: 'Error saving user.' });
            }
            res.status(201).json({ message: 'User added successfully.' });
        });
    });
});


// Route to update an existing user by ID
app.patch('/updateUser/:id', (req, res) => {
    const userId = parseInt(req.params.id);
    
    const { name, age, email } = req.body;

    fs.readFile(usersFilePath, 'utf8', (err, data) => {
        if (err) {
            return res.status(500).json({ message: 'Error reading users file.' });
        }

        let users = JSON.parse(data);
        const userIndex = users.findIndex(user => user.id === userId);

        if (userIndex === -1) {
            return res.status(404).json({ message: 'User id not found.' });
        }

        // Update user properties
        if (name) users[userIndex].name = name;
        if (age) users[userIndex].age = age;
        if (email) {
            // Check for unique email if email is being updated
            const emailExists = users.find(user => user.email === email && user.id !== userId);
            if (emailExists) {
                return res.status(400).json({ message: 'Email already exists.' });
            }
            users[userIndex].email = email;
        }

        fs.writeFile(usersFilePath, JSON.stringify(users, null, 2), (err) => {
            if (err) {
                return res.status(500).json({ message: 'Error saving user.' });
            }
            res.status(200).json({ message: 'User updated successfully.' });
        });
    });
});


// Route to Delete a User by ID
app.delete('/deleteUser/:id?', (req, res) => {
    const userId = req.params.id ? parseInt(req.params.id) : parseInt(req.body.id);

    fs.readFile(usersFilePath, 'utf8', (err, data) => {
        if (err) {
            return res.status(500).json({ message: 'Error reading users file.' });
        }

        let users = JSON.parse(data);
        const userIndex = users.findIndex(user => user.id === userId);

        if (userIndex === -1) {
            return res.status(404).json({ message: 'User id not found.' });
        }

        // Remove the user from the array
        users.splice(userIndex, 1);

        // Write the updated users back to the JSON file
        fs.writeFile(usersFilePath, JSON.stringify(users, null, 2), (err) => {
            if (err) {
                return res.status(500).json({ message: 'Error saving user.' });
            }
            res.status(200).json({ message: 'User deleted successfully.' });
        });
    });
});

// Route to Get a user by their name
app.get('/getUserByName', (req, res) => {
    const userName = req.query.name;

    fs.readFile(usersFilePath, 'utf8', (err, data) => {
        if (err) {
            return res.status(500).json({ message: 'Error reading users file.' });
        }

        let users = JSON.parse(data);
        // to get all users with the same name
        const user = users.filter(user => user.name === userName);

        if (user) {
            res.status(200).json(user);
        } else {
            res.status(404).json({ message: 'User name not found.' });
        }
    });
});

// Route to Get User by ID
app.get('/getUserById/:id', (req, res) => {
    const userId = parseInt(req.params.id);

    fs.readFile(usersFilePath, 'utf8', (err, data) => {
        if (err) {
            return res.status(500).json({ message: 'Error reading users file.' });
        }

        let users = JSON.parse(data);
        const user = users.find(user => user.id === userId);

        if (user) {
            res.status(200).json(user);
        } else {
            res.status(404).json({ message: 'User id not found.' });
        }
    });
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});



/*  
Task 2.1: What is the Node.js Event Loop?
The Node.js Event Loop is a core component that enables non-blocking I/O operations. It allows Node.js to perform asynchronous operations despite being single-threaded. The event loop continuously checks for events and executes callbacks for those events once they are completed.

Phases: The event loop operates in phases (Timers, I/O Callbacks, Idle, Poll, Check, and Close Callbacks). Each phase has a specific function and processes a queue of callbacks.
Execution: When an asynchronous operation completes (like a database query), its callback is added to the appropriate phase's queue, which the event loop will execute when it reaches that phase.
Non-blocking: This mechanism allows Node.js to handle multiple operations concurrently without blocking the main thread, making it efficient for I/O-heavy applications.

//////////////////////////////////////////////////////////////////////////
Task 2.2: What is the Role of the V8 Engine?
The V8 Engine is an open-source JavaScript engine developed by Google, used in Node.js to execute JavaScript code. Its main roles include:

Compilation: V8 compiles JavaScript code into native machine code before executing it, which enhances performance significantly.
Garbage Collection: It includes a garbage collector that automatically manages memory by reclaiming memory used by objects that are no longer needed.
ECMAScript Support: V8 provides support for the latest JavaScript features as defined by the ECMAScript standard, ensuring compatibility and performance improvements.

//////////////////////////////////////////////////////////////////////////
Task 2.3: What is the Node.js Thread Pool and How to Set the Thread Pool Size?
The Node.js Thread Pool is a mechanism for handling asynchronous operations that cannot be executed in a non-blocking manner. It is primarily used for I/O-bound tasks, such as file system operations or cryptographic functions.

Default Size: By default, Node.js creates a thread pool with a size of 4 threads.
Configuration: You can change the thread pool size by setting the UV_THREADPOOL_SIZE environment variable before starting your Node.js application


//////////////////////////////////////////////////////////////////////////
Task 2.4: What is the Purpose of the libuv Library in Node.js?
libuv is a multi-platform support library that Node.js uses to handle asynchronous I/O operations. Its key purposes include:

Event Loop: It provides the underlying implementation of the event loop, allowing Node.js to perform non-blocking operations.
File System Operations: libuv abstracts file system operations and other I/O tasks, making them asynchronous.
Cross-Platform Compatibility: It provides a consistent API across different operating systems, allowing Node.js to work seamlessly on Windows, macOS, and Linux.
Thread Pool: It manages the thread pool used for I/O-bound operations, allowing those operations to be offloaded from the main thread.

//////////////////////////////////////////////////////////////////////////
Task 2.5: Explain How Node.js Handles Asynchronous I/O Operations.
Node.js handles asynchronous I/O operations using a combination of the event loop, callbacks, and the libuv library:

Non-Blocking Calls: When an I/O operation (like reading a file or querying a database) is initiated, Node.js does not block the execution of the program. Instead, it sends the request and continues executing other code.
Using Callbacks: Once the I/O operation is complete, the corresponding callback function is invoked. This function is queued in the event loop and executed when the event loop reaches that phase.
Event Loop Management: The event loop constantly checks for completed I/O operations and processes their callbacks in a non-blocking manner, ensuring that the main thread remains free for other operations.
Thread Pool: For operations that require heavy lifting (like file system access), libuv uses a thread pool to execute them in separate threads, allowing the main thread to remain responsive.
*/