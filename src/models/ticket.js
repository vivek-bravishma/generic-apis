import mongoose from "mongoose";

const ticketSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  caseId: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    default: "open",
  },
  assignee: {
    type: String,
    default: null,
  },
  reporter: {
    type: String,
    required: true,
  },
  priority: {
    type: String,
    default: "low",
  },
  dueDate: {
    type: Date,
    default: null,
  },
  isDeleted: {
    type: Boolean,
    default: false,
  },
});

const Ticket = mongoose.model("Ticket", ticketSchema);

export default Ticket;
