const fs = require('fs');
const path = require('path');

// List of files identified as distractions or bloat
const filesToRemove = [
  // Routes
  'backend/src/routes/growth.js',
  'backend/src/routes/gamification.js',
  'backend/src/routes/moonpay.js',
  'backend/src/routes/moonpayWebhook.js',

  // Corresponding services
  'backend/src/services/gamificationService.js',
  'backend/src/services/moonpay.js',
  'backend/src/services/referralService.js',

  // Placeholder for any future client-side bloat
  // 'client/src/components/SocialFeed.jsx',
  // 'client/src/components/Achievements.jsx',
];

/**
 * Removes an array of files, logging the outcome.
 * @param {string[]} files - Array of file paths relative to the project root.
 */
const removeFileBloat = (files) => {
  console.log('🚀 Starting smart cleanup...');

  files.forEach(file => {
    const filePath = path.join(__dirname, file);

    fs.unlink(filePath, (err) => {
      if (err) {
        // It's okay if the file doesn't exist, it might have been deleted already
        if (err.code === 'ENOENT') {
          console.log(`- File not found (already removed): ${file}`);
        } else {
          console.error(`❌ Error deleting file ${file}:`, err);
        }
      } else {
        console.log(`✅ Successfully removed: ${file}`);
      }
    });
  });

  console.log('✨ Cleanup process initiated.');
};

// Run the cleanup
removeFileBloat(filesToRemove);
