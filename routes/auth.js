const express = require('express')
const User = require('../modules/User');
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const router = express.Router();
const jwt = require('jsonwebtoken');
const fetchuser = require('../midware/fetchuser')

const jwt_secure_key = "i_a_transfer_of_energy"

//route=1  http://localhost:7000/api/auth/signup
router.post("/signup", [
    body('email', "Email is alrady register").isEmail(),
    body('name', "valid name").isLength({ min: 3 }),
    body('password', "password must be grater than 5 character").isLength({ min: 5 }),
], async (req, res) => {
    const errors = validationResult(req);
    let success=false;
    try{
    if (!errors.isEmpty()) {
        return res.status(400).json({ success:success,errors: errors.array() })
    }
    let user = await User.findOne({email: req.body.email });
    if (user) {
        return res.status(400).json({success:success, error:"Already user exit"});
    }
    //hash the password
    var salt = await bcrypt.genSaltSync(10);
    var passd = await bcrypt.hashSync(req.body.password, salt);
    
    await User.create({
        name: req.body.name,
        password: passd,
        email: req.body.email
    })
    //tokengenerater by using  jwt
    user = await User.findOne({ email: req.body.email });
    let data = { user: { id: user.id } };
    const token = jwt.sign(data, jwt_secure_key);
    success=true;
    res.json({success:success, token: token })
}
catch(error){
    return res.status(404).json({success:success, error:"error"});
}
})
// route=2login http://localhost:7000/api/auth/login
router.post('/login', [
    body('email', "enter wrong Email").isEmail(),
    body('password', 'password is empty').exists()
], async (req, res) => {
    const error = validationResult(req);
    let success=false;
    if (!error.isEmpty()) {
        return res.status(400).json({ success:success,erroe: error.array() })
    }
    const { email, password } = req.body;
    let user = await User.findOne({ email });
    try {
        if (!user) {
            return res.status(400).json({success:success, error: "bad credincal" });
        }
        let passcheck =await bcrypt.compare(password, user.password);
        if (!passcheck) {
            return res.json({success:success, error: "invalid  credantil" })
        }
    }
    catch (error) {
        return res.status(400).json({ error: error })
    }
    let data = { user: { id: user.id } };
    const token =await jwt.sign(data, jwt_secure_key);
    success=true;
    res.json({success:success, token: token })

})
// route=3 userdetail http://localhost:7000/api/auth/userdetail login require.
router.post('/userdetail', fetchuser, async (req, res) => {
    try {
        const us_id = req.user.id;
        let user = await User.findById(us_id).select('-password');
        if(!user){
            res.status(400).json({error:"not found"})
        }
        res.json(user);
    }
    catch (error) {
        res.status(400).json({ error: error });
    }
})
module.exports = router;