// ملف مساعد لإعدادات التخفي - stealth-helpers.js
import { chromium } from 'playwright';

const STEALTH_CONFIG = {
  "level": "advanced",
  "randomUserAgent": true,
  "randomViewport": true,
  "hideWebdriver": true,
  "randomTimezone": true,
  "randomLanguage": false,
  "humanClicks": true,
  "humanTyping": true,
  "randomDelays": true,
  "mouseMovement": true,
  "scrollBehavior": true,
  "blockWebRTC": true,
  "maskFingerprint": true,
  "rotateProxies": false,
  "clearCookies": true
};

export async function createStealthBrowser(options = {}) {
  const { recordVideo = false, disableWebSecurity = false } = options;

  const launchArgs = [
    '--disable-blink-features=AutomationControlled',
    '--disable-dev-shm-usage',
    '--no-sandbox',
    '--disable-webrtc',
    '--disable-features=site-per-process',
    '--disable-setuid-sandbox'
  ];

  // إضافة خيارات أمان الويب إذا كانت مطلوبة (Cross-Origin)
  if (disableWebSecurity) {
    launchArgs.push('--disable-web-security');
    launchArgs.push('--disable-features=IsolateOrigins,site-per-process');
    launchArgs.push('--disable-site-isolation-trials');
    console.log('🌍 تم تفعيل وضع Cross-Origin: يتم تعطيل قيود الأمان');
  }

  const browser = await chromium.launch({
    headless: true,
    args: launchArgs
  });

  // إعداد خيارات السياق
  const contextOptions = {
    userAgent: getRandomUserAgent(),
    viewport: getRandomViewport(),
    timezoneId: getRandomTimezone(),
    
    permissions: []
  };

  // إضافة تسجيل الفيديو إذا كان مفعلاً
  if (recordVideo) {
    contextOptions.recordVideo = { dir: 'videos' };
  }

  const context = await browser.newContext(contextOptions);

  await context.addInitScript(() => {
    // إخفاء webdriver
    Object.defineProperty(navigator, 'webdriver', {
      get: () => undefined
    });
    
    // إضافة chrome object
    window.navigator.chrome = { 
      runtime: {},
      loadTimes: function() {},
      csi: function() {}
    };
    
    // تعديل plugins
    Object.defineProperty(navigator, 'plugins', {
      get: () => [1, 2, 3, 4, 5]
    });
    
    // تعديل languages
    Object.defineProperty(navigator, 'languages', {
      get: () => ['ar', 'en-US', 'en']
    });
  });

  await context.addInitScript(() => {
    // حظر WebRTC leaks
    const originalRTCPeerConnection = window.RTCPeerConnection;
    window.RTCPeerConnection = function(...args) {
      console.log('WebRTC blocked by stealth mode');
      return null;
    };
  });

  const page = await context.newPage();
  
  return { browser, context, page };
}

function getRandomUserAgent() {
  const agents = [
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36',
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
  ];
  return agents[Math.floor(Math.random() * agents.length)];
}

function getRandomViewport() {
  const viewports = [
    { width: 1920, height: 1080 },
    { width: 1366, height: 768 },
    { width: 1536, height: 864 },
    { width: 1440, height: 900 }
  ];
  return viewports[Math.floor(Math.random() * viewports.length)];
}

function getRandomTimezone() {
  const timezones = ['Asia/Riyadh', 'Asia/Dubai', 'Africa/Cairo', 'Europe/London'];
  return timezones[Math.floor(Math.random() * timezones.length)];
}

function getRandomLanguage() {
  const languages = ['ar-SA', 'ar-AE', 'ar-EG', 'en-US'];
  return languages[Math.floor(Math.random() * languages.length)];
}

export async function humanClick(page, selector) {
  // نقرة بشرية مع تأخير عشوائي
  await page.waitForTimeout(200 + Math.random() * 300);
  
  // تحريك الماوس إلى العنصر أولاً
  const element = await page.locator(selector);
  const box = await element.boundingBox();
  if (box) {
    await page.mouse.move(
      box.x + box.width / 2 + (Math.random() - 0.5) * 10,
      box.y + box.height / 2 + (Math.random() - 0.5) * 10
    );
    await page.waitForTimeout(100 + Math.random() * 200);
  }
  
  await page.click(selector);
  await page.waitForTimeout(100 + Math.random() * 200);
}

export async function humanType(page, selector, text) {
  // كتابة بشرية مع تأخير عشوائي بين الأحرف
  await page.waitForTimeout(300 + Math.random() * 500);
  
  await page.click(selector);
  await page.waitForTimeout(200);
  
  for (const char of text) {
    await page.type(selector, char, {
      delay: 50 + Math.random() * 150
    });
    
    // توقف عشوائي أثناء الكتابة (محاكاة التفكير)
    if (Math.random() < 0.1) {
      await page.waitForTimeout(300 + Math.random() * 700);
    }
  }
  
  await page.waitForTimeout(200 + Math.random() * 400);
}

export async function humanScroll(page) {
  // تمرير بشري للصفحة
  const scrollSteps = 3 + Math.floor(Math.random() * 4);
  
  for (let i = 0; i < scrollSteps; i++) {
    await page.evaluate(() => {
      window.scrollBy({
        top: 200 + Math.random() * 400,
        behavior: 'smooth'
      });
    });
    await page.waitForTimeout(500 + Math.random() * 1000);
  }
  
  // العودة للأعلى
  await page.evaluate(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
  await page.waitForTimeout(500);
}

// تصدير الإعدادات
export const stealthConfig = STEALTH_CONFIG;
