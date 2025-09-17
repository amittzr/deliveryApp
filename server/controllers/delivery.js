// delivery.js

// const fs = require('fs');

// variables
// const dataPath = './server/data/delivery.json';

const Company = require('../models/company');
const Customer = require('../models/customer');
const Package = require('../models/package');
// const { cachedDataVersionTag } = require('v8');
const axios = require('axios');
require('dotenv').config();
const API_KEY = process.env.GEOCODING_API_KEY;

// helper methods
// const readFile = (callback, returnJson = false, filePath = dataPath, encoding = 'utf8') => {
//     fs.readFile(filePath, encoding, (err, data) => {
//         if (err) {
//             console.log(err);
//         }
//         if (!data) data = "{}";
//         callback(returnJson ? JSON.parse(data) : data);
//     });
// };

// const writeFile = (fileData, callback, filePath = dataPath, encoding = 'utf8') => {
//     fs.writeFile(filePath, fileData, encoding, (err) => {
//         if (err) {
//             console.log(err);
//         }
//         callback();
//     });
// };

// module.exports = {
//     // READ all packages for a company
//     read_company_packages: function (req, res) {
//         const companyId = req.params.id;

//         fs.readFile(dataPath, 'utf8', (err, data) => {
//             if (err) {
//                 console.log(err);
//                 return res.sendStatus(500);
//             }

//             const jsonData = !data ? {} : JSON.parse(data);
//             const companyPackages = jsonData[companyId] || [];

//             res.json({ 
//                 companyId: companyId,
//                 packages: companyPackages 
//             });
//         });
//     },

//     // READ all companies with packages
//     read_all_companies: function (req, res) {
//         fs.readFile(dataPath, 'utf8', (err, data) => {
//             if (err) {
//                 console.log(err);
//                 return res.sendStatus(500);
//             }

//             const jsonData = !data ? {} : JSON.parse(data);
//             const companies = Object.keys(jsonData);

//             res.json({ companies: companies });
//         });
//     },

//     // CREATE a new package for a company - Updated to handle both formats
//     create_package: function (req, res) {
//         readFile(data => {
//             const companyId = req.params.id;
//             let packageData = req.body;
//             let packageId = '';
//             let formattedPackageData = {};

//             console.log('Creating package:', {
//                 companyId: companyId,
//                 body: packageData
//             });

//             // Detect if this is the Postman format or the original format
//             if (packageData.id) {
//                 // Postman format - direct package object with id field
//                 packageId = packageData.id;
//                 formattedPackageData = {
//                     [packageId]: packageData
//                 };

//                 // Initialize path array if it doesn't exist
//                 if (!formattedPackageData[packageId].path) {
//                     formattedPackageData[packageId].path = [];

//                     // Add customer address as first point in path if coordinates exist
//                     if (packageData.customer && 
//                         packageData.customer.address && 
//                         packageData.customer.address.lat && 
//                         packageData.customer.address.lon) {

//                         formattedPackageData[packageId].path.push({
//                             lat: packageData.customer.address.lat,
//                             lon: packageData.customer.address.lon
//                         });
//                     }
//                 }
//             } else {
//                 // Original format - from geocodeAndCreatePackage
//                 packageId = packageData.packageId;

//                 // Format for your original structure
//                 formattedPackageData = {
//                     [packageId]: {
//                         id: packageId,
//                         prod_id: packageData.prodId,
//                         name: packageData.packageName,
//                         customer: {
//                             id: packageData.customerId,
//                             name: packageData.customerName,
//                             email: packageData.customerEmail,
//                             address: {
//                                 street: packageData.street,
//                                 number: packageData.streetNumber,
//                                 city: packageData.city,
//                                 lon: packageData.lon || null,
//                                 lat: packageData.lat || null
//                             }
//                         },
//                         start_date: packageData.startDate,
//                         eta: packageData.eta,
//                         status: packageData.status,
//                         path: []
//                     }
//                 };

//                 // If we have coordinates, add them to the path
//                 if (packageData.lat && packageData.lon) {
//                     formattedPackageData[packageId].path.push({
//                         lat: packageData.lat,
//                         lon: packageData.lon
//                     });
//                 }
//             }

//             // Initialize company array if it doesn't exist
//             if (!data[companyId]) {
//                 data[companyId] = [];
//             }

//             // Add the new package
//             data[companyId].push(formattedPackageData);

//             writeFile(JSON.stringify(data, null, 2), () => {
//                 // Return success with the package ID for Postman compatibility
//                 res.status(201).json({ 
//                     message: `New package added to company ${companyId}`,
//                     id: packageId 
//                 });
//             });
//         }, true);
//     },

//     // UPDATE a package
//     update_package: function (req, res) {
//         readFile(data => {
//             const companyId = req.params.companyId;
//             const packageId = req.params.packageId;
//             const packageData = req.body;

//             // Check if company exists
//             if (!data[companyId]) {
//                 return res.status(404).send(`Company ${companyId} not found`);
//             }

//             // Find and update the package
//             let packageFound = false;
//             data[companyId] = data[companyId].map(pkg => {
//                 const pkgKey = Object.keys(pkg)[0];
//                 if (pkgKey === packageId) {
//                     packageFound = true;
//                     return { [packageId]: packageData };
//                 }
//                 return pkg;
//             });

//             if (!packageFound) {
//                 return res.status(404).send(`Package ${packageId} not found in company ${companyId}`);
//             }

//             writeFile(JSON.stringify(data, null, 2), () => {
//                 res.status(200).send(`Package ${packageId} updated for company ${companyId}`);
//             });
//         }, true);
//     },

//     // DELETE a package
//     // delete_package: function (req, res) {
//     //     readFile(data => {
//     //         const companyId = req.params.companyId;
//     //         const packageId = req.params.packageId;

//     //         // Check if company exists
//     //         if (!data[companyId]) {
//     //             return res.status(404).send(`Company ${companyId} not found`);
//     //         }

//     //         // Find and remove the package
//     //         const initialLength = data[companyId].length;
//     //         data[companyId] = data[companyId].filter(pkg => {
//     //             const pkgKey = Object.keys(pkg)[0];
//     //             return pkgKey !== packageId;
//     //         });

//     //         if (data[companyId].length === initialLength) {
//     //             return res.status(404).send(`Package ${packageId} not found in company ${companyId}`);
//     //         }

//     //         writeFile(JSON.stringify(data, null, 2), () => {
//     //             res.status(200).send(`Package ${packageId} removed from company ${companyId}`);
//     //         });
//     //     }, true);
//     // },

//     // ADD a location to a package's path
//     add_location_to_path: function (req, res) {
//         readFile(data => {
//             const companyId = req.params.companyId;
//             const packageId = req.params.packageId;
//             const locationData = req.body;

//             console.log('Adding location to path:', {
//                 companyId: companyId,
//                 packageId: packageId,
//                 body: locationData
//             });

//             // Validate location data
//             if (!locationData.lat || !locationData.lon) {
//                 return res.status(400).json({ error: 'Missing lat and lon coordinates' });
//             }

//             // Check if company exists
//             if (!data[companyId]) {
//                 return res.status(404).json({ error: `Company ${companyId} not found` });
//             }

//             // Find the package
//             let foundPackage = null;
//             let packageIndex = -1;

//             for (let i = 0; i < data[companyId].length; i++) {
//                 const pkg = data[companyId][i];
//                 if (pkg[packageId]) {
//                     foundPackage = pkg;
//                     packageIndex = i;
//                     break;
//                 }
//             }

//             if (!foundPackage) {
//                 return res.status(404).json({ error: `Package ${packageId} not found` });
//             }

//             // Initialize path array if it doesn't exist
//             if (!foundPackage[packageId].path) {
//                 foundPackage[packageId].path = [];
//             }

//             // Check if this location already exists in the path
//             const newLocation = {
//                 lat: locationData.lat,
//                 lon: locationData.lon
//             };

//             const locationExists = foundPackage[packageId].path.some(point => 
//                 point.lat === newLocation.lat && point.lon === newLocation.lon
//             );

//             if (locationExists) {
//                 return res.status(400).json({ error: 'This location already exists in the path' });
//             }

//             // Add the new location to the path
//             foundPackage[packageId].path.push(newLocation);

//             writeFile(JSON.stringify(data, null, 2), () => {
//                 res.status(200).json({ 
//                     message: `Location added to package ${packageId} path`,
//                     path: foundPackage[packageId].path
//                 });
//             });
//         }, true);
//     }
// };

module.exports = {
    //methods for companies
    CreateCompany: async (req, res) => {
        try {
            const company = new Company(req.body);
            // console.log(req.body);
            await company.save();
            res.status(201).json({ id: company._id });
        }
        catch (err) {
            res.status(400).json({ error: err.message });
        }
    },

    getCompanies: async (req, res) => {
        try {
            const companies = await Company.find();
            res.send(companies);
        }
        catch (err) {
            res.status(500).send({ error: err.message });
        }
    },

    // optional - for dispaly company name instead company id in company-page
    get_company_by_id: async (req, res) => {
        try {
            const company = await Company.findById(req.params.id);
            if (!company) {
                res.status(404).send({ error: 'Company not found' });
            }
            res.send(company);
        }
        catch (err) {
            res.send(500).send({ error: err.message });
        }
    },

    //methods for customers
    CreateCustomer: async (req, res) => {
        // try{
        //     const customer = new Customer(req.body);
        //     await customer.save();
        //     res.status(201).send({id: customer._id});
        // }
        // catch(err) {
        //     res.status(400).send({error: err.message});
        // }

        try {
            const { name, email, address } = req.body;

            if (!address || !address.street || !address.number || !address.city) {
                return res.status(400).json({ error: 'Address must include street, number, and city' });
            }

            const fullAddress = `${address.number} ${address.street}, ${address.city}, Israel`;
            const url = `https://eu1.locationiq.com/v1/search.php?key=${API_KEY}&q=${encodeURIComponent(fullAddress)}&format=json`;

            const response = await axios.get(url);

            if (!response.data || response.data.length === 0) {
                return res.status(400).json({ error: 'Could not geocode address' });
            }

            const lat = parseFloat(response.data[0].lat);
            const lon = parseFloat(response.data[0].lon);

            if (isNaN(lat) || isNaN(lon)) {
                return res.status(400).json({ error: 'Invalid coordinates returned' });
            }

            const customer = new Customer({
                name,
                email,
                address: {
                    street: address.street,
                    number: address.number,
                    city: address.city,
                    lon: lon,
                    lat: lat
                }
            });

            await customer.save();
            res.status(201).json(customer);
        } catch (err) {
            console.error(err);
            res.status(500).json({ error: 'Failed to create customer' });
        }
    },

    getCustomers: async (req, res) => {
        try {
            const customers = await Customer.find();
            res.send(customers);
        }
        catch (err) {
            res.status(500).send({ error: err.message });
        }
    },

    get_customer_by_id: async (req, res) => {
        try {
            const customer = await Customer.findById(req.params.id);
            if (!customer) {
                return res.status(404).send({ error: "Customer not found" });
            }
            res.send(customer);
        }
        catch (err) {
            res.status(500).send({ error: err.message });
        }
    },

    //methods for packages
    CreatePackage: async (req, res) => {
        try {
            const data = req.body;
            const companyId = req.params.id;

            const customer = await Customer.findById(data.customer_id);
            if (!customer) return res.status(404).json({ error: 'Customer not found' });

            // שלב 2: בניית כתובת לחיפוש
            const address = `${customer.address.number} ${customer.address.street}, ${customer.address.city}, Israel`;
            const url = `https://eu1.locationiq.com/v1/search.php?key=${API_KEY}&q=${encodeURIComponent(address)}&format=json`;
            const geoRes = await axios.get(url);

            if (!geoRes.data || geoRes.data.length === 0) {
                return res.status(400).json({ error: 'Could not geocode customer address' });
            }

            const lat = parseFloat(geoRes.data[0].lat);
            const lon = parseFloat(geoRes.data[0].lon);

            if (lat < 29.5 || lat > 33.5 || lon < 34.2 || lon > 35.9) {
                return res.status(400).json({ error: 'Customer address appears to be outside Israel' });
            }

            // console.log(data);

            const newPackage = new Package({
                packageId: data.packageId,
                name: data.name,
                prod_id: data.prod_id,
                eta: data.eta,
                start_date: new Date(),
                status: data.status || 'packed',
                buisness_id: data.buisness_id,
                customer_id: data.customer_id,
                path: [{ lat: lat, lon: lon }]
            });

            await newPackage.save();
            res.status(201).send(newPackage);
        }
        catch (err) {
            res.status(400).send({ error: err.message });
        }
    },

    getPackages: async (req, res) => {
        try {
            const packages = await Package.find({ buisness_id: req.params.id }).populate('customer_id').sort({ start_date: -1 });
            // console.log(packages);
            res.status(201).send(packages);
        }
        catch (err) {
            res.status(500).send({ error: err.message });
        }
    },

    get_package_by_id: async (req, res) => {
        try {
            const pack = await Package.findById(req.params.id).populate('customer_id');
            if (!pack) return res.status(404).send({ error: 'Package not found' });
            res.json(pack);
        }
        catch (err) {
            res.status(500).send({ error: err.message });
        }
    },

    AddLocationToPackage: async (req, res) => {
        try {
            const { lat, lon } = req.body;

            const pack = await Package.findById(req.params.id);
            if (!pack) return res.status(404).json({ error: 'Package not found' });

            const exists = pack.path.some(
                point => point.lat === lat && point.lon === lon
            );
            if (exists) {
                return res.status(400).json({ error: 'This location already exists in the path' });
            }

            if (lat < 29.5 || lat > 33.5 || lon < 34.2 || lon > 35.9) {
                console.log('Geocoding error: Coordinates outside Israel', { lat, lon });
                return res.status(400).json({ error: 'Address appears to be outside Israel' });
            }

            pack.path.push({ lat, lon });
            await pack.save();

            res.status(200).json({ message: 'Location added', path: pack.path });
        }
        catch (err) {
            res.status(400).json({ error: err.message });
        }
    },

    // Delete a package
    DeletePackage: async (req, res) => {
        const { companyId, packageId } = req.params;

        try {
            const deletedPackage = await Package.findOneAndDelete({
                _id: packageId,
                buisness_id: companyId
            });

            if (!deletedPackage) {
                return res.status(404).json({ error: 'Package not found' });
            }

            res.status(200).json({ message: 'Package deleted successfully' });
        } catch (err) {
            console.error('Error deleting package:', err);
            res.status(500).json({ error: 'Failed to delete package' });
        }
    }
};