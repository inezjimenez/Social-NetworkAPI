const {Schema, model} = require('mongoose');
const dateFormat = require('../utils/dataFormat');

const ThoughtSchema = new Schema(
    {
        thoughtText: {
            type: String,
            required: true,
            minLength: 1,
            maxLength: 280
        },
        createdAt: {
            type: Date,
            default: Date.now,
            get: createdAtVal => dataFormat(createdAtVal)
        },
        username: {
            type: String,
            required: true
        },
        reactions: 
        [ReactionSchema],
    },
    {
        toJSON: {
            virtuals: true,
            getters: true
        },
        //prevents virtuals from creating duplicate of _id as `id`
        id: false
    }
);

ThoughtSchema.virtual('ractionCount').get(function() {
    return this.reactions.length;
})

const Thought = model('Thought', ThoughtSchema);

module.exports = Thought;