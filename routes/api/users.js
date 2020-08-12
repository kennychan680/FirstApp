const express = require('express');
const router = express.Router();
const gravatar = require('gravatar');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('config');
const { check, validationResult } = require('express-validator');
const User = require('../../models/User');

// @route   POST api/users
// @desc    Register user
// @access  Public
router.post(
  '/',
  [
    check('name', 'Name is required').not().isEmpty(),
    check('email', 'Please include a valid email').isEmail(),
    check(
      'password',
      'please enter a password with 6 or more character'
    ).isLength({ min: 6 }),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, email, password } = req.body;

    try {
      // see if user exists
      let user = await User.findOne({ email });
      console.log('inside Try api/user.js');
      if (user) {
        return res
          .status(400)
          .json({ errors: [{ msg: 'User already exists (api/users.js)' }] });
      }

      // get users gravatar

      const avatar = gravatar.url(email, {
        s: '200',
        r: 'pg',
        d: 'mm',
      });

      user = new User({ name, email, avatar, password });

      // Encrypt password

      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(password, salt);
      await user.save();

      // Retrun jsonwebtoken
      const payload = {
        user: {
          id: user.id,
        },
      };

      // sign the token
      // set longer expired in Testing
      // if no error, send back token to client
      jwt.sign(
        payload,
        config.get('jwtSecret'),
        { expiresIn: 360000 },
        (err, token) => {
          if (err) throw err;
          res.json({ token });
        }
      );
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server error - (api/user.js)');
    }
  }
);

module.exports = router;
