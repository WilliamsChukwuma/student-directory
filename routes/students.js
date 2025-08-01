// routes/students.js – This file manages the CRUD operations for my student directory

const express = require('express');
const router = express.Router();
const Student = require('../models/Student'); // I'm importing my Mongoose model for students

// This middleware checks if the user is logged in
function isLoggedIn(req, res, next) {
  // If the user is authenticated, I let them continue
  if (req.isAuthenticated()) return next();

  // If not logged in, I redirect them to the login page
  res.redirect('/login');
}

// GET /students – This is a public page that shows a list of all students with optional search
router.get('/', async (req, res) => {
  // I'm checking if there's a search keyword submitted by the user
  const search = req.query.search || '';

  // I'm finding all students whose names match the search keyword (case-insensitive)
  const students = await Student.find({ name: new RegExp(search, 'i') });

  // I'm rendering the list of students and passing it to the view
  res.render('students/list', { students, search });
});

// GET /students/new – This shows the form to add a new student (only for logged-in users)
router.get('/new', isLoggedIn, (req, res) => {
  // I’m rendering a form where the user can add a new student
  res.render('students/new');
});

// POST /students/new – This route handles form submission to create a new student
router.post('/new', isLoggedIn, async (req, res) => {
  try {
    // I'm saving the new student to the database using data from the form
    await Student.create(req.body);

    // After saving, I redirect the user back to the student list
    res.redirect('/students');
  } catch (err) {
    console.error('Error creating student:', err);
    res.redirect('/students/new');
  }
});

// GET /students/:id/edit – This shows a form to edit a student’s info
router.get('/:id/edit', isLoggedIn, async (req, res) => {
  try {
    // I'm fetching the specific student by ID
    const student = await Student.findById(req.params.id);

    // Then I render the edit form, passing in that student’s info
    res.render('students/edit', { student });
  } catch (err) {
    console.error('Error loading edit form:', err);
    res.redirect('/students');
  }
});

// POST /students/:id/edit – This handles the form submission for editing a student
router.post('/:id/edit', isLoggedIn, async (req, res) => {
  try {
    // I'm updating the student’s information in the database
    await Student.findByIdAndUpdate(req.params.id, req.body);

    // After updating, I redirect back to the student list
    res.redirect('/students');
  } catch (err) {
    console.error('Error updating student:', err);
    res.redirect(`/students/${req.params.id}/edit`);
  }
});

// POST /students/:id/delete – This route deletes a student from the database
router.post('/:id/delete', isLoggedIn, async (req, res) => {
  try {
    // I'm deleting the student using their ID
    await Student.findByIdAndDelete(req.params.id);

    // After deleting, I redirect back to the student list
    res.redirect('/students');
  } catch (err) {
    console.error('Error deleting student:', err);
    res.redirect('/students');
  }
});

module.exports = router;
