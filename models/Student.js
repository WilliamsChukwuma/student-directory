const mongoose = require('mongoose');

// I'm defining what each student document should look like
const studentSchema = new mongoose.Schema({
  name: String,        // The student’s full name
  email: String,       // The student’s email address
  program: String,     // Their academic program (e.g. Computer Science)
  year: Number         // Their year of study (e.g. 1, 2, 3)
});

module.exports = mongoose.model('Student', studentSchema); // Exporting so I can use it in CRUD routes
