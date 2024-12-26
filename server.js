const express = require('express'); // Import Express framework
const fs = require('fs'); // Import Node.js File System module
const path = require('path'); // Import path module for working with file paths

const app = express(); // Initialize Express app
const PORT = 5002; // Define the port for the server
const folderPath = path.join(__dirname, 'files'); // Define the folder path for storing files

// Ensure the folder exists
if (!fs.existsSync(folderPath)) {
    fs.mkdirSync(folderPath); // Create the folder if it doesn't exist
}

// Endpoint to create a text file
app.post('/create-file', (req, res) => {
    const timestamp = new Date(); // Get the current timestamp
    const fileName = `${timestamp.toISOString().split('T')[0]}-${timestamp.getTime()}.txt`; // Generate filename
    const filePath = path.join(folderPath, fileName); // Full path to the file
    const content = `Timestamp: ${timestamp}`; // Content of the file

    // Write the file to the folder
    fs.writeFile(filePath, content, (err) => {
        if (err) {
            return res.status(500).send({
                message: 'Error creating file',
                error: err.message
            }); // Handle errors
        }
        res.status(201).send({
            message: 'File created successfully',
            fileName
        }); // Respond with success
    });
});

// Endpoint to retrieve all text files
app.get('/list-files', (req, res) => {
    // Read the contents of the folder
    fs.readdir(folderPath, (err, files) => {
        if (err) {
            return res.status(500).send({
                message: 'Error reading directory',
                error: err.message
            }); // Handle errors
        }
        const textFiles = files.filter((file) => file.endsWith('.txt')); // Filter for .txt files
        res.status(200).send({
            message: 'Files retrieved successfully',
            files: textFiles
        }); // Respond with the list of files
    });
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
});
