/**
 * Off Day Solutions — Internationalisation
 * Supports: English (en), Spanish (es), French (fr),
 *           German (de), Portuguese (pt), Japanese (ja), Mandarin (zh)
 *
 * Load this script BEFORE app.js so translations are applied
 * to .split-reveal elements before initSplitText processes them.
 */

(function () {
  'use strict';

  var LANG_KEY = 'ods-lang';

  /* ─────────────────────────────────────────────────────────────────────────
     TRANSLATIONS
     'en' is empty — HTML already contains English. applyLang('en') restores.
  ───────────────────────────────────────────────────────────────────────── */

  var T = {

    en: {},

    /* ── SPANISH ────────────────────────────────────────────────────────── */
    es: {
      'hero.eyebrow':        "Llegando — Otoño 2026",
      'hero.title':          "Objetos para la<br><em>hora sin estructura.</em>",
      'hero.sub':            "El brazo minorista de Off Day Collective. Un inventario seleccionado de herramientas físicas para el espacio entre obligaciones.",
      'hero.cta':            "Únete a la lista de espera",
      'marquee':             "Cerámica &nbsp;·&nbsp; Hierro Fundido &nbsp;·&nbsp; Papel Grueso &nbsp;·&nbsp; Luz Ambiental &nbsp;·&nbsp; Textil Tejido &nbsp;·&nbsp; Pigmento Natural &nbsp;·&nbsp; Madera Bruñida &nbsp;·&nbsp; Lino Prensado en Frío &nbsp;·&nbsp; Vidrio Prensado &nbsp;·&nbsp; Extracto Botánico &nbsp;·&nbsp; Piedra Cruda &nbsp;·&nbsp; Cuero Cosido a Mano &nbsp;·&nbsp; Cera de Abeja &nbsp;·&nbsp; Roble Ahumado &nbsp;·&nbsp; Latón Mate &nbsp;·&nbsp; Pizarra Recuperada &nbsp;·&nbsp;",
      'manifesto.label':     "El Resumen",
      'manifesto.h2':        "Llevamos cosas que no te piden nada.",
      'manifesto.body':      "La semana está estructurada. Las demandas son ruidosas. Solutions es un inventario seleccionado de objetos físicos reunidos alrededor del día libre — las horas sin agenda. Nada que optimizar. Nada que rastrear. Cada objeto se obtiene por su capacidad de anclarte, en silencio, en el tiempo presente.",
      'manifesto.footnote':  "— Una marca de Off Day Group",
      'preview.label':       "Próximamente",
      'preview.intro':       "Algo está tomando forma.",
      'preview.overlay':     "— Llegando —",
      'waitlist.label':      "Únete a la Lista",
      'waitlist.heading':    "Sé el primero en entrar.",
      'waitlist.sub':        "Sin boletines. Solo un mensaje, cuando llegue el momento.",
      'waitlist.placeholder':"tu@email.com",
      'waitlist.btn':        "Notifícame",
      'waitlist.success':    "Estás en la lista. Estaremos en contacto cuando se abran las puertas.",
      'footer.tagline':      "Utilidad para la hora sin estructura.",
    },

    /* ── FRENCH ─────────────────────────────────────────────────────────── */
    fr: {
      'hero.eyebrow':        "Bientôt — Automne 2026",
      'hero.title':          "Objets pour l'<em>heure sans structure.</em>",
      'hero.sub':            "La branche commerciale d'Off Day Collective. Un inventaire sélectionné d'outils physiques pour l'espace entre les obligations.",
      'hero.cta':            "Rejoindre la liste d'attente",
      'marquee':             "Céramique &nbsp;·&nbsp; Fonte &nbsp;·&nbsp; Papier Épais &nbsp;·&nbsp; Lumière Ambiante &nbsp;·&nbsp; Textile Tissé &nbsp;·&nbsp; Pigment Naturel &nbsp;·&nbsp; Bois Patiné &nbsp;·&nbsp; Lin Pressé à Froid &nbsp;·&nbsp; Verre Pressé &nbsp;·&nbsp; Extrait Botanique &nbsp;·&nbsp; Pierre Brute &nbsp;·&nbsp; Cuir Cousu Main &nbsp;·&nbsp; Cire d'Abeille &nbsp;·&nbsp; Chêne Fumé &nbsp;·&nbsp; Laiton Mat &nbsp;·&nbsp; Ardoise Récupérée &nbsp;·&nbsp;",
      'manifesto.label':     "Le Résumé",
      'manifesto.h2':        "Nous portons des choses qui ne vous demandent rien.",
      'manifesto.body':      "La semaine est structurée. Les exigences sont bruyantes. Solutions est un inventaire sélectionné d'objets physiques réunis autour du jour libre — les heures sans agenda. Rien à optimiser. Rien à suivre. Chaque objet est choisi pour sa capacité à vous ancrer, silencieusement, dans le temps présent.",
      'manifesto.footnote':  "— Une marque d'Off Day Group",
      'preview.label':       "Bientôt",
      'preview.intro':       "Quelque chose prend forme.",
      'preview.overlay':     "— Bientôt —",
      'waitlist.label':      "Rejoignez la Liste",
      'waitlist.heading':    "Soyez le premier à entrer.",
      'waitlist.sub':        "Pas de newsletters. Juste un message, quand le moment viendra.",
      'waitlist.placeholder':"votre@email.com",
      'waitlist.btn':        "Me notifier",
      'waitlist.success':    "Vous êtes sur la liste. Nous vous contacterons à l'ouverture.",
      'footer.tagline':      "Utilité pour l'heure sans structure.",
    },

    /* ── GERMAN ─────────────────────────────────────────────────────────── */
    de: {
      'hero.eyebrow':        "Demnächst — Herbst 2026",
      'hero.title':          "Objekte für die<br><em>unstrukturierte Stunde.</em>",
      'hero.sub':            "Der Einzelhandelsarm von Off Day Collective. Ein kuratiertes Inventar physischer Werkzeuge für den Raum zwischen Verpflichtungen.",
      'hero.cta':            "Warteliste beitreten",
      'marquee':             "Keramik &nbsp;·&nbsp; Gusseisen &nbsp;·&nbsp; Schweres Papier &nbsp;·&nbsp; Umgebungslicht &nbsp;·&nbsp; Gewebtes Textil &nbsp;·&nbsp; Natürliches Pigment &nbsp;·&nbsp; Gebranntes Holz &nbsp;·&nbsp; Kaltgepresstes Leinen &nbsp;·&nbsp; Gepresstes Glas &nbsp;·&nbsp; Botanischer Extrakt &nbsp;·&nbsp; Rohstein &nbsp;·&nbsp; Handgenähtes Leder &nbsp;·&nbsp; Bienenwachs &nbsp;·&nbsp; Geräuchertes Eichenholz &nbsp;·&nbsp; Mattes Messing &nbsp;·&nbsp; Wiedergewonnener Schiefer &nbsp;·&nbsp;",
      'manifesto.label':     "Das Briefing",
      'manifesto.h2':        "Wir tragen Dinge, die nichts von dir verlangen.",
      'manifesto.body':      "Die Woche ist strukturiert. Die Anforderungen sind laut. Solutions ist ein kuratiertes Inventar physischer Objekte, das rund um den freien Tag gesammelt wurde — die Stunden ohne Agenda. Nichts zu optimieren. Nichts zu verfolgen. Jedes Objekt wird für seine Fähigkeit ausgewählt, dich leise im gegenwärtigen Moment zu verankern.",
      'manifesto.footnote':  "— Eine Marke von Off Day Group",
      'preview.label':       "Demnächst",
      'preview.intro':       "Etwas nimmt Form an.",
      'preview.overlay':     "— Bald —",
      'waitlist.label':      "Der Liste beitreten",
      'waitlist.heading':    "Sei der Erste an der Tür.",
      'waitlist.sub':        "Kein Newsletter. Nur eine Nachricht, wenn es so weit ist.",
      'waitlist.placeholder':"deine@email.com",
      'waitlist.btn':        "Benachrichtigen",
      'waitlist.success':    "Du bist auf der Liste. Wir melden uns, wenn die Türen öffnen.",
      'footer.tagline':      "Nützlichkeit für die unstrukturierte Stunde.",
    },

    /* ── PORTUGUESE ─────────────────────────────────────────────────────── */
    pt: {
      'hero.eyebrow':        "Em breve — Outono 2026",
      'hero.title':          "Objetos para a<br><em>hora não estruturada.</em>",
      'hero.sub':            "O braço de varejo do Off Day Collective. Um inventário selecionado de ferramentas físicas para o espaço entre obrigações.",
      'hero.cta':            "Entrar na lista de espera",
      'marquee':             "Cerâmica &nbsp;·&nbsp; Ferro Fundido &nbsp;·&nbsp; Papel Pesado &nbsp;·&nbsp; Luz Ambiente &nbsp;·&nbsp; Têxtil Tecido &nbsp;·&nbsp; Pigmento Natural &nbsp;·&nbsp; Madeira Brunida &nbsp;·&nbsp; Linho Prensado a Frio &nbsp;·&nbsp; Vidro Prensado &nbsp;·&nbsp; Extrato Botânico &nbsp;·&nbsp; Pedra Bruta &nbsp;·&nbsp; Couro Costurado à Mão &nbsp;·&nbsp; Cera de Abelha &nbsp;·&nbsp; Carvalho Defumado &nbsp;·&nbsp; Latão Fosco &nbsp;·&nbsp; Ardósia Recuperada &nbsp;·&nbsp;",
      'manifesto.label':     "O Resumo",
      'manifesto.h2':        "Carregamos coisas que não pedem nada de você.",
      'manifesto.body':      "A semana é estruturada. As demandas são barulhentas. Solutions é um inventário selecionado de objetos físicos reunidos em torno do dia livre — as horas sem agenda. Nada para otimizar. Nada para rastrear. Cada objeto é escolhido pela sua capacidade de ancorá-lo, silenciosamente, no tempo presente.",
      'manifesto.footnote':  "— Uma marca do Off Day Group",
      'preview.label':       "Em breve",
      'preview.intro':       "Algo está se formando.",
      'preview.overlay':     "— Em breve —",
      'waitlist.label':      "Entrar na Lista",
      'waitlist.heading':    "Seja o primeiro a entrar.",
      'waitlist.sub':        "Sem newsletters. Apenas uma mensagem, quando chegar o momento.",
      'waitlist.placeholder':"seu@email.com",
      'waitlist.btn':        "Notificar-me",
      'waitlist.success':    "Você está na lista. Entraremos em contato quando as portas abrirem.",
      'footer.tagline':      "Utilidade para a hora não estruturada.",
    },

    /* ── JAPANESE ───────────────────────────────────────────────────────── */
    ja: {
      'hero.eyebrow':        "近日公開 — 2026年秋",
      'hero.title':          "構造のない時間のための<br><em>オブジェクト。</em>",
      'hero.sub':            "Off Day Collectiveの小売部門。義務と義務の間のための、厳選されたフィジカルツールのインベントリ。",
      'hero.cta':            "ウェイトリストに参加",
      'marquee':             "陶芸 &nbsp;·&nbsp; 鋳鉄 &nbsp;·&nbsp; 厚紙 &nbsp;·&nbsp; 環境光 &nbsp;·&nbsp; 織物 &nbsp;·&nbsp; 天然顔料 &nbsp;·&nbsp; 磨かれた木材 &nbsp;·&nbsp; コールドプレスリネン &nbsp;·&nbsp; プレスガラス &nbsp;·&nbsp; 植物エキス &nbsp;·&nbsp; 原石 &nbsp;·&nbsp; 手縫いレザー &nbsp;·&nbsp; 蜜蝋 &nbsp;·&nbsp; スモークオーク &nbsp;·&nbsp; マットブラス &nbsp;·&nbsp; 再生スレート &nbsp;·&nbsp;",
      'manifesto.label':     "概要",
      'manifesto.h2':        "私たちは、何も求めないものを運びます。",
      'manifesto.body':      "週は構造化されています。要求は大きい。Solutionsは、オフデー — アジェンダのない時間 — を中心に集めた物理的なオブジェクトの厳選されたインベントリです。最適化するものも、追跡するものもありません。各オブジェクトは、現在という時間の中に静かにあなたを錨で留める能力のために選ばれています。",
      'manifesto.footnote':  "— Off Day Groupのブランド",
      'preview.label':       "近日公開",
      'preview.intro':       "何かが形成されています。",
      'preview.overlay':     "— 近日公開 —",
      'waitlist.label':      "リストに参加",
      'waitlist.heading':    "最初のドアを通り抜ける。",
      'waitlist.sub':        "ニュースレターはありません。その時が来たら、メッセージが一つ届くだけです。",
      'waitlist.placeholder':"メール@例.com",
      'waitlist.btn':        "通知する",
      'waitlist.success':    "リストに登録されました。扉が開いたら連絡します。",
      'footer.tagline':      "構造のない時間のためのユーティリティ。",
    },

    /* ── MANDARIN ───────────────────────────────────────────────────────── */
    zh: {
      'hero.eyebrow':        "即将到来 — 2026年秋",
      'hero.title':          "为<em>无结构时光</em>而生的物件。",
      'hero.sub':            "Off Day Collective的零售部门。为义务之间的空间精心策划的实物工具清单。",
      'hero.cta':            "加入候补名单",
      'marquee':             "陶瓷 &nbsp;·&nbsp; 铸铁 &nbsp;·&nbsp; 厚纸 &nbsp;·&nbsp; 环境光 &nbsp;·&nbsp; 编织纺织品 &nbsp;·&nbsp; 天然颜料 &nbsp;·&nbsp; 抛光木材 &nbsp;·&nbsp; 冷压亚麻 &nbsp;·&nbsp; 压制玻璃 &nbsp;·&nbsp; 植物提取物 &nbsp;·&nbsp; 原石 &nbsp;·&nbsp; 手工缝制皮革 &nbsp;·&nbsp; 蜂蜡 &nbsp;·&nbsp; 烟熏橡木 &nbsp;·&nbsp; 哑光黄铜 &nbsp;·&nbsp; 再生石板 &nbsp;·&nbsp;",
      'manifesto.label':     "简介",
      'manifesto.h2':        "我们携带不向你索取任何东西的物品。",
      'manifesto.body':      "一周是有结构的。需求是嘈杂的。Solutions是一个精心策划的实物清单，围绕着休息日——没有议程的时光——而聚集。没有什么需要优化的，没有什么需要追踪的。每件物品的选择都是因为它能够悄悄地将你锚定在当下。",
      'manifesto.footnote':  "— Off Day Group旗下品牌",
      'preview.label':       "即将到来",
      'preview.intro':       "某些东西正在形成。",
      'preview.overlay':     "— 即将到来 —",
      'waitlist.label':      "加入名单",
      'waitlist.heading':    "成为第一个进入的人。",
      'waitlist.sub':        "没有新闻通讯。只有一条消息，当时机来临时。",
      'waitlist.placeholder':"您的邮箱@示例.com",
      'waitlist.btn':        "通知我",
      'waitlist.success':    "您已在名单上。当大门开启时，我们会与您联系。",
      'footer.tagline':      "为无结构时光而生的实用工具。",
    }

  };

  /* ─────────────────────────────────────────────────────────────────────────
     APPLY LANGUAGE
  ───────────────────────────────────────────────────────────────────────── */

  function applyLang(lang) {
    var t    = T[lang] || T.en;
    var isEn = (lang === 'en');

    /* 1. Split-reveal elements — restore to plain text, translate, re-split */
    var splitEls = document.querySelectorAll('.split-reveal[data-i18n]');
    splitEls.forEach(function (el) {
      el._wasVisible = el.classList.contains('is-visible');
      /* Store the English original once (aria-label is set by initSplitText) */
      if (!el.dataset.splitOrig) {
        el.dataset.splitOrig = el.getAttribute('aria-label') || el.textContent.trim();
      }
      var key     = el.getAttribute('data-i18n');
      var newText = (isEn || !t[key]) ? el.dataset.splitOrig : t[key];
      el.textContent = newText; /* Blow away char spans → plain text */
    });
    if (splitEls.length && window._initSplitText) {
      window._initSplitText('.split-reveal');
      splitEls.forEach(function (el) {
        if (el._wasVisible) el.classList.add('is-visible');
        delete el._wasVisible;
      });
    }

    /* 2. Plain-text elements */
    document.querySelectorAll('[data-i18n]:not(.split-reveal)').forEach(function (el) {
      var key = el.getAttribute('data-i18n');
      if (!el.dataset.i18nOrig) el.dataset.i18nOrig = el.textContent.trim();
      el.textContent = (isEn || !t[key]) ? el.dataset.i18nOrig : t[key];
    });

    /* 3. HTML elements (hero title, hero sub, marquee, manifesto body) */
    document.querySelectorAll('[data-i18n-html]').forEach(function (el) {
      var key = el.getAttribute('data-i18n-html');
      if (!el.dataset.i18nOrig) el.dataset.i18nOrig = el.innerHTML;
      el.innerHTML = (isEn || !t[key]) ? el.dataset.i18nOrig : t[key];
    });

    /* 4. Input placeholders */
    document.querySelectorAll('[data-i18n-placeholder]').forEach(function (el) {
      var key = el.getAttribute('data-i18n-placeholder');
      if (!el.dataset.i18nOrig) el.dataset.i18nOrig = el.placeholder;
      el.placeholder = (isEn || !t[key]) ? el.dataset.i18nOrig : t[key];
    });

    /* 5. Update picker UI */
    var codeEl = document.getElementById('lang-code');
    if (codeEl) codeEl.textContent = lang.toUpperCase();
    document.querySelectorAll('.lang-option').forEach(function (li) {
      li.classList.toggle('active', li.dataset.lang === lang);
    });
    document.documentElement.lang = lang;
    try { localStorage.setItem(LANG_KEY, lang); } catch (e) {}
  }

  /* ─────────────────────────────────────────────────────────────────────────
     INIT
  ───────────────────────────────────────────────────────────────────────── */

  document.addEventListener('DOMContentLoaded', function () {

    /* Determine initial language */
    var saved, browserLang;
    try { saved = localStorage.getItem(LANG_KEY); } catch (e) {}
    try {
      browserLang = (navigator.language || navigator.userLanguage || 'en')
                    .split('-')[0].toLowerCase();
    } catch (e) { browserLang = 'en'; }
    var initialLang = saved || (T[browserLang] ? browserLang : 'en');

    /* Apply before app.js's initSplitText runs (both are in DOMContentLoaded
       but i18n.js is loaded first, so its listener fires first) */
    if (initialLang !== 'en') applyLang(initialLang);

    /* Lang picker interaction */
    var btn      = document.getElementById('lang-btn');
    var dropdown = document.getElementById('lang-dropdown');
    if (!btn || !dropdown) return;

    btn.addEventListener('click', function () {
      var open = dropdown.classList.toggle('is-open');
      btn.setAttribute('aria-expanded', String(open));
      if (open) {
        var activeOption = dropdown.querySelector('.lang-option.active');
        if (activeOption) setTimeout(function () { activeOption.focus(); }, 10);
      }
    });

    dropdown.querySelectorAll('.lang-option').forEach(function (li) {
      li.addEventListener('click', function () {
        applyLang(li.dataset.lang);
        dropdown.classList.remove('is-open');
        btn.setAttribute('aria-expanded', 'false');
      });
    });

    /* Close on outside click */
    document.addEventListener('click', function (e) {
      if (!btn.contains(e.target) && !dropdown.contains(e.target)) {
        dropdown.classList.remove('is-open');
        btn.setAttribute('aria-expanded', 'false');
      }
    });

    /* Keyboard: full arrow key + Escape navigation */
    dropdown.addEventListener('keydown', function (e) {
      var options = Array.from(dropdown.querySelectorAll('.lang-option'));
      var focused = document.activeElement;
      var currentIdx = options.indexOf(focused);

      if (e.key === 'Escape') {
        dropdown.classList.remove('is-open');
        btn.setAttribute('aria-expanded', 'false');
        btn.focus();
        e.preventDefault();
        return;
      }

      if (!dropdown.classList.contains('is-open')) return;

      if (e.key === 'ArrowDown') {
        e.preventDefault();
        (options[currentIdx + 1] || options[0]).focus();
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        (options[currentIdx - 1] || options[options.length - 1]).focus();
      } else if (e.key === 'Home') {
        e.preventDefault();
        options[0].focus();
      } else if (e.key === 'End') {
        e.preventDefault();
        options[options.length - 1].focus();
      } else if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        if (focused && focused.dataset.lang) {
          applyLang(focused.dataset.lang);
          dropdown.classList.remove('is-open');
          btn.setAttribute('aria-expanded', 'false');
          btn.focus();
        }
      } else if (e.key === 'Tab') {
        dropdown.classList.remove('is-open');
        btn.setAttribute('aria-expanded', 'false');
      }
    });
  });

  /* Expose for external use (e.g. sub-pages) */
  window.applyLang = applyLang;

}());
