/* ============================================================================
   ÜSTAD KASA · ŞATAFAT KATMANI (satafat.js)
   3B eğilme · tıklama dalgası · ışıltı süpürmesi · konfeti · parıldayan zemin.
   Kütüphane yok. Panelin kendi koduna dokunmaz; olayları dinler ve süsler.
   ========================================================================== */
(function () {
  "use strict";

  var hareketAz = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ------------------------------------------------- 1) parıldayan zemin tülü */
  function tulKur() {
    if (document.querySelector(".satafatTul")) return;
    var t = document.createElement("div");
    t.className = "satafatTul";
    document.body.appendChild(t);
  }

  /* --------------------------------------------------------- 2) 3B eğilme */
  function egilmeBagla(kok) {
    if (hareketAz) return;
    var kartlar = (kok || document).querySelectorAll(".kart:not(.egilBagli)");
    Array.prototype.forEach.call(kartlar, function (k) {
      k.classList.add("egilBagli");
      k.addEventListener("mousemove", function (e) {
        var r = k.getBoundingClientRect();
        var x = (e.clientX - r.left) / r.width - 0.5;
        var y = (e.clientY - r.top) / r.height - 0.5;
        k.classList.add("egil");
        k.style.transform = "perspective(1100px) rotateY(" + (x * 5).toFixed(2) + "deg) rotateX(" +
                            (-y * 5).toFixed(2) + "deg) translateY(-3px) scale(1.012)";
      });
      k.addEventListener("mouseleave", function () {
        k.style.transform = "";
        window.setTimeout(function () { k.classList.remove("egil"); }, 120);
      });
    });
  }

  /* --------------------------------------------- 3) tıklama dalgası + konfeti */
  function kutlama(x, y) {
    if (hareketAz) return;
    var renkler = ["#22d3ee", "#f472b6", "#fbbf24", "#34d399", "#a78bfa", "#ffffff"];
    for (var i = 0; i < 16; i++) {
      var k = document.createElement("i");
      k.className = "kivilcim";
      k.style.left = x + "px";
      k.style.top = y + "px";
      k.style.background = renkler[i % renkler.length];
      k.style.setProperty("--dx", (Math.random() * 220 - 110).toFixed(0) + "px");
      k.style.setProperty("--dy", (-Math.random() * 170 - 30).toFixed(0) + "px");
      document.body.appendChild(k);
      (function (el) { window.setTimeout(function () { el.remove(); }, 1100); })(k);
    }
  }

  function dalga(el, e) {
    if (hareketAz) return;
    var r = el.getBoundingClientRect();
    var d = document.createElement("span");
    d.className = "dalgacik";
    d.style.left = (e.clientX - r.left) + "px";
    d.style.top = (e.clientY - r.top) + "px";
    el.appendChild(d);
    window.setTimeout(function () { d.remove(); }, 650);
  }

  function dugmeBagla(kok) {
    var dugmeler = (kok || document).querySelectorAll(".dugme:not(.satafatBagli)");
    Array.prototype.forEach.call(dugmeler, function (b) {
      b.classList.add("satafatBagli");
      b.addEventListener("click", function (e) {
        dalga(b, e);
        var onemli = b.classList.contains("birincil") || b.classList.contains("altin") ||
                     b.classList.contains("yesil") || /kaydet|ekle|kayıt|kayit/i.test(b.textContent || "");
        if (onemli) kutlama(e.clientX, e.clientY);
      }, true);
    });
  }

  /* ------------------------------------------------------ 4) ilk kurulum */
  function kur(kok) {
    if (typeof kok === "undefined" || kok === null) kok = document;
    egilmeBagla(kok);
    dugmeBagla(kok);
    aiUyarisi();
  }

  function basla() {
    tulKur();
    pdfDugmeleriniDevral();
    cevrimdisiRozet();
    kur(document);
    // Panel ekranı yeniden çizdikçe yeni kart/düğmelere süsleri bağla.
    var hedef = document.getElementById("icerik") || document.body;
    if (window.MutationObserver) {
      var gozcu = new MutationObserver(function () { window.requestAnimationFrame(function () { kur(document); }); });
      gozcu.observe(hedef, { childList: true, subtree: true });
    }
    // Giriş perdesi kapandığında süsleri tazele.
    var perde = document.getElementById("girisForm");
    if (perde) {
      perde.addEventListener("submit", function () {
        window.setTimeout(function () { kur(document); kutlama(window.innerWidth * 0.5, window.innerHeight * 0.35); }, 900);
      }, true);
    }
    // Sekme başlığına ışıltı (dikkat çekici, zarif)
    var bas = document.title;
    if (!hareketAz) {
      var n = 0;
      window.setInterval(function () {
        if (document.hidden) { document.title = bas; return; }
        n = (n + 1) % 4;
        document.title = bas.replace(/^[✦✧· ]+/, "") + ["", " ✦", " ✦✦", " ✧"][n];
      }, 1400);
    }
  }

  // Dışa açık küçük API (panel isterse elle çağırır)
  /* ==========================================================================
     PDF — HİÇBİR PROGRAMA GEREK YOK
     Word/Excel/Office kurulu olmasa da çalışır: ekranın içeriği yazdırma
     penceresine kopyalanır, tarayıcının kendi "PDF olarak kaydet"i (ya da
     Windows'un yerleşik "Microsoft Print to PDF"i) kullanılır. İnternet gerekmez.
     ======================================================================== */
  function yazdirHtml() {
    var icerik = document.getElementById("icerik");
    var firma = ((document.getElementById("yanFirmaAlt") || {}).textContent || "").trim();
    var ekran = ((document.getElementById("ekranBaslik") || {}).textContent || "").trim();
    var dip = ((document.getElementById("yanSurum") || {}).textContent || "").trim();
    var d = new Date();
    var tarih = d.toLocaleDateString("tr-TR") + " " + d.toLocaleTimeString("tr-TR").slice(0, 5);
    var css = ""
      + "*{box-sizing:border-box}"
      + "body{font:12.5px/1.5 'Segoe UI',Arial,sans-serif;color:#111;margin:26px 22px;background:#fff}"
      + "h1{font-size:20px;margin:0 0 2px;color:#111}"
      + ".ustBilgi{display:flex;justify-content:space-between;align-items:flex-end;border-bottom:3px solid #d4a017;padding-bottom:8px;margin-bottom:14px}"
      + ".ustBilgi b{font-size:14px;color:#8a5a00}"
      + ".ustBilgi span{font-size:11px;color:#555}"
      + "h2,h3{font-size:15px;margin:16px 0 6px;color:#8a5a00}"
      + "table{width:100%;border-collapse:collapse;margin:6px 0 14px;page-break-inside:auto}"
      + "th,td{border:1px solid #bbb;padding:5px 7px;font-size:11.5px;text-align:left;vertical-align:top}"
      + "th{background:#f3e7c8;color:#5a3d00}"
      + "tr:nth-child(even) td{background:#fafafa}"
      + ".kart{border:1px solid #ccc;border-radius:8px;padding:9px;margin:6px 0;background:#fff;display:inline-block;min-width:190px;vertical-align:top}"
      + ".kart .kartEtiket{font-size:10px;color:#666;text-transform:uppercase;letter-spacing:1px}"
      + ".sayi,.kartDeger{font-size:16px;font-weight:700;color:#111 !important;-webkit-text-fill-color:#111 !important}"
      + "svg{max-width:100%;height:auto}"
      + ".dugme,.islemHucre,.onayKutu{display:none !important}"
      + "@media print{ body{margin:10mm} thead{display:table-header-group} }";
    var logo = (document.querySelector(".logoYer svg") || {}).outerHTML || "";
    var html = "<!doctype html><html lang='tr'><head><meta charset='utf-8'><title>" + ekran + " · ÜSTAD KASA</title>"
      + "<style>" + css + "</style></head><body>"
      + "<div class='ustBilgi'><div style='display:flex;gap:12px;align-items:center'>"
      + "<div style='width:46px;height:46px'>" + logo + "</div>"
      + "<div><h1>" + ekran + "</h1><b>ÜSTAD KASA</b> &nbsp;<span>" + firma + "</span></div></div>"
      + "<span>" + tarih + " &nbsp;|&nbsp; " + dip + "</span></div>"
      + (icerik ? icerik.innerHTML : "")
      + "<p style='margin-top:22px;font-size:10px;color:#777'>Bu belge ÜSTAD KASA tarafından yazdırma penceresiyle üretildi · internet gerekmez.</p>"
      + "</body></html>";
    return html;
  }

  function yazdirPdf() {
    var html = yazdirHtml();
    var w = window.open("", "_blank", "width=1180,height=820");
    if (!w) {  // açılır pencere engellendiyse gizli iframe ile yazdır
      var f = document.createElement("iframe");
      f.style.cssText = "position:fixed;right:0;bottom:0;width:0;height:0;border:0";
      document.body.appendChild(f);
      f.contentDocument.open(); f.contentDocument.write(html); f.contentDocument.close();
      window.setTimeout(function () { f.contentWindow.focus(); f.contentWindow.print(); }, 500);
      window.setTimeout(function () { f.remove(); }, 60000);
      return "cerceve";
    }
    w.document.open(); w.document.write(html); w.document.close();
    window.setTimeout(function () { w.focus(); w.print(); }, 450);
    return "pencere";
  }

  // Panelin kendi PDF düğmelerini (Word'e giden yolu) devral: hepsi bu yazdırma yolunu kullanır.
  function pdfDugmeleriniDevral() {
    document.addEventListener("click", function (e) {
      var b = e.target && e.target.closest ? e.target.closest("#hizliPdf,[id$='Pdf'],[data-pdf]") : null;
      if (!b) return;
      e.preventDefault(); e.stopImmediatePropagation();
      yazdirPdf();
    }, true);
  }

  /* ------------------------------------------- ÇEVRİMDIŞI ROZETİ (sol alt) */
  function cevrimdisiRozet() {
    if (document.getElementById("cevrimRozet")) return;
    var d = document.createElement("div");
    d.id = "cevrimRozet";
    d.style.cssText = "position:fixed;left:10px;bottom:10px;z-index:60;font:10.5px/1.4 'Segoe UI',Arial;" +
      "padding:4px 9px;border-radius:999px;letter-spacing:.6px;backdrop-filter:blur(6px);pointer-events:none";
    document.body.appendChild(d);
    var ciz = function () {
      var cevrimici = navigator.onLine;
      d.textContent = cevrimici ? "● İNTERNET VAR · asistan açık · kayıtlar yine yerel" : "● ÇEVRİMDIŞI ÇALIŞIR · internet gerekmez";
      d.style.background = cevrimici ? "rgba(255,210,87,.16)" : "rgba(63,240,166,.16)";
      d.style.color = cevrimici ? "#ffd257" : "#3ff0a6";
      d.style.border = "1px solid " + (cevrimici ? "rgba(255,210,87,.45)" : "rgba(63,240,166,.45)");
    };
    ciz();
    window.addEventListener("online", ciz);
    window.addEventListener("offline", ciz);
  }

  /* ------------------------- ÇEVRİMDIŞI UYARISI: yalnız asistan ekranında */
  function aiUyarisi() {
    var kutu = document.getElementById("aiSoru");
    if (!kutu) return;
    var ana = kutu.closest(".kart") || kutu.parentElement;
    if (!ana || ana.querySelector(".aiCevrimdisi")) return;
    var cevrimici = navigator.onLine;
    var n = document.createElement("div");
    n.className = "aiCevrimdisi";
    n.style.cssText = "margin:8px 0 0;padding:8px 11px;border-radius:10px;font-size:11.5px;line-height:1.5;" +
      (cevrimici
        ? "background:rgba(255,210,87,.12);border:1px solid rgba(255,210,87,.4);color:var(--altin)"
        : "background:rgba(255,113,133,.14);border:1px solid rgba(255,113,133,.45);color:var(--kirmizi)");
    n.innerHTML = cevrimici
      ? "ℹ Asistan internet ister (Gemini). Programın geri kalanı — kayıt, rapor, Word/Excel, PDF — internetsiz çalışır."
      : "⚠ ŞU AN ÇEVRİMDIŞISIN: asistan yanıt veremez. Kayıt, rapor, Word/Excel ve PDF sorunsuz çalışmaya devam eder.";
    ana.appendChild(n);
  }

  window.satafat = { kur: kur, kutlama: kutlama, yazdirPdf: yazdirPdf, yazdirHtml: yazdirHtml };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", basla);
  } else {
    basla();
  }
})();
