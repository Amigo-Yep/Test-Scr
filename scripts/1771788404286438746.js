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
    // Step 1: فتح صفحة
    let retries_step1 = 3;
    while (retries_step1 > 0) {
      try {
        // 🌐 فتح صفحة جديدة
        console.log('\n🌐 فتح صفحة جديدة:');
        console.log('   📍 المتغير: proxy');
        console.log('   🔗 الرابط: https://www.whatismyip.com/');
        try {
          console.log('   ⏳ جاري إنشاء صفحة جديدة من السياق...');
          const proxy = await context.newPage();
          console.log('   ✅ تم إنشاء الصفحة');
          console.log('   ⏳ جاري الانتقال إلى الرابط...');
          await proxy.goto("https://www.whatismyip.com/", { waitUntil: 'networkidle' }).catch(() => {});
          console.log('   ✅ تم تحميل الصفحة');
          pages["proxy"] = proxy;
          currentPage = proxy;
          console.log('   ✅ تم تعيين الصفحة الحالية');
          console.log('   📌 الصفحة جاهزة للعمل');
        } catch (navError) {
          console.error('   ❌ خطأ في فتح الصفحة:', navError.message);
          throw navError;
        }
                break;
      } catch (stepError) {
        retries_step1--;
        if (retries_step1 === 0) {
          throw stepError;
        }
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    }

    // Step 2: انتظار
    let retries_step2 = 3;
    while (retries_step2 > 0) {
      try {
        // ⏱️ انتظار زمني
        console.log('\n⏱️ الانتظار:');
        console.log('   ⏳ المدة: 10000ms (10.0s)');
        console.log('   ⏳ جاري الانتظار...');
        await currentPage.waitForTimeout(10000);
        console.log('   ✅ انتهت مدة الانتظار');
                break;
      } catch (stepError) {
        retries_step2--;
        if (retries_step2 === 0) {
          throw stepError;
        }
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    }

    // Step 3: التقاط صورة
    let retries_step3 = 3;
    while (retries_step3 > 0) {
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
        retries_step3--;
        if (retries_step3 === 0) {
          throw stepError;
        }
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    }

    // Step 4: تمرير الصفحة
    let retries_step4 = 3;
    while (retries_step4 > 0) {
      try {
        // 📜 تمرير الصفحة (طبيعي وبشري)
        console.log('\n📜 تمرير الصفحة:');
        console.log('   🎯 الاتجاه: end');
        console.log('   ⏳ جاري التمرير...');
        const scrollTarget = await currentPage.evaluate(() => document.body.scrollHeight - window.innerHeight);
        console.log('   📏 الموضع النهائي:', scrollTarget);
        
        // تمرير طبيعي وبشري مع محاكاة السلوك البشري
        await page.evaluate(({ from, to, duration, hasVariation }) => {
          return new Promise((resolve) => {
            const startTime = performance.now();
            const distance = to - from;
            const startPosition = window.scrollY;
        
            // حركات صغيرة عشوائية (Micro-movements)
            const microMoves = true;
            let lastMoveTime = startTime;
        
            const animate = (currentTime) => {
              const elapsed = currentTime - startTime;
              const progress = Math.min(elapsed / duration, 1);
        
              // استخدام دالة التسارع
              const easeProgress = progress < 0.5 ? 2 * progress * progress : -1 + (4 - 2 * progress) * progress;
        
              // الموضع الرئيسي
              let position = startPosition + distance * easeProgress;
        
              // إضافة حركات عشوائية صغيرة
              if (microMoves && (currentTime - lastMoveTime) > 50) {
                const microMove = (Math.random() - 0.5) * 3;
                position += microMove;
                lastMoveTime = currentTime;
              }
        
              window.scrollY = position;
              window.scrollTo(0, position);
        
              if (progress < 1) {
                requestAnimationFrame(animate);
              } else {
                // ضمان الوصول للموضع النهائي
                window.scrollTo(0, to);
                resolve();
              }
            };
        
            requestAnimationFrame(animate);
          });
        }, { 
          from: 0, 
          to: 999999, 
          duration: 800,
          hasVariation: true
        });
        
        // توقفات عشوائية (محاكاة القراءة أثناء التمرير)
        const pauses = [207.08353980857515,209.694703051832,203.32864087103712,204.5098104791074,221.307423931641,224.839323466243,201.7504933219953,222.72413294207203,221.91514773444987,219.04224221480027,210.24654392707907,225.65045762973833,229.69689407699803,221.42518008183535,208.6966157175609,202.58813113394396,200.28812063398993,229.05746420257543,227.56722254775448,218.17837308864253,227.16382715756725,217.54682866961508,205.1454902294618,210.281897474996,202.99886130392088,226.7176688161129,210.0692368232381,201.3529553674922,218.15180218557288,225.4142139715734,214.70963209510265,226.44682503717638,212.64408696167035,217.48366876702514,209.9152278846645,218.7505235011915,207.3462872138756,207.5103564372561,217.71674840057727,213.49215379127554,213.62917147935937,204.85107605401387,216.6839974857421,200.51950682886064,227.64092343764543,214.66348495193245,223.9623130092008,223.98422536356506,207.03542794354087,224.31353539024923,207.59100449800005,229.15028857538138,200.88249236337168,209.02509938320523,212.6325468898218,223.10985526046588,214.64396293353704,219.92789415377888,219.04477282153584,200.18252623735492,202.90668392208136,202.475021058224,203.429987662361,215.68890411960248,221.57145903517795,212.50595453105103,205.9002764661121,214.67794590185903,217.55987472954965,221.39725578100223,203.57764211179395,215.60968104480463,229.49353948374474,225.21692274640145,219.19377822738858,218.78247491483532,213.4083251174938,225.9841253551318,208.6177691213526,217.86719220140026,223.44618714306193,227.38174459624076,214.14399032994316,200.0609024840599,228.10135576849007,220.0674197700304,227.59500867984087,224.39398490496094,206.48245947448927,212.5679071472688,212.02944718465147,203.69133498845648,218.87170379256594,216.5410120503063,203.51523588152506,220.40642230281438,224.84471347007835,214.74270116435696,205.1092130272417,218.28285499953245,203.3173835439833,218.45633070730432,224.16108241925414,225.69829654080368,223.99890369277716,216.72073578256325,228.81185192228477,224.41420913420598,206.25207209232605,214.681852798947,228.74330546719816,220.82252582951085,228.76177678150788,219.27816227435284,202.79645779443518,207.73540118763853,218.3144442586331,218.76288352077387,221.6214138943928,221.81648600910015,210.42131311652074,223.49522173483143,221.05500151247247,217.98225481046742,207.68752367120587,224.12088423850932,214.3617163796795,208.12893490334054,209.1146485054427,205.04613330008522,203.10000593868972,215.57710305218936,202.9930252824867,212.79216267595683,220.42713828748285,218.81055852240343,209.36951490000183,207.61639959490793,225.17886565298983,229.71749085366343,218.94509509501964,207.3779322596364,209.41374114311867,204.37681185040896,212.09690953909353,223.1533808625032,215.351233934107,226.1893806246924,229.46263784915075,206.726737434037,223.07028422343927,201.1315236815042,200.87479992843132,220.8097854153737,203.0213177833973,205.63277695738148,215.03812907559433,201.30462550627635,203.2606240449242,225.91904331744564,224.34377206396775,228.8106652625228,216.59794110459978,216.5933750647608,202.1181264076456,208.06239076812383,224.25326559920023,214.8266254283737,229.85371341976494,228.04810440793992,214.5219853490358,223.5076178074794,206.57127455875232,200.55875761864854,211.4036382398648,213.97744205037674,226.65788874189622,203.564503933433,225.96690223342014,208.05330584681573,226.21425965723728,206.90222012718823,205.57559296625277,212.75831869349133,215.63345470711397,209.22937269515134,206.34979721441388,218.28288755742426,217.87905525521413,227.751915123193,212.14671997218707,214.96801003065892,223.80750474341932,209.57089744359106,227.22379367984513,204.234527169387,229.18026045089027,210.35016007873017,209.5105836607842,226.06397213988853,211.9925960678555,219.62724371716735,215.38875338382314,219.83300869518482,222.1802398817936,216.72249891037404,210.53001432922792,217.44355773136195,200.2943342111256,213.20146048905823,212.9974881857588,201.39465958335668,229.01145424633307,202.97965489012543,202.93138612054076,217.09527576660346,212.97255718587022,211.86267234031115,225.5936628104977,227.10554007533437,225.90563968028033,215.63291816713624,224.60496737094653,224.53453250878735,209.14951672859564,228.0135933346361,227.13109949520023,227.15884662166198,201.49084347751597,208.94261593763176,202.01505179202846,210.1148714197326,224.56605764226597,209.76887642419797,227.197676006506,204.32187780275436,227.0221620758333,222.77556658042252,208.13663619057454,207.9835406377528,211.65464300066458,215.64401853145435,202.81999943005005,224.39173448770373,214.72033396822644,224.76329623135354,208.61407841509512,206.7421029976098,228.5243899102527,204.74356848656882,214.313199387785,225.92320523369622,217.22644523599448,224.12741962121694,201.84243553283974,223.83709205129688,207.49229305304547,214.41554508429422,206.10028901442058,207.1367554168951,208.36434475422868,225.73625549825528,226.69717251103566,226.53121656973684,212.5224092708814,218.37773113187544,224.50552423954213,225.12087208091796,226.64659461192738,219.7818444381796,217.66945194576067,214.82753843848212,205.4484061279008,227.58793496866403,227.72024451227452,208.48695389298973,228.28266502008648,208.0236529921881,228.97277209086383,222.1363034051978,220.75789444597333,226.87092033044044,215.7094150370377,212.47921360521912,222.441897372861,205.15613553133454,208.02246145967902,210.17065485828422,228.24199038912053,221.63203401443897,210.74245122862135,205.9778242592296,218.46281394100959,213.0152145254094,200.4495523305552,226.59959395752392,201.67310453139623,204.02709296266414,218.2304801355333,215.48955050130184,218.8356974585276,228.9728349214211,213.93918680203328,224.85142231733414,218.38030306009952,215.02907080061155,214.59549561730685,207.45175157411236,224.3730707775738,225.1911359458491,216.92529870259585,217.15394913654512,222.44062569154028,213.67357021699877,222.226309047242,205.08754569705033,222.20093788148304,213.99471121059736,207.42496594698397,216.43578923027457,219.13377427059015,218.37935341262923,225.8767970360741,207.06309849763423,215.4725351084084,224.27616047761805,228.4675636021058,215.5070795713927,224.84843362184196,200.5213618115854,216.96691953068304,201.42545704776776,207.5656885900046,209.472722212586,225.55194541323277,204.93834601237774,218.52790748043475,205.5284497944582,210.047801349411,226.48529265877596,224.9246253500615,214.51573360838694,221.57063278597784,212.81020408437672,224.882795825799,212.6955312487856,203.88605450974362,217.11731030737855,214.08218309851335,214.61857767570663,220.72354330118236,225.931049825386,203.3027128373952,203.32990835908103,223.96342682028126,213.53854527094725,207.92575235037333,200.6200094535054,206.69257461961809,212.08737262686935,205.66980158462195,202.02193238795886,201.14361224074653,207.57926229647117,218.59656635494886,227.67469714689446,219.52798305402047,223.83976164127594,226.52361951205208,218.59290737067977,204.62395795899653,213.11323703593814,202.59830726423274,213.06029113086504,220.5159944432299,219.89959626001888,212.28612457456512,210.8723364472866,224.76774300378017,210.0356382816463,227.55541478071598,205.26313271019032,207.5484533184952,220.47198805295122,205.631651415092,225.52788595781448,221.73563593021623,212.06155785711,201.6302531561748,214.68205125490866,229.07923889138507,216.8230403990909,203.32689197435917,228.6515906021587,210.5412735802083,204.42208735420735,213.08956293374726,218.39581551434654,213.95720905136875,208.4177935339854,212.26207379862868,228.1706686190125,228.30443410122544,203.44386379039977,222.23651522505924,207.19646912715217,203.72154935371034,209.34306893136312,222.39081955631423,216.3265472088924,206.39774803322948,200.6695463205145,210.47447114685048,211.44506897996456,222.92805188464567,216.45404403649357,223.45249008299493,214.1840800259575,202.11645831095808,200.60046945837252,229.0510912374816,221.06620641281572,217.77810988337825,204.61641435153166,225.7337620940479,216.24521897680262,221.76927653584627,228.2995787559117,208.9125514686952,204.34759114514353,219.42451405575287,216.88693785237976,216.2288871359475,200.94423081362856,225.1384007876453,214.92597329186057,226.65893062895825,203.89585043931854,205.51623795162155,223.16427157536327,201.97733513638943,219.9831527463434,217.99746563385872,210.1443483704588,209.3610042458943,218.8378646104444,219.58879929682752,221.98510075057573,225.87072760479003,211.5116513528477,224.00684158508741,217.66504008833905,225.4337913277447,216.19232692197164,213.6180978510636,207.0636681053584,205.9089582337537,205.96646393784584,220.85256175325924,226.0390755323205,215.00770307830487,221.18661493403704,229.62693255455102,215.6783120774827,211.21064001739603,214.3247400276318,217.61517418232788,202.70655268043606,227.9838136515732,222.79517971923545,209.5078140137837,217.04445127626468,218.73213066999205,200.49219980744454,215.06640115024638,209.2664735162152,212.63797035940524,202.5403816449067,228.83836936750023,201.87961322758713,219.97677909799367,228.22989329597144,213.849712043183,219.9738532593491,222.93918177319756,214.89056619165027,216.29183131730989,207.29273244056614,225.62590874130075,228.49787029983966,201.30898285652043,212.60683146633696,205.02164348586865,212.91423267908397,225.50104003553946,219.5590295825586,228.7066514911985,228.9011692147099,206.0182411390768,211.86217532946182];
        for (const pauseDuration of pauses) {
          await page.waitForTimeout(pauseDuration);
        }
        console.log('   ✅ تم التمرير إلى نهاية الصفحة');
                break;
      } catch (stepError) {
        retries_step4--;
        if (retries_step4 === 0) {
          throw stepError;
        }
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    }

    // Step 5: التقاط صورة
    let retries_step5 = 3;
    while (retries_step5 > 0) {
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
        retries_step5--;
        if (retries_step5 === 0) {
          throw stepError;
        }
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    }

    // Step 6: فتح صفحة
    let retries_step6 = 3;
    while (retries_step6 > 0) {
      try {
        // 🌐 فتح صفحة جديدة
        console.log('\n🌐 فتح صفحة جديدة:');
        console.log('   📍 المتغير: d');
        console.log('   🔗 الرابط: https://www.duolingo.com/');
        try {
          console.log('   ⏳ جاري إنشاء صفحة جديدة من السياق...');
          const d = await context.newPage();
          console.log('   ✅ تم إنشاء الصفحة');
          console.log('   ⏳ جاري الانتقال إلى الرابط...');
          await d.goto("https://www.duolingo.com/", { waitUntil: 'networkidle' }).catch(() => {});
          console.log('   ✅ تم تحميل الصفحة');
          pages["d"] = d;
          currentPage = d;
          console.log('   ✅ تم تعيين الصفحة الحالية');
          console.log('   📌 الصفحة جاهزة للعمل');
        } catch (navError) {
          console.error('   ❌ خطأ في فتح الصفحة:', navError.message);
          throw navError;
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
        console.log('   ⏳ المدة: 5000ms (5.0s)');
        console.log('   ⏳ جاري الانتظار...');
        await currentPage.waitForTimeout(5000);
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

    // Step 8: التقاط صورة
    let retries_step8 = 3;
    while (retries_step8 > 0) {
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
        retries_step8--;
        if (retries_step8 === 0) {
          throw stepError;
        }
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    }

    // Step 9: العودة إلى صفحة
    let retries_step9 = 3;
    while (retries_step9 > 0) {
      try {
        // ↩️ العودة إلى الصفحة المحفوظة
        console.log('\n↩️ العودة إلى صفحة محفوظة:');
        console.log('   📍 اسم متغير الصفحة: proxy');
        console.log('   🔍 التحقق من وجود الصفحة في الذاكرة...');
        
        // التحقق من وجود الصفحة وصحتها
        if (!pages || typeof pages !== 'object') {
          const errorMsg = '❌ خطأ حرج: كائن الصفحات غير متوفر أو غير صحيح';
          console.error(errorMsg);
          throw new Error(errorMsg);
        }
        
        if (!pages["proxy"]) {
          const availablePages = Object.keys(pages).join(', ') || 'لا توجد صفحات';
          const errorMsg = '❌ لم يتم العثور على الصفحة: ' + "proxy" + '\n' +
            'الصفحات المتاحة: ' + availablePages;
          console.error(errorMsg);
          throw new Error(errorMsg);
        }
        
        const pageToSwitch = pages["proxy"];
        
        // التحقق من أن الصفحة هي كائن صفحة حقيقي (له الدوال المطلوبة)
        if (!pageToSwitch || typeof pageToSwitch !== 'object') {
          const errorMsg = '❌ خطأ: الصفحة المحفوظة ليست من نوع صفحة صحيح';
          console.error(errorMsg);
          throw new Error(errorMsg);
        }
        
        if (typeof pageToSwitch.bringToFront !== 'function') {
          const errorMsg = '❌ خطأ: الصفحة لا تحتوي على الدالة bringToFront - قد تكون URL بدلاً من page object';
          console.error(errorMsg);
          throw new Error(errorMsg);
        }
        
        try {
          console.log('   ⏳ جاري إحضار الصفحة إلى الواجهة...');
          await pageToSwitch.bringToFront();
          currentPage = pageToSwitch;
          console.log('   ✅ تم العودة بنجاح إلى الصفحة: proxy');
          console.log('   📌 الصفحة الحالية معدلة');
        } catch (pageError) {
          const errorMsg = '❌ خطأ في إحضار الصفحة: ' + pageError.message;
          console.error(errorMsg);
          throw new Error(errorMsg);
        }
                break;
      } catch (stepError) {
        retries_step9--;
        if (retries_step9 === 0) {
          throw stepError;
        }
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    }

    // Step 10: انتظار
    let retries_step10 = 3;
    while (retries_step10 > 0) {
      try {
        // ⏱️ انتظار زمني
        console.log('\n⏱️ الانتظار:');
        console.log('   ⏳ المدة: 5000ms (5.0s)');
        console.log('   ⏳ جاري الانتظار...');
        await currentPage.waitForTimeout(5000);
        console.log('   ✅ انتهت مدة الانتظار');
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
      recordVideo: false,
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
