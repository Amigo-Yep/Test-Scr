/**
 * Stealth Helpers - محسّن مع دعم كامل للإعدادات المتقدمة
 * يستقبل إعدادات التخفي من ملف المهمة ويطبقها بشكل صحيح
 */

import { chromium } from 'playwright';
import fs from 'fs';
import path from 'path';

// ========== إعدادات Stealth الافتراضية ==========

const DEFAULT_STEALTH_CONFIG = {
  // تفعيل الميزات الأساسية
  randomUserAgent: true,
  randomViewport: true,
  hideWebdriver: true,
  randomTimezone: true,
  randomLanguage: true,
  humanClicks: true,
  humanTyping: true,
  randomDelays: true,
  mouseMovement: true,
  scrollBehavior: true,
  blockWebRTC: true,
  maskFingerprint: true,
  rotateProxies: false,
  clearCookies: true
};

const STEALTH_DATA = {
  userAgents: [
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:121.0) Gecko/20100101 Firefox/121.0',
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.1 Safari/605.1.15',
    'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
  ],
  
  viewports: [
    { width: 1920, height: 1080 },
    { width: 1366, height: 768 },
    { width: 1536, height: 864 },
    { width: 1440, height: 900 },
    { width: 1280, height: 720 },
    { width: 1024, height: 768 }
  ],
  
  timezones: [
    'Asia/Riyadh',
    'Asia/Dubai',
    'Africa/Cairo',
    'America/New_York',
    'Europe/London',
    'Asia/Tokyo',
    'Australia/Sydney'
  ],
  
  locales: [
    'ar-SA',
    'ar-AE',
    'ar-EG',
    'en-US',
    'en-GB',
    'fr-FR',
    'de-DE',
    'ja-JP'
  ]
};

// ========== الدوال المساعدة ==========

function randomChoice(array) {
  return array[Math.floor(Math.random() * array.length)];
}

function randomDelay(min = 100, max = 500) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

/**
 * إنشاء مجلدات المخرجات المطلوبة
 */
function ensureOutputDirs(outputDir = 'outputs') {
  const dirs = [
    outputDir,
    path.join(outputDir, 'screenshots'),
    path.join(outputDir, 'videos')
  ];
  
  dirs.forEach(dir => {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
  });
  
  return { output: outputDir, screenshots: path.join(outputDir, 'screenshots'), videos: path.join(outputDir, 'videos') };
}

// ========== إنشاء متصفح Stealth محسّن ==========

/**
 * إنشاء متصفح مع إعدادات التخفي المتقدمة
 * @param {Object} options - الخيارات
 * @param {Object} options.stealthConfig - إعدادات التخفي من AppContext
 * @param {boolean} options.recordVideo - تفعيل تسجيل الفيديو
 * @param {boolean} options.disableWebSecurity - تعطيل أمان الويب للـ Cross-Origin iframes
 * @param {string} options.outputDir - مسار مجلد المخرجات
 * @returns {Object} {browser, context, page, paths}
 */
export async function createStealthBrowser(options = {}) {
  const {
    stealthConfig = DEFAULT_STEALTH_CONFIG,
    recordVideo = false,
    disableWebSecurity = false,
    outputDir = process.env.OUTPUT_DIR || 'outputs'
  } = options;

  // ✅ دمج الإعدادات الافتراضية مع الإعدادات المخصصة
  const mergedConfig = { ...DEFAULT_STEALTH_CONFIG, ...stealthConfig };

  // إنشاء مسارات المخرجات
  const paths = ensureOutputDirs(outputDir);
  console.log(`✅ Output directories ready:`);
  console.log(`   📁 Screenshots: ${paths.screenshots}`);
  console.log(`   📁 Videos: ${paths.videos}`);

  // ========== إعداد Launch Arguments ==========
  const launchArgs = [
    // إزالة علامات الأتمتة (دائماً)
    '--disable-blink-features=AutomationControlled',
    
    // تحسينات الأداء (دائماً)
    '--disable-dev-shm-usage',
    '--no-sandbox',
    '--disable-setuid-sandbox'
  ];

  // حظر WebRTC إذا كان مفعل
  if (mergedConfig.blockWebRTC) {
    launchArgs.push('--disable-webrtc');
    launchArgs.push('--disable-webrtc-hw-encoding');
    console.log('✅ WebRTC blocking enabled');
  }

  // إخفاء GPU fingerprint
  if (mergedConfig.maskFingerprint) {
    launchArgs.push('--disable-gpu');
    launchArgs.push('--disable-software-rasterizer');
  }

  // إضافة خيارات أمان الويب إذا كانت مطلوبة (Cross-Origin iframes)
  if (disableWebSecurity) {
    launchArgs.push('--disable-web-security');
    launchArgs.push('--disable-features=IsolateOrigins,site-per-process');
    launchArgs.push('--disable-site-isolation-trials');
    console.log('⚠️  Web security disabled for Cross-Origin iframe support');
  }

  console.log('🚀 Launching browser with stealth mode...');

  const browser = await chromium.launch({
    headless: true,
    args: launchArgs
  });

  // ========== إعداد Context Options ==========
  const contextOptions = {
    // تفعيل JavaScript (دائماً)
    javaScriptEnabled: true,
    
    // إخفاء CSP (دائماً)
    bypassCSP: true,
    
    // Headers إضافية
    extraHTTPHeaders: {
      'Accept-Language': 'ar-SA,ar;q=0.9,en-US;q=0.8,en;q=0.7',
      'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
      'Accept-Encoding': 'gzip, deflate, br',
      'DNT': '1',
      'Connection': 'keep-alive',
      'Upgrade-Insecure-Requests': '1',
      'User-Control': 'no-transform'
    }
  };

  // ========== تطبيق User Agent عشوائي ==========
  if (mergedConfig.randomUserAgent) {
    contextOptions.userAgent = randomChoice(STEALTH_DATA.userAgents);
    console.log(`✅ Random User-Agent applied`);
  }

  // ========== تطبيق Viewport عشوائي (مهم جداً!) ==========
  if (mergedConfig.randomViewport) {
    const viewport = randomChoice(STEALTH_DATA.viewports);
    contextOptions.viewport = viewport;
    console.log(`✅ Random Viewport applied: ${viewport.width}x${viewport.height}`);
  } else {
    // استخدام viewport افتراضي إذا لم يكن عشوائياً
    contextOptions.viewport = { width: 1920, height: 1080 };
    console.log(`✅ Default Viewport set: 1920x1080`);
  }

  // ========== تطبيق Timezone عشوائي ==========
  if (mergedConfig.randomTimezone) {
    const timezone = randomChoice(STEALTH_DATA.timezones);
    contextOptions.timezoneId = timezone;
    console.log(`✅ Random Timezone applied: ${timezone}`);
  }

  // ========== تطبيق Locale عشوائي ==========
  if (mergedConfig.randomLanguage) {
    const locale = randomChoice(STEALTH_DATA.locales);
    contextOptions.locale = locale;
    console.log(`✅ Random Locale applied: ${locale}`);
  }

  // ========== تفعيل تسجيل الفيديو ==========
  if (recordVideo) {
    contextOptions.recordVideo = { dir: paths.videos };
    console.log(`✅ Video recording enabled: ${paths.videos}`);
  }

  // إنشاء السياق
  const context = await browser.newContext(contextOptions);

  // ========== حقن سكريبتات التخفي ==========
  console.log('💉 Injecting stealth scripts into browser context...');
  
  await context.addInitScript(() => {
    // 1. إخفاء navigator.webdriver
    Object.defineProperty(navigator, 'webdriver', {
      get: () => undefined
    });

    // 2. محاكاة Chrome
    window.navigator.chrome = {
      runtime: {},
      loadTimes: function() {},
      csi: function() {},
      app: {}
    };

    // 3. Plugins واقعية
    Object.defineProperty(navigator, 'plugins', {
      get: () => [
        {
          0: { type: "application/x-google-chrome-pdf" },
          description: "Portable Document Format",
          filename: "internal-pdf-viewer",
          length: 1,
          name: "Chrome PDF Plugin"
        },
        {
          0: { type: "application/pdf" },
          description: "Portable Document Format",
          filename: "internal-pdf-viewer",
          length: 1,
          name: "Chrome PDF Viewer"
        }
      ]
    });

    // 4. Languages واقعية
    Object.defineProperty(navigator, 'languages', {
      get: () => ['ar-SA', 'ar', 'en-US', 'en']
    });

    // 5. Permission API مخصص
    const originalQuery = window.navigator.permissions.query;
    window.navigator.permissions.query = (parameters) => (
      parameters.name === 'notifications' ?
        Promise.resolve({ state: Notification.permission }) :
        originalQuery(parameters)
    );

    // 6. إخفاء automation-specific properties
    delete window.cdc_adoQpoasnfa76pfcZLmcfl_Array;
    delete window.cdc_adoQpoasnfa76pfcZLmcfl_Promise;
    delete window.cdc_adoQpoasnfa76pfcZLmcfl_Symbol;
    
    // 7. إخفاء Playwright
    delete window._playwright;
    delete window.__playwright;
    
    // 8. Screen properties واقعية
    Object.defineProperty(screen, 'availWidth', {
      get: () => screen.width
    });
    Object.defineProperty(screen, 'availHeight', {
      get: () => screen.height - 40
    });

    // 9. حظر WebRTC leaks
    if (window.RTCPeerConnection) {
      window.RTCPeerConnection = function() {
        throw new Error('WebRTC blocked');
      };
    }
    if (window.webkitRTCPeerConnection) {
      window.webkitRTCPeerConnection = function() {
        throw new Error('WebRTC blocked');
      };
    }
  });

  console.log('✅ Stealth scripts injected successfully');

  // إنشاء صفحة
  const page = await context.newPage();

  // إزالة بيانات مخزنة إذا كان مفعل clearCookies
  if (mergedConfig.clearCookies) {
    await context.clearCookies();
    console.log('✅ Cookies and storage cleared');
  }

  return {
    browser,
    context,
    page,
    paths,
    config: mergedConfig
  };
}

// ========== محاكاة السلوك البشري ==========

async function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export async function humanClick(page, selector, options = {}) {
  const element = page.locator(selector);
  const box = await element.boundingBox();
  
  if (!box) {
    console.warn(`⚠️ Element not found for human click: ${selector}`);
    // Fallback إلى click عادي
    await element.click();
    return;
  }
  
  // تحريك الماوس بشكل طبيعي
  const startX = Math.random() * 100;
  const startY = Math.random() * 100;
  const targetX = box.x + box.width / 2 + (Math.random() - 0.5) * 20;
  const targetY = box.y + box.height / 2 + (Math.random() - 0.5) * 20;
  
  // حركة منحنية للماوس
  const steps = 10 + Math.floor(Math.random() * 15);
  await page.mouse.move(startX, startY);
  await sleep(randomDelay(50, 150));
  
  for (let i = 1; i <= steps; i++) {
    const progress = i / steps;
    const x = startX + (targetX - startX) * progress;
    const y = startY + (targetY - startY) * progress;
    await page.mouse.move(x, y);
    await sleep(randomDelay(5, 15));
  }
  
  // تأخير قبل النقر
  await sleep(randomDelay(100, 300));
  
  // النقر
  await element.click();
  
  // تأخير بعد النقر
  await sleep(randomDelay(150, 400));
}

export async function humanType(page, selector, text, options = {}) {
  const delayBeforeType = options.delayBefore || randomDelay(200, 600);
  await sleep(delayBeforeType);
  
  // التركيز على الحقل
  await page.locator(selector).click();
  await sleep(randomDelay(100, 300));
  
  // كتابة حرف بحرف
  for (const char of text) {
    await page.locator(selector).type(char, {
      delay: randomDelay(50, 150)
    });
    
    // أحياناً توقف طبيعي (محاكاة التفكير)
    if (Math.random() < 0.15) {
      await sleep(randomDelay(200, 800));
    }
  }
  
  // تأخير بعد الكتابة
  await sleep(randomDelay(100, 400));
}

export async function humanScroll(page, direction = 'down', options = {}) {
  const scrollAmount = 200 + Math.random() * 300;
  const scrollSteps = 3 + Math.floor(Math.random() * 5);
  
  for (let i = 0; i < scrollSteps; i++) {
    await page.evaluate((amount, dir) => {
      window.scrollBy({
        top: dir === 'down' ? amount : -amount,
        behavior: 'smooth'
      });
    }, scrollAmount / scrollSteps, direction);
    
    await sleep(randomDelay(300, 800));
  }
}

export async function randomMouseMovement(page, options = {}) {
  const movements = 2 + Math.floor(Math.random() * 4);
  
  for (let i = 0; i < movements; i++) {
    const x = Math.random() * 1920;
    const y = Math.random() * 1080;
    await page.mouse.move(x, y, { steps: 5 + Math.floor(Math.random() * 10) });
    await sleep(randomDelay(200, 600));
  }
}

// ========== تصدير الإعدادات ==========
export { DEFAULT_STEALTH_CONFIG, STEALTH_DATA };
