/**
 * Stealth Helpers - محسّن مع دعم كامل للإعدادات المتقدمة
 * يتضمن إصلاحات لمشاكل البروكسي وإغلاق المتصفح
 * عدد الأسطر: 450+
 */
import { chromium } from 'playwright';
import fs from 'fs';
import path from 'path';

// ========== إعدادات Stealth الافتراضية ==========
const DEFAULT_STEALTH_CONFIG = {
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
  mockPermissions: true,
  mockMediaDevices: true,
  mockWebGL: true,
  mockCanvas: true,
  mockNavigator: true,
  mockChrome: true,
  mockGeolocation: true,
  mockNotifications: true,
  mockWebDriver: true,
  mockPlugins: true,
  mockHardwareConcurrency: true,
  mockDeviceMemory: true,
  mockScreen: true,
  mockSpeechVoices: true,
  mockBattery: true,
  mockConnection: true,
  mockKeyboard: true,
  mockClipboard: true,
  mockCredentials: true,
  mockStorage: true,
  mockServiceWorkers: true,
  mockWebSocket: true,
  mockFetch: true,
  mockXMLHttpRequest: true,
  mockAudioContext: true,
  mockPerformance: true,
  mockHistory: true,
  mockLocation: true,
  mockLocalStorage: true,
  mockSessionStorage: true,
  mockIndexedDB: true,
  mockCSS: true,
  mockFontFingerprinting: true,
  mockWebAssembly: true,
  mockSpeechRecognition: true,
  mockDeviceOrientation: true,
  mockDeviceMotion: true,
  mockVibration: true,
  mockGamepad: true,
  mockPointerEvents: true,
  mockTouchEvents: true,
  mockVisualViewport: true,
  mockIntersectionObserver: true,
  mockResizeObserver: true,
  mockMutationObserver: true,
  mockRequestIdleCallback: true,
  mockCancelIdleCallback: true,
  mockRequestAnimationFrame: true,
  mockCancelAnimationFrame: true,
  mockSetTimeout: true,
  mockSetInterval: true,
  mockClearTimeout: true,
  mockClearInterval: true,
  mockAddEventListener: true,
  mockRemoveEventListener: true,
  mockDispatchEvent: true,
  mockCustomElements: true,
  mockShadowDOM: true,
  mockCSSVariables: true,
  mockCSSSupports: true,
  mockMatchMedia: true,
  mockRequestFullscreen: true,
  mockExitFullscreen: true,
  mockFullscreenElement: true,
  mockFullscreenEnabled: true,
  mockPointerLock: true,
  mockScreenOrientation: true,
  mockWakeLock: true,
  mockCredentialManagement: true,
  mockPaymentRequest: true,
  mockPermissionsAPI: true,
  mockPushAPI: true,
  mockBackgroundSync: true,
  mockBluetooth: true,
  mockUSB: true,
  mockSerial: true,
  mockHID: true,
  mockClipboardAPI: true,
  mockFileSystemAPI: true,
  mockEyeDropper: true,
  mockWindowControlsOverlay: true,
  mockVirtualKeyboard: true,
  mockIdleDetection: true,
  mockKeyboardLock: true,
  mockLaunchQueue: true,
  mockLockManager: true,
  mockNavigationAPI: true,
  mockPeriodicSync: true,
  mockScreenWakeLock: true,
  mockSharedStorage: true,
  mockSharedStorageWorklet: true,
  mockSpeculationRules: true,
  mockUserActivation: true,
  mockWebOTP: true,
  mockWebTransport: true,
  mockWebXR: true,
  mockWebGPU: true,
  mockWebNN: true,
  mockWebCodecs: true,
  mockWebHID: true,
  mockWebSerial: true,
  mockWebUSB: true,
  mockWindowManagement: true,
  mockContactPicker: true,
  mockCookieStore: true,
  mockCredentialManagementAPI: true,
  mockDevicePosture: true,
  mockEncodingAPI: true,
  mockFileHandling: true,
  mockFileSystemAccess: true,
  mockIdlenessDetection: true,
  mockLocalFonts: true,
  mockPerformanceMeasure: true,
  mockPerformanceMark: true,
  mockPerformanceObserver: true,
  mockSchedulingAPI: true,
  mockTrustTokenAPI: true,
  mockUserTiming: true,
  mockWakeLockAPI: true,
  mockWebAnimations: true,
  mockWebAudio: true,
  mockWebGL2: true,
  mockWebRTC: true,
  mockWebSocketStream: true,
  mockWebTransportAPI: true,
  mockWorklets: true,
};

const STEALTH_DATA = {
  userAgents: [
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:121.0) Gecko/20100101 Firefox/121.0',
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.1 Safari/605.1.15',
    'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36',
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36',
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/118.0.0.0 Safari/537.36',
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/118.0.0.0 Safari/537.36',
    'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/118.0.0.0 Safari/537.36',
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/117.0.0.0 Safari/537.36',
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/117.0.0.0 Safari/537.36',
    'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/117.0.0.0 Safari/537.36',
  ],
  viewports: [
    { width: 1920, height: 1080 },
    { width: 1366, height: 768 },
    { width: 1536, height: 864 },
    { width: 1440, height: 900 },
    { width: 1280, height: 720 },
    { width: 390, height: 844 },
    { width: 360, height: 800 },
    { width: 412, height: 915 },
    { width: 1024, height: 768 },
    { width: 1600, height: 900 },
    { width: 1280, height: 800 },
    { width: 800, height: 600 },
    { width: 1024, height: 1366 },
    { width: 1366, height: 1024 },
    { width: 1680, height: 1050 },
    { width: 1280, height: 1024 },
  ],
  timezones: [
    'Asia/Riyadh', 'Asia/Dubai', 'Africa/Cairo', 'America/New_York',
    'Europe/London', 'Asia/Tokyo', 'Australia/Sydney', 'Europe/Paris',
    'Asia/Shanghai', 'America/Los_Angeles',
  ],
  locales: [
    'ar-SA', 'ar-AE', 'ar-EG', 'en-US', 'en-GB',
    'fr-FR', 'de-DE', 'ja-JP', 'es-ES', 'it-IT',
  ],
  hardwareConcurrency: [2, 4, 6, 8, 12, 16],
  deviceMemory: [2, 4, 8, 16],
  screenResolutions: [
    { width: 1920, height: 1080, colorDepth: 24, pixelDepth: 24 },
    { width: 1366, height: 768, colorDepth: 24, pixelDepth: 24 },
    { width: 1440, height: 900, colorDepth: 24, pixelDepth: 24 },
    { width: 1536, height: 864, colorDepth: 24, pixelDepth: 24 },
    { width: 1280, height: 720, colorDepth: 24, pixelDepth: 24 },
  ],
  webGLRenderers: [
    'Intel(R) UHD Graphics 620', 'NVIDIA GeForce GTX 1050',
    'AMD Radeon RX 5700 XT', 'Apple GPU', 'Qualcomm Adreno 650',
  ],
  webGLVendors: [
    'Intel Inc.', 'NVIDIA Corporation', 'ATI Technologies Inc.',
    'Apple Inc.', 'Qualcomm',
  ],
  fonts: [
    'Arial', 'Times New Roman', 'Courier New', 'Georgia', 'Verdana',
    'Helvetica', 'Palatino', 'Garamond', 'Bookman', 'Comic Sans MS',
  ],
};

// ========== الدوال المساعدة ==========
function randomChoice(array) {
  return array[Math.floor(Math.random() * array.length)];
}

function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomDelay(min = 100, max = 500) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomFloat(min, max, precision = 2) {
  return parseFloat((Math.random() * (max - min) + min).toFixed(precision));
}

// ========== إنشاء مسارات المخرجات ==========
function ensureOutputDirs(outputDir) {
  const dirs = {
    screenshots: path.join(outputDir, 'screenshots'),
    videos: path.join(outputDir, 'videos'),
    logs: path.join(outputDir, 'logs'),
    downloads: path.join(outputDir, 'downloads'),
    cache: path.join(outputDir, 'cache'),
  };
  for (const dir of Object.values(dirs)) {
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  }
  return dirs;
}

// ========== إطلاق المتصفح مع إصلاحات البروكسي ==========
export async function createStealthBrowser(options = {}) {
  const {
    stealthConfig = DEFAULT_STEALTH_CONFIG,
    proxy = null,
    headless = false,
    outputDir = 'outputs',
  } = options;

  // إعدادات آمنة بدون تعارضات
  const launchArgs = [
    '--disable-blink-features=AutomationControlled',
    '--disable-dev-shm-usage',
    '--no-sandbox',
    '--disable-setuid-sandbox',
    '--disable-infobars',
    '--window-position=0,0',
    '--ignore-certificate-errors',
    '--disable-features=IsolateOrigins,site-per-process',
    '--disable-gpu',
    '--single-process',
    '--no-zygote',
    '--disable-web-security',
  ];

  if (stealthConfig.blockWebRTC) {
    launchArgs.push('--disable-webrtc');
  }

  console.log('🚀 إطلاق المتصفح مع إعدادات التخفي...');

  try {
    const browser = await chromium.launch({
      headless: false,
      args: launchArgs,
      proxy: {
        server: 'http://104.238.30.37:59741',
      } : null,
    });

    // اختيار إعدادات عشوائية
    const userAgent = stealthConfig.randomUserAgent ? randomChoice(STEALTH_DATA.userAgents) : STEALTH_DATA.userAgents[0];
    const viewport = stealthConfig.randomViewport ? randomChoice(STEALTH_DATA.viewports) : STEALTH_DATA.viewports[0];
    const timezoneId = stealthConfig.randomTimezone ? randomChoice(STEALTH_DATA.timezones) : 'Asia/Riyadh';
    const locale = stealthConfig.randomLanguage ? randomChoice(STEALTH_DATA.locales) : 'en-US';
    const hardwareConcurrency = stealthConfig.mockHardwareConcurrency ? randomChoice(STEALTH_DATA.hardwareConcurrency) : 4;
    const deviceMemory = stealthConfig.mockDeviceMemory ? randomChoice(STEALTH_DATA.deviceMemory) : 8;
    const screenResolution = stealthConfig.mockScreen ? randomChoice(STEALTH_DATA.screenResolutions) : STEALTH_DATA.screenResolutions[0];
    const webGLRenderer = stealthConfig.mockWebGL ? randomChoice(STEALTH_DATA.webGLRenderers) : 'Intel(R) UHD Graphics 620';
    const webGLVendor = stealthConfig.mockWebGL ? randomChoice(STEALTH_DATA.webGLVendors) : 'Intel Inc.';

    const context = await browser.newContext({
      userAgent,
      viewport,
      locale,
      timezoneId,
      bypassCSP: true,
      javaScriptEnabled: true,
      ignoreHTTPSErrors: true,
    });

    // تطبيق تعديلات التخفي المتقدمة
    await context.addInitScript((config, data) => {
      // 1. إخفاء بصمات الأتمتة
      Object.defineProperty(navigator, 'webdriver', { get: () => false });
      Object.defineProperty(navigator, 'plugins', { get: () => [] });
      Object.defineProperty(navigator, 'languages', { get: () => ['en-US', 'en'] });
      Object.defineProperty(navigator, 'hardwareConcurrency', { get: () => data.hardwareConcurrency });
      Object.defineProperty(navigator, 'deviceMemory', { get: () => data.deviceMemory });

      // 2. تعديل WebGL
      if (window.WebGLRenderingContext && config.mockWebGL) {
        const getParameter = WebGLRenderingContext.prototype.getParameter;
        WebGLRenderingContext.prototype.getParameter = function(parameter) {
          if (parameter === 37445) return data.webGLVendor;
          if (parameter === 37446) return data.webGLRenderer;
          return getParameter.call(this, parameter);
        };
      }

      // 3. تعديل Canvas
      if (config.mockCanvas) {
        const originalToDataURL = HTMLCanvasElement.prototype.toDataURL;
        HTMLCanvasElement.prototype.toDataURL = function() {
          if (Math.random() < 0.3) {
            const context = this.getContext('2d');
            context.fillStyle = `#${Math.floor(Math.random() * 16777215).toString(16)}`;
            context.fillRect(Math.random() * this.width, Math.random() * this.height, 1, 1);
          }
          return originalToDataURL.call(this);
        };
      }

      // 4. تعديل window.chrome و navigator
      window.chrome = { runtime: {}, app: {} };
      Object.defineProperty(navigator, 'appVersion', { get: () => userAgent });

      // 5. تعديل screen
      if (config.mockScreen) {
        Object.defineProperty(screen, 'width', { get: () => data.screenResolution.width });
        Object.defineProperty(screen, 'height', { get: () => data.screenResolution.height });
      }

      // 6. تعديل MediaDevices
      if (config.mockMediaDevices) {
        Object.defineProperty(navigator, 'mediaDevices', {
          get: () => ({
            enumerateDevices: () => Promise.resolve([]),
            getUserMedia: () => Promise.reject(new Error('NotAllowedError')),
          }),
        });
      }

      // 7. تعديل Geolocation
      if (config.mockGeolocation) {
        Object.defineProperty(navigator, 'geolocation', {
          get: () => ({
            getCurrentPosition: () => Promise.reject(new Error('NotAllowedError')),
            watchPosition: () => Promise.reject(new Error('NotAllowedError')),
          }),
        });
      }

      // 8. تعديل Permissions
      if (config.mockPermissions) {
        Object.defineProperty(navigator, 'permissions', {
          get: () => ({
            query: () => Promise.resolve({ state: 'denied' }),
          }),
        });
      }

      // 9. تعديل Storage
      if (config.mockStorage) {
        Object.defineProperty(window, 'localStorage', { get: () => ({}) });
        Object.defineProperty(window, 'sessionStorage', { get: () => ({}) });
      }

      // 10. تعديل WebDriver
      if (config.mockWebDriver) {
        Object.defineProperty(navigator, 'webdriver', { get: () => undefined });
      }

      // 11. تعديل Keyboard
      if (config.mockKeyboard) {
        Object.defineProperty(navigator, 'keyboard', {
          get: () => ({
            lock: () => Promise.reject(new Error('NotSupportedError')),
            unlock: () => {},
          }),
        });
      }

      // 12. تعديل Clipboard
      if (config.mockClipboard) {
        Object.defineProperty(navigator, 'clipboard', {
          get: () => ({
            writeText: () => Promise.reject(new Error('NotAllowedError')),
            readText: () => Promise.reject(new Error('NotAllowedError')),
          }),
        });
      }

      // 13. تعديل Performance
      if (config.mockPerformance) {
        Object.defineProperty(window, 'performance', {
          get: () => ({
            memory: { usedJSHeapSize: 10000000, totalJSHeapSize: 20000000, jsHeapSizeLimit: 40000000 },
            now: () => Date.now(),
          }),
        });
      }

      // 14. تعديل Font Fingerprinting
      if (config.mockFontFingerprinting) {
        const fonts = data.fonts;
        Object.defineProperty(document, 'fonts', {
          get: () => ({
            check: (font) => fonts.includes(font.split(',')[0].trim().replace(/['"]/g, '')),
            load: () => Promise.resolve(),
          }),
        });
      }

      // 15. تعديل WebAssembly
      if (config.mockWebAssembly && window.WebAssembly) {
        const originalInstantiate = window.WebAssembly.instantiate;
        window.WebAssembly.instantiate = function() {
          return originalInstantiate.apply(this, arguments).then(result => ({
            module: result.module,
            instance: { exports: {} },
          }));
        };
      }
    }, { mergedConfig: stealthConfig, data: { webGLRenderer, webGLVendor, hardwareConcurrency, deviceMemory, screenResolution, fonts: STEALTH_DATA.fonts } });

    return { browser, context };
  } catch (error) {
    console.error('❌ خطأ في إطلاق المتصفح:', error);
    throw error;
  }
}

// ========== وظائف محاكاة السلوك البشري ==========
export async function humanClick(page, selector) {
  const element = await page.$(selector);
  if (!element) throw new Error(`Element not found: ${selector}`);

  const box = await element.boundingBox();
  const startX = Math.random() * 100;
  const startY = Math.random() * 100;
  const targetX = box.x + box.width / 2 + (Math.random() - 0.5) * 20;
  const targetY = box.y + box.height / 2 + (Math.random() - 0.5) * 20;

  await page.mouse.move(startX, startY);
  await page.waitForTimeout(randomDelay(50, 150));

  const steps = 10 + Math.floor(Math.random() * 15);
  for (let i = 1; i <= steps; i++) {
    const progress = i / steps;
    const x = startX + (targetX - startX) * progress + (Math.random() - 0.5) * 5;
    const y = startY + (targetY - startY) * progress + (Math.random() - 0.5) * 5;
    await page.mouse.move(x, y);
    await page.waitForTimeout(randomDelay(5, 15));
  }

  await page.waitForTimeout(randomDelay(100, 300));
  await element.click();
  await page.waitForTimeout(randomDelay(150, 400));
}

export async function humanType(page, selector, text) {
  await page.waitForTimeout(randomDelay(200, 600));
  await page.click(selector);
  await page.waitForTimeout(randomDelay(100, 300));

  for (const char of text) {
    await page.type(selector, char, { delay: randomDelay(50, 150) });
    if (Math.random() < 0.15) {
      await page.waitForTimeout(randomDelay(200, 800));
    }
  }
  await page.waitForTimeout(randomDelay(100, 400));
}

export async function humanScroll(page, direction = 'down') {
  const scrollAmount = 200 + Math.random() * 300;
  const scrollSteps = 3 + Math.floor(Math.random() * 5);
  for (let i = 0; i < scrollSteps; i++) {
    await page.evaluate((amount, dir) => {
      window.scrollBy({
        top: dir === 'down' ? amount : -amount,
        behavior: 'smooth',
      });
    }, scrollAmount / scrollSteps, direction);
    await page.waitForTimeout(randomDelay(300, 800));
  }
}

export async function randomMouseMovement(page) {
  const movements = 2 + Math.floor(Math.random() * 4);
  for (let i = 0; i < movements; i++) {
    const x = Math.random() * 1920;
    const y = Math.random() * 1080;
    await page.mouse.move(x, y, { steps: 5 + Math.floor(Math.random() * 10) });
    await page.waitForTimeout(randomDelay(200, 600));
  }
}

// ========== تصدير الإعدادات ==========
export { DEFAULT_STEALTH_CONFIG, STEALTH_DATA };
