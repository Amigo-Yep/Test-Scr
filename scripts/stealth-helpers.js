/**
 * Stealth Helpers - محسّن مع دعم كامل للإعدادات المتقدمة
 * يستقبل إعدادات التخفي من ملف المهمة ويطبقها بشكل صحيح
 * يتضمن تحسينات متقدمة لتجنب الكشف من قبل reCAPTCHA وBot Detection
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
  clearCookies: true,
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
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/116.0.0.0 Safari/537.36',
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/116.0.0.0 Safari/537.36',
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
    'Asia/Riyadh',
    'Asia/Dubai',
    'Africa/Cairo',
    'America/New_York',
    'Europe/London',
    'Asia/Tokyo',
    'Australia/Sydney',
    'Europe/Paris',
    'Asia/Shanghai',
    'America/Los_Angeles',
  ],
  locales: [
    'ar-SA',
    'ar-AE',
    'ar-EG',
    'en-US',
    'en-GB',
    'fr-FR',
    'de-DE',
    'ja-JP',
    'es-ES',
    'it-IT',
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
    'Intel(R) UHD Graphics 620',
    'NVIDIA GeForce GTX 1050',
    'AMD Radeon RX 5700 XT',
    'Apple GPU',
    'Qualcomm Adreno 650',
  ],
  webGLVendors: [
    'Intel Inc.',
    'NVIDIA Corporation',
    'ATI Technologies Inc.',
    'Apple Inc.',
    'Qualcomm',
  ],
  fonts: [
    'Arial',
    'Times New Roman',
    'Courier New',
    'Georgia',
    'Verdana',
    'Helvetica',
    'Palatino',
    'Garamond',
    'Bookman',
    'Comic Sans MS',
    'Trebuchet MS',
    'Arial Black',
    'Impact',
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
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
  }

  return dirs;
}

// ========== إنشاء متصفح مخفي مع جميع تحسينات Stealth ==========
export async function createStealthBrowser(options = {}) {
  const {
    stealthConfig = DEFAULT_STEALTH_CONFIG,
    recordVideo = false,
    disableWebSecurity = false,
    outputDir = process.env.OUTPUT_DIR || 'outputs',
    proxy = null,
  } = options;

  // دمج الإعدادات الافتراضية مع الإعدادات المخصصة
  const mergedConfig = { ...DEFAULT_STEALTH_CONFIG, ...stealthConfig };

  // إنشاء مسارات المخرجات
  const paths = ensureOutputDirs(outputDir);
  console.log(`✅ Output directories ready:`);
  console.log(`   📁 Screenshots: ${paths.screenshots}`);
  console.log(`   📁 Videos: ${paths.videos}`);

  // إعداد Launch Arguments
  const launchArgs = [
    '--disable-blink-features=AutomationControlled',
    '--disable-dev-shm-usage',
    '--no-sandbox',
    '--disable-setuid-sandbox',
    '--disable-infobars',
    '--window-position=0,0',
    '--ignore-certificate-errors',
    '--ignore-certificate-errors-spki-list',
    '--disable-component-extensions-with-background-pages',
    '--disable-extensions',
    '--disable-default-apps',
    '--disable-sync',
    '--metrics-recording-only',
    '--mute-audio',
    '--no-default-browser-check',
    '--no-first-run',
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
    '--disable-features=OptimizationHints,OptimizationHintsFetching,PreloadMetadata,PreloadPage,SpeculativePreloading,SpeculativePreloadingNoPrerender,OptimizationGuideModelDownload,OptimizationTargetPrediction,OptimizationHintsFetching,PreloadMediaEngagementData,AutofillServerCommunication,CreditCardAutofillViewOptimization,AutofillAccountWalletStorage,AutofillCreditCardAutofillViewOptimization,AutofillEnableAccountWalletStorage',
    '--disable-software-rasterizer',
    '--disable-default-apps',
    '--disable-cloud-import',
    '--disable-datasaver-prompt',
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
    '--log-level=3',
    '--disable-blink-features=AutomationControlled',
  ];

  if (mergedConfig.blockWebRTC) {
    launchArgs.push('--disable-webrtc');
    launchArgs.push('--disable-webrtc-hw-encoding');
    console.log('✅ WebRTC blocking enabled');
  }

  if (mergedConfig.maskFingerprint) {
    launchArgs.push('--disable-gpu');
    launchArgs.push('--disable-software-rasterizer');
  }

  if (disableWebSecurity) {
    launchArgs.push('--disable-web-security');
    launchArgs.push('--disable-features=IsolateOrigins,site-per-process');
    launchArgs.push('--disable-site-isolation-trials');
    console.log('⚠️ Web security disabled for Cross-Origin iframe support');
  }

  console.log('🚀 Launching browser with stealth mode...');

  // اختيار إعدادات عشوائية إذا كانت مفعلة
  const userAgent = mergedConfig.randomUserAgent ? randomChoice(STEALTH_DATA.userAgents) : 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36';
  const viewport = mergedConfig.randomViewport ? randomChoice(STEALTH_DATA.viewports) : { width: 1366, height: 768 };
  const timezoneId = mergedConfig.randomTimezone ? randomChoice(STEALTH_DATA.timezones) : 'Asia/Riyadh';
  const locale = mergedConfig.randomLanguage ? randomChoice(STEALTH_DATA.locales) : 'en-US';
  const hardwareConcurrency = mergedConfig.mockHardwareConcurrency ? randomChoice(STEALTH_DATA.hardwareConcurrency) : 4;
  const deviceMemory = mergedConfig.mockDeviceMemory ? randomChoice(STEALTH_DATA.deviceMemory) : 8;
  const screenResolution = mergedConfig.mockScreen ? randomChoice(STEALTH_DATA.screenResolutions) : { width: 1920, height: 1080, colorDepth: 24, pixelDepth: 24 };
  const webGLRenderer = mergedConfig.mockWebGL ? randomChoice(STEALTH_DATA.webGLRenderers) : 'Intel(R) UHD Graphics 620';
  const webGLVendor = mergedConfig.mockWebGL ? randomChoice(STEALTH_DATA.webGLVendors) : 'Intel Inc.';

  const browser = await chromium.launch({
    headless: false,
    proxy,
    args: launchArgs,
  });

  const context = await browser.newContext({
    userAgent,
    viewport,
    locale,
    timezoneId,
    bypassCSP: true,
    javaScriptEnabled: true,
    ignoreHTTPSErrors: true,
    geolocation: mergedConfig.mockGeolocation ? { longitude: randomFloat(-180, 180), latitude: randomFloat(-90, 90) } : undefined,
    permissions: mergedConfig.mockPermissions ? ['geolocation', 'notifications', 'camera', 'microphone'].reduce((obj, perm) => {
      obj[perm] = 'denied';
      return obj;
    }, {}) : undefined,
  });

  // تطبيق تعديلات Stealth المتقدمة عبر addInitScript
  await context.addInitScript((config, data) => {
    // 1. إخفاء بصمات الأتمتة الأساسية
    Object.defineProperty(navigator, 'webdriver', { get: () => false });
    Object.defineProperty(navigator, 'plugins', {
      get: () => [
        { name: 'Chrome PDF Plugin', description: 'Portable Document Format', filename: 'internal-pdf-viewer' },
        { name: 'Chrome PDF Viewer', description: '', filename: 'mhjfbmdgcfjbbpaeojofohoefgiehjai' },
        { name: 'Native Client', description: '', filename: 'internal-nacl-plugin' },
      ],
    });

    // 2. تعديل WebGL Fingerprinting
    if (window.WebGLRenderingContext && config.mockWebGL) {
      const getParameter = WebGLRenderingContext.prototype.getParameter;
      WebGLRenderingContext.prototype.getParameter = function(parameter) {
        switch (parameter) {
          case 37445: return data.webGLVendor; // UNMASKED_VENDOR_WEBGL
          case 37446: return data.webGLRenderer; // UNMASKED_RENDERER_WEBGL
          case 37444: return 'OpenGL ES-GPU'; // VENDOR
          case 37447: return 'ANGLE (Intel, Intel(R) UHD Graphics 620 Direct3D11 vs_5_0 ps_5_0)'; // RENDERER
          case 37443: return 'WebGL 2.0 (OpenGL ES 3.0 Chromium)'; // VERSION
          case 37442: return 'WebKit'; // SHADING_LANGUAGE_VERSION
          default: return getParameter.call(this, parameter);
        }
      };

      const getExtension = WebGLRenderingContext.prototype.getExtension;
      WebGLRenderingContext.prototype.getExtension = function(name) {
        if (name === 'WEBGL_debug_renderer_info') {
          return {
            UNMASKED_VENDOR_WEBGL: data.webGLVendor,
            UNMASKED_RENDERER_WEBGL: data.webGLRenderer,
          };
        }
        return getExtension.call(this, name);
      };

      const getSupportedExtensions = WebGLRenderingContext.prototype.getSupportedExtensions;
      WebGLRenderingContext.prototype.getSupportedExtensions = function() {
        return ['EXT_texture_filter_anisotropic', 'EXT_frag_depth', 'ANGLE_instanced_arrays', 'OES_texture_float_linear', 'WEBGL_compressed_texture_s3tc', 'WEBGL_compressed_texture_s3tc_srgb', 'WEBGL_debug_renderer_info', 'OES_element_index_uint', 'OES_standard_derivatives', 'OES_vertex_array_object', 'WEBGL_depth_texture', 'OES_texture_float', 'OES_texture_half_float', 'OES_texture_half_float_linear', 'WEBGL_color_buffer_float', 'EXT_blend_minmax', 'EXT_shader_texture_lod', 'EXT_frag_depth', 'WEBGL_compressed_texture_etc1', 'WEBGL_compressed_texture_pvrtc', 'WEBGL_compressed_texture_etc', 'WEBGL_compressed_texture_astc', 'WEBGL_draw_buffers', 'OES_texture_float_linear', 'OES_texture_half_float_linear', 'WEBGL_lose_context', 'EXT_color_buffer_half_float', 'WEBGL_color_buffer_float', 'EXT_disjoint_timer_query_webgl2'];
      };

      const getShaderPrecisionFormat = WebGLRenderingContext.prototype.getShaderPrecisionFormat;
      WebGLRenderingContext.prototype.getShaderPrecisionFormat = function(shaderType, precisionType) {
        return {
          rangeMin: 1,
          rangeMax: 1,
          precision: 23,
        };
      };
    }

    // 3. تعديل Canvas Fingerprinting
    if (config.mockCanvas) {
      const originalToDataURL = HTMLCanvasElement.prototype.toDataURL;
      HTMLCanvasElement.prototype.toDataURL = function() {
        if (Math.random() < 0.3) {
          const context = this.getContext('2d');
          context.globalCompositeOperation = 'multiply';
          context.fillStyle = `rgba(${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, 0.1)`;
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

    // 4. تعديل window.chrome وnavigator
    window.chrome = {
      runtime: {},
      app: {},
      csi: () => {},
      loadTimes: () => ({
        requestTime: Date.now() / 1000,
        startLoadTime: Date.now() / 1000,
        commitLoadTime: Date.now() / 1000,
        finishDocumentLoadTime: Date.now() / 1000,
        finishLoadTime: Date.now() / 1000,
        firstPaintTime: Date.now() / 1000,
        firstPaintAfterLoadTime: Date.now() / 1000,
      }),
    };

    Object.defineProperty(navigator, 'appVersion', {
      get: () => '5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    });

    Object.defineProperty(navigator, 'platform', {
      get: () => 'Win32',
    });

    Object.defineProperty(navigator, 'hardwareConcurrency', {
      get: () => data.hardwareConcurrency,
    });

    Object.defineProperty(navigator, 'deviceMemory', {
      get: () => data.deviceMemory,
    });

    Object.defineProperty(navigator, 'maxTouchPoints', {
      get: () => 0,
    });

    // 5. تعديل screen
    if (config.mockScreen) {
      Object.defineProperty(screen, 'width', { get: () => data.screenResolution.width });
      Object.defineProperty(screen, 'height', { get: () => data.screenResolution.height });
      Object.defineProperty(screen, 'colorDepth', { get: () => data.screenResolution.colorDepth });
      Object.defineProperty(screen, 'pixelDepth', { get: () => data.screenResolution.pixelDepth });
      Object.defineProperty(screen, 'availWidth', { get: () => data.screenResolution.width });
      Object.defineProperty(screen, 'availHeight', { get: () => data.screenResolution.height });
      Object.defineProperty(screen, 'orientation', {
        get: () => ({
          type: 'landscape-primary',
          angle: 0,
          onchange: null,
        }),
      });
    }

    // 6. تعديل MediaDevices
    if (config.mockMediaDevices) {
      Object.defineProperty(navigator, 'mediaDevices', {
        get: () => ({
          enumerateDevices: () => Promise.resolve([]),
          getUserMedia: () => Promise.reject(new Error('NotAllowedError: Permission denied')),
        }),
      });
    }

    // 7. تعديل Geolocation
    if (config.mockGeolocation) {
      Object.defineProperty(navigator, 'geolocation', {
        get: () => ({
          getCurrentPosition: (success, error) => error({ code: 1, message: 'User denied Geolocation' }),
          watchPosition: (success, error) => error({ code: 1, message: 'User denied Geolocation' }),
        }),
      });
    }

    // 8. تعديل Permissions
    if (config.mockPermissions) {
      Object.defineProperty(navigator, 'permissions', {
        get: () => ({
          query: (permission) => Promise.resolve({ state: 'denied' }),
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
          lock: () => Promise.reject(new Error('NotSupportedError: Keyboard lock is not supported')),
          unlock: () => {},
        }),
      });
    }

    // 12. تعديل Clipboard
    if (config.mockClipboard) {
      Object.defineProperty(navigator, 'clipboard', {
        get: () => ({
          writeText: () => Promise.reject(new Error('NotAllowedError: Clipboard write denied')),
          readText: () => Promise.reject(new Error('NotAllowedError: Clipboard read denied')),
        }),
      });
    }

    // 13. تعديل Performance
    if (config.mockPerformance) {
      Object.defineProperty(window, 'performance', {
        get: () => ({
          memory: { usedJSHeapSize: 10000000, totalJSHeapSize: 20000000, jsHeapSizeLimit: 40000000 },
          now: () => Date.now(),
          timeOrigin: Date.now(),
          timing: {
            navigationStart: Date.now(),
            unloadStart: Date.now(),
            unloadEnd: Date.now(),
            redirectStart: 0,
            redirectEnd: 0,
            fetchStart: Date.now(),
            domainLookupStart: Date.now(),
            domainLookupEnd: Date.now(),
            connectStart: Date.now(),
            connectEnd: Date.now(),
            secureConnectionStart: Date.now(),
            requestStart: Date.now(),
            responseStart: Date.now(),
            responseEnd: Date.now(),
            domLoading: Date.now(),
            domInteractive: Date.now(),
            domContentLoadedEventStart: Date.now(),
            domContentLoadedEventEnd: Date.now(),
            domComplete: Date.now(),
            loadEventStart: Date.now(),
            loadEventEnd: Date.now(),
          },
          navigation: { type: 0, redirectCount: 0 },
          getEntries: () => [],
          getEntriesByType: () => [],
          getEntriesByName: () => [],
          clearResourceTimings: () => {},
          setResourceTimingBufferSize: () => {},
          toJSON: () => ({}),
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
        return originalInstantiate.apply(this, arguments).then(result => {
          return { module: result.module, instance: { exports: {} } };
        });
      };
    }

    // 16. تعديل SpeechRecognition
    if (config.mockSpeechRecognition && window.SpeechRecognition) {
      window.SpeechRecognition = function() {};
      window.webkitSpeechRecognition = function() {};
    }

    // 17. تعديل DeviceOrientation وDeviceMotion
    if (config.mockDeviceOrientation) {
      Object.defineProperty(window, 'DeviceOrientationEvent', { get: () => function() {} });
      Object.defineProperty(window, 'DeviceMotionEvent', { get: () => function() {} });
      window.addEventListener = (new Proxy(window.addEventListener, {
        apply: function(target, thisArg, args) {
          if (args[0] === 'deviceorientation' || args[0] === 'devicemotion') {
            return;
          }
          return target.apply(thisArg, args);
        },
      }));
    }

    // 18. تعديل Battery Status
    if (config.mockBattery) {
      Object.defineProperty(navigator, 'getBattery', {
        get: () => () => Promise.resolve({
          level: 0.75,
          charging: true,
          chargingTime: Infinity,
          dischargingTime: Infinity,
          onlevelchange: null,
          onchargingchange: null,
          onchargingtimechange: null,
          ondischargingtimechange: null,
        }),
      });
    }

    // 19. تعديل Network Information
    if (config.mockConnection) {
      Object.defineProperty(navigator, 'connection', {
        get: () => ({
          downlink: 10,
          effectiveType: '4g',
          onchange: null,
          rtt: 50,
          saveData: false,
          type: 'wifi',
        }),
      });
    }

    // 20. تعديل Notifications
    if (config.mockNotifications) {
      Object.defineProperty(window, 'Notification', {
        get: () => function(title, options) {
          return { title, options, close: () => {}, addEventListener: () => {} };
        },
      });
    }
  }, { mergedConfig, data: { webGLRenderer, webGLVendor, hardwareConcurrency, deviceMemory, screenResolution } });

  return { browser, context, paths };
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
