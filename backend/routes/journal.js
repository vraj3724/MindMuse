const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const JournalEntry = require('../models/JournalEntry');
const { analyzeText } = require('../services/aiAnalysis');

// Create new journal entry
router.post('/', auth, async (req, res) => {
  try {
    const { title, content } = req.body;

    // Analyze the content
    const analysis = analyzeText(content);

    // Create new journal entry
    const entry = new JournalEntry({
      user: req.user._id,
      title,
      content,
      ...analysis
    });

    await entry.save();

    res.status(201).json(entry);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Get all journal entries for the user
router.get('/', auth, async (req, res) => {
  try {
    const entries = await JournalEntry.find({ user: req.user._id })
      .sort({ createdAt: -1 });

    res.json(entries);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get journal entry by ID
// router.get('/:id', auth, async (req, res) => {
//   try {
//     const entry = await JournalEntry.findOne({
//       _id: req.params.id,
//       user: req.user._id
//     });

//     if (!entry) {
//       return res.status(404).json({ error: 'Entry not found' });
//     }

//     res.json(entry);
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// });

// // Get mood statistics
// router.get('/stats/mood', auth, async (req, res) => {
//   try {
//     const stats = await JournalEntry.aggregate([
//       { $match: { user: req.user._id } },
//       {
//         $group: {
//           _id: '$mood',
//           count: { $sum: 1 }
//         }
//       }
//     ]);

//     res.json(stats);
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// });

// Get full sentiment trend across all entries
router.get('/stats/trend', auth, async (req, res) => {
  try {
    const trend = await JournalEntry.find({ user: req.user._id })
      .sort({ createdAt: 1 })
      .select('mood confidence createdAt');

      console.log("📈 Trend API data:", trend);
    res.json(trend);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


module.exports = router; 