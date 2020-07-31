const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
const { check, validationResult } = require('express-validator');

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
      return res.status(400).json({
        msg: 'there is no profile for this user - routes/api/profile.js)',
      });
    }

    res.json(profile);
  } catch (err) {
    res.status(500).send('Server Error - routes/api/profiles.js');
  }
});

//----------------
// @route    POST api/profile
// @desc     Create or update user profile
// @access   Private
router.post(
  '/',
  [
    auth,
    [
      check('status', 'Status is required -routes/api/profile').not().isEmpty(),
      check('skills', 'Skills is required - routes/api/profile')
        .not()
        .isEmpty(),
    ],
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    //----------
    const {
      company,
      location,
      website,
      bio,
      skills,
      status,
      githubusername,
      youtube,
      twitter,
      instagram,
      linkedin,
      facebook,
    } = req.body;

    // Build profile object
    const profileFields = {};
    profileFields.user = req.user.id;
    if (company) profileFields.company = company;
    if (website) profileFields.company = website;
    if (location) profileFields.company = location;
    if (bio) profileFields.company = bio;
    if (status) profileFields.company = status;
    if (githubusername) profileFields.company = githubusername;

    if (skills) {
      profileFields.skills = skills.split(',').map((skills) => skills.trim());
    }

    // Build social object
    profileFields.social = {};
    if (youtube) profileFields.social.youtube = youtube;
    if (twitter) profileFields.social.youtube = twitter;
    if (facebook) profileFields.social.youtube = facebook;
    if (linkedin) profileFields.social.youtube = linkedin;
    if (instagram) profileFields.social.youtube = instagram;

    try {
      let profile = await Profile.findOne({ user: req.user.id });

      if (!profile) {
        //update
        profile = await Profile.findByIdAndUpdate(
          { user: req.user.id },
          { $set: profileFields },
          { new: true }
        );

        return res.json(profile);
      }
    } catch (err) {
      console.error(err.message);
      res.status(500).send('server Error - routes-api-profile.js');
    }

    //--------------
  }
);

module.exports = router;
