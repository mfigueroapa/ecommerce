const {
  Schema,
  model
} = require('mongoose')

const commentSchema = new Schema({
  content: String,
  owner: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  post: {
    type: Schema.Types.ObjectId,
    ref: "Post"
  }
}, {
  timestamps: {
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  }
})

module.exports = model('Comment', commentSchema)