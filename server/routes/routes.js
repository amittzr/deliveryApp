// routes.js
const express = require('express');
const router = express.Router();
const delivery = require('../controllers/delivery');
const geocode = require('../controllers/geocode');
// const { validatePackageData, validatePackageDataForUpdate } = require('../validators/packageValidator');

// Original routes
// router.get('/companies', delivery.read_all_companies);
// router.get('/company/:id/packages', delivery.read_company_packages);
// router.post('/company/:id/package', validatePackageData, delivery.create_package);
// router.put('/company/:companyId/package/:packageId', validatePackageDataForUpdate, delivery.update_package);
// router.put('/company/:companyId/package/:packageId/path', delivery.add_location_to_path);
// router.delete('/company/:companyId/package/:packageId', delivery.delete_package);

// Routes for geocoding
router.post('/geocode', geocode.geocodeAddress);
router.post('/geocode-and-create/:companyId', geocode.geocodeAndCreatePackage);

// router.post('/geocode-and-create/:companyId', validatePackageData, geocode.geocodeAndCreatePackage);

// API route to check if package ID exists (for client-side validation)


// router.get('/api/check-package-id/:companyId/:packageId', async (req, res) => {
//     try {
//         const { companyId, packageId } = req.params;
//         const { validatePackageDataDirect } = require('../validators/packageValidator');
        
//         console.log(`📋 Checking package ID "${packageId}" for company ${companyId}`);
        
//         // Create a minimal data object just for the duplicate check
//         const testData = { packageId: packageId };
        
//         // Run validation to check for duplicates
//         const errors = await validatePackageDataDirect(testData, companyId, false);
        
//         // Check if any error mentions package ID already exists
//         const packageIdExists = errors.some(error => 
//             error.includes('already exists') || error.includes('duplicate')
//         );
        
//         res.json({ 
//             exists: packageIdExists,
//             message: packageIdExists ? `Package ID "${packageId}" is already in use.` : 'Package ID is available.'
//         });
        
//     } catch (error) {
//         console.error('Error checking package ID:', error);
//         res.status(500).json({ 
//             error: 'Unable to check package ID',
//             exists: false // Default to false so form isn't blocked
//         });
//     }
// });

// Routes for Postman compatibility


// ===========================
// Postman
// ===========================

router.post('/buisness', delivery.CreateCompany);
router.post('/customers', delivery.CreateCustomer);
router.post('/packages', delivery.CreatePackage);
router.put('/packages/:id/path', delivery.AddLocationToPackage);

router.get('/buisness', delivery.getCompanies);
router.get('/buisness/:id/packages', delivery.getPackages);
router.post('/buisness/:id/packages', delivery.CreatePackage);
// router.put('/buisness/:companyId/packages/:packageId', validatePackageDataForUpdate, delivery.update_package);


// ==============================
// Companies
// ==============================

// create new Company
router.post('/company', delivery.CreateCompany);

// get all companies
router.get('/companies', delivery.getCompanies);

// get specific company by id - optional to display company name in the company page
router.get('/company/:id', delivery.get_company_by_id); 

// ==============================
// Customers
// ==============================

// create new Customer
router.post('/customer', delivery.CreateCustomer);

// get all Customers
router.get('/customers', delivery.getCustomers);

// get specific customer by id
router.get('/customer/:id', delivery.get_customer_by_id);

// ==============================
// Packages
// ==============================

// create new package - attached to company and customer
router.post('/company/:id/package', delivery.CreatePackage);

// get all packages of a company
router.get('/company/:id/packages', delivery.getPackages);

// add location to package path
router.put('/package/:id/path', delivery.AddLocationToPackage);

// get specific package by id
router.get('/package/:id', delivery.get_package_by_id);

// Delete a package by ID (attached to a company)
router.delete('/company/:companyId/package/:packageId', delivery.DeletePackage);




module.exports = router;