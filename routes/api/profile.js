const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');

const Profile = require('../../models/Profile');
const User = require('../../models/User');

// @route   GET api/profile/me
// @desc    get current users profile
// @access  Private
router.get('/me', auth, async (req, res) => {
  try {
    const profile = await (
      await Profile.findOne({ user: req.user.id })
    ).populated('user', ['name', 'avatar']);

    if (!profile) {
      return res
        .status(400)
        .json({ msg: 'there is no profile for this user (api/profile.js)' });
    }

    res.json(profile);
  } catch (err) {
    res.status(500).send('Server Error (api/profiles.js)');
  }
});

module.exports = router;
