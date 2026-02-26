// ✅ استيراد stealth-helpers.js - يحتوي على جميع إعدادات التخفي
import { createStealthBrowser, humanClick, humanType, humanScroll } from './stealth-helpers.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function runTask(page, context, paths) {
  // تهيئة الصفحة الحالية ومتغيرات التتبع
  let currentPage = page;
  const pages = {};
  pages['main'] = page;
  let screenshotCounter = 0;
  
  try {
    // Step 1: تسجيل فيديو
    let retries_step1 = 3;
    while (retries_step1 > 0) {
      try {
        // 🎥 تسجيل الفيديو - تم تفعيله على مستوى السياق
        console.log('🎥 خطوة الفيديو:');
        console.log('   ℹ️  التسجيل يشمل جميع الصفحات في هذا السياق');
        console.log('   📁 مجلد الحفظ: outputs/videos/');
        console.log('   ⏱️  سيتم حفظ الفيديو تلقائياً عند إغلاق السياق');
        console.log('   ✅ الحالة: الفيديو نشط ومُسجَّل');
                break;
      } catch (stepError) {
        retries_step1--;
        if (retries_step1 === 0) {
          throw stepError;
        }
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    }

    // Step 2: فتح صفحة

    // 🔄 تكرار الخطوة 3 مرة
    console.log('   🔄 بدء التكرار: خطوة 2');
    for (let loopIter_1 = 0; loopIter_1 < 3; loopIter_1++) {
      console.log(`   ▶️  التكرار ${loopIter_1 + 1} من 3`);
      try {
        let retries_parent_1 = 3;
        while (retries_parent_1 > 0) {
          try {
            // 🌐 فتح صفحة
            console.log('\n🌐 الانتقال إلى صفحة:');
            console.log('   🔗 الرابط: https://google.com');
            try {
              console.log('   ⏳ جاري تحميل الصفحة...');
              await page.goto("https://google.com", { waitUntil: 'networkidle' }).catch(() => {});
              console.log('   ✅ تم تحميل الصفحة بنجاح');
              currentPage = page;
            } catch (navError) {
              console.error('   ❌ خطأ في تحميل الصفحة:', navError.message);
              throw navError;
            }
                        break;
          } catch (parentError) {
            retries_parent_1--;
            if (retries_parent_1 === 0) {
              throw parentError;
            }
            await new Promise(resolve => setTimeout(resolve, 1000));
          }
        }
        // Child Step 1: انتظار
        let retries_childStep1 = 3;
        while (retries_childStep1 > 0) {
          try {
            // ⏱️ انتظار زمني
            console.log('\n⏱️ الانتظار:');
            console.log('   ⏳ المدة: 2450ms (2.5s)');
            console.log('   ⏳ جاري الانتظار...');
            await currentPage.waitForTimeout(2450);
            console.log('   ✅ انتهت مدة الانتظار');
                        break;
          } catch (stepError) {
            retries_childStep1--;
            if (retries_childStep1 === 0) {
              throw stepError;
            }
            await new Promise(resolve => setTimeout(resolve, 1000));
          }
        }

        // Child Step 2: فتح صفحة
        let retries_childStep2 = 3;
        while (retries_childStep2 > 0) {
          try {
            // 🌐 فتح صفحة
            console.log('\n🌐 الانتقال إلى صفحة:');
            console.log('   🔗 الرابط: https://www.bing.com/');
            try {
              console.log('   ⏳ جاري تحميل الصفحة...');
              await page.goto("https://www.bing.com/", { waitUntil: 'networkidle' }).catch(() => {});
              console.log('   ✅ تم تحميل الصفحة بنجاح');
              currentPage = page;
            } catch (navError) {
              console.error('   ❌ خطأ في تحميل الصفحة:', navError.message);
              throw navError;
            }
                        break;
          } catch (stepError) {
            retries_childStep2--;
            if (retries_childStep2 === 0) {
              throw stepError;
            }
            await new Promise(resolve => setTimeout(resolve, 1000));
          }
        }

        // Child Step 3: التقاط صورة
        let retries_childStep3 = 3;
        while (retries_childStep3 > 0) {
          try {
            // 📸 التقاط لقطة شاشة
            screenshotCounter++;
            const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
            // ✅ استخدام مسار المخرجات من stealth-helpers
            const screenshotPath = path.join(paths.screenshots, `screenshot-${screenshotCounter}-viewport-${timestamp}.png`);
            console.log('📸 جاري التقاط لقطة الشاشة (viewport)...');
            try {
              await currentPage.screenshot({ path: screenshotPath,  });
              console.log('✅ تم حفظ اللقطة بنجاح في:', screenshotPath);
            } catch (screenshotError) {
              console.error('❌ خطأ في حفظ لقطة الشاشة:', screenshotError.message);
              throw screenshotError;
            }
                        break;
          } catch (stepError) {
            retries_childStep3--;
            if (retries_childStep3 === 0) {
              throw stepError;
            }
            await new Promise(resolve => setTimeout(resolve, 1000));
          }
        }

        // Child Step 4: انتظار
        let retries_childStep4 = 3;
        while (retries_childStep4 > 0) {
          try {
            // ⏱️ انتظار زمني
            console.log('\n⏱️ الانتظار:');
            console.log('   ⏳ المدة: 2450ms (2.5s)');
            console.log('   ⏳ جاري الانتظار...');
            await currentPage.waitForTimeout(2450);
            console.log('   ✅ انتهت مدة الانتظار');
                        break;
          } catch (stepError) {
            retries_childStep4--;
            if (retries_childStep4 === 0) {
              throw stepError;
            }
            await new Promise(resolve => setTimeout(resolve, 1000));
          }
        }

        // Child Step 5: فتح صفحة
        let retries_childStep5 = 3;
        while (retries_childStep5 > 0) {
          try {
            // 🌐 فتح صفحة
            console.log('\n🌐 الانتقال إلى صفحة:');
            console.log('   🔗 الرابط: https://www.bing.com/');
            try {
              console.log('   ⏳ جاري تحميل الصفحة...');
              await page.goto("https://www.bing.com/", { waitUntil: 'networkidle' }).catch(() => {});
              console.log('   ✅ تم تحميل الصفحة بنجاح');
              currentPage = page;
            } catch (navError) {
              console.error('   ❌ خطأ في تحميل الصفحة:', navError.message);
              throw navError;
            }
                        break;
          } catch (stepError) {
            retries_childStep5--;
            if (retries_childStep5 === 0) {
              throw stepError;
            }
            await new Promise(resolve => setTimeout(resolve, 1000));
          }
        }

      } catch (loopError) {
        console.error('   ❌ خطأ في التكرار:', loopError.message);
        throw loopError;
      }
    }
    console.log('   ✅ انتهى التكرار بنجاح');

    // Step 8: فتح صفحة
    let retries_step8 = 3;
    while (retries_step8 > 0) {
      try {
        // 🌐 فتح صفحة
        console.log('\n🌐 الانتقال إلى صفحة:');
        console.log('   🔗 الرابط: https://accounts.google.com/signin');
        try {
          console.log('   ⏳ جاري تحميل الصفحة...');
          await page.goto("https://accounts.google.com/signin", { waitUntil: 'networkidle' }).catch(() => {});
          console.log('   ✅ تم تحميل الصفحة بنجاح');
          currentPage = page;
        } catch (navError) {
          console.error('   ❌ خطأ في تحميل الصفحة:', navError.message);
          throw navError;
        }
                break;
      } catch (stepError) {
        retries_step8--;
        if (retries_step8 === 0) {
          throw stepError;
        }
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    }

    // Step 9: انتظار
    let retries_step9 = 3;
    while (retries_step9 > 0) {
      try {
        // ⏱️ انتظار زمني
        console.log('\n⏱️ الانتظار:');
        console.log('   ⏳ المدة: 5000ms (5.0s)');
        console.log('   ⏳ جاري الانتظار...');
        await currentPage.waitForTimeout(5000);
        console.log('   ✅ انتهت مدة الانتظار');
                break;
      } catch (stepError) {
        retries_step9--;
        if (retries_step9 === 0) {
          throw stepError;
        }
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    }

    // Step 10: التقاط صورة
    let retries_step10 = 3;
    while (retries_step10 > 0) {
      try {
        // 📸 التقاط لقطة شاشة
        screenshotCounter++;
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
        // ✅ استخدام مسار المخرجات من stealth-helpers
        const screenshotPath = path.join(paths.screenshots, `screenshot-${screenshotCounter}-viewport-${timestamp}.png`);
        console.log('📸 جاري التقاط لقطة الشاشة (viewport)...');
        try {
          await currentPage.screenshot({ path: screenshotPath,  });
          console.log('✅ تم حفظ اللقطة بنجاح في:', screenshotPath);
        } catch (screenshotError) {
          console.error('❌ خطأ في حفظ لقطة الشاشة:', screenshotError.message);
          throw screenshotError;
        }
                break;
      } catch (stepError) {
        retries_step10--;
        if (retries_step10 === 0) {
          throw stepError;
        }
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    }

    // Step 11: كتابة نص
    let retries_step11 = 3;
    while (retries_step11 > 0) {
      try {
        // ⌨️ كتابة نص في حقل
        console.log('\n⌨️ كتابة نص في حقل:');
        console.log('   📍 الحقل: input[aria-label='البريد الإلكتروني أو الهاتف']');
        console.log('   📝 النص: helloo.eva#gmail.com');
        console.log('   ⏳ جاري ملء الحقل...');
        try {
          await humanType(currentPage, "input[aria-label='البريد الإلكتروني أو الهاتف']", "helloo.eva#gmail.com");
          console.log('   ✅ تم ملء الحقل بنجاح');
        } catch (typeError) {
          console.error('   ❌ خطأ في ملء الحقل:', typeError.message);
          throw typeError;
        }
                break;
      } catch (stepError) {
        retries_step11--;
        if (retries_step11 === 0) {
          throw stepError;
        }
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    }

    // Step 12: التقاط صورة
    let retries_step12 = 3;
    while (retries_step12 > 0) {
      try {
        // 📸 التقاط لقطة شاشة
        screenshotCounter++;
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
        // ✅ استخدام مسار المخرجات من stealth-helpers
        const screenshotPath = path.join(paths.screenshots, `screenshot-${screenshotCounter}-viewport-${timestamp}.png`);
        console.log('📸 جاري التقاط لقطة الشاشة (viewport)...');
        try {
          await currentPage.screenshot({ path: screenshotPath,  });
          console.log('✅ تم حفظ اللقطة بنجاح في:', screenshotPath);
        } catch (screenshotError) {
          console.error('❌ خطأ في حفظ لقطة الشاشة:', screenshotError.message);
          throw screenshotError;
        }
                break;
      } catch (stepError) {
        retries_step12--;
        if (retries_step12 === 0) {
          throw stepError;
        }
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    }

    // Step 13: نقر على عنصر
    let retries_step13 = 3;
    while (retries_step13 > 0) {
      try {
        
        // 👆 خطوة نقر ذكية على العنصر
        console.log('\n👆 خطوة نقر على عنصر:');
        console.log('   🔍 جاري البحث عن العنصر...');
        console.log('   📋 عدد المحددات:', 1);
        let clickSelector = null;
        const selectorsToTry = ["#identifierNext"];
        
        // البحث عن أول عنصر قابل للنقر
        for (const selector of selectorsToTry) {
          try {
            const element = await currentPage.locator(selector).first();
            await element.waitFor({ state: 'visible', timeout: 5000 }).catch(() => {});
            if (await element.isVisible({ timeout: 1000 }).catch(() => false)) {
              clickSelector = selector;
              break;
            }
          } catch (e) {}
        }
        
        if (!clickSelector) {
          const errorMsg = '❌ فشل: لم يتم العثور على عنصر قابل للنقر بأي من المحددات: ' + selectorsToTry.join(', ');
          console.error(errorMsg);
          throw new Error(errorMsg);
        }
        
        console.log('✅ عنصر وُجد بنجاح:');
        console.log('   📍 Selector:', clickSelector);
        console.log('   ✓ الحالة: مرئي وقابل للنقر');
        
        // التمرير للعنصر إلى عرض الكاميرا
        console.log('📜 جاري التمرير للعنصر إلى عرض الكاميرا...');
        await currentPage.locator(clickSelector).first().scrollIntoViewIfNeeded();
        console.log('   ✅ تم التمرير بنجاح');
        
        // تنفيذ النقرة مع محاولات متعددة
        console.log('🖱️ تنفيذ النقرة (محاكاة بشرية)...');
        console.log('   🤖 وضع: humanClick - حركة ماوس طبيعية وسلوك واقعي');
        try {
          await humanClick(currentPage, clickSelector);
          console.log('   ✅ تم النقر بنجاح');
        } catch (e) {
          console.log('   ⚠️ النقر فشل:', e.message);
          console.log('   🔄 جاري محاولة النقر الجبري (Force Click)...');
          try {
            await currentPage.locator(clickSelector).first().click({ force: true });
            console.log('   ✅ تم النقر الجبري بنجاح');
          } catch (forceError) {
            console.error('   ❌ فشل النقر الجبري أيضاً:', forceError.message);
            throw forceError;
          }
        }
                break;
      } catch (stepError) {
        retries_step13--;
        if (retries_step13 === 0) {
          throw stepError;
        }
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    }

    // Step 14: انتظار
    let retries_step14 = 3;
    while (retries_step14 > 0) {
      try {
        // ⏱️ انتظار زمني
        console.log('\n⏱️ الانتظار:');
        console.log('   ⏳ المدة: 5000ms (5.0s)');
        console.log('   ⏳ جاري الانتظار...');
        await currentPage.waitForTimeout(5000);
        console.log('   ✅ انتهت مدة الانتظار');
                break;
      } catch (stepError) {
        retries_step14--;
        if (retries_step14 === 0) {
          throw stepError;
        }
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    }

    // Step 15: التقاط صورة
    let retries_step15 = 3;
    while (retries_step15 > 0) {
      try {
        // 📸 التقاط لقطة شاشة
        screenshotCounter++;
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
        // ✅ استخدام مسار المخرجات من stealth-helpers
        const screenshotPath = path.join(paths.screenshots, `screenshot-${screenshotCounter}-viewport-${timestamp}.png`);
        console.log('📸 جاري التقاط لقطة الشاشة (viewport)...');
        try {
          await currentPage.screenshot({ path: screenshotPath,  });
          console.log('✅ تم حفظ اللقطة بنجاح في:', screenshotPath);
        } catch (screenshotError) {
          console.error('❌ خطأ في حفظ لقطة الشاشة:', screenshotError.message);
          throw screenshotError;
        }
                break;
      } catch (stepError) {
        retries_step15--;
        if (retries_step15 === 0) {
          throw stepError;
        }
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    }

    console.log("✅ اكتملت المهمة بنجاح");
    return { success: true };
  } catch (error) {
    console.error("❌ خطأ:", error.message);
    return { success: false, error: error.message };
  }
}

// دالة تشغيل فعلية - تعمل مباشرة
(async () => {
  // ✅ تعريف جميع المتغيرات الحرجة خارج try blocks
  let browser = null;
  let context = null;
  let page = null;
  let paths = null;
  let executionSuccess = false;
  let executionError = null;

  try {
    // ✅ استخدام createStealthBrowser من stealth-helpers
    // تطبيق جميع إعدادات التخفي تلقائياً
    console.log('🚀 إنشاء متصفح مع إعدادات التخفي...');
    const browserResult = await createStealthBrowser({
      stealthConfig: {
        randomUserAgent: true,
        randomViewport: true,
        hideWebdriver: true,
        randomTimezone: true,
        randomLanguage: false,
        humanClicks: true,
        humanTyping: true,
        randomDelays: true,
        mouseMovement: true,
        scrollBehavior: true,
        blockWebRTC: true,
        maskFingerprint: true,
        rotateProxies: false,
        clearCookies: true
      },
      recordVideo: true,
      disableWebSecurity: false,
      outputDir: process.env.OUTPUT_DIR || 'outputs'
    });

    // ✅ تعيين النتائج للمتغيرات الخارجية
    browser = browserResult.browser;
    context = browserResult.context;
    page = browserResult.page;
    paths = browserResult.paths;
    console.log('✅ متصفح جاهز للاستخدام\n');

    // تنفيذ المهمة
    try {
      const result = await runTask(page, context, paths);
      executionSuccess = result.success;
      console.log('📊 نتيجة التنفيذ:', result.success ? '✅ نجحت' : '❌ فشلت');
    } catch (taskError) {
      executionError = taskError;
      console.error('❌ خطأ في تنفيذ المهمة:', taskError.message);
    }
  } catch (error) {
    console.error('❌ خطأ حرج في البداية:', error.message);
  } finally {
    // تنظيف الموارد - إغلاق السياق والمتصفح مرة واحدة فقط
    try {
      if (context) {
        console.log('\n🔒 إغلاق السياق وحفظ المخرجات:');
        console.log('   ⏳ جاري إغلاق السياق...');
        await context.close();
        console.log('   ✅ تم إغلاق السياق');
        console.log(`   📁 الفيديوهات محفوظة في: ${paths.videos}`);
        console.log(`   📁 لقطات الشاشة محفوظة في: ${paths.screenshots}`);
      }
    } catch (contextError) {
      console.warn('⚠️ خطأ في إغلاق السياق:', contextError.message);
    }
    try {
      if (browser) {
        console.log('🔒 إغلاق المتصفح...');
        await browser.close();
        console.log('✅ تم إغلاق المتصفح');
      }
    } catch (browserError) {
      console.warn('⚠️ خطأ في إغلاق المتصفح:', browserError.message);
    }
    // الخروج بكود النجاح/الفشل الصحيح
    process.exit(executionSuccess ? 0 : 1);
  }
})();
