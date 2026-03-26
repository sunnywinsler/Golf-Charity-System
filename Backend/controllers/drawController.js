import Draw from '../models/Draw.js';
import Score from '../models/Score.js';
import User from '../models/User.js';
import Winner from '../models/Winner.js';

const generateRandomSequence = () => {
  const seq = new Set();
  while (seq.size < 5) {
    seq.add(Math.floor(Math.random() * 45) + 1);
  }
  return Array.from(seq);
};

const generateAlgorithmicSequence = async () => {
  // Query all scores to find the least frequent
  const scores = await Score.find({}, 'value');
  
  if (!scores || scores.length === 0) return generateRandomSequence();

  const frequency = {};
  for (let i = 1; i <= 45; i++) frequency[i] = 0;
  
  scores.forEach(s => {
    if (frequency[s.value] !== undefined) frequency[s.value]++;
  });

  // Sort numbers by frequency ascending
  const sortedNumbers = Object.keys(frequency)
    .map(Number)
    .sort((a, b) => frequency[a] - frequency[b]);

  // Take the 5 least frequent
  return sortedNumbers.slice(0, 5);
};

export const executeDraw = async (req, res) => {
  try {
    const { logic_used = 'random' } = req.body;
    
    // Total Prize Pool calculation (Mocked logic)
    let totalPoolAmount = 1000.00;
    
    // Check for previous rollover
    const lastDraw = await Draw.findOne().sort({ createdAt: -1 });

    let rollover = lastDraw ? lastDraw.jackpot_rollover_amount : 0;
    totalPoolAmount += rollover;

    const winningSequence = logic_used === 'algorithmic' 
      ? await generateAlgorithmicSequence() 
      : generateRandomSequence();

    // Fetch all active users and their scores using aggregation-like approach
    // We will find active users, then find their top 5 scores
    const activeUsers = await User.find({ subscription_status: 'active' }, '_id');

    const winners = {
      '5-match': [],
      '4-match': [],
      '3-match': []
    };

    if (activeUsers.length > 0) {
      for (const user of activeUsers) {
        // Get user's latest 5 scores
        const userScoresList = await Score.find({ user_id: user._id }).sort({ played_at: -1 }).limit(5);
        const userScores = userScoresList.map(s => s.value);
        
        const matchCount = userScores.filter(s => winningSequence.includes(s)).length;

        if (matchCount === 5) winners['5-match'].push(user._id);
        else if (matchCount === 4) winners['4-match'].push(user._id);
        else if (matchCount === 3) winners['3-match'].push(user._id);
      }
    }

    let newRollover = 0;
    const pool5 = totalPoolAmount * 0.40;
    const pool4 = totalPoolAmount * 0.35;
    const pool3 = totalPoolAmount * 0.25;

    let payout5 = 0;
    if (winners['5-match'].length > 0) {
      payout5 = pool5 / winners['5-match'].length;
    } else {
      newRollover = pool5; // Jackpot rolls over!
    }

    const payout4 = winners['4-match'].length > 0 ? (pool4 / winners['4-match'].length) : 0;
    const payout3 = winners['3-match'].length > 0 ? (pool3 / winners['3-match'].length) : 0;

    // Save Draw Record
    const drawRecord = await Draw.create({
      month_year: new Date(),
      status: 'published',
      logic_used,
      total_pool_amount: totalPoolAmount,
      jackpot_rollover_amount: newRollover,
      winning_sequence: winningSequence
    });

    // Save Winner Records
    const winnerInserts = [];
    
    winners['5-match'].forEach(uid => winnerInserts.push({
      draw_id: drawRecord._id, user_id: uid, match_type: '5-match', prize_amount: payout5
    }));
    winners['4-match'].forEach(uid => winnerInserts.push({
      draw_id: drawRecord._id, user_id: uid, match_type: '4-match', prize_amount: payout4
    }));
    winners['3-match'].forEach(uid => winnerInserts.push({
      draw_id: drawRecord._id, user_id: uid, match_type: '3-match', prize_amount: payout3
    }));

    if (winnerInserts.length > 0) {
      await Winner.insertMany(winnerInserts);
    }

    res.json({
      message: 'Draw executed successfully',
      draw_id: drawRecord._id,
      winningSequence,
      jackpotRollover: newRollover,
      winners_count: {
        '5-match': winners['5-match'].length,
        '4-match': winners['4-match'].length,
        '3-match': winners['3-match'].length
      }
    });

  } catch (error) {
    console.error('Execute Draw Error:', error);
    res.status(500).json({ message: 'Internal Server Error executing draw' });
  }
};

export const getDrawHistory = async (req, res) => {
  try {
    const draws = await Draw.find().sort({ createdAt: -1 });
    res.json(draws);
  } catch (error) {
    console.error('getDrawHistory Error:', error);
    res.status(500).json({ message: 'Error fetching draws' });
  }
};
