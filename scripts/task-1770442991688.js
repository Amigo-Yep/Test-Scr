/**
 * Auto-generated Task Script
 * Task: task-1767313244716
 * ID: task-1770442991688
 * Generated: 2026-02-07T05:45:07.505Z
 */

const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

// Read parameters from environment
const RUN_COUNT = parseInt(process.env.RUN_COUNT || '1', 10) || 1;
const TASK_NAME = process.env.TASK_NAME || 'task-1767313244716';
const TARGET_URL = process.env.TARGET_URL || 'undefined';
const STEALTH_LEVEL = process.env.STEALTH_LEVEL || 'advanced';

const STEALTH_CONFIG = {
  level: STEALTH_LEVEL,
  hideWebdriver: process.env.STEALTH_HIDE_WEBDRIVER === 'true',
  randomUA: process.env.STEALTH_RANDOM_UA === 'true',
  randomViewport: process.env.STEALTH_RANDOM_VIEWPORT === 'true',
  blockWebRTC: process.env.STEALTH_BLOCK_WEBRTC === 'true'
};

const TASK_DATA = {
  name: TASK_NAME,
  type: 'scraping',
  targetUrl: TARGET_URL,
  id: 'task-1770442991688'
};

console.log('\n' + '═'.repeat(60));
console.log('🚀 Task Execution Started');
console.log('═'.repeat(60));
console.log('📋 Task: ' + TASK_DATA.name);
console.log('🔗 URL: ' + TASK_DATA.targetUrl);
console.log('🔢 Run Count: ' + RUN_COUNT);
console.log('🛡️ Stealth Level: ' + STEALTH_LEVEL);
console.log('═'.repeat(60) + '\n');

async function runTask(runNumber) {
  console.log('\n' + '─'.repeat(60));
  console.log('▶️ Run #' + runNumber + ' of ' + RUN_COUNT);
  console.log('─'.repeat(60));
  
  const browser = await chromium.launch({
    headless: true,
    args: [
      '--disable-blink-features=AutomationControlled',
      STEALTH_CONFIG.blockWebRTC ? '--disable-webrtc' : '',
      '--no-sandbox',
      '--disable-dev-shm-usage'
    ].filter(Boolean)
  });

  try {
    const context = await browser.newContext({
      userAgent: STEALTH_CONFIG.randomUA 
        ? 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36' 
        : undefined,
      viewport: STEALTH_CONFIG.randomViewport 
        ? { width: 1920, height: 1080 } 
        : undefined
    });

    if (STEALTH_CONFIG.hideWebdriver) {
      await context.addInitScript(() => {
        Object.defineProperty(navigator, 'webdriver', {
          get: () => undefined
        });
      });
    }

    const page = await context.newPage();

    try {
      console.log('⏳ Navigating to: ' + TARGET_URL);
      await page.goto(TARGET_URL, { waitUntil: 'networkidle' });

      const runDir = path.join('results', 'run_' + runNumber);
      if (!fs.existsSync(runDir)) {
        fs.mkdirSync(runDir, { recursive: true });
      }

      console.log('📸 Taking screenshot...');
      await page.screenshot({
        path: path.join(runDir, 'screenshot.png'),
        fullPage: true
      });

      const resultData = {
        runNumber: runNumber,
        taskName: TASK_DATA.name,
        taskType: TASK_DATA.type,
        taskId: TASK_DATA.id,
        status: 'success',
        timestamp: new Date().toISOString(),
        url: page.url(),
        title: await page.title(),
        stealth: STEALTH_CONFIG
      };

      fs.writeFileSync(
        path.join(runDir, 'results.json'),
        JSON.stringify(resultData, null, 2)
      );

      console.log('✅ Run #' + runNumber + ' completed successfully');
      await context.close();
      return true;

    } catch (pageError) {
      console.error('❌ Error in run #' + runNumber + ':', pageError.message);
      const runDir = path.join('results', 'run_' + runNumber);
      if (!fs.existsSync(runDir)) {
        fs.mkdirSync(runDir, { recursive: true });
      }
      fs.writeFileSync(
        path.join(runDir, 'error.log'),
        pageError.stack
      );
      return false;

    } finally {
      await context.close();
    }

  } finally {
    await browser.close();
  }
}

async function runAll() {
  let successCount = 0;
  let failureCount = 0;

  for (let i = 1; i <= RUN_COUNT; i++) {
    try {
      const success = await runTask(i);
      if (success) {
        successCount++;
      } else {
        failureCount++;
      }

      // Delay between runs
      if (i < RUN_COUNT) {
        console.log('⏳ Waiting 3 seconds before next run...');
        await new Promise(r => setTimeout(r, 3000));
      }

    } catch (error) {
      console.error('❌ Error running task #' + i, error);
      failureCount++;
    }
  }

  console.log('\n' + '═'.repeat(60));
  console.log('📊 Execution Summary');
  console.log('═'.repeat(60));
  console.log('   Total Runs: ' + RUN_COUNT);
  console.log('   ✅ Successful: ' + successCount);
  console.log('   ❌ Failed: ' + failureCount);
  console.log('═'.repeat(60) + '\n');

  if (failureCount > 0) {
    process.exit(1);
  }
}

// Execute
runAll().catch(error => {
  console.error('❌ Fatal Error:', error);
  process.exit(1);
});
