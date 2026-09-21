// The SPA shell: renderAppHtml(env) returns the full HTML document including the ~9,000-line
// self-contained client-side app script, embedded verbatim as a template literal (not further
// split — it has no server-value interpolation except googleAdsGtagHead below).

import { googleAdsGtagHead } from "./blogHtml.js";
import { QR_TYPES_CLIENT_SRC } from "./qrTypes.js";
import { QR_DESIGN_CLIENT_SRC } from "./qrDesign.js";

export function renderAppHtml(env) {
  return `<!DOCTYPE html>
<html lang="vi">
<head>
<meta charset="UTF-8">
<script>(function(){try{var t=localStorage.getItem("shurl_theme");document.documentElement.setAttribute("data-theme",t==="dark"?"dark":"light");}catch(e){document.documentElement.setAttribute("data-theme","light");}})();</script>
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>SHORT Link — Multi-tier link shortening platform · Safe · Fast</title>
<meta name="description" content="Rút gọn link và tạo mã QR miễn phí, không cần đăng ký. Thống kê lượt click chi tiết, đặt tên link tuỳ chỉnh, giao diện tiếng Việt — nhanh và an toàn.">
<link rel="canonical" href="https://shurlvn.com/">
<meta property="og:type" content="website">
<meta property="og:title" content="SHORT Link — Multi-tier link shortening platform · Safe · Fast">
<meta property="og:description" content="Rút gọn link và tạo mã QR miễn phí, không cần đăng ký. Thống kê lượt click chi tiết, đặt tên link tuỳ chỉnh, giao diện tiếng Việt — nhanh và an toàn.">
<meta property="og:url" content="https://shurlvn.com/">
<link rel="icon" type="image/png" href="/favicon.ico">
<style>
.lang-pill{display:inline-flex;align-items:center;gap:6px;padding:6px 12px;border-radius:9999px;font-size:13px;font-weight:600;cursor:pointer;border:1px solid var(--input-border);background:transparent;color:var(--muted);position:relative;font-family:inherit;}
.lang-pill:hover{background:rgba(99,102,241,0.15);color:var(--text);}
.lang-dropdown{position:absolute;top:calc(100% + 6px);right:0;background:var(--card-solid);border:1px solid var(--border);border-radius:12px;padding:6px;min-width:160px;box-shadow:0 12px 32px var(--dropdown-shadow);z-index:60;}
.lang-dropdown .lang-item{display:flex;align-items:center;gap:8px;padding:8px 14px;border-radius:8px;font-size:13px;cursor:pointer;color:var(--text);}
.lang-dropdown .lang-item:hover{background:rgba(99,102,241,0.15);}
.lang-dropdown .lang-item.active{color:var(--lang-active-color);font-weight:700;}
#app{transition:opacity 0.18s ease, transform 0.18s ease;}
@keyframes modalPop{from{opacity:0;transform:translateY(20px) scale(0.95);}to{opacity:1;transform:translateY(0) scale(1);}}
@keyframes fadeInUp{from{opacity:0;transform:translateY(8px);}to{opacity:1;transform:translateY(0);}}
#app .card{animation:fadeInUp 0.35s ease-out both;}
#app .card:nth-of-type(2){animation-delay:0.05s;}
#app .card:nth-of-type(3){animation-delay:0.1s;}
#app .card:nth-of-type(4){animation-delay:0.15s;}
#app .card:nth-of-type(n+5){animation-delay:0.2s;}
.fade-in{animation:fadeInUp 0.25s ease-out;}
@keyframes shimmer{0%{background-position:-200% 0;}100%{background-position:200% 0;}}
.brand{transition:filter 0.3s ease;}
.brand:hover{filter:brightness(1.2);}
.btn{transition:all 0.2s ease;}
.btn-primary:hover{transform:translateY(-1px);box-shadow:0 6px 20px rgba(79,70,229,0.5);}
.card{transition:border-color 0.3s ease,box-shadow 0.3s ease;will-change:transform,opacity;}
.card:hover{border-color:rgba(99,102,241,0.4);}
.navlinks a,.navlinks button{transition:all 0.15s ease;}
.upsell-card{transition:transform 0.3s ease,box-shadow 0.3s ease;will-change:transform,opacity;}
.upsell-card:hover{transform:translateY(-2px);box-shadow:0 12px 28px rgba(99,102,241,0.2);}
.stat{transition:transform 0.2s ease;}
.stat:hover{transform:scale(1.02);}
@keyframes analyticsFlash{0%{color:var(--green,#22c55e);}100%{color:inherit;}}
.analytics-flash{animation:analyticsFlash 1s ease-out;}
.analytics-live-dot{display:inline-block;width:7px;height:7px;border-radius:50%;background:var(--green,#22c55e);animation:analyticsPulse 1.5s ease-in-out infinite;vertical-align:middle;}
@keyframes analyticsPulse{0%,100%{opacity:1;}50%{opacity:0.3;}}
.lang-pill,.theme-toggle{transition:all 0.2s ease;}
@keyframes qrPop{from{transform:scale(0.9);opacity:0;}to{transform:scale(1);opacity:1;}}
.lang-dropdown .lang-item{transition:background 0.15s ease;}

/* === Feedback Modal === */
.feedback-modal{position:fixed;inset:0;background:rgba(0,0,0,0.5);display:flex;align-items:center;justify-content:center;z-index:10001;}
.feedback-card{background:var(--card);border:1px solid var(--border);border-radius:16px;padding:0;max-width:480px;width:90%;max-height:85vh;overflow:hidden;box-shadow:0 20px 60px rgba(0,0,0,0.3);}
.feedback-header{padding:16px 20px;border-bottom:1px solid var(--border);display:flex;align-items:center;justify-content:space-between;}
.feedback-body{padding:20px;overflow-y:auto;max-height:calc(85vh - 140px);}
.feedback-footer{padding:12px 20px;border-top:1px solid var(--border);display:flex;justify-content:flex-end;gap:8px;}
.feedback-type-grid{display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-bottom:16px;}
.feedback-type-btn{padding:10px 12px;border:1px solid var(--border);border-radius:10px;background:var(--card);cursor:pointer;display:flex;align-items:center;gap:8px;font-size:13px;color:var(--text);transition:all 0.15s;}
.feedback-type-btn:hover{border-color:var(--indigo);}
.feedback-type-btn.active{border-color:var(--indigo);background:rgba(99,102,241,0.08);color:var(--indigo);font-weight:600;}
.feedback-textarea{width:100%;min-height:100px;padding:12px;border:1px solid var(--border);border-radius:10px;background:var(--card);color:var(--text);font-size:14px;font-family:inherit;resize:vertical;outline:none;}
.feedback-textarea:focus{border-color:var(--indigo);}
.feedback-input{width:100%;padding:10px 12px;border:1px solid var(--border);border-radius:10px;background:var(--card);color:var(--text);font-size:14px;font-family:inherit;outline:none;}
.feedback-input:focus{border-color:var(--indigo);}
.feedback-label{font-size:13px;font-weight:600;color:var(--text);margin-bottom:6px;display:block;}
.feedback-success{text-align:center;padding:20px;}
.feedback-success-icon{width:48px;height:48px;border-radius:50%;background:rgba(34,197,94,0.15);color:var(--green);display:flex;align-items:center;justify-content:center;margin:0 auto 12px;}

/* === Rainbow Crown Upgrade Hint === */
@keyframes crown-shimmer{0%,100%{filter:hue-rotate(0deg) brightness(1)}50%{filter:hue-rotate(30deg) brightness(1.15)}}
@keyframes crown-float{0%,100%{transform:translateY(0)}50%{transform:translateY(-2px)}}
.crown-hint{display:inline-flex;align-items:center;cursor:pointer;vertical-align:middle;margin-left:6px;animation:crown-float 2s ease-in-out infinite;}
.crown-hint svg{animation:crown-shimmer 3s ease-in-out infinite;}
.crown-hint:hover svg{filter:brightness(1.3) drop-shadow(0 0 6px rgba(255,255,255,0.4));}
.upgrade-demo-modal{position:fixed;inset:0;background:rgba(0,0,0,0.5);display:flex;align-items:center;justify-content:center;z-index:10001;}
.upgrade-demo-card{background:var(--card);border:1px solid var(--border);border-radius:16px;padding:0;max-width:520px;width:90%;max-height:85vh;overflow:hidden;box-shadow:0 20px 60px rgba(0,0,0,0.3);}
.upgrade-demo-header{padding:16px 20px;border-bottom:1px solid var(--border);display:flex;align-items:center;justify-content:space-between;}
.upgrade-demo-body{padding:20px;overflow-y:auto;max-height:calc(85vh - 120px);}
.upgrade-demo-footer{padding:12px 20px;border-top:1px solid var(--border);display:flex;justify-content:space-between;align-items:center;gap:8px;}
.upgrade-demo-step{display:flex;gap:12px;margin-bottom:14px;align-items:flex-start;}
.upgrade-demo-step-num{flex-shrink:0;width:24px;height:24px;border-radius:50%;background:var(--indigo);color:#fff;display:flex;align-items:center;justify-content:center;font-size:12px;font-weight:700;}
.upgrade-demo-anim{background:rgba(15,23,42,0.03);border:1px solid var(--border);border-radius:10px;padding:14px;margin:10px 0;font-family:monospace;font-size:12px;line-height:1.6;}
@keyframes demo-fade-in{from{opacity:0;transform:translateY(6px)}to{opacity:1;transform:translateY(0)}}
.demo-anim-item{animation:demo-fade-in 0.4s ease-out;}

/* === SIDEBAR LAYOUT === */
.app-shell{display:flex;min-height:100vh;}
.sb{width:60px;flex-shrink:0;background:var(--card-solid);border-right:1px solid var(--border);display:flex;flex-direction:column;position:sticky;top:0;height:100vh;overflow-y:auto;overflow-x:hidden;transition:width 0.2s ease;z-index:30;}
.sb:hover{width:240px;}
.sb .sb-label{opacity:0;transition:opacity 0.15s ease;white-space:nowrap;overflow:hidden;}
.sb:hover .sb-label{opacity:1;}
.sb .sb-section-label{opacity:0;transition:opacity 0.15s ease;}
.sb:hover .sb-section-label{opacity:1;}
.sb .sb-item{justify-content:center;padding:10px;}
.sb:hover .sb-item{justify-content:flex-start;padding:9px 12px;}
.sb .sb-brand-text{opacity:0;transition:opacity 0.15s ease;}
.sb:hover .sb-brand-text{opacity:1;}
.sb .sb-brand{justify-content:center;}
.sb:hover .sb-brand{justify-content:flex-start;}
.sb::-webkit-scrollbar{width:4px;}
.sb::-webkit-scrollbar-thumb{background:var(--border);border-radius:4px;}
.sb::-webkit-scrollbar-track{background:transparent;}
.sb-brand{display:flex;align-items:center;gap:8px;padding:16px 18px;cursor:pointer;font-weight:800;font-size:18px;flex-shrink:0;}
.sb-brand-text{background:linear-gradient(135deg,#818cf8,#c084fc);-webkit-background-clip:text;background-clip:text;color:transparent;}
.sb-toggle{display:none;}
.sb-nav{flex:1;padding:4px 8px;display:flex;flex-direction:column;gap:2px;}
.sb-section-label{font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:1px;color:var(--muted2);padding:14px 10px 6px;cursor:default;}
.sb-item{position:relative;overflow:visible;display:flex;align-items:center;gap:10px;padding:9px 12px;border-radius:10px;color:var(--muted);font-size:14px;font-weight:600;cursor:pointer;text-decoration:none;transition:all 0.15s ease;white-space:nowrap;}
.sb-item:hover{color:var(--indigo);background:rgba(99,102,241,0.12);}
.sb-item.active{color:var(--text);background:rgba(99,102,241,0.18);font-weight:700;}
.sb-item.active svg{color:var(--indigo);}
.sb-item svg{flex-shrink:0;color:var(--muted);transition:color 0.2s ease,filter 0.2s ease,transform 0.2s ease;}
.sb-item:hover svg{color:var(--indigo);filter:drop-shadow(0 0 6px rgba(99,102,241,0.55));transform:scale(1.08);}
.sb-item.active svg{color:var(--indigo);}
@keyframes bubbleUp1{0%{transform:translateY(0) scale(0);opacity:0;}25%{opacity:0.85;}100%{transform:translateY(-22px) scale(1);opacity:0;}}
@keyframes bubbleUp2{0%{transform:translateY(0) scale(0);opacity:0;}35%{opacity:0.65;}100%{transform:translateY(-28px) translateX(5px) scale(1);opacity:0;}}
.sb-item::before,.sb-icon-btn::before{content:"";position:absolute;left:18px;bottom:6px;width:5px;height:5px;border-radius:50%;background:var(--indigo);opacity:0;pointer-events:none;}
.sb-item::after,.sb-icon-btn::after{content:"";position:absolute;left:26px;bottom:5px;width:4px;height:4px;border-radius:50%;background:#a78bfa;opacity:0;pointer-events:none;}
.sb-item:hover::before,.sb-icon-btn:hover::before{animation:bubbleUp1 1.2s ease-in-out infinite;}
.sb-item:hover::after,.sb-icon-btn:hover::after{animation:bubbleUp2 1.5s ease-in-out infinite 0.3s;}
.sb-label{overflow:hidden;}
.sb-footer{padding:12px 8px;flex-shrink:0;}
.sb-main{flex:1;display:flex;flex-direction:column;min-width:0;}
.sb-header{position:sticky;top:0;z-index:20;background:rgba(var(--bg-rgb),0.9);backdrop-filter:blur(10px);border-bottom:1px solid var(--border);padding:12px 20px;display:flex;align-items:center;justify-content:space-between;gap:12px;flex-shrink:0;}
.sb-header-left{display:flex;align-items:center;gap:12px;}
.sb-header-brand{display:flex;align-items:center;gap:6px;font-weight:800;font-size:15px;cursor:pointer;white-space:nowrap;flex-shrink:0;}
.sb-header-brand span{background:linear-gradient(135deg,#818cf8,#c084fc);-webkit-background-clip:text;background-clip:text;color:transparent;}
.sb-mobile-toggle{display:none;background:transparent;border:1px solid var(--border);border-radius:8px;padding:8px;color:var(--text);cursor:pointer;align-items:center;}
.sb-search{display:flex;align-items:center;gap:8px;background:var(--input-bg);border:1px solid var(--input-border);border-radius:10px;padding:8px 14px;width:280px;max-width:40vw;}
.sb-search input{background:transparent;border:none;outline:none;color:var(--text);font-size:14px;font-family:inherit;flex:1;width:100%;}
.sb-search input::placeholder{color:var(--muted2);}
.sb-header-right{display:flex;align-items:center;gap:8px;}
.sb-icon-btn{position:relative;overflow:visible;background:transparent;border:1px solid var(--border);border-radius:10px;padding:8px;color:var(--muted);cursor:pointer;display:flex;align-items:center;transition:all 0.15s ease;}
.sb-icon-btn:hover{color:var(--indigo);background:rgba(99,102,241,0.12);border-color:rgba(99,102,241,0.4);box-shadow:0 0 12px rgba(99,102,241,0.25);}
.sb-icon-btn svg{transition:color 0.2s ease,filter 0.2s ease,transform 0.2s ease;}
.sb-icon-btn:hover svg{color:var(--indigo);filter:drop-shadow(0 0 6px rgba(99,102,241,0.55));transform:scale(1.08);}
@keyframes tool-shake{0%{transform:scale(1.1) rotate(0deg);}20%{transform:scale(1.1) rotate(-6deg);}40%{transform:scale(1.1) rotate(6deg);}60%{transform:scale(1.1) rotate(-3deg);}80%{transform:scale(1.1) rotate(3deg);}100%{transform:scale(1.1) rotate(0deg);}}
.sb-item:hover svg,.sb-icon-btn:hover svg{animation:tool-shake 0.4s ease-in-out;}
.sb-icon-btn .tooltip{position:absolute;top:calc(100% + 10px);left:50%;transform:translateX(-50%) translateY(-6px) scale(0.9);opacity:0;visibility:hidden;background:rgba(15,23,42,0.92);color:#fff;padding:6px 12px;border-radius:8px;font-size:12px;font-weight:500;white-space:nowrap;box-shadow:0 10px 15px -3px rgba(0,0,0,0.15),0 4px 6px -2px rgba(0,0,0,0.08);backdrop-filter:blur(4px);transition:all 0.2s cubic-bezier(0.175,0.885,0.32,1.275);pointer-events:none;z-index:80;}
.sb-icon-btn .tooltip::after{content:"";position:absolute;bottom:100%;left:50%;transform:translateX(-50%);border-width:5px;border-style:solid;border-color:transparent transparent rgba(15,23,42,0.92) transparent;}
.sb-icon-btn:hover .tooltip,.sb-icon-btn:focus-visible .tooltip{opacity:1;visibility:visible;transform:translateX(-50%) translateY(0) scale(1);}
@media (prefers-reduced-motion:reduce){.sb-item:hover svg,.sb-icon-btn:hover svg{animation:none;}.sb-icon-btn .tooltip{transition:none;}}
.sb-notif-dot{position:absolute;top:-2px;right:-2px;background:#ef4444;color:#fff;font-size:9px;min-width:16px;height:16px;border-radius:50%;display:none;align-items:center;justify-content:center;font-weight:700;padding:0 3px;}
.sb-user{display:flex;align-items:center;gap:8px;padding:6px 10px;border-radius:10px;border:1px solid var(--border);cursor:pointer;transition:all 0.15s ease;background:transparent;color:var(--text);font-family:inherit;}
.sb-user:hover{background:rgba(99,102,241,0.1);}
.sb-user-avatar{width:30px;height:30px;border-radius:50%;background:linear-gradient(135deg,#6366f1,#7c3aed);display:flex;align-items:center;justify-content:center;color:#fff;font-weight:700;font-size:13px;flex-shrink:0;}
.sb-user-info{display:flex;flex-direction:column;align-items:flex-start;line-height:1.2;}
.sb-user-name{font-size:13px;font-weight:700;}
.sb-user-role{font-size:11px;color:var(--muted);}
.sb-user-menu{position:absolute;top:calc(100% + 6px);right:0;background:var(--card-solid);border:1px solid var(--border);border-radius:12px;padding:6px;min-width:180px;box-shadow:var(--dropdown-shadow);z-index:60;display:none;}
.sb-user-menu.show{display:block;}
.sb-user-menu-item{display:flex;align-items:center;gap:10px;padding:9px 12px;border-radius:8px;font-size:13px;cursor:pointer;color:var(--text);font-weight:600;}
.sb-user-menu-item:hover{background:rgba(99,102,241,0.12);}
.sb-user-menu-item svg{color:var(--muted);flex-shrink:0;}
.sb-user-menu-sep{height:1px;background:var(--border);margin:4px 0;}
.sb-content{flex:1;padding:20px;overflow-x:hidden;}
.sb-content #app{transition:opacity 0.18s ease, transform 0.18s ease;}
.slide-panel{position:fixed;top:0;right:0;bottom:0;left:60px;z-index:26;display:none;flex-direction:column;background:var(--bg);box-shadow:-14px 0 36px rgba(15,23,42,0.22);transform:translateX(100%);transition:transform 0.4s cubic-bezier(0.22,0.85,0.3,1);will-change:transform;}
.slide-panel.open{transform:translateX(0);}
.slide-bar{display:flex;align-items:center;gap:14px;padding:10px 16px;flex:none;background:var(--card-solid);border-bottom:1px solid var(--border);}
.slide-back{display:inline-flex;align-items:center;gap:6px;}
.slide-title{font-size:15px;color:var(--text);white-space:nowrap;}
.slide-url{flex:1;min-width:0;max-width:460px;display:flex;justify-content:center;align-items:center;padding:6px 16px;border-radius:12px;background:var(--nm-bg);border:1px solid var(--border);box-shadow:inset 3px 3px 7px var(--nm-in),inset -3px -3px 7px var(--nm-hi);font-size:13px;cursor:pointer;overflow:hidden;white-space:nowrap;}
.slide-url:hover{border-color:var(--indigo);}
.slide-url-host{color:#1e293b;}
.slide-url-path{color:#94a3b8;overflow:hidden;text-overflow:ellipsis;}
.slide-body{flex:1;min-height:0;overflow:auto;}
.slide-frame{display:block;width:100%;height:100%;border:0;background:#f8fafc;}
.slide-legal{max-width:820px;margin:0 auto;padding:24px 20px 60px;}
@media(max-width:768px){.slide-panel{left:0;}}
@media(prefers-reduced-motion:reduce){.slide-panel{transition:none;}}
.sb-overlay{display:none;position:fixed;inset:0;background:var(--overlay-bg);backdrop-filter:blur(4px);z-index:25;}
.sb-overlay.show{display:block;}
.upsell-card{background:var(--upsell-bg);border:1px solid var(--upsell-border);border-radius:16px;padding:20px;overflow:visible;position:relative;min-height:180px;}
.upsell-card::before{overflow:hidden;}
.upsell-card::before{content:"";position:absolute;top:-40px;right:-40px;width:100px;height:100px;background:radial-gradient(circle,rgba(99,102,241,0.2),transparent);border-radius:50%;}
.upsell-card h3{font-size:17px;margin-bottom:8px;color:var(--upsell-h3);}
.upsell-card p{font-size:13px;color:var(--upsell-p);margin-bottom:14px;line-height:1.5;}
.upsell-card .feat{display:flex;align-items:center;gap:8px;padding:7px 0;font-size:13px;color:var(--upsell-feat);}
.upsell-card .feat .star{color:var(--upsell-star);flex-shrink:0;}
.upsell-card .btn{display:block;width:100%;padding:10px;border-radius:10px;border:none;background:var(--indigo);color:#fff;font-size:14px;font-weight:600;cursor:pointer;text-align:center;text-decoration:none;margin-top:14px;}
.upsell-card .btn:hover{background:#4f46e5;}
.ad-slot{background:var(--ad-slot-bg);border:1px dashed var(--ad-slot-border);border-radius:14px;padding:16px;text-align:center;min-height:200px;display:flex;align-items:center;justify-content:center;}
.ad-slot .ad-label{font-size:11px;color:var(--ad-label-color);text-transform:uppercase;letter-spacing:1px;}
.sidebar-right{display:none;}
@media(max-width:1024px){.sb{width:60px;}.sb .sb-label,.sb .sb-section-label{opacity:0;}.sb .sb-item{justify-content:center;padding:10px;}.sb .sb-brand-text{opacity:0;}.sb .sb-brand{justify-content:center;}.sb-search{width:200px;}}

:root{
  --bg:#090d16; --card:rgba(30,41,59,0.78); --card-solid:#111827; --border:rgba(99,102,241,0.25);
  --text:#f8fafc; --muted:#94a3b8; --muted2:#64748b;
  --indigo:#6366f1; --purple:#7c3aed; --sky:#38bdf8; --green:#10b981; --red:#f43f5e; --amber:#f59e0b;
  --bg-rgb:9,13,22; --muted-rgb:148,163,184;
  --shadow:0 20px 40px -20px rgba(0,0,0,0.6);
  --overlay-bg:rgba(2,6,16,0.7);
  --h2-color:#e0e7ff; --stat-num-color:#e0e7ff;
  --input-bg:rgba(15,23,42,0.85); --input-border:rgba(148,163,184,0.25);
  --stat-bg:rgba(15,23,42,0.6); --copybox-bg:rgba(15,23,42,0.9);
  --nm-in:rgba(15,23,42,0.42); --nm-card:#161e2e; --nm-bg:#ece8df; --nm-hi:rgba(255,255,255,0.06); --nm-lo:rgba(0,0,0,0.6); --nm-ring:rgba(129,140,248,0.75); --nm-label:#a5b4fc;
  --code-color:#a5b4fc; --link-color:#38bdf8;
  --tag-bg:rgba(99,102,241,0.12); --tag-color:#a5b4fc;
  --hover-row:rgba(99,102,241,0.05);
  --tab-active-bg:rgba(99,102,241,0.18); --tab-active-color:#c7d2fe; --tab-active-border:rgba(99,102,241,0.4);
  --tab-border:rgba(148,163,184,0.2);
  --btn-danger-color:#fda4af;
  --msg-error-color:#fda4af; --msg-ok-color:#6ee7b7;
  --lang-btn-border:#334155; --lang-btn-color:#94a3b8;
  --lang-active-color:#a5b4fc;
  --ad-slot-bg:#1e293b; --ad-slot-border:#334155; --ad-label-color:#475569;
  --upsell-bg:linear-gradient(160deg,#1e293b,#312e5f); --upsell-border:#4f46e5;
  --upsell-h3:#a5b4fc; --upsell-p:#94a3b8; --upsell-feat:#cbd5e1; --upsell-star:#fbbf24;
  --dropdown-shadow:0 12px 32px rgba(0,0,0,0.5);
}
[data-theme="light"]{
  --bg:#faf9f5; --card:#ffffff; --card-solid:#ffffff; --border:#e2e8f0;
  --text:#1e293b; --muted:#475569; --muted2:#64748b;
  --bg-rgb:255,255,255; --muted-rgb:71,85,105;
  --shadow:0 4px 12px rgba(0,0,0,0.08);
  --overlay-bg:rgba(0,0,0,0.3);
  --h2-color:#1e293b; --stat-num-color:#1e293b;
  --input-bg:#f8fafc; --input-border:#e2e8f0;
  --stat-bg:#f8fafc; --copybox-bg:#f8fafc;
  --nm-in:rgba(15,23,42,0.3); --nm-card:#ffffff; --nm-bg:#faf9f5; --nm-hi:#ffffff; --nm-lo:rgba(15,23,42,0.2); --nm-ring:rgba(99,102,241,0.5); --nm-label:#6366f1;
  --code-color:#6366f1; --link-color:#0ea5e9;
  --tag-bg:rgba(99,102,241,0.1); --tag-color:#6366f1;
  --hover-row:#f1f5f9;
  --tab-active-bg:rgba(99,102,241,0.1); --tab-active-color:#6366f1; --tab-active-border:rgba(99,102,241,0.3);
  --tab-border:#e2e8f0;
  --btn-danger-color:#e11d48;
  --msg-error-color:#e11d48; --msg-ok-color:#059669;
  --lang-btn-border:#e2e8f0; --lang-btn-color:#64748b;
  --lang-active-color:#6366f1;
  --ad-slot-bg:#f8fafc; --ad-slot-border:#e2e8f0; --ad-label-color:#94a3b8;
  --upsell-bg:linear-gradient(160deg,#f8fafc,#eef2ff); --upsell-border:#6366f1;
  --upsell-h3:#6366f1; --upsell-p:#64748b; --upsell-feat:#475569; --upsell-star:#f59e0b;
  --dropdown-shadow:0 8px 24px rgba(0,0,0,0.12);
}

*{box-sizing:border-box;}
body{margin:0;background:var(--bg);color:var(--text);
  font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Helvetica,Arial,sans-serif;min-height:100vh;}
a{color:var(--sky);text-decoration:none;}
.container{max-width:1080px;margin:0 auto;padding:20px;}
nav{position:sticky;top:0;z-index:20;background:rgba(var(--bg-rgb),0.9);backdrop-filter:blur(10px);
  border-bottom:1px solid var(--border);}
.navwrap{max-width:1080px;margin:0 auto;padding:14px 20px;display:flex;align-items:center;justify-content:space-between;gap:12px;flex-wrap:wrap;}.navlinks{display:flex;align-items:center;gap:6px;flex-wrap:wrap;}
.brand{font-weight:800;font-size:20px;background:linear-gradient(135deg,#818cf8,#c084fc);-webkit-background-clip:text;background-clip:text;color:transparent;cursor:pointer;}
.navlinks{display:flex;gap:6px;align-items:center;flex-wrap:wrap;}
.navlinks a,.navlinks button{color:var(--muted);background:transparent;border:none;padding:8px 12px;min-height:36px;box-sizing:border-box;display:inline-flex;align-items:center;border-radius:9px;font-size:14px;font-weight:600;cursor:pointer;font-family:inherit;}
.navlinks a:hover,.navlinks button:hover{color:var(--text);background:rgba(99,102,241,0.12);}
.navlinks a.active{color:var(--text);background:rgba(99,102,241,0.2);}
.badge{display:inline-block;padding:3px 10px;border-radius:9999px;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:0.5px;}
.badge-guest{background:rgba(148,163,184,0.15);color:#cbd5e1;border:1px solid rgba(148,163,184,0.3);}
.badge-free{background:rgba(56,189,248,0.15);color:#7dd3fc;border:1px solid rgba(56,189,248,0.3);}
.badge-pro{background:rgba(129,140,248,0.18);color:#a5b4fc;border:1px solid rgba(129,140,248,0.35);}
.badge-super{background:rgba(192,132,252,0.18);color:#d8b4fe;border:1px solid rgba(192,132,252,0.35);}
.badge-admin{background:rgba(244,63,94,0.15);color:#fda4af;border:1px solid rgba(244,63,94,0.3);}
.card{background:var(--card);backdrop-filter:blur(14px);border:1px solid var(--border);border-radius:20px;padding:26px;margin-bottom:20px;box-shadow:var(--shadow);}
h1{font-size:26px;margin:0 0 6px;}
h2{font-size:19px;margin:0 0 14px;color:var(--h2-color);}
p.sub{color:var(--muted);margin:0 0 20px;line-height:1.6;}
label{display:block;font-size:13px;color:var(--muted);margin:14px 0 6px;font-weight:600;}
input[type=text],input[type=url],input[type=password],input[type=email],input[type=date],textarea,select{
  width:100%;padding:12px 14px;border-radius:12px;border:1px solid var(--input-border);
  background:var(--input-bg);color:var(--text);font-size:14px;font-family:inherit;outline:none;}
input:focus,textarea:focus,select:focus{border-color:var(--indigo);}
textarea{min-height:110px;resize:vertical;}
.row{display:flex;gap:14px;flex-wrap:wrap;}
.home-duo{display:grid;grid-template-columns:1fr 1fr;gap:18px;align-items:stretch;}
.home-duo .card{display:flex;flex-direction:column;}
.home-duo .card .btn{align-self:flex-start;margin-top:auto;}
.home-mini{display:flex;gap:26px;margin:4px 0 18px;min-height:46px;}
.home-mini b{display:block;font-size:26px;color:var(--indigo);line-height:1.2;}
.home-mini span{font-size:12px;color:var(--muted);}
.tools-row{display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:16px;margin-bottom:20px;}
.tool-card{display:block;text-decoration:none;color:var(--text);margin-bottom:0;}
.tool-card:hover{border-color:rgba(99,102,241,0.6);transform:translateY(-2px);}
.tool-card h3{margin:0 0 6px;font-size:16px;display:flex;align-items:center;gap:8px;}
.tool-card svg{color:var(--indigo);}
@media(max-width:760px){.home-duo{grid-template-columns:1fr;}}
.row > *{flex:1;min-width:180px;}
.btn{display:inline-flex;align-items:center;gap:8px;padding:12px 22px;border-radius:12px;font-weight:700;
  border:none;cursor:pointer;font-size:14px;font-family:inherit;}
.btn-primary{background:linear-gradient(135deg,#4f46e5,#7c3aed);color:#fff;box-shadow:0 4px 14px rgba(79,70,229,0.4);}
.btn-primary:hover{filter:brightness(1.08);}
.btn-ghost{background:transparent;color:var(--muted);border:1px solid var(--input-border);}
.btn-ghost:hover{color:var(--text);border-color:rgba(148,163,184,0.5);}
.btn-danger{background:rgba(244,63,94,0.12);color:#fda4af;border:1px solid rgba(244,63,94,0.35);}
.btn-danger:hover{background:rgba(244,63,94,0.2);}
.btn-sm{padding:7px 12px;font-size:12px;border-radius:9px;}
.btn:disabled{opacity:0.4;cursor:not-allowed;}
.msg{padding:12px 16px;border-radius:12px;margin:14px 0;font-size:14px;font-weight:600;}
.msg-error{background:rgba(244,63,94,0.12);color:#fda4af;border:1px solid rgba(244,63,94,0.3);}
.msg-ok{background:rgba(16,185,129,0.12);color:#6ee7b7;border:1px solid rgba(16,185,129,0.3);}
.grid-stats{display:grid;grid-template-columns:repeat(auto-fit,minmax(160px,1fr));gap:14px;margin-bottom:20px;}
.stat{background:var(--stat-bg);border:1px solid var(--border);border-radius:16px;padding:18px;}
.stat .num{font-size:26px;font-weight:800;color:var(--stat-num-color);}
.stat .lbl{font-size:12px;color:var(--muted);margin-top:4px;}
table{width:100%;border-collapse:collapse;font-size:14px;}
th{text-align:left;color:var(--muted);font-size:12px;text-transform:uppercase;letter-spacing:0.4px;padding:10px 10px;border-bottom:1px solid var(--border);}
td{padding:12px 10px;border-bottom:1px solid var(--border);vertical-align:middle;}
tr:hover td{background:var(--hover-row);}
.mono{font-family:ui-monospace,SFMono-Regular,Menlo,Consolas,monospace;}
.tag{display:inline-block;background:var(--tag-bg);color:var(--tag-color);border-radius:8px;padding:2px 8px;font-size:11px;margin:2px 3px 0 0;}
.actions{display:flex;gap:6px;flex-wrap:wrap;}
.overlay{position:fixed;inset:0;background:var(--overlay-bg);backdrop-filter:blur(4px);display:flex;align-items:center;justify-content:center;z-index:50;padding:20px;}
.modal{background:var(--card-solid);border:1px solid var(--border);border-radius:20px;padding:26px;max-width:520px;width:100%;max-height:85vh;overflow:auto;}
.barrow{display:flex;align-items:center;gap:10px;margin:6px 0;font-size:12px;}
.barrow .lbl{width:70px;color:var(--muted);flex-shrink:0;}
.barrow .track{flex:1;background:rgba(var(--muted-rgb),0.1);border-radius:6px;height:14px;overflow:hidden;}
.barrow .fill{height:100%;background:linear-gradient(90deg,#6366f1,#a855f7);border-radius:6px;}
.barrow .cnt{width:36px;text-align:right;color:var(--muted);flex-shrink:0;}
.tabs{display:flex;gap:8px;margin-bottom:18px;flex-wrap:wrap;}
.tabs button{padding:9px 16px;border-radius:10px;border:1px solid rgba(148,163,184,0.2);background:transparent;color:var(--muted);cursor:pointer;font-weight:600;font-size:13px;font-family:inherit;}
.tabs button.active{background:rgba(99,102,241,0.18);color:#c7d2fe;border-color:rgba(99,102,241,0.4);}
.hint{font-size:12px;color:var(--muted2);margin-top:6px;}
.copybox{display:flex;gap:8px;align-items:center;background:var(--copybox-bg);border:1px dashed rgba(99,102,241,0.4);border-radius:12px;padding:12px 16px;margin:14px 0;word-break:break-all;}
.copybox .u{font-family:ui-monospace,monospace;color:var(--link-color);font-weight:700;flex:1;}
footer{text-align:center;color:var(--muted2);font-size:12px;padding:30px 20px;}
footer a{display:inline-flex;align-items:center;justify-content:center;min-height:36px;padding:0 6px;}
.site-footer{text-align:left;color:var(--muted);font-size:13px;padding:40px 0 26px;margin-top:40px;border-top:1px solid var(--border);}
.ft-grid{display:grid;grid-template-columns:minmax(260px,1.8fr) repeat(4,minmax(120px,1fr));gap:36px;}
.ft-logo{display:inline-block;font-size:20px;font-weight:800;letter-spacing:0.02em;background:linear-gradient(135deg,#6366f1,#a855f7);-webkit-background-clip:text;background-clip:text;color:transparent;margin-bottom:8px;}
.ft-brand p{margin:0 0 10px;line-height:1.6;}
.ft-brand .ft-biz{margin:12px 0 0;font-size:12px;line-height:1.8;}
.ft-col h4{font-size:12px;letter-spacing:0.06em;text-transform:uppercase;color:var(--text);margin:0 0 10px;}
.ft-col a,.ft-brand a{display:flex;justify-content:flex-start;min-height:30px;padding:0;color:var(--muted);text-decoration:none;}
.ft-brand a{display:inline-flex;}
.ft-col a:hover,.ft-brand a:hover{color:var(--indigo);}
.ft-bottom{margin:26px 0 0;padding-top:16px;border-top:1px solid var(--border);font-size:12px;color:var(--muted2);}
@media(max-width:900px){.ft-grid{grid-template-columns:1fr 1fr;}.ft-brand{grid-column:1/-1;}}
@media(max-width:640px){.row > *{min-width:100%;}}
/* === LANGUAGE SWITCHER === */
.upgrade-banner{background:var(--upsell-bg);border:1px solid var(--upsell-border);border-radius:12px;padding:14px 18px;margin-bottom:18px;display:flex;align-items:center;justify-content:space-between;gap:12px;}
.upgrade-banner b{color:var(--text);}
.upgrade-banner .hint{color:var(--muted);}
.lang-switch{display:flex;gap:6px;flex-wrap:wrap;}
.lang-btn{padding:4px 10px;border-radius:8px;border:1px solid var(--lang-btn-border);background:transparent;color:var(--lang-btn-color);font-size:12px;cursor:pointer;}
.lang-btn.active{background:#6366f1;color:#fff;border-color:#6366f1;}
/* === RESPONSIVE === */
.pricing-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:16px;}
@media(max-width:1024px){.pricing-grid{grid-template-columns:repeat(2,1fr);}}
@media(max-width:768px){.pricing-grid{grid-template-columns:1fr;}
.sb{position:fixed;left:0;top:0;transform:translateX(-100%);width:240px;transition:transform 0.25s ease;z-index:40;}
.sb.mobile-open{transform:translateX(0);}
.sb.mobile-open{width:240px;}
.sb.mobile-open .sb-label{opacity:1;}
.sb.mobile-open .sb-section-label{opacity:1;}
.sb.mobile-open .sb-item{justify-content:flex-start;padding:9px 12px;}
.sb.mobile-open .sb-brand-text{opacity:1;}
.sb.mobile-open .sb-brand{justify-content:flex-start;}
.sb-mobile-toggle{display:flex;}
.sb-search{display:none;}
.sb-user-info{display:none;}
.navwrap{padding:10px 12px;}
.navlinks{overflow-x:auto;white-space:nowrap;-webkit-overflow-scrolling:touch;max-width:calc(100vw - 24px);}
.navlinks::-webkit-scrollbar{display:none;}
.navlinks{-ms-overflow-style:none;scrollbar-width:none;}
.navlinks a,.navlinks button,.navlinks span{white-space:nowrap;}
}

/* === PHASE 2 UI === */
.page-head{display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:12px;margin-bottom:20px;}
.page-head h1{margin:0;font-size:22px;}
.page-head .page-actions{display:flex;gap:8px;flex-wrap:wrap;}
.breadcrumb{font-size:13px;color:var(--muted);margin-bottom:8px;display:flex;align-items:center;gap:6px;}
.breadcrumb a{color:var(--muted);text-decoration:none;cursor:pointer;}
.breadcrumb a:hover{color:var(--text);}
.breadcrumb .sep{opacity:0.5;}
.act-menu{position:relative;display:inline-block;}
.act-menu-btn{background:transparent;border:1px solid var(--border);border-radius:8px;padding:6px 10px;cursor:pointer;color:var(--muted);display:flex;align-items:center;transition:all 0.15s ease;}
.act-menu-btn:hover{color:var(--text);border-color:rgba(148,163,184,0.5);}
.act-menu-list{position:absolute;right:0;top:calc(100% + 4px);background:var(--card-solid);border:1px solid var(--border);border-radius:12px;padding:6px;min-width:180px;box-shadow:var(--dropdown-shadow);z-index:50;display:none;}
.act-menu-list.show{display:block;}
.act-menu-item{display:flex;align-items:center;gap:10px;padding:9px 12px;border-radius:8px;font-size:13px;cursor:pointer;color:var(--text);font-weight:600;white-space:nowrap;}
.act-menu-item:hover{background:rgba(99,102,241,0.12);}
.act-menu-item svg{color:var(--muted);flex-shrink:0;}
.act-menu-item.danger{color:var(--btn-danger-color);}
.act-menu-item.danger svg{color:var(--btn-danger-color);}
.act-menu-sep{height:1px;background:var(--border);margin:4px 0;}
.tbl-wrap{overflow-x:auto;border-radius:12px;}
.tbl-empty{text-align:center;padding:40px 20px;color:var(--muted);font-size:14px;}
.filter-bar{display:flex;gap:10px;align-items:center;flex-wrap:wrap;margin-bottom:16px;}
.filter-bar select,.filter-bar input{padding:8px 12px;border:1px solid var(--input-border);border-radius:10px;background:var(--input-bg);color:var(--text);font-size:13px;font-family:inherit;outline:none;}
.filter-bar select:focus,.filter-bar input:focus{border-color:rgba(99,102,241,0.5);}
.pagination{display:flex;gap:6px;align-items:center;justify-content:center;margin-top:16px;flex-wrap:wrap;}
.pagination button{padding:6px 12px;border:1px solid var(--input-border);border-radius:8px;background:transparent;color:var(--muted);cursor:pointer;font-size:13px;font-family:inherit;}
.pagination button:hover{color:var(--text);border-color:rgba(148,163,184,0.5);}
.pagination button.active{background:var(--indigo);color:#fff;border-color:var(--indigo);}
.pagination button:disabled{opacity:0.4;cursor:not-allowed;}
.stat-card{background:var(--stat-bg);border:1px solid var(--border);border-radius:16px;padding:20px;display:flex;flex-direction:column;gap:4px;}
.stat-card .stat-icon{width:36px;height:36px;border-radius:10px;display:flex;align-items:center;justify-content:center;background:rgba(99,102,241,0.12);color:var(--indigo);margin-bottom:8px;}
.stat-card .stat-value{font-size:28px;font-weight:800;color:var(--text);line-height:1;}
.stat-card .stat-label{font-size:12px;color:var(--muted);text-transform:uppercase;letter-spacing:0.5px;}
.section-label{font-size:12px;font-weight:700;color:var(--muted2);text-transform:uppercase;letter-spacing:1px;margin:0 0 12px;}
.time-filter{display:flex;gap:6px;margin-bottom:16px;flex-wrap:wrap;}
.time-filter button{padding:7px 14px;border:1px solid var(--input-border);border-radius:10px;background:transparent;color:var(--muted);cursor:pointer;font-size:13px;font-family:inherit;font-weight:600;transition:all 0.15s ease;}
.time-filter button:hover{color:var(--text);border-color:rgba(148,163,184,0.5);}
.time-filter button.active{background:var(--indigo);color:#fff;border-color:var(--indigo);}
.qr-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(200px,1fr));gap:16px;}
.qr-card{background:var(--card);border:1px solid var(--border);border-radius:16px;padding:16px;text-align:center;}
.qr-card img{max-width:100%;border-radius:8px;}
.qr-card .qr-link{font-size:13px;color:var(--indigo);word-break:break-all;margin-top:8px;font-weight:600;}
/* === AUTH SPLIT CARD (login/register) — diagonal wipe transition, no glow === */
.auth-wrap{display:flex;justify-content:center;padding:20px 0;}
.auth-split{position:relative;z-index:1;width:736px;max-width:100%;min-width:0;margin:0 auto;border-radius:20px;overflow:hidden;background:var(--card-solid);border:1px solid var(--border);box-shadow:var(--shadow);}
.auth-layer{min-height:440px;background:var(--card-solid);}
.auth-layer.current{position:relative;}
.auth-layer.incoming{position:absolute;inset:0;z-index:2;}
.auth-color{position:absolute;top:0;bottom:0;width:44%;background:linear-gradient(150deg,var(--indigo),var(--purple));color:#fff;display:flex;flex-direction:column;justify-content:center;padding:36px 30px;z-index:2;}
.auth-color h2{color:#fff;font-size:22px;margin:0 0 10px;}
.auth-color p{color:rgba(255,255,255,0.85);font-size:13px;line-height:1.6;margin:0 0 20px;}
.auth-color .btn-ghost-invert{background:rgba(255,255,255,0.14);color:#fff;border:1px solid rgba(255,255,255,0.45);border-radius:10px;padding:9px 20px;font-weight:700;font-size:13px;cursor:pointer;font-family:inherit;align-self:flex-start;}
.auth-color .btn-ghost-invert:hover{background:rgba(255,255,255,0.26);}
.auth-form-side{position:relative;z-index:1;min-height:440px;display:flex;align-items:center;padding:44px 36px;}
.auth-form-inner{width:100%;}
.auth-layer.mode-login .auth-color{left:56%;clip-path:polygon(14% 0,100% 0,100% 100%,0 100%);}
.auth-layer.mode-login .auth-form-side{padding-left:36px;padding-right:calc(44% + 26px);}
.auth-layer.mode-register .auth-color{left:0%;clip-path:polygon(0 0,86% 0,100% 100%,0 100%);}
.auth-layer.mode-register .auth-form-side{padding-left:calc(44% + 26px);padding-right:36px;}
/* Diagonal wipe: the incoming layer's OWN clip-path sweeps across at a constant diagonal angle
   (both edge points move by the same delta, so the slant never changes) — no card-wide translateX,
   no glow. The layer underneath (old mode) stays fully static until the wipe finishes. */
@keyframes authWipeInFromRight{
  0%{ clip-path:polygon(115% 0%, 100% 0%, 100% 100%, 100% 100%); }
  100%{ clip-path:polygon(0% 0%, 100% 0%, 100% 100%, -15% 100%); }
}
@keyframes authWipeInFromLeft{
  0%{ clip-path:polygon(0% 0%, 0% 0%, -15% 100%, 0% 100%); }
  100%{ clip-path:polygon(0% 0%, 115% 0%, 100% 100%, 0% 100%); }
}
.auth-layer.wipe-in-right{animation:authWipeInFromRight 0.7s cubic-bezier(.65,0,.35,1) both;}
.auth-layer.wipe-in-left{animation:authWipeInFromLeft 0.7s cubic-bezier(.65,0,.35,1) both;}
@media(max-width:640px){
  .auth-color{position:relative;width:100%;left:0!important;clip-path:none!important;padding:26px 22px;}
  .auth-layer{display:flex;flex-direction:column;}
  .auth-layer.mode-register{flex-direction:column-reverse;}
  .auth-form-side{padding:26px 22px!important;min-height:0;}
}
/* === QR WORKSPACE (#/bulkqr) === */
.qr-workspace{display:grid;grid-template-columns:1.1fr 1fr;gap:24px;align-items:start;}
.qr-step-label{font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:0.5px;color:var(--muted2);margin:18px 0 8px;}
.qr-step-label:first-child{margin-top:0;}
.qr-type-toggle{display:flex;gap:8px;margin-bottom:4px;}
.qr-type-btn{flex:1;padding:9px 12px;border:1px solid var(--input-border);border-radius:10px;background:var(--input-bg);color:var(--muted);font-weight:600;font-size:13px;cursor:pointer;font-family:inherit;display:flex;align-items:center;justify-content:center;gap:6px;transition:all 0.15s ease;}
.qr-type-btn.active{border-color:var(--indigo);background:rgba(99,102,241,0.12);color:var(--indigo);}
.qr-type-toggle{flex-wrap:wrap;}
.qr-type-btn{flex:1 1 30%;min-width:104px;}
.qr-tp{margin-top:6px;}
.qr-tp label{display:block;margin-top:10px;font-size:13px;}
.qr-tp .row > div{flex:1;min-width:150px;}
.qr-tp-err{color:#ef4444;font-size:12px;margin-top:8px;min-height:16px;}
.qd-panel{margin-top:6px;}
.qd-panel label{display:block;margin-top:10px;font-size:13px;}
.qd-panel label.qd-chk{display:flex;align-items:center;gap:8px;cursor:pointer;}
.qd-panel label.qd-chk input{width:auto;}
.qd-swatches{display:flex;gap:8px;margin-top:8px;}
.qd-swatch{width:28px;height:28px;border-radius:50%;border:2px solid var(--border);cursor:pointer;padding:0;}
.qd-chk-locked{display:flex;align-items:center;gap:8px;cursor:pointer;opacity:0.85;margin-top:10px;}
.qd-chk-locked input{width:auto;pointer-events:none;}
.qd-lock{display:inline-flex;align-items:center;justify-content:center;width:22px;height:22px;border-radius:50%;border:1.5px solid var(--muted2);color:var(--muted2);line-height:0;flex:none;}
.qd-chk-locked:hover .qd-lock{border-color:var(--indigo);color:var(--indigo);}
.qr-safe-note{margin-top:10px;padding:10px 12px;border-radius:10px;border:1px solid rgba(245,158,11,0.45);background:rgba(245,158,11,0.1);font-size:12px;line-height:1.55;color:var(--muted);}
.qr-safe-note a{color:var(--link-color);font-weight:600;}
.qr-preview-box.qd-card{width:300px;max-width:100%;height:auto;min-height:240px;padding:18px;overflow:visible;}
#qdLayoutRow{flex-wrap:wrap;}
.qd-preview-canvas{display:block;max-width:100%;max-height:440px;height:auto;margin:0 auto;border-radius:10px;box-shadow:0 6px 24px rgba(15,23,42,0.18);cursor:zoom-in;}
.qd-zoom{position:fixed;inset:0;z-index:10000;background:rgba(15,23,42,0.82);display:flex;align-items:center;justify-content:center;padding:20px;cursor:zoom-out;}
.qd-zoom img{max-width:100%;max-height:100%;border-radius:12px;box-shadow:0 10px 40px rgba(0,0,0,0.5);background:#fff;}
.qr-color-row{display:flex;gap:16px;flex-wrap:wrap;}
.qr-color-field{flex:1;min-width:130px;}
.qr-color-field label{display:block;margin-bottom:4px;}
.qr-color-input-wrap{display:flex;align-items:center;gap:8px;}
.qr-color-input-wrap input[type=color]{width:38px;height:34px;border:1px solid var(--input-border);border-radius:8px;cursor:pointer;background:none;padding:2px;flex-shrink:0;}
.qr-color-input-wrap input[type=text]{width:100%;padding:7px 10px;border:1px solid var(--input-border);border-radius:8px;background:var(--input-bg);color:var(--text);font-size:13px;font-family:ui-monospace,monospace;}
.qr-presets{display:flex;gap:6px;margin-top:6px;}
.qr-preset-swatch{width:22px;height:22px;border-radius:50%;border:2px solid var(--border);cursor:pointer;padding:0;}
.qr-preset-swatch:hover{border-color:var(--indigo);}
.qr-contrast-warn{margin-top:8px;font-size:12px;color:var(--amber);display:none;align-items:center;gap:6px;}
.qr-size-row{display:flex;gap:8px;flex-wrap:wrap;}
.qr-size-btn{padding:8px 14px;border:1px solid var(--input-border);border-radius:8px;background:var(--input-bg);color:var(--muted);font-size:13px;font-weight:600;cursor:pointer;font-family:inherit;}
.qr-size-btn.active{border-color:var(--indigo);background:rgba(99,102,241,0.12);color:var(--indigo);}
.qr-logo-upload-wrap{display:flex;align-items:center;gap:8px;flex-wrap:wrap;margin-top:4px;}
.qr-logo-upload-wrap img{width:34px;height:34px;border-radius:6px;object-fit:contain;background:var(--stat-bg);border:1px solid var(--border);}
.qr-logo-locked{display:inline-flex;align-items:center;gap:6px;padding:8px 12px;border:1px dashed var(--input-border);border-radius:8px;background:var(--input-bg);color:var(--muted2);font-size:13px;font-weight:600;cursor:pointer;margin-top:4px;opacity:0.75;}
.qr-logo-locked:hover{opacity:1;border-color:var(--indigo);color:var(--indigo);}
.qr-logo-locked-lock{display:flex;line-height:0;}
.qr-dotstyle-row{display:flex;gap:6px;flex-wrap:wrap;margin-top:4px;}
.qr-preview-card{position:sticky;top:16px;text-align:center;padding:22px 20px 26px;}
.qr-preview-card.qr-nm-card{background:var(--nm-card);backdrop-filter:none;border:1px solid transparent;border-radius:30px;padding:26px 22px 30px;box-shadow:12px 12px 28px var(--nm-lo),-12px -12px 26px var(--nm-hi);}
.qr-preview-well{position:relative;width:fit-content;max-width:100%;margin:14px auto 0;}
.qr-preview-well::before{content:attr(data-label);position:absolute;top:-11px;left:20px;z-index:2;padding:1px 10px;font-size:12px;font-weight:600;letter-spacing:0.02em;line-height:1.6;color:var(--nm-label);background:var(--nm-card);border-radius:9px;}
.qr-preview-box{width:240px;height:240px;margin:0 auto;border-radius:24px;background:var(--nm-bg);border:1.5px solid var(--nm-ring);box-shadow:inset 8px 8px 16px var(--nm-in),inset -8px -8px 16px var(--nm-hi);display:flex;align-items:center;justify-content:center;overflow:hidden;position:relative;box-sizing:border-box;}
.qr-preview-box img{max-width:100%;max-height:100%;display:block;}
.qr-preview-empty{color:#64748b;font-size:13px;padding:20px;line-height:1.6;}
.qr-preview-error{color:var(--red);font-size:13px;padding:20px;line-height:1.6;}
.qr-preview-data{margin-top:14px;font-size:12px;color:var(--muted);word-break:break-all;max-width:280px;margin-left:auto;margin-right:auto;}
.qr-download-row{display:flex;gap:10px;justify-content:center;margin-top:18px;flex-wrap:wrap;}
.qr-collapsible-toggle{font-size:13px;color:var(--link-color);cursor:pointer;display:inline-block;margin-top:4px;}
.qr-existing-select{width:100%;padding:8px 10px;border:1px solid var(--input-border);border-radius:8px;background:var(--input-bg);color:var(--text);font-size:13px;margin-top:8px;}
.qr-utm-grid{display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-top:10px;}
.qr-csv-drop{border:1px dashed var(--input-border);border-radius:10px;padding:14px;text-align:center;font-size:13px;color:var(--muted);margin-top:10px;}
.qr-mode-toggle{display:flex;gap:8px;margin-bottom:10px;}
.qr-mode-btn{flex:1;padding:11px 12px;border:1.5px solid var(--input-border);border-radius:10px;background:var(--input-bg);color:var(--muted);font-weight:700;font-size:13px;cursor:pointer;font-family:inherit;text-align:left;transition:all 0.15s ease;}
.qr-mode-btn small{display:block;font-weight:400;font-size:11px;color:var(--muted2);margin-top:2px;}
.qr-mode-btn.active{border-color:var(--indigo);background:rgba(99,102,241,0.1);color:var(--indigo);}
.qr-mode-btn.active small{color:var(--indigo);opacity:0.8;}
.qr-mode-btn-wrap{flex:1;position:relative;}
.qr-mode-btn-wrap .qr-mode-btn{width:100%;padding-right:28px;}
.qr-help-link{position:absolute;top:8px;right:8px;color:var(--muted2);opacity:0.7;line-height:0;text-decoration:none;}
.qr-help-link:hover{opacity:1;color:var(--indigo);}
.inline-help-link{color:var(--muted2);opacity:0.65;text-decoration:none;display:inline-flex;vertical-align:middle;margin-left:4px;}
.inline-help-link:hover{opacity:1;color:var(--indigo);}
.qr-analytics-banner{display:flex;align-items:center;gap:16px;background:linear-gradient(135deg,rgba(99,102,241,0.1),rgba(124,58,237,0.08));border:1px solid rgba(99,102,241,0.25);flex-wrap:wrap;}
.qr-analytics-banner-imgwrap{background:#fff;padding:10px;border-radius:12px;flex-shrink:0;line-height:0;}
.qr-analytics-banner img{width:160px;height:160px;display:block;}
.qr-analytics-banner-title{font-size:11px;font-weight:700;color:var(--indigo);text-transform:uppercase;letter-spacing:0.4px;display:flex;align-items:center;gap:4px;}
.qr-analytics-banner-name{font-size:15px;font-weight:600;margin-top:2px;color:var(--text);}
.qr-analytics-banner > a{margin-left:auto;}
@media(max-width:640px){.qr-analytics-banner{justify-content:center;text-align:center;}.qr-analytics-banner > a{margin-left:0;width:100%;justify-content:center;}}
.qr-quota-bar-wrap{margin:10px 0;font-size:12px;color:var(--muted);}
.qr-quota-bar-track{width:100%;height:6px;border-radius:3px;background:var(--stat-bg);border:1px solid var(--border);overflow:hidden;margin-top:4px;}
.qr-quota-bar-fill{height:100%;background:var(--indigo);border-radius:3px;transition:width 0.2s ease;}
.qr-quota-bar-fill.warn{background:var(--amber);}
.qr-dynamic-panel{margin-top:14px;padding-top:14px;border-top:1px dashed var(--border);}
.qr-dyn-terms-badge{display:flex;align-items:center;gap:6px;margin-top:10px;font-size:12px;color:var(--muted);cursor:pointer;}
.qr-dyn-terms-badge:hover{text-decoration:underline;}
.qr-dyn-teaser{position:relative;background:linear-gradient(160deg,var(--stat-bg),rgba(99,102,241,0.08));border:1px solid var(--border);border-radius:12px;padding:16px;}
.qr-dyn-teaser-lock{position:absolute;top:12px;right:12px;color:var(--muted2);opacity:0.7;}
.qr-dyn-teaser h4{margin:0 26px 8px 0;font-size:14px;}
.qr-dyn-teaser ul{list-style:none;margin:0 0 12px;padding:0;display:flex;flex-direction:column;gap:6px;}
.qr-dyn-teaser li{display:flex;align-items:center;gap:6px;font-size:12px;color:var(--muted);}
.qr-dyn-teaser li svg{flex-shrink:0;color:var(--indigo);}
.qr-quota-exceeded{background:rgba(245,158,11,0.1);border:1px solid rgba(245,158,11,0.3);border-radius:10px;padding:14px;font-size:13px;color:var(--text);}
.qr-quota-exceeded h4{margin:0 0 4px;color:var(--amber);font-size:14px;}
.qr-created-table{width:100%;border-collapse:collapse;font-size:13px;}
.qr-created-table th,.qr-created-table td{padding:8px 10px;border-bottom:1px solid var(--border);text-align:left;vertical-align:middle;}
.qr-created-table img{width:40px;height:40px;border-radius:6px;}
.qr-edit-target-row input{width:100%;padding:6px 8px;border:1px solid var(--input-border);border-radius:6px;background:var(--input-bg);color:var(--text);font-size:12px;}
.pager{display:flex;justify-content:flex-end;align-items:center;gap:4px;margin-top:12px;flex-wrap:wrap;}
.pager-btn{min-width:28px;height:28px;padding:0 8px;border:1px solid var(--input-border);border-radius:6px;background:var(--input-bg);color:var(--muted);font-size:12px;font-weight:600;cursor:pointer;font-family:inherit;}
.pager-btn.active{background:var(--indigo);color:#fff;border-color:var(--indigo);}
.pager-btn:disabled{opacity:0.35;cursor:default;}
.pager-ellipsis{color:var(--muted2);padding:0 2px;font-size:12px;}
@media(max-width:900px){
  .qr-workspace{grid-template-columns:1fr;}
  .qr-preview-card{position:static;}
  .qr-utm-grid{grid-template-columns:1fr;}
  .qr-created-table{display:block;overflow-x:auto;}
}
</style>
${googleAdsGtagHead(env)}
</head>
<body>
<div class="app-shell">
  <div class="sb-overlay" id="sbOverlay" onclick="closeSidebarMobile()"></div>
  <aside class="sb" id="sidebar">
    <div class="sb-brand" id="navBrand"><img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAIAAAACACAYAAADDPmHLAAA02ElEQVR42u19eZxV1ZH/t+rce9/aG01DN80mQY0NrohIRBq3JE4Mxkxem8loYtTEKGpi4i/LzMTHyzJZJ4tJ0GyjJpKYfk5iFpe4oK2IKKCiod0QRZq1gV7feu859fvj3tc0At3QLNLE8/kgH4R+795TdepUfavqW4R31gAryUhMIaQv0oC89S/tqtMSdflw3Wi4hemhWNk0Mi7B05BQDLqQ3VDI9CyJxaveiK3/+7q21tZtO318olmhYaUglTJv1xvSO0LexZ4kEoyGhj7BNAPqqpPfNzkfGXuCsaNTtR2bAYNRpKje4/BIqBDAFgADGANSBGMEMAZKF7TowhqlaBO7uVa4hWVWvudZZ9UdrVu3osf/SiEk0ox0k8EuNO0dBThYK5FQSN/Vd9orZ35sQj5cnRDLuUhUaKo4ZWHDNkhciBEABDEeSGAEEBBBDKCoCBBDi2IQE5QFZgJgwAaQYk7IuK8rt/uvcXfbb7cu+t1y2eEZ0gdNEd5RgJKpl3kCIkkA6m+nX3GehMov13b4TM8pjwlZgDaAGAPRQmIgpAhgAjQRDCACIQWAQPAtugj7OyxkQBASDRCJgCxiC4oEVrHTiDGL4WVvj715X/O2Vau6AQKSN/LBuBr+2RWAkGhmpJs0AFScesnZhfK6r3jh6jM1WyA3A2WK2iOHhJ1A4B6UKUKIIVAADEiML2cAAENAviKI/yfAP9CGAOMriQAsEBEwFDODiIFc5/NOfkvqi4/94u4UYNCYtNCS0gfSGtA/tfAhAEjipyQaTPm4bxed8g9quwzwCkZgBKQYAJHRUNDBKadAiIBAADBAvvhJxP+/RICQv7kifbtMwU8IGETK/7eiRRnXAARjxxRBw8p3LAp1rbmh56k7n/J/+EYGDow14H/aux4QgDh8xjX/Lzvy2MfysTEfFCIhN6MBwyAogiYSDQDQpKDZgiYLEmxb3+nxpbr9mIp/6gUG4utCoDgMAYNFQ5kc2BQAgLQKK60sRV7GkOsZHRk5Kzdi8sPOGdfeMAESBlK+NXjHAuwP4TcrpJv0pEnHjdo4cc4vCuXjL9DaA7Srg2P59i8RTawU2SFwb/vDFVuWfXzrsw+tLz37Owqwj8KPzfrU2YVo7c8oFDkKJud5YishPqT2gowREBuybOUUOtosd9vnexf+Ih28w36LEtQ/jfAbkxbuvUZHZ1x0bqFy0t90eOQoeHktxNahJvzgZBKImIyntROqdO0RCbvu3Rl97xefQDLJaGnBOwqwNyf/3mt0eMa/X1yoPvIOsUIhVcxoYUsJ8cHGXvZQA3ydFGYWAyMQmHDFe0PjGqL61u8+uL+U4PBXgERCIZ3S4fdc8e/uyEm3GeWEbC8nwjYbskFw98NtKAKhwCwHoUBwhvePLVDEpuhfDJHq00NjGyq8W79zPxLNCq1peUcBBrzzU7rq9I9+IF858S7DFimTF48iDDCUeH7ItldyEoHAACSlUwqyCJbNUNb2X8zk6wKCfy9DVgo/vLRI2JCIeBKpPC1eN94p3vMfD6ExaWFNi9kH9TpclxBAMmrqB0dvG3vsEs8pn0BuwY/CYIMgIPEgpEBBfC8BnMMQGGxXDD/MNwIYATksKgKCgHUOjCJIF7tc8Mui7DyICYaEtTtOMR0hRBDl+N9jPIguGmEG/P+AhGEoyCNA71ZI0mcNRAAyjiki1Lv+gz2P/fK+AD7W7yjAWxG+Z//Dco748D0mWnOWdgtaaNcWjyWI1UFgaARQLwwAhicwbKAiCgRYhc5uJbml0N7SKKPVM4WVMberfcPjf1jb3xZXH310mak9Y4Jtm9G92j7R49Ap2onPNHZsLEiDvLyBcSDEzChCwDC0h7CMEQM7xFahY23ZxmfO7VjxwMqhgkV0+Jr+Jh0+6wv/VSgf93VV6PQ8sqyBt0ECq2CCa4EBEc3MCpYDLnS0U6H3O+WZ1/6y7al7XjU73wyEpiY/i9jaSm89kQQgdtS0kbkx0xvZid9gwpWnGthgt6BBHhuySPYElxPxTZIxmkJRFcqsf37Suh9Mb00kPaRSsrce7eGnAMkkI5UyodM+MadYefQ9DB0yEBZi2v3WELiE10OVXCMD22Iu9HaQm7nFaW/9WW7FPev6rpdEmoE0/LQxsIvTR0gmCa2thM0NhDkwpeROA+C8esZVH2W76j/dyIijjAhgigKRvZOHkCbHVuGu17+Tf+TmL0vw7v/MCkCAYAIotO6cLy9DpGKKuDmjVYgDh2z33rB4PlQrtoAtY1NRUba9xe7eODez9M6V2yOKBtkHXN6vNQisQ8X4Y6vcI8/5WtGJXa2tKJPWWghqT48wiSdQYbDneuXrnzuxY8VdrUg08d74A4dXLiDRzASStjOu/7GJVk/hYlZrDjEbGUTTCUIMiAgxUcj0qmjXqhsuePhHZ2WW3rnSx+ElMOv7lJSRQDiERLPqevOFjuzDP7g2tq31LFXoXCdOWEFE7/GpJEXkeQZOzM6PqP0qgQQNDXt1BajDSPgK6SZdPvvjTV7F+G9rQ1qTpZS4EKjgXt+dEVSAaAE7sEyhEM5t+Hx3y69/1OpbDcbtKQ3fzu+/5cfvhMakVXji5tU86sjHoUJnwolUw2gDJtoDBQCIyNIZo53IMfa4qUv0bd97DUgooFX20GQeFhc/A18ztZNPq2mfNHupCVWMg3YhREwwvncvBiAEIRcAMUFYRUF+3zEkLtlday/NP/Gr3xyMXHzfamy00NLiOcecfaQZN71Fh6vqRBcNQXhg2+U7r8oUtQlVKjvXvtj9+7dOExEC0R499+FwBRASU6gRYnVOnH67iVROgHYBCPsYjL+BhhgG7AtePDA8KPHAxoMhRzM0R7pXX5l/4le/wbRP22hJeQcNI25p8ZBoVsUXH3o11tH6L1axe5MiACAz2I0CAIYtFjcvwvZJY0658HgQCZJJ/udQgMakQrpJLzvrmquLZWPPFc/1AGHsZEEZPgynwUFxhx9ViSbLUU6+/a7eRbf/EolmheW/8A76e6SbNBqTVtfSPz8Xzq7/D2LFIiQ0qA4SACISz+hQRXhrtP7yfx4fIJFQuHe+Lpt56XtyZeNvFWMsv5hj1/cnQcCiAWIYdiBQmuywCmU3PjOq/dmPdH3mjSLmTxW8XdmhNS0GjUmr+NiPnqH648cjMuIk0p6RgeDj4FUVNBk4AFsNFY61IH/XrZ3+1dgih6sFIDQ0S6IBTr6s7sfGisaVzm/fkV3+gA/w+iVdloAs2MWuYln3a59ds6KlE61NhLc7Ndji5xmi61f8P873bCRlE/klyLuLesEwMKQI2hMTKi/L1Uxu9K3jo4PKl4fx6WekyPy59tqfepERJ5Pbow3bPGCoJwRDpRotz4Qpp0I9bV9pf+ruRfuCp+/flTJI/EH1vPTw1kh+/XwQkUCZgQAsEg2BAsMzQhCxo+8HAIyaK4enAgTCijR+OuHFx3yK3LwmiDIDRU7ke/xSgnhtR3Fm80OfX3Tbj/wQMm0OmfdLNxmI0NhNj81Hofd1WCFFImbn4M3s8GeCMOkiGRWeOXbsqZGgfIwOMwVIMtLNZvRx54zywhXfN1ACAclg7kxQ3EkCQ6zYyndtVT1b5qZABg0r3757f3fufVOaX3rppa1K5+8FE4hgWKTk9PX5NAYEHWQTNREZo6E5NL7jyKmTgv06rBSAkPQr7ntHTLrNRKrHw/OMMLGfSaOBLgA/k08EW2cp1P3Gx3uW/uEVJD6i3s7evN2uzSsJAFmSuV/pAgyYhBDkLEzJpd1VSODBCStS8Zm+HzCwjIeXAiQSjFTKhE+9/MpCfMy52jMaBoUX4AweLhHEiBVhq9Bxc+/i394bmH59SL5rAEKN2LB8MdzcFrCtAL+7SJVArF2Ij0RIwNBa+47gqNbDJAoIhBV7z2VneFUTfqIR0oBhgoYyBsr4HTq7Fb8YI3ZYqXzXC8d0PflZQbLUjHmoLkEyyW2tS7aRl3+KlAKklNUwfZfArqAhgcBTofEEwO91HP4KQGhIyOTJCOVjNd/x7Lgtxiu58341Dw1wjYsIEcHKdxWsbauuXL58uYtkPyjtUF2P+vKxTf5ZH65WIqR8L0B0Pydwp3AHokK1Rx19dFnwijS8FSDRzJQi0zbmqm+Z6MjpcPOa/IoNCBiaLBhYAyV8jFEWh7Ibv5xf+vsnkUgcmvf+W1dgvp3ejY9YXgZEpISU39DW5wvspO0EEWjYI9bSxPjwDwNLzRynXfJhr2LM9eQWPCLNfh7kLY8vDBBDiQsFFyAFFk9TKKxC2S0P9D7+qx8f0vf+W1eQ2q2sjK6HMa7AEESkr/9wVyVkFBg20rYh5QwWCRziCpBkNCfM6BkXTCyU1f/AUxEBmM1Oqa7+jTIBxu/H+0ZUiO3sljVO75tzSQRIrxQMlxVkoPWmtT3amE4f5NxtBPAWR8DYVpQjw9kCEBKtRETSG5/4cy9aN4GKBQNi3j3a61f6GnZgKAQiEYaQ1bnm6u4l6VVoajpgXbYHSAMEAHo6X8tAvAwRAaREiP0rQPTuNYCZBcoevgqQTBLSaR2ZecllhcjI96LQo1kKiiSHATNkEpTjC2lSjgp1t/0i+9Tv7z10oN69X6Gy2hAxO0ENA5kA9FIyyOuwNaiyW4fkG/tOmq46tem03hFH/tpDyGXJKcM2IGa34vdT6Aok2rBtKcptfTHW+ugXsn6BhBl+ok8SkJJQzdFxkFUJ4/lVQL6tGxD2gsD1Mj2F4WkB0mmBCCkr1I5i992sjG04zEKOkQGtmgAwAg7DLnQWyzLrPt3e3toLajpEGwAHk7//W3tR6rSKRpUYMAyVFGCXUY8AIAKLdrnYme9/lQynK8CACFsW/fYV78HvXxj" width="24" height="24" alt="SHURL" style="width:24px;height:24px;aspect-ratio:1/1;vertical-align:middle;"> <span class="sb-brand-text">SHORT URL</span></div>
    
    <nav class="sb-nav" id="sbNav"></nav>
    <div class="sb-footer" id="sbFooter"></div>
  </aside>
  <div class="sb-main">
    <header class="sb-header">
      <div class="sb-header-left">
        <div class="sb-header-brand" onclick="navigate(&#39;home&#39;)"><img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAIAAAACACAYAAADDPmHLAAA02ElEQVR42u19eZxV1ZH/t+rce9/aG01DN80mQY0NrohIRBq3JE4Mxkxem8loYtTEKGpi4i/LzMTHyzJZJ4tJ0GyjJpKYfk5iFpe4oK2IKKCiod0QRZq1gV7feu859fvj3tc0At3QLNLE8/kgH4R+795TdepUfavqW4R31gAryUhMIaQv0oC89S/tqtMSdflw3Wi4hemhWNk0Mi7B05BQDLqQ3VDI9CyJxaveiK3/+7q21tZtO318olmhYaUglTJv1xvSO0LexZ4kEoyGhj7BNAPqqpPfNzkfGXuCsaNTtR2bAYNRpKje4/BIqBDAFgADGANSBGMEMAZKF7TowhqlaBO7uVa4hWVWvudZZ9UdrVu3osf/SiEk0ox0k8EuNO0dBThYK5FQSN/Vd9orZ35sQj5cnRDLuUhUaKo4ZWHDNkhciBEABDEeSGAEEBBBDKCoCBBDi2IQE5QFZgJgwAaQYk7IuK8rt/uvcXfbb7cu+t1y2eEZ0gdNEd5RgJKpl3kCIkkA6m+nX3GehMov13b4TM8pjwlZgDaAGAPRQmIgpAhgAjQRDCACIQWAQPAtugj7OyxkQBASDRCJgCxiC4oEVrHTiDGL4WVvj715X/O2Vau6AQKSN/LBuBr+2RWAkGhmpJs0AFScesnZhfK6r3jh6jM1WyA3A2WK2iOHhJ1A4B6UKUKIIVAADEiML2cAAENAviKI/yfAP9CGAOMriQAsEBEwFDODiIFc5/NOfkvqi4/94u4UYNCYtNCS0gfSGtA/tfAhAEjipyQaTPm4bxed8g9quwzwCkZgBKQYAJHRUNDBKadAiIBAADBAvvhJxP+/RICQv7kifbtMwU8IGETK/7eiRRnXAARjxxRBw8p3LAp1rbmh56k7n/J/+EYGDow14H/aux4QgDh8xjX/Lzvy2MfysTEfFCIhN6MBwyAogiYSDQDQpKDZgiYLEmxb3+nxpbr9mIp/6gUG4utCoDgMAYNFQ5kc2BQAgLQKK60sRV7GkOsZHRk5Kzdi8sPOGdfeMAESBlK+NXjHAuwP4TcrpJv0pEnHjdo4cc4vCuXjL9DaA7Srg2P59i8RTawU2SFwb/vDFVuWfXzrsw+tLz37Owqwj8KPzfrU2YVo7c8oFDkKJud5YishPqT2gowREBuybOUUOtosd9vnexf+Ih28w36LEtQ/jfAbkxbuvUZHZ1x0bqFy0t90eOQoeHktxNahJvzgZBKImIyntROqdO0RCbvu3Rl97xefQDLJaGnBOwqwNyf/3mt0eMa/X1yoPvIOsUIhVcxoYUsJ8cHGXvZQA3ydFGYWAyMQmHDFe0PjGqL61u8+uL+U4PBXgERCIZ3S4fdc8e/uyEm3GeWEbC8nwjYbskFw98NtKAKhwCwHoUBwhvePLVDEpuhfDJHq00NjGyq8W79zPxLNCq1peUcBBrzzU7rq9I9+IF858S7DFimTF48iDDCUeH7ItldyEoHAACSlUwqyCJbNUNb2X8zk6wKCfy9DVgo/vLRI2JCIeBKpPC1eN94p3vMfD6ExaWFNi9kH9TpclxBAMmrqB0dvG3vsEs8pn0BuwY/CYIMgIPEgpEBBfC8BnMMQGGxXDD/MNwIYATksKgKCgHUOjCJIF7tc8Mui7DyICYaEtTtOMR0hRBDl+N9jPIguGmEG/P+AhGEoyCNA71ZI0mcNRAAyjiki1Lv+gz2P/fK+AD7W7yjAWxG+Z//Dco748D0mWnOWdgtaaNcWjyWI1UFgaARQLwwAhicwbKAiCgRYhc5uJbml0N7SKKPVM4WVMberfcPjf1jb3xZXH310mak9Y4Jtm9G92j7R49Ap2onPNHZsLEiDvLyBcSDEzChCwDC0h7CMEQM7xFahY23ZxmfO7VjxwMqhgkV0+Jr+Jh0+6wv/VSgf93VV6PQ8sqyBt0ECq2CCa4EBEc3MCpYDLnS0U6H3O+WZ1/6y7al7XjU73wyEpiY/i9jaSm89kQQgdtS0kbkx0xvZid9gwpWnGthgt6BBHhuySPYElxPxTZIxmkJRFcqsf37Suh9Mb00kPaRSsrce7eGnAMkkI5UyodM+MadYefQ9DB0yEBZi2v3WELiE10OVXCMD22Iu9HaQm7nFaW/9WW7FPev6rpdEmoE0/LQxsIvTR0gmCa2thM0NhDkwpeROA+C8esZVH2W76j/dyIijjAhgigKRvZOHkCbHVuGu17+Tf+TmL0vw7v/MCkCAYAIotO6cLy9DpGKKuDmjVYgDh2z33rB4PlQrtoAtY1NRUba9xe7eODez9M6V2yOKBtkHXN6vNQisQ8X4Y6vcI8/5WtGJXa2tKJPWWghqT48wiSdQYbDneuXrnzuxY8VdrUg08d74A4dXLiDRzASStjOu/7GJVk/hYlZrDjEbGUTTCUIMiAgxUcj0qmjXqhsuePhHZ2WW3rnSx+ElMOv7lJSRQDiERLPqevOFjuzDP7g2tq31LFXoXCdOWEFE7/GpJEXkeQZOzM6PqP0qgQQNDXt1BajDSPgK6SZdPvvjTV7F+G9rQ1qTpZS4EKjgXt+dEVSAaAE7sEyhEM5t+Hx3y69/1OpbDcbtKQ3fzu+/5cfvhMakVXji5tU86sjHoUJnwolUw2gDJtoDBQCIyNIZo53IMfa4qUv0bd97DUgooFX20GQeFhc/A18ztZNPq2mfNHupCVWMg3YhREwwvncvBiAEIRcAMUFYRUF+3zEkLtlday/NP/Gr3xyMXHzfamy00NLiOcecfaQZN71Fh6vqRBcNQXhg2+U7r8oUtQlVKjvXvtj9+7dOExEC0R499+FwBRASU6gRYnVOnH67iVROgHYBCPsYjL+BhhgG7AtePDA8KPHAxoMhRzM0R7pXX5l/4le/wbRP22hJeQcNI25p8ZBoVsUXH3o11tH6L1axe5MiACAz2I0CAIYtFjcvwvZJY0658HgQCZJJ/udQgMakQrpJLzvrmquLZWPPFc/1AGHsZEEZPgynwUFxhx9ViSbLUU6+/a7eRbf/EolmheW/8A76e6SbNBqTVtfSPz8Xzq7/D2LFIiQ0qA4SACISz+hQRXhrtP7yfx4fIJFQuHe+Lpt56XtyZeNvFWMsv5hj1/cnQcCiAWIYdiBQmuywCmU3PjOq/dmPdH3mjSLmTxW8XdmhNS0GjUmr+NiPnqH648cjMuIk0p6RgeDj4FUVNBk4AFsNFY61IH/XrZ3+1dgih6sFIDQ0S6IBTr6s7sfGisaVzm/fkV3+gA/w+iVdloAs2MWuYln3a59ds6KlE61NhLc7Ndji5xmi61f8P873bCRlE/klyLuLesEwMKQI2hMTKi/L1Uxu9K3jo4PKl4fx6WekyPy59tqfepERJ5Pbow3bPGCoJwRDpRotz4Qpp0I9bV9pf+ruRfuCp+/flTJI/EH1vPTw1kh+/XwQkUCZgQAsEg2BAsMzQhCxo+8HAIyaK4enAgTCijR+OuHFx3yK3LwmiDIDRU7ke/xSgnhtR3Fm80OfX3Tbj/wQMm0OmfdLNxmI0NhNj81Hofd1WCFFImbn4M3s8GeCMOkiGRWeOXbsqZGgfIwOMwVIMtLNZvRx54zywhXfN1ACAclg7kxQ3EkCQ6zYyndtVT1b5qZABg0r3757f3fufVOaX3rppa1K5+8FE4hgWKTk9PX5NAYEHWQTNREZo6E5NL7jyKmTgv06rBSAkPQr7ntHTLrNRKrHw/OMMLGfSaOBLgA/k08EW2cp1P3Gx3uW/uEVJD6i3s7evN2uzSsJAFmSuV/pAgyYhBDkLEzJpd1VSODBCStS8Zm+HzCwjIeXAiQSjFTKhE+9/MpCfMy52jMaBoUX4AweLhHEiBVhq9Bxc+/i394bmH59SL5rAEKN2LB8MdzcFrCtAL+7SJVArF2Ij0RIwNBa+47gqNbDJAoIhBV7z2VneFUTfqIR0oBhgoYyBsr4HTq7Fb8YI3ZYqXzXC8d0PflZQbLUjHmoLkEyyW2tS7aRl3+KlAKklNUwfZfArqAhgcBTofEEwO91HP4KQGhIyOTJCOVjNd/x7Lgtxiu58341Dw1wjYsIEcHKdxWsbauuXL58uYtkPyjtUF2P+vKxTf5ZH65WIqR8L0B0Pydwp3AHokK1Rx19dFnwijS8FSDRzJQi0zbmqm+Z6MjpcPOa/IoNCBiaLBhYAyV8jFEWh7Ibv5xf+vsnkUgcmvf+W1dgvp3ejY9YXgZEpISU39DW5wvspO0EEWjYI9bSxPjwDwNLzRynXfJhr2LM9eQWPCLNfh7kLY8vDBBDiQsFFyAFFk9TKKxC2S0P9D7+qx8f0vf+W1eQ2q2sjK6HMa7AEESkr/9wVyVkFBg20rYh5QwWCRziCpBkNCfM6BkXTCyU1f/AUxEBmM1Oqa7+jTIBxu/H+0ZUiO3sljVO75tzSQRIrxQMlxVkoPWmtT3amE4f5NxtBPAWR8DYVpQjw9kCEBKtRETSG5/4cy9aN4GKBQNi3j3a61f6GnZgKAQiEYaQ1bnm6u4l6VVoajpgXbYHSAMEAHo6X8tAvAwRAaREiP0rQPTuNYCZBcoevgqQTBLSaR2ZecllhcjI96LQo1kKiiSHATNkEpTjC2lSjgp1t/0i+9Tv7z10oN69X6Gy2hAxO0ENA5kA9FIyyOuwNaiyW4fkG/tOmq46tem03hFH/tpDyGXJKcM2IGa34vdT6Aok2rBtKcptfTHW+ugXsn6BhBl+ok8SkJJQzdFxkFUJ4/lVQL6tGxD2gsD1Mj2F4WkB0mmBCCkr1I5i992sjG04zEKOkQGtmgAwAg7DLnQWyzLrPt3e3toLajpEGwAHk7//W3tR6rSKRpUYMAyVFGCXUY8AIAKLdrnYme9/lQynK8CACFsW/fYV78HvXxj" width="26" height="26" alt="SHURL" style="width:26px;height:26px;aspect-ratio:1/1;vertical-align:middle;"> <span>SHORT URL</span></div>
        <button class="sb-mobile-toggle" onclick="openSidebarMobile()" aria-label="Mở menu điều hướng"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg></button>
        <div class="sb-search" id="sbSearchBox"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="color:var(--muted);"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg><input type="text" id="sbSearchInput" placeholder="Tìm link..." oninput="sbSearchLinks(this.value)"></div>
      </div>
      <div class="sb-header-right" id="sbHeaderRight"></div>
    </header>
    <main class="sb-content">
      <div id="app" class="fade-in"></div>
      <div id="sidebarLeft" style="display:none;"></div>
      <div id="sidebarRight" style="display:none;"></div>
      <footer id="siteFooter" class="site-footer"><a href="/tools">Công cụ</a> · <a href="/blog">Blog</a> · <a href="#/terms">Điều khoản sử dụng</a> · <a href="#/privacy">Chính sách bảo mật</a></footer>
    </main>
  </div>
</div>
<script src="/assets/qr-scanner.umd.min.js"></script>
<script>
// Chỉ giữ tiếng Việt và tiếng Anh: 6 ngôn ngữ còn lại thiếu ~26% khóa (giao diện bị lẫn tiếng Việt) và chiếm ~23% dung lượng trang. Bản đầy đủ nằm trong lịch sử git.
var LANGS = ["vi", "en"];

var LANG_LABELS = {vi:"Tiếng Việt",en:"English"};
var currentLang = "vi";
var langDropdownOpen = false;
var langSubmenuOpen = false;

try { currentLang = localStorage.getItem("shurl_lang") || "vi"; } catch(e) {}
if (LANGS.indexOf(currentLang) < 0) currentLang = "vi"; // người dùng cũ từng chọn ngôn ngữ đã bỏ

var i18n = {
  vi: {
    // ===== NAV =====
    home:"Trang chủ", nav_home:"Trang chủ", plans:"Bảng giá", login:"Đăng nhập", register:"Đăng ký", logout:"Đăng xuất", language:"Ngôn ngữ",
    dashboard:"Bảng điều khiển", account:"Tài khoản", api:"API", bulk:"Bulk", admin:"Quản trị",
    // ===== AUTH =====
    login_sub:"Chào mừng quay lại SHURL.", login_security:"Bảo mật bởi Cloude · Tạo tài khoản để bắt đầu",
    auth_or:"hoặc", auth_google_login:"Đăng nhập với Google", google_login_error:"Đăng nhập Google thất bại. Vui lòng thử lại.",
    no_account:"Chưa có tài khoản?", have_account:"Đã có tài khoản?", demo_accounts:" ",
    auth_welcome_back:"Chào mừng trở lại!", auth_welcome_back_desc:"Đăng nhập để tiếp tục quản lý Short URL, QR Code và chiến dịch của bạn.",
    auth_hello_friend:"Xin chào, bạn mới!", auth_hello_friend_desc:"Tạo tài khoản miễn phí để bắt đầu rút gọn link và theo dõi hiệu quả.",
    register_sub:"Tạo tài khoản miễn phí để quản lý link.", register_free:"Đăng ký miễn phí",
    reg_username:"Tên đăng nhập (8-25 ký tự)", reg_email:"Email (tuỳ chọn)", reg_password:"Mật khẩu (tối thiểu 9 ký tự và có ít nhất 1 chữ viết hoa)",
    reg_newpassword:"Mật khẩu mới",
    // ===== FORGOT PASSWORD =====
    forgot_password:"Quên mật khẩu", forgot_sub:"Nhập tên tài khoản để nhận mã khôi phục qua email.", change_password:"Đổi mật khẩu", old_password:"Mật khẩu cũ", new_password:"Mật khẩu mới", confirm_password:"Xác nhận mật khẩu", send_code:"Gửi mã xác nhận", verify_code:"Mã xác nhận (6 số)", code_sent_to_email:"Mã xác nhận đã được gửi đến email của bạn.", code_sent:"Đã gửi mã xác nhận", password_changed:"Đổi mật khẩu thành công!", password_mismatch:"Mật khẩu xác nhận không khớp", password_too_short:"Mật khẩu phải tối thiểu 9 ký tự", fill_all_fields:"Vui lòng điền đầy đủ thông tin", sending:"Đang gửi...", processing:"Đang xử lý...", send_failed:"Gửi thất bại", change_failed:"Đổi mật khẩu thất bại", cancel:"Hủy", confirm:"Xác nhận", security_password:"Mật khẩu",
    forgot_submit:"Gửi mã khôi phục", reset_code:"Mã xác minh (6 số)", reset_submit:"Đổi mật khẩu",
    back_to_login:"Quay lại đăng nhập",
    // ===== HOME =====
    home_title:"Rút gọn link miễn phí", home_sub:"Tạo link rút gọn nhanh chóng, theo dõi lượt click, bảo vệ người dùng khỏi lừa đảo.",
    home_promo_title:"✨ Tạo tài khoản — 🎁 nhận 10 link miễn phí!",
    home_promo_sub:"Không thời hạn · Tên rút gọn tuỳ chỉnh · Quản lý link · Thống kê lượt click · QR nhanh gọn... các tính năng miễn phí",
    home_promo_desc:"Không thời hạn · Tên rút gọn tuỳ chỉnh · Quản lý link · Thống kê lượt click",
    home_promo_btn1:"Đăng ký miễn phí", home_promo_btn2:"Đã có tài khoản?",
    home_manage_title:"Quản lý link", home_manage_desc:"Xem lịch sử link, thống kê lượt click, sửa đích đến và đặt ngày hết hạn.", home_manage_btn:"Quản lý", home_manage_links:"Link của bạn", home_manage_clicks:"Lượt click",
    home_guest_manage_title:"Đăng nhập để quản lý link", home_guest_manage_desc:"Lưu lịch sử link, xem thống kê lượt click và tạo link với tên riêng.", home_guest_manage_btn:"Đăng nhập",
    dash_tools_title:"Công cụ miễn phí", dash_tools_desc:"Tiện ích chạy ngay trên trình duyệt, không cần đăng ký thêm.",
    home_qr_promo_title:"Tạo mã QR miễn phí", home_qr_promo_desc:"Chuyển link hoặc văn bản thành mã QR tuỳ chỉnh màu sắc, kích thước — dùng ngay, không cần đăng ký.", home_qr_promo_btn:"Tạo mã QR ngay",
    home_hero_sub:"Nền tảng rút gọn link đa tầng — an toàn, thống kê chi tiết, quản lý chiến dịch.",
    home_guest_hint:"Đăng nhập để đặt alias tuỳ chỉnh, quản lý và xem thống kê link. Khách: 5 link/ngày.",
    home_url_placeholder:"https://vi-du.com/duong-dan-rat-dai", home_alias_placeholder:"ten-rieng-cua-ban",
    home_note_placeholder:"Ghi chú cho link này", home_password_placeholder:"Để trống = không bảo vệ",
    home_add_dest:"thêm URL đích", home_dest_a:"URL đích A (thêm vào)", home_dest_b:"URL đích B (thêm vào)",
    url_to_shorten:"URL cần rút gọn", shorten_now:"Rút gọn ngay", processing:"Đang xử lý...",
    custom_alias:"Tên rút gọn tuỳ chỉnh", custom_alias_opt:"Tên rút gọn tuỳ chỉnh (tùy chọn)",
    title_field:"Tiêu đề", title_opt:"Tiêu đề (tùy chọn)", campaign:"Chiến dịch", tags:"Tags",
    expiry_date:"Ngày hết hạn (tùy chọn)", password_protect:"Bảo vệ bằng mật khẩu (tùy chọn)",
    custom_domain:"Tên miền riêng",
    pixel_tracking:"Pixel tracking", ab_testing:"A/B testing", deep_link:"Deep link", link_protect:"Link bảo vệ",
    adv_options:"⚙ Tuỳ chọn nâng cao (Pixel, A/B, Deep Link)", destination:"Đích", result_dest:"Đích:",
    // ===== QR CODE =====
    qr_title:"Tạo QR Code", qr_guest_title:"Tạo QR Code",
    qr_guest_desc:"Tùy chỉnh màu sắc · Tùy chỉnh kích thước", qr_guest_btn:"Tạo ngay",
    qr_desc:"Nhập bất kỳ URL nào (đã rút gọn hoặc chưa) để tạo QR Code ngay. Mỗi lần tạo QR trừ 1 lượt hạn mức/ngày.",
    qr_url_label:"URL cần tạo QR", qr_color:"Màu sắc", qr_size:"Kích cỡ", qr_btn:"Tạo QR",
    qr_bgcolor:"Màu nền", qr_bg_transparent:"Nền trong suốt", qr_margin:"Viền (margin)", qr_margin_default:"Mặc định", qr_format:"Định dạng",
    qr_logo_label:"Logo (tùy chọn)", qr_logo_upload_btn:"Tải lên logo", qr_logo_error_type:"Chỉ chấp nhận file PNG hoặc JPG.", qr_logo_error_size:"File quá lớn (tối đa 2MB).",
    qr_logo_locked_hint:"Đăng ký miễn phí để dùng logo riêng cho QR",
    qr_dot_style_label:"Kiểu QR", qr_dot_style_square:"Vuông", qr_dot_style_rounded:"Bo tròn", qr_dot_style_dots:"Chấm",
    qr_copy_link:"Sao chép link", qr_download:"Tải PNG", qr_processing:"Đang tạo QR...",
    qr_quota_error:"Hết lượt tạo QR hôm nay",
    qr_workspace_sub:"Tạo và tùy chỉnh QR Code trực tiếp — thay đổi gì cũng thấy ngay, không cần bấm tạo lại.",
    qr_step_type:"Chọn loại mã QR", qr_step_input:"Nhập dữ liệu", qr_step_customize:"Tùy chỉnh",
    qr_type_url:"URL", qr_type_text:"Văn bản", qr_text_label:"Nội dung văn bản",
    qr_preview_heading:"Xem trước", qr_preview_empty:"Nhập dữ liệu để xem trước QR Code",
    qr_preview_invalid:"URL không hợp lệ", qr_preview_error:"Không thể tạo QR Code. Vui lòng thử lại.",
    qr_download_svg:"Tải SVG",
    qr_use_existing:"hoặc chọn Short URL đã tạo", qr_use_existing_placeholder:"-- Chọn link --",
    qr_create_shorturl_btn:"Tạo Short URL", qr_shorturl_created:"Đã tạo:",
    qr_contrast_warning:"Màu QR và nền quá giống nhau, có thể khó quét.",
    qr_csv_label:"hoặc tải lên file CSV (cột URL)", qr_csv_detected:"Đã phát hiện URL từ CSV:",
    // ===== QR ĐỘNG (QR Studio) =====
    qr_mode_static:"QR tĩnh", qr_mode_dynamic:"QR động",
    qr_mode_static_hint:"Đích được ghi cố định vào mã QR — không thể đổi sau khi tạo.",
    qr_mode_dynamic_hint:"QR trỏ tới một Short URL — đổi đích bất cứ lúc nào mà không cần in lại mã QR.",
    qr_dyn_teaser_title:"QR động", qr_dyn_teaser_feat1:"Đổi URL đích sau này — không cần in lại QR", qr_dyn_teaser_feat2:"Theo dõi lượt quét (scan)",
    qr_dyn_teaser_cta_guest:"Đăng ký miễn phí để dùng thử", qr_dyn_teaser_cta_upgrade:"Nâng cấp để mở khoá QR động",
    qr_dyn_help_title:"QR động là gì? Xem hướng dẫn sử dụng chi tiết",
    qr_dynamic_title_label:"Tên gợi nhớ (tuỳ chọn)", qr_dynamic_title_placeholder:"VD: Poster sự kiện tháng 9",
    qr_dynamic_save_btn:"Lưu QR động", qr_dynamic_saving:"Đang lưu...",
    qr_dynamic_quota_label:"QR động đã dùng tháng này", qr_dynamic_quota_unlimited:"Không giới hạn",
    qr_dynamic_quota_exceeded_title:"Bạn đã dùng hết hạn mức QR động tháng này",
    qr_dynamic_quota_exceeded_desc:"Các QR động đã tạo trước đó vẫn hoạt động và quét bình thường. Nâng cấp gói để tạo thêm QR động ngay bây giờ.",
    qr_dynamic_not_available_title:"Gói hiện tại chưa hỗ trợ QR động",
    qr_dynamic_not_available_desc:"Nâng cấp lên Plus trở lên để tạo QR có thể đổi đích bất cứ lúc nào.",
    qr_dynamic_upgrade_btn:"Nâng cấp gói", qr_dynamic_created:"Đã lưu QR động!",
    qr_dynamic_created_desc:"Xem và quản lý ở mục “QR đã tạo” bên dưới.",
    qr_dyn_terms_title:"Cam kết sử dụng QR động",
    qr_dyn_terms_intro:"QR động cho phép bạn đổi đích liên kết bất cứ lúc nào mà không cần in lại mã QR mới — phù hợp cho menu nhà hàng, banner khuyến mãi, sản phẩm, sự kiện, danh thiếp... Trước khi sử dụng, vui lòng đọc và tuân thủ các quy tắc sau:",
    qr_dyn_terms_rule1:"Không sử dụng QR động để lừa đảo, giả mạo thương hiệu/tổ chức, hoặc đánh cắp thông tin cá nhân (phishing).",
    qr_dyn_terms_rule2:"Không trỏ đích đến nội dung vi phạm pháp luật Việt Nam: cờ bạc trái phép, mã độc/virus, khiêu dâm, hàng cấm.",
    qr_dyn_terms_rule3:"Bạn chịu trách nhiệm hoàn toàn về nội dung đích mỗi khi thay đổi sau khi phát hành QR.",
    qr_dyn_terms_rule4:"SHURL có quyền tạm ngưng hoặc xoá QR động vi phạm mà không cần báo trước.",
    qr_dyn_terms_link:"Xem đầy đủ Điều khoản sử dụng",
    qr_dyn_terms_agree_btn:"Tôi đã đọc và đồng ý", qr_dyn_terms_later_btn:"Để sau", qr_dyn_terms_close_btn:"Đóng",
    qr_dyn_terms_badge:"Cam kết tuân thủ điều khoản QR động",
    qr_created_list_title:"QR đã tạo", qr_created_list_empty:"Bạn chưa tạo QR động nào.",
    qr_created_col_qr:"QR", qr_created_col_title:"Tên", qr_created_col_short:"Short URL", qr_created_col_owner:"Tên User", qr_created_col_target:"Đích hiện tại",
    qr_created_col_scans:"Lượt quét", qr_created_col_created:"Ngày tạo", qr_created_col_actions:"Thao tác",
    qr_edit_target_btn:"Chỉnh sửa URL", qr_edit_target_title:"Đổi đích cho QR này",
    qr_edit_target_placeholder:"https://dich-moi.com", qr_edit_target_save:"Lưu đích mới", qr_edit_target_cancel:"Huỷ",
    qr_edit_target_success:"Đã cập nhật đích — mã QR không đổi, vẫn dùng được ngay.",
    qr_delete_qr_confirm:"Xoá QR động này? Short URL bên dưới vẫn hoạt động bình thường, chỉ mục quản lý này bị xoá.",
    qr_delete_qr_btn:"Xoá",
    qr_analytics_banner_title:"Thống kê cho QR động", qr_analytics_back:"← Quay lại QR đã tạo",
    // ===== BULK QR =====
    bulkqr:"Tạo QR hàng loạt", bulkqr_title:"Tạo mã QR hàng loạt", bulkqr_hint:"Mỗi dòng 1 link rút gọn. Tạo QR hàng loạt và tải về file Excel.",
    bulkqr_generate:"Tạo QR hàng loạt", bulkqr_download:"Tải Excel (.xls)", bulkqr_color:"Màu QR",
    bulkqr_empty:"Không có link hợp lệ.", bulkqr_max:"Tối đa {max} link/lần.",
    bulkqr_loading:"Đang tạo QR...", bulkqr_done:"Đã tạo {count} QR. Bấm 'Tải Excel' để tải về.",
    bulkqr_enter_list:"Vui lòng nhập danh sách link.", bulkqr_result_heading:"Kết quả ({count} QR)", bulkqr_col_link:"Link rút gọn", bulkqr_col_qr:"QR Code",
    bulkqr_super:"Tính năng cần gói Pro hoặc Super.",
    // ===== DASHBOARD =====
    my_links:"Link của tôi", total_clicks:"Tổng lượt click", daily_limit:"Hạn mức link/ngày",
    create_new:"Tạo link mới", create_success:"Tạo link thành công!",
    col_link:"Link", col_dest:"Đích", col_clicks:"Clicks", col_status:"Trạng thái", col_created:"Ngày tạo",
    status:"Trạng thái", created:"Ngày tạo", actions:"Thao tác",
    copy:"Chép", copied:"Đã copy ✓", stats:"Thống kê", edit:"Sửa", del:"Xoá",
    enabled:"Bật", disabled:"Tắt", deleted:"Đã xóa", link_expired_badge:"Hết hạn", undo_delete:"Hủy xóa", force_delete:"Xoá ngay",
    delete_link_title:"Xóa link?", delete_link_desc:"Link sẽ bị gạch và tự xóa sau 24h. Bạn có thể khôi phục trong thời gian này.", btn_ok:"Đồng ý", btn_cancel:"Hủy", maintenance_feature_prefix:"Tính năng đang bảo trì",
    pricing_downgrade_blocked:"Bạn đang ở gói {tier}, không thể mua gói thấp hơn!", acct_session_active:"Đang hoạt động", analytics_stats_hint:"Bấm vào \\\"Thống kê\\\" trên mỗi link trong Short URLs để xem chi tiết.",
    btn_confirm:"Xác nhận", btn_understood:"Đã hiểu", contact_support_btn:"✉️ Liên hệ hỗ trợ",
    qr_success_title:"Chúc mừng!", qr_success_desc1:"Tài khoản {user} đã được kích hoạt thành công lên gói {tier}.",
    qr_success_desc2:"Cảm ơn bạn đã tin tưởng và đồng hành cùng chúng tôi. Sự ủng hộ của bạn giúp {domain} ngày càng phát triển tốt hơn.",
    qr_success_desc3:"Chúc bạn có trải nghiệm tuyệt vời cùng chúng tôi!<br>Nếu cần hỗ trợ, liên hệ {email} — chúng tôi phản hồi sớm nhất có thể.",
    qr_fail_title:"Yêu cầu chưa thể xử lý", qr_fail_desc1:"Rất tiếc, giao dịch nâng cấp lên gói {tier} của bạn chưa được xác nhận thành công.",
    qr_fail_reason_label:"Lý do:", qr_fail_reason_default:"Không tìm thấy giao dịch khớp với nội dung chuyển khoản",
    qr_fail_desc2:"Vui lòng kiểm tra lại thông tin chuyển khoản, hoặc liên hệ {email} kèm ảnh chụp biên lai để được hỗ trợ nhanh nhất.",
    qr_revoked_title:"Giao dịch đã được thu hồi", qr_revoked_desc1:"Đã xảy ra lỗi trong quá trình kiểm tra giao dịch <strong>{order}</strong>.",
    qr_revoked_desc2:"Chúng tôi thành thật xin lỗi vì sự bất tiện này.", qr_revoked_desc3:"Nếu bạn đã thực hiện chuyển khoản, vui lòng liên hệ {email} để được hỗ trợ xử lý ngay.",
    stripe_success_title:"Thanh toán thành công!", stripe_success_desc1:"Tài khoản của bạn đã được nâng cấp lên gói {tier}.",
    stripe_success_desc2:"Gói sẽ hết hạn sau 30 ngày. Bạn có thể gia hạn bất cứ lúc nào.",
    stripe_cancel_title:"Thanh toán đã hủy", stripe_cancel_desc:"Bạn đã hủy giao dịch. Tài khoản không thay đổi. Bạn có thể thử lại bất cứ lúc nào.",
    voucher_success_title:"Mua voucher thành công!", voucher_success_desc1:"Voucher code đã được gửi đến email của bạn.",
    voucher_success_desc2:"Kiểm tra hộp thư (kể cả mục spam) để lấy voucher code. Bạn cũng có thể xem lại trong lịch sử thanh toán.",
    voucher_cancel_title:"Đã hủy mua voucher", voucher_cancel_desc:"Giao dịch đã bị hủy. Bạn có thể thử lại bất cứ lúc nào.",
    export:"Xuất CSV", optional:"Tùy chọn", no_data:"Chưa có dữ liệu.",
    delete_confirm:"Xoá link /", delete_warning:"? Hành động này không thể hoàn tác.",
    edit_title:"Sửa link /", edit_dest:"URL đích", edit_save:"Lưu thay đổi", edit_cancel:"Huỷ",
    edit_enabled:"Kích hoạt link", edit_tags_placeholder:"phân cách dấu phẩy",
    // ===== BULK =====
    bulk_title:"Tạo hàng loạt", bulk_sub:"Nhập mỗi URL trên 1 dòng. Giới hạn tối đa",
    bulk_per_batch:"link/lần.", bulk_input_placeholder:"https://vi-du1.com\\nhttps://vi-du2.com",
    bulk_submit:"Tạo hàng loạt", bulk_success:"Thành công", bulk_errors:"Lỗi", bulk_empty:"Vui lòng nhập ít nhất 1 URL.",
    bulk_csv_hint:"Mỗi dòng: URL,alias,campaign (alias và campaign không bắt buộc). Vd: https://vi-du.com,khuyen-mai,Q1-Sale",
    // ===== ANALYTICS =====
    analytics_title:"Thống kê", analytics_back:"← Quay lại bảng điều khiển",
    analytics_total:"Tổng clicks", analytics_24h:"24 giờ qua", analytics_7d:"7 ngày qua", analytics_30d:"30 ngày qua",
    analytics_14d:"14 ngày gần nhất", analytics_by_hour:"Theo giờ (24h)", analytics_device:"Thiết bị",
    analytics_country:"Quốc gia", analytics_browser:"Trình duyệt", analytics_referrer:"Nguồn giới thiệu",
    analytics_recent:"Lượt click gần đây", analytics_time:"Thời gian", analytics_no_clicks:"Chưa có lượt click nào.",
    // ===== ACCOUNT =====
    account_title:"Tài khoản", account_joined:"Tham gia", account_current_limits:"Hạn mức gói hiện tại",
    account_upgrade:"Nâng cấp gói", account_upgrade_sub:"Mở khoá toàn bộ tính năng mạnh mẽ để tăng năng suất.",
    account_pro:"Pro", account_pro_desc:"Dành cho marketer & creator",
    account_super:"Super", account_super_desc:"Dành cho doanh nghiệp & team",
    account_voucher:"Kích hoạt bằng mã Voucher", account_voucher_hint:"Có mã voucher? Nhập để nâng cấp miễn phí.",
    account_voucher_btn:"Nhập mã voucher", account_enter_voucher:"Nhập mã voucher:",
    acct_links_day:"Link/ngày", acct_detailed:"chi tiết", acct_max:"tối đa", yes:"Có", no:"Không",
    joined:"Tham gia", plan:"Gói",
    // ===== UPGRADE =====
    upgrade_pro:"Nâng cấp Pro", upgrade_super:"Nâng cấp Super", upgrade_plus:"Nâng cấp Plus",
    upgrade_to_unlock:"Nâng cấp để mở khoá tính năng này",
    feature_requires_account:"Tính năng chỉ dành cho tài khoản đăng ký / Pro / Super.",
    upgrade_banner_title:"Nâng cấp để mở khoá tính năng này",
    upgrade_banner_desc:"Pro: 200 link/ngày, bulk, API · Super: 600 link/ngày, custom domain",
    upgrade_banner_btn:"Nâng cấp →",
    enter_voucher:"Nhập mã voucher", activate_voucher:"Kích hoạt bằng mã Voucher",
    // ===== VOUCHER =====
    pricing_voucher_title:"Kích hoạt voucher", pricing_voucher_placeholder:"Nhập mã voucher",
    pricing_voucher_activate:"Kích hoạt", pricing_voucher_buy_link:"Mua voucher nhận khuyến mãi",
    pricing_voucher_select_prompt:"Chọn gói và thời gian để mua voucher trước (áp dụng khi có khuyến mãi).",
    pricing_voucher_choose_plan:"Chọn gói:", pricing_voucher_choose_time:"Chọn thời gian:",
    pricing_voucher_week:"1 tuần", pricing_voucher_month:"1 tháng", pricing_voucher_year:"1 năm",
    pricing_voucher_pay:"Thanh toán", pricing_voucher_save:"tiết kiệm", vn_pay_title:"🇻🇳 Thanh toán", vn_pay_select_period:"Chọn thời gian:", vn_pay_bank:"Ngân hàng:", vn_pay_acct_no:"Số tài khoản:", vn_pay_acct_name:"Chủ tài khoản:", vn_pay_amount:"Số tiền:", vn_pay_transfer_content:"Nội dung chuyển khoản:", vn_pay_security:"Giao dịch được bảo mật bởi ngân hàng. Quản trị viên duyệt trong vòng 1 giờ.", vn_pay_confirm:"Tôi đã chuyển khoản", vn_pay_processing:"Đang xử lý...", vn_pay_success:"Đã ghi nhận yêu cầu. Quản trị viên sẽ duyệt trong 1 giờ.",
    pricing_voucher_select_alert:"Vui lòng chọn gói và thời gian", pricing_voucher_enter_code:"Vui lòng nhập mã",
    pricing_voucher_invalid:"Voucher không hợp lệ",
    // ===== PRICING =====
    pricing_title:"Bảng giá & So sánh gói", pricing_hero_title:"Bảng giá minh bạch",
    pricing_hero_desc:"Chọn gói phù hợp với bạn. Nâng cấp hoặc huỷ bất cứ lúc nào. Không phí ẩn.",
    pricing_per_month:"/mo", pricing_free_desc:"Bắt đầu miễn phí",
    pricing_f_10links:"10 link/ngày", pricing_f_manage:"Quản lý link", pricing_f_clickstats:"Thống kê lượt click",
    pricing_plus_desc:"150 link/ngày", pricing_plus_btn:"Nâng cấp Plus",pricing_per_week:"/tuần",
    pricing_plus_f1:"150 link/ngày", pricing_plus_f2:"Link không hết hạn", pricing_plus_f3:"Rút gọn hàng loạt — 150 link/lần",
    pricing_f_qrdyn_plus:"QR động (đổi đích không cần in lại) — 20/tháng",
    pricing_f_qrdyn_pro:"QR động — 100/tháng · Bulk QR 50/lần",
    pricing_f_qrdyn_super:"QR động — 500/tháng · Bulk QR 200/lần",
    pricing_popular:"Phổ biến nhất", pricing_per_batch:"lần", pricing_per_link:"link", pricing_links:"link",
    pricing_day:"ngày", pricing_month:"tháng", pricing_req_month:"request/tháng", pricing_custom:"tuỳ chỉnh",
    pricing_advanced_mgmt:"Quản lý nâng cao", pricing_compare_title:"So sánh chi tiết", pricing_compare_feature:"Tính năng",
    pricing_expiry:"Hạn sử dụng link", pricing_unlimited_short:"∞", pricing_7days:"7 ngày",
    pricing_support:"Hỗ trợ", pricing_support_247:"24/7 + SLA",
    pricing_cta_title:"Sẵn sàng nâng cấp?", pricing_cta_desc:"Nâng cấp ngay hôm nay để mở khoá toàn bộ tính năng.",
    pricing_cta_btn:"Bắt đầu ngay",
    pricing_checkout_error:"Lỗi tạo thanh toán", pricing_connection_error:"Lỗi kết nối",
    pricing_error_notice:"Nếu quá trình thanh toán gặp lỗi hoặc không nhận được gói/voucher sau khi đã thanh toán, vui lòng gửi email kèm ảnh chụp màn hình giao dịch thành công (có ngày giờ cụ thể) đến",
    pricing_error_subject:"Lỗi thanh toán SHURL", pricing_error_body:"Mô tả lỗi:\\n\\nGói:\\nNgày giờ giao dịch:\\n\\nĐính kèm ảnh chụp giao dịch",
    pricing_error_desc:"Đội ngũ kiểm tra sẽ hoàn lại bằng voucher tương ứng trong thời gian sớm nhất.",
    pricing_footer:"SHURL — Nền tảng rút gọn link đa tầng · An toàn · Nhanh chóng",
    // ===== PLAN FEATURES =====
    plan_pro_f1:"200 link/ngày", plan_pro_f2:"300 link/lần", plan_pro_f3:"Quản lý nâng cao",
    plan_pro_f4:"chi tiết", plan_pro_f5:"QR Code", plan_pro_f6:"5.000 request/tháng",
    plan_pro_f7:"1 pixel/link, 50 link", plan_pro_f8:"2 URL, 20 link", plan_pro_f9:"iOS/Android",
    plan_pro_f10:"Deep link", plan_pro_f11:"Mật khẩu (tùy chọn)",
    plan_super_f1:"600 link/ngày", plan_super_f2:"600 link/lần", plan_super_f3:"Tất cả tính năng Pro",
    plan_super_f4:"nâng cao (heatmap)", plan_super_f5:"QR Code + bulk QR", plan_super_f6:"10.000 request/tháng",
    plan_super_f7:"Tên miền riêng", plan_super_f8:"2 pixel/link, ∞", plan_super_f9:"3 URL, % tuỳ chỉnh, ∞",
    plan_super_f10:"fallback thông minh", plan_super_f11:"chống dò mật khẩu",
    plan_ps_f1:"600 link/ngày (Pro x6)", plan_ps_f2:"600 link/lần", plan_ps_f5:"10.000 request/tháng (x10)",
    plan_ps_f8:"3 URL, % tuỳ chỉnh, ∞", plan_ps_f9:"fallback thông minh",
    plan_unlimited:"không giới hạn", plan_advanced:"nâng cao", plan_priority_support:"Ưu tiên hỗ trợ",
    // ===== FAQ =====
    pricing_faq_title:"Câu hỏi thường gặp",
    pricing_faq1_q:"Tôi có thể huỷ bất cứ lúc nào không?", pricing_faq1_a:"Có. Bạn có thể huỷ gói bất cứ lúc nào. Sau khi huỷ, tài khoản trở về gói Free nhưng link cũ vẫn giữ nguyên.",
    pricing_faq2_q:"Tôi có thể thanh toán bằng voucher không?", pricing_faq2_a:"Có. Nếu có mã voucher, bạn vào Tài khoản → Nhập mã voucher để nâng cấp miễn phí.",
    pricing_faq3_q:"Link cũ có bị mất khi hạ gói không?", pricing_faq3_a:"Không. Tất cả link đã tạo vẫn giữ nguyên. Chỉ tính năng nâng cao bị khoá khi hạ gói.",
    pricing_faq4_q:"Tôi có thể dùng custom domain không?", pricing_faq4_a:"Tên miền riêng chỉ có ở gói Super. Bạn cần trỏ DNS về SHURL.",
    pricing_faq5_q:"API có giới hạn rate limit không?", pricing_faq5_a:"Pro: 5.000 request/tháng. Super: 10.000/tháng.",
    pricing_faq6_q:"Gói Plus có gì khác?", pricing_faq6_a:"Plus cho phép 150 link/ngày và bulk shorten 150 link/lần. Link không hết hạn, phù hợp cho mọi nhu cầu.",
    pricing_faq7_q:"Mua voucher có rẻ hơn nâng cấp trực tiếp không?", pricing_faq7_a:"Chỉ trong thời gian khuyến mãi (do admin thiết lập). Ngoài khuyến mãi, giá voucher bằng giá nâng cấp trực tiếp.",
    // ===== PAYMENT =====
    pay_history_title:"Lịch sử thanh toán", pay_type:"Loại", pay_date:"Ngày thanh toán", pay_status:"Trạng thái",
    pay_voucher:"Voucher", pay_upgrade:"Nâng cấp", pay_success:"Thành công", pay_failed:"Lỗi", pay_no_history:"Chưa có giao dịch nào.",
    // ===== TIER LIMITS =====
    tier_limits_title:"Hạn mức gói hiện tại", links_per_day:"Link/ngày", advanced_mgmt:"Quản lý nâng cao",
    detailed_stats:"Thống kê chi tiết", max:"tối đa",
    // ===== BROWSER EXTENSION =====
    ext_title:"Kết nối tiện ích trình duyệt",
    ext_desc:"Dùng mã này để kết nối tiện ích SHURL trên Chrome — xem link vừa tạo, số lượt click và rút gọn nhanh link đang xem, ngay trên popup. Miễn phí cho mọi gói.",
    ext_no_token:"Bạn chưa có mã kết nối tiện ích.", ext_gen_btn:"Tạo mã kết nối", ext_regen_btn:"Tạo lại mã kết nối",
    // ===== AI ASSISTANT =====
    ai_assistant_title:"Hỏi AI", ai_assistant_placeholder:"Nhập câu hỏi của bạn...", ai_assistant_send:"Gửi",
    ai_assistant_greeting:"Dạ chào bạn! Em là trợ lý AI của SHURL, bạn cần hỗ trợ gì ạ?",
    ai_assistant_error:"Không gửi được câu hỏi, vui lòng thử lại.",
    // ===== API =====
    api_title:"API Token", api_no_token:"Bạn chưa có API token.", api_gen_token:"Tạo token",
    api_regen_token:"Tạo lại token", api_monthly_limit:"Hạn mức:", api_requests_month:"requests/tháng.",
    api_example:"Ví dụ sử dụng (cURL)", api_other:"Các endpoint khác: GET /api/v1/links · GET /api/v1/analytics/:code",
    url_tool_title:"URL Encoder / Decoder", url_tool_hint:"Mã hóa hoặc giải mã chuỗi URL (encodeURIComponent/decodeURIComponent) — chạy trực tiếp trên trình duyệt, không gửi dữ liệu lên server.",
    url_tool_input_label:"Đầu vào", url_tool_output_label:"Kết quả", url_tool_encode_btn:"Encode", url_tool_decode_btn:"Decode",
    url_tool_copy:"Sao chép", url_tool_error:"Chuỗi không hợp lệ để giải mã.",
    api_no_access:"Gói hiện tại chưa hỗ trợ API. Nâng cấp PRO hoặc SUPER để sử dụng.",
    // ===== ADMIN =====
    admin_title:"Quản trị hệ thống", admin_users:"Người dùng", admin_reports:"Báo cáo vi phạm",
    admin_blacklist:"Danh sách đen", admin_vouchers:"Voucher",
    admin_username:"Username", admin_email:"Email", admin_role:"Vai trò", admin_created:"Ngày tạo",
    admin_save:"Lưu", admin_reason:"Lý do", admin_status:"Trạng thái", admin_dismiss:"Bỏ qua",
    admin_no_reports:"Không có báo cáo nào.", admin_add_domain:"Thêm", admin_add_keyword:"Thêm",
    admin_new_domain:"vi-du-xau.com", admin_new_keyword:"tu-khoa",
    admin_bl_domains:"Domain bị chặn", admin_bl_keywords:"Từ khoá nhạy cảm (thêm)",
    admin_bl_defaults:"Từ khoá mặc định (không thể xoá):", admin_create_voucher:"+ Tạo voucher mới",
    admin_voucher_code:"Mã voucher", admin_tier:"Gói", admin_used:"Đã dùng", admin_limit:"Giới hạn",
    admin_expires:"Hết hạn", admin_active:"Trạng thái", admin_delete:"Xoá",
    admin_panel_title:"Bảng điều khiển quản trị", admin_promo_title:"Cài đặt khuyến mãi", admin_promo_enable:"Bật khuyến mãi",
    admin_promo_from:"Từ ngày", admin_promo_to:"Đến ngày", admin_promo_month_disc:"Giảm 1 tháng (%)", admin_promo_year_disc:"Giảm 1 năm (%)",
    admin_promo_saved:"Đã lưu cài đặt khuyến mãi", admin_promo_save_error:"Lỗi lưu cài đặt",
    admin_promo_ended:"Khuyến mãi đã kết thúc", admin_promo_starts:"Khuyến mãi sẽ bắt đầu", admin_promo_remaining:"Còn",
    admin_pay_report_title:"Báo cáo thanh toán", admin_customer:"Khách", admin_amount:"Số tiền", admin_total_revenue:"Tổng thu",
    admin_export_csv:"Xuất CSV", admin_no_data:"Không có dữ liệu", admin_report_error:"Lỗi tải báo cáo",
    // ===== SIDEBAR =====
    sidebar_recent:"Gần đây", sidebar_ad_placeholder:"Quảng cáo — Sắp có", sidebar_ad_outside:"Vị trí quảng cáo ngoài",
    sidebar_ad:"Quảng cáo",
    sidebar_guest_title:"✨ Tạo tài khoản miễn phí", sidebar_guest_desc:"Đăng ký để nhận 10 link/ngày, quản lý link, xem thống kê.",
    sidebar_guest_feat1:"Tên rút gọn tuỳ chỉnh", sidebar_guest_feat2:"Quản lý & thống kê link", sidebar_guest_btn:"Đăng ký ngay →",
    sidebar_pro_title:"⭐ Nâng cấp Pro", sidebar_pro_desc:"Mở khoá tính năng mạnh mẽ.",
    sidebar_super_title:"🚀 Nâng cấp Super", sidebar_super_desc:"Dành cho doanh nghiệp.",
    sidebar_upgrade_now:"Nâng cấp ngay →", sidebar_view_super:"Xem gói Super →",
    sidebar_pro_current:"Bạn đang dùng Pro — lên Super để nhận thêm:",
    sidebar_register_title:"✨ Đăng ký miễn phí", sidebar_register_desc:"Tạo tài khoản để nhận thêm lợi ích.",
    sidebar_register_feat1:"10 link/ngày", sidebar_register_feat2:"Tên rút gọn tuỳ chỉnh",
    sidebar_register_feat3:"Quản lý link", sidebar_register_feat4:"Thống kê lượt click",
    sidebar_register_btn:"Xem bảng giá →",
    // ===== SUPPORT =====
    support_subject:"SHURL — Hỗ trợ thanh toán", support_body_greeting:"Xin chào đội ngũ SHURL,",
    support_body_issue:"Tôi gặp sự cố khi thanh toán gói:", support_body_plan:"Gói đăng ký:",
    support_body_amount:"Số tiền:", support_body_date:"Ngày thanh toán:",
    support_body_screenshot:"Tôi đính kèm ảnh chụp màn hình thanh toán thành công.",
    support_body_thanks:"Cảm ơn bạn đã hỗ trợ.", support_body_name:"Tên tài khoản:",
    support_title:"Thanh toán gặp sự cố?", support_desc:"Nếu quá trình thanh toán không thành công hoặc gói chưa được kích hoạt, vui lòng liên hệ đội ngũ hỗ trợ. Đính kèm ảnh chụp màn hình thanh toán thành công để chúng tôi xử lý nhanh chóng.",
    support_contact_btn:"Liên hệ hỗ trợ",
    // ===== EMAIL =====
    email_brand:"Short URL", email_voucher_subject:"Voucher SHURL — Mã kích hoạt gói",
    email_voucher_thanks_1:"Cảm ơn bạn đã sử dụng gói", email_voucher_thanks_2:"của",
    email_voucher_instruction:"Hãy copy voucher này và dán vào ô nhập voucher ở phần tài khoản để kích hoạt:",
    email_voucher_activate_note:"Gói voucher", email_voucher_activate_note_2:"được kích hoạt ngay sau khi nhập mã.",
    email_voucher_warning:"Vui lòng không share mã voucher ra ngoài tránh trường hợp mất.",
    email_voucher_closing:"Xin cảm ơn bạn đã đóng góp cho nền tảng này phát triển.", email_signature:"Trân trọng,",
    // ===== ROLES =====
    role_guest:"Khách", role_free:"Miễn phí", role_pro:"Pro", role_super:"Super", role_admin:"Quản trị viên",
    // ===== MISC =====
    days:"ngày", hours:"giờ", minutes:"phút", loading:"Đang tải...", footer_tagline:"Nền tảng rút gọn link đa tầng · An toàn · Nhanh chóng",
    footer_contact:"Liên hệ", ft_products:"Sản phẩm", ft_tools:"Công cụ miễn phí", ft_support:"Hỗ trợ", ft_legal:"Pháp lý", ft_shorten:"Rút gọn link", ft_qr:"Mã QR", ft_bio:"Link-in-bio", ft_scanner:"Quét mã QR", ft_pricing:"Bảng giá", ft_api:"API cho lập trình viên", ft_report:"Báo cáo lạm dụng", ft_disclaimer:"Miễn trừ trách nhiệm", ft_all_tools:"Tất cả công cụ", ft_compliance:"SHURL là dịch vụ rút gọn link và tạo mã QR, hoạt động theo pháp luật Việt Nam hiện hành. Nghiêm cấm mọi hành vi dùng dịch vụ để lừa đảo, giả mạo hoặc vi phạm pháp luật.", ft_rights:"Bảo lưu mọi quyền.",
    bio_locked_desc:"Link-in-bio là trang mini gom nhiều liên kết (Facebook, Zalo, Shop, v.v...) vào 1 short URL duy nhất — giống Linktree. Tính năng dành cho gói Plus trở lên.",
    bio_help_title:"Link-in-bio là gì? Xem hướng dẫn sử dụng", bio_create_title:"Tạo trang mới", bio_create_hint:"Gom nhiều liên kết vào 1 short URL duy nhất, kiểu Linktree.",
    bio_display_name:"Tên hiển thị", bio_display_ph:"VD: Cửa hàng ABC", bio_desc_label:"Mô tả ngắn (tuỳ chọn)", bio_links_label:"Các liên kết", bio_add_link:"Thêm liên kết",
    bio_code_label:"Mã tuỳ chỉnh (tuỳ chọn)", bio_code_ph:"vd: cua-hang-abc", bio_create_btn:"Tạo trang", bio_list_title:"Trang đã tạo",
    bio_err_name:"Vui lòng nhập tên hiển thị.", bio_err_links:"Cần ít nhất 1 liên kết hợp lệ.", bio_creating:"Đang tạo...", bio_created:"Đã tạo:",
    bio_row_title_ph:"Tiêu đề (VD: Fanpage Facebook)", bio_empty:"Bạn chưa tạo trang Link-in-bio nào.", bio_views:"lượt xem", bio_clicks:"click",
    home_title_ph:"Ghi chú cho link này", home_pw_ph:"Để trống = không bảo vệ", home_ab_suffix:" — thêm URL đích (Pro/Super)", home_ab_a_ph:"URL đích A (thêm vào)", home_ab_b_ph:"URL đích B (thêm vào)", home_your_link:"Link rút gọn của bạn:",
    dash_links_title:"Danh sách link", dash_empty:"Chưa có link nào.", dash_empty_cta:"Tạo link đầu tiên ở trang chủ", export_help_title:"Xuất CSV là gì? Xem hướng dẫn sử dụng",
    team_created_on:"Tạo:", team_members_count:"thành viên", team_err_username:"Nhập username.", team_adding:"Đang thêm...", team_added:"Đã thêm!", err_prefix:"Lỗi:",
    admin_access:"Bạn có quyền quản trị hệ thống.", admin_go:"Vào trang quản trị", twofa_not_enabled_warning:"Tài khoản admin chưa bật xác thực 2 lớp (2FA). Hãy bật ngay để bảo vệ hệ thống.",
    ft_biz_name:"Đơn vị vận hành", ft_biz_tax:"Mã số thuế", ft_biz_addr:"Địa chỉ", ft_biz_phone:"Hotline",
    disclaimer_title:"Miễn trừ trách nhiệm", disclaimer_subtitle:"Những giới hạn trách nhiệm khi sử dụng SHURL.",
    rp_title:"Báo cáo lạm dụng", rp_sub:"Bạn phát hiện link rút gọn, mã QR hoặc trang do SHURL tạo được dùng để lừa đảo, giả mạo hay vi phạm pháp luật? Hãy báo cho chúng tôi.",
    rp_target:"Link hoặc nội dung cần báo cáo", rp_target_ph:"Dán link rút gọn (vd: shurlvn.com/abc123) hoặc mô tả mã QR / tài khoản đáng ngờ", rp_category:"Loại vi phạm",
    rp_cat_scam:"Lừa đảo / chiếm đoạt tiền", rp_cat_phishing:"Giả mạo trang đăng nhập / đánh cắp thông tin", rp_cat_impersonation:"Giả mạo cá nhân, thương hiệu, tổ chức", rp_cat_malware:"Mã độc / phần mềm độc hại", rp_cat_illegal:"Nội dung vi phạm pháp luật", rp_cat_spam:"Spam", rp_cat_other:"Khác",
    rp_details:"Mô tả thêm (tuỳ chọn)", rp_contact:"Email liên hệ (tuỳ chọn, để chúng tôi hỏi thêm)", rp_submit:"Gửi báo cáo", rp_sending:"Đang gửi...",
    rp_ok:"Đã nhận báo cáo. Cảm ơn bạn đã giúp cộng đồng an toàn hơn.", rp_err_target:"Vui lòng nhập link hoặc mô tả nội dung cần báo cáo.", rp_err:"Không gửi được báo cáo. Vui lòng thử lại.",
    rp_note:"Báo cáo được gửi tới quản trị viên SHURL để xem xét. Nếu bạn đã bị mất tiền, hãy liên hệ ngân hàng của bạn và cơ quan công an địa phương ngay.",
    footer_terms:"Điều khoản sử dụng", footer_privacy:"Chính sách bảo mật", footer_blog:"Blog", footer_tools:"Công cụ", slide_back:"Quay lại", legal_last_updated:"Cập nhật lần cuối",
    terms_title:"Điều khoản sử dụng", terms_subtitle:"Quy định sử dụng dịch vụ SHORT URL.",
    privacy_title:"Chính sách bảo mật", privacy_subtitle:"Cách SHORT URL thu thập, sử dụng và bảo vệ thông tin của bạn.",
    register_legal_notice:"Bằng việc đăng ký, bạn đồng ý với", and:"và",
    // ===== ERROR CODES =====
    err_url_invalid:"URL không hợp lệ (phải bắt đầu bằng http:// hoặc https://)",
    err_domain_blacklisted:"Domain đích nằm trong danh sách đen bảo mật.",
    err_keyword_blocked:'Mã tùy chỉnh chứa từ khóa thương hiệu hoặc nhạy cảm.',
    err_code_taken:'Mã đã được sử dụng. Vui lòng chọn mã khác.',
    err_pixel_limit_reached:"Bạn đã đạt giới hạn số link có pixel của gói.",
    err_ab_limit_reached:"Bạn đã đạt giới hạn số link A/B testing của gói.",
    err_ab_percent_invalid:"Tổng phần trăm A/B phải bằng 100%.",
    err_pw_wrong:"Mật khẩu không đúng",
    err_pw_bruteforce:"Quá nhiều lần thử sai. Thử lại sau 15 phút.",
    err_link_not_found:"Link không tồn tại",
    err_quota_exceeded:"Bạn đã vượt quá giới hạn link/ngày.",
    totp_code:"Mã TOTP (6 số)",
    totp_required:"Mật khẩu đúng! Vui lòng nhập mã TOTP từ Google Authenticator.",
pricing_popular:"Phổ biến nhất", pay_vn_btn:"Thanh toán VN (MoMo/Napas)" 
,
    mt_title:"🛠️ Bảo trì tính năng", mt_desc:"Bật bảo trì để tạm tắt tính năng. User sẽ thấy ribbon Bảo trì và không thể sử dụng.", mt_stripe:"Stripe (Thanh toán thẻ)", mt_qr:"QR Ngân hàng (VietQR)", mt_voucher:"Voucher", mt_bulk:"Bulk Shorten", mt_api:"API", mt_analytics:"Analytics", mt_note_ph:"Lý do bảo trì (tùy chọn)", mt_ribbon:"Bảo trì", mt_alert:"Tính năng đang bảo trì", mt_loading:"Đang tải...", mt_error:"Lỗi", mt_confirm:"Xác nhận", mt_cancel:"Hủy", mt_save:"Lưu", mt_success:"Thành công!", mt_payment_success:"Thanh toán thành công!", mt_payment_cancel:"Thanh toán đã hủy", mt_voucher_success:"Mua voucher thành công!", mt_voucher_cancel:"Đã hủy mua voucher", mt_expired_30:"Gói sẽ hết hạn sau 30 ngày. Bạn có thể gia hạn bất cứ lúc nào.", mt_no_notif:"Không có thông báo mới", mt_notif_title:"🔔 Thông báo", mt_pending_payments:"Đơn thanh toán chờ duyệt", mt_pending_reports:"Báo cáo vi phạm", mt_downgrade_err:"Bạn đang ở gói cao hơn, không thể mua gói thấp hơn!", mt_pay_method:"Phương thức", mt_no_history:"Chưa có giao dịch nào.",
    webhooks:"Webhooks", data_export:"Xuất dữ liệu", campaign_history:"Lịch sử campaign", team_management:"Quản lý team",
    wh_tab_title:"Webhooks", wh_requires:"Webhooks yêu cầu gói Pro hoặc Super.", wh_loading:"Đang tải...", wh_add_title:"Thêm Webhook",
    wh_url_label:"URL Webhook (HTTPS)", wh_name_label:"Tên (tùy chọn)", wh_add_btn:"Thêm Webhook", wh_guide_title:"Hướng dẫn",
    wh_guide_desc:"Webhook gửi POST request tới URL của bạn mỗi khi có người click vào link.",
    wh_empty:"Chưa có webhook nào.", wh_col_name:"Tên", wh_col_url:"URL", wh_col_event:"Sự kiện", wh_col_created:"Ngày tạo", wh_col_delete:"Xóa",
    wh_err_url:"Vui lòng nhập URL webhook.", wh_err_https:"URL phải dùng HTTPS.", wh_adding:"Đang thêm...", wh_added:"Đã thêm webhook!",
    wh_delete_confirm:"Xóa webhook này?",
    export_tab_title:"Export Dữ Liệu", export_requires:"Export dữ liệu yêu cầu gói Pro hoặc Super.",
    export_csv_btn:"Export CSV", export_json_btn:"Export JSON", export_csv_done:"Đã xuất CSV!", export_json_done:"Đã xuất JSON!",
    export_desc:"Export bao gồm tất cả link của bạn: code, URL đích, số click, trạng thái, ngày tạo, ngày hết hạn.",
    export_csv_hint:"CSV — mở bằng Excel/Google Sheets. JSON — dùng cho API hoặc backup.",
    team_tab_title:"Team", team_requires:"Team yêu cầu gói Super.", team_loading:"Đang tải...",
    team_create_title:"Tạo Team", team_name_label:"Tên Team", team_create_btn:"Tạo Team",
    team_guide_title:"Hướng dẫn", team_guide_desc:"Team cho phép nhiều user cùng quản lý link. Thành viên trong team có thể xem, sửa, xóa link của nhau.",
    team_guide_limit:"Super: tối đa {count} thành viên mỗi team.", team_empty:"Chưa có team nào. Tạo team bên dưới.",
    team_col_member:"Thành viên", team_col_role:"Vai trò", team_col_joined:"Tham gia", team_role_owner:"Owner", team_role_member:"Member",
    team_delete_btn:"Xóa Team", team_delete_confirm:"Xóa team này? Tất cả thành viên sẽ bị rời team.",
    team_add_placeholder:"username", team_add_btn:"Thêm", team_remove_confirm:"Xóa thành viên này?",
    team_err_name:"Nhập tên team.", team_creating:"Đang tạo...", team_created:"Đã tạo team!",
    campaigns_tab_title:"Campaigns", campaigns_requires:"Lịch sử campaign yêu cầu gói Plus trở lên.",
    campaigns_loading:"Đang tải...", campaigns_guide_title:"Hướng dẫn",
    campaigns_guide_desc:"Campaigns giúp nhóm link theo chiến dịch marketing. Khi bạn đổi campaign của một link, lịch sử campaign cũ được lưu lại tự động.",
    campaigns_guide_desc2:"Bạn có thể xem tổng quan: số link mỗi campaign, tổng click, và lịch sử thay đổi.",
    campaigns_empty:"Chưa có campaign nào. Tạo link với campaign để bắt đầu.",
    campaigns_col_name:"Campaign", campaigns_col_links:"Links", campaigns_col_clicks:"Tổng click", campaigns_col_history:"Lịch sử",
    campaigns_back:"← Quay lại", campaigns_history_title:"Lịch sử campaign:", campaigns_no_links:"Không có link nào.",
    campaigns_view_history:"Xem lịch sử", campaigns_changed_date:"(đổi ngày {date})",
    link_not_found:"Link không tồn tại", pw_too_many_attempts:"Quá nhiều lần thử sai. Thử lại sau 15 phút.",
    voucher_enter_code:"Nhập mã voucher", voucher_not_found:"Voucher không tồn tại", voucher_disabled:"Voucher đã bị vô hiệu hóa", voucher_expired:"Voucher đã hết hạn", voucher_no_uses_left:"Voucher đã hết lượt dùng", voucher_already_used:"Bạn đã dùng voucher này rồi",
    voucher_cannot_downgrade:"Gói hiện tại ({current}) cao hơn voucher ({voucherTier}). Voucher không thể hạ gói.",
    voucher_days_added:"Đã cộng dồn {days} ngày vào gói {tier}", voucher_upgraded:"Đã nâng cấp lên gói {tier}",
    stripe_error_generic:"Lỗi Stripe", missing_info:"Thiếu thông tin", missing_order_id:"Thiếu orderId", not_found:"Không tìm thấy",
    utm_builder_title:"UTM Builder", utm_builder_toggle:"Thêm tham số UTM (tùy chọn)",
    utm_builder_hint:"Tự động gắn tham số UTM vào URL đích. Campaign UTM sẽ lấy theo trường Chiến dịch ở trên.",
    utm_source:"Nguồn (utm_source)", utm_medium:"Kênh (utm_medium)", utm_term:"Từ khóa (utm_term)", utm_content:"Nội dung (utm_content)",
    export_filter_campaign_label:"Lọc theo Campaign", export_filter_all:"Tất cả campaign",
    admin_ban:"Khóa", admin_unban:"Mở khóa", admin_banned:"Bị khóa", admin_active:"Bình thường", admin_expires:"Hết hạn:", admin_notify:"Gửi thông báo", admin_delete_user:"Xóa user", admin_ban_user:"Khóa user", admin_unban_user:"Mở khóa",
    guide_close:"Đóng hướng dẫn", guide_show_steps:"Xem hướng dẫn",
    guide_home_title:"Bắt đầu với SHORT URL",
    guide_home_desc:"Tạo link ngắn, QR Code và quản lý hoạt động của bạn từ một nơi.",
    guide_home_step1:"Tạo Short URL — Rút gọn một URL dài thành link dễ chia sẻ.",
    guide_home_step2:"Tạo QR Code — Biến link thành QR Code để sử dụng trên sản phẩm, tài liệu hoặc quảng bá.",
    guide_home_step3:"Theo dõi hoạt động — Xem lượt click và dữ liệu sử dụng từ Analytics.",
    guide_home_cta:"Tạo Short URL",
    guide_shorturls_title:"Tạo và quản lý Short URL",
    guide_shorturls_desc:"Biến những URL dài thành liên kết ngắn, dễ chia sẻ và dễ quản lý.",
    guide_shorturls_step1:"Dán URL gốc — Nhập URL mà bạn muốn rút gọn.",
    guide_shorturls_step2:"Tùy chỉnh nếu cần — Sử dụng các tùy chọn hiện có của hệ thống.",
    guide_shorturls_step3:"Tạo và chia sẻ — Tạo Short URL rồi sử dụng trong các kênh của bạn.",
    guide_shorturls_cta:"Tạo Short URL",
    guide_dashboard_title:"Tổng quan hoạt động",
    guide_dashboard_desc:"Theo dõi nhanh tình trạng Short URL và hoạt động của tài khoản từ một nơi.",
    guide_dashboard_step1:"Xem tổng quan — Kiểm tra các chỉ số chính.",
    guide_dashboard_step2:"Theo dõi hoạt động — Xem những hoạt động gần đây của hệ thống.",
    guide_dashboard_step3:"Đi sâu vào Analytics — Mở Analytics khi cần phân tích chi tiết hơn.",
    guide_dashboard_cta:"Xem Analytics",
    guide_bulkqr_title:"Tạo QR Code cho một hoặc nhiều URL",
    guide_bulkqr_desc:"Tạo nhanh một QR Code hoặc xử lý nhiều link cùng lúc để sử dụng trên sản phẩm và tài liệu.",
    guide_bulkqr_step1:"Chọn cách tạo — Tạo một QR Code hoặc sử dụng công cụ QR hàng loạt.",
    guide_bulkqr_step2:"Tùy chỉnh QR — Chọn màu và kích thước theo nhu cầu.",
    guide_bulkqr_step3:"Tạo và tải xuống — Tạo QR Code và sử dụng trong tài liệu, sản phẩm hoặc chiến dịch.",
    guide_analytics_title:"Hiểu hiệu quả của từng link",
    guide_analytics_desc:"Theo dõi lượt click và khám phá cách người dùng tương tác với các liên kết của bạn.",
    guide_analytics_step1:"Xem lượt click — Theo dõi lượng truy cập theo thời gian.",
    guide_analytics_step2:"Phân tích người truy cập — Xem các dữ liệu Analytics hiện đang được hệ thống cung cấp.",
    guide_analytics_step3:"So sánh hiệu quả — Sử dụng dữ liệu hiện có để đánh giá Short URL nào hoạt động tốt hơn.",
    guide_webhooks_title:"Webhooks là gì?",
    guide_webhooks_desc:"Kết nối SHORT URL với hệ thống khác để nhận thông báo tự động khi có sự kiện liên quan đến liên kết của bạn.",
    guide_webhooks_step1:"Tạo Webhook — Thêm URL đích để nhận thông báo.",
    guide_webhooks_step2:"Chọn sự kiện cần theo dõi — Hệ thống hiện hỗ trợ sự kiện click.",
    guide_webhooks_step3:"Kết nối và kiểm tra dữ liệu — Xác nhận Webhook hoạt động bằng cách theo dõi request đến URL của bạn.",
    guide_webhooks_cta:"Thêm Webhook",
    guide_export_title:"Xuất dữ liệu của bạn",
    guide_export_desc:"Tải dữ liệu Short URL và hoạt động liên quan để lưu trữ, phân tích hoặc sử dụng trong các hệ thống khác.",
    guide_export_step1:"Chọn dữ liệu cần xuất — Chọn liên kết và hoạt động bạn muốn tải.",
    guide_export_step2:"Chọn định dạng — Hệ thống hiện hỗ trợ xuất CSV và JSON.",
    guide_export_step3:"Xuất và lưu file — Tải file về máy để sử dụng.",
    guide_export_cta:"Xuất dữ liệu",
    guide_campaigns_title:"Tổ chức link theo Campaign",
    guide_campaigns_desc:"Nhóm các Short URL và hoạt động liên quan để dễ quản lý, theo dõi và so sánh hiệu quả.",
    guide_campaigns_step1:"Tạo Campaign — Gắn campaign cho link khi tạo hoặc chỉnh sửa.",
    guide_campaigns_step2:"Gắn các liên kết liên quan — Các link cùng campaign sẽ được nhóm lại.",
    guide_campaigns_step3:"Theo dõi và so sánh hiệu quả — Xem tổng quan: số link, tổng click và lịch sử thay đổi.",
    guide_campaigns_cta:"Xem Campaigns",
    guide_team_title:"Làm việc cùng Team",
    guide_team_desc:"Quản lý thành viên và phân quyền để nhiều người có thể cùng làm việc trên hệ thống SHORT URL.",
    guide_team_step1:"Mời thành viên — Thêm username thành viên vào team.",
    guide_team_step2:"Thiết lập quyền truy cập — Owner và Member có quyền khác nhau trong team.",
    guide_team_step3:"Cùng quản lý và theo dõi dữ liệu — Thành viên trong team có thể xem, sửa, xóa link của nhau.",
    guide_team_cta:"Tạo Team",
    guide_api_title:"Tích hợp SHORT URL bằng API",
    guide_api_desc:"Sử dụng API để kết nối SHORT URL với website, ứng dụng hoặc hệ thống nội bộ của bạn.",
    guide_api_step1:"Tạo hoặc lấy API Key — Sinh token API trong trang này.",
    guide_api_step2:"Gửi request đến API — Sử dụng endpoint /api/v1/shorten với API Key.",
    guide_api_step3:"Nhận và xử lý kết quả — API trả về short link và dữ liệu liên quan.",
    guide_api_cta:"Tạo API Key",
    guide_pricing_title:"Chọn gói phù hợp với nhu cầu",
    guide_pricing_desc:"So sánh các gói dịch vụ và chọn mức sử dụng phù hợp với nhu cầu tạo, quản lý và theo dõi Short URL.",
    guide_pricing_step1:"Xem giới hạn của từng gói — Free, Plus, Pro và Super.",
    guide_pricing_step2:"So sánh tính năng — Mỗi gói có số link, API, analytics và tính năng khác nhau.",
    guide_pricing_step3:"Chọn gói phù hợp — Nâng cấp khi cần thêm khả năng.",
    guide_pricing_cta:"Xem gói",
    guide_account_title:"Quản lý tài khoản",
    guide_account_desc:"Quản lý thông tin tài khoản, tùy chọn cá nhân và các thiết lập liên quan đến trải nghiệm SHORT URL.",
    guide_account_step1:"Kiểm tra thông tin tài khoản — Xem username, email và gói hiện tại.",
    guide_account_step2:"Điều chỉnh thiết lập — Cập nhật thông tin và tùy chọn cá nhân.",
    guide_account_step3:"Lưu thay đổi — Xác nhận để áp dụng.",
    guide_account_cta:"Cập nhật tài khoản",
    guide_admin_title:"Quản trị hệ thống",
    guide_admin_desc:"Theo dõi và quản lý các thành phần của SHORT URL từ khu vực quản trị.",
    guide_admin_step1:"Kiểm tra tổng quan hệ thống — Quản lý người dùng, link và báo cáo.",
    guide_admin_step2:"Quản lý dữ liệu và người dùng — Duyệt báo cáo, blacklist, voucher và thanh toán.",
    guide_admin_step3:"Kiểm tra các thiết lập quản trị — Bảo trì, bảo mật, nhật ký và thông báo.",
    guide_admin_cta:"Mở Admin",
    guide_scanner_title:"Quét & Kiểm tra QR",
    guide_scanner_desc:"Quét mã QR bằng camera hoặc ảnh tải lên, xem nội dung giải mã và kiểm tra độ an toàn trước khi bấm vào.",
    guide_scanner_step1:"Bật camera hoặc tải ảnh QR lên.",
    guide_scanner_step2:"Xem nội dung đã giải mã — link, văn bản, v.v.",
    guide_scanner_step3:"Đọc cảnh báo an toàn trước khi mở link.",
    scanner_page_title:"Quét & Kiểm tra QR", scanner_help_title:"Scanner QR là gì? Xem hướng dẫn sử dụng",
    scanner_camera_start:"Bắt Đầu Quét",
    scanner_camera_stop:"Dừng Quét",
    scanner_upload_label:"hoặc tải ảnh QR lên",
    scanner_scan_again:"Quét mã khác",
    scanner_mode_title:"Chọn Chế Độ Quét",
    scanner_mode_camera:"Quét Từ Camera",
    scanner_mode_file:"Quét Từ File",
    scanner_camera_permission_hint:"Cho phép truy cập camera và hướng nó vào mã QR để quét.",
    scanner_file_dropzone:"Chọn ảnh QR để tải lên",
    scanner_result_title:"Kết Quả",
    scanner_result_empty_title:"Không tìm thấy mã QR",
    scanner_result_empty_desc:"Chọn chế độ quét và bắt đầu quét để xem kết quả ở đây.",
    scanner_flash_on:"Bật đèn",
    scanner_flash_off:"Tắt đèn",
    scanner_switch_camera:"Đổi camera",
    scanner_result_raw:"Nội dung giải mã",
    scanner_result_domain:"Tên miền",
    scanner_safety_ok:"An toàn — không phát hiện dấu hiệu đáng ngờ.",
    scanner_safety_warning:"Cảnh báo — link này có dấu hiệu liên quan thanh toán hoặc nằm trong danh sách chặn. Cẩn thận trước khi mở.",
    scanner_shurl_link_title:"Đây là Short URL của Shurl",
    scanner_shurl_link_dest:"Đích hiện tại",
    scanner_shurl_link_type_dynamic:"QR động — đích có thể đã bị đổi sau khi in",
    scanner_shurl_link_type_static:"Link thường",
    scanner_shurl_link_disabled:"Link này đã bị tắt.",
    scanner_shurl_link_expired:"Link này đã hết hạn.",
    scanner_shurl_link_password:"Link này có bảo vệ bằng mật khẩu.",
    scanner_no_camera:"Trình duyệt không hỗ trợ camera hoặc bạn chưa cấp quyền truy cập.",
    scanner_scanning_hint:"Đưa mã QR vào khung hình...",
    scanner_decode_fail:"Không đọc được mã QR trong ảnh này. Thử ảnh rõ nét hơn.",
    qr_print_check_title:"Kiểm tra trước khi in",
    qr_print_check_ok:"Đã kiểm tra: QR này quét được.",
    qr_print_check_fail:"QR này có thể khó quét — thử giảm logo, tăng kích cỡ hoặc tăng độ tương phản màu.",
    qr_print_check_size_hint:"Khuyến nghị in tối thiểu 2×2cm khi quét gần bằng điện thoại, từ 5×5cm trở lên nếu quét xa hơn 30cm.",
    notif_title:"Thông báo", notif_empty:"Không có thông báo nào", notif_from:"Từ:", notif_new:"Mới", notif_ok:"Đã hiểu", crown_hint:"Xem hướng dẫn tính năng", crown_upgrade_to_unlock:"Nâng cấp để mở khóa tính năng này", demo_bulkqr_title:"Bulk QR — Tạo QR hàng loạt", demo_webhooks_title:"Webhooks — Tự động gửi sự kiện", demo_campaigns_title:"Campaigns — Quản lý nhóm link", demo_export_title:"Export — Xuất dữ liệu", demo_api_title:"API — Tích hợp hệ thống ngoài", demo_dashboard_title:"Dashboard — Quản lý Short URL", demo_bulkqr_s1_t:"Nhập nhiều URL vào ô văn bản", demo_bulkqr_s1_d:"Mỗi dòng 1 URL", demo_bulkqr_s2_t:"Bấm nút Tạo QR", demo_bulkqr_s2_d:"Hệ thống tạo QR cho từng URL", demo_bulkqr_s3_t:"Tải về tất cả QR", demo_bulkqr_s3_d:"File ZIP chứa tất cả QR Code", demo_webhooks_s1_t:"Thêm URL đích webhook", demo_webhooks_s1_d:"URL nhận thông báo khi có event", demo_webhooks_s2_t:"Khi ai đó click link", demo_webhooks_s2_d:"Webhook tự động POST event tới URL", demo_webhooks_s3_t:"Hệ thống bên ngoài nhận data", demo_webhooks_s3_d:"IP, quốc gia, thiết bị, thời gian", demo_campaigns_s1_t:"Tạo Campaign mới", demo_campaigns_s1_d:"Đặt tên và mô tả chiến dịch", demo_campaigns_s2_t:"Thêm Short URL vào Campaign", demo_campaigns_s2_d:"Nhiều link trong 1 nhóm", demo_campaigns_s3_t:"Xem Analytics tổng hợp", demo_campaigns_s3_d:"Thống kê tất cả link trong Campaign", demo_export_s1_t:"Chọn định dạng CSV hoặc JSON", demo_export_s1_d:"Xuất toàn bộ link và thống kê", demo_export_s2_t:"Bấm nút Export", demo_export_s2_d:"Hệ thống tổng hợp dữ liệu", demo_export_s3_t:"Tải file về máy", demo_export_s3_d:"File chứa tất cả link + clicks + ngày tạo", demo_api_s1_t:"Tạo API Token", demo_api_s1_d:"Token dùng để xác thực API", demo_api_s2_t:"Gửi POST /api/v1/shorten", demo_api_s2_d:"Tạo Short URL từ hệ thống ngoài", demo_api_s3_t:"Nhận kết quả JSON", demo_api_s3_d:"Short URL code + link đầy đủ", demo_dashboard_s1_t:"Tạo Short URL", demo_dashboard_s1_d:"Dán URL dài → tạo link ngắn", demo_dashboard_s2_t:"Quản lý link", demo_dashboard_s2_d:"Copy, QR, Analytics, Edit, Delete", demo_dashboard_s3_t:"Xem thống kê", demo_dashboard_s3_d:"Số link, tổng clicks", demo_anim_url:"URL", demo_anim_qr:"QR", demo_anim_ok:"✓", demo_anim_link_click:"Link click", demo_anim_event:"Event", demo_anim_post:"POST → URL", demo_anim_external:"External System", demo_anim_campaign:"Campaign", demo_anim_analytics:"Analytics", demo_anim_data:"Data", demo_anim_export:"Export", demo_anim_csv:"CSV/JSON", demo_anim_app:"App", demo_anim_url_long:"URL dài", demo_anim_clicks:"Clicks", api_tier_expired:"Gói của bạn đã hết hạn. Vui lòng nâng cấp để tiếp tục sử dụng API.", api_not_available:"Gói hiện tại chưa hỗ trợ API. Nâng cấp PRO hoặc SUPER để sử dụng.", api_quota_exceeded:"Bạn đã dùng hết hạn mức API", api_upgrade_to_continue:"Vui lòng nâng cấp để tiếp tục sử dụng.", api_upgrade_to_increase:"Vui lòng nâng cấp để tăng giới hạn.",
    feedback_title:"Góp ý & Hỗ trợ", feedback_btn:"Góp ý", feedback_type_bug:"Báo lỗi", feedback_type_feature:"Yêu cầu tính năng", feedback_type_question:"Hỏi đáp", feedback_type_other:"Khác", feedback_label_message:"Nội dung", feedback_placeholder:"Mô tả vấn đề, góp ý hoặc câu hỏi của bạn...", feedback_label_email:"Email (tùy chọn)", feedback_email_placeholder:"email@example.com", feedback_cancel:"Hủy", feedback_submit:"Gửi", feedback_success_title:"Đã gửi!", feedback_success_desc:"Cảm ơn bạn! Chúng tôi sẽ xem xét và phản hồi sớm.", feedback_close:"Đóng", feedback_error:"Có lỗi xảy ra, vui lòng thử lại.", admin_feedback_tab:"Góp ý", admin_no_feedback:"Chưa có góp ý nào.", acct_overview:"Tổng quan tài khoản", acct_total_clicks:"Tổng lượt click", acct_profile_title:"Hồ sơ tài khoản", acct_username:"Tên đăng nhập", acct_joined:"Ngày tham gia", acct_plan_title:"Gói hiện tại", acct_plan_active:"Đang sử dụng", acct_plan_running:"Đang hoạt động ✓", acct_plan_expired:"Đã hết hạn", acct_free:"Miễn phí", acct_joined_label:"Tham gia", acct_expiry_label:"Hết hạn", acct_start_label:"Bắt đầu", acct_upgrade_plan:"Nâng cấp gói", acct_manage_plan:"Quản lý gói", acct_pay_plan:"Gói", acct_pay_method:"Phương thức", acct_pay_amount:"Số tiền", acct_voucher_title:"Kích hoạt bằng mã Voucher", acct_voucher_hint:"Nhập mã voucher để kích hoạt ưu đãi hoặc gói dịch vụ.", acct_voucher_placeholder:"Nhập mã voucher", acct_voucher_btn:"Kích hoạt", acct_security_title:"Bảo mật", acct_2fa_enabled:"Đã bật ✓", acct_2fa_disabled:"Chưa bật", acct_session:"Phiên đăng nhập", acct_current_device:"Thiết bị hiện tại", acct_browser:"Trình duyệt", acct_bank_qr:"Ngân hàng QR", acct_pay_method_stripe:"Stripe", adm_notif_sys:"Thông báo hệ thống", adm_notif_empty:"Không có thông báo mới", adm_notif_read:"Đã đọc", adm_notif_unread:"Chưa đọc", adm_notif_delete:"Xóa", adm_notif_delete_confirm:"Xóa thông báo này?", adm_notif_deleted:"Đã xóa thông báo", adm_notif_not_found:"Không tìm thấy thông báo", adm_notif_missing_id:"Thiếu ID thông báo", adm_notif_from:"Từ", adm_notif_to:"Gửi tới", adm_notif_all_users:"Tất cả users", adm_notif_close:"Đóng", fb_detail_title:"Chi tiết góp ý", fb_detail_type:"Loại", fb_detail_sender:"Người gửi", fb_detail_anonymous:"Ẩn danh", fb_detail_page:"Trang", fb_detail_time:"Thời gian", fb_detail_status:"Trạng thái", fb_status_new:"Mới", fb_status_replied:"Đã phản hồi", fb_status_closed:"Đã đóng", fb_type_bug:"Báo lỗi", fb_type_feature:"Yêu cầu tính năng", fb_type_question:"Hỏi đáp", fb_type_other:"Khác", notif_mark_all_read:"Đánh dấu tất cả đã đọc", notif_marked_all:"Đã đọc tất cả",
  },
  en: {
    // ===== NAV =====
    home:"Home", nav_home:"Home", plans:"Pricing", login:"Log in", register:"Sign up", logout:"Log out", language:"Language",
    dashboard:"Dashboard", account:"Account", api:"API", bulk:"Bulk", admin:"Admin",
    // ===== AUTH =====
    login_sub:"Welcome back to SHURL.", login_security:"Secured by Cloude · Create an account to get started",
    auth_or:"or", auth_google_login:"Sign in with Google", google_login_error:"Google sign-in failed. Please try again.",
    no_account:"No account yet?", have_account:"Already have an account?", demo_accounts:" ",
    auth_welcome_back:"Welcome Back!", auth_welcome_back_desc:"Log in to keep managing your Short URLs, QR codes, and campaigns.",
    auth_hello_friend:"Hello, Friend!", auth_hello_friend_desc:"Create a free account to start shortening links and tracking performance.",
    register_sub:"Create a free account to manage your links.", register_free:"Sign up free",
    reg_username:"Username (8-25 characters)", reg_email:"Email (optional)", reg_password:"Password (min. 9 characters with at least 1 uppercase letter)",
    reg_newpassword:"New password",
    // ===== FORGOT PASSWORD =====
    forgot_password:"Forgot password", forgot_sub:"Enter your username to receive a recovery code via email.", change_password:"Change password", old_password:"Current password", new_password:"New password", confirm_password:"Confirm password", send_code:"Send verification code", verify_code:"Verification code (6 digits)", code_sent_to_email:"A verification code has been sent to your email.", code_sent:"Verification code sent", password_changed:"Password changed successfully!", password_mismatch:"Passwords do not match", password_too_short:"Password must be at least 9 characters", fill_all_fields:"Please fill in all fields", sending:"Sending...", processing:"Processing...", send_failed:"Failed to send", change_failed:"Failed to change password", cancel:"Cancel", confirm:"Confirm", security_password:"Password",
    forgot_submit:"Send recovery code", reset_code:"Verification code (6 digits)", reset_submit:"Change password",
    back_to_login:"Back to login",
    // ===== HOME =====
    home_title:"Free URL shortener", home_sub:"Create short links instantly, track clicks, and protect users from scams.",
    home_promo_title:"✨ Create an account — 🎁 get 10 free links!",
    home_promo_sub:"No expiry · Custom aliases · Link management · Click analytics",
    home_promo_desc:"No expiry · Custom aliases · Link management · Click analytics",
    home_promo_btn1:"Sign up free", home_promo_btn2:"Already have an account?",
    home_manage_title:"Manage links", home_manage_desc:"See your link history, click stats, edit destinations and set expiry dates.", home_manage_btn:"Manage", home_manage_links:"Your links", home_manage_clicks:"Clicks",
    home_guest_manage_title:"Sign in to manage your links", home_guest_manage_desc:"Keep your link history, see click stats and create links with your own name.", home_guest_manage_btn:"Sign in",
    dash_tools_title:"Free tools", dash_tools_desc:"Handy utilities that run right in your browser, no extra sign-up.",
    home_qr_promo_title:"Free QR Code Generator", home_qr_promo_desc:"Turn any link or text into a QR code with custom colors and sizes — use it now, no sign-up required.", home_qr_promo_btn:"Create QR Code",
    home_hero_sub:"Multi-tier link shortening platform — secure, detailed analytics, campaign management.",
    home_guest_hint:"Log in to set custom aliases, manage links and view analytics. Guests: 5 links/day.",
    home_url_placeholder:"https://example.com/very-long-path", home_alias_placeholder:"your-custom-name",
    home_note_placeholder:"Note for this link", home_password_placeholder:"Leave empty = no protection",
    home_add_dest:"add destination URL", home_dest_a:"Destination URL A (add)", home_dest_b:"Destination URL B (add)",
    url_to_shorten:"URL to shorten", shorten_now:"Shorten now", processing:"Processing...",
    custom_alias:"Custom alias", custom_alias_opt:"Custom alias (optional)",
    title_field:"Title", title_opt:"Title (optional)", campaign:"Campaign", tags:"Tags",
    expiry_date:"Expiry date (optional)", password_protect:"Protection password (optional)",
    custom_domain:"Custom domain",
    pixel_tracking:"Pixel tracking", ab_testing:"A/B testing", deep_link:"Deep link", link_protect:"Link protection",
    adv_options:"⚙ Advanced options (Pixel, A/B, Deep Link)", destination:"Destination", result_dest:"Destination:",
    // ===== QR CODE =====
    qr_title:"Create QR Code", qr_guest_title:"Create QR Code",
    qr_guest_desc:"Custom colors · Custom sizes", qr_guest_btn:"Generate now",
    qr_desc:"Enter any URL (shortened or not) to create a QR Code instantly. Each QR generation deducts 1 from your daily quota.",
    qr_url_label:"URL for QR code", qr_color:"Color", qr_size:"Size", qr_btn:"Generate QR",
    qr_bgcolor:"Background color", qr_bg_transparent:"Transparent background", qr_margin:"Margin", qr_margin_default:"Default", qr_format:"Format",
    qr_logo_label:"Logo (optional)", qr_logo_upload_btn:"Upload logo", qr_logo_error_type:"Only PNG or JPG files are accepted.", qr_logo_error_size:"File too large (max 2MB).",
    qr_logo_locked_hint:"Sign up free to use a custom logo on your QR",
    qr_dot_style_label:"QR style", qr_dot_style_square:"Square", qr_dot_style_rounded:"Rounded", qr_dot_style_dots:"Dots",
    qr_copy_link:"Copy link", qr_download:"Download PNG", qr_processing:"Generating QR...",
    qr_quota_error:"Daily QR generation quota reached",
    qr_workspace_sub:"Create and customize your QR Code live — every change shows instantly, no need to re-generate.",
    qr_step_type:"Choose QR type", qr_step_input:"Enter data", qr_step_customize:"Customize",
    qr_type_url:"URL", qr_type_text:"Text", qr_text_label:"Text content",
    qr_preview_heading:"Preview", qr_preview_empty:"Enter data to preview the QR Code",
    qr_preview_invalid:"Invalid URL", qr_preview_error:"Couldn't generate the QR Code. Please try again.",
    qr_download_svg:"Download SVG",
    qr_use_existing:"or pick an existing Short URL", qr_use_existing_placeholder:"-- Select a link --",
    qr_create_shorturl_btn:"Create Short URL", qr_shorturl_created:"Created:",
    qr_contrast_warning:"QR color and background are too similar — it may be hard to scan.",
    qr_csv_label:"or upload a CSV file (URL column)", qr_csv_detected:"URLs detected from CSV:",
    // ===== DYNAMIC QR (QR Studio) =====
    qr_mode_static:"Static QR", qr_mode_dynamic:"Dynamic QR",
    qr_mode_static_hint:"The destination is baked directly into the QR — it can't change after creation.",
    qr_mode_dynamic_hint:"The QR points to a Short URL — change the destination anytime without reprinting the QR.",
    qr_dyn_teaser_title:"Dynamic QR", qr_dyn_teaser_feat1:"Change the destination later — no reprinting", qr_dyn_teaser_feat2:"Track scan counts",
    qr_dyn_teaser_cta_guest:"Sign up free to try it", qr_dyn_teaser_cta_upgrade:"Upgrade to unlock dynamic QR",
    qr_dyn_help_title:"What is dynamic QR? See the detailed guide",
    qr_dynamic_title_label:"Memo name (optional)", qr_dynamic_title_placeholder:"e.g. September event poster",
    qr_dynamic_save_btn:"Save dynamic QR", qr_dynamic_saving:"Saving...",
    qr_dynamic_quota_label:"Dynamic QR used this month", qr_dynamic_quota_unlimited:"Unlimited",
    qr_dynamic_quota_exceeded_title:"You've used all your dynamic QR quota this month",
    qr_dynamic_quota_exceeded_desc:"Dynamic QR codes you already created keep working and scanning normally. Upgrade your plan to create more right now.",
    qr_dynamic_not_available_title:"Your current plan doesn't include dynamic QR",
    qr_dynamic_not_available_desc:"Upgrade to Plus or above to create QR codes whose destination you can change anytime.",
    qr_dynamic_upgrade_btn:"Upgrade plan", qr_dynamic_created:"Dynamic QR saved!",
    qr_dynamic_created_desc:"View and manage it under “Created QRs” below.",
    qr_dyn_terms_title:"Dynamic QR usage commitment",
    qr_dyn_terms_intro:"Dynamic QR lets you change the destination link anytime without reprinting the QR code — great for restaurant menus, promo banners, products, events, business cards... Before using it, please read and follow these rules:",
    qr_dyn_terms_rule1:"Don't use dynamic QR for fraud, brand/organization impersonation, or phishing for personal information.",
    qr_dyn_terms_rule2:"Don't point the destination to illegal content: illegal gambling, malware/viruses, pornography, prohibited goods.",
    qr_dyn_terms_rule3:"You are fully responsible for the destination content whenever you change it after the QR is published.",
    qr_dyn_terms_rule4:"SHURL may suspend or delete a dynamic QR that violates these rules without prior notice.",
    qr_dyn_terms_link:"View full Terms of Service",
    qr_dyn_terms_agree_btn:"I have read and agree", qr_dyn_terms_later_btn:"Later", qr_dyn_terms_close_btn:"Close",
    qr_dyn_terms_badge:"Committed to dynamic QR usage terms",
    qr_created_list_title:"Created QRs", qr_created_list_empty:"You haven't created any dynamic QR yet.",
    qr_created_col_qr:"QR", qr_created_col_title:"Name", qr_created_col_short:"Short URL", qr_created_col_owner:"Username", qr_created_col_target:"Current destination",
    qr_created_col_scans:"Scans", qr_created_col_created:"Created", qr_created_col_actions:"Actions",
    qr_edit_target_btn:"Edit URL", qr_edit_target_title:"Change this QR's destination",
    qr_edit_target_placeholder:"https://new-destination.com", qr_edit_target_save:"Save new destination", qr_edit_target_cancel:"Cancel",
    qr_edit_target_success:"Destination updated — the QR code itself hasn't changed and still works.",
    qr_delete_qr_confirm:"Delete this dynamic QR? The Short URL underneath keeps working — only this management entry is removed.",
    qr_delete_qr_btn:"Delete",
    qr_analytics_banner_title:"Stats for this dynamic QR", qr_analytics_back:"← Back to Created QRs",
    // ===== BULK QR =====
    bulkqr:"Bulk QR", bulkqr_title:"Bulk QR Code", bulkqr_hint:"One shortened link per line. Generate QR codes in bulk and download as an Excel file.",
    bulkqr_generate:"Generate bulk QR", bulkqr_download:"Download Excel (.xls)", bulkqr_color:"QR color",
    bulkqr_empty:"No valid links.", bulkqr_max:"Max. {max} links per batch.",
    bulkqr_loading:"Generating QR...", bulkqr_done:"Generated {count} QR codes. Click 'Download Excel' to save.",
    bulkqr_enter_list:"Please enter a list of links.", bulkqr_result_heading:"Results ({count} QR codes)", bulkqr_col_link:"Short link", bulkqr_col_qr:"QR Code",
    bulkqr_super:"Requires Pro or Super plan.",
    // ===== DASHBOARD =====
    my_links:"My links", total_clicks:"Total clicks", daily_limit:"Daily link limit",
    create_new:"Create new link", create_success:"Link created successfully!",
    col_link:"Link", col_dest:"Destination", col_clicks:"Clicks", col_status:"Status", col_created:"Created",
    status:"Status", created:"Created", actions:"Actions",
    copy:"Copy", copied:"Copied ✓", stats:"Analytics", edit:"Edit", del:"Delete",
    enabled:"Enabled", disabled:"Disabled", deleted:"Deleted", undo_delete:"Undo delete", force_delete:"Delete permanently",
    delete_link_title:"Delete link?", delete_link_desc:"The link will be struck through and auto-deleted after 24h. You can restore it during this time.", btn_ok:"OK", btn_cancel:"Cancel", maintenance_feature_prefix:"This feature is under maintenance",
    pricing_downgrade_blocked:"You're currently on the {tier} plan and can't switch to a lower one!", acct_session_active:"Active", analytics_stats_hint:"Click \\\"Stats\\\" on any link in Short URLs to see detailed analytics.",
    btn_confirm:"Confirm", btn_understood:"Got it", contact_support_btn:"✉️ Contact support",
    qr_success_title:"Congratulations!", qr_success_desc1:"Account {user} has been successfully upgraded to the {tier} plan.",
    qr_success_desc2:"Thank you for trusting and supporting us. Your support helps {domain} keep improving.",
    qr_success_desc3:"We hope you have a great experience with us!<br>If you need support, contact {email} — we'll respond as soon as possible.",
    qr_fail_title:"Request could not be processed", qr_fail_desc1:"Unfortunately, your upgrade transaction to the {tier} plan hasn't been confirmed.",
    qr_fail_reason_label:"Reason:", qr_fail_reason_default:"No matching transaction found for the transfer content",
    qr_fail_desc2:"Please double-check your transfer details, or contact {email} with a screenshot of your receipt for faster support.",
    qr_revoked_title:"Transaction reversed", qr_revoked_desc1:"An error occurred while verifying transaction <strong>{order}</strong>.",
    qr_revoked_desc2:"We sincerely apologize for the inconvenience.", qr_revoked_desc3:"If you already made the bank transfer, please contact {email} so we can resolve this right away.",
    stripe_success_title:"Payment successful!", stripe_success_desc1:"Your account has been upgraded to the {tier} plan.",
    stripe_success_desc2:"The plan expires in 30 days. You can renew it anytime.",
    stripe_cancel_title:"Payment cancelled", stripe_cancel_desc:"You cancelled the transaction. Your account is unchanged. You can try again anytime.",
    voucher_success_title:"Voucher purchase successful!", voucher_success_desc1:"The voucher code has been sent to your email.",
    voucher_success_desc2:"Check your inbox (including spam) for the voucher code. You can also view it later in your payment history.",
    voucher_cancel_title:"Voucher purchase cancelled", voucher_cancel_desc:"The transaction was cancelled. You can try again anytime.",
    export:"Export CSV", optional:"Optional", no_data:"No data yet.",
    delete_confirm:"Delete link /", delete_warning:"? This action cannot be undone.",
    edit_title:"Edit link /", edit_dest:"Destination URL", edit_save:"Save changes", edit_cancel:"Cancel",
    edit_enabled:"Enable link", edit_tags_placeholder:"comma separated",
    // ===== BULK =====
    bulk_title:"Bulk create", bulk_sub:"Enter one URL per line. Max limit:",
    bulk_per_batch:"links per batch.", bulk_input_placeholder:"https://example1.com\\nhttps://example2.com",
    bulk_submit:"Bulk create", bulk_success:"Success", bulk_errors:"Errors", bulk_empty:"Please enter at least 1 URL.",
    bulk_csv_hint:"One per line: URL,alias,campaign (alias and campaign are optional). Ex: https://example.com,promo,Q1-Sale",
    // ===== ANALYTICS =====
    analytics_title:"Analytics", analytics_back:"← Back to dashboard",
    analytics_total:"Total clicks", analytics_24h:"Last 24 hours", analytics_7d:"Last 7 days", analytics_30d:"Last 30 days",
    analytics_14d:"Last 14 days", analytics_by_hour:"By hour (24h)", analytics_device:"Devices",
    analytics_country:"Countries", analytics_browser:"Browsers", analytics_referrer:"Referrers",
    analytics_recent:"Recent clicks", analytics_time:"Time", analytics_no_clicks:"No clicks yet.",
    // ===== ACCOUNT =====
    account_title:"Account", account_joined:"Joined", account_current_limits:"Current plan limits",
    account_upgrade:"Upgrade plan", account_upgrade_sub:"Unlock all powerful features to boost productivity.",
    account_pro:"Pro", account_pro_desc:"For marketers & creators",
    account_super:"Super", account_super_desc:"For businesses & teams",
 account_voucher:"Activate with voucher code", account_voucher_hint:"Have a voucher? Enter it to upgrade for free.",
    account_voucher_btn:"Enter voucher code", account_enter_voucher:"Enter voucher code:",
    acct_links_day:"Links/day", acct_detailed:"detailed", acct_max:"max", yes:"Yes", no:"No",
    joined:"Joined", plan:"Plan",
    // ===== UPGRADE =====
    upgrade_pro:"Upgrade Pro", upgrade_super:"Upgrade Super", upgrade_plus:"Upgrade Plus",
    upgrade_to_unlock:"Upgrade to unlock this feature",
    feature_requires_account:"Feature available for registered / Pro / Super accounts only.",
    upgrade_banner_title:"Upgrade to unlock this feature",
    upgrade_banner_desc:"Pro: 200 links/day, bulk, API · Super: 600 links/day, custom domain",
    upgrade_banner_btn:"Upgrade →",
    enter_voucher:"Enter voucher code", activate_voucher:"Activate with voucher code",
    // ===== VOUCHER =====
    pricing_voucher_title:"Activate voucher", pricing_voucher_placeholder:"Enter voucher code",
    pricing_voucher_activate:"Activate", pricing_voucher_buy_link:"Buy voucher with discount",
    pricing_voucher_select_prompt:"Select a plan and duration to buy a voucher first (applies during promotions).",
    pricing_voucher_choose_plan:"Choose plan:", pricing_voucher_choose_time:"Choose duration:",
    pricing_voucher_week:"1 week", pricing_voucher_month:"1 month", pricing_voucher_year:"1 year",
    pricing_voucher_pay:"Checkout", pricing_voucher_save:"save", vn_pay_title:"🇻🇳 Payment", vn_pay_select_period:"Select duration:", vn_pay_bank:"Bank:", vn_pay_acct_no:"Account No.:", vn_pay_acct_name:"Account Holder:", vn_pay_amount:"Amount:", vn_pay_transfer_content:"Transfer note:", vn_pay_security:"Transaction secured by the bank. Admin approval within 1 hour.", vn_pay_confirm:"I have transferred", vn_pay_processing:"Processing...", vn_pay_success:"Request received. Admin will approve within 1 hour.",
    pricing_voucher_select_alert:"Please select a plan and duration", pricing_voucher_enter_code:"Please enter a code",
    pricing_voucher_invalid:"Invalid voucher",
    // ===== PRICING =====
    pricing_title:"Pricing & plan comparison", pricing_hero_title:"Transparent pricing",
    pricing_hero_desc:"Pick the plan that fits you. Upgrade or cancel anytime. No hidden fees.",
    pricing_per_month:"/mo", pricing_free_desc:"Start with the basics",
    pricing_f_10links:"10 links/day", pricing_f_manage:"Link management", pricing_f_clickstats:"Click analytics",
    pricing_plus_desc:"150 links/day", pricing_plus_btn:"Upgrade Plus",pricing_per_week:"/week",
    pricing_plus_f1:"150 links/day", pricing_plus_f2:"Links never expire", pricing_plus_f3:"Bulk shorten — 150 links/batch",
    pricing_f_qrdyn_plus:"Dynamic QR (change destination, no reprint) — 20/month",
    pricing_f_qrdyn_pro:"Dynamic QR — 100/month · Bulk QR 50/batch",
    pricing_f_qrdyn_super:"Dynamic QR — 500/month · Bulk QR 200/batch",
    pricing_popular:"Most popular", pay_vn_btn:"VN Payment (MoMo/Napas)", pricing_per_batch:"batch", pricing_per_link:"link", pricing_links:"links",
    pricing_day:"day", pricing_month:"month", pricing_req_month:"requests/month", pricing_custom:"custom",
    pricing_advanced_mgmt:"Advanced management", pricing_compare_title:"Detailed comparison", pricing_compare_feature:"Feature",
    pricing_expiry:"Link validity", pricing_unlimited_short:"∞", pricing_7days:"7 days",
    pricing_support:"Support", pricing_support_247:"24/7 + SLA",
    pricing_cta_title:"Ready to upgrade?", pricing_cta_desc:"Upgrade today to unlock all features.",
    pricing_cta_btn:"Get started",
    pricing_checkout_error:"Checkout error", pricing_connection_error:"Connection error",
    pricing_error_notice:"If checkout fails or your plan/voucher isn't delivered after payment, please email a screenshot of the successful transaction (with exact date and time) to",
    pricing_error_subject:"SHURL payment issue", pricing_error_body:"Describe the issue:\\n\\nPlan:\\nTransaction date/time:\\n\\nAttach transaction screenshot",
    pricing_error_desc:"Our review team will refund you with an equivalent voucher as soon as possible.",
    pricing_footer:"SHURL — Multi-tier link shortening platform · Secure · Fast",
    // ===== PLAN FEATURES =====
    plan_pro_f1:"200 links/day", plan_pro_f2:"300 links/batch", plan_pro_f3:"Advanced management",
    plan_pro_f4:"detailed", plan_pro_f5:"QR Code", plan_pro_f6:"5,000 requests/month",
    plan_pro_f7:"1 pixel/link, 50 links", plan_pro_f8:"2 URLs, 20 links", plan_pro_f9:"iOS/Android",
    plan_pro_f10:"Deep link", plan_pro_f11:"Password protection (optional)",
    plan_super_f1:"600 links/day", plan_super_f2:"600 links/batch", plan_super_f3:"All Pro features",
    plan_super_f4:"advanced (heatmap)", plan_super_f5:"QR Code + bulk QR", plan_super_f6:"10,000 requests/month",
    plan_super_f7:"Custom domain", plan_super_f8:"2 pixels/link, ∞", plan_super_f9:"3 URLs, custom %, ∞",
    plan_super_f10:"smart fallback", plan_super_f11:"brute-force protection",
    plan_ps_f1:"600 links/day (Pro x6)", plan_ps_f2:"600 links/batch", plan_ps_f5:"10,000 requests/month (x10)",
    plan_ps_f8:"3 URLs, custom %, ∞", plan_ps_f9:"smart fallback",
    plan_unlimited:"unlimited", plan_advanced:"advanced", plan_priority_support:"Priority support",
    // ===== FAQ =====
    pricing_faq_title:"Frequently asked questions",
    pricing_faq1_q:"Can I cancel anytime?", pricing_faq1_a:"Yes. You can cancel your plan at any time. After cancellation, your account returns to the Free plan but existing links remain intact.",
    pricing_faq2_q:"Can I pay with a voucher?", pricing_faq2_a:"Yes. If you have a voucher code, go to Account → Enter voucher code to upgrade for free.",
    pricing_faq3_q:"Will my old links be lost if I downgrade?", pricing_faq3_a:"No. All created links remain intact. Only advanced features are locked when downgrading.",
    pricing_faq4_q:"Can I use a custom domain?", pricing_faq4_a:"Custom domain is available on the Super plan only. You need to point DNS to SHURL.",
    pricing_faq5_q:"Does the API have rate limits?", pricing_faq5_a:"Pro: 5,000 requests/month. Super: 10,000/month.",
    pricing_faq6_q:"What's different about Plus?", pricing_faq6_a:"Plus allows 150 links/day and bulk shortening of 150 links per batch. Links never expire — great for any campaign.",
    pricing_faq7_q:"Is buying a voucher cheaper than upgrading directly?", pricing_faq7_a:"Only during promotions (set by admin). Outside promotions, voucher prices match direct upgrade prices.",
    // ===== PAYMENT =====
    pay_history_title:"Payment history", pay_type:"Type", pay_date:"Payment date", pay_status:"Status",
    pay_voucher:"Voucher", pay_upgrade:"Upgrade", pay_success:"Success", pay_failed:"Failed", pay_no_history:"No transactions yet.",
    // ===== TIER LIMITS =====
    tier_limits_title:"Current plan limits", links_per_day:"Links/day", advanced_mgmt:"Advanced management",
    detailed_stats:"Detailed analytics", max:"max",
    // ===== BROWSER EXTENSION =====
    ext_title:"Connect browser extension",
    ext_desc:"Use this code to connect the SHURL Chrome extension — see recent links, click counts, and quick-shorten the page you're viewing, right from the popup. Free on every plan.",
    ext_no_token:"You don't have an extension connection code yet.", ext_gen_btn:"Generate code", ext_regen_btn:"Regenerate code",
    // ===== AI ASSISTANT =====
    ai_assistant_title:"Ask AI", ai_assistant_placeholder:"Type your question...", ai_assistant_send:"Send",
    ai_assistant_greeting:"Hi there! I'm SHURL's AI assistant — how can I help?",
    ai_assistant_error:"Couldn't send your message, please try again.",
    // ===== API =====
    api_title:"API Token", api_no_token:"You don't have an API token yet.", api_gen_token:"Generate token",
    api_regen_token:"Regenerate token", api_monthly_limit:"Quota:", api_requests_month:"requests/month.",
    api_example:"Usage example (cURL)", api_other:"Other endpoints: GET /api/v1/links · GET /api/v1/analytics/:code",
    url_tool_title:"URL Encoder / Decoder", url_tool_hint:"Encode or decode a URL string (encodeURIComponent/decodeURIComponent) — runs entirely in your browser, no data is sent to the server.",
    url_tool_input_label:"Input", url_tool_output_label:"Output", url_tool_encode_btn:"Encode", url_tool_decode_btn:"Decode",
    url_tool_copy:"Copy", url_tool_error:"Invalid string to decode.",
    api_no_access:"API is not available on your current plan. Upgrade to PRO or SUPER to use it.",
    // ===== ADMIN =====
    admin_title:"System administration", admin_users:"Users", admin_reports:"Abuse reports",
    admin_blacklist:"Blacklist", admin_vouchers:"Vouchers",
    admin_username:"Username", admin_email:"Email", admin_role:"Role", admin_created:"Created",
    admin_save:"Save", admin_reason:"Reason", admin_status:"Status", admin_dismiss:"Dismiss",
    admin_no_reports:"No reports.", admin_add_domain:"Add", admin_add_keyword:"Add",
    admin_new_domain:"bad-example.com", admin_new_keyword:"keyword",
    admin_bl_domains:"Blocked domains", admin_bl_keywords:"Sensitive keywords (add)",
    admin_bl_defaults:"Default keywords (cannot be deleted):",_create_voucher:"+ Create new voucher",
    admin_voucher_code:"Voucher code", admin_tier:"Plan", admin_used:"Used", admin_limit:"Limit",
    admin_expires:"Expires", admin_active:"Status", admin_delete:"Delete",
    admin_panel_title:"Admin dashboard", admin_promo_title:"Promotion settings", admin_promo_enable:"Enable promotion",
    admin_promo_from:"From date", admin_promo_to:"To date", admin_promo_month_disc:"Monthly discount (%)", admin_promo_year_disc:"Yearly discount (%)",
    admin_promo_saved:"Promotion settings saved", admin_promo_save_error:"Error saving settings",
    admin_promo_ended:"Promotion has ended", admin_promo_starts:"Promotion will start", admin_promo_remaining:"Remaining",
    admin_pay_report_title:"Payment report", admin_customer:"Customer", admin_amount:"Amount", admin_total_revenue:"Total revenue",
    admin_export_csv:"Export CSV", admin_no_data:"No data", admin_report_error:"Error loading report",
    // ===== SIDEBAR =====
    sidebar_recent:"Recent", sidebar_ad_placeholder:"Ads — Coming soon", sidebar_ad_outside:"External ad slot",
    sidebar_ad:"Ad",
    sidebar_guest_title:"✨ Create a free account", sidebar_guest:"Sign up to get 10 links/day, link management, and analytics.",
    sidebar_guest_feat1:"Custom aliases", sidebar_guest_feat2:"Link management & analytics", sidebar_guest_btn:"Sign up now →",
    sidebar_pro_title:"⭐ Upgrade to Pro", sidebar_pro_desc:"Unlock powerful features.",
    sidebar_super_title:"🚀 Upgrade to Super", sidebar_super_desc:"For businesses.",
    sidebar_upgrade_now:"Upgrade now →", sidebar_view_super:"View Super plan →",
    sidebar_pro_current:"You're on Pro — move up to Super to get more:",
    sidebar_register_title:"✨ Sign up free", sidebar_register_desc:"Create an account for more benefits.",
    sidebar_register_feat1:"10 links/day", sidebar_register_feat2:"Custom aliases",
    sidebar_register_feat3:"Link management", sidebar_register_feat4:"Click analytics",
    sidebar_register_btn:"View pricing →",
    // ===== SUPPORT =====
    support_subject:"SHURL — Payment support", support_body_greeting:"Hello SHURL team,",
    support_body_issue:"I encountered an issue while paying for the plan:", support_body_plan:"Subscribed plan:",
    support_body_amount:"Amount:", support_body_date:"Payment date:",
    support_body_screenshot:"I've attached a screenshot of the successful payment.",
    support_body_thanks:"Thank you for your support.", support_body_name:"Account name:",
    support_title:"Payment issues?", support_desc:"If payment fails or your plan isn't activated, please contact our support team. Attach a screenshot of the successful payment so we can resolve it quickly.",
    support_contact_btn:"Contact support",
    // ===== EMAIL =====
    email_brand:"Short URL", email_voucher_subject:"SHURL Voucher — Plan activation code",
    email_voucher_thanks_1:"Thank you for using the plan", email_voucher_thanks_2:"of",
    email_voucher_instruction:"Copy this voucher and paste it into the voucher field in your Account section to activate:",
    email_voucher_activate_note:"Voucher plan", email_voucher_activate_note_2:"is activated immediately after entering the code.",
    email_voucher_warning:"Please do not share this voucher code with anyone to avoid loss.",
    email_voucher_closing:"Thank you for contributing to the growth of this platform.", email_signature:"Best regards,",
    // ===== ROLES =====
    role_guest:"Guest", role_free:"Free", role_pro:"Pro", role_super:"Super", role_admin:"Administrator",
    // ===== MISC =====
    days:"days", hours:"hours", minutes:"minutes", loading:"Loading...", footer_tagline:"Multi-tier link shortening platform · Secure · Fast",
    footer_contact:"Contact", ft_products:"Product", ft_tools:"Free tools", ft_support:"Support", ft_legal:"Legal", ft_shorten:"Link shortener", ft_qr:"QR codes", ft_bio:"Link-in-bio", ft_scanner:"QR scanner", ft_pricing:"Pricing", ft_api:"Developer API", ft_report:"Report abuse", ft_disclaimer:"Disclaimer", ft_all_tools:"All tools", ft_compliance:"SHURL is a link shortening and QR code service operating under applicable Vietnamese law. Using the service for fraud, impersonation or any unlawful purpose is strictly prohibited.", ft_rights:"All rights reserved.",
    bio_locked_desc:"Link-in-bio is a mini page that groups many links (Facebook, Zalo, your shop, etc.) behind a single short URL, like Linktree. Available on the Plus plan and above.",
    bio_help_title:"What is Link-in-bio? See the guide", bio_create_title:"Create a new page", bio_create_hint:"Group many links behind one short URL, Linktree-style.",
    bio_display_name:"Display name", bio_display_ph:"E.g. ABC Store", bio_desc_label:"Short description (optional)", bio_links_label:"Links", bio_add_link:"Add link",
    bio_code_label:"Custom code (optional)", bio_code_ph:"e.g. abc-store", bio_create_btn:"Create page", bio_list_title:"Your pages",
    bio_err_name:"Please enter a display name.", bio_err_links:"At least 1 valid link is required.", bio_creating:"Creating...", bio_created:"Created:",
    bio_row_title_ph:"Title (e.g. Facebook page)", bio_empty:"You haven't created any Link-in-bio pages yet.", bio_views:"views", bio_clicks:"clicks",
    home_title_ph:"A note for this link", home_pw_ph:"Leave empty = no protection", home_ab_suffix:" — add target URLs (Pro/Super)", home_ab_a_ph:"Target URL A (add)", home_ab_b_ph:"Target URL B (add)", home_your_link:"Your short link:",
    dash_links_title:"Link list", dash_empty:"No links yet.", dash_empty_cta:"Create your first link on the home page", export_help_title:"What is CSV export? See the guide",
    team_created_on:"Created:", team_members_count:"members", team_err_username:"Enter a username.", team_adding:"Adding...", team_added:"Added!", err_prefix:"Error:",
    link_expired_badge:"Expired", guide_scanner_title:"Scan & check QR codes", guide_scanner_desc:"Scan a QR code with your camera or an uploaded image, see the decoded content and check its safety before you open it.",
    guide_scanner_step1:"Turn on the camera or upload a QR image.", guide_scanner_step2:"See the decoded content: link, text, etc.", guide_scanner_step3:"Read the safety warning before opening the link.",
    scanner_page_title:"Scan & check QR codes", scanner_help_title:"What is the QR Scanner? See the guide", scanner_camera_start:"Start scanning", scanner_camera_stop:"Stop scanning", scanner_upload_label:"or upload a QR image", scanner_scan_again:"Scan another code",
    scanner_mode_title:"Choose scan mode", scanner_mode_camera:"Scan with camera", scanner_mode_file:"Scan from file",
    scanner_camera_permission_hint:"Allow camera access and point it at the QR code to scan.", scanner_file_dropzone:"Choose a QR image to upload",
    scanner_result_title:"Result", scanner_result_empty_title:"No QR code found", scanner_result_empty_desc:"Choose a scan mode and start scanning to see the result here.",
    scanner_flash_on:"Turn on light", scanner_flash_off:"Turn off light", scanner_switch_camera:"Switch camera", scanner_result_raw:"Decoded content", scanner_result_domain:"Domain",
    scanner_safety_ok:"Safe — no suspicious signs found.", scanner_safety_warning:"Warning — this link looks payment-related or is on the block list. Be careful before opening it.",
    scanner_shurl_link_title:"This is a SHURL short URL", scanner_shurl_link_dest:"Current destination", scanner_shurl_link_type_dynamic:"Dynamic QR — the destination may have changed after printing",
    scanner_shurl_link_type_static:"Regular link", scanner_shurl_link_disabled:"This link has been disabled.", scanner_shurl_link_expired:"This link has expired.", scanner_shurl_link_password:"This link is password protected.",
    scanner_no_camera:"Your browser does not support the camera, or you have not granted access.", scanner_scanning_hint:"Put the QR code inside the frame...", scanner_decode_fail:"Could not read a QR code in this image. Try a sharper one.",
    qr_print_check_title:"Check before printing", qr_print_check_ok:"Checked: this QR code scans.", qr_print_check_fail:"This QR code may be hard to scan — try a smaller logo, a larger size or higher color contrast.",
    qr_print_check_size_hint:"We recommend printing at least 2×2 cm for close phone scans, and 5×5 cm or larger if scanned from more than 30 cm away.",
    admin_access:"You have system administration access.", admin_go:"Go to admin", twofa_not_enabled_warning:"2FA is not enabled on this admin account. Turn it on now to protect the system.",
    ft_biz_name:"Operated by", ft_biz_tax:"Tax code", ft_biz_addr:"Address", ft_biz_phone:"Hotline",
    disclaimer_title:"Disclaimer", disclaimer_subtitle:"The limits of our responsibility when you use SHURL.",
    rp_title:"Report abuse", rp_sub:"Found a short link, QR code or page made with SHURL that is used for fraud, impersonation or anything unlawful? Please tell us.",
    rp_target:"Link or content to report", rp_target_ph:"Paste the short link (e.g. shurlvn.com/abc123) or describe the suspicious QR code / account", rp_category:"Type of abuse",
    rp_cat_scam:"Scam / taking money", rp_cat_phishing:"Fake login page / stealing information", rp_cat_impersonation:"Impersonating a person, brand or organization", rp_cat_malware:"Malware", rp_cat_illegal:"Unlawful content", rp_cat_spam:"Spam", rp_cat_other:"Other",
    rp_details:"More details (optional)", rp_contact:"Contact email (optional, so we can follow up)", rp_submit:"Send report", rp_sending:"Sending...",
    rp_ok:"Report received. Thank you for helping keep everyone safe.", rp_err_target:"Please enter the link or describe what you are reporting.", rp_err:"Could not send the report. Please try again.",
    rp_note:"Reports go to the SHURL administrators for review. If you have lost money, contact your bank and your local police right away.",
    footer_terms:"Terms of Service", footer_privacy:"Privacy Policy", footer_blog:"Blog", footer_tools:"Free tools", slide_back:"Back", legal_last_updated:"Last updated",
    terms_title:"Terms of Service", terms_subtitle:"Rules for using the SHORT URL service.",
    privacy_title:"Privacy Policy", privacy_subtitle:"How SHORT URL collects, uses, and protects your information.",
    register_legal_notice:"By signing up, you agree to our", and:"and",
    // ===== ERROR CODES =====
    err_url_invalid:"Invalid URL (must start with http:// or https://)",
    err_domain_blacklisted:"Destination domain is on the security blacklist.",
    err_keyword_blocked:'Custom alias contains brand or sensitive keywords.',
    err_code_taken:'Code already taken. Please choose another.',
    err_pixel_limit_reached:"You've reached your plan's pixel link limit.",
    err_ab_limit_reached:"You've reached your plan's A/B testing limit.",
    err_ab_percent_invalid:"A/B percentages must total 100%.",
    err_pw_wrong:"Incorrect password",
    err_pw_bruteforce:"Too many failed attempts. Try again in 15 minutes.",
    err_link_not_found:"Link not found",
    err_quota_exceeded:"You've exceeded your daily link limit."
,
    mt_title:"🛠️ Feature Maintenance", mt_desc:"Enable maintenance to temporarily disable a feature. Users will see a Maintenance ribbon and cannot use it.", mt_stripe:"Stripe (Card Payment)", mt_qr:"QR Bank (VietQR)", mt_voucher:"Voucher", mt_bulk:"Bulk Shorten", mt_api:"API", mt_analytics:"Analytics", mt_note_ph:"Maintenance reason (optional)", mt_ribbon:"Maintenance", mt_alert:"Feature under maintenance", mt_loading:"Loading...", mt_error:"Error", mt_confirm:"Confirm", mt_cancel:"Cancel", mt_save:"💾 Save", mt_success:"Success!", mt_payment_success:"Payment successful!", mt_payment_cancel:"Payment cancelled", mt_voucher_success:"Voucher purchased!", mt_voucher_cancel:"Voucher purchase cancelled", mt_expired_30:"Plan expires in 30 days. You can renew anytime.", mt_no_notif:"No new notifications", mt_notif_title:"🔔 Notifications", mt_pending_payments:"Pending payments", mt_pending_reports:"Reports", mt_downgrade_err:"You are on a higher plan, cannot purchase a lower one!", mt_pay_method:"Method", mt_no_history:"No transactions yet.",
    admin_create_voucher:"+ Create new voucher",
    sidebar_guest_desc:"Sign up to get 10 links/day, manage links, view analytics.",
    totp_code:"TOTP code (6 digits)",
    totp_required:"Correct password! Please enter the TOTP code from Google Authenticator.",
    webhooks:"Webhooks",
    data_export:"Data export",
    campaign_history:"Campaign history",
    team_management:"Team management",
    wh_tab_title:"Webhooks",
    wh_requires:"Webhooks require Pro or Super plan.",
    wh_loading:"Loading...",
    wh_add_title:"Add Webhook",
    wh_url_label:"Webhook URL (HTTPS)",
    wh_name_label:"Name (optional)",
    wh_add_btn:"Add Webhook",
    wh_guide_title:"Guide",
    wh_guide_desc:"Webhook sends a POST request to your URL every time someone clicks a link.",
    wh_empty:"No webhooks yet.",
    wh_col_name:"Name",
    wh_col_url:"URL",
    wh_col_event:"Event",
    wh_col_created:"Created",
    wh_col_delete:"Delete",
    wh_err_url:"Please enter a webhook URL.",
    wh_err_https:"URL must use HTTPS.",
    wh_adding:"Adding...", wh_added:"Webhook added!", wh_delete_confirm:"Delete this webhook?",
    export_tab_title:"Data Export", export_requires:"Data export requires Pro or Super plan.",
    export_csv_btn:"Export CSV", export_json_btn:"Export JSON", export_csv_done:"CSV exported!", export_json_done:"JSON exported!",
    export_desc:"Export includes all your links: code, destination URL, click count, status, created date, expiry date.",
    export_csv_hint:"CSV — open with Excel/Google Sheets. JSON — use for API or backup.",
    team_tab_title:"Team", team_requires:"Team requires Super plan.", team_loading:"Loading...",
    team_create_title:"Create Team", team_name_label:"Team name", team_create_btn:"Create Team",
    team_guide_title:"Guide", team_guide_desc:"Team allows multiple users to manage links together. Team members can view, edit, and delete each other's links.",
    team_guide_limit:"Super: max {count} members per team.", team_empty:"No team yet. Create one below.",
    team_col_member:"Member", team_col_role:"Role", team_col_joined:"Joined", team_role_owner:"Owner", team_role_member:"Member",
    team_delete_btn:"Delete Team", team_delete_confirm:"Delete this team? All members will be removed.",
    team_add_placeholder:"username", team_add_btn:"Add", team_remove_confirm:"Remove this member?",
    team_err_name:"Enter a team name.", team_creating:"Creating...", team_created:"Team created!",
    campaigns_tab_title:"Campaigns", campaigns_requires:"Campaign history requires Plus plan or higher.",
    campaigns_loading:"Loading...", campaigns_guide_title:"Guide",
    campaigns_guide_desc:"Campaigns help group links by marketing campaign. When you change a link's campaign, the old campaign history is saved automatically.",
    campaigns_guide_desc2:"You can see an overview: links per campaign, total clicks, and change history.",
    campaigns_empty:"No campaigns yet. Create a link with a campaign to get started.",
    campaigns_col_name:"Campaign", campaigns_col_links:"Links", campaigns_col_clicks:"Total clicks", campaigns_col_history:"History",
    campaigns_back:"← Back", campaigns_history_title:"Campaign history:", campaigns_no_links:"No links.",
    campaigns_view_history:"View history", campaigns_changed_date:"(changed on {date})",
    link_not_found:"Link not found", pw_too_many_attempts:"Too many failed attempts. Please try again in 15 minutes.",
    voucher_enter_code:"Enter a voucher code", voucher_not_found:"Voucher not found", voucher_disabled:"This voucher has been disabled", voucher_expired:"This voucher has expired", voucher_no_uses_left:"This voucher has no uses left", voucher_already_used:"You've already used this voucher",
    voucher_cannot_downgrade:"Your current plan ({current}) is higher than the voucher's ({voucherTier}). A voucher can't downgrade your plan.",
    voucher_days_added:"Added {days} days to your {tier} plan", voucher_upgraded:"Upgraded to the {tier} plan",
    stripe_error_generic:"Stripe error", missing_info:"Missing information", missing_order_id:"Missing orderId", not_found:"Not found",
    utm_builder_title:"UTM Builder", utm_builder_toggle:"Add UTM parameters (optional)",
    utm_builder_hint:"Automatically append UTM parameters to the destination URL. UTM campaign follows the Campaign field above.",
    utm_source:"Source (utm_source)", utm_medium:"Medium (utm_medium)", utm_term:"Term (utm_term)", utm_content:"Content (utm_content)",
    export_filter_campaign_label:"Filter by Campaign", export_filter_all:"All campaigns",
    admin_ban:"Ban", admin_unban:"Unban", admin_banned:"Banned", admin_active:"Active", admin_expires:"Expires:", admin_notify:"Send notification", admin_delete_user:"Delete user", admin_ban_user:"Ban user", admin_unban_user:"Unban user",
    guide_close:"Close guide", guide_show_steps:"Show guide",
    guide_home_title:"Get started with SHORT URL",
    guide_home_desc:"Create short links, QR Codes and manage your activity from one place.",
    guide_home_step1:"Create Short URL — Shorten a long URL into an easy-to-share link.",
    guide_home_step2:"Create QR Code — Turn your link into a QR Code for products, documents or promotions.",
    guide_home_step3:"Track activity — View clicks and usage data from Analytics.",
    guide_home_cta:"Create Short URL",
    guide_shorturls_title:"Create and manage Short URLs",
    guide_shorturls_desc:"Turn long URLs into short links that are easy to share and manage.",
    guide_shorturls_step1:"Paste original URL — Enter the URL you want to shorten.",
    guide_shorturls_step2:"Customize if needed — Use the available options in the system.",
    guide_shorturls_step3:"Create and share — Create your Short URL and use it across your channels.",
    guide_shorturls_cta:"Create Short URL",
    guide_dashboard_title:"Activity overview",
    guide_dashboard_desc:"Quickly track your Short URL status and account activity from one place.",
    guide_dashboard_step1:"View overview — Check key metrics.",
    guide_dashboard_step2:"Track activity — View recent system activity.",
    guide_dashboard_step3:"Dive into Analytics — Open Analytics for detailed analysis.",
    guide_dashboard_cta:"View Analytics",
    guide_bulkqr_title:"Create QR Codes for one or many URLs",
    guide_bulkqr_desc:"Quickly create a single QR Code or process multiple links at once for products and documents.",
    guide_bulkqr_step1:"Choose how to create — Create a single QR Code or use the bulk QR tool.",
    guide_bulkqr_step2:"Customize QR — Choose color and size to fit your needs.",
    guide_bulkqr_step3:"Create and download — Generate QR Codes and use them in documents, products or campaigns.",
    guide_analytics_title:"Understand each link performance",
    guide_analytics_desc:"Track clicks and discover how users interact with your links.",
    guide_analytics_step1:"View clicks — Track traffic over time.",
    guide_analytics_step2:"Analyze visitors — View the analytics data provided by the system.",
    guide_analytics_step3:"Compare performance — Use available data to evaluate which Short URLs perform better.",
    guide_webhooks_title:"What are Webhooks?",
    guide_webhooks_desc:"Connect SHORT URL with other systems to receive automatic notifications when events related to your links occur.",
    guide_webhooks_step1:"Create a Webhook — Add a destination URL to receive notifications.",
    guide_webhooks_step2:"Choose events to track — The system currently supports the click event.",
    guide_webhooks_step3:"Connect and test data — Confirm the Webhook works by monitoring requests to your URL.",
    guide_webhooks_cta:"Add Webhook",
    guide_export_title:"Export your data",
    guide_export_desc:"Download Short URL data and related activity for storage, analysis, or use in other systems.",
    guide_export_step1:"Select data to export — Choose the links and activity you want to download.",
    guide_export_step2:"Choose format — The system currently supports CSV and JSON export.",
    guide_export_step3:"Export and save — Download the file to your device.",
    guide_export_cta:"Export data",
    guide_campaigns_title:"Organize links by Campaign",
    guide_campaigns_desc:"Group Short URLs and related activity for easy management, tracking, and performance comparison.",
    guide_campaigns_step1:"Create a Campaign — Assign a campaign to a link when creating or editing.",
    guide_campaigns_step2:"Attach related links — Links in the same campaign are grouped together.",
    guide_campaigns_step3:"Track and compare performance — View overview: link count, total clicks, and change history.",
    guide_campaigns_cta:"View Campaigns",
    guide_team_title:"Work with your Team",
    guide_team_desc:"Manage members and permissions so multiple people can collaborate on SHORT URL.",
    guide_team_step1:"Invite members — Add a member's username to the team.",
    guide_team_step2:"Set access levels — Owner and Member have different permissions within the team.",
    guide_team_step3:"Collaborate and track data — Team members can view, edit, and delete each other's links.",
    guide_team_cta:"Create Team",
    guide_api_title:"Integrate SHORT URL via API",
    guide_api_desc:"Use the API to connect SHORT URL with your website, app, or internal system.",
    guide_api_step1:"Create or get your API Key — Generate an API token on this page.",
    guide_api_step2:"Send a request to the API — Use the /api/v1/shorten endpoint with your API Key.",
    guide_api_step3:"Receive and process results — The API returns a short link and related data.",
    guide_api_cta:"Create API Key",
    guide_pricing_title:"Choose the right plan",
    guide_pricing_desc:"Compare service plans and choose the level that fits your Short URL creation, management, and tracking needs.",
    guide_pricing_step1:"View plan limits — Free, Plus, Pro, and Super.",
    guide_pricing_step2:"Compare features — Each plan has different link limits, API, analytics, and features.",
    guide_pricing_step3:"Choose the right plan — Upgrade when you need more capacity.",
    guide_pricing_cta:"View Plans",
    guide_account_title:"Manage your account",
    guide_account_desc:"Manage account information, personal preferences, and settings related to your SHORT URL experience.",
    guide_account_step1:"Check account info — View username, email, and current plan.",
    guide_account_step2:"Adjust settings — Update your information and personal preferences.",
    guide_account_step3:"Save changes — Confirm to apply.",
    guide_account_cta:"Update account",
    guide_admin_title:"System administration",
    guide_admin_desc:"Monitor and manage SHORT URL components from the admin area.",
    guide_admin_step1:"Check system overview — Manage users, links, and reports.",
    guide_admin_step2:"Manage data and users — Review reports, blacklist, vouchers, and payments.",
    guide_admin_step3:"Check admin settings — Maintenance, security, audit logs, and notifications.",
    guide_admin_cta:"Open Admin",
    notif_title:"Notifications", notif_empty:"No notifications", notif_from:"From:", notif_new:"New", notif_ok:"Got it", crown_hint:"View feature guide", crown_upgrade_to_unlock:"Upgrade to unlock this feature", demo_bulkqr_title:"Bulk QR — Create QR in bulk", demo_webhooks_title:"Webhooks — Auto-send events", demo_campaigns_title:"Campaigns — Manage link groups", demo_export_title:"Export — Export data", demo_api_title:"API — Integrate external systems", demo_dashboard_title:"Dashboard — Manage Short URLs", demo_bulkqr_s1_t:"Enter multiple URLs in text box", demo_bulkqr_s1_d:"One URL per line", demo_bulkqr_s2_t:"Click Generate QR", demo_bulkqr_s2_d:"System creates QR for each URL", demo_bulkqr_s3_t:"Download all QR", demo_bulkqr_s3_d:"ZIP file with all QR Codes", demo_webhooks_s1_t:"Add webhook destination URL", demo_webhooks_s1_d:"URL receives event notifications", demo_webhooks_s2_t:"When someone clicks link", demo_webhooks_s2_d:"Webhook auto-POSTs event to URL", demo_webhooks_s3_t:"External system receives data", demo_webhooks_s3_d:"IP, country, device, time", demo_campaigns_s1_t:"Create new Campaign", demo_campaigns_s1_d:"Name and describe your campaign", demo_campaigns_s2_t:"Add Short URLs to Campaign", demo_campaigns_s2_d:"Multiple links in one group", demo_campaigns_s3_t:"View aggregate Analytics", demo_campaigns_s3_d:"Stats for all links in Campaign", demo_export_s1_t:"Choose CSV or JSON format", demo_export_s1_d:"Export all links and stats", demo_export_s2_t:"Click Export button", demo_export_s2_d:"System compiles data", demo_export_s3_t:"Download file", demo_export_s3_d:"File with all links + clicks + dates", demo_api_s1_t:"Create API Token", demo_api_s1_d:"Token for API authentication", demo_api_s2_t:"Send POST /api/v1/shorten", demo_api_s2_d:"Create Short URL from external system", demo_api_s3_t:"Receive JSON result", demo_api_s3_d:"Short URL code + full link", demo_dashboard_s1_t:"Create Short URL", demo_dashboard_s1_d:"Paste long URL → get short link", demo_dashboard_s2_t:"Manage links", demo_dashboard_s2_d:"Copy, QR, Analytics, Edit, Delete", demo_dashboard_s3_t:"View stats", demo_dashboard_s3_d:"Link count, total clicks", demo_anim_url:"URL", demo_anim_qr:"QR", demo_anim_ok:"✓", demo_anim_link_click:"Link click", demo_anim_event:"Event", demo_anim_post:"POST → URL", demo_anim_external:"External System", demo_anim_campaign:"Campaign", demo_anim_analytics:"Analytics", demo_anim_data:"Data", demo_anim_export:"Export", demo_anim_csv:"CSV/JSON", demo_anim_app:"App", demo_anim_url_long:"Long URL", demo_anim_clicks:"Clicks", api_tier_expired:"Your plan has expired. Please upgrade to continue using the API.", api_not_available:"Current plan does not support API. Upgrade to PRO or SUPER.", api_quota_exceeded:"You have exhausted your API quota", api_upgrade_to_continue:"Please upgrade to continue.", api_upgrade_to_increase:"Please upgrade to increase limits.",
    feedback_title:"Feedback & Support", feedback_btn:"Feedback", feedback_type_bug:"Report bug", feedback_type_feature:"Request feature", feedback_type_question:"Ask question", feedback_type_other:"Other", feedback_label_message:"Message", feedback_placeholder:"Describe the issue, suggestion or question...", feedback_label_email:"Email (optional)", feedback_email_placeholder:"email@example.com", feedback_cancel:"Cancel", feedback_submit:"Send", feedback_success_title:"Sent!", feedback_success_desc:"Thank you! We will review and respond soon.", feedback_close:"Close", feedback_error:"Something went wrong, please try again.", admin_feedback_tab:"Feedback", admin_no_feedback:"No feedback yet.", acct_overview:"Account overview", acct_total_clicks:"Total clicks", acct_profile_title:"Account profile", acct_username:"Username", acct_joined:"Joined", acct_plan_title:"Current plan", acct_plan_active:"Active", acct_plan_running:"Running ✓", acct_plan_expired:"Expired", acct_free:"Free", acct_joined_label:"Joined", acct_expiry_label:"Expires", acct_start_label:"Started", acct_upgrade_plan:"Upgrade plan", acct_manage_plan:"Manage plan", acct_pay_plan:"Plan", acct_pay_method:"Method", acct_pay_amount:"Amount", acct_voucher_title:"Activate with Voucher code", acct_voucher_hint:"Enter voucher code to activate offers or service plans.", acct_voucher_placeholder:"Enter voucher code", acct_voucher_btn:"Activate", acct_security_title:"Security", acct_2fa_enabled:"Enabled ✓", acct_2fa_disabled:"Not enabled", acct_session:"Session", acct_current_device:"Current device", acct_browser:"Browser", acct_bank_qr:"Bank QR", acct_pay_method_stripe:"Stripe", adm_notif_sys:"System notifications", adm_notif_empty:"No new notifications", adm_notif_read:"Read", adm_notif_unread:"Unread", adm_notif_delete:"Delete", adm_notif_delete_confirm:"Delete this notification?", adm_notif_deleted:"Notification deleted", adm_notif_not_found:"Notification not found", adm_notif_missing_id:"Missing notification ID", adm_notif_from:"From", adm_notif_to:"Sent to", adm_notif_all_users:"All users", adm_notif_close:"Close", fb_detail_title:"Feedback details", fb_detail_type:"Type", fb_detail_sender:"Sender", fb_detail_anonymous:"Anonymous", fb_detail_page:"Page", fb_detail_time:"Time", fb_detail_status:"Status", fb_status_new:"New", fb_status_replied:"Replied", fb_status_closed:"Closed", fb_type_bug:"Bug report", fb_type_feature:"Feature request", fb_type_question:"Q&A", fb_type_other:"Other", notif_mark_all_read:"Mark all as read", notif_marked_all:"All marked as read",
  },
};

function t(key){
  var lang = i18n[currentLang] || i18n.vi;
  return lang[key] || i18n.vi[key] || key;
}

// Like t(), but for strings that need a value embedded mid-sentence — e.g. t("qr_success_desc1")
// returns "Tài khoản {user} đã..." and tf() swaps {user}/{tier}/etc for the actual (already-esc'd) values.
function tf(key, vars){
  var s = t(key);
  for (var k in vars) { s = s.split("{" + k + "}").join(vars[k]); }
  return s;
}

function guideCard(page){
  try { if (localStorage.getItem("shurl_guide_" + page) === "closed") return ""; } catch(e) {}
  if (!document.getElementById("guideCardCSS")) {
    var s = document.createElement("style");
    s.id = "guideCardCSS";
    s.textContent = '.guide-card{display:flex;gap:20px;align-items:flex-start;background:var(--card);border:1px solid var(--border);border-radius:16px;padding:20px;margin-bottom:18px;animation:fadeInUp 0.3s ease-out;}' +
      '.guide-illustration{flex-shrink:0;width:72px;height:72px;display:flex;align-items:center;justify-content:center;background:var(--stat-bg);border-radius:12px;}' +
      '.guide-content{flex:1;min-width:0;}' +
      '.guide-header{display:flex;justify-content:space-between;align-items:flex-start;gap:12px;margin-bottom:12px;}' +
      '.guide-title{font-size:16px;font-weight:700;color:var(--text);margin:0 0 4px;}' +
      '.guide-desc{font-size:13px;color:var(--muted);margin:0;line-height:1.5;}' +
      '.guide-close{flex-shrink:0;background:none;border:none;color:var(--muted);font-size:22px;cursor:pointer;padding:0;width:28px;height:28px;display:flex;align-items:center;justify-content:center;border-radius:6px;line-height:1;}' +
      '.guide-close:hover{background:var(--hover-row);color:var(--text);}' +
      '.guide-toggle{flex-shrink:0;background:none;border:none;color:var(--indigo);font-size:12px;font-weight:600;cursor:pointer;padding:4px 0;display:flex;align-items:center;gap:4px;}' +
      '.guide-toggle svg{transition:transform 0.2s ease;}' +
      '.guide-card.expanded .guide-toggle svg{transform:rotate(180deg);}' +
      '.guide-steps{display:none;}' +
      '.guide-card.expanded .guide-steps{display:flex;}' +
      '.guide-steps{flex-direction:column;gap:8px;margin-bottom:14px;}' +
      '.guide-step{display:flex;align-items:flex-start;gap:10px;font-size:13px;color:var(--text);line-height:1.5;}' +
      '.guide-step-num{flex-shrink:0;width:22px;height:22px;border-radius:50%;background:var(--indigo);color:#fff;font-size:12px;font-weight:700;display:flex;align-items:center;justify-content:center;}' +
      '@media(max-width:640px){.guide-card{flex-direction:column;}.guide-illustration{width:100%;height:60px;}}';
    document.head.appendChild(s);
  }
  var svgs = {
    home: '<svg width="56" height="56" viewBox="0 0 56 56" fill="none"><circle cx="14" cy="10" r="7" stroke="var(--indigo)" stroke-width="2" fill="none"/><path d="M7 10h14M14 3c3 3 3 11 0 14M14 3c-3 3-3 11 0 14" stroke="var(--indigo)" stroke-width="1.5" fill="none"/><path d="M14 19v5M11 22l3 3 3-3" stroke="var(--muted)" stroke-width="2" fill="none" stroke-linecap="round"/><rect x="6" y="26" width="16" height="16" rx="2" stroke="var(--sky)" stroke-width="2" fill="none"/><path d="M6 30h4M6 34h4M12 30h4M12 34h4M6 38h8" stroke="var(--sky)" stroke-width="1.5"/><path d="M14 44v5M11 47l3 3 3-3" stroke="var(--muted)" stroke-width="2" fill="none" stroke-linecap="round"/><circle cx="14" cy="53" r="3" fill="var(--green)" opacity="0.8"/></svg>',
    shorturls: '<svg width="56" height="56" viewBox="0 0 56 56" fill="none"><rect x="4" y="8" width="48" height="8" rx="4" fill="var(--muted)" opacity="0.3"/><rect x="4" y="8" width="48" height="8" rx="4" stroke="var(--muted)" stroke-width="1.5" fill="none"/><path d="M28 20v6M25 23l3 3 3-3" stroke="var(--muted)" stroke-width="2" fill="none" stroke-linecap="round"/><rect x="14" y="30" width="28" height="10" rx="5" fill="var(--indigo)" opacity="0.15"/><rect x="14" y="30" width="28" height="10" rx="5" stroke="var(--indigo)" stroke-width="2" fill="none"/><circle cx="19" cy="35" r="2" fill="var(--indigo)"/></svg>',
    dashboard: '<svg width="56" height="56" viewBox="0 0 56 56" fill="none"><rect x="6" y="34" width="8" height="16" rx="2" fill="var(--sky)" opacity="0.6"/><rect x="18" y="24" width="8" height="26" rx="2" fill="var(--indigo)" opacity="0.7"/><rect x="30" y="14" width="8" height="36" rx="2" fill="var(--indigo)"/><rect x="42" y="28" width="8" height="22" rx="2" fill="var(--sky)" opacity="0.6"/><path d="M6 28L18 18l12 8 12-14" stroke="var(--green)" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round" opacity="0.8"/></svg>',
    bulkqr: '<svg width="56" height="56" viewBox="0 0 56 56" fill="none"><text x="2" y="10" font-size="6" fill="var(--muted)" font-family="monospace">URL1</text><text x="2" y="22" font-size="6" fill="var(--muted)" font-family="monospace">URL2</text><text x="2" y="34" font-size="6" fill="var(--muted)" font-family="monospace">URL3</text><path d="M20 7h4M20 19h4M20 31h4" stroke="var(--muted)" stroke-width="1.5" stroke-linecap="round"/><path d="M28 7l3 3-3 3M28 19l3 3-3 3M28 31l3 3-3 3" stroke="var(--muted)" stroke-width="1.5" fill="none" stroke-linecap="round" stroke-linejoin="round"/><rect x="36" y="2" width="16" height="16" rx="2" stroke="var(--indigo)" stroke-width="2" fill="none"/><rect x="38" y="4" width="4" height="4" fill="var(--indigo)"/><rect x="46" y="4" width="4" height="4" fill="var(--indigo)"/><rect x="38" y="12" width="4" height="4" fill="var(--indigo)"/><rect x="36" y="20" width="16" height="16" rx="2" stroke="var(--sky)" stroke-width="2" fill="none"/><rect x="38" y="22" width="4" height="4" fill="var(--sky)"/><rect x="46" y="22" width="4" height="4" fill="var(--sky)"/><rect x="38" y="30" width="4" height="4" fill="var(--sky)"/><rect x="36" y="38" width="16" height="16" rx="2" stroke="var(--green)" stroke-width="2" fill="none"/><rect x="38" y="40" width="4" height="4" fill="var(--green)"/><rect x="46" y="40" width="4" height="4" fill="var(--green)"/><rect x="38" y="48" width="4" height="4" fill="var(--green)"/></svg>',
    analytics: '<svg width="56" height="56" viewBox="0 0 56 56" fill="none"><path d="M6 46L18 30l10 8 16-22" stroke="var(--indigo)" stroke-width="2.5" fill="none" stroke-linecap="round" stroke-linejoin="round"/><circle cx="18" cy="30" r="3" fill="var(--indigo)"/><circle cx="28" cy="38" r="3" fill="var(--indigo)"/><circle cx="44" cy="16" r="3" fill="var(--green)"/><path d="M6 50h44" stroke="var(--muted)" stroke-width="1.5" stroke-linecap="round" opacity="0.3"/></svg>',
    webhooks: '<svg width="56" height="56" viewBox="0 0 56 56" fill="none"><rect x="1" y="3" width="14" height="9" rx="2" stroke="var(--indigo)" stroke-width="2" fill="none"/><text x="3" y="10" font-size="5" fill="var(--indigo)" font-family="monospace">URL</text><path d="M15 7.5h4" stroke="var(--muted)" stroke-width="1.5" stroke-linecap="round"/><path d="M19 7.5l2 2-2 2" stroke="var(--muted)" stroke-width="1.5" fill="none" stroke-linecap="round" stroke-linejoin="round"/><path d="M21 7.5l4 0" stroke="var(--amber)" stroke-width="2" stroke-linecap="round"/><path d="M25 4l-1.5 3.5L25 8l-1.5 3.5" stroke="var(--amber)" stroke-width="1.8" fill="none" stroke-linecap="round" stroke-linejoin="round"/><path d="M25 7.5h4" stroke="var(--muted)" stroke-width="1.5" stroke-linecap="round"/><path d="M29 7.5l2 2-2 2" stroke="var(--muted)" stroke-width="1.5" fill="none" stroke-linecap="round" stroke-linejoin="round"/><rect x="33" y="3" width="14" height="9" rx="2" stroke="var(--green)" stroke-width="2" fill="none"/><path d="M36 6h8M36 8.5h5" stroke="var(--green)" stroke-width="1.2"/><path d="M47 7.5h4" stroke="var(--muted)" stroke-width="1.5" stroke-linecap="round"/><path d="M51 7.5l2 2-2 2" stroke="var(--muted)" stroke-width="1.5" fill="none" stroke-linecap="round" stroke-linejoin="round"/><rect x="1" y="20" width="54" height="10" rx="2" stroke="var(--sky)" stroke-width="1.5" fill="var(--sky)" opacity="0.06"/><rect x="1" y="20" width="54" height="10" rx="2" stroke="var(--sky)" stroke-width="1.5" fill="none"/><circle cx="6" cy="25" r="2" fill="var(--sky)"/><path d="M11 25h6M11 23h4" stroke="var(--sky)" stroke-width="1.2"/><text x="22" y="27" font-size="6" fill="var(--sky)" font-family="sans-serif">External</text><path d="M8 12v4M6 14l2 2 2-2" stroke="var(--muted)" stroke-width="1.5" fill="none" stroke-linecap="round" stroke-linejoin="round"/><path d="M36 12v4M34 14l2 2 2-2" stroke="var(--muted)" stroke-width="1.5" fill="none" stroke-linecap="round" stroke-linejoin="round"/><path d="M28 15v5" stroke="var(--amber)" stroke-width="1.5" stroke-linecap="round" stroke-dasharray="2 2"/></svg>',
    export: '<svg width="56" height="56" viewBox="0 0 56 56" fill="none"><rect x="1" y="2" width="18" height="20" rx="2" stroke="var(--indigo)" stroke-width="2" fill="none"/><path d="M4 7h12M4 11h12M4 15h12M4 19h8" stroke="var(--indigo)" stroke-width="1.2" opacity="0.4"/><rect x="4" y="4" width="4" height="2" fill="var(--indigo)" opacity="0.5"/><rect x="10" y="4" width="4" height="2" fill="var(--indigo)" opacity="0.5"/><path d="M19 12h5" stroke="var(--muted)" stroke-width="2" stroke-linecap="round"/><path d="M24 12l2 2-2 2" stroke="var(--muted)" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"/><path d="M26 12v18" stroke="var(--green)" stroke-width="2.5" stroke-linecap="round"/><path d="M22 26l4 4 4-4" stroke="var(--green)" stroke-width="2.5" fill="none" stroke-linecap="round" stroke-linejoin="round"/><rect x="33" y="6" width="22" height="26" rx="2" stroke="var(--sky)" stroke-width="2" fill="var(--sky)" opacity="0.06"/><rect x="33" y="6" width="22" height="26" rx="2" stroke="var(--sky)" stroke-width="2" fill="none"/><path d="M33 12h22" stroke="var(--sky)" stroke-width="1.5"/><rect x="36" y="8" width="3" height="2" fill="var(--sky)"/><rect x="41" y="8" width="3" height="2" fill="var(--sky)"/><rect x="46" y="8" width="3" height="2" fill="var(--sky)"/><text x="37" y="18" font-size="6" fill="var(--sky)" font-family="monospace" font-weight="bold">CSV</text><path d="M36 22h16M36 26h12" stroke="var(--sky)" stroke-width="1.2" opacity="0.4"/></svg>',
    campaigns: '<svg width="56" height="56" viewBox="0 0 56 56" fill="none"><rect x="1" y="2" width="16" height="10" rx="2" stroke="var(--indigo)" stroke-width="2" fill="var(--indigo)" opacity="0.08"/><rect x="1" y="2" width="16" height="10" rx="2" stroke="var(--indigo)" stroke-width="2" fill="none"/><text x="3" y="9" font-size="5" fill="var(--indigo)" font-family="sans-serif">Camp.</text><path d="M17 7h3M20 7l1.5 1.5L20 10" stroke="var(--muted)" stroke-width="1.5" fill="none" stroke-linecap="round" stroke-linejoin="round"/><rect x="24" y="1" width="14" height="6" rx="1.5" stroke="var(--sky)" stroke-width="1.5" fill="none"/><text x="26" y="5.5" font-size="4.5" fill="var(--sky)" font-family="monospace">URL-A</text><rect x="24" y="9" width="14" height="6" rx="1.5" stroke="var(--sky)" stroke-width="1.5" fill="none"/><text x="26" y="13.5" font-size="4.5" fill="var(--sky)" font-family="monospace">URL-B</text><rect x="24" y="17" width="14" height="6" rx="1.5" stroke="var(--sky)" stroke-width="1.5" fill="none"/><text x="26" y="21.5" font-size="4.5" fill="var(--sky)" font-family="monospace">URL-C</text><path d="M38 4h3M41 4l1.5 1.5L41 7" stroke="var(--muted)" stroke-width="1.5" fill="none" stroke-linecap="round" stroke-linejoin="round"/><path d="M38 12h3M41 12l1.5 1.5L41 15" stroke="var(--muted)" stroke-width="1.5" fill="none" stroke-linecap="round" stroke-linejoin="round"/><path d="M38 20h3M41 20l1.5 1.5L41 23" stroke="var(--muted)" stroke-width="1.5" fill="none" stroke-linecap="round" stroke-linejoin="round"/><rect x="44" y="1" width="11" height="22" rx="2" stroke="var(--green)" stroke-width="1.5" fill="var(--green)" opacity="0.06"/><rect x="44" y="1" width="11" height="22" rx="2" stroke="var(--green)" stroke-width="1.5" fill="none"/><path d="M47 18l2-4 2 2 3-6" stroke="var(--green)" stroke-width="1.5" fill="none" stroke-linecap="round" stroke-linejoin="round"/><circle cx="47" cy="18" r="1.5" fill="var(--green)"/><circle cx="49" cy="14" r="1.5" fill="var(--green)"/><circle cx="51" cy="16" r="1.5" fill="var(--green)"/><circle cx="54" cy="10" r="1.5" fill="var(--green)"/><path d="M9 12v4M7 14l2 2 2-2" stroke="var(--muted)" stroke-width="1.5" fill="none" stroke-linecap="round" stroke-linejoin="round"/><rect x="1" y="28" width="54" height="10" rx="2" stroke="var(--green)" stroke-width="1.5" fill="none" opacity="0.3"/><text x="4" y="35" font-size="6" fill="var(--muted)" font-family="sans-serif">Analytics Overview</text><path d="M24 15v13M22 26l2 2 2-2" stroke="var(--muted)" stroke-width="1.5" fill="none" stroke-linecap="round" stroke-linejoin="round"/><path d="M38 23v5M36 26l2 2 2-2" stroke="var(--muted)" stroke-width="1.5" fill="none" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    team: '<svg width="56" height="56" viewBox="0 0 56 56" fill="none"><circle cx="12" cy="14" r="6" stroke="var(--indigo)" stroke-width="2" fill="none"/><circle cx="28" cy="14" r="6" stroke="var(--sky)" stroke-width="2" fill="none"/><circle cx="44" cy="14" r="6" stroke="var(--green)" stroke-width="2" fill="none"/><path d="M4 30c0-4 4-7 8-7s8 3 8 7M20 30c0-4 4-7 8-7s8 3 8 7M36 30c0-4 4-7 8-7s8 3 8 7" stroke="var(--muted)" stroke-width="1.5" fill="none" stroke-linecap="round"/><rect x="14" y="34" width="28" height="16" rx="3" stroke="var(--indigo)" stroke-width="2" fill="none" opacity="0.4"/><path d="M28 34v16M14 42h28" stroke="var(--indigo)" stroke-width="1.5" opacity="0.3"/></svg>',
    api: '<svg width="56" height="56" viewBox="0 0 56 56" fill="none"><rect x="1" y="4" width="16" height="11" rx="2" stroke="var(--indigo)" stroke-width="2" fill="none"/><circle cx="5" cy="8" r="1.2" fill="var(--indigo)"/><circle cx="5" cy="11" r="1.2" fill="var(--indigo)"/><path d="M8 8h7M8 11h5" stroke="var(--indigo)" stroke-width="1.2"/><text x="2" y="3" font-size="4" fill="var(--muted)" font-family="sans-serif">App</text><path d="M17 9.5h4" stroke="var(--muted)" stroke-width="1.5" stroke-linecap="round"/><path d="M21 9.5l1.5 1.5L21 12.5" stroke="var(--muted)" stroke-width="1.5" fill="none" stroke-linecap="round" stroke-linejoin="round"/><rect x="25" y="4" width="14" height="11" rx="2" stroke="var(--sky)" stroke-width="2" fill="var(--sky)" opacity="0.08"/><rect x="25" y="4" width="14" height="11" rx="2" stroke="var(--sky)" stroke-width="2" fill="none"/><text x="28" y="11" font-size="6" fill="var(--sky)" font-family="monospace" font-weight="bold">API</text><path d="M39 9.5h4" stroke="var(--muted)" stroke-width="1.5" stroke-linecap="round"/><path d="M43 9.5l1.5 1.5L43 12.5" stroke="var(--muted)" stroke-width="1.5" fill="none" stroke-linecap="round" stroke-linejoin="round"/><rect x="47" y="4" width="8" height="11" rx="2" stroke="var(--green)" stroke-width="2" fill="none"/><text x="48.5" y="10" font-size="3.5" fill="var(--green)" font-family="monospace">SHORT</text><text x="49" y="13" font-size="3.5" fill="var(--green)" font-family="monospace">URL</text><path d="M9 15v5M7 18l2 2 2-2" stroke="var(--muted)" stroke-width="1.5" fill="none" stroke-linecap="round" stroke-linejoin="round"/><path d="M32 15v5M30 18l2 2 2-2" stroke="var(--muted)" stroke-width="1.5" fill="none" stroke-linecap="round" stroke-linejoin="round"/><rect x="1" y="24" width="54" height="10" rx="2" stroke="var(--muted)" stroke-width="1" fill="none" opacity="0.2"/><text x="4" y="31" font-size="6" fill="var(--muted)" font-family="sans-serif">POST /api/v1/shorten</text></svg>',
    pricing: '<svg width="56" height="56" viewBox="0 0 56 56" fill="none"><rect x="4" y="8" width="14" height="20" rx="3" stroke="var(--muted)" stroke-width="2" fill="none"/><rect x="21" y="4" width="14" height="24" rx="3" stroke="var(--indigo)" stroke-width="2" fill="none"/><rect x="38" y="12" width="14" height="16" rx="3" stroke="var(--sky)" stroke-width="2" fill="none"/><path d="M8 16h6M25 12h6M42 20h6" stroke="var(--muted)" stroke-width="1.5" stroke-linecap="round"/><path d="M4 34h48" stroke="var(--muted)" stroke-width="1.5" stroke-linecap="round" opacity="0.3"/><path d="M14 40l4 4 8-10" stroke="var(--green)" stroke-width="2.5" fill="none" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    account: '<svg width="56" height="56" viewBox="0 0 56 56" fill="none"><circle cx="28" cy="16" r="8" stroke="var(--indigo)" stroke-width="2" fill="none"/><path d="M14 44c0-8 6-12 14-12s14 4 14 12" stroke="var(--indigo)" stroke-width="2" fill="none" stroke-linecap="round"/><rect x="6" y="6" width="44" height="44" rx="6" stroke="var(--muted)" stroke-width="1.5" fill="none" opacity="0.2"/><path d="M40 12l3 3 5-5" stroke="var(--green)" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    admin: '<svg width="56" height="56" viewBox="0 0 56 56" fill="none"><path d="M28 6L8 14v12c0 12 8 20 20 24 12-4 20-12 20-24V14L28 6z" stroke="var(--indigo)" stroke-width="2" fill="none"/><path d="M20 28l6 6 12-12" stroke="var(--green)" stroke-width="2.5" fill="none" stroke-linecap="round" stroke-linejoin="round"/><circle cx="28" cy="28" r="3" fill="var(--indigo)" opacity="0.3"/></svg>',
    scanner: '<svg width="56" height="56" viewBox="0 0 56 56" fill="none"><path d="M4 16V9a3 3 0 0 1 3-3h7" stroke="var(--indigo)" stroke-width="2.5" fill="none" stroke-linecap="round"/><path d="M42 6h7a3 3 0 0 1 3 3v7" stroke="var(--indigo)" stroke-width="2.5" fill="none" stroke-linecap="round"/><path d="M52 40v7a3 3 0 0 1-3 3h-7" stroke="var(--indigo)" stroke-width="2.5" fill="none" stroke-linecap="round"/><path d="M14 50H7a3 3 0 0 1-3-3v-7" stroke="var(--indigo)" stroke-width="2.5" fill="none" stroke-linecap="round"/><rect x="16" y="16" width="8" height="8" fill="var(--sky)" opacity="0.7"/><rect x="32" y="16" width="8" height="8" fill="var(--sky)" opacity="0.7"/><rect x="16" y="32" width="8" height="8" fill="var(--sky)" opacity="0.7"/><rect x="32" y="32" width="8" height="8" fill="var(--green)"/><path d="M4 28h48" stroke="var(--green)" stroke-width="2" stroke-dasharray="3 3" opacity="0.6"/></svg>'
  };
  var titles = { home: t("guide_home_title"), shorturls: t("guide_shorturls_title"), dashboard: t("guide_dashboard_title"), bulkqr: t("guide_bulkqr_title"), analytics: t("guide_analytics_title"), webhooks: t("guide_webhooks_title"), export: t("guide_export_title"), campaigns: t("guide_campaigns_title"), team: t("guide_team_title"), api: t("guide_api_title"), pricing: t("guide_pricing_title"), account: t("guide_account_title"), admin: t("guide_admin_title"), scanner: t("guide_scanner_title") };
  var descs = { home: t("guide_home_desc"), shorturls: t("guide_shorturls_desc"), dashboard: t("guide_dashboard_desc"), bulkqr: t("guide_bulkqr_desc"), analytics: t("guide_analytics_desc"), webhooks: t("guide_webhooks_desc"), export: t("guide_export_desc"), campaigns: t("guide_campaigns_desc"), team: t("guide_team_desc"), api: t("guide_api_desc"), pricing: t("guide_pricing_desc"), account: t("guide_account_desc"), admin: t("guide_admin_desc"), scanner: t("guide_scanner_desc") };
  var steps = {
    home: [t("guide_home_step1"), t("guide_home_step2"), t("guide_home_step3")],
    shorturls: [t("guide_shorturls_step1"), t("guide_shorturls_step2"), t("guide_shorturls_step3")],
    dashboard: [t("guide_dashboard_step1"), t("guide_dashboard_step2"), t("guide_dashboard_step3")],
    bulkqr: [t("guide_bulkqr_step1"), t("guide_bulkqr_step2"), t("guide_bulkqr_step3")],
    analytics: [t("guide_analytics_step1"), t("guide_analytics_step2"), t("guide_analytics_step3")],
    webhooks: [t("guide_webhooks_step1"), t("guide_webhooks_step2"), t("guide_webhooks_step3")],
    export: [t("guide_export_step1"), t("guide_export_step2"), t("guide_export_step3")],
    campaigns: [t("guide_campaigns_step1"), t("guide_campaigns_step2"), t("guide_campaigns_step3")],
    team: [t("guide_team_step1"), t("guide_team_step2"), t("guide_team_step3")],
    api: [t("guide_api_step1"), t("guide_api_step2"), t("guide_api_step3")],
    pricing: [t("guide_pricing_step1"), t("guide_pricing_step2"), t("guide_pricing_step3")],
    account: [t("guide_account_step1"), t("guide_account_step2"), t("guide_account_step3")],
    admin: [t("guide_admin_step1"), t("guide_admin_step2"), t("guide_admin_step3")],
    scanner: [t("guide_scanner_step1"), t("guide_scanner_step2"), t("guide_scanner_step3")]
  };
  var stepsHtml = steps[page].map(function(s, i) {
    return '<div class="guide-step"><span class="guide-step-num">' + (i + 1) + '</span><span>' + s + '</span></div>';
  }).join("");
  return '<div class="guide-card" id="guide_' + page + '">' +
    '<div class="guide-illustration">' + (svgs[page] || svgs.home) + '</div>' +
    '<div class="guide-content">' +
      '<div class="guide-header">' +
        '<div><h3 class="guide-title">' + (titles[page] || "") + '</h3><p class="guide-desc">' + (descs[page] || "") + '</p></div>' +
        '<div style="display:flex;align-items:center;gap:4px;">' +
        '<button class="guide-toggle" onclick="toggleGuide(&#39;' + page + '&#39;)">' + t("guide_show_steps") + ' <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 9l6 6 6-6"/></svg></button>' +
        '<button class="guide-close" onclick="closeGuide(&#39;' + page + '&#39;)" title="' + t("guide_close") + '">&times;</button>' +
        '</div>' +
      '</div>' +
      '<div class="guide-steps">' + stepsHtml + '</div>' +
    '</div>' +
  '</div>';
}

function closeGuide(page){
  var el = document.getElementById("guide_" + page);
  if (el) el.style.display = "none";
  try { localStorage.setItem("shurl_guide_" + page, "closed"); } catch(e) {}
}
function toggleGuide(page){
  var el = document.getElementById("guide_" + page);
  if (el) el.classList.toggle("expanded");
}

// Mỗi lần gọi /api/notifications tốn 1 thao tác KV list + các lượt đọc (gói Free KV chỉ có 1.000 list/ngày),
// nên chỉ tải lại nếu đã quá 5 phút; giữa hai lần chỉ vẽ lại huy hiệu từ dữ liệu đã có. force=true khi cần dữ liệu mới.
var NOTIF_REFRESH_MS = 300000;
var userNotifAt = 0, adminNotifAt = 0;
function paintUserBadge() {
  var count = state.userUnread || 0;
  var badge = document.getElementById("userBellCount");
  if (!badge) return;
  if (count > 0) {
    badge.style.display = "flex";
    badge.textContent = count > 99 ? "99+" : String(count);
  } else {
    badge.style.display = "none";
  }
}
function fetchUserNotifications(force) {
  if (!state.user) return Promise.resolve();
  if (!force && state.userNotifs && Date.now() - userNotifAt < NOTIF_REFRESH_MS) { paintUserBadge(); return Promise.resolve(); }
  userNotifAt = Date.now();
  return api("/api/notifications", "GET").then(function(data) {
    state.userUnread = data.unreadCount || 0;
    state.userNotifs = data.notifications || [];
    paintUserBadge();
  }).catch(function() {});
}

var _userNotifPanelClickHandler = null;
function closeUserNotifPanel() {
  var p = document.getElementById("userNotifPanel");
  if (p) p.remove();
  if (_userNotifPanelClickHandler) {
    document.removeEventListener("click", _userNotifPanelClickHandler);
    _userNotifPanelClickHandler = null;
  }
}
function toggleUserNotifications() {
  var existing = document.getElementById("userNotifPanel");
  if (existing) { closeUserNotifPanel(); return; }
  // Show optimistically with cached data, then refresh once fresh data arrives
  fetchUserNotifications(true).then(function() {
    if (document.getElementById("userNotifPanel")) { closeUserNotifPanel(); toggleUserNotifications(); }
  });
  var notifs = state.userNotifs || [];
  var panel = document.createElement("div");
  panel.id = "userNotifPanel";
  panel.style.cssText = "position:fixed;top:60px;right:16px;width:360px;max-height:480px;overflow-y:auto;background:var(--card);border:1px solid var(--border);border-radius:12px;padding:0;box-shadow:0 8px 32px rgba(0,0,0,0.2);z-index:10000;";
  var typeIcons = { info: li("info", 16), warning: li("alert", 16), success: li("check", 16), danger: li("x", 16) };
  var typeColors = { info: "#3b82f6", warning: "#f59e0b", success: "#22c55e", danger: "#ef4444" };
  var html = "<div style='font-weight:700;font-size:14px;padding:12px 14px;border-bottom:1px solid var(--border);display:flex;align-items:center;justify-content:space-between;position:sticky;top:0;background:var(--card);border-radius:12px 12px 0 0;z-index:1;'>" +
    "<span>" + li("bell", 16) + " " + t("notif_title") + "</span>" +
    "<div style='display:flex;align-items:center;gap:8px;'>" +
    "<button id='markAllReadBtn' style='background:none;border:none;color:var(--indigo);font-size:11px;cursor:pointer;padding:2px 8px;border-radius:6px;'>" + t("notif_mark_all_read") + "</button>" +
    "<button id='closeNotifPanelBtn' style='background:none;border:none;color:var(--muted);font-size:20px;cursor:pointer;padding:0 4px;line-height:1;'>&times;</button>" +
    "</div></div>";
  if (notifs.length === 0) {
    html += "<div style='padding:24px 16px;text-align:center;color:var(--muted);font-size:13px;'>" + t("notif_empty") + "</div>";
  } else {
    for (var i = 0; i < notifs.length; i++) {
      var n = notifs[i];
      var icon = typeIcons[n.type] || li("info", 16);
      var color = typeColors[n.type] || "#3b82f6";
      var bg = n.read ? "transparent" : "rgba(99,102,241,0.06)";
      var opa = n.read ? "opacity:0.55;" : "";
      var timeStr = "";
      try { timeStr = new Date(n.createdAt).toLocaleString("vi-VN", {day:"2-digit",month:"2-digit",hour:"2-digit",minute:"2-digit"}); } catch(e){}
      html += "<div class='user-notif-item' data-id='" + n.id + "' data-idx='" + i + "' style='padding:12px 14px;cursor:pointer;background:" + bg + ";border-bottom:1px solid var(--border);" + opa + "transition:background 0.15s;'>";
      html += "<div style='display:flex;align-items:start;gap:10px;'>";
      html += "<span style='flex-shrink:0;width:28px;height:28px;border-radius:50%;background:" + color + "20;color:" + color + ";display:flex;align-items:center;justify-content:center;'>" + icon + "</span>";
      html += "<div style='flex:1;min-width:0;'>";
      html += "<div style='font-weight:600;font-size:13px;color:var(--text);'>" + esc(n.title) + "</div>";
      html += "<div style='font-size:12px;color:var(--muted);margin-top:3px;word-break:break-word;line-height:1.4;'>" + esc(n.message) + "</div>";
      html += "<div style='font-size:10px;color:var(--muted2);margin-top:5px;display:flex;align-items:center;gap:6px;'>";
      if (n.from) html += "<span>" + t("notif_from") + " <b>" + esc(n.from) + "</b></span>";
      if (timeStr) html += "<span>• " + timeStr + "</span>";
      if (!n.read) html += "<span style='background:var(--indigo);color:#fff;font-size:9px;padding:1px 6px;border-radius:8px;font-weight:600;'>" + t("notif_new") + "</span>";
      html += "</div>";
      html += "</div></div></div>";
    }
  }
  panel.innerHTML = html;
  document.body.appendChild(panel);
  // Close button
  var closeBtn = document.getElementById("closeNotifPanelBtn");
  if (closeBtn) closeBtn.onclick = function(e) { e.stopPropagation(); closeUserNotifPanel(); };
  // Click outside to close
  _userNotifPanelClickHandler = function(e) {
    if (!panel.contains(e.target) && e.target.id !== "userBell") {
      closeUserNotifPanel();
    }
  };
  setTimeout(function() {
    document.addEventListener("click", _userNotifPanelClickHandler);
  }, 0);
  var markAllBtn = document.getElementById("markAllReadBtn");
  if (markAllBtn) markAllBtn.onclick = function(e) {
    e.stopPropagation();
    var unreadNotifs = notifs.filter(function(n) { return !n.read; });
    if (unreadNotifs.length === 0) return;
    Promise.all(unreadNotifs.map(function(n) {
      return api("/api/notifications/" + encodeURIComponent(n.id), "POST").catch(function() {});
    })).then(function() {
      notifs.forEach(function(n) { n.read = true; });
      var bellBadge = document.getElementById("userBellCount");
      if (bellBadge) bellBadge.style.display = "none";
      panel.querySelectorAll(".user-notif-item").forEach(function(item) {
        item.style.opacity = "0.55";
        var badge = item.querySelector("[style*='Mới']");
        if (badge) badge.remove();
      });
      markAllBtn.textContent = t("notif_marked_all");
      setTimeout(function() { markAllBtn.textContent = t("notif_mark_all_read"); }, 2000);
      // Delay fetch to allow KV writes to propagate
      setTimeout(function() { fetchUserNotifications(true); }, 3000);
    });
  };
  // Click on notification item — show detail modal + mark as read
  var items = panel.querySelectorAll(".user-notif-item");
  items.forEach(function(item) {
    item.onclick = function(e) {
      e.stopPropagation();
      var notifId = this.getAttribute("data-id");
      var idx = parseInt(this.getAttribute("data-idx"));
      var notif = notifs[idx];
      // Mark as read (fire-and-forget, không block UI)
      if (notif && !notif.read) {
        api("/api/notifications/" + encodeURIComponent(notifId), "POST").then(function() {
          // Delay fetch to allow KV write to propagate
          setTimeout(function() { fetchUserNotifications(true); }, 3000);
        }).catch(function() {});
        notif.read = true;
        this.style.opacity = "0.55";
        var badge = this.querySelector("[style*='Mới']");
        if (badge) badge.remove();
        var bellBadge = document.getElementById("userBellCount");
        if (bellBadge) {
          var currentCount = parseInt(bellBadge.textContent) || 0;
          currentCount = Math.max(0, currentCount - 1);
          if (currentCount > 0) {
            bellBadge.textContent = currentCount > 99 ? "99+" : String(currentCount);
          } else {
            bellBadge.style.display = "none";
          }
        }
      }
      // Show detail modal — close the list panel first so it doesn't stay floating behind it
      closeUserNotifPanel();
      if (notif) showNotifDetailModal(notif);
    };
  });
}
function showNotifDetailModal(notif) {
  var existing = document.getElementById("notifDetailModal");
  if (existing) existing.remove();
  var typeIcons = { info: li("info", 24), warning: li("alert", 24), success: li("check", 24), danger: li("x", 24) };
  var typeColors = { info: "#3b82f6", warning: "#f59e0b", success: "#22c55e", danger: "#ef4444" };
  var icon = typeIcons[notif.type] || li("info", 24);
  var color = typeColors[notif.type] || "#3b82f6";
  var timeStr = "";
  try { timeStr = new Date(notif.createdAt).toLocaleString("vi-VN"); } catch(e){}
  var modal = document.createElement("div");
  modal.id = "notifDetailModal";
  modal.style.cssText = "position:fixed;inset:0;background:rgba(0,0,0,0.5);display:flex;align-items:center;justify-content:center;z-index:10001;";
  var card = document.createElement("div");
  card.style.cssText = "background:var(--card);border:1px solid var(--border);border-radius:16px;padding:24px;max-width:440px;width:90%;max-height:80vh;overflow-y:auto;box-shadow:0 20px 60px rgba(0,0,0,0.3);";
  card.innerHTML =
    "<div style='display:flex;align-items:center;gap:12px;margin-bottom:16px;'>" +
    "<span style='flex-shrink:0;width:40px;height:40px;border-radius:50%;background:" + color + "20;color:" + color + ";display:flex;align-items:center;justify-content:center;'>" + icon + "</span>" +
    "<div style='flex:1;'><h3 style='margin:0;font-size:16px;font-weight:700;color:var(--text);'>" + esc(notif.title) + "</h3>" +
    "<div style='font-size:11px;color:var(--muted2);margin-top:2px;'>" + (notif.from ? "Từ: " + esc(notif.from) + " • " : "") + timeStr + "</div></div>" +
    "<button id='closeNotifModalBtn' style='background:none;border:none;color:var(--muted);font-size:22px;cursor:pointer;padding:0;flex-shrink:0;'>&times;</button>" +
    "</div>" +
    "<div style='font-size:14px;color:var(--text);line-height:1.6;white-space:pre-wrap;word-break:break-word;'>" + esc(notif.message) + "</div>" +
    "<div style='margin-top:20px;display:flex;justify-content:flex-end;'>" +
    "<button id='okNotifModalBtn' class='btn btn-primary btn-sm' style='padding:8px 20px;'>Đã hiểu</button>" +
    "</div>";
  modal.appendChild(card);
  document.body.appendChild(modal);
  // Close handlers
  document.getElementById("closeNotifModalBtn").onclick = function() { modal.remove(); };
  document.getElementById("okNotifModalBtn").onclick = function() { modal.remove(); };
  modal.onclick = function(e) { if (e.target === modal) modal.remove(); };
}

function renderSidebars(){
  renderSidebarLeft();
  renderSidebarRight();
}

function renderSidebarLeft(){
  var el = document.getElementById("sidebarLeft");
  if (!el) return;
  if (!state.user){
    el.innerHTML =
      '<div class="upsell-card" style="background:linear-gradient(135deg,rgba(99,102,241,0.12),rgba(124,58,237,0.12));">' +
      '<h3>' + t("sidebar_guest_title") + '</h3>' +
      '<p>' + t("sidebar_guest_desc") + '</p>' +
      '<div class="feat"><span class="star">⭐</span> ' + t("sidebar_guest_feat1") + '</div>' +
      '<div class="feat"><span class="star">⭐</span> ' + t("sidebar_register_feat1") + '</div>' +
      '<div class="feat"><span class="star">⭐</span> ' + t("sidebar_register_feat3") + '</div>' +
      '<a class="btn" href="#/register">' + t("register_free") + '</a>' +
      '</div>';
    return;
  }
  var role = state.user.role;
  if (role === "free"){
    el.innerHTML =
      '<div class="upsell-card"><h3>' + t("sidebar_pro_title") + '</h3><p>' + t("sidebar_pro_desc") + '</p>' +
      '<div class="feat"><span class="star">⭐</span> ' + t("pricing_f_10links") + '</div>' +
      '<div class="feat"><span class="star">⭐</span> ' + t("custom_alias") + '</div>' +
      '<div class="feat"><span class="star">⭐</span> ' + t("pricing_f_manage") + '</div>' +
      '<div class="feat"><span class="star">⭐</span> ' + t("pricing_f_clickstats") + '</div>' +
      '<a class="btn" href="#/pricing">' + t("sidebar_upgrade_now") + '</a></div>';
    return;
  }
  el.innerHTML =
    '<div class="upsell-card"><h3>SHURL</h3><p>' + t("pricing_footer") + '</p>' +
    '<div class="feat"><span class="star">⭐</span> ' + t("plan_super_f1") + '</div>' +
    '<div class="feat"><span class="star">⭐</span> ' + t("plan_super_f7") + '</div>' +
    '<div class="feat"><span class="star">⭐</span> API 10.000 ' + t("pricing_req_month") + '</div>' +
    '</div>';
}

function renderSidebarRight(){
  var el = document.getElementById("sidebarRight");
  if (!el) return;
  // a) Guest: card mời đăng ký + QR promo card
  if (!state.user){
    el.innerHTML =
      '<div class="upsell-card">' +
      '<h3>' + t("sidebar_register_title") + '</h3>' +
      '<p>' + t("sidebar_register_desc") + '</p>' +
      '<div class="feat"><span class="star">⭐</span> ' + t("sidebar_register_feat1") + '</div>' +
      '<div class="feat"><span class="star">⭐</span> ' + t("sidebar_register_feat2") + '</div>' +
      '<div class="feat"><span class="star">⭐</span> ' + t("sidebar_register_feat3") + '</div>' +
      '<div class="feat"><span class="star">⭐</span> ' + t("sidebar_register_feat4") + '</div>' +
      '<a class="btn" href="#/pricing">' + t("sidebar_register_btn") + '</a>' +
      '</div>' +
      // ===== QR PROMO CARD (bên phải, dưới card đăng ký) =====
      '<div class="upsell-card" style="margin-top:12px;background:linear-gradient(135deg,rgba(16,185,129,0.12),rgba(52,211,153,0.12));border:1px solid rgba(16,185,129,0.3);">' +
      '<h3>' + t("qr_guest_title") + '</h3>' +
      '<p>' + t("qr_guest_desc") + '</p>' +
      '<div class="feat"><span class="star">⭐</span> ' + t("qr_dyn_teaser_title") + ': ' + t("qr_dyn_teaser_feat1") + '</div>' +
      '<div class="feat"><span class="star">⭐</span> ' + t("qr_dyn_teaser_feat2") + '</div>' +
      '<button class="btn btn-primary" style="width:100%;justify-content:center;background:linear-gradient(135deg,#10b981,#059669);" onclick="navRegister()">' + t("qr_guest_btn") + '</button>' +
      '</div>';
    return;
  }

  var role = state.user.role;
  if (role === "free"){
    el.innerHTML =
      '<div class="upsell-card"><h3>' + t("sidebar_pro_title") + '</h3><p>' + t("sidebar_pro_desc") + '</p>' +
      '<div class="feat"><span class="star">⭐</span> ' + t("pixel_tracking") + ' (FB/GA/TikTok)</div>' +
      '<div class="feat"><span class="star">⭐</span> ' + t("ab_testing") + '</div>' +
      '<div class="feat"><span class="star">⭐</span> ' + t("deep_link") + ' iOS/Android</div>' +
      '<div class="feat"><span class="star">⭐</span> ' + t("password_protect") + '</div>' +
      '<div class="feat"><span class="star">⭐</span> ' + t("bulk_title") + ' 300 ' + t("pricing_per_batch") + '</div>' +
      '<div class="feat"><span class="star">⭐</span> API 5.000 ' + t("pricing_req_month") + '</div>' +
      '<a class="btn" href="#/pricing">' + t("sidebar_upgrade_now") + '</a></div>' +
      '<div class="upsell-card" style="margin-top:12px;"><h3>' + t("sidebar_super_title") + '</h3><p>' + t("sidebar_super_desc") + '</p>' +
      '<div class="feat"><span class="star">⭐</span> ' + t("plan_super_f1") + '</div>' +
      '<div class="feat"><span class="star">⭐</span> ' + t("pixel_tracking") + ' — ' + t("plan_super_f8") + '</div>' +
      '<div class="feat"><span class="star">⭐</span> ' + t("ab_testing") + ' — ' + t("plan_super_f9") + '</div>' +
      '<div class="feat"><span class="star">⭐</span> ' + t("deep_link") + ' — ' + t("plan_super_f10") + '</div>' +
      '<div class="feat"><span class="star">⭐</span> ' + t("password_protect") + ' — ' + t("plan_super_f11") + '</div>' +
      '<div class="feat"><span class="star">⭐</span> ' + t("plan_super_f7") + '</div>' +
      '<a class="btn" href="#/pricing">' + t("sidebar_view_super") + '</a></div>';
    return;
  }
  if (role === "pro"){
    el.innerHTML =
      '<div class="upsell-card"><h3>' + t("sidebar_super_title") + '</h3><p>' + t("sidebar_pro_current") + '</p>' +
      '<div class="feat"><span class="star">⭐</span> ' + t("plan_ps_f1") + '</div>' +
      '<div class="feat"><span class="star">⭐</span> ' + t("bulk_title") + ' — ' + t("plan_ps_f2") + '</div>' +
      '<div class="feat"><span class="star">⭐</span> ' + t("analytics_title") + ' ' + t("plan_super_f4") + '</div>' +
      '<div class="feat"><span class="star">⭐</span> ' + t("plan_super_f5") + '</div>' +
      '<div class="feat"><span class="star">⭐</span> API — ' + t("plan_ps_f5") + '</div>' +
      '<div class="feat"><span class="star">⭐</span> ' + t("plan_super_f7") + '</div>' +
      '<div class="feat"><span class="star">⭐</span> ' + t("pixel_tracking") + ' — ' + t("plan_super_f8") + '</div>' +
      '<div class="feat"><span class="star">⭐</span> ' + t("ab_testing") + ' — ' + t("plan_ps_f8") + '</div>' +
      '<div class="feat"><span class="star">⭐</span> ' + t("password_protect") + ' — ' + t("plan_super_f11") + '</div>' +
      '<a class="btn" href="#/pricing">' + t("sidebar_view_super") + '</a></div>';
    return;
  }

}

var state = { user: null, limits: null, links: [] };
var refreshLinkList = null;
var promoSettings = null;

function esc(s){
  if (s === undefined || s === null) return "";
  return String(s).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#39;");
}
function fmtDate(iso){
  if (!iso) return "—";
  try { var d = new Date(iso); return d.toLocaleDateString("vi-VN") + " " + d.toLocaleTimeString("vi-VN",{hour:"2-digit",minute:"2-digit"}); } catch(e){ return iso; }
}
function fmtNum(n){ n = n || 0; return n.toLocaleString("vi-VN"); }
function isLinkExpired(l){ return !!(l.expiryDate && new Date(l.expiryDate) < new Date()); }
function isProOrAbove(user){
  return user && (user.role === "pro" || user.role === "super" || user.role === "admin");
}
function lockedFeatureCard(titleHtml){
  var cta = state.user
    ? '<a class="btn btn-primary btn-sm" href="#/pricing">' + t("upgrade_banner_btn") + '</a>'
    : '<button class="btn btn-primary btn-sm" onclick="navRegister()">' + t("home_promo_btn1") + '</button>' +
      '<button class="btn btn-ghost btn-sm" style="margin-left:8px;" onclick="navLogin()">' + t("home_promo_btn2") + '</button>';
  return '<div class="card">' + titleHtml +
    '<p class="hint">' + li('lock_icon', 12) + ' ' + t("feature_requires_account") + '</p>' +
    '<div style="margin-top:12px;">' + cta + '</div>' +
    '</div>';
}
function roleLabel(r){
  return t("role_" + r) || r;
}

function api(path, method, body){
  var opts = { method: method || "GET", credentials: "same-origin", headers: {} };
  if (body !== undefined) { opts.headers["Content-Type"] = "application/json"; opts.body = JSON.stringify(body); }
  return fetch(path, opts).then(function(res){
    return res.json().catch(function(){ return {}; }).then(function(data){
      if (!res.ok) {
        var e = new Error((data && data.error) || "Đã có lỗi xảy ra");
        if (data && data.code) e.code = data.code;
        if (data && data.upgradeUrl) e.upgradeUrl = data.upgradeUrl;
        throw e;
      }
      return data;
    });
  });
}

function navigate(route){ location.hash = "#/" + route; }
function getRoute(){ var r = location.hash.replace(/^#\\/?/, ""); return r || "home"; }

// ---------- PRICING (SPA tab) ----------
async function renderPricing(app){
  var plans = [
    { name: "Free", price: "$0", unit: t("pricing_per_month"), desc: t("pricing_free_desc"), popular: false, btn: t("register_free"), btnClass: "btn-ghost", tier: "free",
      features: [
        { t: t("pricing_f_10links"), y: true }, { t: t("custom_alias"), y: true }, { t: t("pricing_f_manage"), y: true },
        { t: t("pricing_f_clickstats"), y: true }, { t: "Tiện ích trình duyệt (rút gọn nhanh)", y: true },
        { t: t("pixel_tracking"), y: false }, { t: t("ab_testing"), y: false }, { t: "Link-in-bio", y: false },
        { t: t("deep_link"), y: false }, { t: t("password_protect"), y: false }, { t: "API", y: false }
      ]},
    { name: "Plus", price: "$2.49", unit: t("pricing_per_week"), desc: t("pricing_plus_desc"), popular: false, btn: t("pricing_plus_btn"), btnClass: "btn-primary", tier: "plus",
      features: [
        { t: t("pricing_plus_f1"), y: true }, { t: t("pricing_plus_f2"), y: true },
        { t: t("custom_alias"), y: true }, { t: t("pricing_f_manage"), y: true }, { t: t("pricing_f_clickstats"), y: true },
        { t: t("campaign_history"), y: true }, { t: t("pricing_f_qrdyn_plus"), y: true }, { t: "Tiện ích trình duyệt (rút gọn nhanh)", y: true },
        { t: "Link-in-bio (1 trang)", y: true },
        { t: t("pixel_tracking"), y: false }, { t: t("ab_testing"), y: false }, { t: t("deep_link"), y: false },
        { t: t("password_protect"), y: false }, { t: t("webhooks"), y: false }, { t: t("data_export"), y: false }, { t: t("team_management"), y: false }, { t: "API", y: false }
      ]},
    { name: "Pro", price: "$8", unit: t("pricing_per_month"), desc: t("account_pro_desc"), popular: true, btn: t("upgrade_pro"), btnClass: "btn-primary", tier: "pro",
      features: [
        { t: t("plan_pro_f1"), y: true }, { t: t("bulk_title") + " (300/" + t("pricing_per_batch") + ")", y: true }, { t: t("custom_alias") + " " + t("plan_unlimited"), y: true },
        { t: t("pricing_advanced_mgmt"), y: true }, { t: t("analytics_title") + " " + t("plan_pro_f4") + " + Real-time", y: true }, { t: t("plan_pro_f5"), y: true }, { t: t("pricing_f_qrdyn_pro"), y: true },
        { t: "Tiện ích trình duyệt (rút gọn nhanh)", y: true }, { t: "Link-in-bio (3 trang)", y: true },
        { t: t("pixel_tracking") + " — 1/" + t("pricing_per_link") + ", 50 " + t("pricing_links"), y: true }, { t: t("ab_testing") + " — 2 URL, 20 " + t("pricing_links"), y: true }, { t: t("deep_link") + " iOS/Android", y: true },
        { t: t("password_protect"), y: true }, { t: t("webhooks"), y: true }, { t: t("data_export"), y: true }, { t: t("campaign_history"), y: true }, { t: "API 5.000 " + t("pricing_req_month"), y: true }, { t: t("export"), y: true }
      ]},
    { name: "Super", price: "$20", unit: t("pricing_per_month"), desc: t("account_super_desc"), popular: false, btn: t("upgrade_super"), btnClass: "btn-primary", tier: "super",
      features: [
        { t: t("plan_super_f1"), y: true }, { t: t("bulk_title") + " (600/" + t("pricing_per_batch") + ")", y: true }, { t: t("plan_super_f3"), y: true },
        { t: t("analytics_title") + " " + t("plan_super_f4") + " + Real-time", y: true }, { t: t("plan_super_f5"), y: true }, { t: t("pricing_f_qrdyn_super"), y: true }, { t: t("pixel_tracking") + " — 2/" + t("pricing_per_link") + ", " + t("plan_unlimited"), y: true },
        { t: "Tiện ích trình duyệt (rút gọn nhanh)", y: true }, { t: "Link-in-bio (10 trang)", y: true },
        { t: t("ab_testing") + " — 3 URL, % " + t("pricing_custom") + ", ∞", y: true }, { t: t("deep_link") + " + " + t("plan_super_f10"), y: true }, { t: t("password_protect") + " + " + t("plan_super_f11"), y: true },
        { t: t("webhooks"), y: true }, { t: t("data_export"), y: true }, { t: t("campaign_history"), y: true }, { t: t("team_management"), y: true }, { t: "API 10.000 " + t("pricing_req_month"), y: true }, { t: "Custom domain", y: true }, { t: t("plan_priority_support"), y: true }
      ]}
  ];

var html = guideCard("pricing") + '<style>' +
  '.pricing-hero{position:relative;overflow:hidden;}' +
  '@keyframes cloudDrift{0%{left:-120px;}100%{left:calc(100% + 120px);}}' +
  '@keyframes cloudFloat{0%,100%{transform:translateY(0);}50%{transform:translateY(-6px);}}' +
  '@keyframes planeFly{0%{left:calc(100% + 150px);opacity:0.8;}100%{left:-150px;opacity:0.9;}}' +
  '@keyframes flamePulse{0%,100%{transform:scaleX(1);opacity:0.9;}50%{transform:scaleX(1.4);opacity:1;}}' +
  '.pricing-hero .cloud{position:absolute;opacity:0.18;pointer-events:none;z-index:0;}' +
  '.pricing-hero .cloud-1{top:5%;width:70px;animation:cloudDrift 6.1s linear infinite,cloudFloat 7s ease-in-out infinite;}' +
  '.pricing-hero .cloud-2{top:38%;width:85px;animation:cloudDrift 9s linear infinite,cloudFloat 8s ease-in-out infinite;animation-delay:-0.3s,-2s;}' +
  '.pricing-hero .cloud-3{top:72%;width:60px;animation:cloudDrift 10s linear infinite,cloudFloat 6.5s ease-in-out infinite;animation-delay:-0.6s,-1s;}' +
  '.pricing-hero .cloud-4{top:18%;width:90px;animation:cloudDrift 13s linear infinite,cloudFloat 9s ease-in-out infinite;animation-delay:-0.9s,-3s;}' +
  '.pricing-hero .plane{position:absolute;top:72%;width:60px;pointer-events:none;animation:planeFly 160s linear infinite;}' +
  '.pricing-hero .jet-flame{transform-origin:right center;animation:flamePulse 0.01s ease-in-out infinite;}' +
  '</style>' +
  '<div class="card pricing-hero">' +
    '<div style="text-align:center;margin-bottom:24px;position:relative;z-index:1;">' +
      '<svg class="cloud cloud-1" viewBox="0 0 120 80"><path d="M30,60 Q15,60 15,45 Q15,30 30,30 Q35,15 55,15 Q75,15 80,35 Q100,35 100,50 Q100,60 85,60 Z" fill="#3b82f6"></path></svg>' +
      '<svg class="cloud cloud-2" viewBox="0 0 120 80"><path d="M30,60 Q15,60 15,45 Q15,30 30,30 Q35,15 55,15 Q75,15 80,35 Q100,35 100,50 Q100,60 85,60 Z" fill="#3b82f6"></path></svg>' +
      '<svg class="cloud cloud-3" viewBox="0 0 120 80"><path d="M30,60 Q15,60 15,45 Q15,30 30,30 Q35,15 55,15 Q75,15 80,35 Q100,35 100,50 Q100,60 85,60 Z" fill="#3b82f6"></path></svg>' +
      '<svg class="cloud cloud-4" viewBox="0 0 120 80"><path d="M30,60 Q15,60 15,45 Q15,30 30,30 Q35,15 55,15 Q75,15 80,35 Q100,35 100,50 Q100,60 85,60 Z" fill="#3b82f6"></path></svg>' +
      '<svg class="plane" viewBox="0 0 140 70" style="overflow:visible;transform:scaleX(-1);">' +
        '<g class="jet-flame">' +
          '<polygon points="15,32 0,25 -5,35 0,45 15,38" fill="#efead5ff"/>' +
          '<polygon points="10,33 3,30 0,35 3,40 10,37" fill="#f7cacaff"/>' +
        '</g>' +
        '<polygon points="35,28 20,12 30,12 42,28" fill="#2563eb"/>' +
        '<polygon points="35,42 20,58 30,58 42,42" fill="#1d4ed8"/>' +
        '<polygon points="50,35 25,65 35,68 85,42" fill="#3b82f6"/>' +
        '<polygon points="50,35 25,5 35,2 85,28" fill="#2563eb"/>' +
        '<path d="M35,35 L55,22 L115,30 L135,35 L115,40 L55,48 Z" fill="#3b82f6"/>' +
        '<path d="M80,32 Q90,30 102,33 Q90,36 80,32 Z" fill="#fbbf24" opacity="0.9"/>' +
        '<path d="M115,30 L135,35 L115,40 Z" fill="#1e40af"/>' +
      '</svg>' +
      '<h1 style="font-size:32px;margin-bottom:8px;background:linear-gradient(135deg,#818cf8,#c084fc);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;color:transparent;">' + t("pricing_hero_title") + '</h1>' +
      '<p class="sub">' + t("pricing_hero_desc") + '</p>' +
    '</div>' +
  '</div>';
  // Lấy promo settings
  var promoData = null;
  try {
    var promoResp = await fetch("/api/admin/promo-settings");
    if (promoResp.ok) promoData = await promoResp.json();
  } catch(e) {}
  var promo = (promoData && promoData.settings) || { tiers: {} };
  promoSettings = promo;
  var now = new Date();

  function getPromoForTier(tier){
    var tp = promo.tiers[tier];
    if (!tp || !tp.active) return null;
    if (tp.startDate && new Date(tp.startDate) > now) return null;
    if (tp.endDate && new Date(tp.endDate) < now) return null;
    if (!tp.discountPercent || tp.discountPercent <= 0) return null;
    return tp;
  }

  html += '<div class="pricing-grid" style="margin-bottom:24px;">';
  for (var i = 0; i < plans.length; i++){
    var p = plans[i];
    var popularStyle = p.popular ? 'border:2px solid #818cf8;transform:scale(1.02);box-shadow:0 0 40px rgba(99,102,241,0.15);' : '';
    var tp = getPromoForTier(p.tier);
    var hasPromo = tp !== null;
    var basePrice = parseFloat(p.price.replace(/[^0-9.]/g, ""));
    var newPrice = hasPromo ? (basePrice * (100 - tp.discountPercent) / 100).toFixed(2) : null;

    html += '<div class="card" style="' + popularStyle + 'position:relative;padding:24px 20px;overflow:visible;">';
    if (p.popular) html += '<div style="position:absolute;top:-12px;left:50%;transform:translateX(-50%);background:#818cf8;color:#fff;font-size:12px;font-weight:700;padding:4px 16px;border-radius:20px;white-space:nowrap;z-index:10;">' + t("pricing_popular") + '</div>';

if (hasPromo){
  html += '<div style="position:absolute;top:0;right:0;width:70px;height:70px;overflow:hidden;z-index:5;">' +
    '<div style="position:absolute;top:10px;right:-22px;width:90px;height:22px;background:#C82323;display:flex;align-items:center;justify-content:center;transform:rotate(45deg);box-shadow:0 1px 3px rgba(0,0,0,0.3);">' +
      '<div style="position:absolute;inset:2px;border:1px dashed rgba(255,255,255,0.7);pointer-events:none;"></div>' +
      '<span style="color:#fbbf24;font-weight:800;font-size:11px;letter-spacing:0.5px;text-shadow:0 1px 2px rgba(0,0,0,0.3);">-' + tp.discountPercent + '%</span>' +
    '</div>' +
  '</div>';
}

    html += '<div style="font-size:18px;font-weight:700;margin-bottom:4px;">' + p.name + '</div>';
    if (hasPromo){
      html += '<div style="margin:8px 0 4px;">' +
        '<span style="font-size:18px;color:var(--muted2);text-decoration:line-through;">$' + basePrice.toFixed(2) + '</span> ' +
        '<span style="font-size:32px;font-weight:800;color:#4ade80;">$' + newPrice + '</span>' +
        '<small style="font-size:13px;font-weight:400;color:var(--muted);">' + p.unit + '</small></div>';
    } else {
      html += '<div style="font-size:32px;font-weight:800;margin:8px 0 4px;">' + p.price + '<small style="font-size:13px;font-weight:400;color:var(--muted);">' + p.unit + '</small></div>';
    }
    if (basePrice > 0){
      var vndForCard = Math.round((hasPromo ? parseFloat(newPrice) : basePrice) * VN_EXCHANGE_RATE);
      html += '<div style="font-size:13px;color:var(--muted);margin-top:-2px;margin-bottom:8px;">~' + vndForCard.toLocaleString("vi-VN") + ' VNĐ</div>';
    }
    html += '<div style="font-size:12px;color:var(--muted);margin-bottom:16px;min-height:36px;">' + p.desc + '</div>';
    var btnId = "planbtn_" + p.tier;
    if (p.tier === "free"){
      html += '<a class="btn ' + p.btnClass + '" id="' + btnId + '" style="width:100%;justify-content:center;margin-bottom:16px;" href="#/register">' + p.btn + '</a>';
    } else {
      html += '<a class="btn ' + p.btnClass + '" id="' + btnId + '" data-mt="stripe" style="width:100%;justify-content:center;margin-bottom:8px;border-radius:12px;" href="#/account">' + p.btn + '</a>';
      html += '<button class="btn btn-ghost" data-mt="qr_payment" style="width:100%;justify-content:center;font-size:14px;font-weight:700;padding:14px 28px;border-radius:12px;margin-bottom:16px;" onclick="showQrModal(' + "'" + p.tier + "'" + ')">🇻🇳 ' + t("pay_vn_btn") + '</button>';
    }
    html += '<ul style="list-style:none;padding:0;margin:0;">';
    for (var j = 0; j < p.features.length; j++){
      var f = p.features[j];
      html += '<li style="font-size:13px;padding:5px 0;display:flex;align-items:start;gap:8px;"><span style="flex-shrink:0;width:18px;text-align:center;' + (f.y ? "color:#4ade80;" : "color:var(--muted2);") + '">' + (f.y ? "✓" : "✗") + '</span>' + f.t + '</li>';
    }
    html += '</ul></div>';
  }
  html += '</div>';

  // Voucher box
  html += '<div class="card" style="max-width:600px;margin:0 auto 24px;">';
  html += '<h2>' + li('ticket', 18) + ' ' + t("pricing_voucher_title") + '</h2>';
  html += '<p class="hint">' + t("account_voucher_hint") + '</p>';
  html += '<div style="display:flex;gap:10px;margin-bottom:16px;"><input type="text" id="voucherCode" placeholder="' + t("pricing_voucher_placeholder") + '" style="flex:1;padding:10px 14px;border-radius:10px;border:1px solid var(--input-border);background:var(--input-bg);color:var(--text);font-size:14px;font-family:inherit;outline:none;"><button class="btn btn-primary" style="white-space:nowrap;" onclick="redeemVoucherPage()">' + t("pricing_voucher_activate") + '</button></div>';
  html += '<div id="voucherMsg"></div>';
  html += '</div>';
  // Voucher purchase box
  html += '<div class="card" style="max-width:600px;margin:0 auto 24px;position:relative;overflow:visible;">';
  html += '<div style="position:absolute;top:0;right:0;width:70px;height:70px;overflow:hidden;z-index:5;">' +
    '<div style="position:absolute;top:10px;right:-22px;width:90px;height:22px;background:#2563eb;display:flex;align-items:center;justify-content:center;transform:rotate(45deg);box-shadow:0 1px 3px rgba(0,0,0,0.3);">' +
      '<div style="position:absolute;inset:2px;border:1px dashed rgba(255,255,255,0.7);pointer-events:none;"></div>' +
      '<span style="color:#fff;font-weight:800;font-size:11px;letter-spacing:0.5px;text-shadow:0 1px 2px rgba(0,0,0,0.3);">demo</span>' +
    '</div>' +
  '</div>';
  html += '<h2>' + li('card', 18) + ' ' + t("pricing_voucher_buy_link") + '</h2>';
  html += '<p class="hint">' + t("pricing_voucher_select_prompt") + '</p>';
  html += '<div style="margin:16px 0;">';
  html += '<label>' + t("pricing_voucher_choose_plan") + '</label>';
  html += '<select id="vBuyTier" style="margin-bottom:12px;" onchange="onTierChange()">';
  html += '<option value="plus">Plus</option>';
  html += '<option value="pro">Pro</option>';
  html += '<option value="super">Super</option>';
  html += '</select>';
  html += '<label>' + t("pricing_voucher_choose_time") + '</label>';
  html += '<select id="vBuyPeriod" onchange="updateVnPrice()"></select>';
  html += '</div>';
  html += '<div id="vnPriceDisplay" style="font-size:20px;font-weight:800;margin-bottom:16px;color:#4ade80;text-align:center;"></div>';
  html += '<button class="btn btn-primary" style="width:100%;justify-content:center;" onclick="buyVoucherPage()">' + t("pricing_voucher_pay") + '</button>';
  html += '<div id="vBuyMsg" style="margin-top:12px;"></div>';
  html += '</div>';

  // Support / payment issue contact (Đa ngôn ngữ)
  var supportEmail = "support@shurlvn.com";
  var supportSubject = encodeURIComponent(t("support_subject"));
  var supportBody = encodeURIComponent(
    t("support_body_greeting") + "\\n\\n" +
    t("support_body_issue") + " \\n\\n" +
    t("support_body_plan") + " \\n" +
    t("support_body_amount") + " \\n" +
    t("support_body_date") + " \\n" +
    t("support_body_screenshot") + "\\n\\n" +
    t("support_body_thanks") + "\\n\\n" +
    t("support_body_name") + " "
  );
  var mailtoLink = "https://mail.google.com/mail/?view=cm&fs=1&to=" + supportEmail + "&su=" + supportSubject + "&body=" + supportBody;

  html += '<div style="background:linear-gradient(135deg,rgba(99,102,241,0.08),rgba(192,132,252,0.08));border:1px solid var(--border);border-radius:16px;padding:28px;margin-bottom:24px;">';
  html += '<div style="display:flex;align-items:start;gap:16px;">';
  html += '<div style="font-size:28px;flex-shrink:0;">' + li('shield', 28) + '</div>';
  html += '<div style="flex:1;">';
  html += '<h2 style="font-size:18px;margin-bottom:8px;">' + t("support_title") + '</h2>';
  html += '<p style="font-size:14px;color:var(--muted);margin-bottom:12px;line-height:1.6;">' + t("support_desc") + '</p>';
  html += '<a href="' + mailtoLink + '" style="display:inline-flex;align-items:center;gap:8px;padding:10px 20px;border-radius:10px;background:#6366f1;color:#fff;text-decoration:none;font-size:14px;font-weight:600;">';
  html += '✉️ ' + t("support_contact_btn");
  html += '</a>';
  html += '</div></div></div>';

  // FAQ
  html += '<div class="card"><h2>' + t("pricing_faq_title") + '</h2>';
  var faqs = [
    { q: t("pricing_faq1_q"), a: t("pricing_faq1_a") },
    { q: t("pricing_faq2_q"), a: t("pricing_faq2_a") },
    { q: t("pricing_faq3_q"), a: t("pricing_faq3_a") },
    { q: t("pricing_faq4_q"), a: t("pricing_faq4_a") },
    { q: t("pricing_faq5_q"), a: t("pricing_faq5_a") }
  ];
  for (var i = 0; i < faqs.length; i++){
    html += '<div style="background:var(--stat-bg);border:1px solid var(--border);border-radius:12px;padding:20px;margin-bottom:12px;"><h3 style="font-size:16px;margin-bottom:8px;color:#818cf8;">' + faqs[i].q + '</h3><p style="font-size:14px;color:var(--muted);">' + faqs[i].a + '</p></div>';
  }
  html += '</div>';

  app.innerHTML = html;

  // Bind upgrade buttons for logged-in users
  if (state.user && state.user.role !== "guest"){
    ["plus","pro","super"].forEach(function(tier){
      var btn = document.getElementById("planbtn_" + tier);
      if (btn){
        btn.href = "javascript:void(0)";
        btn.onclick = function(){ upgradeStripe(tier); };
      }
    });
  }
   // Modal QR thanh toán (nằm trong renderPricing)
  var qrModal = document.createElement("div");
  qrModal.id = "qrModal";
  qrModal.style.cssText = "position:fixed;inset:0;background:rgba(0,0,0,0.5);display:none;align-items:center;justify-content:center;z-index:9999;";
  qrModal.innerHTML = '<div style="background:var(--bg);border:1px solid var(--border);border-radius:16px;padding:28px;max-width:400px;width:90%;"><div id="qrModalBody"></div></div>';
  document.body.appendChild(qrModal);
  qrModal.onclick = function(e){ if (e.target === qrModal) qrModal.style.display = "none"; };   
  onTierChange(); // Khởi tạo dropdown và giá VNĐ khi load trang
}

function redeemVoucherPage(){
  var code = document.getElementById("voucherCode").value.trim();
  if (!code){ document.getElementById("voucherMsg").innerHTML = '<span style="color:#f87171;">' + t("pricing_voucher_enter_code") + '</span>'; return; }
  fetch("/api/voucher/redeem", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ code: code }) })
    .then(function(r){ return r.json(); })
    .then(function(d){
      if (d.success){
        document.getElementById("voucherMsg").innerHTML = '<span style="color:#4ade80;">' + d.message + '</span>';
        setTimeout(function(){ location.reload(); }, 1500);
      } else {
        document.getElementById("voucherMsg").innerHTML = '<span style="color:#f87171;">' + (d.error || t("pricing_voucher_invalid")) + '</span>';
      }
    })
    .catch(function(){ document.getElementById("voucherMsg").innerHTML = '<span style="color:#f87171;">' + t("pricing_connection_error") + '</span>'; });
}
function buyVoucherPage(){
  var tier = document.getElementById("vBuyTier").value;
  var period = document.getElementById("vBuyPeriod").value;
  if (!tier || !period){
    document.getElementById("vBuyMsg").innerHTML = '<span style="color:#f87171;">' + t("pricing_voucher_select_alert") + '</span>';
    return;
  }
  document.getElementById("vBuyMsg").innerHTML = '<span style="color:var(--muted);">' + t("processing") + '</span>';
  fetch("/api/billing/voucher-checkout", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ tier: tier, period: period })
  }).then(function(r){ return r.json(); })
    .then(function(d){
      if (d.url){
        window.location.href = d.url;
      } else {
        document.getElementById("vBuyMsg").innerHTML = '<span style="color:#f87171;">' + (d.error || t("pricing_checkout_error")) + '</span>';
      }
    })
    .catch(function(){
      document.getElementById("vBuyMsg").innerHTML = '<span style="color:#f87171;">' + t("pricing_connection_error") + '</span>';
    });
}
var VN_EXCHANGE_RATE = 27000; // 1 USD = 27,000 VNĐ
var VN_PRICE_DATA = {
  plus: { base: 2.49, periods: { week: { mult: 1, label: t("pricing_voucher_week") } } },
  pro: { base: 8, periods: { month: { mult: 1, label: t("pricing_voucher_month") }, year: { mult: 9.6, label: t("pricing_voucher_year") } } },
  super: { base: 20, periods: { month: { mult: 1, label: t("pricing_voucher_month") }, year: { mult: 9.6, label: t("pricing_voucher_year") } } }
};

function onTierChange() {
  var tier = document.getElementById("vBuyTier").value;
  var periodSelect = document.getElementById("vBuyPeriod");
  periodSelect.innerHTML = "";
  var periods = VN_PRICE_DATA[tier].periods;
  for (var key in periods) {
    var opt = document.createElement("option");
    opt.value = key;
    opt.text = periods[key].label;
    periodSelect.appendChild(opt);
  }
  updateVnPrice();
}

// Mức giảm giá riêng cho Voucher (kích cầu mua sẵn)
var VOUCHER_DISCOUNT = {
  plus: 0,
  pro: 5,
  super: 20
};

function updateVnPrice() {
  var tier = document.getElementById("vBuyTier").value;
  var period = document.getElementById("vBuyPeriod").value;
  var data = VN_PRICE_DATA[tier];
  var usdPrice = data.base * data.periods[period].mult;
  
  // Áp dụng khuyến mãi từ admin settings
  if (promoSettings && promoSettings.tiers) {
    var tp = promoSettings.tiers[tier];
    if (tp && tp.active && tp.discountPercent > 0) {
      usdPrice = usdPrice * (100 - tp.discountPercent) / 100;
    }
  }
  
  var vndPrice = Math.round(usdPrice * VN_EXCHANGE_RATE);
  var display = document.getElementById("vnPriceDisplay");
  if (display) display.innerText = "~" + vndPrice.toLocaleString("vi-VN") + " VNĐ";
}

function showQrModal(tier) {
  var tierNames = { plus: "Plus", pro: "Pro", super: "Super" };
  var body = document.getElementById("qrModalBody");
  if (!body) return;
  
  var data = VN_PRICE_DATA[tier];
  var periods = data.periods;
  
  // Label riêng cho modal QR (không chứa %)
  var qrLabels = {
    week: t("pricing_voucher_week").replace(/\s*\(.*?\)\s*/g, ""),
    month: t("pricing_voucher_month").replace(/\s*\(.*?\)\s*/g, ""),
    year: t("pricing_voucher_year").replace(/\s*\(.*?\)\s*/g, "")
  };

  
  // Tạo HTML cho các nút chu kỳ (chỉ hiện chu kỳ hợp lệ của gói)
  var periodBtnsHtml = '<div style="display:flex;gap:8px;margin-bottom:16px;">';
  var isFirst = true;
  for (var key in periods) {
    var btnClass = isFirst ? "btn btn-primary btn-sm" : "btn btn-ghost btn-sm";
    periodBtnsHtml += '<button class="' + btnClass + ' qr-period" data-period="' + key + '" style="flex:1;">' + qrLabels[key] + '</button>';
    isFirst = false;
  }
  periodBtnsHtml += '</div>';

  body.innerHTML =
    '<h3 style="margin:0 0 8px;">' + t("vn_pay_title") + ' ' + tierNames[tier] + '</h3>' +
    '<p class="hint">' + t("vn_pay_select_period") + '</p>' +
    periodBtnsHtml +
    '<div id="qrContent" style="display:none;text-align:center;">' +
    '<div style="background:var(--card);border-radius:12px;padding:16px;margin-bottom:12px;display:flex;justify-content:center;">' +
    '<img id="qrImg" src="" style="width:100%;max-width:300px;height:auto;">' +
    '</div>' +
    '<div style="text-align:left;background:var(--input-bg);padding:12px;border-radius:8px;font-size:13px;margin-bottom:12px;">' +
    '<div><strong>' + t("vn_pay_amount") + '</strong> <span id="qrAmount">0</span>đ</div>' +
    '</div>' +
    '<div style="margin-bottom:12px;">' +
    '<label style="font-size:12px;color:var(--muted);">' + t("vn_pay_transfer_content") + '</label>' +
    '<div style="display:flex;gap:6px;margin-top:4px;">' +
    '<input type="text" id="qrOrderId" readonly style="flex:1;padding:8px;border:1px solid var(--input-border);border-radius:6px;background:var(--input-bg);color:var(--text);font-family:monospace;font-size:12px;">' +
    '<button class="btn btn-ghost btn-sm" id="btnCopyOrder">' + li("clipboard", 14) + '</button>' +
    '</div>' +
    '</div>' +
    '<div style="font-size:12px;color:var(--muted2);margin-bottom:16px;padding:8px;background:rgba(251,191,36,0.1);border-radius:8px;">' +
    t("vn_pay_security") + ' ' +
    '</div>' +
    '<button class="btn btn-primary" id="btnConfirmQr" style="width:100%;justify-content:center;">' + t("vn_pay_confirm") + '</button>' +
    '<div id="qrResult" style="margin-top:12px;"></div>' +
    '</div>';

  document.getElementById("qrModal").style.display = "flex";

  body.querySelectorAll(".qr-period").forEach(function(btn){
    btn.onclick = function(){
      body.querySelectorAll(".qr-period").forEach(function(b){ b.className = "btn btn-ghost btn-sm qr-period"; b.style.flex = "1"; });
      this.className = "btn btn-primary btn-sm qr-period";
      this.style.flex = "1";
      
      var selectedPeriod = this.getAttribute("data-period");
      var usdPrice = data.base * data.periods[selectedPeriod].mult;
      
      // Áp dụng khuyến mãi nếu có
      if (typeof promoSettings !== "undefined" && promoSettings && promoSettings.tiers) {
        var tp = promoSettings.tiers[tier];
        if (tp && tp.active && tp.discountPercent > 0) {
          usdPrice = usdPrice * (100 - tp.discountPercent) / 100;
        }
      }
      
      var vndPrice = Math.round(usdPrice * VN_EXCHANGE_RATE);
      document.getElementById("qrAmount").textContent = vndPrice.toLocaleString("vi-VN");
      
      var tierPrefix = tier === "plus" ? "PL" : tier === "pro" ? "PR" : "SU";
      var orderId = tierPrefix + "-" + Math.random().toString(36).substring(2, 8).toUpperCase();
      document.getElementById("qrOrderId").value = orderId;
      // Tạo QR VietQR — Quick Link format
      document.getElementById("qrImg").src = "https://img.vietqr.io/image/ACB-25105621-compact2.png?amount=" + vndPrice + "&addInfo=" + encodeURIComponent(orderId) + "&accountName=" + encodeURIComponent("NGUYEN DUC NHA");
      document.getElementById("qrContent").style.display = "block";

      document.getElementById("btnConfirmQr").setAttribute("data-period", selectedPeriod);
      document.getElementById("btnConfirmQr").setAttribute("data-orderid", orderId);
    };
  });

  // Tự động bấm nút đầu tiên để hiển thị giá ngay
  var firstBtn = body.querySelector(".qr-period");
  if (firstBtn) firstBtn.click();

  document.getElementById("btnCopyOrder").onclick = function(){
    var input = document.getElementById("qrOrderId");
    input.select();
    document.execCommand("copy");
    this.innerHTML = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#22c55e" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>';
    var self = this;
    setTimeout(function(){ self.innerHTML = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="8" height="4" x="8" y="2" rx="1" ry="1"/><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/></svg>'; }, 2000);
  };

  document.getElementById("btnConfirmQr").onclick = function(){
    var period = this.getAttribute("data-period") || "month";
    var tierRank = { free: 0, plus: 1, pro: 2, super: 3 };
    if (state.user && (tierRank[state.user.role] || 0) > (tierRank[tier] || 0)) {
      alert(tf("pricing_downgrade_blocked", { tier: (state.user.role || "free").toUpperCase() }));
      return;
    }
    var result = document.getElementById("qrResult");
    result.innerHTML = '<p class="hint">' + t("vn_pay_processing") + '</p>';
    var orderId = this.getAttribute("data-orderid") || ""; api("/api/billing/qr-checkout", "POST", { tier: tier, period: period, orderId: orderId }).then(function(data){
      result.innerHTML = '<div class="msg msg-ok">' + t("vn_pay_success") + '</div>';
      setTimeout(function(){ document.getElementById("qrModal").style.display = "none"; }, 3000);
    }).catch(function(err){
      result.innerHTML = '<div class="msg msg-error">' + esc(err.message) + '</div>';
    });
  };
}

function openSupportEmail(){
  var email = "support@shurlvn.com";
  var subject = (typeof t === "function" && t("support_subject")) || "SHURL — Hỗ trợ thanh toán";
  var body = ((typeof t === "function" && t("support_body_greeting")) || "Xin chào đội ngũ SHURL,") + "\\n\\n" +
    ((typeof t === "function" && t("support_body_issue")) || "Tôi gặp sự cố khi thanh toán gói:") + "\\n\\n" +
    ((typeof t === "function" && t("support_body_plan")) || "Gói đăng ký:") + " \\n" +
    ((typeof t === "function" && t("support_body_amount")) || "Số tiền:") + " \\n" +
    ((typeof t === "function" && t("support_body_date")) || "Ngày thanh toán:") + " \\n" +
    ((typeof t === "function" && t("support_body_screenshot")) || "Tôi đính kèm ảnh chụp màn hình thanh toán thành công.") + "\\n\\n" +
    ((typeof t === "function" && t("support_body_thanks")) || "Cảm ơn bạn đã hỗ trợ.") + "\\n\\n" +
    ((typeof t === "function" && t("support_body_name")) || "Tên tài khoản:") + " ";
  var link = "mailto:" + email + "?subject=" + encodeURIComponent(subject) + "&body=" + encodeURIComponent(body);
  window.location.href = link;
}

function renderLangSwitcher(){
  // Now integrated into user menu - return empty for footer
  return '';
}
function renderLangSubmenu(){
  var h = '';
  if (langSubmenuOpen){
    h += '<div class="lang-dropdown" id="langDropdown" style="position:static;box-shadow:none;border:0;padding:0 0 0 22px;margin-top:2px;">';
    for (var i = 0; i < LANGS.length; i++){
      var l = LANGS[i];
      var isActive = l === currentLang;
      h += '<div class="lang-item ' + (isActive ? "active" : "") + '" onclick="switchLang(\&#39;' + l + '\&#39;)" style="display:flex;align-items:center;gap:6px;padding:7px 12px;border-radius:8px;font-size:13px;cursor:pointer;color:var(--text);">';
      if (isActive) h += '<span style="color:var(--lang-active-color);font-weight:700;">' + li("check", 14) + '</span>';
      else h += '<span style="width:14px;display:inline-block;"></span>';
      h += LANG_LABELS[l] + '</div>';
    }
    h += '</div>';
  }
  return h;
}

function toggleLangDropdown(e){
  if (e) e.stopPropagation();
  langSubmenuOpen = !langSubmenuOpen;
  var wasMenuOpen = document.getElementById("sbUserMenu") && document.getElementById("sbUserMenu").classList.contains("show");
  renderNav();
  if (wasMenuOpen) { var m = document.getElementById("sbUserMenu"); if (m) m.classList.add("show"); }
}

function switchLang(lang){
  currentLang = lang;
  try { localStorage.setItem("shurl_lang", lang); } catch(e) {}
  langSubmenuOpen = false;
  langDropdownOpen = false;
  guestLangDropdownOpen = false;
  render();
  var m = document.getElementById("sbUserMenu");
  if (m) m.classList.remove("show");
}

var guestLangDropdownOpen = false;
function toggleGuestLangDropdown(e){
  if (e) e.stopPropagation();
  guestLangDropdownOpen = !guestLangDropdownOpen;
  renderNav();
}
function closeGuestLangDropdownHandler(e){
  if (guestLangDropdownOpen && !e.target.closest("#guestLangWrap")) {
    guestLangDropdownOpen = false;
    renderNav();
  }
}
// === MAINTENANCE STATUS (frontend) ===
state.maintenance = {};
function fetchMaintenanceStatus(){
  api("/api/maintenance-status", "GET").then(function(data){ state.maintenance = data.maintenance || {}; applyMaintenanceCSS(); }).catch(function(){ state.maintenance = {}; });
}
function applyMaintenanceCSS(){
  var m = state.maintenance || {};
  var css = "";
  if (m.stripe && m.stripe.active) css += "[data-mt=stripe]{opacity:0.5;pointer-events:none;position:relative;}";
  if (m.qr_payment && m.qr_payment.active) css += "[data-mt=qr_payment]{opacity:0.5;pointer-events:none;position:relative;}";
  if (m.voucher && m.voucher.active) css += "[data-mt=voucher]{opacity:0.5;pointer-events:none;position:relative;}";
  if (m.bulk && m.bulk.active) css += "[data-mt=bulk]{opacity:0.5;pointer-events:none;position:relative;}";
  if (m.api && m.api.active) css += "[data-mt=api]{opacity:0.5;pointer-events:none;position:relative;}";
  if (m.analytics && m.analytics.active) css += "[data-mt=analytics]{opacity:0.5;pointer-events:none;position:relative;}";
  var existing = document.getElementById("mtStyle");
  if (existing) existing.remove();
  if (css) {
    var style = document.createElement("style");
    style.id = "mtStyle";
    style.textContent = css + '[data-mt]::after{content:"Bảo trì";position:absolute;top:8px;right:8px;background:#f59e0b;color:#fff;font-size:11px;font-weight:700;padding:3px 10px;border-radius:6px;z-index:10;pointer-events:none;white-space:nowrap;}';
    document.head.appendChild(style);
  }
  // Show alert for maintained features when user tries to access
  if (m.stripe && m.stripe.active) { var sb = document.querySelectorAll("#planbtn_plus, #planbtn_pro, #planbtn_super"); sb.forEach(function(b){ b.onclick = function(){ alert(t("maintenance_feature_prefix") + (m.stripe.note ? ": " + m.stripe.note : "")); }; }); }
  if (m.qr_payment && m.qr_payment.active) { var qb = document.querySelectorAll("button[data-mt=qr_payment]"); qb.forEach(function(b){ b.onclick = function(){ alert(t("maintenance_feature_prefix") + (m.qr_payment.note ? ": " + m.qr_payment.note : "")); }; }); }
  if (m.voucher && m.voucher.active) { var vb = document.querySelectorAll("button[data-mt=voucher]"); vb.forEach(function(b){ b.onclick = function(){ alert(t("maintenance_feature_prefix") + (m.voucher.note ? ": " + m.voucher.note : "")); }; }); }
}

// === ADMIN NOTIFICATIONS ===
function paintAdminBadge() {
  var n = state.adminNotifs;
  var badge = document.getElementById("adminBellCount");
  if (!n || !badge) return;
  var total = n.payments.length + n.reports.length + n.adminNotifs.length;
  if (total > 0) {
    badge.style.display = "flex";
    badge.textContent = total > 99 ? "99+" : String(total);
  } else {
    badge.style.display = "none";
  }
}
// 3 API (thanh toán QR, báo cáo, thông báo) = 3 KV list mỗi lần gọi; renderNav chạy ở mọi lần chuyển trang nên phải giới hạn 5 phút/lần.
function fetchAdminNotifications(force) {
  if (!state.user || (state.user.role !== "admin" && state.user.role !== "super")) return;
  if (!force && state.adminNotifs && Date.now() - adminNotifAt < NOTIF_REFRESH_MS) { paintAdminBadge(); return; }
  adminNotifAt = Date.now();
  Promise.all([
    api("/api/admin/qr-payments", "GET").then(function(d) { return d.payments || []; }).catch(function() { return []; }),
    api("/api/admin/reports", "GET").then(function(d) { return d.reports || []; }).catch(function() { return []; }),
    api("/api/notifications", "GET").then(function(d) { return d.notifications || []; }).catch(function() { return []; })
  ]).then(function(results) {
    var pendingPayments = results[0].filter(function(p) { return p.status === "pending"; });
    var pendingReports = results[1].filter(function(r) { return !r.dismissed; });
    var adminNotifs = results[2].filter(function(n) { return !n.read; });
    state.adminNotifs = { payments: pendingPayments, reports: pendingReports, adminNotifs: adminNotifs };
    paintAdminBadge();
  });
}

function toggleAdminNotifications() {
  var existing = document.getElementById("adminNotifPanel");
  if (existing) { existing.remove(); return; }
  var n = state.adminNotifs || { payments: [], reports: [] };
  var panel = document.createElement("div");
  panel.id = "adminNotifPanel";
  panel.style.cssText = "position:fixed;top:60px;right:16px;width:320px;max-height:400px;overflow-y:auto;background:var(--card);border:1px solid var(--border);border-radius:12px;padding:12px;box-shadow:0 8px 32px rgba(0,0,0,0.2);z-index:9999;";
  
  var hasWork = n.payments.length > 0 || n.reports.length > 0;
  var hasNotifs = n.adminNotifs && n.adminNotifs.length > 0;
  var html = '<div style="font-weight:700;font-size:14px;margin-bottom:8px;padding-bottom:8px;border-bottom:1px solid var(--border);">' + li('bell', 16) + ' Thông báo</div>';

  if (hasWork) {
    html += '<div style="font-weight:700;font-size:11px;color:var(--indigo);text-transform:uppercase;letter-spacing:0.4px;padding:4px 0;">Cần xử lý</div>';
    if (n.payments.length > 0) {
      html += '<div style="font-weight:600;font-size:12px;color:var(--muted);padding:4px 0;">Đơn thanh toán chờ duyệt (' + n.payments.length + ')</div>';
      n.payments.slice(0, 5).forEach(function(p) {
        html += '<div class="notif-item" data-nav="admin-qrpayments" style="padding:6px 8px;border-radius:6px;cursor:pointer;">💳 ' + esc(p.tier) + ' — ' + esc(p.username) + ' — ' + (p.vndPrice ? p.vndPrice.toLocaleString() + 'đ' : '') + '</div>';
      });
    }
    if (n.reports.length > 0) {
      html += '<div style="font-weight:600;font-size:12px;color:var(--muted);padding:4px 0;margin-top:8px;">Báo cáo vi phạm (' + n.reports.length + ')</div>';
      n.reports.slice(0, 5).forEach(function(r) {
        html += '<div class="notif-item" data-nav="admin-reports" style="padding:6px 8px;border-radius:6px;cursor:pointer;">' + li("alert", 12) + ' ' + esc(r.reason || r.url || 'Báo cáo') + '</div>';
      });
    }
  }
  if (hasNotifs) {
    html += '<div style="font-weight:700;font-size:11px;color:var(--indigo);text-transform:uppercase;letter-spacing:0.4px;padding:4px 0;margin-top:' + (hasWork ? '10px' : '0') + ';">' + t("adm_notif_sys") + '</div>';
    n.adminNotifs.slice(0, 5).forEach(function(an) {
      var iconMap = { info: "i", warning: "!", success: "v", danger: "x", feedback: "fb" };
      var icon = iconMap[an.type] || "*";
      html += '<div class="notif-item" data-nav="admin-notif" data-notifid="' + esc(an.id) + '" style="padding:6px 8px;border-radius:6px;cursor:pointer;">[' + icon + '] ' + esc(an.title) + ' - <span style="font-size:11px;color:var(--muted);">' + esc(an.message.substring(0, 80)) + '</span></div>';
    });
  }
  if (!hasWork && !hasNotifs) {
    html += '<div style="padding:8px;color:var(--muted);font-size:13px;">' + t("adm_notif_empty") + '</div>';
  }
  // Single link to the notifications tab (view sent history + compose a new one — same page)
  html += '<div style="margin-top:8px;padding-top:8px;border-top:1px solid var(--border);"><a href="#/admin" onclick="closeNotifPanelAndGoTab(&#39;notifications&#39;)" style="display:block;text-align:center;padding:8px;border-radius:6px;background:rgba(99,102,241,0.1);color:#818cf1;font-weight:600;font-size:13px;text-decoration:none;">Quản lý thông báo</a></div>';
  function closeNotifPanelAndGoTab(tab) { var p = document.getElementById("adminNotifPanel"); if (p) p.remove(); setTimeout(function(){ navigate("admin"); setTimeout(function(){ adminTab = tab; render(); }, 200); }, 100); }

  panel.innerHTML = html;
  document.body.appendChild(panel);

  // Attach event listeners instead of inline handlers
  var items = panel.querySelectorAll(".notif-item");
  items.forEach(function(item) {
    item.onmouseover = function() { this.style.background = "rgba(99,102,241,0.1)"; };
    item.onmouseout = function() { this.style.background = "transparent"; };
    item.onclick = function() {
      var nav = this.getAttribute("data-nav");
      if (nav === "admin-notif") {
        var notifId = this.getAttribute("data-notifid");
        api("/api/notifications/" + encodeURIComponent(notifId), "POST").catch(function(){});
        closeNotifPanelAndGoTab("notifications");
        return;
      } else if (nav === "admin-qrpayments") {
        closeNotifPanelAndGoTab("qrpayments");
        return;
      } else if (nav === "admin-reports") {
        closeNotifPanelAndGoTab("reports");
        return;
      } else if (nav) {
        navigate(nav);
      }
      panel.remove();
    };
  });
  
  panel.addEventListener("click", function(e) {
    if (e.target === panel) panel.remove();
  });
}

function renderNav() {
  var route = getRoute() || "";
  var el = document.getElementById("sbNav");
  var footerEl = document.getElementById("sbFooter");
  var headerRight = document.getElementById("sbHeaderRight");
  if (!el) return;

  function tr(key, fallback) {
    return (typeof t === "function") ? t(key) : fallback;
  }

  function sbItem(route2, icon, label) {
    var cls = (route === route2 || route.indexOf(route2 + "/") === 0) ? "active" : "";
    return '<a class="sb-item ' + cls + '" href="#/' + esc(route2) + '" title="' + esc(label) + '">' + li(icon, 18) + '<span class="sb-label">' + esc(label) + '</span></a>';
  }

  var html = "";
  html += sbItem("home", "link", tr("home", "Trang chủ"));
  html += sbItem("dashboard", "chart", tr("dashboard", "Bảng điều khiển"));
  html += '<div class="sb-section-label">Links</div>';
  html += sbItem("bulkqr", "qr", "QR Codes");
  html += sbItem("scanner", "scan", "Scanner QR");
  html += sbItem("linkinbio", "user", "Link-in-bio");
  html += '<div class="sb-section-label">Tools</div>';
  html += sbItem("bulk", "package", "Bulk");
  html += sbItem("webhooks", "zap", "Webhooks");
  html += sbItem("export", "download", "Export");
  if (state.limits && state.limits.hasCampaignHistory) html += sbItem("campaigns", "target", "Campaigns");
  if (state.limits && state.limits.hasTeam) html += sbItem("team", "users", "Team");
  html += sbItem("api", "code2", "API");
  html += '<div class="sb-section-label">System</div>';
  html += sbItem("pricing", "ticket", tr("plans", "Bảng giá"));
  if (state.user) html += sbItem("account", "settings", tr("account", "Tài khoản"));
  if (state.user && state.user.role === "admin") html += sbItem("admin", "shield", tr("admin", "Quản trị"));
  html += '<a class="sb-item" href="javascript:void(0)" onclick="toggleTheme()" title="Theme">' + (document.documentElement.getAttribute("data-theme") === "light" ? li("moon", 18) : li("sun", 18)) + '<span class="sb-label">Theme</span></a>';
  html += '<a class="sb-item" href="javascript:void(0)" onclick="showFeedbackModal()" title="' + t('feedback_title') + '">' + li('help', 18) + '<span class="sb-label">' + t('feedback_btn') + '</span></a>';

  el.innerHTML = html;
  if (footerEl) footerEl.innerHTML = renderLangSwitcher();

  var searchBox = document.getElementById("sbSearchBox");
  if (searchBox) searchBox.style.display = (route === "dashboard") ? "" : "none";

  if (headerRight) {
    var hHtml = "";
    hHtml += '<span class="sb-icon-btn" id="aiAssistantBtn" role="button" tabindex="0" aria-label="' + esc(t("ai_assistant_title")) + '">' + li("sparkles", 18) + '<span class="tooltip">' + esc(t("ai_assistant_title")) + '</span></span>';
    if (state.user) {
      var bellId = state.user.role === "admin" ? "adminBell" : "userBell";
      var countId = state.user.role === "admin" ? "adminBellCount" : "userBellCount";
      hHtml += '<span class="sb-icon-btn" id="' + bellId + '" role="button" tabindex="0" aria-label="' + esc(t("notif_title")) + '">' + li("bell", 18) + '<span class="sb-notif-dot" id="' + countId + '">0</span><span class="tooltip">' + t("notif_title") + '</span></span>';
    }
    if (state.user) {
      var initial = (state.user.username || "?").charAt(0).toUpperCase();
      hHtml += '<div style="position:relative;">';
      hHtml += '<button class="sb-user" id="sbUserBtn"><div class="sb-user-avatar">' + esc(initial) + '</div><div class="sb-user-info"><div class="sb-user-name">' + esc(state.user.username) + '</div><div class="sb-user-role">' + esc(roleLabel(state.user.role)) + '</div></div></button>';
      hHtml += '<div class="sb-user-menu" id="sbUserMenu">';
      hHtml += '<div class="sb-user-menu-item" onclick="navigate(&#39;account&#39;);closeUserMenu();">' + li("settings", 16) + ' ' + tr("account", "Tài khoản") + '</div>';
      hHtml += '<div class="sb-user-menu-item" onclick="navigate(&#39;pricing&#39;);closeUserMenu();">' + li("ticket", 16) + ' ' + tr("plans", "Bảng giá") + '</div>';
      hHtml += '<div class="sb-user-menu-item" onclick="showFeedbackModal();closeUserMenu();">' + li("help", 16) + ' ' + t('feedback_btn') + '</div>';
      hHtml += '<div class="sb-user-menu-item" onclick="toggleLangDropdown(event)" style="display:flex;align-items:center;justify-content:space-between;">' + li("globe", 16) + ' <span style="flex:1;">' + tr("language", "Ngôn ngữ") + '</span><span style="font-size:12px;color:var(--muted);">' + esc(LANG_LABELS[currentLang] || "Tiếng Việt") + ' ›</span></div>';
      hHtml += renderLangSubmenu();
      hHtml += '<div class="sb-user-menu-sep"></div>';
      hHtml += '<div class="sb-user-menu-item" onclick="doLogout();closeUserMenu();" style="color:var(--btn-danger-color);">' + li("x", 16) + ' ' + tr("logout", "Đăng xuất") + '</div>';
      hHtml += '</div></div>';
    } else {
      hHtml += '<div style="position:relative;" id="guestLangWrap">';
      hHtml += '<button class="sb-icon-btn" onclick="toggleGuestLangDropdown(event)" aria-label="' + esc(tr("language", "Ngôn ngữ")) + '" style="gap:6px;padding:8px 10px;">' + li("globe", 18) + '<span style="font-size:12px;font-weight:700;">' + esc(currentLang.toUpperCase()) + '</span><span class="tooltip">' + tr("language", "Ngôn ngữ") + '</span></button>';
      if (guestLangDropdownOpen) {
        hHtml += '<div class="lang-dropdown">';
        for (var gi = 0; gi < LANGS.length; gi++) {
          var gl = LANGS[gi];
          var gActive = gl === currentLang;
          hHtml += '<div class="lang-item ' + (gActive ? "active" : "") + '" onclick="switchLang(&#39;' + gl + '&#39;)">' +
            (gActive ? li("check", 14) + ' ' : '') + LANG_LABELS[gl] + '</div>';
        }
        hHtml += '</div>';
      }
      hHtml += '</div>';
      hHtml += '<button class="sb-icon-btn" onclick="navigate(&#39;login&#39;)" aria-label="' + esc(tr("login", "Đăng nhập")) + '">' + li("user", 18) + '<span class="tooltip">' + tr("login", "Đăng nhập") + '</span></button>';
      hHtml += '<button class="sb-icon-btn" onclick="navigate(&#39;register&#39;)" aria-label="' + esc(tr("register", "Đăng ký")) + '">' + li("plus", 18) + '<span class="tooltip">' + tr("register", "Đăng ký") + '</span></button>';
    }
    headerRight.innerHTML = hHtml;
    var userBtn = document.getElementById("sbUserBtn");
    var userMenu = document.getElementById("sbUserMenu");
    if (userBtn && userMenu) {
      userBtn.onclick = function(e) { e.stopPropagation(); userMenu.classList.toggle("show"); };
    }
    document.removeEventListener("click", closeUserMenuHandler);
    document.addEventListener("click", closeUserMenuHandler);
    document.removeEventListener("click", closeGuestLangDropdownHandler);
    document.addEventListener("click", closeGuestLangDropdownHandler);
    var bell = document.getElementById("adminBell");
    if (bell) { bell.onclick = function() { toggleAdminNotifications(); fetchAdminNotifications(true); }; fetchAdminNotifications(); }
    var userBell = document.getElementById("userBell");
    if (userBell) { userBell.onclick = function() { toggleUserNotifications(); }; fetchUserNotifications(); }
    var aiBtn = document.getElementById("aiAssistantBtn");
    if (aiBtn) aiBtn.onclick = function(e) { e.stopPropagation(); toggleAiChatPanel(); };
  }
  var brand = document.getElementById("navBrand");
  if (brand) brand.onclick = function() { navigate("home"); };
  /* sidebar expand-on-hover: no init needed */
}

function closeUserMenu() { var m = document.getElementById("sbUserMenu"); if (m) m.classList.remove("show"); langSubmenuOpen = false; }
function toggleActMenu(btn) { var menu = btn.nextElementSibling; var isOpen = menu.classList.contains("show"); document.querySelectorAll(".act-menu-list.show").forEach(function(m){ m.classList.remove("show"); }); if (!isOpen) menu.classList.add("show"); }
function closeUserMenuHandler(e) { var m = document.getElementById("sbUserMenu"); if (m && m.classList.contains("show") && !e.target.closest("#sbUserBtn") && !e.target.closest("#sbUserMenu")) { m.classList.remove("show"); langSubmenuOpen = false; } }
function doLogout() { api("/api/auth/logout", "POST").then(function() { state.user = null; state.limits = null; navigate("home"); render(); }); }
function toggleTheme() {
  var current = document.documentElement.getAttribute("data-theme");
  var newTheme = (current === "dark") ? "light" : "dark";
  document.documentElement.setAttribute("data-theme", newTheme);
  try { localStorage.setItem("shurl_theme", newTheme); } catch(e) {}
  renderNav();
}
function toggleSidebar() { /* removed - sidebar now expands on hover */ }
function openSidebarMobile() { var sb = document.getElementById("sidebar"); var ov = document.getElementById("sbOverlay"); if (sb) sb.classList.add("mobile-open"); if (ov) ov.classList.add("show"); }
function closeSidebarMobile() { var sb = document.getElementById("sidebar"); var ov = document.getElementById("sbOverlay"); if (sb) sb.classList.remove("mobile-open"); if (ov) ov.classList.remove("show"); }
function sbSearchLinks(val) {
  var t = document.getElementById("linksBody");
  if (!t) return;
  var q = (val || "").toLowerCase();
  t.querySelectorAll("tr").forEach(function(x) {
    if (x.classList.contains("row-actions")) return;
    var match = x.textContent.toLowerCase().indexOf(q) !== -1;
    x.style.display = match ? "" : "none";
    var next = x.nextElementSibling;
    if (next && next.classList.contains("row-actions")) next.style.display = match ? "" : "none";
  });
}

var analyticsPollTimer = null;
function render(){
  if (analyticsPollTimer) { clearInterval(analyticsPollTimer); analyticsPollTimer = null; }
  if (window.location.search.includes("upgrade=")) {
    var cleanUrl = window.location.origin + window.location.pathname + window.location.hash;
    window.history.replaceState({}, document.title, cleanUrl);
  }
  closeSlide();
  var route = getRoute();
  renderNav();
  renderSidebars();
  var app = document.getElementById("app");
  var authRoutes = ["dashboard","team","campaigns","admin","account","linkinbio"];
  if (authRoutes.indexOf(route) !== -1 && !state.user){ navigate("login"); return; }
  var majorRoutes = ["home","bulkqr","scanner","login","register","forgot-password","dashboard","bulk","api","webhooks","export","team","campaigns","account","pricing","admin","terms","privacy","disclaimer","report","linkinbio"];
  var isMajor = majorRoutes.indexOf(route) !== -1 || route.indexOf("reset-password") === 0;
  function doRender(){
    if (route === "home") renderHome(app);
    else if (route === "bulkqr") { renderBulkQR(app); bindCrownHints(); }
    else if (route === "scanner") renderScanner(app);
    else if (route === "linkinbio") renderLinkInBio(app);
    else if (route === "login") renderLogin(app);
    else if (route === "register") renderRegister(app);
    else if (route === "forgot-password") renderForgotPassword(app);
    else if (route.indexOf("reset-password") === 0) renderResetPassword(app);
    else if (route === "dashboard") { renderDashboard(app); bindCrownHints(); }
    else if (route === "bulk") renderBulk(app);
    else if (route === "api") { renderApiTab(app); bindCrownHints(); }
    else if (route === "webhooks") { renderWebhookTab(app); bindCrownHints(); }
    else if (route === "export") { renderExportTab(app); bindCrownHints(); }
    else if (route === "team") renderTeamTab(app);
    else if (route === "campaigns") { renderCampaignsTab(app); bindCrownHints(); }
    else if (route === "account") renderAccount(app);
    else if (route === "pricing") renderPricing(app);
    else if (route === "admin") renderAdmin(app);
    else if (route === "terms") renderTerms(app);
    else if (route === "privacy") renderPrivacy(app);
    else if (route === "disclaimer") renderDisclaimer(app);
    else if (route === "report") renderReport(app);
    else if (route.indexOf("analytics/") === 0) renderAnalytics(app, decodeURIComponent(route.slice(10)));
    else app.innerHTML = '<div class="card"><p class="sub">Không tìm thấy trang.</p></div>';
    app.style.opacity = "1";
    app.style.transform = "none";
  }
  if (isMajor){
    app.style.opacity = "0";
    app.style.transform = "translateY(6px) scale(0.99)";
    setTimeout(doRender, 160);
  } else {
    doRender();
  }
}

// ---------- HOME ----------
function renderHome(app){
  var promo = "";
  if (!state.user){
    promo =
      '<div style="background:linear-gradient(135deg,rgba(99,102,241,0.15),rgba(192,132,252,0.15));border:1px solid rgba(99,102,241,0.3);border-radius:16px;padding:20px;margin-bottom:18px;text-align:center;">' +
      '<h2 style="margin:0 0 6px;">' + t("home_promo_title") + '</h2>' +
      '<p class="hint" style="margin-bottom:14px;">' + t("home_promo_sub") + '</p>' +
      '<button class="btn btn-primary" style="justify-content:center;" onclick="navRegister()">' + t("home_promo_btn1") + '</button>' +
      '<button class="btn btn-ghost" style="margin-left:8px;" onclick="navLogin()">' + t("home_promo_btn2") + '</button>' +
      '</div>';
  }
  var isUser = !!state.user;
  var homeLimits = state.limits || {};
  var canExpiry = isUser && isProOrAbove(state.user);
  var canCustomDomain = !!homeLimits.hasCustomDomain;
  var userFieldsHtml = "";
  if (isUser){
    userFieldsHtml =
      '<div class="row">' +
        '<div><label>' + t("custom_alias_opt") + helpLinkHtml('dat-ten-link-tuy-chinh', 'Tên rút gọn tuỳ chỉnh là gì? Xem hướng dẫn sử dụng') + '</label><input type="text" id="f_code" placeholder="ten-rieng-cua-ban" oninput="updateHomePreview()"></div>' +
        '<div><label>' + t("title_opt") + '</label><input type="text" id="f_title" placeholder="' + t("home_title_ph") + '"></div>' +
      '</div>' +
      '<div class="row">' +
        '<div><label>' + t("campaign") + helpLinkHtml('campaign-la-gi-huong-dan-quan-ly-link-theo-chien-dich', 'Campaign là gì? Xem hướng dẫn sử dụng') + '</label><input type="text" id="f_campaign" placeholder="' + t("optional") + '"></div>' +
        '<div><label>' + t("tags") + '</label><input type="text" id="f_tags" placeholder="vd: sale, q1"></div>' +
      '</div>' +
      '<p style="margin-top:6px;"><a href="javascript:void(0)" onclick="toggleUtmFields()">' + t("utm_builder_toggle") + '</a>' + helpLinkHtml('utm-tracking-la-gi-ket-hop-rut-gon-link', 'UTM Tracking là gì? Xem hướng dẫn sử dụng') + '</p>' +
      '<div id="utmFields" style="display:none;margin-top:6px;">' +
        '<p class="hint">' + t("utm_builder_hint") + '</p>' +
        '<div class="row">' +
          '<div><label>' + t("utm_source") + '</label><input type="text" id="u_source" placeholder="facebook"></div>' +
          '<div><label>' + t("utm_medium") + '</label><input type="text" id="u_medium" placeholder="social"></div>' +
        '</div>' +
        '<div class="row">' +
          '<div><label>' + t("utm_term") + '</label><input type="text" id="u_term" placeholder="' + t("optional") + '"></div>' +
          '<div><label>' + t("utm_content") + '</label><input type="text" id="u_content" placeholder="' + t("optional") + '"></div>' +
        '</div>' +
      '</div>' +
      '<div class="row">' +
        '<div><label>' + t("password_protect") + helpLinkHtml('bao-ve-link-bang-mat-khau', 'Bảo vệ link bằng mật khẩu là gì? Xem hướng dẫn sử dụng') + '</label><input type="text" id="f_password" placeholder="' + t("home_pw_ph") + '"></div>' +
        (canExpiry ? '<div><label>' + t("expiry_date") + helpLinkHtml('dat-ngay-het-han-cho-link', 'Đặt ngày hết hạn cho link là gì? Xem hướng dẫn sử dụng') + '</label><input type="date" id="f_expiry"></div>' : '') +
      '</div>' +
      (canExpiry ? '<div class="row"><div><label>' + t("custom_domain") + helpLinkHtml('tao-ten-mien-rieng-cho-link', 'Tên miền riêng là gì? Xem hướng dẫn sử dụng') + '</label>' +
        (canCustomDomain ? '<input type="text" id="f_domain" placeholder="ten.shurl.com" oninput="updateHomePreview()">' : '<input type="text" id="f_domain" placeholder="' + t("upgrade_to_unlock") + '" disabled style="opacity:0.5;">') +
        '</div></div>' : '') +
      '<div id="advFields" style="display:none;margin-top:12px;">' +
        '<label>' + t("pixel_tracking") + ' (Pro/Super)' + helpLinkHtml('pixel-tracking-la-gi-huong-dan-gan-facebook-google-tiktok', 'Pixel Tracking là gì? Xem hướng dẫn sử dụng') + '</label>' +
        '<input type="text" id="f_pixel_fb" placeholder="Facebook Pixel ID (vd: 123456789)">' +
        '<input type="text" id="f_pixel_ga" placeholder="Google Analytics ID (vd: G-XXXXXXX)" style="margin-top:8px;">' +
        '<input type="text" id="f_pixel_tt" placeholder="TikTok Pixel ID" style="margin-top:8px;">' +
        '<hr style="border-color:rgba(148,163,184,0.15);margin:14px 0;">' +
        '<label>' + t("ab_testing") + t("home_ab_suffix") + helpLinkHtml('ab-testing-la-gi-huong-dan-chia-traffic-link-rut-gon', 'A/B Testing là gì? Xem hướng dẫn sử dụng') + '</label>' +
        '<input type="url" id="f_ab1" placeholder="' + t("home_ab_a_ph") + '" style="margin-top:8px;">' +
        '<input type="url" id="f_ab2" placeholder="' + t("home_ab_b_ph") + '" style="margin-top:8px;">' +
        '<hr style="border-color:rgba(148,163,184,0.15);margin:14px 0;">' +
        '<label>' + t("deep_link") + ' (Pro/Super)' + helpLinkHtml('deep-link-va-smart-fallback-la-gi-huong-dan-cau-hinh', 'Deep Link là gì? Xem hướng dẫn sử dụng') + '</label>' +
        '<input type="url" id="f_dl_ios" placeholder="iOS app link (vd: myapp://)" style="margin-top:8px;">' +
        '<input type="url" id="f_dl_android" placeholder="Android app link" style="margin-top:8px;">' +
      '</div>' +
      (homeLimits.hasPixel || homeLimits.hasABTest || homeLimits.hasDeepLink ?
        '<p style="margin-top:10px;"><a href="javascript:void(0)" onclick="toggleAdvFields()">' + t("adv_options") + '</a></p>' : '');
  } else {
    userFieldsHtml = '<p class="hint">' + t("home_guest_hint") + '</p>';
  }
  var qrCardHtml =
    '<div class="card">' +
    '<h2>' + li('qr', 20) + ' ' + t("home_qr_promo_title") + '</h2>' +
    '<p class="sub">' + t("home_qr_promo_desc") + '</p>' +
    '<button class="btn btn-ghost" onclick="navigate(&#39;bulkqr&#39;)">' + t("home_qr_promo_btn") + '</button>' +
    '</div>';
  var sideCardHtml = isUser ?
    ('<div class="card">' +
      '<h2>' + li('link', 20) + ' ' + t("home_manage_title") + '</h2>' +
      '<p class="sub">' + t("home_manage_desc") + '</p>' +
      '<div class="home-mini" id="homeManageStats"></div>' +
      '<button class="btn btn-primary" onclick="navigate(&#39;dashboard&#39;)">' + t("home_manage_btn") + '</button>' +
      '</div>') :
    ('<div class="card">' +
      '<h2>' + li('lock', 20) + ' ' + t("home_guest_manage_title") + '</h2>' +
      '<p class="sub">' + t("home_guest_manage_desc") + '</p>' +
      '<button class="btn btn-primary" onclick="navLogin()">' + t("home_guest_manage_btn") + '</button>' +
      '</div>');
  app.innerHTML =
    promo +
    '<div class="card">' +
    '<h1>SHURLVN.COM</h1>' +
    '<p class="sub">' + t("home_hero_sub") + '</p>' +
    '<form id="shortenForm">' +
      '<label>' + t("url_to_shorten") + helpLinkHtml('cach-rut-gon-link-mien-phi', 'Cách rút gọn link miễn phí — Xem hướng dẫn sử dụng') + '</label>' +
      '<input type="url" id="f_url" placeholder="https://vi-du.com/duong-dan-rat-dai" required oninput="updateHomePreview()">' +
      '<div id="homeLinkPreview" style="display:none;margin:16px 0;padding:14px 16px;background:var(--stat-bg);border:1px solid var(--border);border-radius:10px;">' +
      '<div style="font-size:13px;color:var(--muted);margin-bottom:6px;">' + li('link', 14) + ' ' + t("home_your_link") + '</div>' +
      '<div id="homePreviewUrl" style="font-size:16px;font-weight:600;color:#818cf8;word-break:break-all;"></div>' +
      '</div>' +
      userFieldsHtml +
      '<div style="margin-top:18px;"><button class="btn btn-primary" type="submit">' + t("shorten_now") + '</button></div>' +
    '</form>' +
    '<div id="shortenResult"></div>' +
    '</div>' +
    '<div class="home-duo">' + qrCardHtml + sideCardHtml + '</div>';

  if (isUser) loadHomeManageStats();

  document.getElementById("shortenForm").addEventListener("submit", function(e){
    e.preventDefault();
    var submitBtn = e.target.querySelector('button[type="submit"]');
    if (submitBtn){ if (submitBtn.disabled) return; submitBtn.disabled = true; submitBtn.style.opacity = "0.6"; }
    var body = collectHomeLinkBody();
    var box = document.getElementById("shortenResult");
    box.innerHTML = '<p class="hint">' + t("processing") + '</p>';
    api("/api/links", "POST", body).then(function(data){
      var link = data.link;
      box.innerHTML =
        '<div class="copybox"><span class="u" id="resUrl">' + esc(link.shortUrl) + '</span>' +
        '<button class="btn btn-ghost btn-sm" id="btnCopyRes">' + t("copy") + '</button></div>' +
        '<p class="hint">' + t("result_dest") + ' ' + esc(link.url) + '</p>';
      document.getElementById("btnCopyRes").onclick = function(){ copyText(link.shortUrl, this); };
      var qrInput = document.getElementById("homeQrUrl");
      if (qrInput) { qrInput.value = link.shortUrl; }
      if (isUser) loadHomeManageStats();
    }).catch(function(err){
      var msg = err.message;
      // Dịch error code sang ngôn ngữ hiện tại
      if (err.errorCode) {
        var key = "err_" + err.errorCode.toLowerCase();
        msg = t(key) || msg;
      }
      box.innerHTML = '<div class="msg msg-error">' + esc(msg) + '</div>';
    }).then(function(){
      if (submitBtn){ submitBtn.disabled = false; submitBtn.style.opacity = "1"; }
    });
  });

}

// Gom dữ liệu form tạo link ở trang chủ (form đầy đủ cho người đã đăng nhập, form đơn giản cho khách).
function collectHomeLinkBody(){
  var val = function(id){ var el = document.getElementById(id); return el && el.value ? el.value.trim() : ""; };
  var campaign = val("f_campaign");
  var body = { url: applyUtmParams(val("f_url"), campaign) };
  if (val("f_code")) body.customCode = val("f_code");
  if (val("f_title")) body.title = val("f_title");
  if (campaign) body.campaign = campaign;
  if (val("f_tags")) body.tags = val("f_tags").split(",").map(function(t2){ return t2.trim(); }).filter(Boolean);
  if (val("f_expiry")) body.expiryDate = val("f_expiry");
  if (val("f_password")) body.password = val("f_password");
  if (val("f_domain")) body.customDomain = val("f_domain");
  var pixels = [];
  if (val("f_pixel_fb")) pixels.push({ type: "facebook", id: val("f_pixel_fb") });
  if (val("f_pixel_ga")) pixels.push({ type: "ga", id: val("f_pixel_ga") });
  if (val("f_pixel_tt")) pixels.push({ type: "tiktok", id: val("f_pixel_tt") });
  if (pixels.length > 0) body.pixels = pixels;
  var abUrls = [];
  if (val("f_ab1")) abUrls.push(val("f_ab1"));
  if (val("f_ab2")) abUrls.push(val("f_ab2"));
  if (abUrls.length > 0) body.abUrls = abUrls;
  var deepLinks = {};
  if (val("f_dl_ios")) deepLinks.ios = val("f_dl_ios");
  if (val("f_dl_android")) deepLinks.android = val("f_dl_android");
  if (deepLinks.ios || deepLinks.android) body.deepLinks = deepLinks;
  return body;
}

// Số link + lượt click hiển thị trên thẻ "Quản lý link" (tải sau khi vẽ trang, không chặn form).
function loadHomeManageStats(){
  var box = document.getElementById("homeManageStats");
  if (!box) return;
  api("/api/analytics/overview").then(function(res){
    var s = (res && res.stats) || {};
    var again = document.getElementById("homeManageStats");
    if (!again) return;
    again.innerHTML =
      '<div><b>' + fmtNum(s.userLinksCount || 0) + '</b><span>' + t("home_manage_links") + '</span></div>' +
      '<div><b>' + fmtNum(s.userTotalClicks || 0) + '</b><span>' + t("home_manage_clicks") + '</span></div>';
  }).catch(function(){ var b = document.getElementById("homeManageStats"); if (b) b.innerHTML = ""; });
}

function updateHomePreview(){
  var url = document.getElementById("f_url").value.trim();
  var aliasEl = document.getElementById("f_code");
  var alias = aliasEl ? aliasEl.value.trim() : "";
  var domEl = document.getElementById("f_domain");
  var domain = domEl ? domEl.value.trim() : "";
  var previewBox = document.getElementById("homeLinkPreview");
  var previewUrl = document.getElementById("homePreviewUrl");
  if (!previewBox || !previewUrl) return;
  if (!url){ previewBox.style.display = "none"; return; }
  previewBox.style.display = "block";
  var base;
  if (domain){
    var d = domain.replace("https://", "").replace("http://", "");
    while (d.endsWith("/")){ d = d.slice(0, -1); }
    if (d.indexOf(".") === -1){ d = d + ".shurlvn.com"; }
    base = "https://" + d + "/";
  } else {
    base = location.origin + "/";
  }
  previewUrl.textContent = alias ? (base + alias) : (base + "...");
}
function toggleAdvFields(){
  var e = document.getElementById("advFields");
  if (e) e.style.display = e.style.display === "none" ? "block" : "none";
}

function toggleUtmFields(){
  var e = document.getElementById("utmFields");
  if (e) e.style.display = e.style.display === "none" ? "block" : "none";
}

function applyUtmParams(rawUrl, campaign){
  var source = (document.getElementById("u_source") || {}).value;
  var medium = (document.getElementById("u_medium") || {}).value;
  var term = (document.getElementById("u_term") || {}).value;
  var content = (document.getElementById("u_content") || {}).value;
  source = source ? source.trim() : "";
  medium = medium ? medium.trim() : "";
  term = term ? term.trim() : "";
  content = content ? content.trim() : "";
  if (!source && !medium && !term && !content) return rawUrl;
  try {
    var u = new URL(rawUrl);
    if (source) u.searchParams.set("utm_source", source);
    if (medium) u.searchParams.set("utm_medium", medium);
    if (campaign) u.searchParams.set("utm_campaign", campaign);
    if (term) u.searchParams.set("utm_term", term);
    if (content) u.searchParams.set("utm_content", content);
    return u.toString();
  } catch (e) {
    return rawUrl;
  }
}

function copyText(text, btnEl){
  var done = function(){ if (btnEl){ var old = btnEl.textContent; btnEl.textContent = t("copied"); setTimeout(function(){ btnEl.textContent = old; }, 1500); } };
  if (navigator.clipboard && navigator.clipboard.writeText){
    navigator.clipboard.writeText(text).then(done).catch(function(){ fallbackCopy(text); done(); });
  } else { fallbackCopy(text); done(); }
}

function fallbackCopy(text){
  var ta = document.createElement("textarea");
  ta.value = text; ta.style.position = "fixed"; ta.style.opacity = "0";
  document.body.appendChild(ta); ta.select();
  try { document.execCommand("copy"); } catch(e){}
  document.body.removeChild(ta);
}
function updateLinkList(){
  api("/api/links").then(function(res){
    state.links = res.links;
    var tbody = document.getElementById("linksBody");
    if (!tbody) return;
    var canAdvanced = (state.limits && state.limits.hasAdvancedManagement) || (state.user && state.user.role === "admin");
    var isAdmin = state.user && state.user.role === "admin";

    // Điền dropdown lọc user (chỉ admin)
    if (isAdmin){
      var filterEl = document.getElementById("filterOwner");
      if (filterEl){
        var owners = {};
        state.links.forEach(function(l){ if (l.owner) owners[l.owner] = true; });
        var currentVal = filterEl.value;
        filterEl.innerHTML = '<option value="">Tất cả user</option>' +
          Object.keys(owners).sort().map(function(o){ return '<option value="' + esc(o) + '"' + (o === currentVal ? ' selected' : '') + '>' + esc(o) + '</option>'; }).join("");
        filterEl.onchange = function(){ updateLinkList(); };
      }
    }

    // Lọc theo owner nếu admin chọn
    var displayLinks = state.links;
    if (isAdmin){
      var filterEl2 = document.getElementById("filterOwner");
      if (filterEl2 && filterEl2.value){
        displayLinks = state.links.filter(function(l){ return l.owner === filterEl2.value; });
      }
    }

    tbody.innerHTML = displayLinks.map(function(l){
      var deleted = l.isDeleted === true;
      var code = esc(l.code);
      var style = deleted ? "opacity:0.5;text-decoration:line-through;" : "";
      var tags = (l.tags || []).map(function(tg){ return '<span class="tag">' + esc(tg) + '</span>'; }).join("");

      var mainRow = '<tr data-code="' + code + '" style="' + style + '">' +
        '<td><div class="mono" style="color:var(--code-color);font-weight:700;word-break:break-all;">' + esc(l.shortUrl || (location.origin + "/" + l.code)) + '</div>' +
        '<div style="color:var(--muted);font-size:12px;">' + esc(l.title || "") + '</div>' + tags + '</td>' +
        '<td style="max-width:200px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;" title="' + esc(l.url) + '">' + esc(l.url) + '</td>' +
        (isAdmin ? '<td style="font-size:12px;color:var(--muted2);">' + esc(l.owner || "") + '</td>' : '') +
        '<td>' + fmtNum(l.totalClicks) + '</td>' +
        '<td>' + (deleted ? '<span class="badge badge-guest">' + t("deleted") + '</span>' :
                   isLinkExpired(l) ? '<span class="badge badge-guest">' + t("link_expired_badge") + '</span>' :
                   l.isEnabled === false ? '<span class="badge badge-guest">' + t("disabled") + '</span>' :
                   '<span class="badge badge-free">' + t("enabled") + '</span>') + '</td>' +
        '<td style="white-space:nowrap;font-size:12px;color:var(--muted);">' + fmtDate(l.createdAt) + '</td>' +
        '</tr>';

      var actions;
      if (deleted){
        actions = '<button class="btn btn-ghost btn-sm act-restore">' + li("undo", 12) + ' ' + t("undo_delete") + '</button>' +
          '<button class="btn btn-danger btn-sm act-force">' + li('trash', 14) + ' ' + t("force_delete") + '</button>';
      } else {
        actions = '<button class="btn btn-ghost btn-sm act-copy" title="' + t("copy") + '">' + li('file', 14) + ' ' + t("copy") + '</button>' +
          '<button class="btn btn-ghost btn-sm act-stats" title="' + t("stats") + '">' + li('chart', 14) + ' ' + t("stats") + '</button>' +
          '<button class="btn btn-ghost btn-sm act-edit" ' + (canAdvanced ? '' : 'style="opacity:0.4;pointer-events:none;"') + ' title="' + t("edit") + '">' + li('edit', 14) + ' ' + t("edit") + '</button>' +
          '<button class="btn btn-danger btn-sm act-del" title="' + t("del") + '">' + li('trash', 14) + ' ' + t("del") + '</button>';
      }
      var colCount = isAdmin ? 6 : 5;
      var actionRow = '<tr class="row-actions" data-code="' + code + '">' +
        '<td colspan="' + colCount + '"><div class="actions" style="display:flex;gap:6px;flex-wrap:wrap;padding:2px 0 10px;">' + actions + '</div></td>' +
        '</tr>';

      return mainRow + actionRow;
    }).join("");

    tbody.querySelectorAll("tr.row-actions").forEach(function(tr){
      var code = tr.getAttribute("data-code");
      var link = displayLinks.filter(function(l){ return l.code === code; })[0];
      if (!link) return;
      var copyBtn = tr.querySelector(".act-copy");
      var statsBtn = tr.querySelector(".act-stats");
      var editBtn = tr.querySelector(".act-edit");
      var delBtn = tr.querySelector(".act-del");
      var restoreBtn = tr.querySelector(".act-restore");
      var forceBtn = tr.querySelector(".act-force");
      if (copyBtn) copyBtn.onclick = function(e){ e.stopPropagation(); copyText(link.shortUrl, this); };
      if (statsBtn) statsBtn.onclick = function(e){ e.stopPropagation(); navigate("analytics/" + encodeURIComponent(code)); render(); renderSidebars(); };
      if (editBtn) editBtn.onclick = function(e){ e.stopPropagation(); if (canAdvanced) openEditModal(link); };
      if (delBtn) delBtn.onclick = function(e){ e.stopPropagation(); e.preventDefault(); deleteLink(code); };
      if (restoreBtn) restoreBtn.onclick = function(e){ e.stopPropagation(); restoreLink(code); };
      if (forceBtn) forceBtn.onclick = function(e){ e.stopPropagation(); forceDeleteLink(code); };
    });
  }).catch(function(err){ var tb = document.getElementById('linksBody'); if (tb) tb.innerHTML = '<tr><td colspan="100" class="tbl-empty">' + esc(err.message) + '</td></tr>'; });
}
refreshLinkList = updateLinkList;

function deleteLink(code){
  var modal = document.createElement("div");
  modal.id = "confirmModal";
  modal.style.cssText = "position:fixed;inset:0;background:rgba(0,0,0,0.4);display:flex;align-items:center;justify-content:center;z-index:9999;";
  var box = document.createElement("div");
  box.style.cssText = "background:var(--bg);border:1px solid var(--border);border-radius:16px;padding:28px;max-width:360px;width:90%;text-align:center;box-shadow:0 20px 60px rgba(103,91,91,0.3);animation:modalPop 0.25s ease;transform-origin:bottom center;";
  box.innerHTML = '<div style="font-size:40px;margin-bottom:12px;">' + li('trash', 40) + '</div>' +
    '<h3 style="margin:0 0 8px;color:var(--text);">' + t("delete_link_title") + '</h3>' +
    '<p style="color:var(--muted);font-size:14px;margin-bottom:20px;">' + t("delete_link_desc") + '</p>' +
    '<div style="display:flex;gap:10px;justify-content:center;">' +
    '<button class="btn btn-danger" id="confirmDelBtn">' + t("btn_ok") + '</button>' +
    '<button class="btn btn-ghost" id="cancelDelBtn" style="color:var(--muted);">' + t("btn_cancel") + '</button>' +
    '</div>';
  modal.appendChild(box);
  document.body.appendChild(modal);
  document.getElementById("cancelDelBtn").onclick = function(){ modal.remove(); };
  document.getElementById("confirmDelBtn").onclick = function(){
    modal.remove();
    var link = state.links.find(function(l){ return l.code === code; });
    var oldDeleted = link ? link.isDeleted : null;
    if (link) { link.isDeleted = true; if (typeof refreshLinkList === "function") refreshLinkList(); }
    api("/api/links/" + encodeURIComponent(code), "DELETE").then(function(){
      // success - already updated optimistically
    }).catch(function(err){
      if (link) { link.isDeleted = oldDeleted; if (typeof refreshLinkList === "function") refreshLinkList(); }
      alert(err.message);
    });
  };
}

function restoreLink(code){
  var link = state.links.find(function(l){ return l.code === code; });
  var oldDeleted = link ? link.isDeleted : null;
  if (link) { link.isDeleted = false; if (typeof refreshLinkList === "function") refreshLinkList(); }
  api("/api/links/" + encodeURIComponent(code) + "/restore", "POST").then(function(){
    // success - already updated optimistically
  }).catch(function(err){
    if (link) { link.isDeleted = oldDeleted; if (typeof refreshLinkList === "function") refreshLinkList(); }
    alert(err.message);
  });
}

function forceDeleteLink(code){
  // Tìm cả 2 hàng (dữ liệu + action) có cùng code
  var rows = document.querySelectorAll('tr[data-code="' + code + '"]');
  // Thêm hiệu ứng teo cho cả 2 hàng
  rows.forEach(function(r){
    r.style.transition = "all 0.4s ease";
    r.style.opacity = "0";
    r.style.transform = "scale(0.8)";
  });
  api("/api/links/" + encodeURIComponent(code) + "/force-delete", "DELETE").then(function(){
    setTimeout(function(){
      rows.forEach(function(r){ if (r) r.remove(); });
      var idx = state.links.findIndex(function(l){ return l.code === code; });
      if (idx >= 0) state.links.splice(idx, 1);
    }, 400);
  }).catch(function(err){
    rows.forEach(function(r){ r.style.opacity = "1"; r.style.transform = "none"; });
    alert(err.message);
  });
}

function bindRowActions(){
  var rows = document.querySelectorAll("#linksBody tr");
  rows.forEach(function(tr){
    var code = tr.getAttribute("data-code");
    var copyBtn = tr.querySelector(".act-copy");
    if (copyBtn) copyBtn.onclick = function(){ copyText(location.origin + "/" + code, copyBtn); };
    var statsBtn = tr.querySelector(".act-stats");
    if (statsBtn) statsBtn.onclick = function(){ navigate("analytics/" + code); };
    var editBtn = tr.querySelector(".act-edit");
    if (editBtn) editBtn.onclick = function(){ openEditModal(code); };
    var delBtn = tr.querySelector(".act-del");
    if (delBtn) delBtn.onclick = function(e){ e.stopPropagation(); e.preventDefault(); deleteLink(code); };
    var restoreBtn = tr.querySelector(".act-restore");
    if (restoreBtn) restoreBtn.onclick = function(e){ e.stopPropagation(); restoreLink(code); };
    var forceBtn = tr.querySelector(".act-force");
    if (forceBtn) forceBtn.onclick = function(e){ e.stopPropagation(); forceDeleteLink(code); };
  });
}

var bulkQrData = [];

function generateBulkQR(){
  var input = document.getElementById("bqrInput").value.trim();
  var color = document.getElementById("bqrColor").value.replace("#", "");
  if (!input){ document.getElementById("bqrMsg").innerHTML = '<div class="msg msg-error">' + t("bulkqr_enter_list") + '</div>'; return; }
  var lines = input.split("\\n").map(function(l){ return l.trim(); }).filter(Boolean);
  if (lines.length === 0){ document.getElementById("bqrMsg").innerHTML = '<div class="msg msg-error">' + t("bulkqr_empty") + '</div>'; return; }
  if (lines.length > 1200){ document.getElementById("bqrMsg").innerHTML = '<div class="msg msg-error">' + t("bulkqr_max") + '</div>'; return; }

  document.getElementById("bqrMsg").innerHTML = '<div class="msg msg-ok">⏳ ' + t("bulkqr_loading") + '</div>';

  bulkQrData = [];
  var preview = document.getElementById("bqrPreview");
  preview.style.display = "block";
  preview.innerHTML = '<h3>' + tf("bulkqr_result_heading", { count: lines.length }) + '</h3>' +
    '<div style="overflow-x:auto;"><table><thead><tr><th>' + t("bulkqr_col_link") + '</th><th>' + t("bulkqr_col_qr") + '</th></tr></thead><tbody id="bqrTableBody">';

  setTimeout(function(){
    var rows = lines.map(function(link, idx){
      var shortUrl = link.replace("https://", "").replace("http://", "");
      while (shortUrl.endsWith("/")){ shortUrl = shortUrl.slice(0, -1); }
      var qrUrl = "https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=" + encodeURIComponent(link) + "&color=" + color;
      bulkQrData.push({ link: shortUrl, qrUrl: qrUrl, color: color });
      return '<tr><td style="word-break:break-all;">' + esc(shortUrl) + '</td>' +
        '<td><img src="' + qrUrl + '" style="width:80px;height:80px;background:#fff;border-radius:4px;" alt="QR" loading="lazy"></td></tr>';
    });
    document.getElementById("bqrTableBody").innerHTML = rows.join("");

    document.getElementById("bqrMsg").innerHTML = '<div class="msg msg-ok">' + tf("bulkqr_done", { count: lines.length }) + '</div>';
    document.getElementById("bqrDlBtn").disabled = false;
    document.getElementById("bqrDlBtn").style.opacity = "1";
  }, 20);
}

function downloadBulkQR(){
  if (bulkQrData.length === 0) return;
  var color = document.getElementById("bqrColor").value.replace("#", "");
  var html = '<html><head><meta charset="utf-8"><title>Bulk QR</title></head><body>' +
    '<table border="1" cellpadding="8" cellspacing="0" style="border-collapse:collapse;font-family:Arial;">' +
    '<tr style="background:#6366f1;color:#fff;"><th>' + t("bulkqr_col_link") + '</th><th>' + t("bulkqr_col_qr") + '</th></tr>';

  bulkQrData.forEach(function(item){
    var qrUrl = "https://api.qrserver.com/v1/create-qr-code/?size=100x100&data=" + encodeURIComponent(item.link) + "&color=" + color;
    html += '<tr><td>' + esc(item.link) + '</td>' +
      '<td><img src="' + qrUrl + '" width="100" height="100"></td></tr>';
  });

  html += '</table></body></html>';

  var blob = new Blob([html], { type: "application/vnd.ms-excel" });
  var a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = "bulk_qr_codes.xls";
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(a.href);
}

// ---------- AUTH SPLIT CARD (login/register share one animated shell) ----------
function authColorContent(mode){
  if (mode === "login") {
    return '<h2>' + t("auth_welcome_back") + '</h2><p>' + t("auth_welcome_back_desc") + '</p>' +
      '<button type="button" class="btn-ghost-invert" onclick="switchAuthMode(&#39;register&#39;)">' + t("register") + '</button>';
  }
  return '<h2>' + t("auth_hello_friend") + '</h2><p>' + t("auth_hello_friend_desc") + '</p>' +
    '<button type="button" class="btn-ghost-invert" onclick="switchAuthMode(&#39;login&#39;)">' + t("login") + '</button>';
}

function loginFormHtml(){
  return '<h1>' + t("login") + '</h1><p class="sub">' + t("login_sub") + '</p>' +
    '<form id="loginForm">' +
      '<label>' + t("reg_username") + '</label><input type="text" id="l_user" required>' +
      '<label>' + t("reg_password") + '</label><input type="password" id="l_pass" required>' +
      '<div id="totpField" style="display:none;margin-top:12px;">' +
        '<label>' + t("totp_code") + '</label><input type="text" id="l_totp" maxlength="6" placeholder="000000">' +
      '</div>' +
      '<div id="loginMsg"></div>' +
      '<div style="margin-top:18px;"><button class="btn btn-primary" type="submit" style="width:100%;justify-content:center;">' + t("login") + '</button></div>' +
    '</form>' +
    '<div style="display:flex;align-items:center;gap:10px;margin:18px 0;">' +
      '<div style="flex:1;height:1px;background:var(--border);"></div>' +
      '<span style="font-size:12px;color:var(--muted);">' + t("auth_or") + '</span>' +
      '<div style="flex:1;height:1px;background:var(--border);"></div>' +
    '</div>' +
    '<button type="button" class="btn btn-ghost" onclick="startGoogleAuth()" style="width:100%;justify-content:center;gap:10px;display:flex;align-items:center;">' +
      '<svg width="18" height="18" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">' +
        '<path fill="#4285F4" d="M45.12 24.5c0-1.56-.14-3.06-.4-4.5H24v8.51h11.84c-.51 2.75-2.06 5.08-4.39 6.64v5.52h7.11c4.16-3.83 6.56-9.47 6.56-16.17z"/>' +
        '<path fill="#34A853" d="M24 46c5.94 0 10.92-1.97 14.56-5.33l-7.11-5.52c-1.97 1.32-4.49 2.1-7.45 2.1-5.73 0-10.58-3.87-12.31-9.07H4.34v5.7C7.96 41.07 15.4 46 24 46z"/>' +
        '<path fill="#FBBC05" d="M11.69 28.18C11.25 26.86 11 25.45 11 24s.25-2.86.69-4.18v-5.7H4.34C2.85 17.09 2 20.45 2 24s.85 6.91 2.34 9.88l7.35-5.7z"/>' +
        '<path fill="#EA4335" d="M24 10.75c3.23 0 6.13 1.11 8.41 3.29l6.31-6.31C34.91 4.18 29.93 2 24 2 15.4 2 7.96 6.93 4.34 14.12l7.35 5.7c1.73-5.2 6.58-9.07 12.31-9.07z"/>' +
      '</svg>' +
      t("auth_google_login") +
    '</button>' +
    '<p class="hint" style="margin-top:16px;display:flex;justify-content:space-between;">' +
      '<span>' + t("no_account") + ' <a href="javascript:void(0)" onclick="switchAuthMode(&#39;register&#39;)">' + t("register") + '</a></span>' +
      '<a href="#/forgot-password">' + t("forgot_password") + '</a>' +
    '</p>' +
    '<p class="hint">' + t("login_security") + '</p>';
}

function registerFormHtml(){
  return '<h1>' + t("register") + '</h1><p class="sub">' + t("register_sub") + '</p>' +
    '<form id="regForm">' +
      '<label>' + t("reg_username") + '</label><input type="text" id="r_user" required>' +
      '<label>' + t("reg_email") + '</label><input type="email" id="r_email">' +
      '<label>' + t("reg_password") + '</label><input type="password" id="r_pass" required>' +
      '<div id="regMsg"></div>' +
      '<div style="margin-top:18px;"><button class="btn btn-primary" type="submit" style="width:100%;justify-content:center;">' + t("register_free") + '</button></div>' +
      '<p class="hint" style="margin-top:10px;">' + t("register_legal_notice") + ' <a href="#/terms" target="_blank">' + t("footer_terms") + '</a> ' + t("and") + ' <a href="#/privacy" target="_blank">' + t("footer_privacy") + '</a>.</p>' +
    '</form>' +
    '<p class="hint" style="margin-top:16px;">' + t("have_account") + ' <a href="javascript:void(0)" onclick="switchAuthMode(&#39;login&#39;)">' + t("login") + '</a></p>';
}

function startGoogleAuth(){ window.location.href = "/api/auth/google"; }

function bindLoginForm(){
  var formEl = document.getElementById("loginForm");
  if (!formEl) return;

  if (window.__pendingGoogleError) {
    window.__pendingGoogleError = null;
    var msgEl = document.getElementById("loginMsg");
    if (msgEl) msgEl.innerHTML = '<div class="msg msg-error">' + esc(t("google_login_error")) + '</div>';
  }

  formEl.addEventListener("submit", function(e){
    e.preventDefault();
    var msg = document.getElementById("loginMsg");
    msg.innerHTML = "";
    var totpEl = document.getElementById("l_totp");
    var totpCode = totpEl ? totpEl.value.trim() : "";
    api("/api/auth/login", "POST", {
      username: document.getElementById("l_user").value.trim(),
      password: document.getElementById("l_pass").value,
      totpCode: totpCode
    }).then(function(data){
      if (data.requireTotp){
        document.getElementById("totpField").style.display = "block";
        document.getElementById("l_totp").focus();
        msg.innerHTML = '<div class="msg msg-ok">' + t("totp_required") + '</div>';
        return null;
      }
      state.user = data.user;
      return api("/api/auth/me");
    }).then(function(me){
      if (me){
        state.user = me.user; state.limits = me.limits;
        navigate("dashboard"); render();
      }
    }).catch(function(err){
      msg.innerHTML = '<div class="msg msg-error">' + esc(err.message) + '</div>';
    });
  });
}

function bindRegisterForm(){
  var formEl = document.getElementById("regForm");
  if (!formEl) return;
  formEl.addEventListener("submit", function(e){
    e.preventDefault();
    var msg = document.getElementById("regMsg");
    msg.innerHTML = "";
    api("/api/auth/register", "POST", {
      username: document.getElementById("r_user").value.trim(),
      email: document.getElementById("r_email").value.trim(),
      password: document.getElementById("r_pass").value
    }).then(function(){ return api("/api/auth/me"); })
    .then(function(me){
      state.user = me.user; state.limits = me.limits;
      if (typeof gtag === "function" && typeof GOOGLE_ADS_CONVERSION_SEND_TO !== "undefined" && GOOGLE_ADS_CONVERSION_SEND_TO) gtag('event', 'conversion', {'send_to': GOOGLE_ADS_CONVERSION_SEND_TO});
      navigate("dashboard"); render();
    })
    .catch(function(err){ msg.innerHTML = '<div class="msg msg-error">' + esc(err.message) + '</div>'; });
  });
}

function bindAuthForm(mode){
  if (mode === "login") bindLoginForm(); else bindRegisterForm();
}

function authLayerHtml(mode){
  return '<div class="auth-color">' + authColorContent(mode) + '</div>' +
    '<div class="auth-form-side"><div class="auth-form-inner">' +
      (mode === "login" ? loginFormHtml() : registerFormHtml()) +
    '</div></div>';
}

function renderAuthShell(app, mode){
  app.innerHTML =
    '<div class="auth-wrap">' +
    '<div class="auth-split" id="authSplit">' +
      '<div class="auth-layer current mode-' + mode + '">' + authLayerHtml(mode) + '</div>' +
    '</div>' +
    '</div>';
  bindAuthForm(mode);
}

var authSwitching = false;
function switchAuthMode(target){
  if (authSwitching) return;
  var splitEl = document.getElementById("authSplit");
  if (!splitEl) return;
  var currentLayer = splitEl.querySelector(".auth-layer.current");
  if (!currentLayer) return;
  var fromMode = currentLayer.classList.contains("mode-login") ? "login" : "register";
  if (fromMode === target) return;

  // Mobile: panels stack vertically (no diagonal to wipe across) — just swap content instantly.
  var isMobile = window.matchMedia && window.matchMedia("(max-width: 640px)").matches;
  if (isMobile) {
    currentLayer.className = "auth-layer current mode-" + target;
    currentLayer.innerHTML = authLayerHtml(target);
    bindAuthForm(target);
    try { history.replaceState(null, "", "#/" + target); } catch (e) { location.hash = "#/" + target; }
    return;
  }

  authSwitching = true;
  var wipeClass = target === "register" ? "wipe-in-right" : "wipe-in-left";
  var newLayer = document.createElement("div");
  newLayer.className = "auth-layer incoming mode-" + target + " " + wipeClass;
  newLayer.innerHTML = authLayerHtml(target);
  splitEl.appendChild(newLayer);
  bindAuthForm(target);
  var finished = false;
  function finish(){
    if (finished) return;
    finished = true;
    if (currentLayer.parentNode) currentLayer.remove();
    newLayer.classList.remove("incoming", wipeClass);
    newLayer.classList.add("current");
    authSwitching = false;
  }
  newLayer.addEventListener("animationend", finish, { once: true });
  setTimeout(finish, 750); // safety net in case animationend doesn't fire for any reason
  try { history.replaceState(null, "", "#/" + target); } catch (e) { location.hash = "#/" + target; }
}

function renderLogin(app){ renderAuthShell(app, "login"); }

function renderResetPassword(app){
  app.innerHTML = '<div class="card"><p class="sub">Đang cập nhật...</p></div>';
}

function renderRegister(app){ renderAuthShell(app, "register"); }

// ---------- DASHBOARD ----------
// Hàng thẻ "Công cụ miễn phí" ở cuối trang dashboard — mở các trang /tools (tiếng Việt) hoặc /en/tools (ngôn ngữ khác).
function dashToolsRowHtml(){
  var isVi = currentLang === "vi";
  var base = isVi ? "/tools/" : "/en/tools/";
  var items = isVi ? [
    { href: base + "dem-ky-tu", icon: "list", name: "Đếm ký tự", desc: "Kiểm tra giới hạn caption, quảng cáo, SEO." },
    { href: base + "tao-link-utm", icon: "megaphone", name: "Tạo link UTM", desc: "Gắn tham số theo dõi chiến dịch." },
    { href: base + "bo-dau-tieng-viet", icon: "code2", name: "Bỏ dấu / tạo slug", desc: "Bỏ dấu tiếng Việt, tạo đường dẫn thân thiện." }
  ] : [
    { href: base + "character-counter", icon: "list", name: "Character counter", desc: "Check caption, ad and SEO limits." },
    { href: base + "utm-link-builder", icon: "megaphone", name: "UTM link builder", desc: "Add campaign tracking parameters." },
    { href: base + "slug-generator", icon: "code2", name: "Accent remover / slug", desc: "Remove Vietnamese accents, build URL slugs." }
  ];
  return '<div class="page-head" style="margin-top:8px;"><h2 style="margin:0;">' + li('wrench', 20) + ' ' + t("dash_tools_title") + '</h2></div>' +
    '<p class="sub" style="margin-top:-8px;">' + t("dash_tools_desc") + '</p>' +
    '<div class="tools-row">' +
    items.map(function(it){
      return '<a class="card tool-card" href="' + it.href + '"><h3>' + li(it.icon, 18) + ' ' + it.name + '</h3><p class="hint">' + it.desc + '</p></a>';
    }).join("") +
    '</div>';
}

function renderDashboard(app){
  var limits = state.limits || {};
  var canAdvanced = limits.hasAdvancedManagement || state.user.role === "admin";
  var canCustomDomain = limits.hasCustomDomain;
  var canExpiry = isProOrAbove(state.user);
  var isAdmin = state.user && state.user.role === "admin";
  var linksPage = 1;
  var LINKS_PAGE_SIZE = 10;

  // ====== Bảng link — header (render 1 lần) ======
  function tableHeadHtml(){
    return '<div class="card"><div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:10px;">' +
      '<h2 style="margin:0;" id="linksHeading">' + t("dash_links_title") + '</h2>' +
      '<div style="display:flex;gap:10px;align-items:center;flex-wrap:wrap;">' +
      (isAdmin ? '<select id="filterOwner" style="padding:6px 10px;border:1px solid var(--input-border);border-radius:8px;background:var(--input-bg);color:var(--text);font-size:13px;"><option value="">Tất cả user</option></select>' : '') +
      (limits.hasDataExport ? '<button class="btn btn-ghost btn-sm" id="btnExport">' + t("export") + '</button>' + helpLinkHtml('xuat-csv-danh-sach-link-huong-dan-su-dung', t("export_help_title")) : '') +
      '</div>' +
      '</div>' +
      '<div style="overflow-x:auto;"><table><thead><tr>' +
      '<th>' + t("col_link") + '</th><th>' + t("col_dest") + '</th>' + (isAdmin ? '<th>Chủ sở hữu</th>' : '') + '<th>' + t("col_clicks") + '</th><th>' + t("col_status") + '</th><th>' + t("col_created") + '</th>' +
      '</tr></thead><tbody id="linksBody"></tbody></table></div>' +
      '<p class="hint" id="emptyHint" style="margin-top:14px;display:none;">' + t("dash_empty") + ' <a href="#/home">' + t("dash_empty_cta") + '</a>.</p>' +
      '<div id="linksPager"></div>' +
      '</div>';
  }

  // ====== Render + bind toàn bộ danh sách link (dùng chung) ======
  function renderLinkRows(){
    var tbody = document.getElementById("linksBody");
    if (!tbody || !state.links) return;

    // Điền dropdown lọc user (chỉ admin) — lưu giá trị đang chọn
    if (isAdmin){
      var filterEl = document.getElementById("filterOwner");
      if (filterEl){
        var owners = {};
        state.links.forEach(function(l){ if (l.owner) owners[l.owner] = true; });
        var currentVal = filterEl.value || "";
        filterEl.innerHTML = '<option value="">Tất cả user</option>' +
          Object.keys(owners).sort().map(function(o){ return '<option value="' + esc(o) + '"' + (o === currentVal ? ' selected' : '') + '>' + esc(o) + '</option>'; }).join("");
        filterEl.onchange = function(){ linksPage = 1; renderLinkRows(); };
      }
    }

    // Lọc theo owner nếu admin chọn
    var displayLinks = state.links;
    if (isAdmin){
      var filterEl2 = document.getElementById("filterOwner");
      if (filterEl2 && filterEl2.value){
        displayLinks = state.links.filter(function(l){ return l.owner === filterEl2.value; });
      }
    }

    // Cập nhật số lượng + hint rỗng
    var heading = document.getElementById("linksHeading");
    if (heading) heading.textContent = 'Danh sách link (' + state.links.length + ')';
    var emptyHint = document.getElementById("emptyHint");
    if (emptyHint) emptyHint.style.display = state.links.length === 0 ? 'block' : 'none';

    var totalPages = Math.max(1, Math.ceil(displayLinks.length / LINKS_PAGE_SIZE));
    if (linksPage > totalPages) linksPage = totalPages;
    if (linksPage < 1) linksPage = 1;
    var pageLinks = displayLinks.slice((linksPage - 1) * LINKS_PAGE_SIZE, linksPage * LINKS_PAGE_SIZE);
    var pagerEl = document.getElementById("linksPager");
    if (pagerEl) {
      pagerEl.innerHTML = pagerButtonsHtml(linksPage, totalPages);
      bindPagerClicks(pagerEl, function(p){ linksPage = p; renderLinkRows(); });
    }

    tbody.innerHTML = pageLinks.map(function(l){
      var deleted = l.isDeleted === true;
      var code = esc(l.code);
      var style = deleted ? "opacity:0.5;text-decoration:line-through;" : "";
      var tags = (l.tags || []).map(function(tg){ return '<span class="tag">' + esc(tg) + '</span>'; }).join("");

      var mainRow = '<tr data-code="' + code + '" style="' + style + '">' +
        '<td><div class="mono" style="color:var(--code-color);font-weight:700;word-break:break-all;">' + esc(l.shortUrl || (location.origin + "/" + l.code)) + '</div>' +
        '<div style="color:var(--muted);font-size:12px;">' + esc(l.title || "") + '</div>' + tags + '</td>' +
        '<td style="max-width:200px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;" title="' + esc(l.url) + '">' + esc(l.url) + '</td>' +
        (isAdmin ? '<td style="font-size:12px;color:var(--muted2);white-space:nowrap;font-weight:600;">' + esc(l.owner || "") + '</td>' : '') +
        '<td>' + fmtNum(l.totalClicks) + '</td>' +
        '<td>' + (deleted ? '<span class="badge badge-guest">' + t("deleted") + '</span>' :
                   isLinkExpired(l) ? '<span class="badge badge-guest">' + t("link_expired_badge") + '</span>' :
                   l.isEnabled === false ? '<span class="badge badge-guest">' + t("disabled") + '</span>' :
                   '<span class="badge badge-free">' + t("enabled") + '</span>') + '</td>' +
        '<td style="white-space:nowrap;font-size:12px;color:var(--muted);">' + fmtDate(l.createdAt) + '</td>' +
        '</tr>';

      var actions;
      if (deleted){
        actions = '<button class="btn btn-ghost btn-sm act-restore">' + t("undo_delete") + '</button>' +
          '<button class="btn btn-danger btn-sm act-force">' + li('trash', 14) + ' ' + t("force_delete") + '</button>';
      } else {
        actions = '<button class="btn btn-ghost btn-sm act-copy" title="' + t("copy") + '">' + li('file', 14) + ' ' + t("copy") + '</button>' +
          '<button class="btn btn-ghost btn-sm act-stats" title="' + t("stats") + '">' + li('chart', 14) + ' ' + t("stats") + '</button>' +
          '<button class="btn btn-ghost btn-sm act-edit" ' + (canAdvanced ? '' : 'style="opacity:0.4;pointer-events:none;"') + ' title="' + t("edit") + '">' + li('edit', 14) + ' ' + t("edit") + '</button>' +
          '<button class="btn btn-danger btn-sm act-del" title="' + t("del") + '">' + li('trash', 14) + ' ' + t("del") + '</button>';
      }
      var colCount = isAdmin ? 6 : 5;
      var actionRow = '<tr class="row-actions" data-code="' + code + '">' +
        '<td colspan="' + colCount + '"><div class="actions" style="display:flex;gap:6px;flex-wrap:wrap;padding:2px 0 10px;">' + actions + '</div></td>' +
        '</tr>';

      return mainRow + actionRow;
    }).join("");

    // Gán sự kiện — CHỈ gán cho hàng action (row-actions)
    tbody.querySelectorAll("tr.row-actions").forEach(function(tr){
      var code = tr.getAttribute("data-code");
      var link = displayLinks.filter(function(l){ return l.code === code; })[0];
      if (!link) return;
      var copyBtn = tr.querySelector(".act-copy");
      var statsBtn = tr.querySelector(".act-stats");
      var editBtn = tr.querySelector(".act-edit");
      var delBtn = tr.querySelector(".act-del");
      var restoreBtn = tr.querySelector(".act-restore");
      var forceBtn = tr.querySelector(".act-force");
      if (copyBtn) copyBtn.onclick = function(e){ e.stopPropagation(); copyText(link.shortUrl, this); };
      if (statsBtn) statsBtn.onclick = function(e){ e.stopPropagation(); navigate("analytics/" + encodeURIComponent(code)); render(); renderSidebars(); };
      if (editBtn) editBtn.onclick = function(e){ e.stopPropagation(); if (canAdvanced) openEditModal(link); };
      if (delBtn) delBtn.onclick = function(e){ e.stopPropagation(); e.preventDefault(); deleteLink(code); };
      if (restoreBtn) restoreBtn.onclick = function(e){ e.stopPropagation(); restoreLink(code); };
      if (forceBtn) forceBtn.onclick = function(e){ e.stopPropagation(); forceDeleteLink(code); };
    });
  }

  refreshLinkList = renderLinkRows;

  // ====== Render skeleton ngay lập tức (form/QR/bảng chỉ render 1 lần) ======
  app.innerHTML = guideCard("shorturls") +
    upgradeBanner() +
    '<div class="page-head"><h1>' + li('link', 24) + ' Short URLs</h1><div class="page-actions"><button class="btn btn-primary" onclick="navigate(&#39;home&#39;)">' + li('plus', 16) + ' ' + t("create_new") + '</button></div></div>' +
    '<div class="grid-stats" id="statsGrid"><div class="stat"><div class="num">...</div><div class="lbl">' + t("my_links") + '</div></div><div class="stat"><div class="num">...</div><div class="lbl">' + t("total_clicks") + '</div></div></div>' +
    tableHeadHtml() +
    dashToolsRowHtml();

  // ====== Tải data nền — chỉ cập nhật stats + tbody, không đè DOM ======
  Promise.all([api("/api/links"), api("/api/analytics/overview")]).then(function(res){
    state.links = res[0].links;
    var stats = res[1].stats;

    var statsGrid = document.getElementById("statsGrid");
    if (statsGrid){
      statsGrid.innerHTML =
        '<div class="stat"><div class="num">' + fmtNum(stats.userLinksCount) + '</div><div class="lbl">' + t("my_links") + '</div></div>' +
        '<div class="stat"><div class="num">' + fmtNum(stats.userTotalClicks) + '</div><div class="lbl">' + t("total_clicks") + '</div></div>' +
        (limits.dailyLinks ? '<div class="stat"><div class="num">' + limits.dailyLinks + '</div><div class="lbl">' + t("daily_limit") + '</div></div>' : '');
    }

    renderLinkRows();

    if (limits.hasDataExport){
      var btnExport = document.getElementById("btnExport");
      if (btnExport) btnExport.onclick = function(){ exportCsv(state.links); };
    }
  }).catch(function(err){
    app.innerHTML = '<div class="card"><div class="msg msg-error">' + esc(err.message) + '</div></div>';
  });
}

function exportCsv(links){
  var rows = [["code","short_url","url","title","campaign","total_clicks","is_enabled","created_at","expiry_date"]];
  links.forEach(function(l){
    rows.push([l.code, l.shortUrl, l.url, l.title || "", l.campaign || "", l.totalClicks || 0, l.isEnabled !== false, l.createdAt, l.expiryDate || ""]);
  });
  var csv = rows.map(function(r){
    return r.map(function(v){ var s = String(v).replace(/"/g,'""'); return '"' + s + '"'; }).join(",");
  }).join("\\n");
  var blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  var a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = "shurl-links.csv";
  document.body.appendChild(a); a.click(); document.body.removeChild(a);
}

function openEditModal(link){
  var overlay = document.createElement("div");
  overlay.className = "overlay";
  overlay.innerHTML =
    '<div class="modal"><h2>' + t("edit_title") + esc(link.code) + '</h2>' +
    '<label>' + t("edit_dest") + '</label><input type="url" id="e_url" value="' + esc(link.url) + '">' +
    '<label>' + t("title_field") + '</label><input type="text" id="e_title" value="' + esc(link.title || "") + '">' +
    '<label>' + t("campaign") + '</label><input type="text" id="e_campaign" value="' + esc(link.campaign || "") + '">' +
    '<label>' + t("tags") + ' (' + t("edit_tags_placeholder") + ')</label><input type="text" id="e_tags" value="' + esc((link.tags || []).join(", ")) + '">' +
    '<label>' + t("expiry_date") + '</label><input type="date" id="e_expiry" value="' + (link.expiryDate ? link.expiryDate.slice(0,10) : "") + '">' +
    '<label style="display:flex;align-items:center;gap:8px;margin-top:16px;"><input type="checkbox" id="e_enabled" style="width:auto;" ' + (link.isEnabled === false ? "" : "checked") + '> ' + t("edit_enabled") + '</label>' +
    '<div id="editMsg"></div>' +
    '<div class="actions" style="margin-top:20px;">' +
    '<button class="btn btn-primary" id="e_save">' + t("edit_save") + '</button>' +
    '<button class="btn btn-ghost" id="e_cancel">' + t("edit_cancel") + '</button>' +
    '</div></div>';
  document.body.appendChild(overlay);
  overlay.addEventListener("click", function(e){ if (e.target === overlay) document.body.removeChild(overlay); });
  document.getElementById("e_cancel").onclick = function(){ document.body.removeChild(overlay); };
  document.getElementById("e_save").onclick = function(){
    var msg = document.getElementById("editMsg");
    var tags = document.getElementById("e_tags").value.trim();
    var body = {
      url: document.getElementById("e_url").value.trim(),
      title: document.getElementById("e_title").value.trim(),
      campaign: document.getElementById("e_campaign").value.trim(),
      tags: tags ? tags.split(",").map(function(t2){ return t2.trim(); }).filter(Boolean) : [],
      isEnabled: document.getElementById("e_enabled").checked,
      expiryDate: document.getElementById("e_expiry").value || null
    };
    api("/api/links/" + encodeURIComponent(link.code), "PATCH", body).then(function(){
      document.body.removeChild(overlay);
      updateLinkList();
    }).catch(function(err){ msg.innerHTML = '<div class="msg msg-error">' + esc(err.message) + '</div>'; });
  };
}

// ---------- SCANNER QR (Quét & Kiểm tra QR) ----------
function renderScanner(app){
  app.innerHTML = guideCard("scanner") +
    '<div class="page-head"><h1>' + li('scan', 24) + ' ' + t("scanner_page_title") + helpLinkHtml('scanner-qr-la-gi-huong-dan-quet-va-kiem-tra-ma-qr', t("scanner_help_title")) + '</h1></div>' +
    '<div class="qr-workspace">' +
    '<div>' +
      '<div class="card">' +
        '<h3 style="margin-top:0;">' + li('scan', 16) + ' ' + t("scanner_mode_title") + '</h3>' +
        '<div style="display:flex;gap:10px;flex-wrap:wrap;">' +
          '<button type="button" class="btn btn-primary" id="scannerModeCameraBtn" style="flex:1;justify-content:center;min-width:160px;">' + li('camera', 14) + ' ' + t("scanner_mode_camera") + '</button>' +
          '<button type="button" class="btn btn-ghost" id="scannerModeFileBtn" style="flex:1;justify-content:center;min-width:160px;">' + li('upload', 14) + ' ' + t("scanner_mode_file") + '</button>' +
        '</div>' +
      '</div>' +
      '<div class="card" id="scannerCameraSection">' +
        '<h3 style="margin-top:0;">' + li('camera', 16) + ' ' + t("scanner_mode_camera") + '</h3>' +
        '<div class="qr-csv-drop" style="border-style:solid;background:rgba(56,189,248,0.08);border-color:rgba(56,189,248,0.3);color:var(--text);text-align:left;display:flex;gap:8px;align-items:center;">' + li('info', 14) + ' <span>' + t("scanner_camera_permission_hint") + '</span></div>' +
        '<div id="scannerCameraBox" style="margin-top:12px;border:1px solid var(--border);border-radius:12px;min-height:260px;display:flex;align-items:center;justify-content:center;overflow:hidden;background:var(--stat-bg);position:relative;">' +
          '<div id="scannerCameraPlaceholder" style="display:flex;flex-direction:column;align-items:center;gap:12px;padding:20px;">' +
            '<div style="opacity:0.35;">' + li('camera', 48) + '</div>' +
            '<button type="button" class="btn btn-primary" id="scannerCameraBtn">' + li('scan', 14) + ' ' + t("scanner_camera_start") + '</button>' +
          '</div>' +
          '<video id="scannerVideo" playsinline muted style="width:100%;display:none;"></video>' +
        '</div>' +
        '<div id="scannerCameraControls" style="display:none;gap:10px;justify-content:center;margin-top:10px;flex-wrap:wrap;">' +
          '<button type="button" class="btn btn-ghost btn-sm" id="scannerFlashBtn" style="display:none;">' + li('zap', 12) + ' ' + t("scanner_flash_on") + '</button>' +
          '<button type="button" class="btn btn-ghost btn-sm" id="scannerSwitchBtn">' + li('refresh_cw', 12) + ' ' + t("scanner_switch_camera") + '</button>' +
        '</div>' +
        '<p class="hint" id="scannerHint" style="text-align:center;display:none;margin-top:8px;">' + t("scanner_scanning_hint") + '</p>' +
        '<div id="scannerMsg"></div>' +
      '</div>' +
      '<div class="card" id="scannerFileSection" style="display:none;">' +
        '<h3 style="margin-top:0;">' + li('upload', 16) + ' ' + t("scanner_mode_file") + '</h3>' +
        '<label class="qr-csv-drop" style="cursor:pointer;display:block;padding:30px 14px;">' + li('upload', 20) + '<br><span style="margin-top:6px;display:inline-block;">' + t("scanner_file_dropzone") + '</span>' +
        '<input type="file" id="scannerFileInput" accept="image/*" style="display:none;"></label>' +
      '</div>' +
    '</div>' +
    '<div class="card qr-preview-card" id="scannerResultCard" style="text-align:left;">' +
      '<h3 style="margin-top:0;">' + li('scan', 16) + ' ' + t("scanner_result_title") + '</h3>' +
      '<div id="scannerResultBody">' + scannerEmptyResultHtml() + '</div>' +
    '</div>' +
    '</div>';

  var video = document.getElementById("scannerVideo");
  var cameraPlaceholder = document.getElementById("scannerCameraPlaceholder");
  var cameraControls = document.getElementById("scannerCameraControls");
  var flashBtn = document.getElementById("scannerFlashBtn");
  var switchBtn = document.getElementById("scannerSwitchBtn");
  var cameraBtn = document.getElementById("scannerCameraBtn");
  var fileInput = document.getElementById("scannerFileInput");
  var hint = document.getElementById("scannerHint");
  var msg = document.getElementById("scannerMsg");
  var resultBody = document.getElementById("scannerResultBody");
  var modeCameraBtn = document.getElementById("scannerModeCameraBtn");
  var modeFileBtn = document.getElementById("scannerModeFileBtn");
  var cameraSection = document.getElementById("scannerCameraSection");
  var fileSection = document.getElementById("scannerFileSection");
  var qrScannerInstance = null;
  var scanning = false;
  var facingMode = "environment";

  function setMode(mode){
    stopCamera();
    var isCamera = mode !== "file";
    cameraSection.style.display = isCamera ? "block" : "none";
    fileSection.style.display = isCamera ? "none" : "block";
    modeCameraBtn.className = "btn " + (isCamera ? "btn-primary" : "btn-ghost");
    modeFileBtn.className = "btn " + (isCamera ? "btn-ghost" : "btn-primary");
  }
  modeCameraBtn.onclick = function(){ setMode("camera"); };
  modeFileBtn.onclick = function(){ setMode("file"); };

  function stopCamera(){
    scanning = false;
    if (qrScannerInstance) { qrScannerInstance.destroy(); qrScannerInstance = null; }
    video.style.display = "none";
    cameraPlaceholder.style.display = "flex";
    cameraControls.style.display = "none";
    flashBtn.style.display = "none";
    hint.style.display = "none";
    cameraBtn.innerHTML = li('scan', 14) + ' ' + t("scanner_camera_start");
  }

  function startCamera(){
    if (typeof QrScanner === "undefined" || !navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      msg.innerHTML = '<div class="msg msg-error">' + t("scanner_no_camera") + '</div>';
      return;
    }
    video.style.display = "block";
    cameraPlaceholder.style.display = "none";
    qrScannerInstance = new QrScanner(video, function(result){
      stopCamera();
      handleDecoded(result.data);
    }, {
      highlightScanRegion: true,
      highlightCodeOutline: true,
      returnDetailedScanResult: true,
      preferredCamera: facingMode
    });
    qrScannerInstance.start().then(function(){
      hint.style.display = "block";
      cameraControls.style.display = "flex";
      msg.innerHTML = "";
      scanning = true;
      cameraBtn.innerHTML = li('scan', 14) + ' ' + t("scanner_camera_stop");
      qrScannerInstance.hasFlash().then(function(has){
        flashBtn.style.display = has ? "inline-flex" : "none";
      }).catch(function(){});
    }).catch(function(){
      msg.innerHTML = '<div class="msg msg-error">' + t("scanner_no_camera") + '</div>';
      stopCamera();
    });
  }

  cameraBtn.onclick = function(){ if (scanning) stopCamera(); else startCamera(); };

  flashBtn.onclick = function(){
    if (!qrScannerInstance) return;
    qrScannerInstance.toggleFlash().then(function(){
      flashBtn.innerHTML = li('zap', 12) + ' ' + (qrScannerInstance.isFlashOn() ? t("scanner_flash_off") : t("scanner_flash_on"));
    }).catch(function(){});
  };

  switchBtn.onclick = function(){
    if (!qrScannerInstance) return;
    facingMode = facingMode === "environment" ? "user" : "environment";
    qrScannerInstance.setCamera(facingMode).catch(function(){});
  };

  fileInput.addEventListener("change", function(){
    var file = fileInput.files && fileInput.files[0];
    if (!file) return;
    if (typeof QrScanner === "undefined") {
      resultBody.innerHTML = '<div class="msg msg-error">' + t("scanner_decode_fail") + '</div>' + scannerEmptyResultHtml();
      fileInput.value = "";
      return;
    }
    QrScanner.scanImage(file, { returnDetailedScanResult: true }).then(function(result){
      handleDecoded(result.data);
    }).catch(function(){
      resultBody.innerHTML = '<div class="msg msg-error">' + t("scanner_decode_fail") + '</div>' + scannerEmptyResultHtml();
    }).then(function(){
      fileInput.value = "";
    });
  });

  function handleDecoded(text){
    resultBody.innerHTML = '<p class="hint">' + t("processing") + '</p>';
    fetch("/api/inspect?data=" + encodeURIComponent(text)).then(function(r){ return r.json(); }).then(function(info){
      resultBody.innerHTML = scannerResultHtml(text, info);
      var again = document.getElementById("scannerAgainBtn");
      if (again) again.onclick = function(){ resultBody.innerHTML = scannerEmptyResultHtml(); };
    }).catch(function(){
      resultBody.innerHTML = '<div class="msg msg-error">' + t("scanner_decode_fail") + '</div>';
    });
  }
}

function scannerEmptyResultHtml(){
  return '<div style="text-align:center;padding:40px 10px;color:var(--muted);">' +
    '<div style="opacity:0.3;margin-bottom:10px;display:flex;justify-content:center;">' + li('scan', 40) + '</div>' +
    '<div style="font-weight:600;color:var(--text);margin-bottom:4px;">' + t("scanner_result_empty_title") + '</div>' +
    '<div style="font-size:13px;">' + t("scanner_result_empty_desc") + '</div>' +
    '</div>';
}

function scannerResultHtml(raw, info){
  var html = '<div style="font-size:12px;color:var(--muted);margin-bottom:4px;">' + t("scanner_result_raw") + '</div>';
  html += '<div style="font-size:14px;font-weight:600;word-break:break-all;margin-bottom:12px;">' + esc(raw) + '</div>';

  if (info.type === "shurl_link") {
    html += '<div class="msg msg-ok">' + t("scanner_shurl_link_title") + '</div>';
    html += '<div style="font-size:13px;line-height:1.8;">';
    html += '<b>' + t("scanner_shurl_link_dest") + ':</b> ' + esc(info.destination) + '<br>';
    html += (info.isDynamic ? t("scanner_shurl_link_type_dynamic") : t("scanner_shurl_link_type_static")) + '<br>';
    if (!info.isEnabled) html += '<span style="color:var(--red);">' + t("scanner_shurl_link_disabled") + '</span><br>';
    if (info.isExpired) html += '<span style="color:var(--red);">' + t("scanner_shurl_link_expired") + '</span><br>';
    if (info.hasPassword) html += t("scanner_shurl_link_password") + '<br>';
    html += '</div>';
  } else if (info.type === "url") {
    var unsafe = info.isPaymentLike || info.isBlacklisted;
    html += '<div class="msg ' + (unsafe ? 'msg-error' : 'msg-ok') + '">' + (unsafe ? t("scanner_safety_warning") : t("scanner_safety_ok")) + '</div>';
    html += '<div style="font-size:13px;"><b>' + t("scanner_result_domain") + ':</b> ' + esc(info.hostname) + '</div>';
  }

  html += '<div style="margin-top:14px;"><button type="button" class="btn btn-ghost btn-sm" id="scannerAgainBtn">' + t("scanner_scan_again") + '</button></div>';
  return html;
}

// ---------- BULK ----------
function renderBulk(app){
  var limits = state.limits || {};
  if (!limits.hasBulkShorten){
    app.innerHTML = upgradeBanner("bulkqr") + lockedFeatureCard('<h1>' + t("bulk_title") + '</h1>');
    return;
  }
  app.innerHTML = upgradeBanner("bulkqr") +
    '<div class="card"><h1>' + t("bulk_title") + helpLinkHtml('rut-gon-link-hang-loat', 'Rút gọn link hàng loạt là gì? Xem hướng dẫn sử dụng') + '</h1>' +
    '<p class="sub">' + t("bulk_sub") + ' ' + limits.maxBulkBatch + ' ' + t("bulk_per_batch") + '</p>' +
    '<p class="hint">' + t("bulk_csv_hint") + '</p>' +
    '<textarea id="bulkInput" placeholder="' + t("bulk_input_placeholder") + '"></textarea>' +
    '<div id="bulkMsg"></div>' +
    '<div style="margin-top:16px;"><button class="btn btn-primary" id="bulkSubmit">' + t("bulk_submit") + '</button></div>' +
    '<div id="bulkResult"></div>' +
    '</div>';
  document.getElementById("bulkSubmit").onclick = function(){
    var submitBtn = document.getElementById("bulkSubmit");
    if (submitBtn.disabled) return;
    var lines = document.getElementById("bulkInput").value.split("\\n").map(function(l){ return l.trim(); }).filter(Boolean);
    var msg = document.getElementById("bulkMsg");
    if (lines.length === 0){ msg.innerHTML = '<div class="msg msg-error">' + t("bulk_empty") + '</div>'; return; }
    submitBtn.disabled = true; submitBtn.style.opacity = "0.6";
    var urls = lines.map(function(line){
      var parts = line.split(",").map(function(p){ return p.trim(); });
      var item = { url: parts[0] };
      if (parts[1]) item.customCode = parts[1];
      if (parts[2]) item.campaign = parts[2];
      return item;
    });
    msg.innerHTML = '<p class="hint">' + t("processing") + ' ' + urls.length + '...</p>';
    api("/api/links/bulk", "POST", { urls: urls }).then(function(data){
      msg.innerHTML = '<div class="msg msg-ok">' + t("bulk_success") + ': ' + data.createdCount + ' · ' + t("bulk_errors") + ': ' + data.errorCount + '</div>';
      var result = document.getElementById("bulkResult");
      var rows = data.created.map(function(l){
        return '<tr><td class="mono">' + esc(l.shortUrl) + '</td><td style="max-width:260px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">' + esc(l.url) + '</td></tr>';
      }).join("");
      var errRows = data.errors.map(function(e){
        return '<tr><td style="color:var(--red);">' + t("bulk_errors") + '</td><td>' + esc(e.url) + ' — ' + esc(e.error) + '</td></tr>';
      }).join("");
      result.innerHTML = '<div style="overflow-x:auto;margin-top:14px;"><table><thead><tr><th>Link rút gọn</th><th>URL gốc</th></tr></thead><tbody>' + rows + errRows + '</tbody></table></div>' +
        '<div style="margin-top:14px;"><button class="btn btn-ghost" id="bulkExportXls">' + t("bulkqr_download") + '</button></div>';

      // Export Excel
      document.getElementById("bulkExportXls").onclick = function(){
        var xlsRows = data.created.map(function(l){
          return '<tr><td style="mso-number-format:\@">' + esc(l.shortUrl) + '</td><td>' + esc(l.url) + '</td></tr>';
        });
        var xls = '<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40">' +
          '<head><meta charset="utf-8"></head><body><table border="1"><thead><tr><th>Link rút gọn</th><th>URL gốc</th></tr></thead><tbody>' + xlsRows.join("") + '</tbody></table></body></html>';
        var blob = new Blob(['﻿' + xls], { type: "application/vnd.ms-excel;charset=utf-8" });
        var a = document.createElement("a");
        a.href = URL.createObjectURL(blob);
        a.download = "bulk_links_" + new Date().toISOString().slice(0,10) + ".xls";
        document.body.appendChild(a); a.click(); document.body.removeChild(a);
      };
    }).catch(function(err){ msg.innerHTML = '<div class="msg msg-error">' + esc(err.message) + '</div>'; }).then(function(){
      submitBtn.disabled = false; submitBtn.style.opacity = "1";
    });
  };
}

// ---------- PAGINATION (shared helper) ----------
function pagerButtonsHtml(current, total){
  if (total <= 1) return '';
  var windowSize = 5;
  var start = Math.max(1, current - Math.floor(windowSize / 2));
  var end = Math.min(total, start + windowSize - 1);
  start = Math.max(1, end - windowSize + 1);
  var html = '<button type="button" class="pager-btn" data-page="' + (current - 1) + '"' + (current <= 1 ? ' disabled' : '') + '>‹</button>';
  if (start > 1) {
    html += '<button type="button" class="pager-btn" data-page="1">1</button>';
    if (start > 2) html += '<span class="pager-ellipsis">…</span>';
  }
  for (var p = start; p <= end; p++) {
    html += '<button type="button" class="pager-btn' + (p === current ? ' active' : '') + '" data-page="' + p + '">' + p + '</button>';
  }
  if (end < total) {
    if (end < total - 1) html += '<span class="pager-ellipsis">…</span>';
    html += '<button type="button" class="pager-btn" data-page="' + total + '">' + total + '</button>';
  }
  html += '<button type="button" class="pager-btn" data-page="' + (current + 1) + '"' + (current >= total ? ' disabled' : '') + '>›</button>';
  return '<div class="pager">' + html + '</div>';
}
function bindPagerClicks(container, onPageChange){
  if (!container) return;
  container.querySelectorAll(".pager-btn:not([disabled])").forEach(function(btn){
    btn.addEventListener("click", function(){ onPageChange(parseInt(btn.getAttribute("data-page"), 10)); });
  });
}

// ---------- ANALYTICS ----------
function bars(items, labelKey, valueKey, max){
  var top = items.slice(0, max || 12);
  var maxVal = 0;
  top.forEach(function(it){ if (it[valueKey] > maxVal) maxVal = it[valueKey]; });
  if (maxVal === 0) return '<p class="hint">' + t("no_data") + '</p>';
  return top.map(function(it){
    var pct = Math.round((it[valueKey] / maxVal) * 100);
    return '<div class="barrow"><div class="lbl" title="' + esc(it[labelKey]) + '">' + esc(String(it[labelKey]).slice(0,10)) + '</div>' +
      '<div class="track"><div class="fill" style="width:' + pct + '%;"></div></div>' +
      '<div class="cnt">' + fmtNum(it[valueKey]) + '</div></div>';
  }).join("");
}
// ---------- LINK-IN-BIO ----------
var bioRowCount = 0;
function bioSubLinkRowHtml(title, url){
  var idx = bioRowCount++;
  return '<div class="bio-row" data-idx="' + idx + '" style="display:flex;gap:8px;margin-bottom:8px;align-items:center;">' +
    '<input type="text" class="bio-row-title" placeholder="' + esc(t("bio_row_title_ph")) + '" value="' + esc(title || "") + '" style="flex:1;">' +
    '<input type="url" class="bio-row-url" placeholder="https://..." value="' + esc(url || "") + '" style="flex:2;">' +
    '<button type="button" class="btn btn-ghost btn-sm" onclick="this.parentElement.remove()">' + li('x', 14) + '</button>' +
    '</div>';
}
function renderLinkInBio(app){
  var limits = state.limits || {};
  if (!limits.maxBioPages) {
    app.innerHTML = lockedFeatureCard('<h1>' + li('user', 24) + ' Link-in-bio</h1>') +
      '<div class="card"><p class="hint">' + t("bio_locked_desc") + '</p></div>';
    return;
  }

  bioRowCount = 0;
  var html = '<div class="page-head"><h1>' + li('user', 24) + ' Link-in-bio' + helpLinkHtml('link-in-bio-la-gi-huong-dan-tao-trang-nhieu-link', t("bio_help_title")) + '</h1></div>' +
    '<div class="card">' +
    '<h2>' + t("bio_create_title") + '</h2>' +
    '<p class="hint">' + t("bio_create_hint") + '</p>' +
    '<label>' + t("bio_display_name") + '</label>' +
    '<input type="text" id="bioDisplayName" placeholder="' + t("bio_display_ph") + '" maxlength="60">' +
    '<label>' + t("bio_desc_label") + '</label>' +
    '<textarea id="bioBio" rows="2" maxlength="200" style="width:100%;padding:10px;border:1px solid var(--input-border);border-radius:8px;background:var(--input-bg);color:var(--text);resize:vertical;"></textarea>' +
    '<label style="margin-top:10px;display:block;">' + t("bio_links_label") + '</label>' +
    '<div id="bioRows">' + bioSubLinkRowHtml("", "") + bioSubLinkRowHtml("", "") + '</div>' +
    '<button type="button" class="btn btn-ghost btn-sm" id="bioAddRowBtn">' + li('plus', 12) + ' ' + t("bio_add_link") + '</button>' +
    '<div style="margin-top:14px;">' +
    '<label>' + t("bio_code_label") + '</label>' +
    '<input type="text" id="bioCustomCode" placeholder="' + t("bio_code_ph") + '">' +
    '</div>' +
    '<div id="bioCreateMsg" style="margin-top:8px;"></div>' +
    '<button class="btn btn-primary" id="bioCreateBtn" style="margin-top:8px;">' + li('save', 12) + ' ' + t("bio_create_btn") + '</button>' +
    '</div>' +
    '<div class="card" id="bioListCard">' +
    '<h2>' + li('user', 14) + ' ' + t("bio_list_title") + '</h2>' +
    '<div id="bioListBody"><p class="hint">' + t("processing") + '</p></div>' +
    '</div>';
  app.innerHTML = html;

  document.getElementById("bioAddRowBtn").onclick = function(){
    document.getElementById("bioRows").insertAdjacentHTML("beforeend", bioSubLinkRowHtml("", ""));
  };

  document.getElementById("bioCreateBtn").onclick = function(){
    var btn = this;
    var msg = document.getElementById("bioCreateMsg");
    var displayName = document.getElementById("bioDisplayName").value.trim();
    var bio = document.getElementById("bioBio").value.trim();
    var customCode = document.getElementById("bioCustomCode").value.trim();
    var rows = document.querySelectorAll("#bioRows .bio-row");
    var links = [];
    rows.forEach(function(row){
      var title = row.querySelector(".bio-row-title").value.trim();
      var url = row.querySelector(".bio-row-url").value.trim();
      if (title && url) links.push({ title: title, url: url });
    });
    if (!displayName) { msg.innerHTML = '<div class="msg msg-error">' + t("bio_err_name") + '</div>'; return; }
    if (links.length === 0) { msg.innerHTML = '<div class="msg msg-error">' + t("bio_err_links") + '</div>'; return; }
    btn.disabled = true;
    msg.innerHTML = '<p class="hint">' + t("bio_creating") + '</p>';
    api("/api/links/bio", "POST", { displayName: displayName, bio: bio, links: links, customCode: customCode || undefined }).then(function(data){
      msg.innerHTML = '<div class="msg msg-ok">' + t("bio_created") + ' ' + esc(data.bioPage.shortUrl) + '</div>';
      document.getElementById("bioDisplayName").value = "";
      document.getElementById("bioBio").value = "";
      document.getElementById("bioCustomCode").value = "";
      document.getElementById("bioRows").innerHTML = bioSubLinkRowHtml("", "") + bioSubLinkRowHtml("", "");
      // KV list() is eventually consistent — a GET right after this write can still miss it,
      // so update the client-side list directly from the create response instead of re-fetching
      // (same reasoning as qrDynItems for the Dynamic QR list).
      bioPageItems.unshift(data.bioPage);
      bioRenderList();
    }).catch(function(err){
      msg.innerHTML = '<div class="msg msg-error">' + esc(err.message) + '</div>';
    }).then(function(){ btn.disabled = false; });
  };

  bioLoadList();
}

var bioPageItems = [];
function bioLoadList(){
  var body = document.getElementById("bioListBody");
  if (!body) return;
  api("/api/links").then(function(data){
    bioPageItems = (data.links || []).filter(function(l){ return l.type === "bio" && !l.isDeleted; });
    bioRenderList();
  }).catch(function(err){
    body.innerHTML = '<div class="msg msg-error">' + esc(err.message) + '</div>';
  });
}

function bioRenderList(){
  var body = document.getElementById("bioListBody");
  if (!body) return;
  if (bioPageItems.length === 0) { body.innerHTML = '<p class="hint">' + t("bio_empty") + '</p>'; return; }
  body.innerHTML = bioPageItems.map(function(p){
    var subRows = (p.bioLinks || []).map(function(sl){
      return '<div style="display:flex;justify-content:space-between;font-size:12px;color:var(--muted);padding:2px 0;">' +
        '<span>' + esc(sl.title) + '</span><span>' + fmtNum(sl.clicks || 0) + ' ' + t("bio_clicks") + '</span></div>';
    }).join("");
    return '<div class="card" style="margin-top:10px;">' +
      '<div style="display:flex;justify-content:space-between;align-items:center;">' +
      '<strong>' + esc(p.title) + '</strong>' +
      '<span class="hint">' + fmtNum(p.totalClicks || 0) + ' ' + t("bio_views") + '</span>' +
      '</div>' +
      '<div class="mono" style="margin:6px 0;"><a href="' + esc(p.shortUrl) + '" target="_blank">' + esc(p.shortUrl) + '</a></div>' +
      subRows +
      '</div>';
  }).join("");
}

// Nạp thư viện qr-code-styling (~15KB) chỉ khi vào trang QR — trước đây nạp cứng trong <head>
// nên mọi trang (kể cả trang chủ) đều tải thư viện này dù không dùng tới. Idempotent: gọi nhiều
// lần chỉ tạo 1 request. new QRCodeStyling(...) ở qrWsBuildStyling() đã có try/catch bao ngoài
// nên nếu thư viện chưa kịp tải xong (hiếm, chỉ khi user gõ cực nhanh ngay sau khi vào trang)
// sẽ hiện thông báo lỗi xem trước thay vì crash — không cần chặn render đồng bộ của trang.
var _qrStylingLoadPromise = null;
function loadQrStylingScript(){
  if (window.QRCodeStyling) return Promise.resolve();
  if (_qrStylingLoadPromise) return _qrStylingLoadPromise;
  _qrStylingLoadPromise = new Promise(function(resolve, reject){
    var s = document.createElement("script");
    s.src = "https://cdn.jsdelivr.net/npm/qr-code-styling@1.9.2/lib/qr-code-styling.js";
    s.onload = function(){ resolve(); };
    s.onerror = function(){ _qrStylingLoadPromise = null; reject(new Error("qr-code-styling failed to load")); };
    document.head.appendChild(s);
  });
  return _qrStylingLoadPromise;
}

function renderBulkQR(app){
  loadQrStylingScript();
  var limits = state.limits || {};
  var maxBatch = limits.maxBulkQrBatch || 0;
  var canUse = !!limits.hasBulkQr;
  var dynLimit = limits.maxDynamicQrPerMonth || 0;
  var dynAllowed = dynLimit > 0;
  var logoAllowed = !!state.user;

  var qrLogoFieldHtml = logoAllowed ? (
    '<div class="qr-logo-upload-wrap">' +
    '<input type="file" id="qrWsLogoFile" accept="image/png,image/jpeg" style="display:none;">' +
    '<button type="button" class="btn btn-ghost btn-sm" id="qrWsLogoUploadBtn">' + li('upload', 12) + ' ' + t("qr_logo_upload_btn") + '</button>' +
    '<img id="qrWsLogoPreview" style="display:none;" alt="logo">' +
    '<button type="button" class="btn btn-ghost btn-sm" id="qrWsLogoRemoveBtn" style="display:none;">' + li('x', 12) + '</button>' +
    '</div>' +
    '<div id="qrWsLogoMsg" class="hint" style="font-size:11px;"></div>'
  ) : (
    '<div class="qr-logo-locked" onclick="navRegister()" title="' + t("qr_logo_locked_hint") + '">' +
    '<div class="qr-logo-locked-lock">' + li('lock_icon', 14) + '</div>' +
    '<span>' + t("qr_logo_upload_btn") + '</span>' +
    '</div>' +
    '<div class="hint" style="font-size:11px;">' + t("qr_logo_locked_hint") + '</div>'
  );

  var dynTeaserCta = !state.user
    ? '<button type="button" class="btn btn-primary btn-sm" style="width:100%;" onclick="navRegister()">' + t("qr_dyn_teaser_cta_guest") + '</button>'
    : '<a class="btn btn-primary btn-sm" style="width:100%;justify-content:center;" href="#/pricing">' + t("qr_dyn_teaser_cta_upgrade") + '</a>';
  var dynPanelInnerHtml = dynAllowed ? (
    '<label>' + t("qr_dynamic_title_label") + '</label>' +
    '<input type="text" id="qrWsDynamicTitle" class="qr-existing-select" placeholder="' + t("qr_dynamic_title_placeholder") + '">' +
    '<div class="qr-quota-bar-wrap" id="qrDynQuotaBar"></div>' +
    '<button type="button" class="btn btn-primary btn-sm" id="qrWsDynamicSaveBtn" style="width:100%;margin-top:8px;" onclick="qrWsSaveDynamic()">' + li('save', 12) + ' ' + t("qr_dynamic_save_btn") + '</button>' +
    '<div id="qrWsDynamicMsg" style="margin-top:8px;"></div>' +
    '<div class="qr-dyn-terms-badge" onclick="qrDynShowTermsModal(null)">' + li('shield', 14) + ' ' + t("qr_dyn_terms_badge") + '</div>'
  ) : (
    '<div class="qr-dyn-teaser">' +
    '<div class="qr-dyn-teaser-lock">' + li('lock_icon', 20) + '</div>' +
    '<h4>' + t("qr_dyn_teaser_title") + '</h4>' +
    '<ul>' +
    '<li>' + li('check', 12) + ' ' + t("qr_dyn_teaser_feat1") + '</li>' +
    '<li>' + li('check', 12) + ' ' + t("qr_dyn_teaser_feat2") + '</li>' +
    '</ul>' +
    dynTeaserCta +
    '</div>'
  );

  var qrWorkspaceHtml = (
    '<div class="card">' +
    '<h2>' + t("qr_title") + helpLinkHtml('tao-ma-qr-mien-phi-doi-mau', 'Tạo mã QR miễn phí — Xem hướng dẫn sử dụng') + '</h2>' +
    '<p class="hint" style="margin-top:-6px;">' + t("qr_workspace_sub") + '</p>' +
    '<div class="qr-workspace">' +
    '<div>' +

    '<div class="qr-step-label">' + t("qr_step_type") + '</div>' +
    '<div class="qr-mode-toggle">' +
    '<button type="button" class="qr-mode-btn active" data-qrmode="static">' + t("qr_mode_static") + '<small>' + t("qr_mode_static_hint") + '</small></button>' +
    '<div class="qr-mode-btn-wrap">' +
    '<button type="button" class="qr-mode-btn" data-qrmode="dynamic">' + t("qr_mode_dynamic") + '<small>' + t("qr_mode_dynamic_hint") + '</small></button>' +
    '<a class="qr-help-link" href="/blog/qr-dong-la-gi-huong-dan-su-dung" target="_blank" rel="noopener" title="' + t("qr_dyn_help_title") + '">' + li('help_circle', 16) + '</a>' +
    '</div>' +
    '</div>' +
    '<div class="qr-type-toggle" id="qrWsTypeToggle">' +
    '<button type="button" class="qr-type-btn active" data-qrtype="url">' + li('link', 14) + ' ' + t("qr_type_url") + '</button>' +
    '<button type="button" class="qr-type-btn" data-qrtype="text">' + li('file', 14) + ' ' + t("qr_type_text") + '</button>' +
    '<button type="button" class="qr-type-btn" data-qrtype="vietqr">' + li('card', 14) + ' ' + qrT("t_vietqr") + '</button>' +
    '<button type="button" class="qr-type-btn" data-qrtype="zalo">' + li('message', 14) + ' ' + qrT("t_zalo") + '</button>' +
    '<button type="button" class="qr-type-btn" data-qrtype="wifi">' + li('globe', 14) + ' ' + qrT("t_wifi") + '</button>' +
    '<button type="button" class="qr-type-btn" data-qrtype="vcard">' + li('user', 14) + ' ' + qrT("t_vcard") + '</button>' +
    '</div>' +

    '<div class="qr-step-label">' + t("qr_step_input") + '</div>' +
    '<div id="qrWsUrlWrap">' +
    '<input type="url" id="qrWsUrl" class="qr-existing-select" style="margin-top:0;" placeholder="https://shurl.com/abc hoặc https://...">' +
    '<select id="qrWsExistingSelect" class="qr-existing-select"><option value="">' + t("qr_use_existing_placeholder") + '</option></select>' +
    '<div class="hint" style="margin-top:4px;font-size:12px;">' + t("qr_use_existing") + '</div>' +
    '<div style="margin-top:8px;">' +
    '<button type="button" class="btn btn-ghost btn-sm" id="qrWsCreateShortBtn">' + li('link', 12) + ' ' + t("qr_create_shorturl_btn") + '</button>' +
    '<span id="qrWsShortUrlResult" class="hint" style="margin-left:8px;font-size:12px;"></span>' +
    '</div>' +
    '</div>' +
    '<div id="qrWsTextWrap" style="display:none;">' +
    '<label>' + t("qr_text_label") + '</label>' +
    '<textarea id="qrWsText" rows="3" class="qr-existing-select" style="resize:vertical;font-family:inherit;"></textarea>' +
    '</div>' +
    '<div id="qrWsTypeForms">' + qrTypesFormsHtml() + '</div>' +

    '<div class="qr-collapsible-toggle" id="qrWsUtmToggle">' + li('plus', 12) + ' ' + t("utm_builder_toggle") + helpLinkHtml('utm-tracking-la-gi-ket-hop-rut-gon-link', 'UTM Tracking là gì? Xem hướng dẫn sử dụng') + '</div>' +
    '<div id="utmFields" style="display:none;">' +
    '<p class="hint">' + t("utm_builder_hint") + '</p>' +
    '<div class="qr-utm-grid">' +
    '<div><label>' + t("utm_source") + '</label><input type="text" id="u_source" placeholder="facebook"></div>' +
    '<div><label>' + t("utm_medium") + '</label><input type="text" id="u_medium" placeholder="social"></div>' +
    '<div><label>' + t("utm_term") + '</label><input type="text" id="u_term" placeholder="' + t("optional") + '"></div>' +
    '<div><label>' + t("utm_content") + '</label><input type="text" id="u_content" placeholder="' + t("optional") + '"></div>' +
    '<div><label>' + t("campaign") + '</label><input type="text" id="qrWsCampaign" placeholder="' + t("optional") + '"></div>' +
    '</div>' +
    '<button type="button" class="btn btn-ghost btn-sm" id="qrWsApplyUtmBtn" style="margin-top:8px;">' + t("utm_builder_title") + '</button>' +
    '</div>' +

    '<div id="qrWsDesignWrap">' + qrDesignPanelHtml() + '</div>' +

    '<div class="qr-step-label">' + t("qr_step_customize") + '</div>' +
    '<div class="qr-color-row">' +
    '<div class="qr-color-field"><label>' + t("qr_color") + '</label>' +
    '<div class="qr-color-input-wrap"><input type="color" id="qrWsColor" value="#000000"><input type="text" id="qrWsColorHex" value="#000000"></div></div>' +
    '<div class="qr-color-field"><label>' + t("qr_bgcolor") + '</label>' +
    '<div class="qr-color-input-wrap"><input type="color" id="qrWsBgColor" value="#ffffff" disabled><input type="text" id="qrWsBgColorHex" value="#ffffff" disabled></div>' +
    '<label style="font-weight:400;font-size:12px;display:flex;align-items:center;gap:4px;margin-top:6px;"><input type="checkbox" id="qrWsBgTransparent" checked> ' + t("qr_bg_transparent") + '</label>' +
    '</div>' +
    '</div>' +
    '<div class="qr-presets" id="qrWsPresets"></div>' +
    '<div class="qr-contrast-warn" id="qrWsContrastWarn">' + li('alert', 12) + ' ' + t("qr_contrast_warning") + '</div>' +

    '<div class="qr-color-row" style="margin-top:14px;">' +
    '<div class="qr-color-field">' +
    '<label>' + t("qr_logo_label") + '</label>' +
    qrLogoFieldHtml +
    '</div>' +
    '<div class="qr-color-field">' +
    '<label>' + t("qr_dot_style_label") + '</label>' +
    '<div class="qr-dotstyle-row" id="qrWsDotStyleRow">' +
    '<button type="button" class="qr-size-btn active" data-dotstyle="square">' + t("qr_dot_style_square") + '</button>' +
    '<button type="button" class="qr-size-btn" data-dotstyle="rounded">' + t("qr_dot_style_rounded") + '</button>' +
    '<button type="button" class="qr-size-btn" data-dotstyle="dots">' + t("qr_dot_style_dots") + '</button>' +
    '</div>' +
    '</div>' +
    '</div>' +

    '<div class="qr-step-label">' + t("qr_size") + '</div>' +
    '<div class="qr-size-row" id="qrWsSizeRow">' +
    ['150', '200', '300', '400'].map(function(sz){
      return '<button type="button" class="qr-size-btn' + (sz === '200' ? ' active' : '') + '" data-size="' + sz + '">' + sz + 'px</button>';
    }).join('') +
    '</div>' +
    '<input type="hidden" id="qrWsSize" value="200">' +

    '<div class="qr-step-label">' + t("qr_margin") + '</div>' +
    '<select id="qrWsMargin" class="qr-existing-select">' +
    '<option value="">' + t("qr_margin_default") + '</option><option value="0">0</option><option value="2">2</option><option value="4">4</option><option value="8">8</option>' +
    '</select>' +

    '</div>' +

    '<div class="card qr-preview-card qr-nm-card">' +
    '<div class="qr-preview-well" data-label="' + t("qr_preview_heading") + '">' +
    '<div class="qr-preview-box" id="qrWsPreviewBox"><div class="qr-preview-empty">' + t("qr_preview_empty") + '</div></div>' +
    '</div>' +
    '<div class="qr-preview-data" id="qrWsPreviewData"></div>' +
    '<div class="qr-download-row">' +
    '<button class="btn btn-primary btn-sm" id="qrWsDlPngBtn" disabled>' + li('download', 12) + ' ' + t("qr_download") + '</button>' +
    '<button class="btn btn-ghost btn-sm" id="qrWsDlSvgBtn" disabled>' + t("qr_download_svg") + '</button>' +
    '<button class="btn btn-ghost btn-sm" id="qrWsCopyBtn" disabled>' + t("qr_copy_link") + '</button>' +
    '</div>' +
    '<div id="qrWsPrintCheck" style="display:none;text-align:left;margin-top:14px;">' +
    '<div style="font-size:12px;color:var(--muted);margin-bottom:6px;">' + t("qr_print_check_title") + '</div>' +
    '<div id="qrWsPrintCheckMsg"></div>' +
    '<p class="hint" style="margin-top:6px;">' + t("qr_print_check_size_hint") + '</p>' +
    '</div>' +
    '<div class="qr-dynamic-panel" id="qrWsDynamicPanel" style="display:none;text-align:left;">' +
    dynPanelInnerHtml +
    '</div>' +
    '</div>' +

    '</div>' +
    '</div>');

  var qrCreatedListHtml = dynLimit > 0 ? (
    '<div class="card" id="qrCreatedListCard">' +
    '<h2>' + li('qr', 14) + ' ' + t("qr_created_list_title") + '</h2>' +
    '<div id="qrCreatedListBody"><p class="hint">' + t("processing") + '</p></div>' +
    '</div>'
  ) : '';

  var html = guideCard("bulkqr") + '<div class="page-head"><h1>' + li('qr', 24) + ' QR Codes</h1></div>' +
    qrWorkspaceHtml +
    qrCreatedListHtml +
    '<div class="card">' +
    '<h2>' + li('smartphone', 14) + ' ' + t("bulkqr_title") + helpLinkHtml('tao-qr-hang-loat-huong-dan-su-dung-bulk-qr', 'Tạo QR hàng loạt là gì? Xem hướng dẫn sử dụng') + '</h2>' +
    (canUse ? '' : '<p class="hint">' + li('lock_icon', 12) + ' ' + t("bulkqr_super") + '</p>') +
    '<p class="hint">' + t("bulkqr_hint") + '</p>' +
    '<div style="margin:12px 0;">' +
    '<label>Màu QR</label><input type="color" id="bqrColor" value="#000000" style="width:60px;height:32px;border:1px solid var(--input-border);border-radius:6px;cursor:pointer;background:none;display:block;margin-top:4px;">' +
    '</div>' +
    '<label>' + tf("bulkqr_max", { max: maxBatch }) + '</label>' +
    '<textarea id="bqrInput" rows="8" placeholder="' + (canUse ? "shurl.com/abc\\nshurl.com/def" : t("bulkqr_super")) + '" style="width:100%;padding:12px;border:1px solid var(--input-border);border-radius:10px;background:var(--input-bg);color:var(--text);font-size:14px;font-family:monospace;resize:vertical;outline:none;" ' + (canUse ? "" : "disabled") + '></textarea>' +
    (canUse ? '<div class="qr-csv-drop"><label style="cursor:pointer;">' + li('upload', 12) + ' ' + t("qr_csv_label") + '<input type="file" id="qrWsCsvFile" accept=".csv,text/csv" style="display:none;"></label><div id="qrWsCsvDetected" style="margin-top:6px;"></div></div>' : '') +
    '<div style="display:flex;gap:10px;margin-top:12px;flex-wrap:wrap;">' +
    '<button class="btn btn-primary" id="bqrBtn" ' + (canUse ? "" : "disabled") + ' onclick="generateBulkQR()">' + li('image', 12) + ' ' + t("bulkqr_generate") + '</button>' +
    '<button class="btn btn-ghost" id="bqrDlBtn" disabled style="opacity:0.5;" onclick="downloadBulkQR()">' + t("bulkqr_download") + '</button>' +
    '</div>' +
    '<div id="bqrMsg"></div>' +
    '</div>' +
    '<div id="bqrPreview" style="display:none;" class="card"></div>';

  app.innerHTML = html;

  qrWsBindWorkspace();
  if (dynLimit > 0) qrDynLoadList();
}

var qrWsPresetList = [
  { fg: "#000000", bg: "#ffffff" },
  { fg: "#1e293b", bg: "#f8fafc" },
  { fg: "#6366f1", bg: "#ffffff" },
  { fg: "#ffffff", bg: "#000000" },
  { fg: "#065f46", bg: "#ecfdf5" }
];

${QR_TYPES_CLIENT_SRC}

${QR_DESIGN_CLIENT_SRC}

var qrWsType = "url";
function qrWsGetType(){
  return qrWsType;
}

function qrWsGetData(){
  var type = qrWsGetType();
  if (qrTypeIsSpecial(type)) return qrTypeBuildData(type);
  if (type === "text") {
    var textEl = document.getElementById("qrWsText");
    return textEl ? textEl.value : "";
  }
  var urlEl = document.getElementById("qrWsUrl");
  return urlEl ? urlEl.value.trim() : "";
}

function qrWsIsValid(data){
  if (!data) return false;
  if (qrWsGetType() === "url") {
    try { new URL(data); return true; } catch (e) { return false; }
  }
  return true;
}

// QR rendering runs entirely client-side via the qr-code-styling library (loaded
// in <head>) so we can support a center logo and dot/corner style variants —
// api.qrserver.com (still used by Bulk QR) has no way to do either of those.
var qrWsDotStyle = "square";
var qrWsLogoDataUrl = null;
var qrWsCurrentQr = null;

function qrWsCornerStyles(dotStyle){
  if (dotStyle === "rounded") return { square: "extra-rounded", dot: "dot" };
  if (dotStyle === "dots") return { square: "dot", dot: "dot" };
  return { square: "square", dot: "square" };
}

function qrWsReadFormOptions(){
  var colorEl = document.getElementById("qrWsColor");
  var bgEl = document.getElementById("qrWsBgColor");
  var transEl = document.getElementById("qrWsBgTransparent");
  var sizeEl = document.getElementById("qrWsSize");
  var marginEl = document.getElementById("qrWsMargin");
  var transparent = transEl ? transEl.checked : true;
  return {
    color: colorEl ? colorEl.value : "#000000",
    bg: transparent ? null : (bgEl ? bgEl.value : "#ffffff"),
    size: parseInt(sizeEl ? sizeEl.value : "200", 10) || 200,
    margin: (marginEl && marginEl.value !== "") ? parseInt(marginEl.value, 10) : 4
  };
}

function qrWsBuildStyling(data, opts, sizeOverride){
  var corners = qrWsCornerStyles(qrWsDotStyle);
  var size = sizeOverride || opts.size;
  return new QRCodeStyling({
    width: size,
    height: size,
    type: "canvas",
    data: qrUtf8(data),
    margin: opts.margin,
    qrOptions: { errorCorrectionLevel: qrWsLogoDataUrl ? "H" : "M" },
    dotsOptions: { color: opts.color, type: qrWsDotStyle },
    cornersSquareOptions: { color: opts.color, type: corners.square },
    cornersDotOptions: { color: opts.color, type: corners.dot },
    backgroundOptions: { color: opts.bg || "rgba(0,0,0,0)" },
    image: qrWsLogoDataUrl || undefined,
    imageOptions: { crossOrigin: "anonymous", margin: 6, imageSize: 0.35, hideBackgroundDots: true }
  });
}

function qrWsHexLuma(hex){
  hex = (hex || "").replace("#", "");
  if (hex.length !== 6) return null;
  var r = parseInt(hex.substr(0, 2), 16), g = parseInt(hex.substr(2, 2), 16), b = parseInt(hex.substr(4, 2), 16);
  if (isNaN(r) || isNaN(g) || isNaN(b)) return null;
  return 0.299 * r + 0.587 * g + 0.114 * b;
}

function qrWsCheckContrast(){
  var warn = document.getElementById("qrWsContrastWarn");
  if (!warn) return;
  var transEl = document.getElementById("qrWsBgTransparent");
  if (transEl && transEl.checked) { warn.style.display = "none"; return; }
  var colorEl = document.getElementById("qrWsColor");
  var bgEl = document.getElementById("qrWsBgColor");
  var l1 = qrWsHexLuma(colorEl ? colorEl.value : "");
  var l2 = qrWsHexLuma(bgEl ? bgEl.value : "");
  if (l1 == null || l2 == null) { warn.style.display = "none"; return; }
  warn.style.display = Math.abs(l1 - l2) < 60 ? "flex" : "none";
}

var qrWsDesignToken = 0;
var qrWsDesignCanvas = null;
function qrDesignRefreshButtons(hasCard){
  var dlSvg = document.getElementById("qrWsDlSvgBtn");
  if (dlSvg) dlSvg.style.display = hasCard ? "none" : "";
}
function qrWsCheckPrintReadyCanvas(cv, data, tok){
  var panel = document.getElementById("qrWsPrintCheck");
  var msgEl = document.getElementById("qrWsPrintCheckMsg");
  if (!panel || !msgEl || typeof QrScanner === "undefined") { if (panel) panel.style.display = "none"; return; }
  panel.style.display = "block";
  msgEl.innerHTML = '<p class="hint" style="margin:0;">' + t("processing") + '</p>';
  QrScanner.scanImage(cv, { returnDetailedScanResult: true }).then(function(decoded){
    if (tok !== qrWsDesignToken) return;
    if (decoded && decoded.data === data) {
      msgEl.innerHTML = '<div class="msg msg-ok" style="margin:0;">' + t("qr_print_check_ok") + '</div>';
    } else {
      msgEl.innerHTML = '<div class="msg msg-error" style="margin:0;">' + t("qr_print_check_fail") + '</div>';
    }
  }).catch(function(){
    if (tok !== qrWsDesignToken) return;
    msgEl.innerHTML = '<div class="msg msg-error" style="margin:0;">' + t("qr_print_check_fail") + '</div>';
  });
}
// Bấm vào thẻ xem trước để xem cỡ lớn (bấm lại hoặc Esc để đóng).
function qrWsZoomCard(){
  if (!qrWsDesignCanvas) return;
  var ov = document.createElement("div");
  ov.className = "qd-zoom";
  var im = document.createElement("img");
  im.src = qrWsDesignCanvas.toDataURL("image/png");
  ov.appendChild(im);
  var close = function(){
    document.removeEventListener("keydown", onKey);
    if (ov.parentNode) ov.parentNode.removeChild(ov);
  };
  var onKey = function(e){ if (e.key === "Escape") close(); };
  ov.onclick = close;
  document.addEventListener("keydown", onKey);
  document.body.appendChild(ov);
}
// Dựng thẻ/bảng thiết kế quanh QR (VietQR, Danh thiếp) rồi thay ô xem trước; lỗi thì giữ QR thường.
function qrWsRenderDesign(data){
  var type = qrWsGetType();
  var box = document.getElementById("qrWsPreviewBox");
  var dlPng = document.getElementById("qrWsDlPngBtn");
  var tok = ++qrWsDesignToken;
  if (dlPng) dlPng.disabled = true;
  qrDesignBuild(data, type).then(function(cv){
    if (tok !== qrWsDesignToken || !box) return;
    qrWsDesignCanvas = cv;
    cv.className = "qd-preview-canvas";
    box.innerHTML = "";
    box.classList.add("qd-card");
    cv.onclick = qrWsZoomCard;
    box.appendChild(cv);
    if (dlPng) dlPng.disabled = false;
    qrDesignRefreshButtons(true);
    qrWsCheckPrintReadyCanvas(cv, data, tok);
  }).catch(function(){
    if (tok !== qrWsDesignToken) return;
    if (dlPng) dlPng.disabled = false;
    qrWsCheckPrintReady(data, true);
  });
}

function qrWsUpdatePreview(){
  var box = document.getElementById("qrWsPreviewBox");
  if (!box) return;
  qrWsDesignToken++;
  qrWsDesignCanvas = null;
  box.classList.remove("qd-card");
  qrDesignRefreshButtons(false);
  qrWsCheckContrast();
  var dataEl = document.getElementById("qrWsPreviewData");
  var dlPng = document.getElementById("qrWsDlPngBtn");
  var dlSvg = document.getElementById("qrWsDlSvgBtn");
  var copyBtn = document.getElementById("qrWsCopyBtn");
  var disableBtns = function(){
    if (dlPng) dlPng.disabled = true;
    if (dlSvg) dlSvg.disabled = true;
    if (copyBtn) copyBtn.disabled = true;
  };
  var printPanel = document.getElementById("qrWsPrintCheck");
  var data = qrWsGetData();
  if (!data) {
    box.innerHTML = '<div class="qr-preview-empty">' + t("qr_preview_empty") + '</div>';
    if (dataEl) dataEl.textContent = "";
    if (printPanel) printPanel.style.display = "none";
    disableBtns();
    return;
  }
  if (!qrWsIsValid(data)) {
    box.innerHTML = '<div class="qr-preview-error">' + t("qr_preview_invalid") + '</div>';
    if (dataEl) dataEl.textContent = "";
    if (printPanel) printPanel.style.display = "none";
    disableBtns();
    return;
  }
  var opts = qrWsReadFormOptions();
  box.innerHTML = "";
  try {
    qrWsCurrentQr = qrWsBuildStyling(data, opts, Math.min(opts.size, 240));
    qrWsCurrentQr.append(box);
  } catch (e) {
    box.innerHTML = '<div class="qr-preview-error">' + t("qr_preview_error") + '</div>';
    if (printPanel) printPanel.style.display = "none";
    disableBtns();
    return;
  }
  if (dataEl) dataEl.textContent = data;
  if (dlPng) dlPng.disabled = false;
  if (dlSvg) dlSvg.disabled = false;
  if (copyBtn) copyBtn.disabled = false;
  qrWsCheckPrintReady(data);
  if (qrDesignActive(qrWsGetType())) qrWsRenderDesign(data);
}

function qrWsCheckPrintReady(data, force){
  if (!force && qrDesignActive(qrWsGetType())) return;
  var panel = document.getElementById("qrWsPrintCheck");
  var msgEl = document.getElementById("qrWsPrintCheckMsg");
  if (!panel || !msgEl || !qrWsCurrentQr) { if (panel) panel.style.display = "none"; return; }
  if (typeof QrScanner === "undefined") { panel.style.display = "none"; return; }
  panel.style.display = "block";
  msgEl.innerHTML = '<p class="hint" style="margin:0;">' + t("processing") + '</p>';
  qrWsCurrentQr.getRawData("png").then(function(blob){
    if (!blob) throw new Error("no blob");
    var objUrl = URL.createObjectURL(blob);
    var img = new Image();
    img.onload = function(){
      var c = document.createElement("canvas");
      c.width = img.width; c.height = img.height;
      var cx = c.getContext("2d", { willReadFrequently: true });
      cx.fillStyle = "#ffffff";
      cx.fillRect(0, 0, c.width, c.height);
      cx.drawImage(img, 0, 0);
      URL.revokeObjectURL(objUrl);
      QrScanner.scanImage(c, { returnDetailedScanResult: true }).then(function(decoded){
        if (decoded && decoded.data === data) {
          msgEl.innerHTML = '<div class="msg msg-ok" style="margin:0;">' + t("qr_print_check_ok") + '</div>';
        } else {
          msgEl.innerHTML = '<div class="msg msg-error" style="margin:0;">' + t("qr_print_check_fail") + '</div>';
        }
      }).catch(function(){
        msgEl.innerHTML = '<div class="msg msg-error" style="margin:0;">' + t("qr_print_check_fail") + '</div>';
      });
    };
    img.onerror = function(){ URL.revokeObjectURL(objUrl); panel.style.display = "none"; };
    img.src = objUrl;
  }).catch(function(){ panel.style.display = "none"; });
}

var qrWsDebounceTimer = null;
function qrWsUpdatePreviewDebounced(){
  clearTimeout(qrWsDebounceTimer);
  qrWsDebounceTimer = setTimeout(qrWsUpdatePreview, 300);
}

function qrWsSetType(type){
  var known = ["url", "text", "vietqr", "zalo", "wifi", "vcard"];
  if (known.indexOf(type) === -1) type = "url";
  qrWsType = type;
  var urlWrap = document.getElementById("qrWsUrlWrap");
  var textWrap = document.getElementById("qrWsTextWrap");
  if (!urlWrap || !textWrap) return;
  urlWrap.style.display = (type === "url") ? "block" : "none";
  textWrap.style.display = (type === "text") ? "block" : "none";
  document.querySelectorAll(".qr-tp").forEach(function(p){
    p.style.display = (p.getAttribute("data-qrpanel") === type) ? "block" : "none";
  });
  document.querySelectorAll(".qr-type-btn").forEach(function(b){
    b.classList.toggle("active", b.getAttribute("data-qrtype") === type);
  });
  qrDesignSetType(type);
  qrWsUpdatePreview();
}

var qrWsMode = "static";
function qrWsSetMode(mode){
  qrWsMode = (mode === "dynamic") ? "dynamic" : "static";
  var btnStatic = document.querySelector('.qr-mode-btn[data-qrmode="static"]');
  var btnDynamic = document.querySelector('.qr-mode-btn[data-qrmode="dynamic"]');
  var typeToggle = document.getElementById("qrWsTypeToggle");
  var dynPanel = document.getElementById("qrWsDynamicPanel");
  var limits = state.limits || {};
  if (btnStatic) btnStatic.classList.toggle("active", qrWsMode === "static");
  if (btnDynamic) btnDynamic.classList.toggle("active", qrWsMode === "dynamic");
  if (qrWsMode === "dynamic") {
    qrWsSetType("url");
    if (typeToggle) typeToggle.style.display = "none";
    if (dynPanel) dynPanel.style.display = "block";
    if ((limits.maxDynamicQrPerMonth || 0) > 0) {
      qrDynRenderQuotaBar(limits.maxDynamicQrPerMonth, null);
      qrDynLoadList();
    }
  } else {
    if (typeToggle) typeToggle.style.display = "flex";
    if (dynPanel) dynPanel.style.display = "none";
  }
}

function qrWsSetSize(size){
  var input = document.getElementById("qrWsSize");
  if (input) input.value = size;
  document.querySelectorAll("#qrWsSizeRow .qr-size-btn").forEach(function(b){
    b.classList.toggle("active", b.getAttribute("data-size") === String(size));
  });
  qrWsUpdatePreview();
}

function qrWsApplyPreset(fg, bg){
  var colorEl = document.getElementById("qrWsColor");
  var colorHexEl = document.getElementById("qrWsColorHex");
  var bgEl = document.getElementById("qrWsBgColor");
  var bgHexEl = document.getElementById("qrWsBgColorHex");
  var transEl = document.getElementById("qrWsBgTransparent");
  if (colorEl) colorEl.value = fg;
  if (colorHexEl) colorHexEl.value = fg;
  if (bgEl) bgEl.value = bg;
  if (bgHexEl) bgHexEl.value = bg;
  if (transEl) { transEl.checked = false; if (bgEl) bgEl.disabled = false; if (bgHexEl) bgHexEl.disabled = false; }
  qrWsUpdatePreview();
}

function qrWsSetDotStyle(style){
  qrWsDotStyle = (style === "rounded" || style === "dots") ? style : "square";
  document.querySelectorAll("#qrWsDotStyleRow .qr-size-btn").forEach(function(b){
    b.classList.toggle("active", b.getAttribute("data-dotstyle") === qrWsDotStyle);
  });
  qrWsUpdatePreview();
}

function qrWsHandleLogoFile(file){
  var msgEl = document.getElementById("qrWsLogoMsg");
  if (msgEl) msgEl.textContent = "";
  if (!file) return;
  if (file.type !== "image/png" && file.type !== "image/jpeg") {
    if (msgEl) msgEl.textContent = t("qr_logo_error_type");
    return;
  }
  if (file.size > 2 * 1024 * 1024) {
    if (msgEl) msgEl.textContent = t("qr_logo_error_size");
    return;
  }
  var reader = new FileReader();
  reader.onload = function(){
    var img = new Image();
    img.onload = function(){
      // Downscale to a small fixed size before storing — keeps the QR record's
      // saved payload (for QR động) small regardless of the original upload size.
      var MAX = 200;
      var scale = Math.min(1, MAX / Math.max(img.width, img.height));
      var w = Math.max(1, Math.round(img.width * scale));
      var h = Math.max(1, Math.round(img.height * scale));
      var canvas = document.createElement("canvas");
      canvas.width = w; canvas.height = h;
      canvas.getContext("2d").drawImage(img, 0, 0, w, h);
      qrWsLogoDataUrl = canvas.toDataURL("image/png");
      var preview = document.getElementById("qrWsLogoPreview");
      var removeBtn = document.getElementById("qrWsLogoRemoveBtn");
      if (preview) { preview.src = qrWsLogoDataUrl; preview.style.display = "inline-block"; }
      if (removeBtn) removeBtn.style.display = "inline-flex";
      qrWsUpdatePreview();
    };
    img.onerror = function(){ if (msgEl) msgEl.textContent = t("qr_logo_error_type"); };
    img.src = String(reader.result || "");
  };
  reader.readAsDataURL(file);
}

function qrWsRemoveLogo(){
  qrWsLogoDataUrl = null;
  var preview = document.getElementById("qrWsLogoPreview");
  var removeBtn = document.getElementById("qrWsLogoRemoveBtn");
  var fileInput = document.getElementById("qrWsLogoFile");
  if (preview) { preview.style.display = "none"; preview.src = ""; }
  if (removeBtn) removeBtn.style.display = "none";
  if (fileInput) fileInput.value = "";
  qrWsUpdatePreview();
}

function qrWsDownload(format){
  var data = qrWsGetData();
  if (!data || !qrWsIsValid(data)) return;
  if (format !== "svg" && qrWsDesignCanvas) { qrDesignDownload(qrWsDesignCanvas); return; }
  var opts = qrWsReadFormOptions();
  var qr = qrWsBuildStyling(data, opts);
  qr.download({ name: "qr_" + Date.now(), extension: format === "svg" ? "svg" : "png" });
}

function qrWsCopyData(){
  var data = qrWsGetData();
  if (data) copyText(data, document.getElementById("qrWsCopyBtn"));
}

var qrWsExistingLoaded = false;
function qrWsLoadExisting(){
  if (qrWsExistingLoaded) return;
  qrWsExistingLoaded = true;
  var sel = document.getElementById("qrWsExistingSelect");
  if (!sel) return;
  api("/api/links").then(function(res){
    var links = (res.links || []).filter(function(l){ return !l.isDeleted; });
    sel.innerHTML = '<option value="">' + t("qr_use_existing_placeholder") + '</option>' +
      links.map(function(l){
        return '<option value="' + esc(l.shortUrl) + '" data-code="' + esc(l.code) + '">' + esc(l.shortUrl) + (l.title ? (" — " + esc(l.title)) : "") + '</option>';
      }).join("");
  }).catch(function(){});
}

// Tracks the last URL we KNOW is one of our own short links (with its code),
// so qrWsSaveDynamic can reuse the exact code instead of guessing from the
// domain — guessing breaks for links on a custom domain (Super tier).
var qrWsResolved = { url: null, code: null };

function qrWsCreateShortUrl(){
  var urlEl = document.getElementById("qrWsUrl");
  var btn = document.getElementById("qrWsCreateShortBtn");
  var resultEl = document.getElementById("qrWsShortUrlResult");
  if (!urlEl || !urlEl.value.trim()) return;
  var raw = urlEl.value.trim();
  if (btn) btn.disabled = true;
  api("/api/links", "POST", { url: raw }).then(function(data){
    var link = data.link;
    urlEl.value = link.shortUrl;
    qrWsResolved = { url: link.shortUrl, code: link.code };
    if (resultEl) resultEl.textContent = t("qr_shorturl_created") + " " + link.shortUrl;
    if (btn) btn.disabled = false;
    qrWsUpdatePreview();
  }).catch(function(err){
    if (resultEl) resultEl.textContent = err.message || "";
    if (btn) btn.disabled = false;
  });
}

function qrWsHandleCsvFile(input){
  var file = input.files && input.files[0];
  if (!file) return;
  var reader = new FileReader();
  reader.onload = function(){
    var text = String(reader.result || "");
    var lines = text.split(/\\r?\\n/).map(function(l){ return l.trim(); }).filter(Boolean);
    var urls = [];
    lines.forEach(function(line, idx){
      var col0 = line.split(",")[0].trim();
      if (idx === 0 && /^url$/i.test(col0)) return;
      if (col0) urls.push(col0);
    });
    var ta = document.getElementById("bqrInput");
    var hint = document.getElementById("qrWsCsvDetected");
    if (ta && urls.length > 0) {
      var existing = ta.value.trim();
      ta.value = existing ? (existing + "\\n" + urls.join("\\n")) : urls.join("\\n");
    }
    if (hint) hint.textContent = urls.length > 0 ? (t("qr_csv_detected") + " " + urls.length) : "";
    input.value = "";
  };
  reader.readAsText(file);
}

// ---------- QR ĐỘNG (QR Studio: create/list/edit/delete dynamic QR) ----------
function qrDynRenderQuotaBar(limit, remaining){
  var box = document.getElementById("qrDynQuotaBar");
  if (!box) return;
  if (!limit || limit >= 999999) {
    box.innerHTML = '<div>' + t("qr_dynamic_quota_label") + ': ' + t("qr_dynamic_quota_unlimited") + '</div>';
    return;
  }
  var used = (remaining === null || remaining === undefined) ? null : (limit - remaining);
  var pct = used === null ? 0 : Math.min(100, Math.round((used / limit) * 100));
  box.innerHTML = '<div>' + t("qr_dynamic_quota_label") + ': ' + (used === null ? "…" : (used + "/" + limit)) + '</div>' +
    '<div class="qr-quota-bar-track"><div class="qr-quota-bar-fill' + (pct >= 90 ? ' warn' : '') + '" style="width:' + pct + '%;"></div></div>';
}

function qrDynBuildStyling(qr, size){
  var corners = qrWsCornerStyles(qr.dotStyle || "square");
  var s = size || qr.size || 150;
  return new QRCodeStyling({
    width: s,
    height: s,
    type: "canvas",
    data: qr.shortUrl || "",
    margin: (qr.margin !== null && qr.margin !== undefined) ? qr.margin : 4,
    qrOptions: { errorCorrectionLevel: qr.logoDataUrl ? "H" : "M" },
    dotsOptions: { color: qr.color || "#000000", type: qr.dotStyle || "square" },
    cornersSquareOptions: { color: qr.color || "#000000", type: corners.square },
    cornersDotOptions: { color: qr.color || "#000000", type: corners.dot },
    backgroundOptions: { color: qr.bgcolor || "rgba(0,0,0,0)" },
    image: qr.logoDataUrl || undefined,
    imageOptions: { crossOrigin: "anonymous", margin: 4, imageSize: 0.35, hideBackgroundDots: true }
  });
}

// Renders a QR into an <img> asynchronously (QRCodeStyling's raw output is a Promise),
// via a blob: object URL — used for thumbnails where markup is built as an HTML string
// before the element exists in the DOM.
function qrDynPaintImg(imgEl, qr, size){
  if (!imgEl) return;
  qrDynBuildStyling(qr, size).getRawData("png").then(function(blob){
    if (blob) imgEl.src = URL.createObjectURL(blob);
  }).catch(function(){});
}

function qrWsSaveDynamic(){
  if (!state.user) return;
  if (!state.user.qrTermsAcceptedAt) { qrDynShowTermsModal(qrWsDoSaveDynamic); return; }
  qrWsDoSaveDynamic();
}

function qrDynShowTermsModal(onAccept){
  var overlay = document.createElement("div");
  overlay.className = "overlay";
  var rules = [1,2,3,4].map(function(n){ return '<li>' + t("qr_dyn_terms_rule" + n) + '</li>'; }).join("");
  var footerHtml = onAccept
    ? '<button type="button" class="btn btn-ghost" id="qrDynTermsLaterBtn">' + t("qr_dyn_terms_later_btn") + '</button>' +
      '<button type="button" class="btn btn-primary" id="qrDynTermsAgreeBtn">' + t("qr_dyn_terms_agree_btn") + '</button>'
    : '<button type="button" class="btn btn-primary" id="qrDynTermsCloseBtn">' + t("qr_dyn_terms_close_btn") + '</button>';
  overlay.innerHTML =
    '<div class="modal" style="max-width:480px;animation:modalPop 0.25s ease;transform-origin:bottom center;">' +
    '<h2 style="display:flex;align-items:center;gap:8px;">' + li('shield', 20) + ' ' + t("qr_dyn_terms_title") + '</h2>' +
    '<p class="hint">' + t("qr_dyn_terms_intro") + '</p>' +
    '<ul style="margin:12px 0;padding-left:20px;font-size:13px;line-height:1.6;">' + rules + '</ul>' +
    '<a href="#/terms" target="_blank" style="font-size:12px;">' + t("qr_dyn_terms_link") + '</a>' +
    '<div id="qrDynTermsMsg" style="margin-top:8px;"></div>' +
    '<div class="actions" style="margin-top:16px;">' + footerHtml + '</div>' +
    '</div>';
  document.body.appendChild(overlay);
  overlay.addEventListener("click", function(e){ if (e.target === overlay) document.body.removeChild(overlay); });
  var closeBtn = document.getElementById("qrDynTermsCloseBtn");
  if (closeBtn) closeBtn.onclick = function(){ document.body.removeChild(overlay); };
  var laterBtn = document.getElementById("qrDynTermsLaterBtn");
  if (laterBtn) laterBtn.onclick = function(){ document.body.removeChild(overlay); };
  var agreeBtn = document.getElementById("qrDynTermsAgreeBtn");
  if (agreeBtn) agreeBtn.onclick = function(){
    agreeBtn.disabled = true;
    api("/api/qr/dynamic/accept-terms", "POST").then(function(data){
      state.user.qrTermsAcceptedAt = data.qrTermsAcceptedAt;
      document.body.removeChild(overlay);
      if (onAccept) onAccept();
    }).catch(function(err){
      agreeBtn.disabled = false;
      var msgEl = document.getElementById("qrDynTermsMsg");
      if (msgEl) msgEl.innerHTML = '<div class="msg msg-error">' + esc((err && err.message) || "") + '</div>';
    });
  };
}

function qrWsDoSaveDynamic(){
  var urlEl = document.getElementById("qrWsUrl");
  var btn = document.getElementById("qrWsDynamicSaveBtn");
  var msgEl = document.getElementById("qrWsDynamicMsg");
  if (!urlEl || !msgEl) return;
  var val = urlEl.value.trim();
  if (!val) { msgEl.innerHTML = '<div class="msg msg-error">' + t("qr_preview_empty") + '</div>'; return; }
  var parsed;
  try { parsed = new URL(val); } catch (e) { msgEl.innerHTML = '<div class="msg msg-error">' + t("qr_preview_invalid") + '</div>'; return; }

  var titleEl = document.getElementById("qrWsDynamicTitle");
  var colorEl = document.getElementById("qrWsColor");
  var bgEl = document.getElementById("qrWsBgColor");
  var transEl = document.getElementById("qrWsBgTransparent");
  var sizeEl = document.getElementById("qrWsSize");
  var marginEl = document.getElementById("qrWsMargin");

  var payload = {
    title: titleEl ? titleEl.value.trim() : "",
    color: colorEl ? colorEl.value : "#000000",
    bgcolor: (transEl && transEl.checked) ? "" : (bgEl ? bgEl.value : ""),
    size: sizeEl ? sizeEl.value : "200",
    margin: marginEl ? marginEl.value : "",
    dotStyle: qrWsDotStyle,
    logoDataUrl: qrWsLogoDataUrl || ""
  };
  if (qrWsResolved.code && qrWsResolved.url === val) {
    payload.shortCode = qrWsResolved.code;
  } else if (parsed.origin === window.location.origin && parsed.pathname.length > 1) {
    payload.shortCode = parsed.pathname.slice(1).split("/")[0];
  } else {
    payload.targetUrl = val;
  }

  if (btn) { btn.disabled = true; }
  msgEl.innerHTML = '<p class="hint">' + t("qr_dynamic_saving") + '</p>';
  api("/api/qr/dynamic", "POST", payload).then(function(data){
    msgEl.innerHTML = '<div class="msg msg-ok">' + t("qr_dynamic_created") + ' ' + t("qr_dynamic_created_desc") + '</div>';
    if (titleEl) titleEl.value = "";
    qrDynRenderQuotaBar(data.limit, data.remaining);
    if (data.qr) { qrDynItems.unshift(data.qr); qrDynPage = 1; qrDynRenderList(); }
  }).catch(function(err){
    var code = err && err.code;
    if (code === "QUOTA_EXCEEDED") {
      msgEl.innerHTML = '<div class="qr-quota-exceeded"><h4>' + t("qr_dynamic_quota_exceeded_title") + '</h4><p>' + t("qr_dynamic_quota_exceeded_desc") + '</p>' +
        '<button type="button" class="btn btn-primary btn-sm" style="margin-top:6px;" onclick="navigate(&#39;pricing&#39;)">' + t("qr_dynamic_upgrade_btn") + '</button></div>';
    } else if (code === "DYNAMIC_QR_NOT_AVAILABLE") {
      msgEl.innerHTML = '<div class="qr-quota-exceeded"><h4>' + t("qr_dynamic_not_available_title") + '</h4><p>' + t("qr_dynamic_not_available_desc") + '</p>' +
        '<button type="button" class="btn btn-primary btn-sm" style="margin-top:6px;" onclick="navigate(&#39;pricing&#39;)">' + t("qr_dynamic_upgrade_btn") + '</button></div>';
    } else if (code === "QR_TERMS_NOT_ACCEPTED") {
      msgEl.innerHTML = "";
      qrDynShowTermsModal(qrWsDoSaveDynamic);
    } else {
      msgEl.innerHTML = '<div class="msg msg-error">' + esc((err && err.message) || "") + '</div>';
    }
  }).then(function(){
    if (btn) btn.disabled = false;
  });
}

// Client-side source of truth for the "QR đã tạo" table. Mutations (create/edit/delete)
// update this array directly from their own response instead of re-fetching the list from
// the server: Cloudflare KV's list() is eventually consistent, so a GET right after a write
// can still miss it — that caused the list to only pick up new/edited/deleted QRs on reload.
var qrDynItems = [];
var qrDynPage = 1;
var QR_DYN_PAGE_SIZE = 5;

function qrDynRenderList(){
  var body = document.getElementById("qrCreatedListBody");
  if (!body) return;
  if (qrDynItems.length === 0) {
    body.innerHTML = '<p class="hint">' + t("qr_created_list_empty") + '</p>';
    return;
  }
  var isAdmin = state.user && state.user.role === "admin";
  var totalPages = Math.max(1, Math.ceil(qrDynItems.length / QR_DYN_PAGE_SIZE));
  if (qrDynPage > totalPages) qrDynPage = totalPages;
  if (qrDynPage < 1) qrDynPage = 1;
  var pageItems = qrDynItems.slice((qrDynPage - 1) * QR_DYN_PAGE_SIZE, qrDynPage * QR_DYN_PAGE_SIZE);

  body.innerHTML = '<div style="overflow-x:auto;"><table class="qr-created-table"><thead><tr>' +
    '<th>' + t("qr_created_col_qr") + '</th><th>' + t("qr_created_col_title") + '</th><th>' + t("qr_created_col_short") + '</th>' +
    (isAdmin ? '<th>' + t("qr_created_col_owner") + '</th>' : '') +
    '<th>' + t("qr_created_col_target") + '</th><th>' + t("qr_created_col_scans") + '</th><th>' + t("qr_created_col_created") + '</th><th>' + t("qr_created_col_actions") + '</th>' +
    '</tr></thead><tbody>' +
    pageItems.map(function(qr){
      return '<tr id="qrDynRow_' + esc(qr.id) + '">' +
        '<td><img id="qrDynThumb_' + esc(qr.id) + '" alt="QR"></td>' +
        '<td>' + esc(qr.title || "—") + '</td>' +
        '<td class="mono">' + esc(qr.shortUrl || "—") + '</td>' +
        (isAdmin ? '<td style="font-size:12px;color:var(--muted2);white-space:nowrap;font-weight:600;">' + esc(qr.owner || "—") + '</td>' : '') +
        '<td class="qr-target-cell" style="max-width:220px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">' + esc(qr.targetUrl || "—") + '</td>' +
        '<td>' + fmtNum(qr.scanCount || 0) + '</td>' +
        '<td>' + esc((qr.createdAt || "").slice(0, 10)) + '</td>' +
        '<td style="white-space:nowrap;">' +
        '<button type="button" class="btn btn-ghost btn-sm" title="' + t("stats") + '" onclick="qrDynStats(&#39;' + esc(qr.id) + '&#39;)">' + li('chart', 12) + '</button> ' +
        '<button type="button" class="btn btn-ghost btn-sm" title="' + t("qr_download") + '" onclick="qrDynDownload(&#39;' + esc(qr.id) + '&#39;)">' + li('download', 12) + '</button> ' +
        '<button type="button" class="btn btn-ghost btn-sm" title="' + t("edit") + '" onclick="qrDynEditTarget(&#39;' + esc(qr.id) + '&#39;)">' + li('edit', 12) + '</button> ' +
        '<button type="button" class="btn btn-ghost btn-sm" title="' + t("del") + '" onclick="qrDynDeleteQr(&#39;' + esc(qr.id) + '&#39;)">' + li('trash', 12) + '</button>' +
        '</td>' +
        '</tr>';
    }).join("") +
    '</tbody></table></div>' +
    pagerButtonsHtml(qrDynPage, totalPages);

  bindPagerClicks(body, function(p){ qrDynPage = p; qrDynRenderList(); });

  pageItems.forEach(function(qr){
    qrDynPaintImg(document.getElementById("qrDynThumb_" + qr.id), qr, 60);
  });
}

function qrDynLoadList(){
  var body = document.getElementById("qrCreatedListBody");
  api("/api/qr/dynamic").then(function(data){
    if (data.quota) qrDynRenderQuotaBar(data.quota.limit, data.quota.remaining);
    var fetched = data.qrs || [];
    var fetchedIds = {};
    fetched.forEach(function(q){ fetchedIds[q.id] = true; });
    // KV's list() is eventually consistent, so a background refresh can arrive without an
    // item we just optimistically added — keep it until the server actually reports it too.
    var stillPending = qrDynItems.filter(function(q){ return !fetchedIds[q.id]; });
    qrDynItems = stillPending.concat(fetched);
    qrDynItems.sort(function(a, b){ return (b.createdAt || "").localeCompare(a.createdAt || ""); });
    qrDynRenderList();
  }).catch(function(){
    if (body) body.innerHTML = '<p class="hint">' + t("qr_created_list_empty") + '</p>';
  });
}

function qrDynEditTarget(qrId){
  var row = document.getElementById("qrDynRow_" + qrId);
  if (!row) return;
  var cell = row.querySelector(".qr-target-cell");
  if (!cell || cell.querySelector("input")) return;
  var current = cell.textContent;
  cell.dataset.original = current;
  cell.innerHTML = '<div class="qr-edit-target-row" style="display:flex;gap:4px;">' +
    '<input type="url" value="' + esc(current === "—" ? "" : current) + '" placeholder="' + t("qr_edit_target_placeholder") + '">' +
    '<button type="button" class="btn btn-primary btn-sm" onclick="qrDynSaveTarget(&#39;' + esc(qrId) + '&#39;)">' + li('check', 12) + '</button>' +
    '<button type="button" class="btn btn-ghost btn-sm" onclick="qrDynCancelEdit(&#39;' + esc(qrId) + '&#39;)">' + li('x', 12) + '</button>' +
    '</div>';
}

function qrDynCancelEdit(qrId){
  var row = document.getElementById("qrDynRow_" + qrId);
  if (!row) return;
  var cell = row.querySelector(".qr-target-cell");
  if (cell) cell.textContent = cell.dataset.original || "—";
}

function qrDynSaveTarget(qrId){
  var row = document.getElementById("qrDynRow_" + qrId);
  if (!row) return;
  var input = row.querySelector(".qr-target-cell input");
  if (!input) return;
  var newUrl = input.value.trim();
  if (!newUrl) return;
  api("/api/qr/dynamic/" + encodeURIComponent(qrId), "PUT", { targetUrl: newUrl }).then(function(data){
    if (data.qr) {
      var idx = qrDynItems.findIndex(function(q){ return q.id === qrId; });
      if (idx !== -1) qrDynItems[idx] = data.qr;
    }
    qrDynRenderList();
  }).catch(function(err){
    alert((err && err.message) || t("qr_edit_target_title"));
  });
}

function qrDynDeleteQr(qrId){
  if (!confirm(t("qr_delete_qr_confirm"))) return;
  api("/api/qr/dynamic/" + encodeURIComponent(qrId), "DELETE").then(function(){
    qrDynItems = qrDynItems.filter(function(q){ return q.id !== qrId; });
    qrDynRenderList();
  }).catch(function(err){
    alert((err && err.message) || "");
  });
}

// Carries the clicked QR động record into the analytics page so it can show a
// QR-specific banner (thumbnail, title, back link) instead of the plain link view.
var qrDynAnalyticsContext = null;

function qrDynStats(qrId){
  var qr = qrDynItems.filter(function(q){ return q.id === qrId; })[0];
  if (!qr || !qr.code) return;
  qrDynAnalyticsContext = qr;
  navigate("analytics/" + encodeURIComponent(qr.code));
  render();
  renderSidebars();
}

function qrDynDownload(qrId){
  var qr = qrDynItems.filter(function(q){ return q.id === qrId; })[0];
  if (!qr) return;
  var size = Math.max(qr.size || 200, 300);
  var name = "qr-dong-" + (qr.title ? qr.title.replace(/[^a-z0-9]+/gi, "-").toLowerCase() : qr.id);
  qrDynBuildStyling(qr, size).download({ name: name, extension: "png" });
}

function qrWsBindWorkspace(){
  qrWsMode = "static";
  qrWsType = "url";
  qrWsResolved = { url: null, code: null };
  qrDynItems = [];
  qrDynPage = 1;
  qrWsDotStyle = "square";
  qrWsLogoDataUrl = null;
  document.querySelectorAll(".qr-type-btn").forEach(function(btn){
    btn.addEventListener("click", function(){ qrWsSetType(btn.getAttribute("data-qrtype")); });
  });
  document.querySelectorAll(".qr-mode-btn").forEach(function(btn){
    btn.addEventListener("click", function(){ qrWsSetMode(btn.getAttribute("data-qrmode")); });
  });
  document.querySelectorAll("#qrWsSizeRow .qr-size-btn").forEach(function(btn){
    btn.addEventListener("click", function(){ qrWsSetSize(btn.getAttribute("data-size")); });
  });
  document.querySelectorAll("#qrWsDotStyleRow .qr-size-btn").forEach(function(btn){
    btn.addEventListener("click", function(){ qrWsSetDotStyle(btn.getAttribute("data-dotstyle")); });
  });
  var logoFileEl = document.getElementById("qrWsLogoFile");
  var logoUploadBtn = document.getElementById("qrWsLogoUploadBtn");
  var logoRemoveBtn = document.getElementById("qrWsLogoRemoveBtn");
  if (logoUploadBtn && logoFileEl) logoUploadBtn.addEventListener("click", function(){ logoFileEl.click(); });
  if (logoFileEl) logoFileEl.addEventListener("change", function(){ qrWsHandleLogoFile(logoFileEl.files && logoFileEl.files[0]); });
  if (logoRemoveBtn) logoRemoveBtn.addEventListener("click", qrWsRemoveLogo);

  var presetsBox = document.getElementById("qrWsPresets");
  if (presetsBox) {
    presetsBox.innerHTML = qrWsPresetList.map(function(p, idx){
      return '<button type="button" class="qr-preset-swatch" data-preset-idx="' + idx + '" style="background:linear-gradient(135deg,' + p.fg + ' 50%,' + p.bg + ' 50%);" title="' + p.fg + ' / ' + p.bg + '"></button>';
    }).join("");
    presetsBox.querySelectorAll(".qr-preset-swatch").forEach(function(btn){
      btn.addEventListener("click", function(){
        var p = qrWsPresetList[parseInt(btn.getAttribute("data-preset-idx"), 10)];
        if (p) qrWsApplyPreset(p.fg, p.bg);
      });
    });
  }

  var urlEl = document.getElementById("qrWsUrl");
  var textEl = document.getElementById("qrWsText");
  if (urlEl) urlEl.addEventListener("input", function(){
    if (urlEl.value.trim() !== qrWsResolved.url) qrWsResolved = { url: null, code: null };
    qrWsUpdatePreviewDebounced();
  });
  if (textEl) textEl.addEventListener("input", qrWsUpdatePreviewDebounced);
  qrTypesBind(qrWsUpdatePreviewDebounced);
  qrDesignBind(qrWsUpdatePreviewDebounced);

  var colorEl = document.getElementById("qrWsColor");
  var colorHexEl = document.getElementById("qrWsColorHex");
  var bgEl = document.getElementById("qrWsBgColor");
  var bgHexEl = document.getElementById("qrWsBgColorHex");
  var transEl = document.getElementById("qrWsBgTransparent");
  var marginEl = document.getElementById("qrWsMargin");

  if (colorEl) colorEl.addEventListener("input", function(){ if (colorHexEl) colorHexEl.value = colorEl.value; qrWsUpdatePreview(); });
  if (colorHexEl) colorHexEl.addEventListener("change", function(){ if (/^#[0-9a-fA-F]{6}$/.test(colorHexEl.value) && colorEl) colorEl.value = colorHexEl.value; qrWsUpdatePreview(); });
  if (bgEl) bgEl.addEventListener("input", function(){ if (bgHexEl) bgHexEl.value = bgEl.value; qrWsUpdatePreview(); });
  if (bgHexEl) bgHexEl.addEventListener("change", function(){ if (/^#[0-9a-fA-F]{6}$/.test(bgHexEl.value) && bgEl) bgEl.value = bgHexEl.value; qrWsUpdatePreview(); });
  if (transEl) transEl.addEventListener("change", function(){
    if (bgEl) bgEl.disabled = transEl.checked;
    if (bgHexEl) bgHexEl.disabled = transEl.checked;
    qrWsUpdatePreview();
  });
  if (marginEl) marginEl.addEventListener("change", qrWsUpdatePreview);

  var utmToggle = document.getElementById("qrWsUtmToggle");
  if (utmToggle) utmToggle.addEventListener("click", toggleUtmFields);
  var applyUtmBtn = document.getElementById("qrWsApplyUtmBtn");
  if (applyUtmBtn) applyUtmBtn.addEventListener("click", function(){
    if (!urlEl) return;
    var campaignEl = document.getElementById("qrWsCampaign");
    urlEl.value = applyUtmParams(urlEl.value.trim(), campaignEl ? campaignEl.value.trim() : "");
    qrWsUpdatePreview();
  });

  var existingSel = document.getElementById("qrWsExistingSelect");
  if (existingSel) {
    existingSel.addEventListener("focus", qrWsLoadExisting);
    existingSel.addEventListener("mousedown", qrWsLoadExisting);
    existingSel.addEventListener("change", function(){
      if (existingSel.value && urlEl) {
        urlEl.value = existingSel.value;
        var opt = existingSel.options[existingSel.selectedIndex];
        qrWsResolved = { url: existingSel.value, code: opt ? opt.getAttribute("data-code") : null };
        qrWsSetType("url");
      }
    });
  }

  var createShortBtn = document.getElementById("qrWsCreateShortBtn");
  if (createShortBtn) createShortBtn.addEventListener("click", qrWsCreateShortUrl);

  var dlPngBtn = document.getElementById("qrWsDlPngBtn");
  var dlSvgBtn = document.getElementById("qrWsDlSvgBtn");
  var copyBtn = document.getElementById("qrWsCopyBtn");
  if (dlPngBtn) dlPngBtn.addEventListener("click", function(){ qrWsDownload("png"); });
  if (dlSvgBtn) dlSvgBtn.addEventListener("click", function(){ qrWsDownload("svg"); });
  if (copyBtn) copyBtn.addEventListener("click", qrWsCopyData);

  var csvFile = document.getElementById("qrWsCsvFile");
  if (csvFile) csvFile.addEventListener("change", function(){ qrWsHandleCsvFile(csvFile); });

  qrWsUpdatePreview();
}

function renderAnalyticsOverview(app){
  app.innerHTML = '<div class="card"><p class="sub">' + t("processing") + '</p></div>';
  api("/api/analytics/overview").then(function(data){
    var stats = data.stats;
    var isAdmin = state.user && state.user.role === "admin";
    var html = guideCard("analytics") + '<div class="page-head"><h1>' + li("chart", 24) + ' Analytics Overview</h1></div>';
    html += '<div class="grid-stats">';
    html += '<div class="stat-card"><div class="stat-icon">' + li("link", 18) + '</div><div class="stat-value">' + fmtNum(stats.userLinksCount) + '</div><div class="stat-label">' + t("my_links") + '</div></div>';
    html += '<div class="stat-card"><div class="stat-icon">' + li("chart", 18) + '</div><div class="stat-value">' + fmtNum(stats.userTotalClicks) + '</div><div class="stat-label">' + t("total_clicks") + '</div></div>';
    if (isAdmin && stats.global) {
      html += '<div class="stat-card"><div class="stat-icon">' + li("users", 18) + '</div><div class="stat-value">' + fmtNum(stats.global.totalUsers) + '</div><div class="stat-label">Total Users</div></div>';
      html += '<div class="stat-card"><div class="stat-icon">' + li("link", 18) + '</div><div class="stat-value">' + fmtNum(stats.global.totalLinks) + '</div><div class="stat-label">Total Links</div></div>';
      html += '<div class="stat-card"><div class="stat-icon">' + li("chart", 18) + '</div><div class="stat-value">' + fmtNum(stats.global.totalClicks) + '</div><div class="stat-label">Global Clicks</div></div>';
      if (stats.global.pendingReports > 0) html += '<div class="stat-card"><div class="stat-icon">' + li("alert", 18) + '</div><div class="stat-value">' + fmtNum(stats.global.pendingReports) + '</div><div class="stat-label">Pending Reports</div></div>';
    }
    html += '</div>';
    if (state.links && state.links.length > 0) {
      var sorted = state.links.slice().sort(function(a, b) { return (b.totalClicks || 0) - (a.totalClicks || 0); });
      var topLinks = sorted.slice(0, 10);
      html += '<div class="card"><h2>Top Links</h2><div class="tbl-wrap"><table><thead><tr><th>#</th><th>' + t("col_link") + '</th><th>' + t("col_dest") + '</th><th>' + t("col_clicks") + '</th><th>' + t("col_status") + '</th></tr></thead><tbody>';
      topLinks.forEach(function(l, i) {
        var deleted = l.isDeleted === true;
        html += '<tr><td style="color:var(--muted);font-weight:700;">' + (i + 1) + '</td>';
        html += '<td><div class="mono" style="color:var(--code-color);font-weight:700;word-break:break-all;">' + esc(l.shortUrl || (location.origin + "/" + l.code)) + '</div><div style="color:var(--muted);font-size:12px;">' + esc(l.title || "") + '</div></td>';
        html += '<td style="max-width:200px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;" title="' + esc(l.url) + '">' + esc(l.url) + '</td>';
        html += '<td style="font-weight:700;">' + fmtNum(l.totalClicks) + '</td>';
        html += '<td>' + (deleted ? '<span class="badge badge-guest">' + t("deleted") + '</span>' : isLinkExpired(l) ? '<span class="badge badge-guest">' + t("link_expired_badge") + '</span>' : l.isEnabled === false ? '<span class="badge badge-guest">' + t("disabled") + '</span>' : '<span class="badge badge-free">' + t("enabled") + '</span>') + '</td>';
        html += '</tr>';
      });
      html += '</tbody></table></div></div>';
    }
    html += '<div class="card"><p class="hint">' + li("chart", 14) + ' ' + t("analytics_stats_hint") + '</p></div>';
    app.innerHTML = html;
  }).catch(function(err){ app.innerHTML = '<div class="card"><div class="msg msg-error">' + esc(err.message) + '</div></div>'; });
}

function renderAnalytics(app, code){
  app.innerHTML = '<div class="card"><p class="sub">' + t("processing") + '</p></div>';
  api("/api/analytics/" + encodeURIComponent(code)).then(function(data){
    var a = data.analytics;
    var days30 = a.timeline30d.slice(-14).map(function(d){ return { date: d.date, clicks: d.clicks }; });
    var qrCtx = (qrDynAnalyticsContext && qrDynAnalyticsContext.code === a.code) ? qrDynAnalyticsContext : null;
    var qrBannerHtml = qrCtx ? (
      '<div class="card qr-analytics-banner">' +
      '<div class="qr-analytics-banner-imgwrap"><img id="qrAnalyticsBannerImg" alt="QR"></div>' +
      '<div><div class="qr-analytics-banner-title">' + li('qr', 14) + ' ' + t("qr_analytics_banner_title") + '</div>' +
      '<div class="qr-analytics-banner-name">' + esc(qrCtx.title || qrCtx.shortUrl || "") + '</div>' +
      '<div class="hint" style="margin-top:4px;">' + esc(qrCtx.shortUrl || "") + '</div></div>' +
      '<a href="#/bulkqr" class="btn btn-ghost btn-sm">' + t("qr_analytics_back") + '</a>' +
      '</div>'
    ) : '';
    app.innerHTML = qrBannerHtml +
      '<div class="breadcrumb"><a onclick="navigate(&#39;dashboard&#39;);">Analytics</a> <span class="sep">/</span> /' + esc(a.code) + '</div>' +
      '<div class="card"><a href="#/dashboard" class="hint">' + t("analytics_back") + '</a>' +
      '<h1 style="margin-top:10px;">' + t("analytics_title") + ' /' + esc(a.code) + helpLinkHtml('thong-ke-chi-tiet-link-huong-dan-doc-analytics-shurlvn', 'Thống kê chi tiết link — Xem hướng dẫn đọc') + '</h1>' +
      '<p class="sub">' + esc(a.title || a.url) + '</p>' +
      '<div class="grid-stats">' +
      '<div class="stat"><div class="num" id="analyticsTotalNum">' + fmtNum(a.totalClicks) + '</div><div class="lbl">' + t("analytics_total") + (state.limits && state.limits.hasDetailedAnalytics ? ' <span id="analyticsLiveDot" class="analytics-live-dot" title="Tự động cập nhật"></span>' + helpLinkHtml('xem-luot-click-real-time-khong-can-refresh-trang', 'Xem click real-time — Xem hướng dẫn') : '') + '</div></div>' +
      '<div class="stat"><div class="num">' + fmtNum(a.todayClicks) + '</div><div class="lbl">' + t("analytics_24h") + '</div></div>' +
      '<div class="stat"><div class="num">' + fmtNum(a.clicks7d) + '</div><div class="lbl">' + t("analytics_7d") + '</div></div>' +
      '<div class="stat"><div class="num">' + fmtNum(a.clicks30d) + '</div><div class="lbl">' + t("analytics_30d") + '</div></div>' +
      '</div></div>' +
      '<div class="row">' +
      '<div class="card"><h2>' + t("analytics_14d") + '</h2>' + bars(days30, "date", "clicks", 14) + '</div>' +
      '<div class="card"><h2>' + t("analytics_by_hour") + '</h2>' + bars(a.timeline24h, "hour", "clicks", 24) + '</div>' +
      '</div>' +
      '<div class="row">' +
      '<div class="card"><h2>' + t("analytics_device") + '</h2>' + bars(a.deviceBreakdown, "name", "value", 6) + '</div>' +
      '<div class="card"><h2>' + t("analytics_country") + '</h2>' + bars(a.countryBreakdown, "name", "count", 8) + '</div>' +
      '</div>' +
      '<div class="row">' +
      '<div class="card"><h2>' + t("analytics_browser") + '</h2>' + bars(a.browserBreakdown, "name", "count", 8) + '</div>' +
      '<div class="card"><h2>' + t("analytics_referrer") + '</h2>' + bars(a.referrerBreakdown, "name", "count", 8) + '</div>' +
      '</div>' +
      '<div class="card"><h2>' + t("analytics_recent") + '</h2><div style="overflow-x:auto;"><table><thead><tr>' +
      '<th>' + t("analytics_time") + '</th><th>' + t("analytics_device") + '</th><th>' + t("analytics_browser") + '</th><th>' + t("analytics_country") + '</th><th>' + t("analytics_referrer") + '</th></tr></thead><tbody id="analyticsRecentTbody">' +
      analyticsRecentRowsHtml(a.recentClicks) +
      '</tbody></table></div><p class="hint" id="analyticsRecentEmpty"' + (a.recentClicks.length === 0 ? '' : ' style="display:none;"') + '>' + t("analytics_no_clicks") + '</p></div>';
    if (qrCtx) qrDynPaintImg(document.getElementById("qrAnalyticsBannerImg"), qrCtx, 320);
    if (state.limits && state.limits.hasDetailedAnalytics) startAnalyticsPolling(a.code, a.totalClicks);
  }).catch(function(err){
    app.innerHTML = '<div class="card"><div class="msg msg-error">' + esc(err.message) + '</div></div>';
  });
}

function analyticsRecentRowsHtml(recentClicks){
  return recentClicks.map(function(c){
    return '<tr><td style="font-size:12px;color:var(--muted);">' + fmtDate(c.timestamp) + '</td><td>' + esc(c.device) + '</td><td>' + esc(c.browser) + '</td><td>' + esc(c.country) + '</td><td>' + esc(c.referrer) + '</td></tr>';
  }).join("");
}

// Real-time-ish click updates for Pro/Super (inspired by Shlink's live visit tracking).
// No WebSocket/Durable Objects — short-interval polling only, so it costs nothing to
// add to this single-file Worker and can't destabilize the existing architecture.
function startAnalyticsPolling(code, lastKnownTotal){
  if (analyticsPollTimer) clearInterval(analyticsPollTimer);
  analyticsPollTimer = setInterval(function(){
    api("/api/analytics/" + encodeURIComponent(code)).then(function(data){
      var a = data.analytics;
      var totalEl = document.getElementById("analyticsTotalNum");
      var tbody = document.getElementById("analyticsRecentTbody");
      var emptyMsg = document.getElementById("analyticsRecentEmpty");
      if (!totalEl || !tbody) return; // user navigated away between tick scheduling and response
      if (a.totalClicks !== lastKnownTotal) {
        lastKnownTotal = a.totalClicks;
        totalEl.textContent = fmtNum(a.totalClicks);
        totalEl.classList.remove("analytics-flash");
        void totalEl.offsetWidth; // restart CSS animation
        totalEl.classList.add("analytics-flash");
        tbody.innerHTML = analyticsRecentRowsHtml(a.recentClicks);
        if (emptyMsg) emptyMsg.style.display = a.recentClicks.length === 0 ? "" : "none";
      }
    }).catch(function(){ /* silent — a transient poll failure shouldn't interrupt the page */ });
  }, 4000);
}

function buildCurlExample(origin, token){
  var NL = String.fromCharCode(10);
  var Q = String.fromCharCode(34);
  var tok = token || "SHURL_API_TOKEN";
  return "curl -X POST " + origin + "/api/v1/shorten" + NL +
    "  -H " + Q + "Authorization: Bearer " + tok + Q + NL +
    "  -H " + Q + "Content-Type: application/json" + Q + NL +
    "  -d " + Q + "{" + Q + "url" + Q + ":" + Q + "https://example.com" + Q + "}" + Q;
}

// ---------- API TAB ----------
function renderApiTab(app){
  var limits = state.limits || {};
  var origin = location.origin;
  if (!state.user){
    app.innerHTML = lockedFeatureCard('<h1>' + t("api_title") + '</h1>');
    return;
  }
  var tokenBlock = state.user.apiToken
    ? '<div class="copybox"><span class="u">' + esc(state.user.apiToken) + '</span><button class="btn btn-ghost btn-sm" id="btnCopyToken">' + t("copy") + '</button></div>'
    : '<p class="hint">' + t("api_no_token") + '</p>';
  var extTokenBlock = state.user.extToken
    ? '<div class="copybox"><span class="u">' + esc(state.user.extToken) + '</span><button class="btn btn-ghost btn-sm" id="btnCopyExtToken">' + t("copy") + '</button></div>'
    : '<p class="hint">' + t("ext_no_token") + '</p>';
  app.innerHTML = guideCard("api") + upgradeBanner("api") +
    '<div class="card"><h1>' + t("ext_title") + '</h1>' +
    '<p class="sub">' + t("ext_desc") + '</p>' +
    extTokenBlock +
    '<div id="extMsg"></div>' +
    '<button class="btn btn-primary btn-sm" id="btnGenExtToken">' + (state.user.extToken ? t("ext_regen_btn") : t("ext_gen_btn")) + '</button>' +
    '</div>' +
    '<div class="card"><h1>' + t("api_title") + helpLinkHtml('api-shurlvn-huong-dan-lay-token-va-goi-api-rut-gon-link', 'API Shurlvn là gì? Xem hướng dẫn sử dụng') + '</h1>' +
    (limits.hasApi ? '' : '<p class="sub">' + t("api_no_access") + '</p>') +
    tokenBlock +
    '<div id="apiMsg"></div>' +
    '<button class="btn btn-primary btn-sm" id="btnGenToken" ' + (limits.hasApi ? "" : "disabled") + '>' + (state.user.apiToken ? t("api_regen_token") : t("api_gen_token")) + '</button>' +
    (limits.monthlyApiLimit ? '<p class="hint" style="margin-top:10px;">' + t("api_monthly_limit") + ' ' + fmtNum(limits.monthlyApiLimit) + ' ' + t("api_requests_month") + '</p>' : '') +
    '</div>' +
    '<div class="card"><h2>' + t("api_example") + '</h2>' +
    '<pre style="background:rgba(15,23,42,0.9);border-radius:12px;padding:16px;overflow-x:auto;font-size:12px;color:#a5b4fc;">' +
    esc(buildCurlExample(origin, state.user.apiToken)) +
    '</pre>' +
    '<p class="hint">' + t("api_other") + '</p>' +
    '</div>' +
    '<div class="card"><h2>' + t("url_tool_title") + helpLinkHtml('url-encoder-decoder-la-gi-huong-dan-su-dung', 'URL Encoder/Decoder là gì? Xem hướng dẫn sử dụng') + '</h2>' +
    '<p class="hint">' + t("url_tool_hint") + '</p>' +
    '<label>' + t("url_tool_input_label") + '</label>' +
    '<textarea id="urlToolInput" rows="3" style="width:100%;padding:10px;border:1px solid var(--input-border);border-radius:8px;background:var(--input-bg);color:var(--text);font-size:13px;font-family:monospace;resize:vertical;"></textarea>' +
    '<div style="display:flex;gap:10px;margin-top:10px;">' +
    '<button class="btn btn-primary btn-sm" id="urlToolEncodeBtn">' + t("url_tool_encode_btn") + '</button>' +
    '<button class="btn btn-ghost btn-sm" id="urlToolDecodeBtn">' + t("url_tool_decode_btn") + '</button>' +
    '</div>' +
    '<div id="urlToolMsg"></div>' +
    '<div id="urlToolResultWrap" style="display:none;margin-top:10px;">' +
    '<label>' + t("url_tool_output_label") + '</label>' +
    '<textarea id="urlToolOutput" rows="3" readonly style="width:100%;padding:10px;border:1px solid var(--input-border);border-radius:8px;background:var(--input-bg);color:var(--text);font-size:13px;font-family:monospace;resize:vertical;"></textarea>' +
    '<button class="btn btn-ghost btn-sm" id="urlToolCopyBtn" style="margin-top:8px;">' + t("url_tool_copy") + '</button>' +
    '</div>' +
    '</div>';
  var btn = document.getElementById("btnGenToken");
  var msg = document.getElementById("apiMsg");
  if (limits.hasApi){
    btn.onclick = function(){
      api("/api/auth/token", "POST").then(function(data){
        state.user.apiToken = data.apiToken;
        renderApiTab(app);
      }).catch(function(err){ msg.innerHTML = '<div class="msg msg-error">' + esc(err.message) + '</div>'; });
    };
  }
  var copyBtn = document.getElementById("btnCopyToken");
  if (copyBtn) copyBtn.onclick = function(){ copyText(state.user.apiToken, this); };

  var extBtn = document.getElementById("btnGenExtToken");
  var extMsg = document.getElementById("extMsg");
  extBtn.onclick = function(){
    api("/api/extension/token", "POST").then(function(data){
      state.user.extToken = data.extToken;
      renderApiTab(app);
    }).catch(function(err){ extMsg.innerHTML = '<div class="msg msg-error">' + esc(err.message) + '</div>'; });
  };
  var copyExtBtn = document.getElementById("btnCopyExtToken");
  if (copyExtBtn) copyExtBtn.onclick = function(){ copyText(state.user.extToken, this); };

  // URL Encoder/Decoder — thuần client-side, không gọi API
  var urlToolMsg = document.getElementById("urlToolMsg");
  var urlToolResultWrap = document.getElementById("urlToolResultWrap");
  var urlToolOutput = document.getElementById("urlToolOutput");
  function urlToolRun(fn){
    urlToolMsg.innerHTML = "";
    var input = document.getElementById("urlToolInput").value;
    try {
      var result = fn(input);
      urlToolOutput.value = result;
      urlToolResultWrap.style.display = "block";
    } catch (e) {
      urlToolResultWrap.style.display = "none";
      urlToolMsg.innerHTML = '<div class="msg msg-error">' + esc(t("url_tool_error")) + '</div>';
    }
  }
  document.getElementById("urlToolEncodeBtn").onclick = function(){ urlToolRun(encodeURIComponent); };
  document.getElementById("urlToolDecodeBtn").onclick = function(){ urlToolRun(decodeURIComponent); };
  document.getElementById("urlToolCopyBtn").onclick = function(){ copyText(urlToolOutput.value, this); };
}

// ---------- WEBHOOKS TAB (Pro/Super) ----------
function renderWebhookTab(app){
  var limits = state.limits || {};
  if (!isProOrAbove(state.user)){
    app.innerHTML = upgradeBanner("webhooks") + lockedFeatureCard('<h1>' + li('webhook', 14) + ' Webhooks</h1>');
    return;
  }
  app.innerHTML = guideCard("webhooks") + upgradeBanner("webhooks") +
    '<div class="card"><h1>' + li('webhook', 14) + ' Webhooks' + helpLinkHtml('webhook-la-gi-huong-dan-nhan-thong-bao-click-tuc-thoi', 'Webhook là gì? Xem hướng dẫn sử dụng') + '</h1>' +
    (limits.hasApi ? '' : '<p class="sub">' + t("wh_requires") + '</p>') +
    '<div id="webhookList"><p class="hint">Đang tải...</p></div>' +
    (limits.hasApi ? '<div class="card" style="margin-top:16px;border:1px solid var(--border);"><h2>' + li('plus', 14) + ' ' + t("wh_add_title") + '</h2>' +
    '<label class="lbl">' + t("wh_url_label") + '</label>' +
    '<input class="inp" id="whUrl" type="url" placeholder="https://example.com/webhook" />' +
    '<label class="lbl" style="margin-top:10px;">' + t("wh_name_label") + '</label>' +
    '<input class="inp" id="whName" type="text" placeholder="My Webhook" />' +
    '<div id="whMsg" style="margin-top:10px;"></div>' +
    '<button class="btn btn-primary btn-sm" id="btnAddWebhook" style="margin-top:12px;">' + t("wh_add_btn") + '</button>' +
    '</div>' : '') +
    '<div class="card" style="margin-top:16px;border:1px solid var(--border);"><h2>' + t("wh_guide_title") + '</h2>' +
    '<p class="hint">' + t("wh_guide_desc") + '</p>' +
    '<div style="background:rgba(15,23,42,0.9);border-radius:12px;padding:16px;overflow-x:auto;font-size:12px;color:#a5b4fc;font-family:monospace;line-height:1.6;">{<br>&nbsp;&nbsp;"event": "click",<br>&nbsp;&nbsp;"link": { "code": "abc123", "url": "https://..." },<br>&nbsp;&nbsp;"click": { "ip": "...", "country": "VN", "device": "..." },<br>&nbsp;&nbsp;"timestamp": "2026-09-03T..."<br>}</div></div>' +
    '</div>';

  function loadWebhooks(newWebhook){
    var listEl = document.getElementById("webhookList");
    api("/api/v1/webhooks", "GET").then(function(data){
      var hooks = data.data || [];
      if (newWebhook && !hooks.some(function(h){ return h.id === newWebhook.id; })){ hooks.unshift(newWebhook); }
      if (hooks.length === 0){
        listEl.innerHTML = '<p class="hint">' + t("wh_empty") + '</p>';
        return;
      }
      listEl.innerHTML = '<table style="width:100%;border-collapse:collapse;"><thead><tr>' +
        '<th style="text-align:left;padding:8px;border-bottom:1px solid var(--border);">Tên</th>' +
        '<th style="text-align:left;padding:8px;border-bottom:1px solid var(--border);">URL</th>' +
        '<th style="text-align:left;padding:8px;border-bottom:1px solid var(--border);">Sự kiện</th>' +
        '<th style="text-align:left;padding:8px;border-bottom:1px solid var(--border);">Ngày tạo</th>' +
        '<th style="text-align:right;padding:8px;border-bottom:1px solid var(--border);">Xóa</th>' +
        '</tr></thead><tbody>' +
        hooks.map(function(h){
          return '<tr>' +
            '<td style="padding:8px;border-bottom:1px solid var(--border);">' + esc(h.name || "—") + '</td>' +
            '<td style="padding:8px;border-bottom:1px solid var(--border);font-size:12px;word-break:break-all;">' + esc(h.url) + '</td>' +
            '<td style="padding:8px;border-bottom:1px solid var(--border);"><span class="badge badge-pro">' + esc(h.event || "click") + '</span></td>' +
            '<td style="padding:8px;border-bottom:1px solid var(--border);font-size:12px;">' + esc((h.createdAt || "").slice(0,10)) + '</td>' +
            '<td style="padding:8px;border-bottom:1px solid var(--border);text-align:right;"><button class="btn btn-ghost btn-sm btnDelWh" data-id="' + esc(h.id) + '">' + li("trash", 12) + '</button></td>' +
            '</tr>';
        }).join("") +
        '</tbody></table>';
      document.querySelectorAll(".btnDelWh").forEach(function(btn){
        btn.onclick = function(){
          var id = this.getAttribute("data-id");
          if (!confirm(t("wh_delete_confirm"))) return;
          api("/api/v1/webhooks/" + id, "DELETE").then(function(){
            loadWebhooks();
          }).catch(function(err){
            alert("Lỗi: " + err.message);
          });
        };
      });
    }).catch(function(err){
      listEl.innerHTML = '<div class="msg msg-error">' + esc(err.message) + '</div>';
    });
  }

  if (limits.hasApi){
    loadWebhooks();
    var addBtn = document.getElementById("btnAddWebhook");
    if (addBtn) addBtn.onclick = function(){
      var url = document.getElementById("whUrl").value.trim();
      var name = document.getElementById("whName").value.trim();
      var msg = document.getElementById("whMsg");
      if (!url){ msg.innerHTML = '<div class="msg msg-error">' + t("wh_err_url") + '</div>'; return; }
      if (!url.startsWith("https://")){ msg.innerHTML = '<div class="msg msg-error">' + t("wh_err_https") + '</div>'; return; }
      msg.innerHTML = '<p class="hint">' + t("wh_adding") + '</p>';
      api("/api/v1/webhooks", "POST", { url: url, name: name || undefined, event: "click" }).then(function(data){
        document.getElementById("whUrl").value = "";
        document.getElementById("whName").value = "";
        msg.innerHTML = '<div class="msg msg-success">' + t("wh_added") + '</div>';
        loadWebhooks(data.webhook);
      }).catch(function(err){
        msg.innerHTML = '<div class="msg msg-error">' + esc(err.message) + '</div>';
      });
    };
  }
}

// ---------- EXPORT TAB (Pro/Super) ----------
function renderExportTab(app){
  var limits = state.limits || {};
  if (!isProOrAbove(state.user)){
    app.innerHTML = upgradeBanner("export") + lockedFeatureCard('<h1>' + li('download', 14) + ' ' + t("export_tab_title") + '</h1>');
    return;
  }
  app.innerHTML = guideCard("export") + upgradeBanner("export") +
    '<div class="card"><h1>' + li('download', 14) + ' ' + t("export_tab_title") + '</h1>' +
    (limits.hasDataExport ? '' : '<p class="sub">' + t("export_requires") + '</p>') +
    (limits.hasDataExport ? '<div style="margin-top:16px;max-width:260px;">' +
    '<label>' + t("export_filter_campaign_label") + '</label>' +
    '<select id="exportCampaignFilter" style="width:100%;padding:8px;border:1px solid var(--input-border);border-radius:8px;background:var(--input-bg);color:var(--text);font-size:13px;"><option value="">' + t("export_filter_all") + '</option></select>' +
    '</div>' +
    '<div style="display:flex;gap:12px;flex-wrap:wrap;margin-top:16px;">' +
    '<button class="btn btn-primary" id="btnExportCsv">' + li('download', 12) + ' ' + t("export_csv_btn") + '</button>' +
    '<button class="btn btn-primary" id="btnExportJson">' + li('download', 12) + ' ' + t("export_json_btn") + '</button>' +
    '</div>' +
    '<div id="exportMsg" style="margin-top:12px;"></div>' +
    '<p class="hint" style="margin-top:16px;">' + t("export_desc") + '</p>' +
    '<p class="hint">' + t("export_csv_hint") + '</p>' : '') +
    '</div>';

  if (limits.hasDataExport){
    var csvBtn = document.getElementById("btnExportCsv");
    var jsonBtn = document.getElementById("btnExportJson");
    var msg = document.getElementById("exportMsg");
    var campaignSel = document.getElementById("exportCampaignFilter");

    api("/api/v1/campaigns", "GET").then(function(data){
      if (campaignSel && data.campaigns && data.campaigns.length){
        campaignSel.innerHTML = '<option value="">' + t("export_filter_all") + '</option>' +
          data.campaigns.map(function(c){ return '<option value="' + esc(c.name) + '">' + esc(c.name) + '</option>'; }).join("");
      }
    }).catch(function(){});

    function exportQuery(){
      var c = campaignSel ? campaignSel.value : "";
      return c ? ("?campaign=" + encodeURIComponent(c)) : "";
    }

    if (csvBtn) csvBtn.onclick = function(){
      msg.innerHTML = '<p class="hint">Đang xuất CSV...</p>';
      fetch("/api/v1/export/csv" + exportQuery(), { credentials: "same-origin" }).then(function(res){
        if (!res.ok) return res.json().then(function(d){ throw new Error((d && d.error) || "Export failed"); });
        return res.text();
      }).then(function(text){
        var blob = new Blob([text], { type: "text/csv;charset=utf-8" });
        var a = document.createElement("a");
        a.href = URL.createObjectURL(blob);
        a.download = "shurl-export.csv";
        a.click();
        URL.revokeObjectURL(a.href);
        msg.innerHTML = '<div class="msg msg-success">Đã xuất CSV!</div>';
      }).catch(function(err){
        msg.innerHTML = '<div class="msg msg-error">' + esc(err.message) + '</div>';
      });
    };

    if (jsonBtn) jsonBtn.onclick = function(){
      msg.innerHTML = '<p class="hint">Đang xuất JSON...</p>';
      fetch("/api/v1/export/json" + exportQuery(), { credentials: "same-origin" }).then(function(res){
        if (!res.ok) return res.json().then(function(d){ throw new Error((d && d.error) || "Export failed"); });
        return res.text();
      }).then(function(text){
        var blob = new Blob([text], { type: "application/json;charset=utf-8" });
        var a = document.createElement("a");
        a.href = URL.createObjectURL(blob);
        a.download = "shurl-export.json";
        a.click();
        URL.revokeObjectURL(a.href);
        msg.innerHTML = '<div class="msg msg-success">Đã xuất JSON!</div>';
      }).catch(function(err){
        msg.innerHTML = '<div class="msg msg-error">' + esc(err.message) + '</div>';
      });
    };
  }
}

// ---------- CAMPAIGNS TAB (Plus+) ----------
function renderCampaignsTab(app){
  var limits = state.limits || {};
  app.innerHTML = guideCard("campaigns") + upgradeBanner("campaigns") +
    '<div class="card"><h1>' + li('chart', 14) + ' Campaigns' + helpLinkHtml('campaign-la-gi-huong-dan-quan-ly-link-theo-chien-dich', 'Campaign là gì? Xem hướng dẫn sử dụng') + '</h1>' +
    (limits.hasCampaignHistory ? '' : '<p class="sub">' + t("campaigns_requires") + '</p>') +
    '<div id="campaignList"><p class="hint">' + t("campaigns_loading") + '</p></div>' +
    '<div class="card" style="margin-top:16px;border:1px solid var(--border);"><h2>' + t("campaigns_guide_title") + '</h2>' +
    '<p class="hint">' + t("campaigns_guide_desc") + '</p>' +
    '<p class="hint">' + t("campaigns_guide_desc2") + '</p>' +
    '</div></div>';

  function loadCampaigns(){
    var listEl = document.getElementById("campaignList");
    api("/api/v1/campaigns", "GET").then(function(data){
      if (!data.campaigns || data.campaigns.length === 0){
        listEl.innerHTML = '<p class="hint">' + t("campaigns_empty") + '</p>';
        return;
      }
      listEl.innerHTML = '<table style="width:100%;border-collapse:collapse;"><thead><tr>' +
        '<th style="text-align:left;padding:8px;border-bottom:1px solid var(--border);">Campaign</th>' +
        '<th style="text-align:right;padding:8px;border-bottom:1px solid var(--border);">Links</th>' +
        '<th style="text-align:right;padding:8px;border-bottom:1px solid var(--border);">' + t("campaigns_col_clicks") + '</th>' +
        '<th style="text-align:left;padding:8px;border-bottom:1px solid var(--border);">' + t("campaigns_col_history") + '</th>' +
        '</tr></thead><tbody>' +
        data.campaigns.map(function(c){
          return '<tr style="cursor:pointer;" class="campaignRow" data-campaign="' + esc(c.name) + '">' +
            '<td style="padding:8px;border-bottom:1px solid var(--border);"><span class="badge badge-pro">' + esc(c.name) + '</span></td>' +
            '<td style="padding:8px;border-bottom:1px solid var(--border);text-align:right;">' + c.linkCount + '</td>' +
            '<td style="padding:8px;border-bottom:1px solid var(--border);text-align:right;">' + (c.totalClicks || 0) + '</td>' +
            '<td style="padding:8px;border-bottom:1px solid var(--border);font-size:12px;color:var(--muted);">' + t("campaigns_view_history") + '</td>' +
            '</tr>';
        }).join("") +
        '</tbody></table>';
      document.querySelectorAll(".campaignRow").forEach(function(row){
        row.onclick = function(){
          var campaignName = this.getAttribute("data-campaign");
          loadCampaignHistory(campaignName);
        };
      });
    }).catch(function(err){
      listEl.innerHTML = '<div class="msg msg-error">' + esc(err.message) + '</div>';
    });
  }

  function loadCampaignHistory(campaignName){
    var listEl = document.getElementById("campaignList");
    listEl.innerHTML = '<p class="hint"><a href="javascript:void(0)" id="campaignBackLink">' + t("campaigns_back") + '</a></p>' +
      '<h2>' + t("campaigns_history_title") + ' ' + esc(campaignName) + '</h2>' +
      '<div id="historyDetail"><p class="hint">' + t("campaigns_loading") + '</p></div>';
    document.getElementById("campaignBackLink").onclick = function(e){
      e.preventDefault();
      navigate("campaigns");
      render();
    };
    api("/api/v1/campaigns/" + encodeURIComponent(campaignName), "GET").then(function(data){
      var detailEl = document.getElementById("historyDetail");
      if (!data.links || data.links.length === 0){
        detailEl.innerHTML = '<p class="hint">' + t("campaigns_no_links") + '</p>';
        return;
      }
      detailEl.innerHTML = data.links.map(function(l){
        var historyHtml = (l.campaignHistory || []).map(function(h){
          return '<div style="font-size:11px;color:var(--muted);padding:2px 0;">← ' + esc(h.campaign) + ' ' + tf("campaigns_changed_date", { date: esc((h.changedAt || "").slice(0,10)) }) + '</div>';
        }).join("");
        return '<div class="card" style="margin-bottom:8px;border:1px solid var(--border);padding:12px;">' +
          '<div style="display:flex;justify-content:space-between;align-items:center;">' +
          '<a href="' + esc(l.shortUrl || "") + '" target="_blank" style="font-weight:600;color:var(--accent);">' + esc(l.shortUrl || l.code) + '</a>' +
          '<span class="hint">' + (l.totalClicks || 0) + ' clicks</span>' +
          '</div>' +
          '<p class="hint" style="margin-top:4px;">→ ' + esc(l.url || "") + '</p>' +
          (historyHtml ? '<div style="margin-top:8px;padding-top:8px;border-top:1px dashed var(--border);"><p class="hint" style="margin-bottom:4px;">' + t("campaigns_history_title") + '</p>' + historyHtml + '</div>' : '') +
          '</div>';
      }).join("");
    }).catch(function(err){
      document.getElementById("historyDetail").innerHTML = '<div class="msg msg-error">' + esc(err.message) + '</div>';
    });
  }

  if (limits.hasCampaignHistory) {
    loadCampaigns();
  } else {
    var listEl = document.getElementById("campaignList");
    if (listEl) listEl.innerHTML = '<div class="msg msg-info">' + t("campaigns_requires") + ' <a href="#/pricing" class="btn btn-primary btn-sm" style="margin-left:8px;">' + t("upgrade_banner_btn") + '</a></div>';
  }
}

// ---------- TEAM TAB (Super) ----------
function renderTeamTab(app){
  var limits = state.limits || {};
  app.innerHTML = guideCard("team") + upgradeBanner() +
    '<div class="card"><h1>' + li('users', 14) + ' ' + t("team_tab_title") + helpLinkHtml('team-management-la-gi-huong-dan-quan-ly-link-theo-nhom', 'Team Management là gì? Xem hướng dẫn sử dụng') + '</h1>' +
    (limits.hasTeam ? '' : '<p class="sub">' + t("team_requires") + '</p>') +
    '<div id="teamInfo"><p class="hint">Đang tải...</p></div>' +
    (limits.hasTeam ? '<div class="card" style="margin-top:16px;border:1px solid var(--border);"><h2>' + li('plus', 14) + ' ' + t("team_create_title") + '</h2>' +
    '<label class="lbl">' + t("team_name_label") + '</label>' +
    '<input class="inp" id="teamName" type="text" placeholder="Marketing Team" />' +
    '<div id="teamCreateMsg" style="margin-top:10px;"></div>' +
    '<button class="btn btn-primary btn-sm" id="btnCreateTeam" style="margin-top:12px;">' + t("team_create_btn") + '</button>' +
    '</div>' : '') +
    '<div class="card" style="margin-top:16px;border:1px solid var(--border);"><h2>' + t("team_guide_title") + '</h2>' +
    '<p class="hint">' + t("team_guide_desc") + '</p>' +
    '<p class="hint">' + tf("team_guide_limit", { count: (limits.maxTeamMembers || 10) }) + '</p>' +
    '</div>' +
    '</div>';

  function loadTeam(newTeam){
    var infoEl = document.getElementById("teamInfo");
    api("/api/v1/teams", "GET").then(function(data){
      var teams = data.teams || [];
      if (newTeam && !teams.some(function(x){ return x.id === newTeam.id; })){ teams.unshift(newTeam); }
      if (teams.length === 0){
        infoEl.innerHTML = '<p class="hint">' + t("team_empty") + '</p>';
        return;
      }
      infoEl.innerHTML = teams.map(function(team){
        var isOwner = team.ownerId === state.user.id;
        var membersHtml = (team.members || []).map(function(m){
          return '<tr><td style="padding:6px;">' + esc(m.username) + '</td>' +
            '<td style="padding:6px;"><span class="badge ' + (m.role === "owner" ? "badge-pro" : "badge-free") + '">' + (m.role === "owner" ? "Owner" : "Member") + '</span></td>' +
            '<td style="padding:6px;font-size:12px;">' + esc((m.addedAt || "").slice(0,10)) + '</td>' +
            '<td style="padding:6px;text-align:right;">' + (m.role !== "owner" && isOwner ? '<button class="btn btn-ghost btn-sm btnRmMember" data-team="' + esc(team.id) + '" data-user="' + esc(m.username) + '">' + li("trash", 12) + '</button>' : '') + '</td></tr>';
        }).join("");
        
        return '<div class="card" style="margin-bottom:12px;border:1px solid var(--border);">' +
          '<h2 style="display:flex;justify-content:space-between;align-items:center;">' + esc(team.name) + 
          (isOwner ? ' <button class="btn btn-ghost btn-sm btnDelTeam" data-id="' + esc(team.id) + '" style="font-size:12px;">' + t("team_delete_btn") + '</button>' : '') +
          '</h2>' +
          '<p class="hint">' + t("team_created_on") + ' ' + esc((team.createdAt || "").slice(0,10)) + ' · ' + (team.members ? team.members.length : 0) + ' ' + t("team_members_count") + '</p>' +
          '<table style="width:100%;border-collapse:collapse;margin-top:12px;"><thead><tr>' +
          '<th style="text-align:left;padding:6px;border-bottom:1px solid var(--border);">' + t("team_col_member") + '</th>' +
          '<th style="text-align:left;padding:6px;border-bottom:1px solid var(--border);">' + t("team_col_role") + '</th>' +
          '<th style="text-align:left;padding:6px;border-bottom:1px solid var(--border);">Tham gia</th>' +
          '<th style="text-align:right;padding:6px;border-bottom:1px solid var(--border);"></th>' +
          '</tr></thead><tbody>' + membersHtml + '</tbody></table>' +
          (isOwner ? '<div style="margin-top:12px;display:flex;gap:8px;align-items:center;">' +
          '<input class="inp" id="addMember_' + esc(team.id) + '" type="text" placeholder="username" style="flex:1;" />' +
          '<button class="btn btn-primary btn-sm btnAddMember" data-team="' + esc(team.id) + '">' + li('plus', 12) + ' ' + t("team_add_btn") + '</button>' +
          '</div><div id="addMsg_' + esc(team.id) + '" style="margin-top:6px;"></div>' : '') +
          '</div>';
      }).join("");
      
      document.querySelectorAll(".btnDelTeam").forEach(function(btn){
        btn.onclick = function(){
          if (!confirm(t("team_delete_confirm"))) return;
          api("/api/v1/teams/" + this.getAttribute("data-id"), "DELETE").then(function(){
            loadTeam();
          }).catch(function(err){ alert(t("err_prefix") + " " + err.message); });
        };
      });
      document.querySelectorAll(".btnRmMember").forEach(function(btn){
        btn.onclick = function(){
          if (!confirm(t("team_remove_confirm"))) return;
          api("/api/v1/teams/members", "DELETE", { teamId: this.getAttribute("data-team"), username: this.getAttribute("data-user") }).then(function(){
            loadTeam();
          }).catch(function(err){ alert(t("err_prefix") + " " + err.message); });
        };
      });
      document.querySelectorAll(".btnAddMember").forEach(function(btn){
        btn.onclick = function(){
          var teamId = this.getAttribute("data-team");
          var input = document.getElementById("addMember_" + teamId);
          var msg = document.getElementById("addMsg_" + teamId);
          var username = input.value.trim();
          if (!username){ msg.innerHTML = '<div class="msg msg-error">' + t("team_err_username") + '</div>'; return; }
          msg.innerHTML = '<p class="hint">' + t("team_adding") + '</p>';
          api("/api/v1/teams/members", "POST", { teamId: teamId, username: username }).then(function(){
            msg.innerHTML = '<div class="msg msg-success">' + t("team_added") + '</div>';
            loadTeam();
          }).catch(function(err){
            msg.innerHTML = '<div class="msg msg-error">' + esc(err.message) + '</div>';
          });
        };
      });
    }).catch(function(err){
      infoEl.innerHTML = '<div class="msg msg-error">' + esc(err.message) + '</div>';
    });
  }

  if (limits.hasTeam){
    loadTeam();
    var createBtn = document.getElementById("btnCreateTeam");
    if (createBtn) createBtn.onclick = function(){
      var name = document.getElementById("teamName").value.trim();
      var msg = document.getElementById("teamCreateMsg");
      if (!name){ msg.innerHTML = '<div class="msg msg-error">' + t("team_err_name") + '</div>'; return; }
      msg.innerHTML = '<p class="hint">' + t("team_creating") + '</p>';
      api("/api/v1/teams", "POST", { name: name }).then(function(data){
        document.getElementById("teamName").value = "";
        msg.innerHTML = '<div class="msg msg-success">' + t("team_created") + '</div>';
        loadTeam(data.team);
      }).catch(function(err){
        msg.innerHTML = '<div class="msg msg-error">' + esc(err.message) + '</div>';
      });
    };
  }
}

// ---------- ACCOUNT ----------
function checkQrPaymentStatus(){
  api("/api/billing/qr-status").then(function(data){
    var payments = data.payments || [];
    if (payments.length === 0) return;
    payments.forEach(function(p){ showQrResultModal(p); });
  }).catch(function(){});
}

function showQrResultModal(p){
  var tierNames = { plus: "Plus", pro: "Pro", super: "Super" };
  var tierName = tierNames[p.tier] || p.tier;
  var supportEmail = "support@shurlvn.com";
  var domain = location.host;
  var username = (state.user && state.user.username) || "";
  var modal = document.createElement("div");
  modal.style.cssText = "position:fixed;inset:0;background:rgba(0,0,0,0.5);display:flex;align-items:center;justify-content:center;z-index:9999;";
  var card = document.createElement("div");
  card.style.cssText = "background:var(--card);border-radius:20px;padding:32px;max-width:440px;width:90%;text-align:center;box-shadow:0 20px 60px rgba(0,0,0,0.3);animation:qrPop 0.3s ease;";
  if (p.status === "approved"){
    card.innerHTML =
      '<div style="font-size:48px;margin-bottom:16px;">🎉</div>' +
      '<h2 style="margin:0 0 12px;font-size:22px;color:var(--text);">' + t("qr_success_title") + '</h2>' +
      '<p style="color:var(--text);font-size:15px;line-height:1.6;margin:0 0 8px;">' + tf("qr_success_desc1", { user: '<strong>' + esc(username) + '</strong>', tier: '<strong style="color:#6366f1;">' + tierName + '</strong>' }) + '</p>' +
      '<p style="color:var(--muted);font-size:13px;line-height:1.6;margin:0 0 20px;">' + tf("qr_success_desc2", { domain: domain }) + '</p>' +
      '<p style="color:var(--muted);font-size:13px;line-height:1.6;margin:0 0 24px;">' + tf("qr_success_desc3", { email: supportEmail }) + '</p>' +
      '<button id="qrAckBtn" class="btn btn-primary" style="width:100%;justify-content:center;border-radius:12px;padding:14px;font-weight:700;">' + t("btn_confirm") + '</button>';
  } else if (p.status === "revoked"){
    card.innerHTML =
      '<div style="font-size:40px;margin-bottom:16px;">' + li('alert', 40) + '</div>' +
      '<h2 style="margin:0 0 12px;font-size:20px;color:var(--text);">' + t("qr_revoked_title") + '</h2>' +
      '<p style="color:var(--text);font-size:15px;line-height:1.6;margin:0 0 8px;">' + tf("qr_revoked_desc1", { order: esc(p.orderId) }) + '</p>' +
      '<p style="color:var(--muted);font-size:13px;line-height:1.6;margin:0 0 8px;">' + t("qr_revoked_desc2") + '</p>' +
      '<p style="color:var(--muted);font-size:13px;line-height:1.6;margin:0 0 24px;">' + tf("qr_revoked_desc3", { email: supportEmail }) + '</p>' +
      '<div style="display:flex;gap:10px;">' +
      '<button id="qrAckBtn" class="btn btn-ghost" style="flex:1;justify-content:center;border-radius:12px;padding:14px;font-weight:700;">' + t("btn_understood") + '</button>' +
      '<button id="qrSupportBtn" class="btn btn-primary" style="flex:1;justify-content:center;border-radius:12px;padding:14px;font-weight:700;">' + t("contact_support_btn") + '</button>' +
      '</div>';
  } else {
    card.innerHTML =
      '<div style="font-size:40px;margin-bottom:16px;">' + li('alert', 40) + '</div>' +
      '<h2 style="margin:0 0 12px;font-size:20px;color:var(--text);">' + t("qr_fail_title") + '</h2>' +
      '<p style="color:var(--text);font-size:15px;line-height:1.6;margin:0 0 8px;">' + tf("qr_fail_desc1", { tier: '<strong>' + tierName + '</strong>' }) + '</p>' +
      '<p style="color:var(--muted);font-size:13px;line-height:1.6;margin:0 0 8px;"><strong>' + t("qr_fail_reason_label") + '</strong> ' + (p.rejectReason || t("qr_fail_reason_default")) + '</p>' +
      '<p style="color:var(--muted);font-size:13px;line-height:1.6;margin:0 0 24px;">' + tf("qr_fail_desc2", { email: supportEmail }) + '</p>' +
      '<div style="display:flex;gap:10px;">' +
      '<button id="qrAckBtn" class="btn btn-ghost" style="flex:1;justify-content:center;border-radius:12px;padding:14px;font-weight:700;">' + t("btn_understood") + '</button>' +
      '<button id="qrSupportBtn" class="btn btn-primary" style="flex:1;justify-content:center;border-radius:12px;padding:14px;font-weight:700;">' + t("contact_support_btn") + '</button>' +
      '</div>';
  }
  modal.appendChild(card);
  document.body.appendChild(modal);
  document.getElementById("qrAckBtn").onclick = function(){
    modal.remove();
    api("/api/billing/qr-status-ack", "POST", { orderId: p.orderId }).then(function(){
      if (p.status === "approved" || p.status === "revoked") { render(); renderSidebars(); }
    }).catch(function(){});
  };
  var supportBtn = document.getElementById("qrSupportBtn");
  if (supportBtn) supportBtn.onclick = function(){ openSupportEmail(); };
  modal.addEventListener("click", function(e){ if (e.target === modal) { document.getElementById("qrAckBtn").click(); } });
}

// === STRIPE SUCCESS/CANCEL MODALS ===
function showStripeSuccessModal(tierName){
  var modal = document.createElement("div");
  modal.style.cssText = "position:fixed;inset:0;background:rgba(0,0,0,0.5);display:flex;align-items:center;justify-content:center;z-index:9999;";
  var card = document.createElement("div");
  card.style.cssText = "background:var(--card);border-radius:20px;padding:32px;max-width:440px;width:90%;text-align:center;box-shadow:0 20px 60px rgba(0,0,0,0.3);animation:qrPop 0.3s ease;";
  card.innerHTML =
    '<div style="font-size:48px;margin-bottom:16px;">🎉</div>' +
    '<h2 style="margin:0 0 12px;font-size:22px;color:var(--text);">' + t("stripe_success_title") + '</h2>' +
    '<p style="color:var(--text);font-size:15px;line-height:1.6;margin:0 0 8px;">' + tf("stripe_success_desc1", { tier: '<strong style="color:#6366f1;">' + (tierName || '') + '</strong>' }) + '</p>' +
    '<p style="color:var(--muted);font-size:13px;line-height:1.6;margin:0 0 24px;">' + t("stripe_success_desc2") + '</p>' +
    '<button id="stripeAckBtn" class="btn btn-primary" style="width:100%;justify-content:center;border-radius:12px;padding:14px;font-weight:700;">' + t("btn_confirm") + '</button>';
  modal.appendChild(card);
  document.body.appendChild(modal);
  document.getElementById("stripeAckBtn").onclick = function(){ modal.remove(); render(); renderSidebars(); };
  modal.addEventListener("click", function(e){ if (e.target === modal) document.getElementById("stripeAckBtn").click(); });
}
function showStripeCancelModal(){
  var modal = document.createElement("div");
  modal.style.cssText = "position:fixed;inset:0;background:rgba(0,0,0,0.5);display:flex;align-items:center;justify-content:center;z-index:9999;";
  var card = document.createElement("div");
  card.style.cssText = "background:var(--card);border-radius:20px;padding:32px;max-width:440px;width:90%;text-align:center;box-shadow:0 20px 60px rgba(0,0,0,0.3);animation:qrPop 0.3s ease;";
  card.innerHTML =
    '<div style="font-size:40px;margin-bottom:16px;">' + li('alert', 40) + '</div>' +
    '<h2 style="margin:0 0 12px;font-size:20px;color:var(--text);">' + t("stripe_cancel_title") + '</h2>' +
    '<p style="color:var(--muted);font-size:14px;line-height:1.6;margin:0 0 24px;">' + t("stripe_cancel_desc") + '</p>' +
    '<button id="stripeCancelBtn" class="btn btn-ghost" style="width:100%;justify-content:center;border-radius:12px;padding:14px;font-weight:700;">' + t("btn_understood") + '</button>';
  modal.appendChild(card);
  document.body.appendChild(modal);
  document.getElementById("stripeCancelBtn").onclick = function(){ modal.remove(); };
  modal.addEventListener("click", function(e){ if (e.target === modal) document.getElementById("stripeCancelBtn").click(); });
}
function showVoucherSuccessModal(){
  var modal = document.createElement("div");
  modal.style.cssText = "position:fixed;inset:0;background:rgba(0,0,0,0.5);display:flex;align-items:center;justify-content:center;z-index:9999;";
  var card = document.createElement("div");
  card.style.cssText = "background:var(--card);border-radius:20px;padding:32px;max-width:440px;width:90%;text-align:center;box-shadow:0 20px 60px rgba(0,0,0,0.3);animation:qrPop 0.3s ease;";
  card.innerHTML =
    '<div style="font-size:48px;margin-bottom:16px;">🎉</div>' +
    '<h2 style="margin:0 0 12px;font-size:22px;color:var(--text);">' + t("voucher_success_title") + '</h2>' +
    '<p style="color:var(--text);font-size:15px;line-height:1.6;margin:0 0 8px;">' + t("voucher_success_desc1") + '</p>' +
    '<p style="color:var(--muted);font-size:13px;line-height:1.6;margin:0 0 24px;">' + t("voucher_success_desc2") + '</p>' +
    '<button id="voucherAckBtn" class="btn btn-primary" style="width:100%;justify-content:center;border-radius:12px;padding:14px;font-weight:700;">' + t("btn_confirm") + '</button>';
  modal.appendChild(card);
  document.body.appendChild(modal);
  document.getElementById("voucherAckBtn").onclick = function(){ modal.remove(); render(); renderSidebars(); };
  modal.addEventListener("click", function(e){ if (e.target === modal) document.getElementById("voucherAckBtn").click(); });
}
function showVoucherCancelModal(){
  var modal = document.createElement("div");
  modal.style.cssText = "position:fixed;inset:0;background:rgba(0,0,0,0.5);display:flex;align-items:center;justify-content:center;z-index:9999;";
  var card = document.createElement("div");
  card.style.cssText = "background:var(--card);border-radius:20px;padding:32px;max-width:440px;width:90%;text-align:center;box-shadow:0 20px 60px rgba(0,0,0,0.3);animation:qrPop 0.3s ease;";
  card.innerHTML =
    '<div style="font-size:40px;margin-bottom:16px;">' + li('alert', 40) + '</div>' +
    '<h2 style="margin:0 0 12px;font-size:20px;color:var(--text);">' + t("voucher_cancel_title") + '</h2>' +
    '<p style="color:var(--muted);font-size:14px;line-height:1.6;margin:0 0 24px;">' + t("voucher_cancel_desc") + '</p>' +
    '<button id="voucherCancelBtn" class="btn btn-ghost" style="width:100%;justify-content:center;border-radius:12px;padding:14px;font-weight:700;">' + t("btn_understood") + '</button>';
  modal.appendChild(card);
  document.body.appendChild(modal);
  document.getElementById("voucherCancelBtn").onclick = function(){ modal.remove(); };
  modal.addEventListener("click", function(e){ if (e.target === modal) document.getElementById("voucherCancelBtn").click(); });
}

function openChangePasswordModal(){
  var overlay = document.getElementById('pwdChangeOverlay');
  if (overlay) { overlay.style.display = 'flex'; return; }
  overlay = document.createElement('div');
  overlay.id = 'pwdChangeOverlay';
  overlay.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,0.5);z-index:9999;display:flex;align-items:center;justify-content:center;padding:16px;';
  overlay.innerHTML = '<div class="card" style="max-width:420px;width:100%;padding:24px;position:relative;">' +
    '<h2 style="font-size:18px;margin:0 0 16px;">' + li('key', 18) + ' ' + t("change_password") + '</h2>' +
    '<div id="pwdStep1" style="display:flex;flex-direction:column;gap:12px;">' +
    '<div><label style="font-size:12px;color:var(--muted);">' + t("old_password") + '</label><input id="pwdOld" type="password" style="width:100%;padding:10px 12px;border-radius:8px;border:1px solid var(--border);background:var(--card-solid);color:var(--text);font-size:14px;margin-top:4px;" placeholder="' + t("old_password") + '" /></div>' +
    '<div><label style="font-size:12px;color:var(--muted);">' + t("new_password") + '</label><input id="pwdNew" type="password" style="width:100%;padding:10px 12px;border-radius:8px;border:1px solid var(--border);background:var(--card-solid);color:var(--text);font-size:14px;margin-top:4px;" placeholder="' + t("new_password") + '" /></div>' +
    '<div><label style="font-size:12px;color:var(--muted);">' + t("confirm_password") + '</label><input id="pwdConfirm" type="password" style="width:100%;padding:10px 12px;border-radius:8px;border:1px solid var(--border);background:var(--card-solid);color:var(--text);font-size:14px;margin-top:4px;" placeholder="' + t("confirm_password") + '" /></div>' +
    '<div id="pwdMsg" style="font-size:13px;min-height:18px;"></div>' +
    '<div style="display:flex;gap:8px;margin-top:4px;"><button class="btn btn-primary" style="flex:1;justify-content:center;" onclick="sendChangePasswordCode()">' + li('send', 14) + ' ' + t("send_code") + '</button><button class="btn btn-ghost" onclick="closeChangePasswordModal()">' + t("cancel") + '</button></div>' +
    '<a href="#/forgot-password" style="font-size:12px;color:var(--indigo);margin-top:4px;" onclick="closeChangePasswordModal()">' + t("forgot_password") + ' →</a>' +
    '</div>' +
    '<div id="pwdStep2" style="display:none;flex-direction:column;gap:12px;">' +
    '<p style="font-size:13px;color:var(--muted);">' + t("code_sent_to_email") + '</p>' +
    '<div><label style="font-size:12px;color:var(--muted);">' + t("verify_code") + '</label><input id="pwdCode" type="text" maxlength="6" style="width:100%;padding:10px 12px;border-radius:8px;border:1px solid var(--border);background:var(--card-solid);color:var(--text);font-size:16px;letter-spacing:4px;text-align:center;margin-top:4px;" placeholder="000000" /></div>' +
    '<div id="pwdMsg2" style="font-size:13px;min-height:18px;"></div>' +
    '<div style="display:flex;gap:8px;margin-top:4px;"><button class="btn btn-primary" style="flex:1;justify-content:center;" onclick="confirmChangePassword()">' + t("confirm") + '</button><button class="btn btn-ghost" onclick="closeChangePasswordModal()">' + t("cancel") + '</button></div>' +
    '</div>' +
    '<button onclick="closeChangePasswordModal()" style="position:absolute;top:12px;right:12px;background:none;border:none;color:var(--muted);font-size:20px;cursor:pointer;padding:4px;">×</button>' +
    '</div>';
  document.body.appendChild(overlay);
}
function closeChangePasswordModal(){
  var o = document.getElementById('pwdChangeOverlay');
  if (o) o.remove();
}
function sendChangePasswordCode(){
  var oldPwd = document.getElementById('pwdOld').value;
  var newPwd = document.getElementById('pwdNew').value;
  var confirmPwd = document.getElementById('pwdConfirm').value;
  var msg = document.getElementById('pwdMsg');
  if (!oldPwd || !newPwd || !confirmPwd) { msg.innerHTML = '<span style="color:#f87171;">' + t("fill_all_fields") + '</span>'; return; }
  if (newPwd !== confirmPwd) { msg.innerHTML = '<span style="color:#f87171;">' + t("password_mismatch") + '</span>'; return; }
  if (newPwd.length < 9) { msg.innerHTML = '<span style="color:#f87171;">' + t("password_too_short") + '</span>'; return; }
  msg.innerHTML = '<span style="color:var(--amber);">⏳ ' + t("sending") + '</span>';
  api("/api/auth/forgot", "POST", { username: state.user.username, lang: currentLang }).then(function(r){
    if (r.success) {
      msg.innerHTML = '<span style="color:#4ade80;">✓ ' + t("code_sent") + '</span>';
      document.getElementById('pwdStep1').style.display = 'none';
      document.getElementById('pwdStep2').style.display = 'flex';
    } else {
      msg.innerHTML = '<span style="color:#f87171;">✗ ' + esc(r.error || t("send_failed")) + '</span>';
    }
  }).catch(function(e){
    msg.innerHTML = '<span style="color:#f87171;">✗ ' + t("send_failed") + '</span>';
  });
}
function confirmChangePassword(){
  var code = document.getElementById('pwdCode').value;
  var newPwd = document.getElementById('pwdNew').value;
  var msg = document.getElementById('pwdMsg2');
  if (!code || !newPwd) { msg.innerHTML = '<span style="color:#f87171;">' + t("fill_all_fields") + '</span>'; return; }
  msg.innerHTML = '<span style="color:var(--amber);">⏳ ' + t("processing") + '</span>';
  api("/api/auth/reset", "POST", { username: state.user.username, code: code, new_password: newPwd }).then(function(r){
    if (r.success) {
      msg.innerHTML = '<span style="color:#4ade80;">✓ ' + t("password_changed") + '</span>';
      setTimeout(closeChangePasswordModal, 2000);
    } else {
      msg.innerHTML = '<span style="color:#f87171;">✗ ' + esc(r.error || t("change_failed")) + '</span>';
    }
  }).catch(function(e){
    msg.innerHTML = '<span style="color:#f87171;">✗ ' + t("change_failed") + '</span>';
  });
}

function toggleLangPanel(){
  var panel = document.getElementById('langPanel');
  var arrow = document.getElementById('langArrow');
  if (!panel) return;
  if (panel.style.display === 'none' || panel.style.display === '') {
    panel.style.display = 'flex';
    panel.style.maxHeight = '200px';
    panel.style.opacity = '1';
    if (arrow) arrow.style.transform = 'rotate(90deg)';
  } else {
    panel.style.maxHeight = '0';
    panel.style.opacity = '0';
    if (arrow) arrow.style.transform = 'rotate(0deg)';
    setTimeout(function(){ panel.style.display = 'none'; }, 300);
  }
}
function renderAccount(app){
  var u = state.user, l = state.limits || {};
  var pageHead = '<div class="page-head"><h1>' + li('settings', 24) + ' ' + t("account", "Tài khoản") + '</h1><p class="sub" style="margin-top:4px;">Quản lý hồ sơ, gói dịch vụ, hạn mức và thanh toán của bạn.</p></div>';
  checkQrPaymentStatus();

  // --- Account Summary (if data available) ---
  var summaryHtml = '';
  if (u.linkCount !== undefined || u.qrCount !== undefined || u.totalClicks !== undefined) {
    summaryHtml = '<div class="card" style="margin-bottom:16px;"><h2 style="font-size:14px;margin:0 0 12px;">' + t("acct_overview") + '</h2><div style="display:flex;gap:24px;flex-wrap:wrap;">';
    if (u.linkCount !== undefined) summaryHtml += '<div><span style="font-size:12px;color:var(--muted);">Short URLs</span><div style="font-size:20px;font-weight:700;color:var(--stat-num-color);">' + fmtNum(u.linkCount) + '</div></div>';
    if (u.qrCount !== undefined) summaryHtml += '<div><span style="font-size:12px;color:var(--muted);">QR Codes</span><div style="font-size:20px;font-weight:700;color:var(--stat-num-color);">' + fmtNum(u.qrCount) + '</div></div>';
    if (u.totalClicks !== undefined) summaryHtml += '<div><span style="font-size:12px;color:var(--muted);">' + t("acct_total_clicks") + '</span><div style="font-size:20px;font-weight:700;color:var(--stat-num-color);">' + fmtNum(u.totalClicks) + '</div></div>';
    summaryHtml += '</div></div>';
  }

  // --- Profile card ---
  var profileCard = '<div class="card"><h2 style="font-size:15px;margin:0 0 12px;">' + li('user', 16) + ' ' + t("acct_profile_title") + '</h2>' +
    '<div style="display:flex;flex-direction:column;gap:8px;">' +
    '<div><span style="font-size:12px;color:var(--muted);">' + t("acct_username") + '</span><div style="font-size:15px;font-weight:600;color:var(--text);">' + esc(u.username) + '</div></div>' +
    (u.email ? '<div><span style="font-size:12px;color:var(--muted);">Email</span><div style="font-size:15px;color:var(--text);">' + esc(u.email) + '</div></div>' : '') +
    '<div><span style="font-size:12px;color:var(--muted);">' + t("acct_joined") + '</span><div style="font-size:14px;color:var(--text);">' + fmtDate(u.createdAt) + '</div></div>' +
    '</div></div>';

  // --- Current plan card ---
  var planName = roleLabel(u.role);
  var planStatus = t("acct_plan_active");
  var planStatusColor = '#22c55e';
  if (u.role !== 'free' && u.role !== 'guest' && u.role !== 'admin') {
    planStatus = t("acct_plan_running");
    if (u.roleExpiry && new Date(u.roleExpiry) < new Date()) {
      planStatus = t("acct_plan_expired");
      planStatusColor = '#f87171';
    }
  }
  var planCard = '<div class="card"><h2 style="font-size:15px;margin:0 0 12px;">' + li('card', 16) + ' ' + t("acct_plan_title") + '</h2>' +
    '<div style="display:flex;align-items:center;gap:10px;margin-bottom:12px;">' +
    '<span class="badge badge-' + u.role + '" style="font-size:16px;padding:8px 20px;">' + planName + '</span>' +
    '<span style="font-size:12px;padding:3px 10px;border-radius:6px;background:' + (planStatusColor === '#22c55e' ? 'rgba(34,197,94,0.15)' : 'rgba(248,113,113,0.15)') + ';color:' + planStatusColor + ';font-weight:700;">' + planStatus + '</span>' +
    '</div>';
  if (u.role === 'free' || u.role === 'guest') {
    planCard += '<p class="hint" style="margin:0 0 12px;">' + t("acct_free") + '</p>';
    planCard += '<div style="font-size:13px;color:var(--muted);margin-bottom:12px;">' +
  t("acct_joined_label") + ': ' + fmtDate(u.createdAt) +
  (u.roleExpiry ? '<br>' + t("acct_expiry_label") + ': ' + fmtDate(u.roleExpiry) : '') +
  '</div>';
    planCard += '<a class="btn btn-primary" href="#/pricing">' + li('unlock', 14) + ' ' + t("acct_upgrade_plan") + '</a>';
  } else {
    planCard += '<div style="font-size:13px;color:var(--text);line-height:1.8;">';
    if (u.upgradedAt) planCard += t("acct_start_label") + ': ' + fmtDate(u.upgradedAt) + '<br>';
    planCard += t("acct_expiry_label") + ': ' + (u.roleExpiry ? fmtDate(u.roleExpiry) : '—') + '<br>';
    planCard += t("acct_joined_label") + ': ' + fmtDate(u.createdAt);
    planCard += '</div>';
    if (u.roleExpiry) {
      var totalMs = new Date(u.roleExpiry) - new Date(u.upgradedAt || u.createdAt);
      var elapsedMs = Date.now() - new Date(u.upgradedAt || u.createdAt).getTime();
      var tierPct = totalMs > 0 ? Math.max(0, Math.min(100, (elapsedMs / totalMs) * 100)) : 100;
      planCard += '<div style="margin-top:10px;height:4px;border-radius:2px;background:var(--border);overflow:hidden;"><div style="height:100%;border-radius:2px;background:linear-gradient(90deg,#6366f1,#a855f7);width:' + tierPct + '%;"></div></div>';
    }
   planCard += '<div style="margin-top:12px;display:flex;gap:8px;"><a class="btn btn-ghost" href="#/pricing">' + li('settings', 14) + t("acct_manage_plan") + '</a></div>';
  }
  planCard += '</div>';

  // --- Limits card ---
  var limitsHtml = '<div class="card"><h2 style="font-size:15px;margin:0 0 16px;">' + li('chart', 16) + ' ' + t("tier_limits_title") + '</h2>';
  limitsHtml += '<div style="display:flex;flex-direction:column;gap:14px;">';
  // Short URLs per day
  limitsHtml += acctUsageBar(t("links_per_day"), l.dailyLinks != null ? l.dailyLinks : null, l.dailyLinks === 999999);
  // Bulk shorten
  if (l.hasBulkShorten) limitsHtml += acctUsageBar(t("bulk_title"), l.maxBulkBatch, l.maxBulkBatch === 999999);
  // API Requests
  if (l.hasApi) limitsHtml += acctUsageBar('API Requests', l.monthlyApiLimit, l.monthlyApiLimit === 999999);
  // Dynamic QR per month
  if (l.maxDynamicQrPerMonth) limitsHtml += acctUsageBar('QR động/tháng', l.maxDynamicQrPerMonth, l.maxDynamicQrPerMonth === 999999);
  // Feature toggles
  limitsHtml += '<div style="border-top:1px solid var(--border);padding-top:12px;display:flex;flex-direction:column;gap:6px;font-size:13px;">';
  limitsHtml += acctFeatRow(t("custom_alias"), l.hasCustomAlias);
  limitsHtml += acctFeatRow(t("advanced_mgmt"), l.hasAdvancedManagement);
  limitsHtml += acctFeatRow(t("detailed_stats"), l.hasDetailedAnalytics);
  limitsHtml += acctFeatRow(t("export") + ' (CSV)', l.hasDataExport);
  limitsHtml += acctFeatRow('Custom domain', l.hasCustomDomain);
  limitsHtml += acctFeatRow(t("pixel_tracking"), l.hasPixel);
  limitsHtml += acctFeatRow(t("ab_testing"), l.hasABTest);
  limitsHtml += acctFeatRow(t("deep_link"), l.hasDeepLink);
  limitsHtml += acctFeatRow(t("password_protect"), l.hasPasswordLink);
  limitsHtml += '</div>';
  limitsHtml += '</div></div>';

  // --- Payment history card ---
  var payHistCard = '<div class="card"><h2 style="font-size:15px;margin:0 0 12px;">' + li('card', 16) + ' ' + t("pay_history_title") + '</h2>' +
    '<div style="overflow-x:auto;"><table id="payHistTable" style="width:100%;"><thead><tr>' +
    '<th style="text-align:left;font-size:12px;padding:8px;">' + t("pay_date") + '</th>' +
    '<th style="text-align:left;font-size:12px;padding:8px;">' + t("acct_pay_plan") + '</th>' +
    '<th style="text-align:left;font-size:12px;padding:8px;">' + t("acct_pay_method") + '</th>' +
    '<th style="text-align:right;font-size:12px;padding:8px;">' + t("acct_pay_amount") + '</th>' +
    '<th style="text-align:center;font-size:12px;padding:8px;">' + t("pay_status") + '</th>' +
    '</tr></thead><tbody><tr><td colspan="5" class="hint" style="text-align:center;padding:16px;">' + t("loading") + '</td></tr></tbody></table></div></div>';

  // --- Voucher card ---
  var voucherCard = '<div class="card"><h2 style="font-size:15px;margin:0 0 8px;">' + li('unlock', 16) + ' ' + t("acct_voucher_title") + '</h2>' +
    '<p class="hint" style="margin:0 0 12px;">' + t("acct_voucher_hint") + '</p>' +
    '<div style="display:flex;gap:8px;"><input id="voucherCode" type="text" placeholder="' + t("acct_voucher_placeholder") + '" style="flex:1;padding:8px 12px;border-radius:8px;border:1px solid var(--border);background:var(--card-solid);color:var(--text);font-size:14px;" /><button class="btn btn-primary" onclick="redeemVoucherPage()">' + li('unlock', 14) + ' Kích hoạt</button></div>' +
    '<div id="voucherMsg" style="margin-top:8px;font-size:13px;"></div></div>';

  // --- Security card ---
  var secCard = '<div class="card"><h2 style="font-size:15px;margin:0 0 12px;">' + li('lock', 16) + ' ' + t("acct_security_title") + '</h2>';
  secCard += '<div style="display:flex;flex-direction:column;gap:14px;">';
  // Email
  if (u.email) {
    secCard += '<div style="display:flex;justify-content:space-between;align-items:center;padding:8px 0;border-bottom:1px solid var(--border);"><div><div style="font-size:12px;color:var(--muted);margin-bottom:2px;">Email</div><div style="font-size:14px;color:var(--text);">' + esc(u.email) + '</div></div></div>';
  }
  // Password
  secCard += '<div style="display:flex;justify-content:space-between;align-items:center;padding:8px 0;border-bottom:1px solid var(--border);"><div><div style="font-size:12px;color:var(--muted);margin-bottom:2px;">' + t("security_password") + '</div><div style="font-size:14px;color:var(--text);letter-spacing:2px;">••••••••</div></div><button class="btn btn-ghost btn-sm" style="font-size:12px;" onclick="openChangePasswordModal()">' + li('key', 14) + ' ' + t("change_password") + '</button></div>';
  // 2FA (admin only)
  if (u.role === "admin") {
    secCard += '<div style="display:flex;justify-content:space-between;align-items:center;padding:8px 0;border-bottom:1px solid var(--border);"><div><div style="font-size:12px;color:var(--muted);margin-bottom:2px;">2FA (TOTP)</div><div style="font-size:14px;color:var(--text);">' + (u.totpEnabled ? t("acct_2fa_enabled") : t("acct_2fa_disabled")) + '</div></div></div>';
  }
  // Session info
  var browserName = t("acct_browser");
  try {
    var ua = navigator.userAgent;
    if (ua.indexOf("Edg") > -1) browserName = "Edge";
    else if (ua.indexOf("Chrome") > -1) browserName = "Chrome";
    else if (ua.indexOf("Firefox") > -1) browserName = "Firefox";
    else if (ua.indexOf("Safari") > -1) browserName = "Safari";
  } catch(e) {}
  var platformName = "—";
  try { platformName = navigator.platform || "—"; } catch(e) {}
  secCard += '<div style="display:flex;justify-content:space-between;align-items:center;padding:8px 0;border-bottom:1px solid var(--border);"><div><div style="font-size:12px;color:var(--muted);margin-bottom:2px;">' + t("acct_session") + '</div><div style="font-size:13px;color:var(--text);">' + t("acct_current_device") + '</div><div style="font-size:11px;color:var(--muted);margin-top:2px;">' + esc(browserName) + ' · ' + esc(platformName) + '</div></div><span style="font-size:11px;padding:2px 8px;border-radius:6px;background:rgba(34,197,94,0.15);color:#22c55e;font-weight:600;">' + t("acct_session_active") + '</span></div>';
  // Language switcher
  secCard += '<div style="padding-top:8px;"><button class="btn btn-ghost btn-sm" style="width:100%;justify-content:space-between;" onclick="toggleLangPanel()"><span>' + li('setting', 14) + ' ' + t("language") + '</span><span id="langArrow" style="transition:transform 0.3s ease;">▶</span></button>';
  secCard += '<div id="langPanel" style="display:none;flex-wrap:wrap;gap:6px;margin-top:8px;overflow:hidden;transition:max-height 0.3s ease,opacity 0.3s ease;max-height:0;opacity:0;">';
  var langs = [["vi","Tiếng Việt"],["en","English"]];
  for (var li2 = 0; li2 < langs.length; li2++) {
    secCard += '<button class="btn btn-sm ' + (currentLang === langs[li2][0] ? "btn-primary" : "btn-ghost") + '" onclick="switchLang(&#39;' + langs[li2][0] + '&#39;)">' + langs[li2][1] + '</button>';
  }
  secCard += '</div></div>'
  secCard += '</div></div>';
  // --- Upgrade section (keep existing) ---
  var upgradeHtml = "";
  if (u.role === "free" || u.role === "guest"){
    upgradeHtml =
      '<div class="card"><h2>' + t("account_upgrade") + '</h2>' +
      '<p class="sub">' + t("account_upgrade_sub") + '</p>' +
      '<div class="row">' +
        '<div style="background:rgba(99,102,241,0.1);border:1px solid rgba(99,102,241,0.3);border-radius:16px;padding:24px;text-align:center;flex:1;">' +
        '<h2 style="margin:0 0 4px;color:#818cf8;">' + t("account_pro") + '</h2>' +
        '<p class="hint" style="margin-bottom:16px;">' + t("account_pro_desc") + '</p>' +
        '<ul style="text-align:left;font-size:14px;line-height:2;margin:0 0 20px;padding-left:18px;">' +
        '<li>' + li('check', 12) + ' ' + t("plan_pro_f1") + '</li>' +
        '<li>' + li('check', 12) + ' ' + t("bulk_title") + ' — ' + t("plan_pro_f2") + '</li>' +
        '<li>' + li('check', 12) + ' ' + t("custom_alias") + ' ' + t("plan_unlimited") + '</li>' +
        '<li>' + li('check', 12) + ' ' + t("plan_pro_f3") + '</li>' +
        '<li>' + li('check', 12) + ' ' + t("analytics_title") + ' ' + t("plan_pro_f4") + '</li>' +
        '<li>' + li('check', 12) + ' ' + t("plan_pro_f5") + '</li>' +
        '<li>' + li('check', 12) + ' API — ' + t("plan_pro_f6") + '</li>' +
        '<li>' + li('check', 12) + ' ' + t("export") + '</li>' +
        '<li>' + li('check', 12) + ' ' + t("pixel_tracking") + ' — ' + t("plan_pro_f7") + '</li>' +
        '<li>' + li('check', 12) + ' ' + t("ab_testing") + ' — ' + t("plan_pro_f8") + '</li>' +
        '<li>' + li('check', 12) + ' ' + t("deep_link") + ' — ' + t("plan_pro_f9") + '</li>' +
        '<li>' + li('check', 12) + ' ' + t("password_protect") + ' — ' + t("plan_unlimited") + '</li>' +
        '</ul>' +
        '<a class="btn btn-primary" style="width:100%;justify-content:center;" href="#/pricing">' + t("upgrade_pro") + '</a>' +
        '</div>' +
        '<div style="background:rgba(192,132,252,0.1);border:1px solid rgba(192,132,252,0.3);border-radius:16px;padding:24px;text-align:center;flex:1;">' +
        '<h2 style="margin:0 0 4px;color:#c084fc;">' + t("account_super") + '</h2>' +
        '<p class="hint" style="margin-bottom:16px;">' + t("account_super_desc") + '</p>' +
        '<ul style="text-align:left;font-size:14px;line-height:2;margin:0 0 20px;padding-left:18px;">' +
        '<li>' + li('send', 12) + ' ' + t("plan_super_f1") + '</li>' +
        '<li>' + li('send', 12) + ' ' + t("bulk_title") + ' — ' + t("plan_super_f2") + '</li>' +
        '<li>' + li('send', 12) + ' ' + t("plan_super_f3") + '</li>' +
        '<li>' + li('send', 12) + ' ' + t("analytics_title") + ' ' + t("plan_super_f4") + '</li>' +
        '<li>' + li('send', 12) + ' ' + t("plan_super_f5") + '</li>' +
        '<li>' + li('send', 12) + ' API — ' + t("plan_super_f6") + '</li>' +
        '<li>' + li('send', 12) + ' ' + t("plan_super_f7") + '</li>' +
        '<li>' + li('send', 12) + ' ' + t("export") + ' ' + t("plan_advanced") + '</li>' +
        '<li>' + li('send', 12) + ' ' + t("pixel_tracking") + ' — ' + t("plan_super_f8") + '</li>' +
        '<li>' + li('send', 12) + ' ' + t("ab_testing") + ' — ' + t("plan_super_f9") + '</li>' +
        '<li>' + li('send', 12) + ' ' + t("deep_link") + ' — ' + t("plan_super_f10") + '</li>' +
        '<li>' + li('send', 12) + ' ' + t("password_protect") + ' — ' + t("plan_super_f11") + '</li>' +
        '<li>' + li('send', 12) + ' ' + t("plan_priority_support") + '</li>' +
        '</ul>' +
        '<a class="btn btn-primary" style="width:100%;justify-content:center;" href="#/pricing">' + t("upgrade_super") + '</a>' +
        '</div>' +
      '</div>' +
      '</div>';
  } else if (u.role === "pro"){
    upgradeHtml =
      '<div class="card"><h2>' + t("upgrade_super") + '</h2>' +
      '<p class="sub">' + t("account_upgrade_sub") + '</p>' +
      '<div style="background:rgba(192,132,252,0.1);border:1px solid rgba(192,132,252,0.3);border-radius:16px;padding:24px;text-align:center;">' +
      '<h2 style="margin:0 0 4px;color:#c084fc;">' + t("account_super") + '</h2>' +
      '<p class="hint" style="margin-bottom:16px;">' + t("sidebar_pro_current") + '</p>' +
      '<ul style="text-align:left;font-size:14px;line-height:2;margin:0 0 20px;padding-left:18px;">' +
      '<li>' + li('alert', 12) + ' ' + t("plan_ps_f1") + '</li>' +
      '<li>' + li('alert', 12) + ' ' + t("bulk_title") + ' — ' + t("plan_ps_f2") + '</li>' +
      '<li>' + li('alert', 12) + ' ' + t("analytics_title") + ' ' + t("plan_super_f4") + '</li>' +
      '<li>' + li('alert', 12) + ' ' + t("plan_super_f5") + '</li>' +
      '<li>' + li('alert', 12) + ' API — ' + t("plan_ps_f5") + '</li>' +
      '<li>' + li('alert', 12) + ' ' + t("plan_super_f7") + '</li>' +
      '<li>' + li('alert', 12) + ' ' + t("pixel_tracking") + ' — ' + t("plan_super_f8") + '</li>' +
      '<li>' + li('alert', 12) + ' ' + t("ab_testing") + ' — ' + t("plan_ps_f8") + '</li>' +
      '<li>' + li('alert', 12) + ' ' + t("deep_link") + ' — ' + t("plan_ps_f9") + '</li>' +
      '<li>' + li('alert', 12) + ' ' + t("password_protect") + ' — ' + t("plan_super_f11") + '</li>' +
      '<li>' + li('alert', 12) + ' ' + t("plan_priority_support") + '</li>' +
      '</ul>' +
      '<a class="btn btn-primary" style="width:100%;justify-content:center;" href="#/pricing">' + t("upgrade_super") + '</a>' +
      '</div>' +
      '<div style="margin-top:20px;border-top:1px solid rgba(148,163,184,0.15);padding-top:18px;">' +
      '<button class="btn btn-ghost" onclick="redeemVoucherPage()">' + t("account_voucher_btn") + '</button>' +
      '</div>' +
      '</div>';
  }

  // --- Assemble page ---
  app.innerHTML =
    guideCard("account") +
    pageHead +
    summaryHtml +
    '<div style="display:grid;grid-template-columns:1fr 1fr;gap:16px;margin-bottom:16px;" class="acct-grid">' +
    profileCard + planCard +
    '</div>' +
    limitsHtml +
    payHistCard +
    '<div style="display:grid;grid-template-columns:1fr 1fr;gap:16px;margin-bottom:16px;" class="acct-grid">' +
    voucherCard + secCard +
    '</div>' +
    upgradeHtml;

  // Add responsive CSS
  if (!document.getElementById('acctStyle')) {
    var s = document.createElement('style');
    s.id = 'acctStyle';
    s.textContent = '@media(max-width:768px){.acct-grid{grid-template-columns:1fr !important;}}';
    document.head.appendChild(s);
  }

  // Load payment history
  fetch("/api/payment-history").then(function(r){ return r.json(); }).then(function(data){
    var tb = document.querySelector("#payHistTable tbody");
    if (!tb) return;
    if (!data.history || data.history.length === 0) {
      tb.innerHTML = '<tr><td colspan="5" class="hint" style="text-align:center;padding:16px;">' + t("pay_no_history") + '</td></tr>';
      return;
    }
    var rows = "";
    for (var i = 0; i < data.history.length; i++) {
      var h = data.history[i];
      var methodLabel = h.method === "stripe" ? "Stripe" : h.method === "bank_qr" ? t("acct_bank_qr") : h.method || "—";
      var amt = h.amount ? (h.amount / 100).toFixed(2) + " " + (h.currency || "usd").toUpperCase() : "—";
      var statusIcon = h.status === "success" ? '<span style="color:#4ade80;">✓ ' + t("pay_success") + '</span>' : '<span style="color:#f87171;">✗ ' + t("pay_failed") + '</span>';
      rows += '<tr>' +
        '<td style="font-size:12px;padding:8px;">' + fmtDate(h.createdAt) + '</td>' +
        '<td style="font-size:13px;padding:8px;">' + (h.tier || "—").toUpperCase() + '</td>' +
        '<td style="font-size:12px;padding:8px;">' + methodLabel + '</td>' +
        '<td style="font-size:13px;padding:8px;text-align:right;">' + amt + '</td>' +
        '<td style="font-size:12px;padding:8px;text-align:center;">' + statusIcon + '</td>' +
        '</tr>';
    }
    tb.innerHTML = rows;
  }).catch(function(){
    var tb = document.querySelector("#payHistTable tbody");
    if (tb) tb.innerHTML = '<tr><td colspan="5" class="hint" style="text-align:center;padding:16px;">' + t("pay_no_history") + '</td></tr>';
  });

  // Admin panel (only admin)
  if (u.role === "admin") {
    app.innerHTML +=
      '<div class="card"><h2>' + li('settings', 18) + ' ' + t("admin_title") + '</h2>' +
      '<p class="sub">' + t("admin_access") + '</p>' +
      '<a class="btn btn-primary" href="#/admin">' + li('shield', 14) + ' ' + t("admin_go") + '</a></div>';
  }
}
function acctUsageBar(label, limit, unlimited){
  if (limit == null) return '<div><div style="display:flex;justify-content:space-between;font-size:13px;margin-bottom:4px;"><span style="color:var(--muted);">' + label + '</span><span style="color:var(--muted);">—</span></div></div>';
  if (unlimited) return '<div><div style="display:flex;justify-content:space-between;font-size:13px;margin-bottom:4px;"><span style="color:var(--text);">' + label + '</span><span style="color:#22c55e;font-weight:600;">∞ Không giới hạn</span></div></div>';
  return '<div><div style="display:flex;justify-content:space-between;font-size:13px;margin-bottom:4px;"><span style="color:var(--text);">' + label + '</span><span style="color:var(--muted);">' + fmtNum(limit) + '</span></div><div style="height:6px;border-radius:3px;background:var(--stat-bg);overflow:hidden;"><div style="height:100%;border-radius:3px;background:var(--indigo);width:0%;"></div></div></div>';
}
function acctFeatRow(label, has){
  return '<div style="display:flex;justify-content:space-between;align-items:center;"><span style="color:var(--text);">' + label + '</span>' + (has ? '<span style="color:#22c55e;">✓</span>' : '<span style="color:var(--muted);">✗</span>') + '</div>';
}
function renderLegalPage(app, title, subtitle, sections){
  var toc = sections.map(function(s, i){
    return '<li><a href="javascript:void(0)" onclick="document.getElementById(&#39;ls' + i + '&#39;).scrollIntoView({behavior:&#39;smooth&#39;})">' + (i + 1) + '. ' + s.h + '</a></li>';
  }).join('');
  var body = sections.map(function(s, i){
    return '<h2 id="ls' + i + '" style="margin-top:24px;">' + (i + 1) + '. ' + s.h + '</h2><p style="color:var(--text);line-height:1.7;">' + s.p + '</p>';
  }).join('');
  app.innerHTML =
    '<div class="page-head"><h1>' + title + '</h1></div>' +
    '<p class="sub">' + subtitle + '</p>' +
    '<p class="hint">' + t("legal_last_updated") + ': 14/09/2026</p>' +
    '<div class="card"><ul style="margin:0;padding-left:20px;line-height:2;">' + toc + '</ul></div>' +
    '<div class="card">' + body + '</div>';
}
function renderTerms(app){
  var isEn = currentLang === "en";
  renderLegalPage(app, t("terms_title"), t("terms_subtitle"), isEn ? [
    { h: "Introduction", p: "SHURL is a link-shortening service with QR code generation, click tracking, and link management tools. By accessing or using the service, you agree to the terms below." },
    { h: "User Accounts", p: "Some features require an account (username/password, or Google sign-in). You are responsible for keeping your login credentials secure and for all activity under your account." },
    { h: "Using the Service", p: "The service is provided as-is. You agree to use it for its intended purpose and not to interfere with the normal operation of the system." },
    { h: "Short URLs and User Content", p: "You are responsible for the destination URL and content you shorten or share through the service. SHURL may disable or remove links that violate these terms or applicable law." },
    { h: "QR Codes and Related Features", p: "QR codes are generated from the content/URL you provide, via a third-party QR generation service. You are responsible for the content encoded in your QR codes." },
    { h: "Analytics and Statistics", p: "The service may record click data for links you create (e.g. time, country, device) to display statistics to you. See the Privacy Policy for details." },
    { h: "Free Plan and Paid Services", p: "SHURL offers a free plan and paid plans with different limits and features. Plan details and pricing shown on the Pricing page may change over time." },
    { h: "Prohibited Conduct", p: "You may not use the service to distribute malware, phishing, spam, unlawful content, or to infringe others' intellectual property or privacy rights, or attempt to exploit or attack the system." },
    { h: "Account Suspension or Termination", p: "SHURL may suspend or terminate an account that violates these terms without prior notice, particularly in cases of abuse or harm to the system or other users." },
    { h: "Intellectual Property", p: "SHURL's brand, interface, and source code are owned by its development team. Content you create (links, QR codes, related data) remains yours." },
    { h: "Limitation of Liability", p: "The service is provided as-is, without guarantee of continuous, error-free, or uninterrupted operation. SHURL is not liable for indirect damages arising from use or inability to use the service." },
    { h: "Changes to the Service and Terms", p: "SHURL may update, change, or discontinue part or all of its features, and may revise these terms over time. Updated versions will be posted on this page." },
    { h: "Governing Law and Dispute Resolution", p: "The parties will first seek to resolve disputes in good faith. Where necessary, disputes will be handled under the applicable law governing the service." },
    { h: "Contact", p: "For questions about these terms, please contact: support@shurlvn.com." }
  ] : [
    { h: "Giới thiệu", p: "SHURL là dịch vụ rút gọn liên kết (short URL) kèm theo tính năng tạo mã QR, theo dõi lượt click và các công cụ quản lý link. Bằng việc truy cập hoặc sử dụng dịch vụ, bạn đồng ý với các điều khoản dưới đây." },
    { h: "Tài khoản người dùng", p: "Một số tính năng yêu cầu tạo tài khoản (tên đăng nhập/mật khẩu, hoặc đăng nhập bằng Google). Bạn chịu trách nhiệm bảo mật thông tin đăng nhập và mọi hoạt động diễn ra dưới tài khoản của mình." },
    { h: "Sử dụng dịch vụ", p: "Dịch vụ được cung cấp theo hiện trạng (as-is). Bạn đồng ý sử dụng dịch vụ đúng mục đích và không can thiệp vào hoạt động bình thường của hệ thống." },
    { h: "Short URL và nội dung người dùng", p: "Bạn chịu trách nhiệm về URL đích và nội dung mà bạn rút gọn hoặc chia sẻ qua dịch vụ. SHURL có quyền vô hiệu hóa hoặc gỡ bỏ các liên kết vi phạm điều khoản này hoặc pháp luật hiện hành." },
    { h: "QR Code và các tính năng liên quan", p: "Mã QR được tạo dựa trên nội dung/URL do bạn cung cấp, thông qua dịch vụ tạo QR của bên thứ ba. Bạn chịu trách nhiệm về nội dung được mã hóa trong QR." },
    { h: "Analytics và dữ liệu thống kê", p: "Dịch vụ có thể ghi nhận số liệu lượt click trên các link bạn tạo (ví dụ: thời gian, quốc gia, thiết bị) để hiển thị thống kê cho bạn. Chi tiết xem tại Chính sách bảo mật." },
    { h: "Gói miễn phí và dịch vụ trả phí", p: "SHURL cung cấp gói miễn phí và các gói trả phí với giới hạn, tính năng khác nhau. Thông tin và giá gói hiển thị tại trang Bảng giá có thể thay đổi theo thời gian." },
    { h: "Hành vi bị cấm", p: "Nghiêm cấm sử dụng dịch vụ để phát tán mã độc, lừa đảo (phishing), spam, nội dung vi phạm pháp luật, xâm phạm quyền sở hữu trí tuệ hoặc quyền riêng tư của người khác, hoặc cố gắng khai thác/tấn công hệ thống." },
    { h: "Đình chỉ hoặc chấm dứt tài khoản", p: "SHURL có quyền tạm khóa hoặc chấm dứt tài khoản vi phạm điều khoản này mà không cần báo trước, đặc biệt trong trường hợp lạm dụng hoặc gây hại cho hệ thống hay người dùng khác." },
    { h: "Quyền sở hữu trí tuệ", p: "Thương hiệu, giao diện và mã nguồn của SHURL thuộc quyền sở hữu của đội ngũ phát triển. Nội dung bạn tạo ra (link, QR, dữ liệu liên quan) vẫn thuộc về bạn." },
    { h: "Giới hạn trách nhiệm", p: "Dịch vụ được cung cấp trên cơ sở hiện trạng, không đảm bảo hoạt động liên tục, không lỗi hoặc không gián đoạn. SHURL không chịu trách nhiệm cho thiệt hại gián tiếp phát sinh từ việc sử dụng hoặc không thể sử dụng dịch vụ." },
    { h: "Thay đổi dịch vụ và điều khoản", p: "SHURL có thể cập nhật, thay đổi hoặc ngừng một phần hay toàn bộ tính năng, cũng như điều chỉnh điều khoản này theo thời gian. Phiên bản cập nhật sẽ được đăng tại trang này." },
    { h: "Luật áp dụng và giải quyết tranh chấp", p: "Các bên ưu tiên giải quyết tranh chấp thông qua trao đổi thiện chí. Trường hợp cần thiết, tranh chấp sẽ được xử lý theo quy định pháp luật hiện hành áp dụng cho dịch vụ." },
    { h: "Liên hệ", p: "Mọi thắc mắc về điều khoản này, vui lòng liên hệ: support@shurlvn.com." }
  ]);
}
function renderPrivacy(app){
  var isEn = currentLang === "en";
  renderLegalPage(app, t("privacy_title"), t("privacy_subtitle"), isEn ? [
    { h: "Scope", p: "This policy applies to data collected and processed when you use the SHURL service." },
    { h: "Information We May Collect", p: "Depending on how you use the service, we may collect: your username, password (hashed, never stored as plain text), email (if provided or via Google sign-in), the URLs and QR codes you create, and click data for those links (e.g. time, country, device type, IP address)." },
    { h: "How We Use Information", p: "Information is used to provide and maintain the service, authenticate your account, show you statistics, provide technical support, and keep the system safe (e.g. rate-limiting to prevent spam)." },
    { h: "Short URL and Analytics Data", p: "For each link you create, the system may record click counts and some visit-related information (time, country, device, IP) to power the statistics shown in your Dashboard. If you enable advanced features like Pixel tracking or Webhooks, visit data for that link may also be sent to a third party you configure yourself (e.g. Facebook, Google, TikTok, or your own webhook URL) — collecting and using data through those tools is your responsibility as the link's creator." },
    { h: "Cookies and Storage Technology", p: "We use a login session cookie to keep you signed in. We do not use advertising or third-party tracking cookies on the SHURL platform itself." },
    { h: "Sharing Information with Third Parties", p: "We do not sell your personal information. Some parts of the service rely on third parties to operate, such as payment processing (Stripe, VietQR), sending email (Resend), Google sign-in, and generating QR code images (via api.qrserver.com). These parties only receive the data needed for their specific function." },
    { h: "Data Storage and Protection", p: "Data is stored on Cloudflare Workers KV infrastructure. Account passwords are hashed before storage, never stored as plain text." },
    { h: "Data Retention", p: "Once you delete a link, it's marked deleted and permanently purged after 24 hours unless you restore it in that window. Other data is kept for as long as your account is active or as reasonably needed to operate the service." },
    { h: "Your Rights", p: "You can view and edit your account information and manage your links from the Dashboard. You can contact us at the email below for help related to your personal data." },
    { h: "Account Security", p: "You are responsible for keeping your password and login credentials secure. Please notify us right away if you notice unauthorized access to your account." },
    { h: "Third-Party Services", p: "The service integrates the third parties listed in section 6 (Stripe, VietQR, Resend, Google, api.qrserver.com) along with Cloudflare infrastructure. Use of these services is subject to each provider's own privacy policy." },
    { h: "Children", p: "The service is not directed at children under 13, and we do not knowingly collect information from children in that age group." },
    { h: "Changes to This Privacy Policy", p: "This policy may be updated from time to time. New versions will be posted on this page along with the update date." },
    { h: "Contact", p: "For questions about this Privacy Policy, please contact: support@shurlvn.com." }
  ] : [
    { h: "Phạm vi áp dụng", p: "Chính sách này áp dụng cho dữ liệu được thu thập và xử lý khi bạn sử dụng dịch vụ SHURL." },
    { h: "Thông tin chúng tôi có thể thu thập", p: "Tùy theo cách bạn sử dụng dịch vụ, chúng tôi có thể thu thập: tên đăng nhập, mật khẩu (được băm/hash, không lưu dạng văn bản thô), email (nếu bạn cung cấp hoặc đăng nhập bằng Google), URL và mã QR bạn tạo, cùng dữ liệu lượt click trên các link đó (ví dụ: thời điểm, quốc gia, loại thiết bị, địa chỉ IP)." },
    { h: "Cách chúng tôi sử dụng thông tin", p: "Thông tin được dùng để cung cấp và duy trì dịch vụ, xác thực tài khoản, hiển thị số liệu thống kê cho bạn, hỗ trợ kỹ thuật, và bảo vệ an toàn hệ thống (ví dụ: giới hạn tần suất truy cập để chống spam)." },
    { h: "Dữ liệu Short URL và Analytics", p: "Với mỗi link bạn tạo, hệ thống có thể ghi nhận số lượt click và một số thông tin liên quan đến lượt truy cập (thời gian, quốc gia, thiết bị, IP) để phục vụ thống kê trong Dashboard của bạn. Nếu bạn bật các tính năng nâng cao như Pixel tracking hoặc Webhook, dữ liệu truy cập link đó cũng có thể được gửi tới bên thứ ba do chính bạn cấu hình (ví dụ Facebook, Google, TikTok, hoặc URL webhook riêng) — việc thu thập và sử dụng dữ liệu qua các công cụ này thuộc trách nhiệm của bạn với tư cách người tạo link." },
    { h: "Cookie và công nghệ lưu trữ", p: "Chúng tôi sử dụng một cookie phiên đăng nhập (session cookie) để duy trì trạng thái đăng nhập của bạn. Chúng tôi không sử dụng cookie quảng cáo hoặc theo dõi của bên thứ ba trên nền tảng SHURL." },
    { h: "Chia sẻ thông tin với bên thứ ba", p: "Chúng tôi không bán thông tin cá nhân của bạn. Một số chức năng của dịch vụ sử dụng bên thứ ba để vận hành, ví dụ: xử lý thanh toán (Stripe, VietQR), gửi email (Resend), đăng nhập bằng Google, và tạo hình ảnh mã QR (qua dịch vụ api.qrserver.com). Các bên này chỉ nhận dữ liệu cần thiết để thực hiện đúng chức năng tương ứng." },
    { h: "Lưu trữ và bảo vệ dữ liệu", p: "Dữ liệu được lưu trữ trên hạ tầng Cloudflare Workers KV. Mật khẩu tài khoản được băm (hash) trước khi lưu trữ, không lưu dưới dạng văn bản thô." },
    { h: "Thời gian lưu giữ dữ liệu", p: "Link sau khi bạn xóa sẽ được đánh dấu xóa và tự động xóa vĩnh viễn sau 24 giờ, trừ khi bạn khôi phục trong thời gian đó. Với các dữ liệu khác, chúng tôi lưu giữ trong thời gian tài khoản của bạn còn hoạt động hoặc theo nhu cầu vận hành hợp lý của dịch vụ." },
    { h: "Quyền của người dùng", p: "Bạn có thể xem, chỉnh sửa thông tin tài khoản và quản lý các link của mình trong Dashboard. Bạn có thể liên hệ với chúng tôi qua email bên dưới để được hỗ trợ liên quan đến dữ liệu cá nhân." },
    { h: "Bảo mật tài khoản", p: "Bạn chịu trách nhiệm bảo mật mật khẩu và thông tin đăng nhập của mình. Vui lòng thông báo cho chúng tôi ngay nếu phát hiện truy cập trái phép vào tài khoản." },
    { h: "Dịch vụ của bên thứ ba", p: "Dịch vụ có tích hợp một số bên thứ ba như đã nêu ở mục 6 (Stripe, VietQR, Resend, Google, api.qrserver.com) cùng hạ tầng Cloudflare. Việc sử dụng các dịch vụ này tuân theo chính sách bảo mật riêng của từng bên." },
    { h: "Trẻ em", p: "Dịch vụ không hướng đến đối tượng trẻ em dưới 13 tuổi và chúng tôi không chủ đích thu thập thông tin từ trẻ em trong độ tuổi này." },
    { h: "Thay đổi Chính sách bảo mật", p: "Chính sách này có thể được cập nhật theo thời gian. Phiên bản mới sẽ được đăng tại trang này kèm ngày cập nhật." },
    { h: "Liên hệ", p: "Mọi câu hỏi về Chính sách bảo mật, vui lòng liên hệ: support@shurlvn.com." }
  ]);
}
var adminTab = "overview";
function renderAdmin(app){
  if (state.user.role !== "admin"){ app.innerHTML = '<div class="card"><p class="sub">' + t("upgrade_to_unlock") + '</p></div>'; return; }
  app.innerHTML =
    guideCard("admin") +
    '<div class="page-head"><h1>' + li('shield', 24) + ' ' + t("admin_title") + '</h1></div>' +
    '<div class="card">' +
    '<div class="tabs">' +
    '<button data-t="overview" class="' + (adminTab==="overview"?"active":"") + '">' + li('chart', 14) + ' Overview</button>' +
    '<button data-t="users" class="' + (adminTab==="users"?"active":"") + '">' + t("admin_users") + '</button>' +
    '<button data-t="reports" class="' + (adminTab==="reports"?"active":"") + '">' + t("admin_reports") + '</button>' +
    '<button data-t="feedback" class="' + (adminTab==="feedback"?"active":"") + '">' + t("admin_feedback_tab") + '</button>' +
    '<button data-t="blacklist" class="' + (adminTab==="blacklist"?"active":"") + '">' + t("admin_blacklist") + '</button>' +
    '<button data-t="vouchers" class="' + (adminTab==="vouchers"?"active":"") + '">Voucher</button>' +
    '<button data-t="promo" class="' + (adminTab==="promo"?"active":"") + '">Khuyến mãi</button>' +
    '<button data-t="security" class="' + (adminTab==="security"?"active":"") + '">' + li('shield', 14) + ' Bảo mật</button>' +
    '<button data-t="qrpayments" class="' + (adminTab==="qrpayments"?"active":"") + '">' + li('card', 14) + ' QR Payments</button>' +
    '<button data-t="maintenance" class="' + (adminTab==="maintenance"?"active":"") + '">' + li('wrench', 14) + ' Bảo trì</button>' +
    '<button data-t="audit" class="' + (adminTab==="audit"?"active":"") + '">' + li('list', 14) + ' Nhật ký</button>' +
    '<button data-t="notifications" class="' + (adminTab==="notifications"?"active":"") + '">Thông báo</button>' +
    '<button data-t="settings" class="' + (adminTab==="settings"?"active":"") + '">Cài đặt</button>' +
    '</div><div id="adminBody"><p class="hint">Đang tải...</p></div></div>';

  app.querySelectorAll(".tabs button").forEach(function(b){
    b.onclick = function(){ adminTab = b.getAttribute("data-t"); renderAdmin(app); };
  });
  var body = document.getElementById("adminBody");
  if (adminTab === "overview") loadAdminOverview(body);
  else if (adminTab === "users") loadAdminUsers(body);
  else if (adminTab === "reports") loadAdminReports(body);
  else if (adminTab === "feedback") loadAdminFeedback(body);
  else if (adminTab === "blacklist") loadAdminBlacklist(body);
  else if (adminTab === "vouchers") loadAdminVouchers(body);
  else if (adminTab === "promo") loadAdminPromo(body);
  else if (adminTab === "security") loadAdminSecurity(body);
  else if (adminTab === "qrpayments") loadAdminQrPayments(body);
  else if (adminTab === "maintenance") loadAdminMaintenance(body);
  else if (adminTab === "audit") loadAdminAuditLog(body);
  else if (adminTab === "notifications") loadAdminNotifications(body);
  else if (adminTab === "settings") loadAdminSettings(body);
}

function loadAdminOverview(container){
  if (!container) return;
  if (!document.getElementById('ovStyle')) {
    var s = document.createElement('style');
    s.id = 'ovStyle';
    s.textContent = '.overview-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(240px,1fr));gap:12px;margin-bottom:20px;}' +
      '.overview-charts{display:grid;grid-template-columns:1fr 1fr;gap:16px;margin-bottom:20px;}' +
      '@media(max-width:768px){.overview-charts{grid-template-columns:1fr;}}' +
      '.ov-card{background:var(--card);border:1px solid var(--border);border-radius:12px;padding:16px;display:flex;flex-direction:column;gap:4px;transition:border-color 0.3s ease;}' +
      '.ov-card:hover{border-color:var(--indigo);}' +
      '.ov-card-icon{display:flex;align-items:center;gap:8px;margin-bottom:4px;}' +
      '.ov-card-label{font-size:12px;color:var(--muted);}' +
      '.ov-card-value{font-size:28px;font-weight:700;color:var(--stat-num-color);line-height:1.2;}' +
      '.ov-card-sub{font-size:12px;color:var(--muted);}' +
      '.ov-progress{height:6px;border-radius:3px;background:var(--stat-bg);overflow:hidden;margin-top:8px;}' +
      '.ov-progress-bar{height:100%;border-radius:3px;transition:width 0.5s ease;}' +
      '.ov-refresh{display:flex;justify-content:space-between;align-items:center;margin-bottom:16px;}' +
      '.ov-refresh h2{margin:0;font-size:18px;}' +
      '.ov-alert{padding:8px 12px;border-radius:8px;font-size:13px;margin:4px 0;}' +
      '.ov-alert-ok{background:rgba(16,185,129,0.1);color:var(--green);}' +
      '.ov-alert-warn{background:rgba(245,158,11,0.1);color:var(--amber);}' +
      '.ov-alert-crit{background:rgba(244,63,94,0.1);color:var(--red);}';
    document.head.appendChild(s);
  }
  container.innerHTML = '<p class="hint">Đang tải overview...</p>';
  function fetchOverview(){
    container.innerHTML = '<p class="hint">Đang tải...</p>';
    api("/api/admin/overview", "GET").then(function(data){
      renderOverviewCards(container, data);
    }).catch(function(err){
      container.innerHTML = '<p class="hint">Lỗi tải overview: ' + esc(err && err.message ? err.message : 'Không xác định') + ' <button class="btn btn-sm" id="ovRetryBtn">Thử lại</button></p>';
      var btn = document.getElementById('ovRetryBtn');
      if (btn) btn.onclick = fetchOverview;
    });
  }
  fetchOverview();
}
function renderOverviewCards(container, data){
  var u = data.users || {};
  var au = data.activeUsers || {};
  var su = data.shortUrls || {};
  var w = data.workers || {};
  var wr = w.requests || {};
  var wu = w.usage || {};
  var we = w.errors || {};
  var wc = w.cpuP90 || {};
  var p = data.payments || {};
  var rp = data.reports || {};
  var cards = '';
  cards += ovCard('users', 'Tổng người dùng', fmtNum(u.total), u.today > 0 ? '+' + u.today + ' hôm nay' : '', 'var(--indigo)');
  cards += ovCard('user', 'Người dùng hoạt động', au.available ? fmtNum(au.count) : '—', au.available ? 'Active trong 15 phút' : 'Chưa có dữ liệu lastSeen', 'var(--sky)');
  cards += ovCard('link', 'Tổng Short URLs', fmtNum(su.total), su.today > 0 ? '+' + su.today + ' hôm nay' : '', 'var(--green)');
  cards += ovCard('chart', 'Requests hôm nay', wr.available ? fmtNum(wr.count) : 'Unavailable', wr.available ? 'Worker requests' : 'Chưa có Cloudflare Analytics', 'var(--amber)');
  var usageVal = '', usageSub = '', usageBar = '';
  if (wu.available) {
    usageVal = fmtNum(wu.usedRequests) + ' / ' + fmtNum(wu.requestLimit);
    usageSub = wu.usagePercent + '% used · ' + (wu.planName || '') + ' · resets daily';
    var pct = Math.min(100, wu.usagePercent);
    var barColor = pct >= 95 ? 'var(--red)' : pct >= 80 ? 'var(--amber)' : 'var(--green)';
    usageBar = '<div class="ov-progress"><div class="ov-progress-bar" style="width:' + pct + '%;background:' + barColor + ';"></div></div>';
  } else {
    usageVal = 'Unavailable';
    usageSub = 'Chưa có Cloudflare API credentials';
  }
  cards += ovCardWithBar('settings', 'Workers Usage', usageVal, usageSub, 'var(--purple)', usageBar);
  cards += ovCard('alert', 'Workers Errors', we.available ? fmtNum(we.count) : 'Unavailable', we.available ? (we.count === 0 ? 'No errors today' : we.count + ' errors') : 'Chưa có Cloudflare Analytics', 'var(--red)');
  cards += ovCard('chart', 'CPU Time P90', wc.available ? wc.value + ' ms' : '—', wc.available ? 'CPU P90' : 'Chưa có Cloudflare Analytics', 'var(--sky)');
  cards += ovCard('card', 'Khách hàng trả phí', fmtNum(p.paidUsers), 'Stripe: ' + p.stripe + ' · QR: ' + p.qr, 'var(--green)');
  var revenueParts = [];
  if (p.revenueUsd > 0) revenueParts.push('$' + p.revenueUsd.toFixed(2));
  if (p.revenueVnd > 0) revenueParts.push(fmtNum(p.revenueVnd) + 'đ');
  var revenueVal = revenueParts.length > 0 ? revenueParts.join(' + ') : '—';
  cards += ovCard('card', 'Doanh thu', revenueVal, 'Stripe + QR (thành công)', 'var(--purple)');
  cards += ovCard('alert', 'Đơn QR chờ duyệt', fmtNum(p.pendingQr || 0), p.pendingQr > 0 ? 'Cần xử lý' : 'Không có đơn chờ', p.pendingQr > 0 ? 'var(--amber)' : 'var(--muted)');
  cards += ovCard('alert', 'Báo cáo chờ xử lý', fmtNum(rp.pending || 0), rp.pending > 0 ? 'Cần xem xét' : 'Không có báo cáo mới', rp.pending > 0 ? 'var(--red)' : 'var(--muted)');
  var cp = data.cronPurge;
  var cronStale = cp && (Date.now() - new Date(cp.ranAt).getTime()) > 2 * 3600 * 1000;
  if (!cp) {
    cards += ovCard('trash', 'Cron dọn dẹp', 'Chưa chạy', 'Chưa có lần chạy nào được ghi nhận', 'var(--muted)');
  } else if (!cp.ok) {
    cards += ovCard('trash', 'Cron dọn dẹp', 'Lỗi', fmtDate(cp.ranAt) + ' — ' + esc(cp.error || ''), 'var(--red)');
  } else {
    cards += ovCard('trash', 'Cron dọn dẹp', fmtNum(cp.purged) + ' đã xóa', (cronStale ? '⚠ Chưa chạy lại >2h — ' : '') + fmtDate(cp.ranAt) + ' · kiểm tra ' + fmtNum(cp.checked) + ' link', cronStale ? 'var(--amber)' : 'var(--green)');
  }
  var fl = data.failedLoginsToday || 0;
  cards += ovCard('lock', 'Đăng nhập thất bại hôm nay', fmtNum(fl), fl > 0 ? 'Theo dõi nếu tăng bất thường' : 'Không có', fl >= 10 ? 'var(--red)' : fl > 0 ? 'var(--amber)' : 'var(--muted)');
  var lastUpdated = data.workers && data.workers.requests && data.workers.requests.available ? 'Cập nhật: ' + new Date().toLocaleTimeString() : '';
  var html = '<div class="ov-refresh"><h2>' + li('chart', 18) + ' System Overview</h2><div style="display:flex;gap:8px;align-items:center;">' + (lastUpdated ? '<span style="font-size:11px;color:var(--muted);">' + lastUpdated + '</span>' : '') + '<button class="btn btn-sm" id="ovSyncCfBtn" title="Gọi Cloudflare GraphQL Analytics API ngay thay vì chờ cron hàng giờ">' + li('chart', 14) + ' Đồng bộ Cloudflare Analytics</button><button class="btn btn-sm" id="ovRefreshBtn">' + li('undo', 14) + ' Làm mới</button></div></div>';
  html += '<div id="ovSyncMsg"></div>';
  html += '<div class="overview-grid">' + cards + '</div>';
  html += '<div class="overview-charts">';
  html += '<div class="card" style="padding:16px;"><h3 style="margin:0 0 12px;font-size:14px;">Lượt gọi & Lỗi — 24 giờ qua</h3>';
  if (w.hourly && w.hourly.length > 0 && wr.available) {
    html += renderRequestsErrorsChart(w.hourly);
  } else {
    html += '<div style="height:180px;display:flex;flex-direction:column;align-items:center;justify-content:center;color:var(--muted);font-size:13px;">' + li('chart', 32) + '<p style="margin:8px 0 0;">Chưa có dữ liệu Cloudflare Analytics</p></div>';
  }
  html += '</div>';
  html += '<div class="card" style="padding:16px;"><h3 style="margin:0 0 12px;font-size:14px;">Tăng trưởng người dùng — 30 ngày qua</h3>';
  if (data.userGrowth && data.userGrowth.length > 0) {
    html += renderUserGrowthChart(data.userGrowth);
  } else {
    html += '<div style="height:180px;display:flex;align-items:center;justify-content:center;color:var(--muted);font-size:13px;">' + li('users', 32) + '<p style="margin:8px 0 0;">Chưa có dữ liệu</p></div>';
  }
  html += '</div>';
  html += '</div>';
  html += '<div class="card" style="padding:16px;margin-bottom:16px;"><h3 style="margin:0 0 8px;font-size:14px;">' + li('alert', 16) + ' System Alerts</h3>';
  var alerts = [];
  if (wu.available && wu.usagePercent >= 80) {
    alerts.push({ level: wu.usagePercent >= 95 ? 'crit' : 'warn', msg: 'Workers usage ' + wu.usagePercent + '% — ' + (wu.usagePercent >= 95 ? 'gần hết quota!' : 'cao') });
  }
  if (we.available && we.count > 0) {
    alerts.push({ level: 'warn', msg: 'Worker errors: ' + we.count + ' hôm nay' });
  }
  if (alerts.length === 0) {
    html += '<div class="ov-alert ov-alert-ok">' + li('check', 14) + ' System operating normally</div>';
  } else {
    for (var i = 0; i < alerts.length; i++) {
      var a = alerts[i];
      html += '<div class="ov-alert ov-alert-' + a.level + '">' + li('alert', 14) + ' ' + a.msg + '</div>';
    }
  }
  html += '</div>';
  container.innerHTML = html;
  var refreshBtn = document.getElementById('ovRefreshBtn');
  if (refreshBtn) {
    refreshBtn.onclick = function(){
      container.innerHTML = '<p class="hint">Đang tải...</p>';
      api("/api/admin/overview", "GET").then(function(data){ renderOverviewCards(container, data); }).catch(function(err){ container.innerHTML = '<p class="hint">Lỗi tải: ' + esc(err && err.message ? err.message : 'Không xác định') + ' <button class="btn btn-sm" id="ovRetryBtn">Thử lại</button></p>'; var b=document.getElementById('ovRetryBtn'); if(b) b.onclick=refreshBtn.onclick; });
    };
  }
  var syncBtn = document.getElementById('ovSyncCfBtn');
  var syncMsg = document.getElementById('ovSyncMsg');
  if (syncBtn) {
    syncBtn.onclick = function(){
      syncBtn.disabled = true;
      syncMsg.innerHTML = '<p class="hint">Đang gọi Cloudflare Analytics API...</p>';
      api("/api/admin/refresh-analytics", "POST").then(function(res){
        syncMsg.innerHTML = '<div class="msg msg-ok">Đã đồng bộ thành công.</div>';
        return api("/api/admin/overview", "GET");
      }).then(function(data){
        renderOverviewCards(container, data);
      }).catch(function(err){
        syncBtn.disabled = false;
        syncMsg.innerHTML = '<div class="msg msg-error">' + esc(err && err.message ? err.message : 'Đồng bộ thất bại') + '</div>';
      });
    };
  }
}
function ovCard(icon, label, value, sub, color){
  return '<div class="ov-card"><div class="ov-card-icon" style="color:' + color + ';">' + li(icon, 18) + '<span class="ov-card-label">' + label + '</span></div><div class="ov-card-value">' + value + '</div>' + (sub ? '<div class="ov-card-sub">' + sub + '</div>' : '') + '</div>';
}
function ovCardWithBar(icon, label, value, sub, color, barHtml){
  return '<div class="ov-card"><div class="ov-card-icon" style="color:' + color + ';">' + li(icon, 18) + '<span class="ov-card-label">' + label + '</span></div><div class="ov-card-value">' + value + '</div>' + (sub ? '<div class="ov-card-sub">' + sub + '</div>' : '') + (barHtml || '') + '</div>';
}

function renderRequestsErrorsChart(hourly){
  if (!hourly || hourly.length === 0) return '<div style="height:180px;display:flex;align-items:center;justify-content:center;color:var(--muted);">Chưa có dữ liệu</div>';
  var maxReq = 0;
  for (var i = 0; i < hourly.length; i++) { if (hourly[i].requests > maxReq) maxReq = hourly[i].requests; }
  if (maxReq === 0) maxReq = 1;
  var barW = 100 / hourly.length;
  var bars = '';
  for (var i = 0; i < hourly.length; i++) {
    var h = Math.max(2, (hourly[i].requests / maxReq) * 130);
    var errH = Math.max(0, (hourly[i].errors / maxReq) * 130);
    var label = hourly[i].hour.slice(11, 16);
    var reqLabel = hourly[i].requests > 0 ? '<div style="position:absolute;bottom:' + (h + errH + 2) + 'px;left:0;right:0;text-align:center;font-size:8px;color:var(--muted);white-space:nowrap;">' + hourly[i].requests + '</div>' : '';
    bars += '<div style="display:inline-block;width:' + barW + '%;height:160px;vertical-align:bottom;position:relative;">' +
      reqLabel +
      '<div style="position:absolute;bottom:0;left:1px;right:1px;height:' + h + 'px;background:var(--indigo);border-radius:2px 2px 0 0;opacity:0.8;" title="' + label + ' — ' + hourly[i].requests + ' lượt gọi, ' + hourly[i].errors + ' lỗi"></div>' +
      (errH > 0 ? '<div style="position:absolute;bottom:' + h + 'px;left:1px;right:1px;height:' + errH + 'px;background:var(--red);border-radius:2px 2px 0 0;opacity:0.9;" title="' + hourly[i].errors + ' lỗi"></div>' : '') +
      '</div>';
  }
  return '<div style="height:180px;position:relative;overflow:visible;white-space:nowrap;padding-top:14px;">' + bars + '</div>' +
    '<div style="display:flex;justify-content:space-between;font-size:10px;color:var(--muted);margin-top:4px;"><span>' + hourly[0].hour.slice(5, 16) + '</span><span>' + hourly[hourly.length-1].hour.slice(5, 16) + '</span></div>' +
    '<div style="display:flex;gap:12px;margin-top:6px;font-size:11px;color:var(--muted);"><span>' + li('chart', 10) + ' Lượt gọi</span><span style="color:var(--red);">Lỗi</span></div>';
}
function renderUserGrowthChart(growth){
  if (!growth || growth.length === 0) return '<div style="height:180px;display:flex;align-items:center;justify-content:center;color:var(--muted);">Chưa có dữ liệu</div>';
  var maxVal = 0;
  for (var i = 0; i < growth.length; i++) { if (growth[i].value > maxVal) maxVal = growth[i].value; }
  if (maxVal === 0) maxVal = 1;
  var barW = 100 / growth.length;
  var bars = '';
  for (var i = 0; i < growth.length; i++) {
    var h = Math.max(2, (growth[i].value / maxVal) * 140);
    var valLabel = growth[i].value > 0 ? '<div style="position:absolute;bottom:' + (h + 2) + 'px;left:0;right:0;text-align:center;font-size:8px;color:var(--muted);white-space:nowrap;">' + growth[i].value + '</div>' : '';
    bars += '<div style="display:inline-block;width:' + barW + '%;height:180px;vertical-align:bottom;position:relative;">' + valLabel +
      '<div style="position:absolute;bottom:0;left:1px;right:1px;height:' + h + 'px;background:var(--indigo);border-radius:2px 2px 0 0;opacity:0.8;" title="' + growth[i].date + ': ' + growth[i].value + ' người dùng"></div></div>';
  }
  return '<div style="height:196px;position:relative;overflow:visible;white-space:nowrap;padding-top:14px;">' + bars + '</div><div style="display:flex;justify-content:space-between;font-size:10px;color:var(--muted);margin-top:4px;"><span>' + growth[0].date + '</span><span>' + growth[growth.length-1].date + '</span></div>';
}

function loadAdminMaintenance(body){
  body.innerHTML = '<p class="hint">Đang tải...</p>';
  api("/api/admin/maintenance", "GET").then(function(data){
    var m = data.maintenance || {};
    var globalMaint = m.global || { active: false, note: "" };
    var features = [
      { key: "stripe", label: "Stripe (Thanh toán thẻ)", icon: li("card", 20), category: "Thanh toán" },
      { key: "qr_payment", label: "QR Ngân hàng (VietQR)", icon: li("building", 20), category: "Thanh toán" },
      { key: "voucher", label: "Voucher", icon: li("ticket", 20), category: "Thanh toán" },
      { key: "bulk", label: "Bulk Shorten", icon: li("package", 20), category: "Tính năng" },
      { key: "api", label: "API", icon: li("plug", 20), category: "Tính năng" },
      { key: "analytics", label: "Analytics", icon: li("chart", 20), category: "Tính năng" },
      { key: "password_link", label: "Link bảo mật (Password Link)", icon: li("key", 20), category: "Tính năng" },
      { key: "qr_code", label: "Tạo QR Code", icon: li("qr", 20), category: "Tính năng" },
      { key: "data_export", label: "Xuất dữ liệu (CSV/JSON)", icon: li("upload", 20), category: "Tính năng" },
      { key: "webhooks", label: "Webhooks", icon: "🪝", category: "Tính năng" },
      { key: "link_in_bio", label: "Link-in-bio", icon: li("user", 20), category: "Tính năng" },
      { key: "extension", label: "Kết nối tiện ích trình duyệt", icon: "🧩", category: "Tính năng" },
      { key: "ai_assistant", label: "Trợ lý Hỏi AI", icon: "🤖", category: "Tính năng" },
      { key: "login", label: "Đăng nhập / Đăng ký", icon: li("lock", 20), category: "Hệ thống" },
      { key: "shorten", label: "Tạo link rút gọn", icon: li("link", 20), category: "Hệ thống" }
    ];
    var html = '';
    var gChecked = globalMaint.active ? "checked" : "";
    var gNote = globalMaint.note || "";
    html += '<div style="margin-bottom:16px;padding:16px;border:2px solid ' + (globalMaint.active ? '#ef4444' : 'var(--border)') + ';border-radius:12px;background:' + (globalMaint.active ? 'rgba(239,68,68,0.05)' : 'transparent') + ';">';
    html += '<div style="display:flex;align-items:center;gap:12px;"><span style="font-size:24px;">🚨</span>';
    html += '<div style="flex:1;"><div style="font-weight:700;font-size:15px;">Bảo trì toàn hệ thống</div>';
    html += '<div style="font-size:12px;color:var(--muted);">Bật để khóa toàn bộ hệ thống. Chỉ admin mới truy cập được.</div></div>';
    html += '<label style="position:relative;display:inline-block;width:48px;height:26px;cursor:pointer;flex-shrink:0;">';
    html += '<input type="checkbox" id="mtGlobalToggle" ' + gChecked + ' style="opacity:0;width:0;height:0;">';
    html += '<span class="mt-slider" data-feature="global" style="position:absolute;inset:0;background:' + (globalMaint.active ? '#ef4444' : '#475569') + ';border-radius:24px;transition:0.3s;">';
    html += '<span style="position:absolute;top:3px;left:' + (globalMaint.active ? '25px' : '3px') + ';width:20px;height:20px;background:white;border-radius:50%;transition:0.3s;"></span></span></label></div>';
    html += '<input type="text" id="mtGlobalNote" value="' + esc(gNote) + '" placeholder="Thông báo bảo trì toàn hệ thống (hiện trên banner)" style="width:100%;padding:8px;margin-top:8px;border:1px solid var(--input-border);border-radius:6px;background:var(--input-bg);color:var(--text);font-size:13px;" /></div>';
    html += '<p class="hint" style="margin-bottom:16px;">Bật bảo trì từng tính năng. User sẽ thấy banner thông báo và không thể sử dụng tính năng đó.</p>';
    var lastCategory = null;
    for (var i = 0; i < features.length; i++) {
      var f = features[i];
      if (f.category !== lastCategory) {
        lastCategory = f.category;
        html += '<div style="font-weight:700;font-size:11px;color:var(--muted);text-transform:uppercase;letter-spacing:0.4px;margin:' + (i === 0 ? '0' : '14px') + ' 0 6px;">' + esc(lastCategory) + '</div>';
      }
      var item = m[f.key] || { active: false, note: "" };
      var checked = item.active ? "checked" : "";
      var noteVal = item.note || "";
      html += '<div style="display:flex;align-items:center;gap:12px;padding:12px;border:1px solid var(--border);border-radius:12px;margin-bottom:8px;">' +
        '<span style="font-size:20px;">' + f.icon + '</span>' +
        '<div style="flex:1;"><div style="font-weight:600;">' + f.label + '</div>' +
        '<input type="text" id="mtNote_' + f.key + '" value="' + esc(noteVal) + '" placeholder="Lý do bảo trì (tùy chọn)" style="width:100%;padding:6px 8px;margin-top:4px;border:1px solid var(--input-border);border-radius:6px;background:var(--input-bg);color:var(--text);font-size:12px;"></div>' +
        '<label style="position:relative;display:inline-block;width:44px;height:24px;cursor:pointer;flex-shrink:0;">' +
        '<input type="checkbox" id="mtToggle_' + f.key + '" ' + checked + ' style="opacity:0;width:0;height:0;">' +
        '<span class="mt-slider" data-feature="' + f.key + '" style="position:absolute;inset:0;background:' + (item.active ? '#6366f1' : '#475569') + ';border-radius:24px;transition:0.3s;">' +
        '<span style="position:absolute;top:3px;left:' + (item.active ? '23px' : '3px') + ';width:18px;height:18px;background:white;border-radius:50%;transition:0.3s;"></span></span></label></div>';
    }
    body.innerHTML = html;
    body.querySelectorAll(".mt-slider").forEach(function(sl){
      sl.onclick = function(){
        var feature = this.getAttribute("data-feature");
        var cb, note;
        if (feature === "global") {
          cb = document.getElementById("mtGlobalToggle");
          note = document.getElementById("mtGlobalNote").value;
        } else {
          cb = document.getElementById("mtToggle_" + feature);
          note = document.getElementById("mtNote_" + feature).value;
        }
        cb.checked = !cb.checked;
        if (feature === "global" && cb.checked) {
          if (!confirm("Bật bảo trì toàn hệ thống? Toàn bộ user sẽ không thể truy cập!")) { cb.checked = false; return; }
        }
        api("/api/admin/maintenance", "POST", { feature: feature, active: cb.checked, note: note }).then(function(){ loadAdminMaintenance(body); }).catch(function(err){ alert("Lỗi: " + err.message); loadAdminMaintenance(body); });
      };
    });
  }).catch(function(err){ body.innerHTML = '<p class="hint">Lỗi: ' + esc(err.message) + '</p>'; });
}

function loadAdminAuditLog(body){
  body.innerHTML = '<p class="hint">Đang tải nhật ký...</p>';
  api("/api/admin/audit-logs", "GET").then(function(data){
    var logs = data.logs || [];
    if (logs.length === 0) { body.innerHTML = '<p class="hint">Chưa có hoạt động nào được ghi lại.</p>'; return; }
    var actionLabels = { CHANGE_USER_ROLE: "Đổi role user", DISMISS_REPORT: "Bỏ qua báo cáo", DELETE_LINK: "Xóa link (admin)", ADD_BLACKLIST: "Thêm blacklist", REMOVE_BLACKLIST: "Xóa blacklist", CREATE_VOUCHER: "Tạo voucher", DELETE_VOUCHER: "Xóa voucher", DELETE_USER: "Xóa user", SEND_NOTIFICATION: "Gửi thông báo", BROADCAST_NOTIFICATION: "Gửi thông báo hàng loạt", BAN_USER: "Khóa user", UNBAN_USER: "Mở khóa user" };
    var actionIcons = { CHANGE_USER_ROLE: li("settings", 14), DISMISS_REPORT: li("alert", 14), DELETE_LINK: li("trash", 14), ADD_BLACKLIST: li("ban", 14), REMOVE_BLACKLIST: li("check", 14), CREATE_VOUCHER: li("ticket", 14), DELETE_VOUCHER: li("trash", 14), DELETE_USER: li("user", 14), SEND_NOTIFICATION: li("bell", 14), BROADCAST_NOTIFICATION: li("megaphone", 14), BAN_USER: li("lock", 14), UNBAN_USER: li("unlock", 14), SAVE_SETTINGS: li("settings", 14), APPLY_VOUCHER: li("ticket", 14), MAINTENANCE_TOGGLE: li("wrench", 14) };
    var html = '<div style="overflow-x:auto;"><table><thead><tr><th>Thời gian</th><th>Admin</th><th>Hành động</th><th>Chi tiết</th><th>IP</th></tr></thead><tbody>';
    for (var i = 0; i < logs.length; i++) {
      var l = logs[i];
      var label = actionLabels[l.action] || l.action;
      var icon = actionIcons[l.action] || "📝";
      var detail = "";
      if (l.action === "CHANGE_USER_ROLE") { detail = "User: <b>" + esc(l.details.username) + "</b> — " + esc(l.details.oldRole) + " → <b>" + esc(l.details.newRole) + "</b>"; }
      else if (l.action === "DELETE_LINK") { detail = "Link: <b>/" + esc(l.details.code) + "</b> → " + esc(l.details.url || "") + " (owner: " + esc(l.details.owner || "") + ")"; }
      else if (l.action === "ADD_BLACKLIST" || l.action === "REMOVE_BLACKLIST") { detail = esc(l.details.type) + ": <b>" + esc(l.details.value) + "</b>"; }
      else if (l.action === "CREATE_VOUCHER") { detail = "Code: <b>" + esc(l.details.code) + "</b> — " + esc(l.details.tier) + " (max " + l.details.maxUses + " uses)"; }
      else if (l.action === "DELETE_VOUCHER") { detail = "Code: <b>" + esc(l.details.code) + "</b>"; }
      else if (l.action === "DISMISS_REPORT") { detail = "Report ID: " + esc(l.details.reportId || ""); }
      else if (l.action === "DELETE_USER") { detail = "User: <b>" + esc(l.details.username) + "</b> — Đã xóa " + l.details.deletedLinks + " links"; }
      else if (l.action === "SEND_NOTIFICATION") { detail = "Gửi tới: <b>" + esc(l.details.targetUsername) + "</b> — " + esc(l.details.title); }
      else if (l.action === "BROADCAST_NOTIFICATION") { detail = "Tiêu đề: <b>" + esc(l.details.title) + "</b> — Gửi tới " + l.details.sentCount + " users"; }
      else if (l.action === "BAN_USER") { detail = "User: <b>" + esc(l.details.username) + "</b> — Lý do: " + esc(l.details.reason || ""); }
      else if (l.action === "UNBAN_USER") { detail = "User: <b>" + esc(l.details.username) + "</b>"; }
      else if (l.action === "SAVE_SETTINGS") { detail = "Đã lưu cài đặt he thong"; }
      else if (l.action === "APPLY_VOUCHER") { detail = "User: <b>" + esc(l.details.username) + "</b> - Voucher: " + esc(l.details.code) + " - Gói: " + esc(l.details.tier); }
      else if (l.action === "MAINTENANCE_TOGGLE") { detail = "Tính năng: <b>" + esc(l.details.feature) + "</b> - " + (l.details.active ? "Bật" : "Tắt") + (l.details.note ? " - " + esc(l.details.note) : ""); }
      else { detail = JSON.stringify(l.details); }
      html += '<tr><td style="white-space:nowrap;font-size:12px;">' + fmtDate(l.timestamp) + '</td><td><b>' + esc(l.admin) + '</b></td><td>' + icon + ' ' + label + '</td><td style="font-size:13px;">' + detail + '</td><td style="font-size:12px;color:var(--muted);">' + esc(l.ip || "") + '</td></tr>';
    }
    html += '</tbody></table></div>';
    body.innerHTML = html;
  }).catch(function(err){ body.innerHTML = '<p class="hint">Lỗi: ' + esc(err.message) + '</p>'; });
}
function loadAdminSettings(body){
  body.innerHTML = '<p class="hint">Đang tải...</p>';
  api("/api/admin/settings", "GET").then(function(data){
    var s = data.settings || {};
    var tc = data.tierConfig || {};
    var tiers = ["guest","free","plus","pro","super"];
    var tierLabels = { guest: "Guest", free: "Free", plus: "Plus", pro: "Pro", super: "Super" };
    var html = '<h3 style="margin:0 0 12px;">Cài đặt hệ thống</h3>';
    html += '<div style="margin-bottom:16px;padding:12px;border:1px solid var(--border);border-radius:8px;">';
    html += '<h4 style="margin:0 0 8px;">Giới hạn theo gói (override)</h4>';
    html += '<p class="hint" style="margin:0 0 8px;">Để trống để dùng mặc định. Nhập số để override.</p>';
    html += '<table style="width:100%;"><thead><tr><th>Goi</th><th>Links/ngày</th><th>Bulk batch</th><th>API limit/tháng</th></tr></thead><tbody>';
    for (var i = 0; i < tiers.length; i++) {
      var tk = tiers[i];
      var cfg = tc[tk] || {};
      var ov = (s.tierOverrides && s.tierOverrides[tk]) || {};
      html += '<tr><td><b>' + tierLabels[tk] + '</b></td>';
      html += '<td><input id="ov_' + tk + '_dailyLinks" type="number" placeholder="' + (cfg.dailyLinks || 0) + '" value="' + (ov.dailyLinks || "") + '" style="width:80px;padding:4px;border:1px solid var(--border);border-radius:4px;" /></td>';
      html += '<td><input id="ov_' + tk + '_maxBulkBatch" type="number" placeholder="' + (cfg.maxBulkBatch || 0) + '" value="' + (ov.maxBulkBatch || "") + '" style="width:80px;padding:4px;border:1px solid var(--border);border-radius:4px;" /></td>';
      html += '<td><input id="ov_' + tk + '_monthlyApiLimit" type="number" placeholder="' + (cfg.monthlyApiLimit || 0) + '" value="' + (ov.monthlyApiLimit || "") + '" style="width:100px;padding:4px;border:1px solid var(--border);border-radius:4px;" /></td>';
      html += '</tr>';
    }
    html += '</tbody></table></div>';
    html += '<div style="margin-bottom:16px;padding:12px;border:1px solid var(--border);border-radius:8px;">';
    html += '<h4 style="margin:0 0 8px;">Áp voucher cho user</h4>';
    html += '<div style="display:flex;gap:8px;flex-wrap:wrap;max-width:500px;">';
    html += '<input id="applyVoucherUser" placeholder="Username" class="input" style="padding:6px 10px;border:1px solid var(--border);border-radius:6px;flex:1;min-width:150px;" />';
    html += '<input id="applyVoucherCode" placeholder="Mã voucher" class="input" style="padding:6px 10px;border:1px solid var(--border);border-radius:6px;flex:1;min-width:150px;" />';
    html += '<button id="applyVoucherBtn" class="btn btn-primary" style="padding:6px 16px;">Áp voucher</button>';
    html += '</div></div>';
    html += '<button id="saveSettingsBtn" class="btn btn-primary" style="padding:8px 24px;font-size:14px;">' + li('save', 14) + ' Lưu cài đặt</button>';
    body.innerHTML = html;
    document.getElementById("saveSettingsBtn").onclick = function(){
      var tierOverrides = {};
      for (var j = 0; j < tiers.length; j++) {
        var t2 = tiers[j];
        var dl = document.getElementById("ov_" + t2 + "_dailyLinks").value;
        var mb = document.getElementById("ov_" + t2 + "_maxBulkBatch").value;
        var al = document.getElementById("ov_" + t2 + "_monthlyApiLimit").value;
        if (dl || mb || al) {
          tierOverrides[t2] = {};
          if (dl) tierOverrides[t2].dailyLinks = parseInt(dl);
          if (mb) tierOverrides[t2].maxBulkBatch = parseInt(mb);
          if (al) tierOverrides[t2].monthlyApiLimit = parseInt(al);
        }
      }
      var payload = {
        tierOverrides: tierOverrides
      };
      api("/api/admin/settings", "POST", payload).then(function(data2){
        alert(data2.message || "Da luu cai dat");
      }).catch(function(err){ alert(err.message); });
    };
    document.getElementById("applyVoucherBtn").onclick = function(){
      var u = document.getElementById("applyVoucherUser").value.trim();
      var c = document.getElementById("applyVoucherCode").value.trim();
      if (!u || !c) { alert("Nhập username và mã voucher"); return; }
      if (!confirm("Ap voucher [" + c + "] cho user [" + u + "]?")) return;
      api("/api/admin/vouchers/apply", "POST", { username: u, code: c }).then(function(data3){
        alert(data3.message || "Da ap voucher");
        document.getElementById("applyVoucherUser").value = "";
        document.getElementById("applyVoucherCode").value = "";
      }).catch(function(err){ alert(err.message); });
    };
  }).catch(function(err){
    body.innerHTML = '<div class="msg msg-error">' + esc(err.message) + '</div>';
  });
}

var ADMIN_NOTIF_TEMPLATES = {
  welcome: { label: "Chào mừng", title: "Chào mừng đến với SHURL!", message: "Cảm ơn bạn đã tham gia SHURL. Chúc bạn có trải nghiệm tuyệt vời!", type: "success" },
  security: { label: "Cảnh báo bảo mật", title: "Cảnh báo bảo mật", message: "Chúng tôi phát hiện hoạt động bất thường trên tài khoản của bạn. Nếu không phải bạn, vui lòng đổi mật khẩu ngay.", type: "danger" },
  maintenance: { label: "Bảo trì hệ thống", title: "Thông báo bảo trì", message: "Hệ thống sẽ bảo trì trong thời gian tới, một số tính năng có thể tạm gián đoạn. Xin lỗi vì sự bất tiện này.", type: "warning" },
  promo: { label: "Khuyến mãi", title: "Ưu đãi đặc biệt dành cho bạn!", message: "SHURL đang có chương trình khuyến mãi giới hạn thời gian — nâng cấp gói ngay để không bỏ lỡ.", type: "info" }
};

function loadAdminNotifications(body){
  var templateOptionsHtml = '<option value="">— Chọn mẫu có sẵn (tuỳ chọn) —</option>' +
    Object.keys(ADMIN_NOTIF_TEMPLATES).map(function(k){ return '<option value="' + k + '">' + esc(ADMIN_NOTIF_TEMPLATES[k].label) + '</option>'; }).join("");
  body.innerHTML =
    '<div style="margin-bottom:16px;">' +
    '<h3 style="margin:0 0 8px;">Gửi thông báo</h3>' +
    '<div style="display:flex;flex-direction:column;gap:8px;max-width:500px;">' +
    '<select id="notifTemplate" class="input" style="padding:8px;border:1px solid var(--border);border-radius:6px;">' + templateOptionsHtml + '</select>' +
    '<input id="notifTitle" placeholder="Tiêu đề thông báo" class="input" style="padding:8px;border:1px solid var(--border);border-radius:6px;" />' +
    '<textarea id="notifMsg" placeholder="Nội dung thông báo" class="input" style="padding:8px;border:1px solid var(--border);border-radius:6px;min-height:60px;"></textarea>' +
    '<select id="notifTarget" class="input" style="padding:8px;border:1px solid var(--border);border-radius:6px;"><option value="">Gửi cho tất cả users</option></select>' +
    '<select id="notifType" class="input" style="padding:8px;border:1px solid var(--border);border-radius:6px;"><option value="info">Info</option><option value="warning">Warning</option><option value="success">Success</option><option value="danger">Danger</option></select>' +
    '<label style="display:flex;align-items:center;gap:8px;font-size:13px;cursor:pointer;"><input type="checkbox" id="notifSendEmail" /> Cũng gửi email cho người nhận</label>' +
    '<button id="sendNotifBtn" class="btn btn-primary" style="padding:8px 16px;">Gửi thông báo</button>' +
    '</div></div>' +
    '<hr style="margin:16px 0;border:none;border-top:1px solid var(--border);" />' +
    '<div id="notifListContainer"><p class="hint">Dang tai...</p></div>';
  var container = document.getElementById("notifListContainer");
  api("/api/admin/users", "GET").then(function(data){
    var sel = document.getElementById("notifTarget");
    (data.users || []).forEach(function(u){
      if (u.role !== "admin") {
        var opt = document.createElement("option");
        opt.value = u.username;
        opt.textContent = u.username;
        sel.appendChild(opt);
      }
    });
  }).catch(function(){});
  document.getElementById("notifTemplate").onchange = function(){
    var tpl = ADMIN_NOTIF_TEMPLATES[this.value];
    if (!tpl) return;
    document.getElementById("notifTitle").value = tpl.title;
    document.getElementById("notifMsg").value = tpl.message;
    document.getElementById("notifType").value = tpl.type;
  };
  function attachSend(){
    document.getElementById("sendNotifBtn").onclick = function(){
      var title = document.getElementById("notifTitle").value.trim();
      var msg = document.getElementById("notifMsg").value.trim();
      var target = document.getElementById("notifTarget").value;
      var type = document.getElementById("notifType").value;
      var sendEmailToo = document.getElementById("notifSendEmail").checked;
      if (!title || !msg) { alert("Nhập tiêu đề và nội dung"); return; }
      var payload = { title: title, message: msg, type: type, sendEmailToo: sendEmailToo };
      if (target) payload.targetUsername = target;
      api("/api/admin/notifications", "POST", payload).then(function(data){
        alert(data.message || "Đã gửi thông báo");
        loadAdminNotifications(body);
      }).catch(function(err){ alert(err.message); });
    };
  }
  attachSend();
  api("/api/admin/notifications", "GET").then(function(data){
    var notifs = data.notifications || [];
    if (notifs.length === 0) { container.innerHTML = '<p class="hint">Chưa có thông báo nào.</p>'; return; }
    var typeIcons = { info: li("info", 16), warning: li("alert", 16), success: li("check", 16), danger: li("x", 16) };
    var html2 = '<div style="overflow-x:auto;"><table><thead><tr><th>Loại</th><th>Tiêu đề</th><th>Nội dung</th><th>Gửi tới</th><th>Đã đọc</th><th>Thời gian</th><th>Hành động</th></tr></thead><tbody>';
    for (var j = 0; j < notifs.length; j++) {
      var n = notifs[j];
      var icon = typeIcons[n.type] || "-";
      var tgt = n.targetUsername ? esc(n.targetUsername) : "Tất cả";
      var rs = n.read ? t("adm_notif_read") : t("adm_notif_unread");
      var shortMsg = esc(n.message);
      if (shortMsg.length > 60) shortMsg = shortMsg.substring(0, 60) + "...";
      html2 += '<tr data-notif-idx="' + j + '"><td>' + icon + '</td><td><b>' + esc(n.title) + '</b></td><td style="max-width:250px;"><span style="display:block;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;max-width:250px;">' + shortMsg + '</span></td><td>' + tgt + '</td><td>' + rs + '</td><td style="font-size:12px;color:var(--muted);">' + fmtDate(n.createdAt) + '</td><td style="white-space:nowrap"><button class="btn btn-ghost btn-sm admNotifViewBtn" style="font-size:11px;padding:2px 8px;">Xem</button> <button class="btn btn-ghost btn-sm admNotifDelBtn" style="font-size:11px;padding:2px 8px;color:#ef4444;">' + t("adm_notif_delete") + '</button></td></tr>';
    }
    html2 += '</tbody></table></div>';
    container.innerHTML = html2;
    container.querySelectorAll("tr[data-notif-idx]").forEach(function(tr) {
      var idx2 = parseInt(tr.getAttribute("data-notif-idx"));
      var n2 = notifs[idx2];
      tr.querySelector(".admNotifViewBtn").onclick = function() { showAdminNotifDetailModal(n2); };
      tr.querySelector(".admNotifDelBtn").onclick = function() {
        if (!confirm(t("adm_notif_delete_confirm"))) return;
        api("/api/admin/notifications/" + encodeURIComponent(n2.id), "DELETE").then(function(){
          // Chỉ xoá đúng dòng này khỏi DOM (mờ dần) thay vì gọi lại loadAdminNotifications() —
          // tránh render lại toàn bộ tab (form gửi + dropdown user + danh sách), gây giật/mất
          // dữ liệu đang nhập dở trong form.
          tr.style.transition = "opacity 0.15s ease";
          tr.style.opacity = "0";
          setTimeout(function(){
            tr.remove();
            if (!container.querySelector("tr[data-notif-idx]")) {
              container.innerHTML = '<p class="hint">Chưa có thông báo nào.</p>';
            }
          }, 150);
        }).catch(function(err){ alert(err.message); });
      };
    });
  }).catch(function(err){ container.innerHTML = '<p class="hint">Loi: ' + esc(err.message) + '</p>'; });
}

function showAdminNotifDetailModal(notif) {
  var existing = document.getElementById("adminNotifDetailModal");
  if (existing) existing.remove();
  var typeIcons = { info: li("info", 24), warning: li("alert", 24), success: li("check", 24), danger: li("x", 24), feedback: li("message", 24) };
  var typeColors = { info: "#3b82f6", warning: "#f59e0b", success: "#22c55e", danger: "#ef4444", feedback: "#8b5cf6" };
  var icon = typeIcons[notif.type] || li("info", 24);
  var color = typeColors[notif.type] || "#3b82f6";
  var timeStr = "";
  try { timeStr = new Date(notif.createdAt).toLocaleString("vi-VN"); } catch(e){}
  var modal = document.createElement("div");
  modal.id = "adminNotifDetailModal";
  modal.style.cssText = "position:fixed;inset:0;background:rgba(0,0,0,0.5);display:flex;align-items:center;justify-content:center;z-index:10001;";
  var card = document.createElement("div");
  card.style.cssText = "background:var(--card);border:1px solid var(--border);border-radius:16px;padding:24px;max-width:500px;width:90%;max-height:80vh;overflow-y:auto;box-shadow:0 20px 60px rgba(0,0,0,0.3);";
  var tgtText = notif.targetUsername ? esc(notif.targetUsername) : t("adm_notif_all_users");
  card.innerHTML =
    "<div style='display:flex;align-items:center;gap:12px;margin-bottom:16px;'>" +
    "<span style='flex-shrink:0;width:40px;height:40px;border-radius:50%;background:" + color + "20;color:" + color + ";display:flex;align-items:center;justify-content:center;'>" + icon + "</span>" +
    "<div style='flex:1;'><h3 style='margin:0;font-size:16px;font-weight:700;color:var(--text);'>" + esc(notif.title) + "</h3>" +
    "<div style='font-size:11px;color:var(--muted2);margin-top:2px;'>" + t("adm_notif_from") + ": " + esc(notif.from || "system") + " - " + timeStr + " - " + t("adm_notif_to") + ": " + tgtText + "</div></div>" +
    "<button id='closeAdmNotifModalBtn' style='background:none;border:none;color:var(--muted);font-size:22px;cursor:pointer;padding:0;flex-shrink:0;'>&times;</button>" +
    "</div>" +
    "<div style='font-size:14px;color:var(--text);line-height:1.6;white-space:pre-wrap;word-break:break-word;'>" + esc(notif.message) + "</div>" +
    "<div style='margin-top:20px;display:flex;justify-content:flex-end;'>" +
    "<button id='okAdmNotifModalBtn' class='btn btn-primary btn-sm' style='padding:8px 20px;'>" + t("adm_notif_close") + "</button>" +
    "</div>";
  modal.appendChild(card);
  document.body.appendChild(modal);
  document.getElementById("closeAdmNotifModalBtn").onclick = function() { modal.remove(); };
  document.getElementById("okAdmNotifModalBtn").onclick = function() { modal.remove(); };
  modal.onclick = function(e) { if (e.target === modal) modal.remove(); };
}

function loadAdminQrPayments(body){
  body.innerHTML = '<p class="hint">Đang tải...</p>';
  api("/api/admin/qr-payments").then(function(data){
    var payments = data.payments || [];
    if (payments.length === 0){
      body.innerHTML = '<p class="hint">Chưa có giao dịch QR nào.</p>';
      return;
    }
    var tierNames = { plus: "Plus", pro: "Pro", super: "Super" };
    var tierColors = { plus: "#4f46e5", pro: "#7c3aed", super: "#dc2626" };
    var periodLabels = { week: "1 tuần", month: "1 tháng", year: "1 năm" };
    var html = '<div style="display:flex;flex-direction:column;gap:12px;">';
    payments.forEach(function(p){
      var statusBadge = p.status === "pending" ? '<span class="badge" style="background:rgba(251,191,36,0.15);color:#fbbf24;padding:4px 10px;border-radius:8px;font-size:11px;font-weight:700;">⏳ Chờ duyệt</span>' :
        p.status === "approved" ? '<span class="badge" style="background:rgba(110,231,183,0.15);color:#6ee7b7;padding:4px 10px;border-radius:8px;font-size:11px;font-weight:700;">Đã duyệt</span>' :
        p.status === "revoked" ? '<span class="badge" style="background:rgba(148,163,184,0.15);color:#94a3b8;padding:4px 10px;border-radius:8px;font-size:11px;font-weight:700;">🔁 Đã thu hồi</span>' :
        '<span class="badge" style="background:rgba(253,164,175,0.15);color:#fda4af;padding:4px 10px;border-radius:8px;font-size:11px;font-weight:700;">❌ Từ chối</span>';
      var actions = '';
      if (p.status === "pending"){
        actions = '<button class="btn btn-primary btn-sm" style="margin-right:6px;" data-approve="' + p.orderId + '">Duyệt</button>' +
          '<button class="btn btn-danger btn-sm" data-reject="' + p.orderId + '">❌ Từ chối</button>';
      } else if (p.status === "approved"){
        actions = '<button class="btn btn-ghost btn-sm" style="color:#94a3b8;" data-revoke="' + p.orderId + '" title="Chỉ dùng khi duyệt nhầm">🔁 Thu hồi</button>';
      }
      var tierColor = tierColors[p.tier] || "#64748b";
      html += '<div style="background:var(--card);border:1px solid var(--border);border-radius:14px;padding:16px;box-shadow:0 2px 8px rgba(0,0,0,0.06);transition:box-shadow 0.2s ease;">' +
        '<div style="display:flex;justify-content:space-between;align-items:flex-start;flex-wrap:wrap;gap:8px;margin-bottom:12px;">' +
          '<div style="display:flex;align-items:center;gap:8px;">' +
            '<span style="background:' + tierColor + ';color:#fff;padding:3px 10px;border-radius:8px;font-size:12px;font-weight:700;">' + (tierNames[p.tier] || p.tier) + '</span>' +
            '<span style="font-size:12px;color:var(--muted);">' + (periodLabels[p.period] || p.period) + '</span>' +
          '</div>' +
          statusBadge +
        '</div>' +
        '<div style="font-family:monospace;font-size:11px;color:var(--muted);margin-bottom:8px;word-break:break-all;">' + esc(p.orderId) + '</div>' +
        '<div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:8px;">' +
          '<div style="display:flex;align-items:center;gap:12px;">' +
            '<span style="font-weight:700;font-size:14px;">' + esc(p.username) + '</span>' +
            '<span style="font-size:11px;color:var(--muted);">' + new Date(p.createdAt).toLocaleString("vi-VN") + '</span>' +
          '</div>' +
          '<div style="display:flex;align-items:center;gap:12px;">' +
            '<span style="font-weight:800;font-size:16px;color:' + tierColor + ';">' + (p.vndPrice || 0).toLocaleString() + 'đ</span>' +
            actions +
          '</div>' +
        '</div>' +
      '</div>';
    });
    html += '</div>';
    body.innerHTML = html;
    body.querySelectorAll('div[style*="border-radius:14px"]').forEach(function(card){ card.onmouseenter = function(){ this.style.boxShadow = '0 4px 16px rgba(0,0,0,0.12)'; }; card.onmouseleave = function(){ this.style.boxShadow = '0 2px 8px rgba(0,0,0,0.06)'; }; });
    body.querySelectorAll('[data-approve]').forEach(function(btn){ btn.onclick = function(){ approveQrPayment(this.getAttribute('data-approve')); }; });
    body.querySelectorAll('[data-reject]').forEach(function(btn){ btn.onclick = function(){ rejectQrPayment(this.getAttribute('data-reject')); }; });
    body.querySelectorAll('[data-revoke]').forEach(function(btn){ btn.onclick = function(){ revokeQrPayment(this.getAttribute('data-revoke')); }; });
  }).catch(function(err){ body.innerHTML = '<div class="msg msg-error">' + esc(err.message) + '</div>'; });
}

function approveQrPayment(orderId){
  if (!confirm("Duyệt giao dịch " + orderId + "? User sẽ được nâng cấp gói.")) return;
  api("/api/admin/qr-approve", "POST", { orderId: orderId }).then(function(){
    alert("Đã duyệt! User đã được nâng cấp.");
    var body = document.getElementById("adminBody");
    if (body) loadAdminQrPayments(body);
  }).catch(function(err){ alert(err.message); });
}

function rejectQrPayment(orderId){
  var reasons = [
    "Không tìm thấy giao dịch khớp với nội dung chuyển khoản",
    "Chưa nhập nội dung chuyển khoản",
    "Số tiền chuyển chưa đúng"
  ];
  var modal = document.createElement("div");
  modal.style.cssText = "position:fixed;inset:0;background:rgba(0,0,0,0.5);display:flex;align-items:center;justify-content:center;z-index:9999;";
  var card = document.createElement("div");
  card.style.cssText = "background:var(--card);border-radius:16px;padding:24px;max-width:420px;width:90%;box-shadow:0 20px 60px rgba(0,0,0,0.3);";
  card.innerHTML =
    '<h3 style="margin:0 0 16px;color:var(--text);">❌ Từ chối giao dịch</h3>' +
    '<p style="font-size:13px;color:var(--muted);margin:0 0 16px;font-family:monospace;word-break:break-all;">' + esc(orderId) + '</p>' +
    '<p style="font-size:14px;color:var(--text);margin:0 0 12px;font-weight:600;">Chọn lý do từ chối:</p>' +
    reasons.map(function(r, i){
      return '<label data-idx="' + i + '" style="display:flex;align-items:flex-start;gap:10px;padding:12px;border:1px solid var(--border);border-radius:10px;margin-bottom:8px;cursor:pointer;transition:border-color 0.15s ease;">' +
        '<input type="radio" name="rejectReason" value="' + i + '" style="margin-top:3px;">' +
        '<span style="font-size:13px;color:var(--text);line-height:1.5;">' + r + '</span>' +
      '</label>';
    }).join("") +
    '<div style="display:flex;gap:10px;margin-top:16px;">' +
    '<button id="cancelRejectBtn" class="btn btn-ghost" style="flex:1;justify-content:center;border-radius:10px;padding:12px;">Hủy</button>' +
    '<button id="confirmRejectBtn" class="btn btn-danger" style="flex:1;justify-content:center;border-radius:10px;padding:12px;font-weight:700;">Xác nhận từ chối</button>' +
    '</div>';
  modal.appendChild(card);
  document.body.appendChild(modal);
  modal.querySelectorAll('label[data-idx]').forEach(function(lbl){ lbl.onmouseenter = function(){ this.style.borderColor = '#fda4af'; }; lbl.onmouseleave = function(){ this.style.borderColor = 'var(--border)'; }; });
  document.getElementById("cancelRejectBtn").onclick = function(){ modal.remove(); };
  document.getElementById("confirmRejectBtn").onclick = function(){
    var selected = modal.querySelector('input[name="rejectReason"]:checked');
    if (!selected){ alert("Vui lòng chọn lý do từ chối."); return; }
    var reason = reasons[parseInt(selected.value)];
    modal.remove();
    api("/api/admin/qr-reject", "POST", { orderId: orderId, reason: reason }).then(function(){
      alert("Đã từ chối giao dịch.\\nLý do: " + reason);
      var body = document.getElementById("adminBody");
      if (body) loadAdminQrPayments(body);
    }).catch(function(err){ alert(err.message); });
  };
  modal.addEventListener("click", function(e){ if (e.target === modal) modal.remove(); });
}

function revokeQrPayment(orderId){
  var modal = document.createElement("div");
  modal.style.cssText = "position:fixed;inset:0;background:rgba(0,0,0,0.5);display:flex;align-items:center;justify-content:center;z-index:9999;";
  var card = document.createElement("div");
  card.style.cssText = "background:var(--card);border-radius:16px;padding:24px;max-width:420px;width:90%;box-shadow:0 20px 60px rgba(0,0,0,0.3);";
  card.innerHTML =
    '<h3 style="margin:0 0 12px;color:var(--text);">🔁 Thu hồi giao dịch đã duyệt</h3>' +
    '<p style="font-size:13px;color:var(--muted);margin:0 0 12px;font-family:monospace;word-break:break-all;">' + esc(orderId) + '</p>' +
    '<p style="font-size:13px;color:#f59e0b;background:rgba(245,158,11,0.1);border-radius:8px;padding:10px 12px;margin:0 0 16px;line-height:1.5;">' +
    'User sẽ bị hạ về đúng gói/thời hạn trước khi duyệt lệnh này, và sẽ nhận thông báo toàn màn hình + email xin lỗi. Chỉ dùng khi chắc chắn đã duyệt nhầm.</p>' +
    '<p style="font-size:14px;color:var(--text);margin:0 0 8px;font-weight:600;">Lý do thu hồi (tuỳ chọn):</p>' +
    '<textarea id="revokeReasonInput" placeholder="Vd: Duyệt nhầm giao dịch, giao dịch còn lại của user mới là hợp lệ" style="width:100%;min-height:70px;padding:10px;border:1px solid var(--border);border-radius:8px;background:var(--input-bg);color:var(--text);font-family:inherit;font-size:13px;box-sizing:border-box;"></textarea>' +
    '<div style="display:flex;gap:10px;margin-top:16px;">' +
    '<button id="cancelRevokeBtn" class="btn btn-ghost" style="flex:1;justify-content:center;border-radius:10px;padding:12px;">Huỷ</button>' +
    '<button id="confirmRevokeBtn" class="btn btn-danger" style="flex:1;justify-content:center;border-radius:10px;padding:12px;font-weight:700;">Xác nhận thu hồi</button>' +
    '</div>';
  modal.appendChild(card);
  document.body.appendChild(modal);
  document.getElementById("cancelRevokeBtn").onclick = function(){ modal.remove(); };
  document.getElementById("confirmRevokeBtn").onclick = function(){
    var reason = document.getElementById("revokeReasonInput").value.trim();
    modal.remove();
    api("/api/admin/qr-revoke", "POST", { orderId: orderId, reason: reason || undefined }).then(function(){
      alert("Đã thu hồi giao dịch. User đã được thông báo và gửi email.");
      var body = document.getElementById("adminBody");
      if (body) loadAdminQrPayments(body);
    }).catch(function(err){ alert(err.message); });
  };
  modal.addEventListener("click", function(e){ if (e.target === modal) modal.remove(); });
}

function loadAdminSecurity(body){
  body.innerHTML =
    '<div style="max-width:500px;">' +
    '<h3 style="margin:0 0 8px;">Xác thực 2 lớp (2FA)</h3>' +
    '<p class="hint" style="margin-bottom:16px;">Bật 2FA để bảo vệ tài khoản admin. Mỗi lần đăng nhập cần mã TOTP từ Google Authenticator.</p>' +
    '<div id="securityContent"><p class="hint">Đang tải...</p></div>' +
    '</div>';

  // Kiểm tra trạng thái 2FA
  api("/api/auth/me").then(function(data){
    var content = document.getElementById("securityContent");
    if (data.user && data.user.totpEnabled){
      content.innerHTML =
        '<div class="msg msg-ok">2FA đang bật. Tài khoản được bảo vệ bằng TOTP.</div>' +
        '<div style="margin-top:16px;"><button class="btn btn-danger" id="btnDisable2fa">Tắt 2FA</button></div>';
      document.getElementById("btnDisable2fa").onclick = function(){
        if (!confirm("Tắt 2FA? Tài khoản admin sẽ ít an toàn hơn.")) return;
        api("/api/auth/2fa/disable", "POST").then(function(){
          loadAdminSecurity(body);
        }).catch(function(err){ alert(err.message); });
      };
    } else {
      content.innerHTML =
        '<div class="msg msg-error">' + li('alert', 14) + ' ' + t("twofa_not_enabled_warning") + '</div>' +
        '<div style="margin-top:16px;"><button class="btn btn-primary" id="btnSetup2fa">Bật 2FA</button></div>';
      document.getElementById("btnSetup2fa").onclick = function(){
        api("/api/auth/2fa/setup", "POST").then(function(data){
          content.innerHTML =
            '<div style="text-align:center;">' +
            '<p style="margin-bottom:12px;"><b>Bước 1:</b> Mở Google Authenticator → Thêm mã → Quét QR</p>' +
            '<img src="' + data.qrUrl + '" style="width:200px;height:200px;border-radius:12px;border:2px solid var(--border);">' +
            '<p style="margin-top:12px;font-size:12px;color:var(--muted);">Hoặc nhập thủ công: <code style="background:var(--input-bg);padding:4px 8px;border-radius:4px;word-break:break-all;">' + esc(data.secret) + '</code></p>' +
            '<p style="margin-top:16px;margin-bottom:8px;"><b>Bước 2:</b> Nhập mã 6 số từ app</p>' +
            '<input type="text" id="totpVerifyCode" maxlength="6" placeholder="000000" style="text-align:center;font-size:20px;letter-spacing:4px;width:180px;padding:10px;border:1px solid var(--input-border);border-radius:8px;background:var(--input-bg);color:var(--text);">' +
            '<div style="margin-top:12px;"><button class="btn btn-primary" id="btnVerify2fa">Xác nhận</button></div>' +
            '<div id="verifyMsg" style="margin-top:10px;"></div>' +
            '</div>';
          document.getElementById("btnVerify2fa").onclick = function(){
            var code = document.getElementById("totpVerifyCode").value.trim();
            var vmsg = document.getElementById("verifyMsg");
            vmsg.innerHTML = '<p class="hint">Đang xác nhận...</p>';
            api("/api/auth/2fa/verify", "POST", { code: code }).then(function(){
              vmsg.innerHTML = '<div class="msg msg-ok">2FA đã bật thành công!</div>';
              setTimeout(function(){ loadAdminSecurity(body); }, 1500);
            }).catch(function(err){
              vmsg.innerHTML = '<div class="msg msg-error">' + esc(err.message) + '</div>';
            });
          };
        }).catch(function(err){ alert(err.message); });
      };
    }
  });
}

function loadAdminPromo(body){
  body.innerHTML = '<p class="hint">Đang tải...</p>';
  api("/api/admin/promo-settings", "GET").then(function(data){
    var p = data.settings || { active: false, tiers: {} };
    var tiers = ["plus", "pro", "super"];
    var tierNames = { plus: "Plus", pro: "Pro", super: "Super" };

    var html = '<div style="margin-bottom:20px;">' +
      '<h3 style="margin:0 0 8px;">' + li('settings', 16) + ' Cài đặt khuyến mãi</h3>' +
      '<p class="hint" style="margin-bottom:16px;">Bật/tắt giảm giá cho từng gói. Khuyến mãi sẽ hiện trên trang Bảng giá.</p>' +
      '<table style="width:100%;border-collapse:collapse;">' +
      '<thead><tr>' +
      '<th style="text-align:left;padding:8px;border-bottom:1px solid var(--border);">' + t("acct_pay_plan") + '</th>' +
      '<th style="text-align:center;padding:8px;border-bottom:1px solid var(--border);">% giảm</th>' +
      '<th style="text-align:center;padding:8px;border-bottom:1px solid var(--border);">Ngày bắt đầu</th>' +
      '<th style="text-align:center;padding:8px;border-bottom:1px solid var(--border);">Ngày kết thúc</th>' +
      '<th style="text-align:center;padding:8px;border-bottom:1px solid var(--border);">Bật/Tắt</th>' +
      '</tr></thead><tbody>';

    for (var i = 0; i < tiers.length; i++){
      var tk = tiers[i];
      var tp = p.tiers[tk] || {};
      html += '<tr>' +
        '<td style="padding:10px 8px;font-weight:700;">' + tierNames[tk] + '</td>' +
        '<td style="text-align:center;padding:8px;"><input type="number" id="promo_pct_' + tk + '" value="' + (tp.discountPercent || 0) + '" min="0" max="100" style="width:60px;padding:6px;border:1px solid var(--input-border);border-radius:6px;background:var(--input-bg);color:var(--text);text-align:center;"></td>' +
        '<td style="text-align:center;padding:8px;"><input type="date" id="promo_start_' + tk + '" value="' + (tp.startDate || "") + '" style="padding:6px;border:1px solid var(--input-border);border-radius:6px;background:var(--input-bg);color:var(--text);"></td>' +
        '<td style="text-align:center;padding:8px;"><input type="date" id="promo_end_' + tk + '" value="' + (tp.endDate || "") + '" style="padding:6px;border:1px solid var(--input-border);border-radius:6px;background:var(--input-bg);color:var(--text);"></td>' +
        '<td style="text-align:center;padding:8px;"><label style="display:inline-flex;align-items:center;cursor:pointer;"><input type="checkbox" id="promo_active_' + tk + '" ' + (tp.active ? 'checked' : '') + ' style="width:20px;height:20px;cursor:pointer;"></label></td>' +
        '</tr>';
    }

    html += '</tbody></table>' +
      '<div style="margin-top:16px;"><button class="btn btn-primary" id="btnSavePromo">💾 Lưu khuyến mãi</button></div>' +
      '<div id="promoMsg" style="margin-top:12px;"></div>' +
      '</div>';

    body.innerHTML = html;

    document.getElementById("btnSavePromo").onclick = function(){
      var settings = { active: false, tiers: {} };
      var anyActive = false;
      for (var j = 0; j < tiers.length; j++){
        var tj = tiers[j];
        var pct = parseInt(document.getElementById("promo_pct_" + tj).value) || 0;
        var start = document.getElementById("promo_start_" + tj).value;
        var end = document.getElementById("promo_end_" + tj).value;
        var act = document.getElementById("promo_active_" + tj).checked;
        settings.tiers[tj] = { discountPercent: pct, startDate: start, endDate: end, active: act };
        if (act) anyActive = true;
      }
      settings.active = anyActive;
      var msg = document.getElementById("promoMsg");
      msg.innerHTML = '<p class="hint">Đang lưu...</p>';
      api("/api/admin/promo-settings", "POST", settings).then(function(){
        msg.innerHTML = '<div class="msg msg-ok">Đã lưu cài đặt khuyến mãi.</div>';
      }).catch(function(err){
        msg.innerHTML = '<div class="msg msg-error">' + esc(err.message) + '</div>';
      });
    };
  }).catch(function(){
    body.innerHTML = '<div class="msg msg-error">Lỗi tải cài đặt khuyến mãi.</div>';
  });
}

function loadAdminVouchers(body, newVoucher){
  body.innerHTML =
    '<div style="margin-bottom:16px;"><button class="btn btn-primary" onclick="createVoucher()">' + t("admin_create_voucher") + '</button></div>' +
    '<table id="voucherTable"><thead><tr>' +
    '<th>' + t("admin_voucher_code") + '</th><th>' + t("admin_tier") + '</th><th>' + t("admin_used") + '</th><th>' + t("admin_limit") + '</th><th>' + t("admin_expires") + '</th><th>' + t("admin_status") + '</th><th></th>' +
    '</tr></thead><tbody><tr><td colspan="7" class="hint">' + t("processing") + '</td></tr></tbody></table>';
  fetch("/api/admin/vouchers").then(function(r){ return r.json(); }).then(function(data){
    var vouchers = data.vouchers || [];
    if (newVoucher && !vouchers.some(function(v){ return v.code === newVoucher.code; })){ vouchers.unshift(newVoucher); }
    var tb = document.querySelector("#voucherTable tbody");
    if (vouchers.length === 0){
      tb.innerHTML = '<tr><td colspan="7" class="hint">' + t("admin_no_reports") + '</td></tr>';
      return;
    }
    var rows = "";
    for (var i = 0; i < vouchers.length; i++){
      var v = vouchers[i];
      var expired = new Date(v.expiresAt) < new Date();
      var status = !v.active ? t("disabled") : expired ? t("admin_expires") : t("enabled");
      var statusColor = !v.active || expired ? "var(--red)" : "var(--green)";
      rows += '<tr>' +
        '<td class="mono">' + esc(v.code) + '</td>' +
        '<td><span class="badge badge-' + v.tier + '">' + v.tier.toUpperCase() + '</span></td>' +
        '<td>' + v.usedCount + '</td>' +
        '<td>' + v.maxUses + '</td>' +
        '<td>' + fmtDate(v.expiresAt) + '</td>' +
        '<td style="color:' + statusColor + ';">' + status + '</td>' +
        '<td><button class="btn btn-ghost" style="color:var(--red);" data-code="' + v.code + '" onclick="deleteVoucher(this.dataset.code)">' + t("admin_delete") + '</button></td>' +
      '</tr>';
    }
    tb.innerHTML = rows;
  }).catch(function(){
    document.querySelector("#voucherTable tbody").innerHTML = '<tr><td colspan="7" class="hint">' + t("bulk_errors") + '</td></tr>';
  });
}

function deleteVoucher(code){
  if (!confirm(t("admin_delete") + " " + code + "?")) return;
  fetch("/api/admin/vouchers/" + encodeURIComponent(code), { method: "DELETE" })
    .then(function(r){ return r.json(); })
    .then(function(data){
      if (data.success){
        alert(t("admin_delete") + " " + code);
        loadAdminVouchers(document.getElementById("adminBody"));
      } else {
        alert(data.error || t("bulk_errors"));
      }
    });
}

function li(icon, size) {
  var s = size || 16;
  var p = 'fill:none;stroke:currentColor;stroke-width:2;stroke-linecap:round;stroke-linejoin:round';
  var icons = {
    bell: '<path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/>',
    help: '<path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/>',
    help_circle: '<circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/>',
    message: '<path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>',
    sparkles: '<path d="M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.937A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z"/><path d="M20 3v4"/><path d="M22 5h-4"/><path d="M4 17v2"/><path d="M5 18H3"/>',
    trash: '<path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/><line x1="10" y1="11" x2="10" y2="17"/><line x1="14" y1="11" x2="14" y2="17"/>',
    lock: '<rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>',
    unlock: '<rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 9.9-1"/>',
    megaphone: '<path d="m3 11 18-5v12L3 14v-3z"/><path d="M11.6 16.8a3 3 0 1 1-5.8-1.6"/>',
    settings: '<path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/><circle cx="12" cy="12" r="3"/>',
    ticket: '<path d="M2 9a3 3 0 0 1 0 6v2a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-2a3 3 0 0 1 0-6V7a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2Z"/><path d="M13 5v2"/><path d="M13 17v2"/><path d="M13 11v2"/>',
    upload: '<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/>',
    link: '<path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/>',
    key: '<path d="m15.5 7.5 2.3 2.3a1 1 0 0 0 1.4 0l2.1-2.1a1 1 0 0 0 0-1.4L19 4"/><path d="m21 2-9.6 9.6"/><circle cx="7.5" cy="15.5" r="5.5"/>',
    card: '<rect width="20" height="14" x="2" y="5" rx="2"/><line x1="2" x2="22" y1="10" y2="10"/>',
    package: '<path d="m7.5 4.27 9 5.15"/><path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z"/><path d="m3.3 7 8.7 5 8.7-5"/><path d="M12 22V12"/>',
    plug: '<path d="M12 22v-5"/><path d="M9 8V2"/><path d="M15 8V2"/><path d="M18 8v5a4 4 0 0 1-4 4h-4a4 4 0 0 1-4-4V8Z"/>',
    zap: '<polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>',
    target: '<circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/>',
    code2: '<polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/>',
    chart: '<line x1="12" x2="12" y1="20" y2="10"/><line x1="18" x2="18" y1="20" y2="4"/><line x1="6" x2="6" y1="20" y2="16"/>',
    shield: '<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10"/><path d="M12 8v4"/><path d="M12 16h.01"/>',
    building: '<path d="M6 22V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v18Z"/><path d="M6 12H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h2"/><path d="M18 9h2a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2h-2"/><path d="M10 6h4"/><path d="M10 10h4"/><path d="M10 14h4"/><path d="M10 18h4"/>',
    qr: '<rect width="5" height="5" x="3" y="3" rx="1"/><rect width="5" height="5" x="16" y="3" rx="1"/><rect width="5" height="5" x="3" y="16" rx="1"/><path d="M21 16h-3a2 2 0 0 0-2 2v3"/><path d="M21 21v.01"/><path d="M3 8h5"/><path d="M8 21v-5"/><path d="M16 3v5"/><path d="M16 8h5"/>',
    scan: '<path d="M3 7V5a2 2 0 0 1 2-2h2"/><path d="M17 3h2a2 2 0 0 1 2 2v2"/><path d="M21 17v2a2 2 0 0 1-2 2h-2"/><path d="M7 21H5a2 2 0 0 1-2-2v-2"/>',
    camera: '<path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z"/><circle cx="12" cy="13" r="3"/>',
    refresh_cw: '<path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/><path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16"/><path d="M16 16h5v5"/>',
    webhook: '<path d="M18 16.98h-5.99c-1.1 0-1.95.94-2.48 1.9A4 4 0 0 1 2 17c.008-2.14 1.689-3.945 3.829-4.04a4 4 0 0 1 4.17 4.04"/><path d="M10.17 17a4 4 0 0 1 1.83-2.54c1.54-.88 2.07-2.8 1.49-4.26a4 4 0 1 1 5.59 5.51"/><circle cx="6" cy="17" r="2"/><circle cx="16" cy="17" r="2"/><circle cx="14.5" cy="6.5" r="2.18"/>',
    alert: '<path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><path d="M12 9v4"/><path d="M12 17h.01"/>',
    info: '<circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/>',
    check: '<path d="M20 6 9 17l-5-5"/>',
    x: '<path d="M18 6 6 18"/><path d="m6 6 12 12"/>',
    user: '<path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>',
    search: '<circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/>',
    save: '<path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><path d="M17 21v-8H7v8"/><path d="M7 3v5h8"/>',
    wrench: '<path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/>',
    send: '<path d="M14.536 21.686a.5.5 0 0 0 .937-.024l6.5-19a.496.496 0 0 0-.635-.635l-19 6.5a.5.5 0 0 0-.024.937l7.93 3.18a2 2 0 0 1 1.112 1.11z"/><path d="m21.854 2.147-10.94 10.939"/>',
    list: '<line x1="8" x2="21" y1="6" y2="6"/><line x1="8" x2="21" y1="12" y2="12"/><line x1="8" x2="21" y1="18" y2="18"/><line x1="3" x2="3.01" y1="6" y2="6"/><line x1="3" x2="3.01" y1="12" y2="12"/><line x1="3" x2="3.01" y1="18" y2="18"/>',
    file: '<path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"/><path d="M14 2v4a2 2 0 0 0 2 2h4"/>',
    ban: '<circle cx="12" cy="12" r="10"/><path d="m4.93 4.93 14.14 14.14"/>',
    plus: '<line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>',
    book: '<path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>',
    download: '<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/>',
    users: '<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>',
    moon: '<path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/>',
    sun: '<circle cx="12" cy="12" r="4"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="m4.93 4.93 1.41 1.41"/><path d="m17.66 17.66 1.41 1.41"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="m6.34 17.66-1.41 1.41"/><path d="m19.07 4.93-1.41 1.41"/>',
    undo: '<path d="M3 7v6h6"/><path d="M21 17a9 9 0 0 0-9-9 9 9 0 0 0-6 2.3L3 13"/>',
    smartphone: '<rect width="14" height="20" x="5" y="2" rx="2" ry="2"/><path d="M12 18h.01"/>',
    image: '<rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/>',
    lock_icon: '<rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>',
    clipboard: '<rect width="8" height="4" x="8" y="2" rx="1" ry="1"/><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/>',
    alert: '<path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><path d="M12 9v4"/><path d="M12 17h.01"/>',
    check: '<polyline points="20 6 9 17 4 12"/>',
    more: '<circle cx="12" cy="5" r="1"/><circle cx="12" cy="12" r="1"/><circle cx="12" cy="19" r="1"/>',
    edit: '<path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>',
    home: '<path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/>',
    globe: '<circle cx="12" cy="12" r="10"/><path d="M2 12h20"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>',
  };
  var path = icons[icon];
  if (!path) return '';
  return '<svg width="' + s + '" height="' + s + '" viewBox="0 0 24 24" style="' + p + '">' + path + '</svg>';
}

// Small "?" link next to a feature, pointing to its usage-guide blog post.
function helpLinkHtml(slug, title){
  return ' <a class="inline-help-link" href="/blog/' + slug + '" target="_blank" rel="noopener" title="' + esc(title) + '">' + li('help_circle', 14) + '</a>';
}

function loadAdminUsers(body){
  body.innerHTML = '<div style="margin-bottom:12px;display:flex;gap:8px;flex-wrap:wrap;align-items:center;">' +
    '<input id="adminSearchInput" placeholder="Tìm user theo username/email" class="input" style="padding:6px 10px;border:1px solid var(--border);border-radius:6px;flex:1;min-width:200px;" />' +
    '<select id="adminSearchRole" class="input" style="padding:6px;border:1px solid var(--border);border-radius:6px;"><option value="">Tất cả role</option><option value="guest">Guest</option><option value="free">Free</option><option value="plus">Plus</option><option value="pro">Pro</option><option value="super">Super</option><option value="admin">Admin</option></select>' +
    '<select id="adminSearchBanned" class="input" style="padding:6px;border:1px solid var(--border);border-radius:6px;"><option value="">Tat ca</option><option value="true">Bị khóa</option><option value="false">Bình thường</option></select>' +
    '<button id="adminSearchBtn" class="btn btn-primary btn-sm">Tim</button>' +
    '<button id="adminShowAllBtn" class="btn btn-sm">Hiện tất cả</button>' +
    '</div><div id="adminUsersTable">Dang tai...</div>';
  function renderUsersTable(users, container) {
    var roles = ["guest","free","plus","pro","super","admin"];
    container.innerHTML = '<div style="overflow-x:auto;"><table><thead><tr><th>' + t("admin_username") + '</th><th>' + t("admin_email") + '</th><th>' + t("admin_role") + '</th><th>' + t("admin_status") + '</th><th>' + t("admin_created") + '</th><th>' + t("actions") + '</th></tr></thead><tbody>' +
      users.map(function(u){
        var banBtn = u.banned ? '<button class="btn btn-sm btnUnban" title="' + t("admin_unban_user") + '" style="background:#22c55e;color:#fff;display:inline-flex;align-items:center;gap:4px;">' + li('unlock', 14) + ' ' + t("admin_unban") + '</button> ' : '<button class="btn btn-sm btnBan" title="' + t("admin_ban_user") + '" style="background:#f59e0b;color:#fff;display:inline-flex;align-items:center;gap:4px;">' + li('lock', 14) + ' ' + t("admin_ban") + '</button> ';
        var statusBadge = u.banned ? '<span style="color:#ef4444;font-weight:bold;">' + t("admin_banned") + '</span>' : '<span style="color:#22c55e;">' + t("admin_active") + '</span>';
        return '<tr data-u="' + esc(u.username) + '"><td>' + esc(u.username) + '</td><td>' + esc(u.email || "—") + '</td>' +
        '<td><select class="roleSel">' + roles.map(function(r){ return '<option value="' + r + '" ' + (r===u.role?"selected":"") + '>' + roleLabel(r) + '</option>'; }).join("") + '</select>' + (u.roleExpiry && u.role !== "free" && u.role !== "guest" ? '<div style="font-size:10px;color:var(--muted);margin-top:4px;">' + t("admin_expires") + ' ' + fmtDate(u.roleExpiry) + '</div>' : '') + '</td>' +
        '<td>' + statusBadge + '</td>' +
        '<td style="font-size:12px;color:var(--muted);">' + fmtDate(u.createdAt) + '</td>' +
        '<td><button class="btn btn-primary btn-sm saveRole" style="display:inline-flex;align-items:center;gap:4px;">' + li('settings', 12) + ' ' + t("admin_save") + '</button> ' +
        banBtn +
        '<button class="btn btn-sm btnNotify" title="' + t("admin_notify") + '" style="background:#3b82f6;color:#fff;display:inline-flex;align-items:center;gap:4px;">' + li('send', 14) + '</button> ' +
        '<button class="btn btn-sm btnDelete" title="' + t("admin_delete_user") + '" style="background:#ef4444;color:#fff;">Del</button></td></tr>';
      }).join("") + '</tbody></table></div>';
    container.querySelectorAll("tr[data-u]").forEach(function(tr){
      var username = tr.getAttribute("data-u");
      tr.querySelector(".saveRole").onclick = function(){
        var role = tr.querySelector(".roleSel").value;
        api("/api/admin/users/role", "POST", { username: username, role: role }).then(function(){
          alert(t("admin_save") + " " + username);
        }).catch(function(err){ alert(err.message); });
      };
      var btnDel = tr.querySelector(".btnDelete");
      if (btnDel) btnDel.onclick = function(){
        if (!confirm('Xóa user [' + username + '] và toàn bộ links? Không thể hoàn tác!')) return;
        api("/api/admin/users/" + encodeURIComponent(username), "DELETE").then(function(data){
          alert(data.message || "Đã xóa user");
          loadAdminUsers(body);
        }).catch(function(err){ alert(err.message); });
      };
      var btnBan = tr.querySelector(".btnBan");
      if (btnBan) btnBan.onclick = function(){
        var reason = prompt('Lý do khóa user [' + username + ']?');
        if (reason === null) return;
        api("/api/admin/users/ban", "POST", { username: username, banned: true, reason: reason || "" }).then(function(data){
          alert(data.message || "Đã khóa user");
          loadAdminUsers(body);
        }).catch(function(err){ alert(err.message); });
      };
      var btnUnban = tr.querySelector(".btnUnban");
      if (btnUnban) btnUnban.onclick = function(){
        if (!confirm('Mở khóa user [' + username + ']?')) return;
        api("/api/admin/users/ban", "POST", { username: username, banned: false }).then(function(data){
          alert(data.message || "Đã mở khóa user");
          loadAdminUsers(body);
        }).catch(function(err){ alert(err.message); });
      };
      var btnNtf = tr.querySelector(".btnNotify");
      if (btnNtf) btnNtf.onclick = function(){
        var msg = prompt('Nhập thông báo gửi cho [' + username + '] - định dạng: tiêu đề: nội dung');
        if (!msg) return;
        var parts = msg.split(":");
        var title = parts[0].trim();
        var message = parts.slice(1).join(":").trim();
        if (!title || !message) { alert("Nhập theo định dạng: tiêu đề: nội dung"); return; }
        api("/api/admin/notifications", "POST", { title: title, message: message, targetUsername: username, type: "info" }).then(function(data){
          alert(data.message || "Da gui thong bao");
        }).catch(function(err){ alert(err.message); });
      };
    });
  }
  var tableContainer = document.getElementById("adminUsersTable");
  api("/api/admin/users").then(function(data){
    renderUsersTable(data.users || [], tableContainer);
  }).catch(function(err){ tableContainer.innerHTML = '<div class="msg msg-error">' + esc(err.message) + '</div>'; });
  document.getElementById("adminSearchBtn").onclick = function(){
    var q = document.getElementById("adminSearchInput").value.trim();
    var role = document.getElementById("adminSearchRole").value;
    var banned = document.getElementById("adminSearchBanned").value;
    var params = [];
    if (q) params.push("q=" + encodeURIComponent(q));
    if (role) params.push("role=" + encodeURIComponent(role));
    if (banned) params.push("banned=" + encodeURIComponent(banned));
    if (params.length === 0) { alert("Nhap tu khoa hoac chon bo loc"); return; }
    tableContainer.innerHTML = "Dang tim...";
    api("/api/admin/users/search?" + params.join("&"), "GET").then(function(data){
      renderUsersTable(data.users || [], tableContainer);
    }).catch(function(err){ tableContainer.innerHTML = '<div class="msg msg-error">' + esc(err.message) + '</div>'; });
  };
  document.getElementById("adminShowAllBtn").onclick = function(){
    document.getElementById("adminSearchInput").value = "";
    document.getElementById("adminSearchRole").value = "";
    document.getElementById("adminSearchBanned").value = "";
    tableContainer.innerHTML = "Dang tai...";
    api("/api/admin/users").then(function(data){
      renderUsersTable(data.users || [], tableContainer);
    }).catch(function(err){ tableContainer.innerHTML = '<div class="msg msg-error">' + esc(err.message) + '</div>'; });
  };
  document.getElementById("adminSearchInput").addEventListener("keydown", function(e){
    if (e.key === "Enter") document.getElementById("adminSearchBtn").click();
  });
}

function loadAdminReports(body){
  api("/api/admin/reports").then(function(data){
    if (data.reports.length === 0){ body.innerHTML = '<p class="hint">' + t("admin_no_reports") + '</p>'; return; }
    body.innerHTML = '<div style="overflow-x:auto;"><table><thead><tr><th>' + t("title_field") + '</th><th>' + t("admin_reason") + '</th><th>' + t("analytics_time") + '</th><th>' + t("admin_status") + '</th><th></th></tr></thead><tbody>' +
      data.reports.map(function(r){
        return '<tr data-id="' + esc(r.id) + '"><td class="mono">' + (r.code ? '/' + esc(r.code) : esc(r.target || r.url || "")) + '</td><td>' + esc(r.reason) + (r.contact ? '<br><span style="font-size:12px;color:var(--muted);">' + esc(r.contact) + '</span>' : '') + '</td>' +
        '<td style="font-size:12px;color:var(--muted);">' + fmtDate(r.reportedAt) + '</td><td>' + esc(r.status) + '</td>' +
        '<td><button class="btn btn-ghost btn-sm dismissBtn">' + t("admin_dismiss") + '</button></td></tr>';
      }).join("") + '</tbody></table></div>';
    body.querySelectorAll("tr[data-id]").forEach(function(tr){
      var id = tr.getAttribute("data-id");
      tr.querySelector(".dismissBtn").onclick = function(){
        adminTab = "reports";
        api("/api/admin/reports/dismiss", "POST", { id: id }).then(function(){ loadAdminReports(body); });
      };
    });
  }).catch(function(err){ body.innerHTML = '<div class="msg msg-error">' + esc(err.message) + '</div>'; });
}

function loadAdminFeedback(body){
  body.innerHTML = '<p class="hint">Đang tải...</p>';
  api("/api/admin/feedback").then(function(data){
    if (!data.feedback || data.feedback.length === 0){ body.innerHTML = '<p class="hint">Chưa có góp ý nào.</p>'; return; }
    var typeLabels = { bug: "Báo lỗi", feature: "Yêu cầu tính năng", question: "Hỏi đáp", other: "Khác" };
    var fbData = {};
    body.innerHTML = '<div style="overflow-x:auto;"><table><thead><tr><th>Loại</th><th>Người gửi</th><th>Nội dung</th><th>Ngày</th><th>Trạng thái</th><th>Hành động</th></tr></thead><tbody>' +
      data.feedback.map(function(f){
        fbData[f.id] = f;
        var statusBadge = f.status === "new" ? '<span style="color:var(--indigo);font-weight:600">Mới</span>' : f.status === "replied" ? '<span style="color:var(--green)">Đã phản hồi</span>' : '<span style="color:var(--muted)">Đã đóng</span>';
        var fromText = f.username ? esc(f.username) : (f.email ? esc(f.email) : "Ẩn danh");
        return '<tr data-id="' + esc(f.id) + '">' +
          '<td>' + (typeLabels[f.type] || esc(f.type)) + '</td>' +
          '<td>' + fromText + '</td>' +
          '<td style="max-width:220px;"><span class="fb-msg-text" style="display:block;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;max-width:200px;">' + esc(f.message) + '</span></td>' +
          '<td style="font-size:12px;color:var(--muted)">' + fmtDate(f.createdAt) + '</td>' +
          '<td class="fb-status">' + statusBadge + '</td>' +
          '<td style="white-space:nowrap"><button class="btn btn-ghost btn-sm fbViewBtn" style="font-size:11px;padding:2px 8px;">Xem</button> <button class="btn btn-ghost btn-sm fbTranslateBtn" style="font-size:11px;padding:2px 8px;">Dịch</button> <button class="btn btn-ghost btn-sm fbReplyBtn">Phản hồi</button> <button class="btn btn-ghost btn-sm fbCloseBtn">Đóng</button> <button class="btn btn-ghost btn-sm fbDelBtn">Xóa</button></td>' +
          '</tr>';
      }).join("") + '</tbody></table></div>';
    body.querySelectorAll("tr[data-id]").forEach(function(tr){
      var id = tr.getAttribute("data-id");
      var f = fbData[id];
      tr.querySelector(".fbViewBtn").onclick = function(){ showFeedbackDetailModal(f); };
      tr.querySelector(".fbTranslateBtn").onclick = function(){
        var btn = this;
        var msgSpan = tr.querySelector(".fb-msg-text");
        if (btn.getAttribute("data-translated") === "1") {
          msgSpan.textContent = f.message;
          btn.textContent = "Dịch";
          btn.setAttribute("data-translated", "0");
          return;
        }
        btn.textContent = "Đang dịch...";
        btn.disabled = true;
        api("/api/admin/feedback/translate", "POST", { id: id }).then(function(res){
          btn.disabled = false;
          if (res.ok && res.translated) {
            msgSpan.textContent = res.translated;
            btn.textContent = "Bản gốc";
            btn.setAttribute("data-translated", "1");
          } else {
            btn.textContent = "Dịch";
            alert("Không thể dịch nội dung.");
          }
        }).catch(function(err){
          btn.disabled = false;
          btn.textContent = "Dịch";
          alert("Lỗi: " + (err && err.message ? err.message : "Không thể dịch nội dung."));
        });
      };
      tr.querySelector(".fbReplyBtn").onclick = function(){ openFeedbackReplyModal(f, tr); };
      tr.querySelector(".fbCloseBtn").onclick = function(){
        var btn = this;
        btn.disabled = true;
        api("/api/admin/feedback/status", "POST", { id: id, status: "closed" }).then(function(){
          btn.disabled = false;
          var badge = tr.querySelector(".fb-status");
          if (badge) badge.innerHTML = '<span style="color:var(--muted)">Đã đóng</span>';
        }).catch(function(err){
          btn.disabled = false;
          alert(err && err.message ? err.message : "Có lỗi xảy ra.");
        });
      };
      tr.querySelector(".fbDelBtn").onclick = function(){ openFeedbackDeleteModal(f, tr); };
    });
  }).catch(function(err){ body.innerHTML = '<div class="msg msg-error">' + esc(err.message) + '</div>'; });
}

function showFeedbackDetailModal(f) {
  var typeLabels = { bug: t("fb_type_bug"), feature: t("fb_type_feature"), question: t("fb_type_question"), other: t("fb_type_other") };
  var existing = document.getElementById("fbDetailModal");
  if (existing) existing.remove();
  var modal = document.createElement("div");
  modal.id = "fbDetailModal";
  modal.style.cssText = "position:fixed;inset:0;background:rgba(0,0,0,0.5);display:flex;align-items:center;justify-content:center;z-index:10001;";
  var card = document.createElement("div");
  card.style.cssText = "background:var(--card);border:1px solid var(--border);border-radius:16px;padding:24px;max-width:500px;width:90%;max-height:80vh;overflow-y:auto;box-shadow:0 20px 60px rgba(0,0,0,0.3);";
  var timeStr = "";
  try { timeStr = new Date(f.createdAt).toLocaleString("vi-VN"); } catch(e){}
  var fromText = f.username ? esc(f.username) : (f.email ? esc(f.email) : t("fb_detail_anonymous"));
card.innerHTML =
    "<div style='display:flex;justify-content:space-between;align-items:center;margin-bottom:16px;'>" +
    "<h3 style='margin:0;font-size:16px;font-weight:700;color:var(--text);'>Chi tiet gop y</h3>" +
    "<button id='closeFbDetailBtn' style='background:none;border:none;color:var(--muted);font-size:22px;cursor:pointer;padding:0;flex-shrink:0;'>&times;</button>" +
    "</div>" +
    "<div style='margin-bottom:8px;font-size:13px;'><b>" + t("fb_detail_type") + ":</b> " + (typeLabels[f.type] || esc(f.type)) + "</div>" +
    "<div style='margin-bottom:8px;font-size:13px;'><b>" + t("fb_detail_sender") + ":</b> " + fromText + "</div>" +
    (f.email ? "<div style='margin-bottom:8px;font-size:13px;'><b>Email:</b> " + esc(f.email) + "</div>" : "") +
    (f.page ? "<div style='margin-bottom:8px;font-size:13px;'><b>" + t("fb_detail_page") + ":</b> " + esc(f.page) + "</div>" : "") +
    "<div style='margin-bottom:8px;font-size:13px;'><b>" + t("fb_detail_time") + ":</b> " + timeStr + "</div>" +
    "<div style='margin-bottom:8px;font-size:13px;'><b>" + t("fb_detail_status") + ":</b> " + (f.status === "new" ? t("fb_status_new") : f.status === "replied" ? t("fb_status_replied") : t("fb_status_closed")) + "</div>" +
    "<hr style='border:none;border-top:1px solid var(--border);margin:12px 0;'>" +
    "<div style='font-size:14px;color:var(--text);line-height:1.6;white-space:pre-wrap;word-break:break-word;'>" + esc(f.message) + "</div>" +
    "<div style='margin-top:20px;display:flex;justify-content:flex-end;'>" +
    "<button id='okFbDetailBtn' class='btn btn-primary btn-sm' style='padding:8px 20px;'>" + t("adm_notif_close") + "</button>" +
    "</div>";
  modal.appendChild(card);
  document.body.appendChild(modal);
  document.getElementById("closeFbDetailBtn").onclick = function() { modal.remove(); };
  document.getElementById("okFbDetailBtn").onclick = function() { modal.remove(); };
  modal.onclick = function(e) { if (e.target === modal) modal.remove(); };
}

function openFeedbackReplyModal(f, tr){
  var typeLabels = { bug: "Báo lỗi", feature: "Yêu cầu tính năng", question: "Hỏi đáp", other: "Khác" };
  var overlay = document.createElement("div");
  overlay.className = "overlay";
  overlay.style.zIndex = "10001";
  overlay.innerHTML =
    '<div class="modal" style="max-width:720px;animation:modalPop 0.25s ease;transform-origin:bottom center;">' +
      '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:16px;">' +
        '<h3 style="margin:0;font-size:18px;">Phản hồi góp ý</h3>' +
        '<button class="fbModalClose" style="background:none;border:none;font-size:22px;cursor:pointer;color:var(--muted);padding:0 4px;line-height:1;">&times;</button>' +
      '</div>' +
      '<div style="display:flex;gap:20px;">' +
        '<div style="flex:1;border-right:1px solid var(--border);padding-right:20px;">' +
          '<div style="margin-bottom:8px;font-size:13px;"><strong>Loại:</strong> ' + (typeLabels[f.type] || esc(f.type)) + '</div>' +
          '<div style="margin-bottom:8px;font-size:13px;"><strong>Người gửi:</strong> ' + (f.username ? esc(f.username) : (f.email ? esc(f.email) : "Ẩn danh")) + '</div>' +
          '<div style="margin-bottom:8px;font-size:13px;"><strong>Ngày:</strong> ' + fmtDate(f.createdAt) + '</div>' +
          '<div style="margin-bottom:8px;font-size:13px;"><strong>Nội dung góp ý:</strong></div>' +
          '<div style="background:rgba(var(--muted-rgb),0.08);border-radius:8px;padding:12px;font-size:13px;word-break:break-word;max-height:300px;overflow-y:auto;">' + esc(f.message) + '</div>' +
        '</div>' +
        '<div style="flex:1;display:flex;flex-direction:column;">' +
          '<div style="margin-bottom:8px;font-size:13px;"><strong>Nội dung phản hồi:</strong></div>' +
          '<textarea class="fbReplyText" style="flex:1;min-height:200px;resize:vertical;border:1px solid var(--border);border-radius:8px;padding:12px;font-size:14px;background:var(--bg);color:var(--text);" placeholder="Nhập nội dung phản hồi cho người dùng..."></textarea>' +
          '<button class="btn btn-primary fbReplySend" style="margin-top:12px;align-self:flex-end;">Gửi phản hồi</button>' +
        '</div>' +
      '</div>' +
    '</div>';
  document.body.appendChild(overlay);
  overlay.querySelector(".fbModalClose").onclick = function(){ overlay.remove(); };
  overlay.addEventListener("click", function(e){ if (e.target === overlay) overlay.remove(); });
  overlay.querySelector(".fbReplySend").onclick = function(){
    var reply = overlay.querySelector(".fbReplyText").value.trim();
    if (!reply) { alert("Vui lòng nhập nội dung phản hồi."); return; }
    var btn = this;
    btn.disabled = true;
    btn.textContent = "Đang gửi...";
    api("/api/admin/feedback/reply", "POST", { id: f.id, reply: reply }).then(function(){
      overlay.remove();
      var badge = tr.querySelector(".fb-status");
      if (badge) badge.innerHTML = '<span style="color:var(--green)">Đã phản hồi</span>';
    }).catch(function(err){
      btn.disabled = false;
      btn.textContent = "Gửi phản hồi";
      alert("Lỗi: " + (err && err.message ? err.message : "Không thể gửi."));
    });
  };
}

function openFeedbackDeleteModal(f, tr){
  var overlay = document.createElement("div");
  overlay.className = "overlay";
  overlay.style.zIndex = "10001";
  overlay.innerHTML =
    '<div class="modal" style="max-width:420px;text-align:center;animation:modalPop 0.25s ease;transform-origin:bottom center;">' +
      '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:16px;">' +
        '<h3 style="margin:0;font-size:18px;">Xóa Feedback</h3>' +
        '<button class="fbModalClose" style="background:none;border:none;font-size:22px;cursor:pointer;color:var(--muted);padding:0 4px;line-height:1;">&times;</button>' +
      '</div>' +
      '<p style="margin-bottom:24px;color:var(--muted);font-size:14px;">Bạn có chắc chắn muốn xóa góp ý này? Hành động này không thể hoàn tác.</p>' +
      '<div style="display:flex;gap:12px;justify-content:center;">' +
        '<button class="btn btn-ghost fbDelCancel">Từ chối</button>' +
        '<button class="btn fbDelConfirm" style="background:#ef4444;color:#fff;border:none;padding:8px 16px;border-radius:8px;cursor:pointer;font-weight:600;">Đồng ý</button>' +
      '</div>' +
    '</div>';
  document.body.appendChild(overlay);
  overlay.querySelector(".fbModalClose").onclick = function(){ overlay.remove(); };
  overlay.querySelector(".fbDelCancel").onclick = function(){ overlay.remove(); };
  overlay.addEventListener("click", function(e){ if (e.target === overlay) overlay.remove(); });
  overlay.querySelector(".fbDelConfirm").onclick = function(){
    var btn = this;
    btn.disabled = true;
    btn.textContent = "Đang xóa...";
    api("/api/admin/feedback/delete", "POST", { id: f.id }).then(function(){
      overlay.remove();
      tr.style.transition = "opacity 0.3s ease, transform 0.3s ease";
      tr.style.opacity = "0";
      tr.style.transform = "translateX(24px)";
      setTimeout(function(){ tr.remove(); }, 300);
    }).catch(function(err){
      btn.disabled = false;
      btn.textContent = "Đồng ý";
      alert("Lỗi: " + (err && err.message ? err.message : "Không thể xóa."));
    });
  };
}

function loadAdminBlacklist(body){
  api("/api/blacklist").then(function(data){
    body.innerHTML =
      '<div class="row">' +
      '<div><h2>' + t("admin_bl_domains") + '</h2>' +
      '<div id="blDomains">' + data.domains.map(function(d){ return blItem("domain", d); }).join("") + '</div>' +
      '<div class="row" style="margin-top:10px;"><input type="text" id="newDomain" placeholder="' + t("admin_new_domain") + '"><button class="btn btn-primary btn-sm" id="addDomain">' + t("admin_add_domain") + '</button></div>' +
      '</div>' +
      '<div><h2>' + t("admin_bl_keywords") + '</h2>' +
      '<div id="blKeywords">' + data.keywords.map(function(k){ return blItem("keyword", k); }).join("") + '</div>' +
      '<div class="row" style="margin-top:10px;"><input type="text" id="newKeyword" placeholder="' + t("admin_new_keyword") + '"><button class="btn btn-primary btn-sm" id="addKeyword">' + t("admin_add_keyword") + '</button></div>' +
      '<p class="hint" style="margin-top:14px;">' + t("admin_bl_defaults") + ' ' + data.defaults.join(", ") + '</p>' +
      '</div></div>';
    function bind(){
      body.querySelectorAll(".rmBtn").forEach(function(b){
        b.onclick = function(){
          api("/api/blacklist", "DELETE", { type: b.getAttribute("data-type"), value: b.getAttribute("data-value") })
            .then(function(){ loadAdminBlacklist(body); });
        };
      });
    }
    bind();
    document.getElementById("addDomain").onclick = function(){
      var v = document.getElementById("newDomain").value.trim();
      if (!v) return;
      api("/api/blacklist", "POST", { type: "domain", value: v }).then(function(){ loadAdminBlacklist(body); });
    };
    document.getElementById("addKeyword").onclick = function(){
      var v = document.getElementById("newKeyword").value.trim();
      if (!v) return;
      api("/api/blacklist", "POST", { type: "keyword", value: v }).then(function(){ loadAdminBlacklist(body); });
    };
  }).catch(function(err){ body.innerHTML = '<div class="msg msg-error">' + esc(err.message) + '</div>'; });
}
function blItem(type, value){
  return '<div style="display:flex;justify-content:space-between;align-items:center;padding:8px 0;border-bottom:1px solid var(--border);">' +
    '<span class="mono" style="font-size:13px;">' + esc(value) + '</span>' +
    '<button class="btn btn-danger btn-sm rmBtn" data-type="' + type + '" data-value="' + esc(value) + '">' + t("admin_delete") + '</button></div>';
}
// === NÂNG CẤP QUA VOUCHER ===
function navRegister(){ navigate("register"); }
function navLogin(){ navigate("login"); }
function navAccount(){ navigate("account"); }
function upgradePro(){ upgradeStripe("pro"); }
function upgradeSuper(){ upgradeStripe("super"); }
function upgradeBanner(pageCtx){
  if (!state.user) return "";
  if (isProOrAbove(state.user)) return "";
  var ctx = pageCtx || (typeof currentRoute !== "undefined" ? currentRoute : "") || "";
  return '<div class="upgrade-banner">' +
    '<div><b>' + t("upgrade_banner_title") + '</b><br><span class="hint">' + t("upgrade_banner_desc") + '</span></div>' +
    '<div style="display:flex;align-items:center;gap:4px;">' +
    '<span class="crown-hint" data-ctx="'+ctx+'" title="Xem huong dan tinh nang">' + rainbowCrownSVG(20) + '</span>' +
    '<a class="btn btn-primary" style="white-space:nowrap;" href="#/pricing">' + t("upgrade_banner_btn") + '</a>' +
    '</div>' +
    '</div>';
}
function rainbowCrownSVG(size){
  var s = size || 20;
  return '<svg width="'+s+'" height="'+s+'" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">' +
    '<defs><linearGradient id="crGrad" x1="0" y1="0" x2="24" y2="24" gradientUnits="userSpaceOnUse">' +
    '<stop offset="0%" stop-color="#ef4444"/><stop offset="16%" stop-color="#f59e0b"/><stop offset="33%" stop-color="#22c55e"/>' +
    '<stop offset="50%" stop-color="#06b6d4"/><stop offset="66%" stop-color="#3b82f6"/><stop offset="83%" stop-color="#8b5cf6"/>' +
    '<stop offset="100%" stop-color="#ec4899"/></linearGradient>' +
    '<linearGradient id="crGem" x1="8" y1="4" x2="16" y2="14" gradientUnits="userSpaceOnUse">' +
    '<stop offset="0%" stop-color="#fbbf24"/><stop offset="100%" stop-color="#f59e0b"/></linearGradient></defs>' +
    '<path d="M3 18h18l-2-10-5 4-4-6-4 6-5-4z" fill="url(#crGrad)" stroke="url(#crGrad)" stroke-width="1" stroke-linejoin="round"/>' +
    '<rect x="2" y="18" width="20" height="2.5" rx="1" fill="url(#crGrad)"/>' +
    '<circle cx="12" cy="9" r="2" fill="url(#crGem)" stroke="#fde68a" stroke-width="0.5"/>' +
    '<circle cx="5" cy="11" r="1" fill="#fbbf24" opacity="0.8"/>' +
    '<circle cx="19" cy="11" r="1" fill="#fbbf24" opacity="0.8"/>' +
    '</svg>';
}
var UPGRADE_DEMOS = {
  bulkqr: {
    title: "Bulk QR - Tao QR hang loat",
    steps: [
      { t: "Nhap nhieu URL vao o van ban", d: "Moi dong 1 URL" },
      { t: "Bam nut Tao QR", d: "He thong tao QR cho tung URL" },
      { t: "Tai ve tat ca QR", d: "File ZIP chua tat ca QR Code" }
    ],
    anim: function(){
      var urls = ["abc.com", "acb.com", "cab.com"];
      var html = "";
      urls.forEach(function(u, i){
        html += '<div class="demo-anim-item" style="display:flex;align-items:center;gap:10px;margin-bottom:8px;animation-delay:'+(i*0.3)+'s;">';
        html += '<span style="color:var(--muted);">URL: '+u+'</span>';
        html += '<span style="color:var(--indigo);">-></span>';
        html += '<span style="display:inline-block;width:32px;height:32px;border:2px solid var(--indigo);border-radius:4px;background:repeating-conic-gradient(var(--indigo) 0 25%, transparent 0 50%) 0 0 / 8px 8px;"></span>';
        html += '<span style="color:var(--green);font-size:11px;">QR '+ (i+1) +' OK</span>';
        html += '</div>';
      });
      return html;
    }
  },
  webhooks: {
    title: "Webhooks - Tu dong gui su kien",
    steps: [
      { t: "Them URL dich webhook", d: "URL nhan thong bao khi co event" },
      { t: "Khi ai do click link", d: "Webhook tu dong POST event toi URL" },
      { t: "He thong ben ngoai nhan data", d: "IP, quoc gia, thiet bi, thoi gian" }
    ],
    anim: function(){
      return '<div class="demo-anim-item" style="display:flex;align-items:center;gap:8px;flex-wrap:wrap;">' +
        '<span style="background:var(--indigo);color:#fff;padding:3px 8px;border-radius:6px;font-size:11px;">Link click</span>' +
        '<span style="color:var(--muted);">-></span>' +
        '<span style="background:#f59e0b;color:#fff;padding:3px 8px;border-radius:6px;font-size:11px;">Event</span>' +
        '<span style="color:var(--muted);">-></span>' +
        '<span style="background:var(--green);color:#fff;padding:3px 8px;border-radius:6px;font-size:11px;">POST -> URL</span>' +
        '<span style="color:var(--muted);">-></span>' +
        '<span style="background:var(--sky);color:#fff;padding:3px 8px;border-radius:6px;font-size:11px;">External System</span>' +
        '</div>';
    }
  },
  campaigns: {
    title: "Campaigns - Quan ly nhom link",
    steps: [
      { t: "Tao Campaign moi", d: "Dat ten va mo ta chien dich" },
      { t: "Them Short URL vao Campaign", d: "Nhieu link trong 1 nhom" },
      { t: "Xem Analytics tong hop", d: "Thong ke tat ca link trong Campaign" }
    ],
    anim: function(){
      return '<div class="demo-anim-item" style="display:flex;align-items:center;gap:8px;flex-wrap:wrap;">' +
        '<span style="background:var(--indigo);color:#fff;padding:3px 8px;border-radius:6px;font-size:11px;">Campaign</span>' +
        '<span style="color:var(--muted);">-></span>' +
        '<span style="font-size:11px;color:var(--sky);">URL-A . URL-B . URL-C</span>' +
        '<span style="color:var(--muted);">-></span>' +
        '<span style="background:var(--green);color:#fff;padding:3px 8px;border-radius:6px;font-size:11px;">Analytics</span>' +
        '</div>';
    }
  },
  export: {
    title: "Export - Xuat du lieu",
    steps: [
      { t: "Chon dinh dang CSV hoac JSON", d: "Xuat toan bo link va thong ke" },
      { t: "Bam nut Export", d: "He thong tong hop du lieu" },
      { t: "Tai file ve may", d: "File chua tat ca link + clicks + ngay tao" }
    ],
    anim: function(){
      return '<div class="demo-anim-item" style="display:flex;align-items:center;gap:8px;flex-wrap:wrap;">' +
        '<span style="font-size:11px;color:var(--muted);">Data</span>' +
        '<span style="color:var(--muted);">-></span>' +
        '<span style="background:var(--green);color:#fff;padding:3px 8px;border-radius:6px;font-size:11px;">Export</span>' +
        '<span style="color:var(--muted);">-></span>' +
        '<span style="background:var(--sky);color:#fff;padding:3px 8px;border-radius:6px;font-size:11px;">CSV/JSON</span>' +
        '</div>';
    }
  },
  api: {
    title: "API - Tich hop he thong ngoai",
    steps: [
      { t: "Tao API Token", d: "Token dung de xac thuc API" },
      { t: "Gui POST /api/v1/shorten", d: "Tao Short URL tu he thong ngoai" },
      { t: "Nhan ket qua JSON", d: "Short URL code + link day du" }
    ],
    anim: function(){
      return '<div class="demo-anim-item" style="font-size:11px;line-height:1.8;">' +
        '<span style="color:var(--indigo);">App</span> -> <span style="color:var(--sky);">POST /api/v1/shorten</span> -> <span style="color:var(--green);">{code:abc123, shortUrl:...}</span>' +
        '</div>';
    }
  },
  dashboard: {
    title: "Dashboard - Quan ly Short URL",
    steps: [
      { t: "Tao Short URL", d: "Dan URL dai -> tao link ngan" },
      { t: "Quan ly link", d: "Copy, QR, Analytics, Edit, Delete" },
      { t: "Xem thong ke", d: "So link, tong clicks" }
    ],
    anim: function(){
      return '<div class="demo-anim-item" style="font-size:11px;line-height:1.8;">' +
        '<span style="color:var(--muted);">URL dai</span> -> <span style="color:var(--indigo);">shurl.co/abc</span> -> <span style="color:var(--green);">Clicks: 0</span>' +
        '</div>';
    }
  }
};
function showUpgradeDemo(ctx){
  var key = ctx || "dashboard";
  if (key === "bulkqr" || key === "bulk") key = "bulkqr";
  if (key === "webhook" || key === "webhooks") key = "webhooks";
  if (key === "campaign" || key === "campaigns") key = "campaigns";
  if (key === "export") key = "export";
  if (key === "api") key = "api";
  var demo = UPGRADE_DEMOS[key] || UPGRADE_DEMOS.dashboard;
  var existing = document.getElementById("upgradeDemoModal");
  if (existing) existing.remove();
  var modal = document.createElement("div");
  modal.id = "upgradeDemoModal";
  modal.className = "upgrade-demo-modal";
  var stepsHtml = "";
  for (var i = 0; i < demo.steps.length; i++){
    var s = demo.steps[i];
    stepsHtml += '<div class="upgrade-demo-step">' +
      '<div class="upgrade-demo-step-num">' + (i+1) + '</div>' +
      '<div><div style="font-weight:600;font-size:13px;color:var(--text);">' + s.t + '</div>' +
      '<div style="font-size:12px;color:var(--muted);margin-top:2px;">' + s.d + '</div></div>' +
      '</div>';
  }
  var animHtml = demo.anim ? '<div class="upgrade-demo-anim">' + demo.anim() + '</div>' : '';
  var closeFn = "document.getElementById('upgradeDemoModal').remove();";
  modal.innerHTML = '<div class="upgrade-demo-card">' +
    '<div class="upgrade-demo-header">' +
    '<div style="display:flex;align-items:center;gap:10px;">' + rainbowCrownSVG(24) +
    '<h3 style="margin:0;font-size:15px;font-weight:700;color:var(--text);">' + demo.title + '</h3></div>' +
    '<button onclick="' + closeFn + '" style="background:none;border:none;color:var(--muted);font-size:22px;cursor:pointer;padding:0;">x</button>' +
    '</div>' +
    '<div class="upgrade-demo-body">' + stepsHtml + animHtml + '</div>' +
    '<div class="upgrade-demo-footer">' +
    '<span style="font-size:12px;color:var(--muted);display:flex;align-items:center;gap:4px;">' + rainbowCrownSVG(16) + ' Nang cap de mo khoa tinh nang nay</span>' +
    '<a class="btn btn-primary btn-sm" href="#/pricing" onclick="' + closeFn + '" style="white-space:nowrap;">' + t("upgrade_banner_btn") + '</a>' +
    '</div>' +
    '</div>';
  document.body.appendChild(modal);
  modal.onclick = function(e){ if (e.target === modal) modal.remove(); };
}

function bindCrownHints(){
  var hints = document.querySelectorAll('.crown-hint');
  hints.forEach(function(h){
    if (h._bound) return;
    h._bound = true;
    h.addEventListener('click', function(){
      var ctx = h.getAttribute('data-ctx') || '';
      showUpgradeDemo(ctx);
    });
  });
}
function closeFeedbackModal(){ var m = document.getElementById('feedbackModal'); if (m) m.remove(); }
function showFeedbackModal(){
  var existing = document.getElementById("feedbackModal");
  if (existing) existing.remove();
  var types = [
    { id: "bug", icon: li("x", 18), label: t("feedback_type_bug") },
    { id: "feature", icon: li("plus", 18), label: t("feedback_type_feature") },
    { id: "question", icon: li("help", 18), label: t("feedback_type_question") },
    { id: "other", icon: li("message", 18), label: t("feedback_type_other") }
  ];
  var typesHtml = types.map(function(tp, i) {
    return '<button class="feedback-type-btn' + (i === 0 ? " active" : "") + '" data-type="' + tp.id + '" onclick="selectFeedbackType(this)">' + tp.icon + '<span>' + tp.label + '</span></button>';
  }).join("");
  var modal = document.createElement("div");
  modal.id = "feedbackModal";
  modal.className = "feedback-modal";
  modal.innerHTML = '<div class="feedback-card">' +
    '<div class="feedback-header">' +
    '<div style="display:flex;align-items:center;gap:10px;">' + li("help", 22) +
    '<h3 style="margin:0;font-size:15px;font-weight:700;color:var(--text);">' + t("feedback_title") + '</h3></div>' +
    '<button onclick="closeFeedbackModal()" style="background:none;border:none;color:var(--muted);font-size:22px;cursor:pointer;padding:0;">x</button>' +
    '</div>' +
    '<div class="feedback-body">' +
    '<div class="feedback-type-grid">' + typesHtml + '</div>' +
    '<label class="feedback-label">' + t("feedback_label_message") + '</label>' +
    '<textarea class="feedback-textarea" id="feedbackMsg" placeholder="' + t("feedback_placeholder") + '" maxlength="2000"></textarea>' +
    '<label class="feedback-label" style="margin-top:12px;">' + t("feedback_label_email") + '</label>' +
    '<input class="feedback-input" id="feedbackEmail" type="email" placeholder="' + t("feedback_email_placeholder") + '" value="' + (state.user ? (state.user.email || "") : "") + '" maxlength="100" />' +
    '</div>' +
    '<div class="feedback-footer">' +
    '<button class="btn btn-sm" onclick="closeFeedbackModal()">' + t("feedback_cancel") + '</button>' +
    '<button class="btn btn-primary btn-sm" id="feedbackSubmitBtn" onclick="submitFeedback()">' + t("feedback_submit") + '</button>' +
    '</div>' +
    '</div>';
  document.body.appendChild(modal);
  modal.onclick = function(e) { if (e.target === modal) modal.remove(); };
}
function selectFeedbackType(btn) {
  var buttons = btn.parentElement.querySelectorAll(".feedback-type-btn");
  buttons.forEach(function(b) { b.classList.remove("active"); });
  btn.classList.add("active");
}
function submitFeedback() {
  var msg = document.getElementById("feedbackMsg").value.trim();
  var email = document.getElementById("feedbackEmail").value.trim();
  var typeBtn = document.querySelector(".feedback-type-btn.active");
  var type = typeBtn ? typeBtn.getAttribute("data-type") : "other";
  if (!msg) { document.getElementById("feedbackMsg").style.borderColor = "#ef4444"; return; }
  var btn = document.getElementById("feedbackSubmitBtn");
  btn.disabled = true; btn.textContent = "...";
  api("/api/feedback", "POST", { type: type, message: msg, email: email, page: (typeof currentRoute !== "undefined" ? currentRoute : "") }).then(function(res) {
    var modal = document.getElementById("feedbackModal");
    if (modal) {
      modal.querySelector(".feedback-card").innerHTML = '<div class="feedback-success">' +
        '<div class="feedback-success-icon">' + li("check", 28) + '</div>' +
        '<h3 style="margin:0 0 8px;font-size:16px;font-weight:700;color:var(--text);">' + t("feedback_success_title") + '</h3>' +
        '<p style="margin:0;color:var(--muted);font-size:13px;">' + t("feedback_success_desc") + '</p>' +
        '<button class="btn btn-primary btn-sm" style="margin-top:16px;" onclick="closeFeedbackModal()">' + t("feedback_close") + '</button>' +
        '</div>';
    }
  }).catch(function(err) {
    btn.disabled = false; btn.textContent = t("feedback_submit");
    document.getElementById("feedbackMsg").style.borderColor = "#ef4444";
  });
}

async function redeemVoucher() {
  const code = prompt(t("account_enter_voucher"));
  if (!code) return;
  const res = await fetch("/api/voucher/redeem", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ code: code })
  });
  const data = await res.json();
  if (data.success) {
    alert(data.message + "\\n" + t("login"));
    location.reload();
  } else {
    alert(data.error || t("bulk_errors"));
  }
}

// === NÂNG CẤP QUA STRIPE ===
async function upgradeStripe(tier) {
  const res = await fetch("/api/billing/checkout", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ tier: tier })
  });
  const data = await res.json();
  if (data.url) {
    window.location.href = data.url;
  } else {
    alert(data.error || t("bulk_errors"));
  }
}

// === ADMIN: TẠO VOUCHER ===
async function createVoucher(){
  var overlay = document.getElementById('voucherCreateOverlay');
  if (overlay) { overlay.style.display = 'flex'; return; }
  overlay = document.createElement('div');
  overlay.id = 'voucherCreateOverlay';
  overlay.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,0.5);z-index:9999;display:flex;align-items:center;justify-content:center;padding:16px;';
  overlay.innerHTML = '<div class="card" style="max-width:420px;width:100%;padding:24px;position:relative;">' +
    '<h2 style="font-size:18px;margin:0 0 16px;">' + li('unlock', 18) + ' Tạo Voucher mới</h2>' +
    '<div style="display:flex;flex-direction:column;gap:14px;">' +
    '<div><label style="font-size:12px;color:var(--muted);display:block;margin-bottom:6px;">Gói</label><div style="display:flex;gap:8px;">' +
    '<button class="btn btn-sm voucher-tier-btn" data-tier="plus" style="flex:1;justify-content:center;">Plus</button>' +
    '<button class="btn btn-sm voucher-tier-btn" data-tier="pro" style="flex:1;justify-content:center;">Pro</button>' +
    '<button class="btn btn-sm voucher-tier-btn" data-tier="super" style="flex:1;justify-content:center;">Super</button>' +
    '</div></div>' +
    '<div><label style="font-size:12px;color:var(--muted);display:block;margin-bottom:6px;">Số lượt dùng</label><input id="voucherMaxUses" type="number" min="1" value="1" style="width:100%;padding:10px 12px;border-radius:8px;border:1px solid var(--border);background:var(--card-solid);color:var(--text);font-size:14px;" /></div>' +
    '<div><label style="font-size:12px;color:var(--muted);display:block;margin-bottom:6px;">Thời hạn (ngày)</label><input id="voucherExpiryDays" type="number" min="1" value="30" style="width:100%;padding:10px 12px;border-radius:8px;border:1px solid var(--border);background:var(--card-solid);color:var(--text);font-size:14px;" /></div>' +
    '<div id="voucherCreateMsg" style="font-size:13px;min-height:18px;"></div>' +
    '<div style="display:flex;gap:8px;margin-top:4px;"><button class="btn btn-primary" style="flex:1;justify-content:center;" onclick="submitCreateVoucher()">' + li('check', 14) + ' Tạo Voucher</button><button class="btn btn-ghost" onclick="closeVoucherModal()">' + t("cancel") + '</button></div>' +
    '</div>' +
    '<button onclick="closeVoucherModal()" style="position:absolute;top:12px;right:12px;background:none;border:none;color:var(--muted);font-size:20px;cursor:pointer;padding:4px;">×</button>' +
    '</div>';
  document.body.appendChild(overlay);
  var selectedTier = 'plus';
  var btns = overlay.querySelectorAll('.voucher-tier-btn');
  for (var i = 0; i < btns.length; i++) {
    if (btns[i].dataset.tier === 'plus') btns[i].classList.add('btn-primary');
    else btns[i].classList.add('btn-ghost');
    btns[i].onclick = function() {
      selectedTier = this.dataset.tier;
      for (var j = 0; j < btns.length; j++) {
        btns[j].classList.remove('btn-primary');
        btns[j].classList.add('btn-ghost');
      }
      this.classList.remove('btn-ghost');
      this.classList.add('btn-primary');
    };
  }
  overlay._selectedTier = function() { return selectedTier; };
}
function closeVoucherModal(){
  var o = document.getElementById('voucherCreateOverlay');
  if (o) o.remove();
}
function submitCreateVoucher(){
  var overlay = document.getElementById('voucherCreateOverlay');
  if (!overlay) return;
  var tier = overlay._selectedTier();
  var maxUses = parseInt(document.getElementById('voucherMaxUses').value || '1');
  var expiryDays = parseInt(document.getElementById('voucherExpiryDays').value || '30');
  var msg = document.getElementById('voucherCreateMsg');
  if (!tier) { msg.innerHTML = '<span style="color:#f87171;">Chọn gói</span>'; return; }
  if (maxUses < 1) { msg.innerHTML = '<span style="color:#f87171;">Số lượng phải > 0</span>'; return; }
  if (expiryDays < 1) { msg.innerHTML = '<span style="color:#f87171;">Số ngày phải > 0</span>'; return; }
  msg.innerHTML = '<span style="color:var(--amber);">⏳ Đang tạo...</span>';
  fetch("/api/admin/vouchers", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ tier: tier, maxUses: maxUses, expiryDays: expiryDays }) })
    .then(function(r){ return r.json(); })
    .then(function(data){
      if (data.success){
        msg.innerHTML = '<span style="color:#4ade80;">✓ Đã tạo: ' + data.voucher.code + '</span>';
        closeVoucherModal(); loadAdminVouchers(document.getElementById("adminBody"), data.voucher);
      } else {
        msg.innerHTML = '<span style="color:#f87171;">✗ ' + esc(data.error || "Lỗi") + '</span>';
      }
    }).catch(function(){
      msg.innerHTML = '<span style="color:#f87171;">✗ Lỗi</span>';
    });
}
// === ADMIN: XEM DANH SÁCH VOUCHER ===
async function listVouchers() {
  const res = await fetch("/api/admin/vouchers");
  const data = await res.json();
  if (data.vouchers) {
    console.table(data.vouchers);
    alert(t("admin_vouchers") + ": " + data.vouchers.length);
  }
}
// === ADMIN: PROMO SETTINGS ===
async function savePromoSettings() {
  var enabled = document.getElementById("promoEnabled").checked;
  var start = document.getElementById("promoStart").value;
  var end = document.getElementById("promoEnd").value;
  var monthDisc = parseInt(document.getElementById("promoMonthDisc").value) || 5;
  var yearDisc = parseInt(document.getElementById("promoYearDisc").value) || 20;
  var res = await fetch("/api/admin/promo-settings", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ enabled: enabled, start: start, end: end, monthDisc: monthDisc, yearDisc: yearDisc })
  });
  var data = await res.json();
  if (data.success) {
    alert(t("admin_promo_saved"));
    updatePromoCountdown();
  } else {
    alert(data.error || t("admin_promo_save_error"));
  }
}

function updatePromoCountdown() {
  var el = document.getElementById("promoCountdown");
  if (!el) return;
  var enabled = document.getElementById("promoEnabled").checked;
  var start = document.getElementById("promoStart").value;
  var end = document.getElementById("promoEnd").value;
  if (!enabled || !start || !end) { el.innerHTML = ""; return; }
  var now = new Date();
  var endDate = new Date(end + "T23:59:59");
  if (now > endDate) { el.innerHTML = \'<span style="color:#f87171;">\' + t("admin_promo_ended") + \'</span>\'; return; }
  var startDate = new Date(start + "T00:00:00");
  if (now < startDate) { el.innerHTML = \'<span style="color:#fbbf24;">\' + t("admin_promo_starts") + \': \' + start + \'</span>\'; return; }
  var diff = endDate - now;
  var days = Math.floor(diff / 86400000);
  var hours = Math.floor((diff % 86400000) / 3600000);
  var mins = Math.floor((diff % 3600000) / 60000);
  el.innerHTML = '<span style="color:#4ade80;">⏰ ' + t("admin_promo_remaining") + ' ' + days + ' ' + t("days") + ' ' + hours + ' ' + t("hours") + ' ' + mins + ' ' + t("minutes") + '</span>';
  setTimeout(updatePromoCountdown, 60000);
}

// === ADMIN: EXPORT PAYMENT CSV ===
function exportPayCSV() {
  fetch("/api/admin/payment-reports").then(function(r){return r.json();}).then(function(d){
    if (!d.payments || d.payments.length === 0) { alert(t("admin_no_data")); return; }
    var csv = t("pay_date") + "," + t("admin_customer") + "," + t("plan") + "," + t("pay_type") + "," + t("admin_amount") + "," + t("pay_status") + "\\n";
    for (var i = 0; i < d.payments.length; i++) {
      var p = d.payments[i];
      csv += p.createdAt + "," + p.username + "," + (p.tier||"") + "," + (p.type||"") + "," + ((p.amount/100).toFixed(2)) + " " + (p.currency||"usd") + "," + p.status + "\\n";
    }
    var blob = new Blob([csv], { type: "text/csv" });
    var a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "payment-report.csv";
    a.click();
  });
}
// ---------- DISCLAIMER + REPORT ABUSE ----------
// Nội dung mang tính mẫu, nên được luật sư rà soát trước khi coi là văn bản pháp lý chính thức.
function renderDisclaimer(app){
  var isEn = currentLang === "en";
  renderLegalPage(app, t("disclaimer_title"), t("disclaimer_subtitle"), isEn ? [
    { h: "Service provided as-is", p: "SHURL is provided as-is and as-available. We work to keep it accurate and running, but we do not guarantee that it will be uninterrupted or error-free, and statistics (clicks, countries, devices) are approximate." },
    { h: "User-created content", p: "Short links, QR codes, Link-in-bio pages and the content they point to are created by users. SHURL does not review destinations in advance and is not responsible for them. Creators are solely responsible for what they publish and share." },
    { h: "Third-party links and sites", p: "Links may lead to websites we do not own or control. We are not responsible for their content, availability, products, services or privacy practices. Check a destination before you enter personal or payment information." },
    { h: "Bank transfer (VietQR) codes", p: "For VietQR codes, the account holder name shown on a card or sign is typed in by the creator and is not verified by SHURL. SHURL does not take part in, hold, or guarantee any transfer. Before you confirm a transfer, always check the recipient name shown by your own banking app. SHURL is not liable for losses caused by transfers to the wrong or fraudulent account." },
    { h: "Preventing and handling abuse", p: "Using SHURL for fraud, impersonation, phishing, malware or unlawful content is prohibited. We may disable links or QR codes and suspend accounts without notice. To report abuse, use the Report abuse page or email support@shurlvn.com." },
    { h: "Limitation of liability", p: "To the fullest extent permitted by law, SHURL is not liable for indirect, incidental or consequential damages arising from the use of, or inability to use, the service." },
    { h: "Changes", p: "We may update this disclaimer from time to time. The updated version applies from the moment it is posted on this page." }
  ] : [
    { h: "Dịch vụ cung cấp nguyên trạng", p: "SHURL được cung cấp trên cơ sở nguyên trạng và theo khả năng đáp ứng. Chúng tôi cố gắng giữ dịch vụ chính xác và ổn định nhưng không cam kết dịch vụ luôn liên tục hay không có lỗi; số liệu thống kê (lượt click, quốc gia, thiết bị) chỉ mang tính tham khảo." },
    { h: "Nội dung do người dùng tạo", p: "Link rút gọn, mã QR, trang Link-in-bio và nội dung mà chúng trỏ tới do người dùng tạo ra. SHURL không kiểm duyệt trước đích đến và không chịu trách nhiệm về nội dung đó. Người tạo hoàn toàn chịu trách nhiệm về những gì họ đăng tải và chia sẻ." },
    { h: "Liên kết và trang web bên thứ ba", p: "Liên kết có thể dẫn tới website không thuộc sở hữu hay kiểm soát của SHURL. Chúng tôi không chịu trách nhiệm về nội dung, tính sẵn sàng, sản phẩm, dịch vụ hay chính sách quyền riêng tư của các trang đó. Hãy kiểm tra kỹ trước khi nhập thông tin cá nhân hoặc thanh toán." },
    { h: "Mã QR chuyển khoản (VietQR)", p: "Với mã VietQR, tên chủ tài khoản hiển thị trên thẻ hoặc bảng do người tạo tự nhập và không được SHURL xác minh. SHURL không tham gia, không giữ hộ và không bảo đảm bất kỳ giao dịch chuyển tiền nào. Trước khi xác nhận chuyển tiền, hãy luôn đối chiếu tên người nhận hiển thị trong app ngân hàng của bạn. SHURL không chịu trách nhiệm về thiệt hại do chuyển nhầm hoặc chuyển vào tài khoản lừa đảo." },
    { h: "Ngăn chặn và xử lý lạm dụng", p: "Nghiêm cấm dùng SHURL để lừa đảo, giả mạo, đánh cắp thông tin, phát tán mã độc hoặc đăng tải nội dung vi phạm pháp luật. Chúng tôi có thể vô hiệu hoá link, mã QR và tạm ngưng tài khoản mà không cần báo trước. Để báo cáo vi phạm, hãy dùng trang Báo cáo lạm dụng hoặc gửi email tới support@shurlvn.com." },
    { h: "Giới hạn trách nhiệm", p: "Trong phạm vi pháp luật cho phép, SHURL không chịu trách nhiệm về các thiệt hại gián tiếp, ngẫu nhiên hoặc hệ quả phát sinh từ việc sử dụng hoặc không thể sử dụng dịch vụ." },
    { h: "Thay đổi", p: "Chúng tôi có thể cập nhật nội dung miễn trừ trách nhiệm này theo thời gian. Phiên bản cập nhật có hiệu lực kể từ khi được đăng tải trên trang này." }
  ]);
}

// Trang báo cáo công khai (không cần đăng nhập): gửi tới POST /api/reports, quản trị viên xem ở tab Báo cáo.
function renderReport(app){
  var cats = ["scam", "phishing", "impersonation", "malware", "illegal", "spam", "other"];
  var opts = cats.map(function(c){ return '<option value="' + c + '">' + t("rp_cat_" + c) + '</option>'; }).join("");
  app.innerHTML =
    '<div class="page-head"><h1>' + t("rp_title") + '</h1></div>' +
    '<p class="sub">' + t("rp_sub") + '</p>' +
    '<div class="card" style="max-width:720px;">' +
    '<label for="rpTarget">' + t("rp_target") + '</label><input type="text" id="rpTarget" maxlength="500" placeholder="' + t("rp_target_ph") + '">' +
    '<label for="rpCat">' + t("rp_category") + '</label><select id="rpCat" class="qr-existing-select" style="margin-top:0;">' + opts + '</select>' +
    '<label for="rpDetails">' + t("rp_details") + '</label><textarea id="rpDetails" rows="4" maxlength="1000" class="qr-existing-select" style="resize:vertical;font-family:inherit;margin-top:0;"></textarea>' +
    '<label for="rpContact">' + t("rp_contact") + '</label><input type="email" id="rpContact" maxlength="120">' +
    '<button type="button" class="btn btn-primary" id="rpSubmit" style="margin-top:14px;">' + t("rp_submit") + '</button>' +
    '<div id="rpMsg" style="margin-top:12px;"></div>' +
    '<p class="hint" style="margin-top:12px;">' + t("rp_note") + '</p></div>';
  var btn = document.getElementById("rpSubmit"), msg = document.getElementById("rpMsg");
  btn.onclick = function(){
    var target = document.getElementById("rpTarget").value.replace(/^\\s+|\\s+$/g, "");
    if (!target) { msg.innerHTML = '<div class="msg msg-error">' + t("rp_err_target") + '</div>'; return; }
    btn.disabled = true; btn.textContent = t("rp_sending"); msg.innerHTML = "";
    api("/api/reports", "POST", {
      target: target, category: document.getElementById("rpCat").value,
      details: document.getElementById("rpDetails").value, contact: document.getElementById("rpContact").value
    }).then(function(){
      msg.innerHTML = '<div class="msg msg-ok">' + t("rp_ok") + '</div>';
      document.getElementById("rpTarget").value = ""; document.getElementById("rpDetails").value = "";
      btn.disabled = false; btn.textContent = t("rp_submit");
    }).catch(function(err){
      msg.innerHTML = '<div class="msg msg-error">' + esc((err && err.message) || t("rp_err")) + '</div>';
      btn.disabled = false; btn.textContent = t("rp_submit");
    });
  };
}

// ---------- FOOTER I18N ----------
// Thông tin doanh nghiệp hiển thị ở chân trang. Chưa có doanh nghiệp thì để trống: khối này tự ẩn, có thông tin thì điền vào đây.
var BUSINESS_INFO = { name: "", taxCode: "", address: "", phone: "" };
function businessInfoHtml(){
  var rows = [];
  if (BUSINESS_INFO.name) rows.push(t("ft_biz_name") + ": " + esc(BUSINESS_INFO.name));
  if (BUSINESS_INFO.taxCode) rows.push(t("ft_biz_tax") + ": " + esc(BUSINESS_INFO.taxCode));
  if (BUSINESS_INFO.address) rows.push(t("ft_biz_addr") + ": " + esc(BUSINESS_INFO.address));
  if (BUSINESS_INFO.phone) rows.push(t("ft_biz_phone") + ": " + esc(BUSINESS_INFO.phone));
  return rows.length ? '<p class="ft-biz">' + rows.join("<br>") + '</p>' : "";
}
function renderFooter(){
  var el = document.getElementById("siteFooter");
  if (!el) return;
  var vi = currentLang === "vi";
  var tb = vi ? "/tools/" : "/en/tools/";
  var tools = vi ? [["dem-ky-tu", "Đếm ký tự"], ["tao-link-utm", "Tạo link UTM"], ["bo-dau-tieng-viet", "Bỏ dấu / tạo slug"]]
                 : [["character-counter", "Character counter"], ["utm-link-builder", "UTM link builder"], ["slug-generator", "Accent remover / slug"]];
  function col(title, links){ return '<div class="ft-col"><h4>' + title + '</h4>' + links.join("") + '</div>'; }
  function lnk(href, text, slide){ return '<a href="' + href + '"' + (slide ? ' data-slide="' + slide + '"' : "") + '>' + text + '</a>'; }
  var toolLinks = tools.map(function(x){ return lnk(tb + x[0], x[1], "tools"); });
  toolLinks.push(lnk(vi ? "/tools" : "/en/tools", t("ft_all_tools"), "tools"));
  el.innerHTML =
    '<div class="ft-grid">' +
      '<div class="ft-brand"><span class="ft-logo">SHURLVN.COM</span><p>' + t("footer_tagline") + '</p><p>' + t("ft_compliance") + '</p>' +
      '<a href="https://mail.google.com/mail/?view=cm&amp;fs=1&amp;to=support@shurlvn.com&amp;su=SHURL%20Support" target="_blank" rel="noopener">' + t("footer_contact") + ': support@shurlvn.com</a>' + businessInfoHtml() + '</div>' +
      col(t("ft_products"), [lnk("#/home", t("ft_shorten")), lnk("#/bulkqr", t("ft_qr")), lnk("#/linkinbio", t("ft_bio")), lnk("#/scanner", t("ft_scanner"))]) +
      col(t("ft_tools"), toolLinks) +
      col(t("ft_support"), [lnk("#/pricing", t("ft_pricing")), lnk("#/api", t("ft_api")), lnk("/blog", t("footer_blog"), "blog"), lnk("#/report", t("ft_report"), "report")]) +
      col(t("ft_legal"), [lnk("#/terms", t("footer_terms"), "terms"), lnk("#/privacy", t("footer_privacy"), "privacy"), lnk("#/disclaimer", t("ft_disclaimer"), "disclaimer")]) +
    '</div>' +
    '<div class="ft-bottom">© ' + new Date().getFullYear() + ' SHURLVN.COM. ' + t("ft_rights") + '</div>';
}


// ---------- SLIDE PANEL: Công cụ · Blog · Điều khoản · Chính sách ----------
// Trang trượt từ phải sang và dừng sát thanh công cụ (thanh này vẫn bấm được để quay lại tính năng).
// /tools và /blog vẫn là trang server riêng (SEO); panel chỉ nhúng chúng bằng iframe cùng origin.
// Điều khoản/Chính sách được vẽ thẳng vào panel bằng renderTerms/renderPrivacy. Không đổi URL, chỉ thêm 1 mục lịch sử để nút Back đóng panel.
var slideOpen = false;
var slidePath = "/";
function slidePanelEl(){
  var p = document.getElementById("slidePanel");
  if (p) return p;
  p = document.createElement("div");
  p.id = "slidePanel";
  p.className = "slide-panel";
  p.innerHTML = '<div class="slide-bar"><button type="button" class="btn btn-ghost btn-sm slide-back">' +
    '<svg width="16" height="16" viewBox="0 0 24 24" style="fill:none;stroke:currentColor;stroke-width:2;stroke-linecap:round;stroke-linejoin:round"><path d="m12 19-7-7 7-7"/><path d="M19 12H5"/></svg> <span></span></button>' +
    '<strong class="slide-title"></strong>' +
    '<div class="slide-url" role="button" tabindex="0"><span class="slide-url-host"></span><span class="slide-url-path"></span></div></div><div class="slide-body"></div>';
  var urlBox = p.querySelector(".slide-url");
  p.querySelector(".slide-url-host").textContent = location.host;
  // Bấm vào ô link để chép đường dẫn thật của trang đang xem (URL trên thanh địa chỉ không đổi khi xem trong panel).
  var copyUrl = function(){ copyText(location.origin + slidePath, p.querySelector(".slide-url-path")); };
  urlBox.addEventListener("click", copyUrl);
  urlBox.addEventListener("keydown", function(ev){ if (ev.key === "Enter" || ev.key === " ") { ev.preventDefault(); copyUrl(); } });
  p.querySelector(".slide-back").addEventListener("click", function(){
    if (history.state && history.state.slide) history.back(); else closeSlide();
  });
  document.body.appendChild(p);
  return p;
}
function slideSetPath(path){
  slidePath = path;
  var el = document.querySelector("#slidePanel .slide-url-path");
  if (el) el.textContent = path === "/" ? "" : path;
}
// Trang nhúng: ẩn header riêng (logo dẫn về "/" sẽ mở cả SPA lồng trong iframe) và chặn link về trang chủ.
function slideFrameReady(e){
  try {
    var d = e.target.contentDocument;
    if (!d || !d.head) return;
    slideSetPath(d.location.pathname + d.location.search);
    var st = d.createElement("style");
    st.textContent = "header{display:none!important}";
    d.head.appendChild(st);
    d.addEventListener("click", function(ev){
      var a = ev.target.closest ? ev.target.closest("a") : null;
      if (!a || !a.href || ev.ctrlKey || ev.metaKey) return;
      var u = new URL(a.href, d.location.href);
      if (u.origin !== location.origin) { a.target = "_blank"; a.rel = "noopener"; return; }
      if (u.pathname === "/") { ev.preventDefault(); closeSlide(); if (u.hash) location.hash = u.hash; }
    });
  } catch (err) {}
}
function openSlide(kind, url){
  var p = slidePanelEl();
  var titles = { tools: t("footer_tools"), blog: t("footer_blog"), terms: t("footer_terms"), privacy: t("footer_privacy"), disclaimer: t("ft_disclaimer"), report: t("ft_report") };
  var inline = { terms: renderTerms, privacy: renderPrivacy, disclaimer: renderDisclaimer, report: renderReport };
  p.querySelector(".slide-title").textContent = titles[kind] || "";
  p.querySelector(".slide-back span").textContent = t("slide_back");
  var body = p.querySelector(".slide-body");
  body.innerHTML = "";
  body.scrollTop = 0;
  var startPath = url || (kind === "tools" ? (currentLang === "en" ? "/en/tools" : "/tools") : kind === "blog" ? "/blog" : "/#/" + kind);
  slideSetPath(startPath);
  if (inline[kind]) {
    var box = document.createElement("div");
    box.className = "slide-legal";
    body.appendChild(box);
    inline[kind](box);
  } else {
    var f = document.createElement("iframe");
    f.className = "slide-frame";
    f.title = titles[kind] || "";
    f.addEventListener("load", slideFrameReady);
    f.src = startPath;
    body.appendChild(f);
  }
  if (!slideOpen) { history.pushState({ slide: kind }, ""); slideOpen = true; }
  p.style.display = "flex";
  void p.offsetWidth;
  p.classList.add("open");
}
function closeSlide(){
  if (!slideOpen) return;
  slideOpen = false;
  var p = document.getElementById("slidePanel");
  if (!p) return;
  p.classList.remove("open");
  setTimeout(function(){
    if (slideOpen) return;
    p.style.display = "none";
    p.querySelector(".slide-body").innerHTML = "";
  }, 420);
}
window.addEventListener("popstate", function(){ if (slideOpen) closeSlide(); });
document.addEventListener("click", function(e){
  var el = e.target;
  if (!el || !el.closest || e.button !== 0 || e.ctrlKey || e.metaKey || e.shiftKey) return;
  if (slideOpen && el.closest(".sb")) { closeSlide(); return; }
  var a = el.closest("a");
  if (!a || a.target === "_blank") return;
  var kind = a.getAttribute("data-slide"), href = a.getAttribute("href") || "";
  var isCard = a.classList.contains("tool-card") && (href.indexOf("/tools") === 0 || href.indexOf("/en/tools") === 0);
  if (isCard) kind = "tools";
  if (!kind) return;
  e.preventDefault();
  // Chỉ trang server (/tools, /blog) cần đường dẫn riêng; các trang còn lại vẽ thẳng vào panel.
  openSlide(kind, href.charAt(0) === "/" && (kind === "tools" || kind === "blog") ? href : null);
}, true);

// ---------- AI ASSISTANT ("Hỏi AI" — sparkle icon in header, dropdown chat panel) ----------
var aiChatHistory = [];
var _aiChatPanelClickHandler = null;
function closeAiChatPanel(){
  var p = document.getElementById("aiChatPanel");
  if (p) p.remove();
  if (_aiChatPanelClickHandler) {
    document.removeEventListener("click", _aiChatPanelClickHandler);
    _aiChatPanelClickHandler = null;
  }
}
function toggleAiChatPanel(){
  var existing = document.getElementById("aiChatPanel");
  if (existing) { closeAiChatPanel(); return; }
  var panel = document.createElement("div");
  panel.id = "aiChatPanel";
  panel.style.cssText = "position:fixed;top:60px;right:16px;width:340px;max-width:calc(100vw - 32px);height:440px;max-height:calc(100vh - 100px);background:var(--card);border:1px solid var(--border);border-radius:14px;box-shadow:0 12px 40px rgba(0,0,0,0.25);z-index:10000;display:flex;flex-direction:column;overflow:hidden;";
  panel.innerHTML =
    '<div style="padding:12px 14px;border-bottom:1px solid var(--border);display:flex;justify-content:space-between;align-items:center;flex-shrink:0;">' +
    '<strong style="font-size:14px;display:flex;align-items:center;gap:6px;color:var(--indigo);">' + li("sparkles", 16) + ' ' + esc(t("ai_assistant_title")) + '</strong>' +
    '<button id="aiChatCloseBtn" style="background:none;border:none;color:var(--muted);cursor:pointer;font-size:18px;line-height:1;padding:2px;">' + li("x", 16) + '</button>' +
    '</div>' +
    '<div id="aiChatMessages" style="flex:1;overflow-y:auto;padding:12px 14px;font-size:13px;"></div>' +
    '<div style="padding:10px;border-top:1px solid var(--border);display:flex;gap:8px;flex-shrink:0;">' +
    '<input type="text" id="aiChatInput" placeholder="' + esc(t("ai_assistant_placeholder")) + '" style="flex:1;padding:8px 10px;border:1px solid var(--input-border);border-radius:8px;background:var(--input-bg);color:var(--text);font-size:13px;">' +
    '<button class="btn btn-primary btn-sm" id="aiChatSendBtn">' + esc(t("ai_assistant_send")) + '</button>' +
    '</div>';
  document.body.appendChild(panel);

  if (aiChatHistory.length === 0) {
    appendAiChatBubble("assistant", t("ai_assistant_greeting"));
  } else {
    for (var i = 0; i < aiChatHistory.length; i++) appendAiChatBubble(aiChatHistory[i].role, aiChatHistory[i].content);
  }

  document.getElementById("aiChatCloseBtn").onclick = function(e) { e.stopPropagation(); closeAiChatPanel(); };
  document.getElementById("aiChatSendBtn").onclick = sendAiChatMessage;
  document.getElementById("aiChatInput").onkeypress = function(e){ if (e.key === "Enter") sendAiChatMessage(); };
  document.getElementById("aiChatInput").focus();

  _aiChatPanelClickHandler = function(e) {
    if (!panel.contains(e.target) && !(e.target.closest && e.target.closest("#aiAssistantBtn"))) {
      closeAiChatPanel();
    }
  };
  setTimeout(function() { document.addEventListener("click", _aiChatPanelClickHandler); }, 0);
}
function appendAiChatBubble(role, text){
  var wrap = document.getElementById("aiChatMessages");
  var bubble = document.createElement("div");
  bubble.style.cssText = "margin-bottom:10px;max-width:85%;padding:8px 12px;border-radius:12px;line-height:1.5;white-space:pre-wrap;" +
    (role === "user" ? "margin-left:auto;background:var(--indigo);color:#fff;border-bottom-right-radius:2px;" : "background:var(--stat-bg);color:var(--text);border-bottom-left-radius:2px;");
  bubble.textContent = text;
  wrap.appendChild(bubble);
  wrap.scrollTop = wrap.scrollHeight;
}
function sendAiChatMessage(){
  var input = document.getElementById("aiChatInput");
  var message = input.value.trim();
  if (!message) return;
  var sendBtn = document.getElementById("aiChatSendBtn");
  appendAiChatBubble("user", message);
  input.value = "";
  input.disabled = true;
  sendBtn.disabled = true;
  api("/api/ask-ai", "POST", { message: message, history: aiChatHistory }).then(function(data){
    appendAiChatBubble("assistant", data.reply);
    aiChatHistory.push({ role: "user", content: message });
    aiChatHistory.push({ role: "assistant", content: data.reply });
    if (aiChatHistory.length > 12) aiChatHistory = aiChatHistory.slice(-12);
  }).catch(function(err){
    appendAiChatBubble("assistant", (err && err.message) || t("ai_assistant_error"));
  }).then(function(){
    input.disabled = false;
    sendBtn.disabled = false;
    input.focus();
  });
}

// ---------- INIT ----------
window.addEventListener("hashchange", function(){ render(); renderFooter(); fetchMaintenanceStatus(); });
document.addEventListener("click", function(e){
  if (langSubmenuOpen && !e.target.closest("#langDropdown") && !e.target.closest("[onclick*=toggleLangDropdown]")){
    langSubmenuOpen = false;
    var wasMenuOpen = document.getElementById("sbUserMenu") && document.getElementById("sbUserMenu").classList.contains("show");
    renderNav();
    if (wasMenuOpen) { var m = document.getElementById("sbUserMenu"); if (m) m.classList.add("show"); }
  }
});
window.addEventListener("DOMContentLoaded", function(){
  // Theme is already applied synchronously by the inline head script above
  // (runs before first paint, to avoid a flash of the wrong theme) — nothing to do here.
  api("/api/auth/me").then(function(data){ state.user = data.user; state.limits = data.limits; })
    .catch(function(){ state.user = null; state.limits = null; })
    .then(function(){
      render(); renderFooter();
      var params = new URLSearchParams(window.location.search);
      window.__pendingGoogleError = params.get("google_error");
      if (params.get("upgrade") === "success") {
        var tierNames = { plus: "Plus", pro: "Pro", super: "Super" };
        var tn = state.user ? (tierNames[state.user.role] || state.user.role) : "";
        showStripeSuccessModal(tn);
      } else if (params.get("upgrade") === "cancelled") {
        showStripeCancelModal();
      } else if (params.get("voucher") === "success") {
        showVoucherSuccessModal();
      } else if (params.get("voucher") === "cancelled") {
        showVoucherCancelModal();
      }
      // Trang công cụ (ví dụ Tạo link UTM) chuyển sang đây với ?shorten=<link> để điền sẵn ô rút gọn.
      var preShorten = params.get("shorten");
      if (preShorten && (preShorten.indexOf("https://") === 0 || preShorten.indexOf("http://") === 0)) {
        // render() vẽ trang có hiệu ứng mờ dần nên form chưa có ngay — chờ tới khi ô nhập xuất hiện (tối đa ~3 giây).
        var preTries = 0;
        (function fillPreShorten() {
          var preInput = document.getElementById("f_url");
          if (preInput) { preInput.value = preShorten; if (typeof updateHomePreview === "function") updateHomePreview(); }
          else if (preTries++ < 30) { setTimeout(fillPreShorten, 100); }
        })();
      }
      if (window.location.search) history.replaceState(null, "", window.location.pathname + window.location.hash);
    });
});
</script>
</body>
</html>`;
}
