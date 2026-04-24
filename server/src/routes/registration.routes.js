const express = require('express');
const router = express.Router();
const registrationController = require('../controllers/registrationController');
const { verifyAdmin } = require('../middleware/auth.middleware');

// ------------------------------------------------------
// PUBLIC ROUTES (For Students)
// ------------------------------------------------------

/**
 * @route   POST /api/registrations/register
 * @desc    Full course enrollment (Join Now)
 */
router.post('/register', registrationController.createRegistration);

/**
 * @route   POST /api/registrations/demo
 * @desc    Free Demo class signup
 */
router.post('/demo', registrationController.createDemoRegistration);


// ------------------------------------------------------
// ADMIN ROUTES (Protected)
// ------------------------------------------------------

/**
 * @route   GET /api/registrations/admin/list
 * @desc    Get all full course enrollments
 */
router.get('/admin/list', verifyAdmin, registrationController.getAllRegistrations);

/**
 * @route   GET /api/registrations/admin/demos
 * @desc    Get all free demo requests for the dashboard
 */
router.get('/admin/demos', verifyAdmin, registrationController.getAllDemoRegistrations);

/**
 * @route   PATCH /api/registrations/admin/demo/:id
 * @desc    Update demo status (PENDING -> CONFIRMED)
 */
router.patch('/admin/demo/:id', verifyAdmin, registrationController.updateDemoStatus);

module.exports = router;