const {
  Schema,
  model
} = require('mongoose')

const itemCartSchema = new Schema({
  items: [{
    type: Schema.Types.ObjectId,
    ref: 'Product'
  }],
  totalPrice: Number,
  buyer: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  }
  
}, {
  timestamps: {
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  }
})

module.exports = model('ItemCart', itemCartSchema)