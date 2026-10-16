/**
 * Spending Personality Analyzer
 * Identifies the user's financial personality archetype from actual monthly spending data.
 */

export const getSpendingPersonality = (summary, transactions = []) => {
  if (!summary || summary.totalExpenses === 0 || !summary.categoryBreakdown || summary.categoryBreakdown.length === 0) {
    return {
      id: 'fresh_starter',
      title: 'The Clean Slate',
      tagline: 'Ready to write your financial story!',
      emoji: '🌱',
      badgeColor: '#81C784',
      badgeBg: 'rgba(129, 199, 132, 0.18)',
      description: 'You haven\'t logged any expenses yet this month. Add your first transactions to reveal your unique spending personality!',
      keyTrait: 'Blank Canvas & Full Potential',
      funFact: 'Starting fresh gives you total control to craft any financial habit you desire.',
      tip: 'Log your morning coffee, grocery trip, or monthly salary to get started!',
      dominantCategory: null,
      dominantPercentage: 0
    };
  }

  const { totalIncome, totalExpenses, categoryBreakdown } = summary;
  const savingsRate = totalIncome > 0 ? ((totalIncome - totalExpenses) / totalIncome) * 100 : 0;

  // Find dominant expense category
  const sortedCategories = [...categoryBreakdown].sort((a, b) => b.total - a.total);
  const topCategory = sortedCategories[0];
  const topCategoryName = topCategory ? topCategory.category : '';
  const topCategoryTotal = topCategory ? topCategory.total : 0;
  const dominantPercentage = totalExpenses > 0 ? Math.round((topCategoryTotal / totalExpenses) * 100) : 0;

  // Calculate lifestyle / social outings spending (Food + Entertainment + Travel)
  const socialCategories = ['Food', 'Entertainment', 'Travel'];
  const socialSpend = categoryBreakdown
    .filter((c) => socialCategories.includes(c.category))
    .reduce((sum, c) => sum + c.total, 0);
  const socialPercentage = Math.round((socialSpend / totalExpenses) * 100);

  // 1. The Careful Saver: Low expenses relative to income (Savings Rate >= 60% or expenses < 40% of income)
  if (totalIncome > 0 && savingsRate >= 60) {
    return {
      id: 'careful_saver',
      title: 'The Careful Saver',
      tagline: 'Master of discipline & diamond hands',
      emoji: '🛡️',
      badgeColor: '#2E7D32',
      badgeBg: 'rgba(129, 199, 132, 0.25)',
      description: `You save an impressive ${Math.round(savingsRate)}% of your income! You prioritize long-term peace of mind and financial security over impulsive urges.`,
      keyTrait: `High Savings Rate (${Math.round(savingsRate)}%)`,
      funFact: 'At this rate, your emergency buffer and future investments grow 3x faster than average!',
      tip: 'Don\'t forget to treat yourself occasionally — smart saving includes celebrating milestones.',
      dominantCategory: topCategoryName,
      dominantPercentage
    };
  }

  // 2. The Foodie: Spends most on Food & Dining
  if (topCategoryName === 'Food' && dominantPercentage >= 25) {
    return {
      id: 'the_foodie',
      title: 'The Foodie',
      tagline: 'Life is too short for boring meals',
      emoji: '🍱',
      badgeColor: '#E65100',
      badgeBg: 'rgba(255, 183, 77, 0.25)',
      description: `Food is your biggest joy and biggest spend (${dominantPercentage}% of your expenses). From cozy coffee dates to artisanal dinners, you flavor life to the fullest.`,
      keyTrait: `Gourmet Heart (${dominantPercentage}% on dining & snacks)`,
      funFact: 'Cooking one favorite comfort meal at home each week could free up ₹2,500 every month for your savings goals!',
      tip: 'Try meal prepping a signature dish on weekends to balance taste and wallet.',
      dominantCategory: topCategoryName,
      dominantPercentage
    };
  }

  // 3. The Social Butterfly: High spend on outings, travel, and entertainment
  if (socialPercentage >= 45 || topCategoryName === 'Entertainment' || topCategoryName === 'Travel') {
    return {
      id: 'social_butterfly',
      title: 'The Social Butterfly',
      tagline: 'Making memories with favorite people',
      emoji: '🦋',
      badgeColor: '#7B1FA2',
      badgeBg: 'rgba(186, 104, 200, 0.22)',
      description: `Outings, trips, and social memories take up ${socialPercentage}% of your budget. You believe money is best spent making unforgettable moments with loved ones.`,
      keyTrait: `Experience Driven (${socialPercentage}% on social life)`,
      funFact: 'Grouping activities with friends (like potlucks or game nights) cuts costs without reducing the fun!',
      tip: 'Set a dedicated "Fun & Hangouts" weekly pocket allowance to keep outings guilt-free.',
      dominantCategory: topCategoryName,
      dominantPercentage
    };
  }

  // 4. The Chic Shopper: Top category is Shopping
  if (topCategoryName === 'Shopping' && dominantPercentage >= 25) {
    return {
      id: 'the_shopper',
      title: 'The Trendsetter',
      tagline: 'A curated aesthetic and keen eye for quality',
      emoji: '🛍️',
      badgeColor: '#C2185B',
      badgeBg: 'rgba(255, 182, 193, 0.35)',
      description: `Shopping represents ${dominantPercentage}% of your spending. You appreciate nice things, personal upgrades, and thoughtful aesthetic picks.`,
      keyTrait: `Style Connoisseur (${dominantPercentage}% on shopping)`,
      funFact: 'Applying the "48-Hour Wishlist Rule" reduces impulse purchases by nearly 35%!',
      tip: 'Add items to a wishlist for 48 hours before checking out to make sure you truly love them.',
      dominantCategory: topCategoryName,
      dominantPercentage
    };
  }

  // 5. The Future Investor: Spends on Education / Career / Growth
  if (topCategoryName === 'Education' || topCategoryName === 'Health') {
    return {
      id: 'the_investor',
      title: 'The Self-Improver',
      tagline: 'Investing in the best asset: yourself',
      emoji: '📚',
      badgeColor: '#0288D1',
      badgeBg: 'rgba(79, 195, 247, 0.25)',
      description: `You allocate generous resources toward wellness, health, and personal learning (${dominantPercentage}%). You view spending as an investment in your future.`,
      keyTrait: `Growth Mindset (${dominantPercentage}% on self-development)`,
      funFact: 'Lifelong learners and wellness-conscious spenders recover their investment manifold through higher energy and skills!',
      tip: 'Track which courses or wellness habits give you the biggest energy boost!',
      dominantCategory: topCategoryName,
      dominantPercentage
    };
  }

  // 6. The Balanced Zen: Default harmoniously balanced spender
  return {
    id: 'balanced_zen',
    title: 'The Balanced Zen',
    tagline: 'Calm, measured, and well-rounded',
    emoji: '⚖️',
    badgeColor: '#5C6BC0',
    badgeBg: 'rgba(142, 124, 195, 0.25)',
    description: `Your spending is evenly distributed across your needs with no single category dominating. You maintain a balanced, sensible relationship with your money.`,
    keyTrait: `Harmonious Distribution (Top category is only ${dominantPercentage}%)`,
    funFact: 'Balanced spenders rarely face end-of-month panic because unexpected surges in one category are absorbed easily.',
    tip: 'Direct a steady automated slice of your balance into your dream savings targets each week!',
    dominantCategory: topCategoryName,
    dominantPercentage
  };
};
