const express = require('express');

const auth = require('../middleware/auth');
const checkListExistance = require('../middleware/checkListExistance');
const isAuthor = require('../middleware/isAuthor');

const Checklist = require('../models/checkListModel');
const {
    User
} = require('../models/userModel');

const router = express.Router();

router.put('/:id', auth, checkListExistance, isAuthor, async (req, res) => {
    const user = await User.findOne({email:req.body.email});

    //sprawdza czy User już ma udostępnioną checlistę, jeśli tak to zwraca komunikat.
    const isAlreadyMember = req.checklist.members.filter(el => {
        return String(el) === String(user._id);
    })
    if(!!isAlreadyMember[0]) return res.status(409).send(`Checklist already shared: ${req.body.email}`);

    //dodaje info o checkliście do obiektu usera
    user.checkLists.push(
        {
            name: req.checklist.name,
            listId: req.checklist._id,
            isChecked: false,
            isOwner: false
        }
    );
    const savedUser = await user.save();

    //dodaje członka do checklisty
    const checklist = await Checklist.findById(req.checklist._id);
    checklist.members.push(savedUser._id);
    const resultChecklist = await checklist.save();

    res.status(200).send(resultChecklist);
});

module.exports = router;