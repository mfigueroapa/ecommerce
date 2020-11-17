const {
  Schema,
  model
} = require('mongoose')

const postSchema = new Schema({
  name: String,
  content: String,
  creator: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  comments: {
    type: [Schema.Types.ObjectId],
    ref: 'Comment'
  },
  imagePath: String,
}, {
  timestamps: {
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  }
})

module.exports = model('Post', postSchema)