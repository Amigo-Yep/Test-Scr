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
    let retries_step2 = 3;
    while (retries_step2 > 0) {
      try {
        // 🌐 فتح صفحة
        console.log('\n🌐 الانتقال إلى صفحة:');
        console.log('   🔗 الرابط: https://www.duolingo.com');
        try {
          console.log('   ⏳ جاري تحميل الصفحة...');
          await page.goto("https://www.duolingo.com", { waitUntil: 'networkidle' }).catch(() => {});
          console.log('   ✅ تم تحميل الصفحة بنجاح');
          currentPage = page;
        } catch (navError) {
          console.error('   ❌ خطأ في تحميل الصفحة:', navError.message);
          throw navError;
        }
                break;
      } catch (stepError) {
        retries_step2--;
        if (retries_step2 === 0) {
          throw stepError;
        }
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    }

    // Step 3: انتظار
    let retries_step3 = 3;
    while (retries_step3 > 0) {
      try {
        // ⏱️ انتظار زمني
        console.log('\n⏱️ الانتظار:');
        console.log('   ⏳ المدة: 5000ms (5.0s)');
        console.log('   ⏳ جاري الانتظار...');
        await currentPage.waitForTimeout(5000);
        console.log('   ✅ انتهت مدة الانتظار');
                break;
      } catch (stepError) {
        retries_step3--;
        if (retries_step3 === 0) {
          throw stepError;
        }
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    }

    // Step 4: التقاط صورة
    let retries_step4 = 3;
    while (retries_step4 > 0) {
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
        retries_step4--;
        if (retries_step4 === 0) {
          throw stepError;
        }
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    }

    // Step 5: نقر على عنصر
    let retries_step5 = 3;
    while (retries_step5 > 0) {
      try {
        
        // 👆 خطوة نقر ذكية على العنصر
        console.log('\n👆 خطوة نقر على عنصر:');
        console.log('   🔍 جاري البحث عن العنصر...');
        console.log('   📋 عدد المحددات:', 1);
        let clickSelector = null;
        const selectorsToTry = ["[data-test='have-account']"];
        
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
        console.log('🖱️ تنفيذ النقرة...');
        try {
          await currentPage.locator(clickSelector).first().click({ timeout: 5000 });
          console.log('   ✅ تم النقر بنجاح');
        } catch (e) {
          console.log('   ⚠️ النقر الطبيعي فشل:', e.message);
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
        retries_step5--;
        if (retries_step5 === 0) {
          throw stepError;
        }
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    }

    // Step 6: التقاط صورة
    let retries_step6 = 3;
    while (retries_step6 > 0) {
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
        retries_step6--;
        if (retries_step6 === 0) {
          throw stepError;
        }
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    }

    // Step 7: انتظار
    let retries_step7 = 3;
    while (retries_step7 > 0) {
      try {
        // ⏱️ انتظار زمني
        console.log('\n⏱️ الانتظار:');
        console.log('   ⏳ المدة: 2150ms (2.1s)');
        console.log('   ⏳ جاري الانتظار...');
        await currentPage.waitForTimeout(2150);
        console.log('   ✅ انتهت مدة الانتظار');
                break;
      } catch (stepError) {
        retries_step7--;
        if (retries_step7 === 0) {
          throw stepError;
        }
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    }

    // Step 8: كتابة نص
    let retries_step8 = 2;
    while (retries_step8 > 0) {
      try {
        // ⌨️ كتابة نص في حقل
        console.log('\n⌨️ كتابة نص في حقل:');
        console.log('   📍 الحقل: #web-ui1');
        console.log('   📝 النص: 2ggg@ggg.com');
        console.log('   ⏳ جاري ملء الحقل...');
        try {
          let typeSelector = null;
          for (const selector of ["#web-ui1","#email","input[type=\"email\"]"]) {
            try {
              const element = await currentPage.locator(selector).first();
              if (await element.isVisible({ timeout: 2000 }).catch(() => false)) {
                typeSelector = selector;
                console.log('   ✅ وجدنا حقل الإدخال: ' + selector);
                break;
              }
            } catch (e) {}
          }
          if (!typeSelector) {
            throw new Error('❌ لم يتم العثور على حقل الإدخال');
          }
          await currentPage.fill(typeSelector, "2ggg@ggg.com");
          console.log('   ✅ تم ملء الحقل بنجاح');
        } catch (typeError) {
          console.error('   ❌ خطأ في ملء الحقل:', typeError.message);
          throw typeError;
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
        console.log('   ⏳ المدة: 3486ms (3.5s)');
        console.log('   ⏳ جاري الانتظار...');
        await currentPage.waitForTimeout(3486);
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

    // Step 10: كتابة نص
    let retries_step10 = 2;
    while (retries_step10 > 0) {
      try {
        // ⌨️ كتابة نص في حقل
        console.log('\n⌨️ كتابة نص في حقل:');
        console.log('   📍 الحقل: #web-ui2');
        console.log("   📝 النص: ('12341234')");
        console.log('   ⏳ جاري ملء الحقل...');
        try {
          let typeSelector = null;
          for (const selector of ["#web-ui2","input[type=\"password\"]"]) {
            try {
              const element = await currentPage.locator(selector).first();
              if (await element.isVisible({ timeout: 2000 }).catch(() => false)) {
                typeSelector = selector;
                console.log('   ✅ وجدنا حقل الإدخال: ' + selector);
                break;
              }
            } catch (e) {}
          }
          if (!typeSelector) {
            throw new Error('❌ لم يتم العثور على حقل الإدخال');
          }
          await currentPage.fill(typeSelector, "('12341234')");
          console.log('   ✅ تم ملء الحقل بنجاح');
        } catch (typeError) {
          console.error('   ❌ خطأ في ملء الحقل:', typeError.message);
          throw typeError;
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

    // Step 11: التقاط صورة
    let retries_step11 = 3;
    while (retries_step11 > 0) {
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
        retries_step11--;
        if (retries_step11 === 0) {
          throw stepError;
        }
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    }

    // Step 12: انتظار
    let retries_step12 = 3;
    while (retries_step12 > 0) {
      try {
        // ⏱️ انتظار زمني
        console.log('\n⏱️ الانتظار:');
        console.log('   ⏳ المدة: 1214ms (1.2s)');
        console.log('   ⏳ جاري الانتظار...');
        await currentPage.waitForTimeout(1214);
        console.log('   ✅ انتهت مدة الانتظار');
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
    let retries_step13 = 2;
    while (retries_step13 > 0) {
      try {
        
        // 👆 خطوة نقر ذكية على العنصر
        console.log('\n👆 خطوة نقر على عنصر:');
        console.log('   🔍 جاري البحث عن العنصر...');
        console.log('   📋 عدد المحددات:', 3);
        let clickSelector = null;
        const selectorsToTry = ["button[data-test='register-button']","button:has-text(\"Login\")","button:has-text(\"Sign In\")"];
        
        // البحث عن أول عنصر قابل للنقر
        for (const selector of selectorsToTry) {
          try {
            const element = await currentPage.locator(selector).first();
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
        
        // تنفيذ النقرة مع محاولات متعددة
        console.log('🖱️ تنفيذ النقرة...');
        try {
          await currentPage.locator(clickSelector).first().click({ timeout: 5000 });
          console.log('   ✅ تم النقر بنجاح');
        } catch (e) {
          console.log('   ⚠️ النقر الطبيعي فشل:', e.message);
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
        console.log('   ⏳ المدة: 1214ms (1.2s)');
        console.log('   ⏳ جاري الانتظار...');
        await currentPage.waitForTimeout(1214);
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

    // Step 16: انتظار
    let retries_step16 = 3;
    while (retries_step16 > 0) {
      try {
        // ⏱️ انتظار زمني
        console.log('\n⏱️ الانتظار:');
        console.log('   ⏳ المدة: 10000ms (10.0s)');
        console.log('   ⏳ جاري الانتظار...');
        await currentPage.waitForTimeout(10000);
        console.log('   ✅ انتهت مدة الانتظار');
                break;
      } catch (stepError) {
        retries_step16--;
        if (retries_step16 === 0) {
          throw stepError;
        }
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    }

    // Step 17: التقاط صورة
    let retries_step17 = 3;
    while (retries_step17 > 0) {
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
        retries_step17--;
        if (retries_step17 === 0) {
          throw stepError;
        }
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    }

    // Step 18: نقر على عنصر
    let retries_step18 = 2;
    while (retries_step18 > 0) {
      try {
        
        // 👆 خطوة نقر ذكية على العنصر
        console.log('\n👆 خطوة نقر على عنصر:');
        console.log('   🔍 جاري البحث عن العنصر...');
        console.log('   📋 عدد المحددات:', 3);
        let clickSelector = null;
        const selectorsToTry = ["button[data-test='register-button']","button:has-text(\"Login\")","button:has-text(\"Sign In\")"];
        
        // البحث عن أول عنصر قابل للنقر
        for (const selector of selectorsToTry) {
          try {
            const element = await currentPage.locator(selector).first();
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
        
        // تنفيذ النقرة مع محاولات متعددة
        console.log('🖱️ تنفيذ النقرة...');
        try {
          await currentPage.locator(clickSelector).first().click({ timeout: 5000 });
          console.log('   ✅ تم النقر بنجاح');
        } catch (e) {
          console.log('   ⚠️ النقر الطبيعي فشل:', e.message);
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
        retries_step18--;
        if (retries_step18 === 0) {
          throw stepError;
        }
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    }

    // Step 19: انتظار
    let retries_step19 = 3;
    while (retries_step19 > 0) {
      try {
        // ⏱️ انتظار زمني
        console.log('\n⏱️ الانتظار:');
        console.log('   ⏳ المدة: 11000ms (11.0s)');
        console.log('   ⏳ جاري الانتظار...');
        await currentPage.waitForTimeout(11000);
        console.log('   ✅ انتهت مدة الانتظار');
                break;
      } catch (stepError) {
        retries_step19--;
        if (retries_step19 === 0) {
          throw stepError;
        }
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    }

    // Step 20: التقاط صورة
    let retries_step20 = 3;
    while (retries_step20 > 0) {
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
        retries_step20--;
        if (retries_step20 === 0) {
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
      console.log('\n🔄 تكرار المهمة 3 مرات');
      for (let taskLoop = 0; taskLoop < 3; taskLoop++) {
        console.log(`\n🔄 تنفيذ المهمة ${taskLoop + 1}/3`);
        try {
          const result = await runTask(page, context, paths);
          executionSuccess = result.success;
          console.log('📊 نتيجة التنفيذ:', result.success ? '✅ نجحت' : '❌ فشلت');
          if (!result.success) {
            console.warn('⚠️ فشلت المهمة في التكرار ' + (taskLoop + 1));
            break;
          }
        } catch (iterationError) {
          executionError = iterationError;
          console.error('❌ خطأ في التكرار ' + (taskLoop + 1) + ':', iterationError.message);
          break;
        }
      }
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
