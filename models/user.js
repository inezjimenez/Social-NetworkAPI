const {Schema, model} = require('mongoose');

const UserSchema = new Schema({
    username: {
        type: String,
        unique: true,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        match: /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/
    },
    thoughts: [
        { 
            type: Schema.Types.ObjectId,
            ref: 'Thought'
        }
    ],
    friends: [
        { 
            type: Schema.Types.ObjectId,
            ref: 'User'
        }
    ],
},
{
    toJSON: {
      virtuals: true,
    },
    // prevents virtuals from creating duplicate of _id as `id`
    id: false
  }
);

UserSchema.virtual('friendsCount').get(function() {
    return this.friends.length;
});

const User = model('User', UserSchema);

module.exports = User;