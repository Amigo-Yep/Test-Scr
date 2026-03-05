name: Android Emulator CI with Chrome Accept Precise

on:
  push:
    branches: [ "main" ]
  pull_request:
    branches: [ "main" ]
  workflow_dispatch:

jobs:
  emulator-video:
    runs-on: ubuntu-latest

    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Set up JDK 17
        uses: actions/setup-java@v4
        with:
          distribution: 'temurin'
          java-version: '17'

      - name: Install Android SDK
        uses: android-actions/setup-android@v3

      - name: Enable KVM group perms
        run: |
          echo 'KERNEL=="kvm", GROUP="kvm", MODE="0666", OPTIONS+="static_node=kvm"' | sudo tee /etc/udev/rules.d/99-kvm4all.rules
          sudo udevadm control --reload-rules
          sudo udevadm trigger --name-match=kvm
          ls -al /dev/kvm || true

      - name: Launch emulator and run script
        uses: reactivecircus/android-emulator-runner@v2
        with:
          api-level: 30
          target: google_apis
          arch: x86_64
          profile: pixel_5
          cores: 4
          avd-name: test
          force-avd-creation: true
          emulator-boot-timeout: 1200
          disable-animations: true
          emulator-options: "-no-window -gpu swiftshader_indirect"
          script: |
            adb wait-for-device
            adb shell input keyevent 82
            sleep 10
            # سجل فيديو بصيغة mp4 (مدعومة)
            adb shell screenrecord /sdcard/demo.mp4 &
            # افتح كروم
            adb shell am start -n com.android.chrome/com.google.android.apps.chrome.Main
            sleep 10
            # اضغط زر "Accept & continue"
            adb shell input tap 543 2121
            adb exec-out screencap -p > screenshot_accept.png
            sleep 5
            # ضغطة احترازية
            adb shell input tap 330 1446
            adb exec-out screencap -p > screenshot_confirm.png
            sleep 5
            # ضغطة إضافية عند الموقع الجديد
            adb shell input tap 132 2139
            adb exec-out screencap -p > screenshot_extra.png
            sleep 5
            # افتح الموقع المطلوب
            adb shell am start -a android.intent.action.VIEW -d "https://rescend.netlify.app/" com.android.chrome
            sleep 20
            # التقط صورة بعد فتح الموقع
            adb exec-out screencap -p > screenshot2.png
            # مرر لأسفل الصفحة عدة مرات
            adb shell input swipe 500 1500 500 200
            sleep 3
            adb shell input swipe 500 1500 500 200
            sleep 3
            adb shell input swipe 500 1500 500 200
            sleep 3
            adb shell input swipe 500 1500 500 200
            sleep 3
            adb shell input swipe 500 1500 500 200
            sleep 3
            # التقط صورة بعد الوصول لأسفل الصفحة
            adb exec-out screencap -p > screenshot_bottom.png
            # استخرج قائمة التطبيقات المثبتة
            adb shell pm list packages > apps.txt
            # أوقف تسجيل الفيديو
            adb shell pkill -l2 screenrecord
            # انسخ الفيديو من المحاكي
            adb pull /sdcard/demo.mp4 demo.mp4

      # - name: Convert video to webm
      #   run: |
      #     sudo apt-get update
      #     sudo apt-get install -y ffmpeg
      #     ffmpeg -i demo.mp4 -c:v libvpx-vp9 -b:v 1M demo.webm

      - name: Upload artifacts
        uses: actions/upload-artifact@v4
        with:
          name: emulator-artifacts
          path: |
            # demo.mp4
            # demo.webm
            screenshot_accept.png
            # screenshot_confirm.png
            screenshot_extra.png
            screenshot2.png
            screenshot_bottom.png
            # apps.txt
