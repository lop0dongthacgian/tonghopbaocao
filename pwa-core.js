const PWA_CONFIG = {
  APP_NAME:    'TỔNG HỢP BÁO CÁO',
  APP_DESC:    'Ứng dụng dùng tổng hợp báo cáo đa năng',
  APP_ICON:    'icon-1000.png',
  APP_VERSION: 'v1.0.0',
  THEME_COLOR: '#5b8dee',
  ACCENT_COLOR:'#7ec8e3',
  BADGE_LABEL: 'Lưu Hành Nội Bộ',
  SW_PATH:     'sw.js',
  SPLASH_DELAY:  3000,
  SPLASH_MAX:    6000,
  OVERLAY_DELAY: 1000,
  IOS_DELAY:     1500,
  ORIENTATION: 'portrait',
  WAKE_LOCK: true,
};

(function injectCSS() {
  const T = PWA_CONFIG.THEME_COLOR;
  const A = PWA_CONFIG.ACCENT_COLOR;
  const css = `
body{background:linear-gradient(135deg,#a8edea 0%,#b8d4f8 30%,#d0b8f5 60%,#f8c8e0 85%,#b8e8d0 100%)!important;}
#pwa-overlay{position:fixed;inset:0;z-index:1000000;background:rgba(0,0,0,.45);backdrop-filter:blur(24px) saturate(180%);-webkit-backdrop-filter:blur(24px) saturate(180%);display:none;align-items:center;justify-content:center;padding:14px;animation:pwaOverlayIn .25s ease both;}
#pwa-overlay.pwa-active{display:flex;}
@keyframes pwaOverlayIn{from{opacity:0}to{opacity:1}}
#pwa-card{width:94%;max-width:355px;max-height:88vh;overflow-y:auto;background:rgba(255,255,255,.82);backdrop-filter:blur(42px) saturate(200%);-webkit-backdrop-filter:blur(42px) saturate(200%);border-radius:26px;border:1px solid rgba(255,255,255,.85);padding:18px 16px 14px;box-shadow:0 30px 80px rgba(0,0,0,.28),inset 0 1px 0 rgba(255,255,255,.8);font-family:-apple-system,BlinkMacSystemFont,'SF Pro Display','Segoe UI',sans-serif;animation:pwaCardIn .38s cubic-bezier(.32,1.28,.64,1) both;}
@keyframes pwaCardIn{from{opacity:0;transform:scale(.9) translateY(14px);}to{opacity:1;transform:scale(1) translateY(0);}}
.pwa-icon-box{width:58px;height:58px;border-radius:18px;background:linear-gradient(135deg,${A},${T});display:flex;align-items:center;justify-content:center;margin:0 auto 10px;font-size:30px;box-shadow:0 10px 25px rgba(91,141,238,.28),inset 0 1px 0 rgba(255,255,255,.45);}
.pwa-app-name{font-size:20px;font-weight:800;color:${T};text-align:center;line-height:1.25;}
.pwa-app-desc{margin-top:3px;text-align:center;font-size:12px;color:rgba(0,0,0,.55);}
.pwa-badge{display:inline-block;margin-top:8px;padding:4px 10px;border-radius:999px;background:rgba(91,141,238,.10);border:1px solid rgba(91,141,238,.22);color:${T};font-size:11px;font-weight:700;}
.pwa-divider{height:1px;background:rgba(0,0,0,.08);margin:14px 0;}
.pwa-cta-text{text-align:center;font-size:16px;line-height:1.45;color:rgba(0,0,0,.78);margin-bottom:14px;}
#pwa-btn-install{width:100%;border:none;border-radius:18px;padding:14px;background:linear-gradient(135deg,${A},${T});color:#fff;font-size:18px;font-weight:800;display:flex;align-items:center;justify-content:center;gap:10px;cursor:pointer;box-shadow:0 10px 25px rgba(91,141,238,.35),inset 0 1px 0 rgba(255,255,255,.25);transition:.18s ease;}
#pwa-btn-install:active{transform:scale(.98);}
.pwa-warn{background:rgba(255,193,7,.14);border:1px solid rgba(255,193,7,.45);color:#7b5a00;border-radius:14px;padding:10px 12px;margin-bottom:12px;font-size:12px;font-weight:700;line-height:1.45;}
.pwa-step{display:flex;align-items:flex-start;gap:10px;margin-bottom:10px;padding:10px 12px;border-radius:16px;background:rgba(255,255,255,.55);border:1px solid rgba(255,255,255,.7);box-shadow:0 2px 10px rgba(0,0,0,.04),inset 0 1px 0 rgba(255,255,255,.6);}
.pwa-step-num{width:28px;height:28px;border-radius:50%;background:linear-gradient(135deg,#7ec8e3,#5b8dee);color:#fff;font-size:13px;font-weight:800;display:flex;align-items:center;justify-content:center;flex-shrink:0;box-shadow:0 5px 12px rgba(91,141,238,.28);}
.pwa-step-text{font-size:13px;line-height:1.5;color:rgba(0,0,0,.78);}
.pwa-after-note{margin-top:12px;text-align:center;font-size:14px;line-height:1.5;color:#7b2960;}
.pwa-dismiss,.pwa-ok{display:table;margin:14px auto 0;padding:7px 22px;border-radius:12px;font-size:13px;font-weight:600;cursor:pointer;transition:.18s;}
.pwa-dismiss{border:1px solid rgba(0,0,0,.12);background:rgba(0,0,0,.04);color:rgba(255,0,0,1);}
.pwa-ok{border:none;background:linear-gradient(135deg,#7ec8e3,#5b8dee);color:white;box-shadow:0 5px 15px rgba(91,141,238,.3);}
.pwa-ok:active{transform:scale(.98);}
.pwa-illus-btn{display:flex;align-items:center;justify-content:center;gap:7px;width:100%;margin:10px 0 4px;padding:10px 14px;border-radius:14px;border:1.5px solid rgba(91,141,238,.35);background:rgba(91,141,238,.07);color:#4a6fa5;font-size:13px;font-weight:700;cursor:pointer;transition:.18s;}
.pwa-illus-btn:hover{background:rgba(91,141,238,.14);}
.pwa-illus-btn .arrow{transition:.2s;display:inline-block;}
.pwa-illus-btn.open .arrow{transform:rotate(180deg);}
.pwa-illus-img-wrap{overflow:hidden;max-height:0;transition:max-height .4s ease;border-radius:14px;}
.pwa-illus-img-wrap.open{max-height:1200px;}
.pwa-illus-img-wrap img{width:100%;border-radius:14px;display:block;box-shadow:0 6px 20px rgba(0,0,0,.12);}
`;
  const style = document.createElement('style');
  style.textContent = css;
  document.head.appendChild(style);
})();

document.addEventListener('DOMContentLoaded', () => {
  const esc = (s) => s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
  const overlay = document.createElement('div');
  overlay.id = 'pwa-overlay';
  overlay.innerHTML = `
  <div id="pwa-card">
    <div style="text-align:center;margin-bottom:14px">
      <div class="pwa-icon-box">📲</div>
      <div class="pwa-app-name">${esc(PWA_CONFIG.APP_NAME)}</div>
      <div class="pwa-app-desc">${esc(PWA_CONFIG.APP_DESC)}</div>
      <div><span class="pwa-badge">${esc(PWA_CONFIG.BADGE_LABEL)}</span></div>
    </div>
    <div class="pwa-divider"></div>
    <div id="pwa-block-android" hidden>
      <div id="pwa-already-installed" hidden style="text-align:center;padding:18px 10px 10px;">
        <div style="font-size:48px;margin-bottom:10px;">✅</div>
        <div style="font-size:18px;font-weight:800;color:#2d7a4f;margin-bottom:6px;">✅ Ứng dụng đã được cài đặt</div>
        <div style="font-size:13px;color:rgba(0,0,0,.55);line-height:1.5;">Mở app từ màn hình chính để sử dụng<br>với trải nghiệm như ứng dụng gốc.</div>
      </div>
      <div id="pwa-install-content">
        <div class="pwa-cta-text">
          Đây là <b>App Web</b> dạng <b>PWA</b><br>
          Cài lên <b>Màn hình chính</b><br>
          Để mở nhanh như <b>Native App</b><br>
          <span style="font-size:14px;opacity:.72">(Không cần App Store hoặc Google Play)</span>
        </div>
        <button id="pwa-btn-install" type="button">📥 Cài đặt ứng dụng</button>
        <div class="pwa-after-note">
          ✅ Sau khi cài xong, mở app từ màn hình chính ➜ không cần vào link này nữa.<br>
          🗑️ Khi không còn dùng, để gỡ cài đặt: Nhấn giữ icon ➜ <b>Gỡ cài đặt</b>
        </div>
      </div>
    </div>
    <div id="pwa-block-ios" hidden>
      <div class="pwa-step"><div class="pwa-step-num">1</div><div class="pwa-step-text">Mở trang này bằng <b>Safari</b> 🧭 trên iPhone của bạn.</div></div>
      <div class="pwa-step"><div class="pwa-step-num">2</div><div class="pwa-step-text">Chạm vào ··· ở thanh công cụ phía dưới.</div></div>
      <div class="pwa-step"><div class="pwa-step-num">3</div><div class="pwa-step-text">Chạm vào nút <b>Chia sẻ</b> 📤 ở cửa sổ xổ ra.</div></div>
      <div class="pwa-step"><div class="pwa-step-num">4</div><div class="pwa-step-text">Cuộn xuống và chọn <b>"Thêm vào Màn hình chính"</b> ➕</div></div>
      <div class="pwa-step"><div class="pwa-step-num">5</div><div class="pwa-step-text">Nhấn <b>Thêm</b> ở góc trên bên phải để hoàn tất ✅</div></div>
      <div class="pwa-divider"></div>
      <div class="pwa-cta-text">Sau khi thêm, app sẽ xuất hiện trên màn hình chính iPhone 📱</div>
      <div class="pwa-after-note">✅ Sau khi cài xong, mở app từ màn hình chính ➜ không cần vào link này nữa.<br>🗑️ Khi không còn dùng, để gỡ cài đặt: Nhấn giữ icon app ➜ <b>Xoá bookmark</b></div>
      <button class="pwa-illus-btn" id="pwa-illus-toggle" type="button">🖼️ Xem hình minh hoạ <span class="arrow">▾</span></button>
      <div class="pwa-illus-img-wrap" id="pwa-illus-wrap"><img src="pwa.jpg" alt="Hướng dẫn cài PWA trên iPhone"></div>
    </div>
    <div id="pwa-button-container"></div>
  </div>`;
  document.body.appendChild(overlay);

  let isStandalone = window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone === true;
  let deferredPrompt = null;

  function isAppInstalled() {
    if (isStandalone) return true;
    try { if (localStorage.getItem('pwa_installed') === '1') return true; } catch(e) {}
    return false;
  }

  function updateDismissButton() {
    const container = document.getElementById('pwa-button-container');
    if (!container) return;
    if (isAppInstalled()) {
      container.innerHTML = '<button class="pwa-ok" id="pwa-btn-ok">👍 Đã hiểu</button>';
      document.getElementById('pwa-btn-ok')?.addEventListener('click', () => {
        document.getElementById('pwa-overlay').classList.remove('pwa-active');
      });
    } else {
      container.innerHTML = '<button class="pwa-dismiss" id="pwa-btn-dismiss">Để sau</button>';
      document.getElementById('pwa-btn-dismiss')?.addEventListener('click', () => {
        document.getElementById('pwa-overlay').classList.remove('pwa-active');
      });
    }
  }

  function setAndroidView() {
    const already = document.getElementById('pwa-already-installed');
    const content = document.getElementById('pwa-install-content');
    if (isAppInstalled()) {
      already?.removeAttribute('hidden');
      content?.setAttribute('hidden','');
    } else {
      already?.setAttribute('hidden','');
      content?.removeAttribute('hidden');
    }
    updateDismissButton();
  }

  window.matchMedia('(display-mode: standalone)').addEventListener('change', (e) => {
    isStandalone = e.matches;
    if (e.matches) try { localStorage.setItem('pwa_installed','1'); } catch(e) {}
    if (!document.getElementById('pwa-block-android')?.hidden) setAndroidView();
  });

  window.addEventListener('appinstalled', () => {
    try { localStorage.setItem('pwa_installed','1'); } catch(e) {}
    isStandalone = true;
    setAndroidView();
  });

  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt = e;
    try {
      if (localStorage.getItem('pwa_installed') === '1') {
        localStorage.removeItem('pwa_installed');
      }
    } catch(e) {}
    setAndroidView();
  });

  function showOverlay(type) {
    if (type === 'ios') {
      document.getElementById('pwa-block-ios')?.removeAttribute('hidden');
      document.getElementById('pwa-block-android')?.setAttribute('hidden','');
      updateDismissButton();
    } else {
      document.getElementById('pwa-block-android')?.removeAttribute('hidden');
      document.getElementById('pwa-block-ios')?.setAttribute('hidden','');
      setAndroidView();
    }
    document.getElementById('pwa-overlay').classList.add('pwa-active');
  }

  function hideOverlay() { document.getElementById('pwa-overlay').classList.remove('pwa-active'); }

  updateDismissButton();
  document.getElementById('pwa-illus-toggle')?.addEventListener('click', function(){
    const wrap = document.getElementById('pwa-illus-wrap');
    const btn = document.getElementById('pwa-illus-toggle');
    wrap.classList.toggle('open');
    btn.classList.toggle('open');
  });
  document.getElementById('pwa-overlay').addEventListener('click', (e) => { if(e.target === document.getElementById('pwa-overlay')) hideOverlay(); });
  document.getElementById('pwa-btn-install')?.addEventListener('click', async () => {
    hideOverlay();
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        try { localStorage.setItem('pwa_installed','1'); } catch(e) {}
        setAndroidView();
      }
      deferredPrompt = null;
    }
  });

  const isIOS = /iphone|ipad|ipod/i.test(navigator.userAgent);
  if (!isStandalone) {
    if (!isIOS && 'serviceWorker' in navigator) {
      setTimeout(() => { showOverlay('android'); }, PWA_CONFIG.OVERLAY_DELAY);
    } else if (isIOS) {
      setTimeout(() => { showOverlay('ios'); }, PWA_CONFIG.IOS_DELAY);
    }
  }
});