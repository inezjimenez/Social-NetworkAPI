const {User, Thought} = require('../models')

const userController = {
    // Find all users
    getAllUsers(req, res){
        User.find({})
        .populate({
            path: 'friends',
            select: '-__v'
        })
        .select('-__v')
        .sort({ _id: -1 })
        .then(dbUserData => res.json(dbUserData))
        .catch(err => {
            console.log(err);
            res.status(404).json(err);
        })
    },
    // Find one user by Id
    getUserById({params}, res){
        User.findOne({ _id: params.id})
        .populate({
            path: 'friends',
            select: '-__v'
        })
        .populate({
            path: 'thoughts',
            select: '-__v'
        })
        .select('-__v')
        .then(dbUserData => {
            if (!dbUserData) {
                res.status(404).json({ message: 'No user found with this id'});
                return;
            }
            res.json(dbUserData);
        })
        .catch(err => {
            console.log(err);
            res.status(400).json(err);
        })
    },
    //  create a user
    createUser({body}, res) {
        User.create(body)
        .then(dbUserData => res.json(dbUserData))
        .catch(err => res.status(400).json(err));
    },
    // update a user by Id
    updateUser({ params, body}, res){
        User.findOneAndUpdate({_id: params.id}, body, {new: true, runValidators: true})
        .then(dbUserData => {
            if (!dbUserData){
                res.status(404).json({message: 'no user found with is id'});
                return;
            }
            res.json(dbUserData);
        })
        .catch(err => res.status(400).json(err));
    },
    // delete a user
    deleteUser({params}, res){
        User.findByIdAndDelete({ _id: params.id})
        .then(dbUserData => {
            if (!dbUserData) {
                res.status(404).json({ message: ' no user found with this id'});
                return;
            }
            Thought.deleteMany({_id: {$in: dbUserData.thoughts}})
        })
        .then(()=> {
            res.json({message: "user and the user's thoughts have been deleted"})
        })
        .catch(err => res.status(400).json(err));
    },
    // add a friend 
    addFriend({ params }, res) {
    User.findOneAndUpdate(
      { _id: params.userId },
      { $addToSet: { friends: params.friendId } },
      { new: true, runValidators: true }
    )
      .then((dbUserData) => {
        if (!dbUserData) {
          res.status(404).json({ message: "No user with this id" });
          return;
        }
        res.json(dbUserData);
      })
      .catch((err) => res.json(err));
    },
    // delete a friend
    removeFriend({ params }, res) {
    User.findOneAndUpdate(
      { _id: params.userId },
      { $pull: { friends: params.friendId } },
      { new: true }
    )
      .then((dbUserData) => {
        if (!dbUserData) {
        res.status(404).json({ message: "No user found with this id" });
        return;
        }
        res.json(dbUserData);
      })
      .catch(err => res.status(400).json(err));
    },
};


module.exports = userController;