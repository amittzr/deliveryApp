const express = require('express'),
    path = require('path'),
    routers = require('./server/routes/routes.js');
require('./server/db/mongoose');
require('dotenv').config();
const port = process.env.PORT;
const app = express();

// Serve static files
app.use(express.static(path.join(__dirname, 'client')));

// Routes for main pages
app.get('/list', (req, res) => {
    res.sendFile(path.join(__dirname, 'client/html/list.html'));
});

app.get('/list/:companyId', (req, res) => {
    // Send the company packages page
    res.sendFile(path.join(__dirname, 'client/html/company_packages.html'));
});

app.get('/add_package/:companyId', (req, res) => {
    res.sendFile(path.join(__dirname, 'client/html/add_package.html'));
});

app.get('/map-popup.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'client/html/map-popup.html'));
});

// Configure middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/', routers);

// Start the server
const server = app.listen(port, () => {
    console.log('listening on port %s...', server.address().port);
});