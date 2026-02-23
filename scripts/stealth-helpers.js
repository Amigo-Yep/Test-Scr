/**
 * Stealth Browser Helper - نسخة مقواة مع إصلاح جميع نقاط الضعف
 * يتضمن تحسينات متقدمة لتجنب الكشف من قبل reCAPTCHA وBot Detection
 * عدد الأسطر: 520+
 */
import { chromium } from 'playwright';
import fs from 'fs';
import path from 'path';

// ========== إعدادات Stealth المتقدمة ==========
const DEFAULT_STEALTH_CONFIG = {
  // إعدادات أساسية
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

  // إعدادات أمنية
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

  // إعدادات إضافية جديدة
  mockConsole: true,
  mockErrorHandling: true,
  mockWebVitals: true,
  mockMemoryAPI: true,
  mockScheduler: true,
  mockURLAPI: true,
  mockDOMRect: true,
  mockRange: true,
  mockSelection: true,
  mockCustomElementsRegistry: true,
  mockPerformanceTimeline: true,
  mockResourceTiming: true,
  mockUserTiming: true,
  mockNavigationTiming: true,
  mockPaintTiming: true,
  mockLongTasks: true,
  mockDeviceMemoryAPI: true,
  mockNetworkInformation: true,
  mockCredentialManagement: true,
  mockPaymentRequest: true,
  mockPermissions: true,
  mockPushManager: true,
  mockCacheStorage: true,
  mockServiceWorker: true,
  mockWorkers: true,
  mockBroadcastChannel: true,
  mockMessageChannel: true,
  mockMessagePort: true,
  mockPerformanceEntry: true,
  mockPerformanceMark: true,
  mockPerformanceMeasure: true,
  mockPerformanceObserver: true,
  mockPerformanceResourceTiming: true,
  mockPerformanceServerTiming: true,
  mockPerformanceNavigationTiming: true,
  mockPerformancePaintTiming: true,
  mockPerformanceElementTiming: true,
  mockPerformanceEventTiming: true,
  mockPerformanceLongTaskTiming: true
};

// ========== بيانات التخفي ==========
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
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/116.0.0.0 Safari/537.36',
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/116.0.0.0 Safari/537.36'
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
    { width: 1280, height: 1024 }
  ],
  timezones: [
    'Asia/Riyadh', 'Asia/Dubai', 'Africa/Cairo', 'America/New_York',
    'Europe/London', 'Asia/Tokyo', 'Australia/Sydney', 'Europe/Paris',
    'Asia/Shanghai', 'America/Los_Angeles', 'Europe/Berlin', 'Asia/Hong_Kong',
    'America/Chicago', 'Europe/Moscow', 'Asia/Singapore'
  ],
  locales: [
    'ar-SA', 'ar-AE', 'ar-EG', 'en-US', 'en-GB',
    'fr-FR', 'de-DE', 'ja-JP', 'es-ES', 'it-IT',
    'pt-BR', 'ru-RU', 'zh-CN', 'hi-IN', 'bn-BD'
  ],
  hardwareConcurrency: [2, 4, 6, 8, 12, 16],
  deviceMemory: [2, 4, 8, 16],
  screenResolutions: [
    { width: 1920, height: 1080, colorDepth: 24, pixelDepth: 24 },
    { width: 1366, height: 768, colorDepth: 24, pixelDepth: 24 },
    { width: 1440, height: 900, colorDepth: 24, pixelDepth: 24 },
    { width: 1536, height: 864, colorDepth: 24, pixelDepth: 24 },
    { width: 1280, height: 720, colorDepth: 24, pixelDepth: 24 }
  ],
  webGLRenderers: [
    'Intel(R) UHD Graphics 620',
    'NVIDIA GeForce GTX 1050',
    'AMD Radeon RX 5700 XT',
    'Apple GPU',
    'Qualcomm Adreno 650',
    'Mali-G78 MP24',
    'Apple M1',
    'Intel(R) Iris(R) Xe Graphics'
  ],
  webGLVendors: [
    'Intel Inc.',
    'NVIDIA Corporation',
    'ATI Technologies Inc.',
    'Apple Inc.',
    'Qualcomm',
    'ARM',
    'Imagination Technologies'
  ],
  fonts: [
    'Arial', 'Times New Roman', 'Courier New', 'Georgia', 'Verdana',
    'Helvetica', 'Palatino', 'Garamond', 'Bookman', 'Comic Sans MS',
    'Trebuchet MS', 'Arial Black', 'Impact', 'Lucida Console', 'Tahoma'
  ],
  platform: ['Win32', 'MacIntel', 'Linux x86_64'],
  vendor: ['Google Inc.', 'Apple Computer, Inc.'],
  product: ['Gecko', '20100101']
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

function ensureOutputDirs(outputDir) {
  const dirs = {
    screenshots: path.join(outputDir, 'screenshots'),
    videos: path.join(outputDir, 'videos'),
    logs: path.join(outputDir, 'logs'),
    downloads: path.join(outputDir, 'downloads'),
    cache: path.join(outputDir, 'cache')
  };

  for (const dir of Object.values(dirs)) {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
  }

  return dirs;
}

// ========== إطلاق المتصفح مع إصلاحات البروكسي ==========
export async function createStealthBrowser(options = {}) {
  const {
    stealthConfig = DEFAULT_STEALTH_CONFIG,
    proxy = null,
    headless = false,
    outputDir = process.env.OUTPUT_DIR || 'outputs',
    disableWebSecurity = false
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
    '--disable-background-networking',
    '--disable-background-timer-throttling',
    '--disable-backgrounding-occluded-windows',
    '--disable-breakpad',
    '--disable-client-side-phishing-detection',
    '--disable-component-update',
    '--disable-domain-reliability',
    '--disable-features=TranslateUI,BlinkGenPropertyTrees,IsolateOrigins,site-per-process',
    '--disable-hang-monitor',
    '--disable-ipc-flooding-protection',
    '--disable-notifications',
    '--disable-offer-store-unmasked-wallet-cards',
    '--disable-popup-blocking',
    '--disable-print-preview',
    '--disable-prompt-on-repost',
    '--disable-renderer-backgrounding',
    '--disable-speech-api',
    '--disable-voice-input',
    '--disable-wake-on-wifi',
    '--enable-features=NetworkService,NetworkServiceInProcess',
    '--disable-software-rasterizer',
    '--disable-default-apps',
    '--disable-cloud-import',
    '--disable-datasaver-prompt',
    '--disable-extensions',
    '--disable-features=PreloadMediaEngagementData,AutoplayIgnoreWebAudio,MediaEngagement',
    '--disable-back-forward-cache',
    '--disable-save-password-bubble',
    '--disable-session-crashed-bubble',
    '--disable-tab-for-desktop-share-prompt',
    '--force-color-profile=srgb',
    '--use-gl=swiftshader',
    '--disable-accelerated-2d-canvas',
    '--disable-gpu-driver-bug-workarounds',
    '--disable-logging',
    '--log-level=3'
  ];

  if (stealthConfig.blockWebRTC) {
    launchArgs.push('--disable-webrtc');
    launchArgs.push('--disable-webrtc-hw-encoding');
  }

  if (disableWebSecurity) {
    launchArgs.push('--disable-web-security');
    launchArgs.push('--disable-features=IsolateOrigins,site-per-process');
    launchArgs.push('--disable-site-isolation-trials');
  }

  console.log('🚀 إطلاق المتصفح مع إعدادات التخفي المتقدمة...');

  try {
    const browser = await chromium.launch({
      headless,
      args: launchArgs,
      proxy: proxy ? {
        server: proxy.server || 'http://104.238.30.37:59741',
        username: proxy.username,
        password: proxy.password
      } : null,
      timeout: 30000,
      firefoxUserPrefs: {
        'media.peerconnection.enabled': false,
        'media.navigator.enabled': false,
        'media.navigator.permission.disabled': true
      }
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
    const platform = stealthConfig.mockNavigator ? randomChoice(STEALTH_DATA.platform) : 'Win32';
    const vendor = stealthConfig.mockNavigator ? randomChoice(STEALTH_DATA.vendor) : 'Google Inc.';
    const product = stealthConfig.mockNavigator ? randomChoice(STEALTH_DATA.product) : 'Gecko';

    const context = await browser.newContext({
      userAgent,
      viewport,
      locale,
      timezoneId,
      bypassCSP: true,
      javaScriptEnabled: true,
      ignoreHTTPSErrors: true,
      geolocation: stealthConfig.mockGeolocation ? {
        longitude: randomFloat(-180, 180),
        latitude: randomFloat(-90, 90)
      } : undefined,
      permissions: stealthConfig.mockPermissions ? ['geolocation', 'notifications'].reduce((obj, perm) => {
        obj[perm] = 'denied';
        return obj;
      }, {}) : undefined
    });

    // تطبيق تعديلات التخفي المتقدمة
    await context.addInitScript((config, data) => {
      // 1. إخفاء بصمات الأتمتة الأساسية
      Object.defineProperty(navigator, 'webdriver', { get: () => false });
      Object.defineProperty(navigator, 'plugins', { get: () => [] });
      Object.defineProperty(navigator, 'languages', { get: () => ['en-US', 'en'] });
      Object.defineProperty(navigator, 'hardwareConcurrency', { get: () => data.hardwareConcurrency });
      Object.defineProperty(navigator, 'deviceMemory', { get: () => data.deviceMemory });
      Object.defineProperty(navigator, 'maxTouchPoints', { get: () => 0 });
      Object.defineProperty(navigator, 'platform', { get: () => data.platform });
      Object.defineProperty(navigator, 'vendor', { get: () => data.vendor });
      Object.defineProperty(navigator, 'product', { get: () => data.product });

      // 2. تعديل WebGL Fingerprinting
      if (window.WebGLRenderingContext && config.mockWebGL) {
        const getParameter = WebGLRenderingContext.prototype.getParameter;
        WebGLRenderingContext.prototype.getParameter = function(parameter) {
          switch (parameter) {
            case 37445: return data.webGLVendor; // UNMASKED_VENDOR_WEBGL
            case 37446: return data.webGLRenderer; // UNMASKED_RENDERER_WEBGL
            case 37444: return data.vendor; // VENDOR
            case 37447: return `WebGL 2.0 (${data.webGLVendor})`; // RENDERER
            case 37443: return 'WebGL 2.0'; // VERSION
            case 37442: return 'WebGL GLSL ES 3.00'; // SHADING_LANGUAGE_VERSION
            default: return getParameter.call(this, parameter);
          }
        };

        const getExtension = WebGLRenderingContext.prototype.getExtension;
        WebGLRenderingContext.prototype.getExtension = function(name) {
          if (name === 'WEBGL_debug_renderer_info') {
            return {
              UNMASKED_VENDOR_WEBGL: data.webGLVendor,
              UNMASKED_RENDERER_WEBGL: data.webGLRenderer
            };
          }
          return getExtension.call(this, name);
        };
      }

      // 3. تعديل Canvas Fingerprinting
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

        const originalGetImageData = CanvasRenderingContext2D.prototype.getImageData;
        CanvasRenderingContext2D.prototype.getImageData = function() {
          const result = originalGetImageData.apply(this, arguments);
          if (Math.random() < 0.3) {
            for (let i = 0; i < result.data.length; i += 4) {
              result.data[i] = Math.min(255, result.data[i] + (Math.random() < 0.5 ? -1 : 1));
              result.data[i + 1] = Math.min(255, result.data[i + 1] + (Math.random() < 0.5 ? -1 : 1));
              result.data[i + 2] = Math.min(255, result.data[i + 2] + (Math.random() < 0.5 ? -1 : 1));
            }
          }
          return result;
        };
      }

      // 4. تعديل window.chrome و navigator
      window.chrome = {
        runtime: {},
        app: {},
        csi: () => {},
        loadTimes: () => ({
          requestTime: Date.now() / 1000,
          startLoadTime: Date.now() / 1000,
          commitLoadTime: Date.now() / 1000,
          finishDocumentLoadTime: Date.now() / 1000,
          finishLoadTime: Date.now() / 1000
        })
      };

      Object.defineProperty(navigator, 'appVersion', { get: () => data.userAgent });
      Object.defineProperty(navigator, 'userAgent', { get: () => data.userAgent });

      // 5. تعديل screen
      if (config.mockScreen) {
        Object.defineProperty(screen, 'width', { get: () => data.screenResolution.width });
        Object.defineProperty(screen, 'height', { get: () => data.screenResolution.height });
        Object.defineProperty(screen, 'colorDepth', { get: () => data.screenResolution.colorDepth });
        Object.defineProperty(screen, 'pixelDepth', { get: () => data.screenResolution.pixelDepth });
        Object.defineProperty(screen, 'availWidth', { get: () => data.screenResolution.width });
        Object.defineProperty(screen, 'availHeight', { get: () => data.screenResolution.height });
      }

      // 6. تعديل MediaDevices
      if (config.mockMediaDevices) {
        Object.defineProperty(navigator, 'mediaDevices', {
          get: () => ({
            enumerateDevices: () => Promise.resolve([]),
            getUserMedia: () => Promise.reject(new Error('NotAllowedError'))
          })
        });
      }

      // 7. تعديل Geolocation
      if (config.mockGeolocation) {
        Object.defineProperty(navigator, 'geolocation', {
          get: () => ({
            getCurrentPosition: () => Promise.reject(new Error('NotAllowedError')),
            watchPosition: () => Promise.reject(new Error('NotAllowedError'))
          })
        });
      }

      // 8. تعديل Permissions
      if (config.mockPermissions) {
        Object.defineProperty(navigator, 'permissions', {
          get: () => ({
            query: () => Promise.resolve({ state: 'denied' })
          })
        });
      }

      // 9. تعديل Storage
      if (config.mockStorage) {
        const createStorage = () => {
          let store = {};
          return {
            getItem: key => store[key] || null,
            setItem: (key, value) => { store[key] = String(value); },
            removeItem: key => { delete store[key]; },
            clear: () => { store = {}; },
            key: i => Object.keys(store)[i] || null,
            get length() { return Object.keys(store).length; }
          };
        };

        Object.defineProperty(window, 'localStorage', { get: createStorage });
        Object.defineProperty(window, 'sessionStorage', { get: createStorage });
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
            unlock: () => {}
          })
        });
      }

      // 12. تعديل Clipboard
      if (config.mockClipboard) {
        Object.defineProperty(navigator, 'clipboard', {
          get: () => ({
            writeText: () => Promise.reject(new Error('NotAllowedError')),
            readText: () => Promise.reject(new Error('NotAllowedError'))
          })
        });
      }

      // 13. تعديل Performance
      if (config.mockPerformance) {
        Object.defineProperty(window, 'performance', {
          get: () => ({
            memory: {
              usedJSHeapSize: 10000000 + Math.floor(Math.random() * 10000000),
              totalJSHeapSize: 20000000 + Math.floor(Math.random() * 10000000),
              jsHeapSizeLimit: 40000000 + Math.floor(Math.random() * 20000000)
            },
            now: () => Date.now(),
            timeOrigin: Date.now() - Math.floor(Math.random() * 10000),
            timing: {
              navigationStart: Date.now() - Math.floor(Math.random() * 10000),
              unloadStart: Date.now() - Math.floor(Math.random() * 5000),
              unloadEnd: Date.now() - Math.floor(Math.random() * 4000),
              redirectStart: 0,
              redirectEnd: 0,
              fetchStart: Date.now() - Math.floor(Math.random() * 3000),
              domainLookupStart: Date.now() - Math.floor(Math.random() * 2000),
              domainLookupEnd: Date.now() - Math.floor(Math.random() * 1500),
              connectStart: Date.now() - Math.floor(Math.random() * 1000),
              connectEnd: Date.now() - Math.floor(Math.random() * 500),
              secureConnectionStart: Date.now() - Math.floor(Math.random() * 400),
              requestStart: Date.now() - Math.floor(Math.random() * 300),
              responseStart: Date.now() - Math.floor(Math.random() * 200),
              responseEnd: Date.now() - Math.floor(Math.random() * 100),
              domLoading: Date.now() - Math.floor(Math.random() * 500),
              domInteractive: Date.now() - Math.floor(Math.random() * 300),
              domContentLoadedEventStart: Date.now() - Math.floor(Math.random() * 200),
              domContentLoadedEventEnd: Date.now() - Math.floor(Math.random() * 100),
              domComplete: Date.now() - Math.floor(Math.random() * 50),
              loadEventStart: Date.now(),
              loadEventEnd: Date.now()
            },
            navigation: {
              type: 0,
              redirectCount: 0
            },
            getEntries: () => [],
            getEntriesByType: () => [],
            getEntriesByName: () => [],
            clearResourceTimings: () => {},
            setResourceTimingBufferSize: () => {},
            toJSON: () => ({})
          })
        });
      }

      // 14. تعديل Font Fingerprinting
      if (config.mockFontFingerprinting) {
        Object.defineProperty(document, 'fonts', {
          get: () => ({
            check: () => Math.random() > 0.3,
            load: () => Promise.resolve()
          })
        });
      }

      // 15. تعديل WebAssembly
      if (config.mockWebAssembly && window.WebAssembly) {
        const originalInstantiate = window.WebAssembly.instantiate;
        window.WebAssembly.instantiate = function() {
          return originalInstantiate.apply(this, arguments).then(result => ({
            module: result.module,
            instance: { exports: {} }
          }));
        };
      }

      // 16. تعديل Console
      if (config.mockConsole) {
        console.log = () => {};
        console.error = () => {};
        console.warn = () => {};
        console.info = () => {};
        console.debug = () => {};
      }

      // 17. تعديل Error Handling
      if (config.mockErrorHandling) {
        window.onerror = () => true;
        window.addEventListener = new Proxy(window.addEventListener, {
          apply: function(target, thisArg, args) {
            if (args[0] === 'error') return;
            return target.apply(thisArg, args);
          }
        });
      }

      // 18. تعديل WebVitals
      if (config.mockWebVitals) {
        window.WebVitals = { getCLS: () => {}, getFID: () => {}, getFCP: () => {}, getLCP: () => {}, getTTFB: () => {} };
      }

      // 19. تعديل Memory API
      if (config.mockMemoryAPI) {
        Object.defineProperty(window.performance, 'memory', {
          get: () => ({
            usedJSHeapSize: 10000000 + Math.floor(Math.random() * 10000000),
            totalJSHeapSize: 20000000 + Math.floor(Math.random() * 10000000),
            jsHeapSizeLimit: 40000000 + Math.floor(Math.random() * 20000000)
          })
        });
      }

      // 20. تعديل Scheduler
      if (config.mockScheduler) {
        window.scheduler = {
          postTask: () => ({ priority: 'user-blocking' }),
          yield: () => new Promise(resolve => setTimeout(resolve, 0))
        };
      }

      // 21. تعديل URL API
      if (config.mockURLAPI) {
        window.URL.createObjectURL = () => 'blob:http://example.com/' + Math.random().toString(36).substring(2);
        window.URL.revokeObjectURL = () => {};
      }

      // 22. تعديل DOM APIs
      if (config.mockDOMRect) {
        window.DOMRect = class {
          constructor(x = 0, y = 0, width = 0, height = 0) {
            this.x = x;
            this.y = y;
            this.width = width;
            this.height = height;
            this.top = y;
            this.right = x + width;
            this.bottom = y + height;
            this.left = x;
          }
        };

        window.DOMRectReadOnly = window.DOMRect;
      }

      // 23. تعديل Range
      if (config.mockRange) {
        window.Range = class {
          constructor() {
            this.startContainer = document;
            this.startOffset = 0;
            this.endContainer = document;
            this.endOffset = 0;
            this.collapsed = true;
          }
          setStart() {}
          setEnd() {}
          setStartBefore() {}
          setStartAfter() {}
          setEndBefore() {}
          setEndAfter() {}
          selectNode() {}
          selectNodeContents() {}
          collapse() {}
          deleteContents() {}
          extractContents() {}
          cloneContents() {}
          insertNode() {}
          surroundContents() {}
          cloneRange() { return new window.Range(); }
          detach() {}
          isPointInRange() { return false; }
          comparePoint() { return 0; }
          intersectsNode() { return false; }
          compareBoundaryPoints() { return 0; }
          createContextualFragment() { return document.createDocumentFragment(); }
          getBoundingClientRect() { return new DOMRect(); }
          getClientRects() { return []; }
        };
      }

      // 24. تعديل Selection
      if (config.mockSelection) {
        Object.defineProperty(document, 'selection', {
          get: () => ({
            anchorNode: document,
            anchorOffset: 0,
            focusNode: document,
            focusOffset: 0,
            isCollapsed: true,
            rangeCount: 0,
            getRangeAt: () => new window.Range(),
            addRange: () => {},
            removeRange: () => {},
            removeAllRanges: () => {},
            collapse: () => {},
            extend: () => {},
            collapseToStart: () => {},
            collapseToEnd: () => {},
            selectAllChildren: () => {},
            deleteFromDocument: () => {},
            containsNode: () => false,
            toString: () => ''
          })
        });

        Object.defineProperty(window, 'getSelection', {
          get: () => () => document.selection
        });
      }

      // 25. تعديل Custom Elements
      if (config.mockCustomElements) {
        window.customElements = {
          define: () => {},
          get: () => class extends HTMLElement {},
          whenDefined: () => Promise.resolve()
        };
      }
    }, {
      mergedConfig: stealthConfig,
      data: {
        userAgent,
        webGLRenderer,
        webGLVendor,
        hardwareConcurrency,
        deviceMemory,
        screenResolution,
        platform,
        vendor,
        product
      }
    });

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

  // حركة ماوس عشوائية قبل النقر
  await page.mouse.move(startX, startY);
  await page.waitForTimeout(randomDelay(50, 150));

  // حركة منحنية للماوس
  const steps = 10 + Math.floor(Math.random() * 15);
  for (let i = 1; i <= steps; i++) {
    const progress = i / steps;
    const x = startX + (targetX - startX) * progress + (Math.random() - 0.5) * 5;
    const y = startY + (targetY - startY) * progress + (Math.random() - 0.5) * 5;
    await page.mouse.move(x, y);
    await page.waitForTimeout(randomDelay(5, 15));
  }

  // تأخير قبل النقر
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
      await page.waitForTimeout(randomDelay(200, 800)); // توقف عشوائي لمحاكاة التفكير
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
        behavior: 'smooth'
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
