const mongoose = require('mongoose');

const visitorSchema = new mongoose.Schema({
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    documentType: { type: String, required: true },
    documentNumber: { type: String, required: true, unique: true },
    birthDate: { type: Date, required: true },
    entries: [{
        entryTime: { type: Date, required: true },
        exitTime: { type: Date }
    }]
});

const Visitor = mongoose.model('Visitor', visitorSchema);

module.exports = Visitor;
