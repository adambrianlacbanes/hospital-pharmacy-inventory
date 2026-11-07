const mongoose = require('mongoose');
const { Schema } = mongoose;

const User = mongoose.model('User', new Schema({
  fullName: { type: String, required: true, trim: true },
  username: { type: String, required: true, unique: true, lowercase: true, trim: true },
  passwordHash: { type: String, required: true },
  role: { type: String, enum: ['admin', 'pharmacist', 'staff'], default: 'staff' },
  active: { type: Boolean, default: true },
  securityQuestion: { type: String, default: '' },
  securityAnswerHash: { type: String, default: '' }
}, { timestamps: true }));

const Category = mongoose.model('Category', new Schema({
  name: { type: String, required: true, unique: true, trim: true },
  kind: { type: String, enum: ['medicine', 'supply', 'both'], default: 'both' },
  description: { type: String, default: '' }
}, { timestamps: true }));

const Supplier = mongoose.model('Supplier', new Schema({
  name: { type: String, required: true, unique: true, trim: true },
  contactPerson: { type: String, default: '' },
  phone: { type: String, default: '' },
  email: { type: String, default: '' },
  address: { type: String, default: '' }
}, { timestamps: true }));

// One collection for both medicines and medical supplies (kind decides which)
const Item = mongoose.model('Item', new Schema({
  code: { type: String, required: true, unique: true, uppercase: true, trim: true },
  name: { type: String, required: true, trim: true },
  kind: { type: String, enum: ['medicine', 'supply'], required: true },
  genericName: { type: String, default: '' },
  strength: { type: String, default: '' },
  dosageForm: { type: String, default: '' },
  category: { type: String, default: '' },
  unit: { type: String, default: 'pcs' },
  reorderLevel: { type: Number, default: 0, min: 0 }
}, { timestamps: true }));

const Batch = mongoose.model('Batch', new Schema({
  item: { type: Schema.Types.ObjectId, ref: 'Item', required: true, index: true },
  batchNo: { type: String, required: true, trim: true },
  expiryDate: { type: Date, default: null },
  quantity: { type: Number, default: 0, min: 0 },
  supplier: { type: Schema.Types.ObjectId, ref: 'Supplier', default: null },
  receivedDate: { type: Date, default: Date.now }
}, { timestamps: true }));

const Transaction = mongoose.model('Transaction', new Schema({
  type: { type: String, enum: ['in', 'out', 'adjust'], required: true },
  item: { type: Schema.Types.ObjectId, ref: 'Item', required: true, index: true },
  itemCode: String,
  itemName: String,
  batch: { type: Schema.Types.ObjectId, ref: 'Batch' },
  batchNo: String,
  quantity: { type: Number, required: true },   // absolute amount
  change: { type: Number, required: true },     // signed effect on stock
  date: { type: Date, default: Date.now, index: true },
  reference: { type: String, default: '' },
  reason: { type: String, default: '' },
  supplierName: { type: String, default: '' },
  user: { type: Schema.Types.ObjectId, ref: 'User' },
  userName: String
}, { timestamps: true }));

module.exports = { User, Category, Supplier, Item, Batch, Transaction };
