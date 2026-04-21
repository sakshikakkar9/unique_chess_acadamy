const mongoose = require('mongoose');

const tournamentSchema = new mongoose.Schema({
  title: { type: String, required: true },
  date: { type: Date, required: true },
  location: { type: String, default: "Online/Academy" },
  description: String,
  entryFee: Number,
  status: { type: String, enum: ['Upcoming', 'Ongoing', 'Completed'], default: 'Upcoming' },
  results: { type: String } // You can update this later when the match ends
}, { timestamps: true });

module.exports = mongoose.model('Tournament', tournamentSchema);