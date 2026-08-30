      let surahNames = [];
      let surahNamesReady = null;
      function getSurahNamesFallback() {
        return "الفاتحة,البقرة,آل عمران,النساء,المائدة,الأنعام,الأعراف,الأنفال,التوبة,يونس,هود,يوسف,الرعد,إبراهيم,الحجر,النحل,الإسراء,الكهف,مريم,طه,الأنبياء,الحج,المؤمنون,النور,الفرقان,الشعراء,النمل,القصص,العنكبوت,الروم,لقمان,السجدة,الأحزاب,سبأ,فاطر,يس,الصافات,ص,الزمر,غافر,فصلت,الشورى,الزخرف,الدخان,الجاثية,الأحقاف,محمد,الفتح,الحجرات,ق,الذاريات,الطور,النجم,القمر,الرحمن,الواقعة,الحديد,المجادلة,الحشر,الممتحنة,الصف,الجمعة,المنافقون,التغابن,الطلاق,التحريم,الملك,القلم,الحاقة,المعارج,نوح,الجن,المزمل,المدثر,القيامة,الإنسان,المرسلات,النبأ,النازعات,عبس,التكوير,الانفطار,المطففين,الانشقاق,البروج,الطارق,الأعلى,الغاشية,الفجر,البلد,الشمس,الليل,الضحى,الشرح,التين,العلق,القدر,البينة,الزلزلة,العاديات,القارعة,التكاثر,العصر,الهمزة,الفيل,قريش,الماعون,الكوثر,الكافرون,النصر,المسد,الإخلاص,الفلق,الناس".split(",");
      }
      // فوري: عرض الأسماء بدون انتظار الشبكة (وفّر 114 سطر ظاهر → سطر واحد)
      surahNames = getSurahNamesFallback();
      async function loadSurahNames() {
        try {
          const cached = localStorage.getItem("surahNamesCache");
          if (cached) {
            const arr = JSON.parse(cached);
            if (Array.isArray(arr) && arr.length === 114) {
              surahNames = arr;
              return surahNames;
            }
          }
        } catch (_) {}
        try {
          const res = await fetch("https://api.alquran.cloud/v1/surah");
          if (!res.ok) throw new Error("bad status");
          const json = await res.json();
          const arr = json.data.map((s) => s.name.replace(/^سُورَةُ\s*/u, "").replace(/^سورة\s*/u, "").trim());
          if (arr.length === 114) {
            surahNames = arr;
            try { localStorage.setItem("surahNamesCache", JSON.stringify(arr)); } catch (_) {}
            return surahNames;
          }
          throw new Error("invalid length");
        } catch (_) {
          surahNames = getSurahNamesFallback();
          return surahNames;
        }
      }
      surahNamesReady = loadSurahNames();
      var surahPages = [
        1, 2, 50, 77, 106, 128, 151, 177, 187, 208, 221, 235, 249, 255, 262,
        267, 282, 293, 305, 312, 322, 332, 342, 350, 359, 367, 377, 385, 396, 404,
        411, 415, 418, 428, 434, 440, 446, 453, 458, 467, 477, 483, 489, 496, 499,
        502, 507, 511, 515, 518, 520, 523, 526, 528, 531, 534, 537, 542, 545, 549,
        551, 553, 554, 556, 558, 560, 562, 564, 566, 568, 570, 572, 574, 575, 577,
        578, 580, 582, 583, 585, 586, 587, 587, 589, 590, 591, 591, 592, 593, 594,
        595, 595, 596, 596, 597, 597, 598, 598, 599, 599, 600, 600, 601, 601, 601,
        602, 602, 602, 603, 603, 603, 604, 604, 604,
      ];
      var surahAyahs = [
        7,286,200,176,120,165,206,75,129,109,
        123,111,43,52,99,128,111,110,98,135,
        112,78,118,64,77,227,93,88,69,60,
        34,30,73,54,45,83,182,88,75,85,
        54,53,89,59,37,35,38,29,18,45,
        60,49,62,55,78,96,29,22,24,13,
        14,11,11,18,12,12,30,52,52,44,
        28,28,20,56,40,31,50,40,46,42,
        29,19,36,25,22,17,19,26,30,20,
        15,21,11,8,8,19,5,8,11,11,
        11,8,3,9,5,4,7,3,6,3,
        5,4,5,6
      ];
      var surahRevelation = [
        "M","N","N","N","N","M","M","N","N","M",
        "M","M","M","M","M","M","M","M","M","M",
        "M","N","M","N","M","M","M","M","M","M",
        "M","M","N","M","M","M","M","M","M","M",
        "M","M","M","M","M","M","N","N","N","M",
        "M","M","M","M","N","M","N","N","N","N",
        "N","N","N","N","N","N","M","M","M","M",
        "M","M","M","M","N","M","M","M","M","M",
        "M","M","M","M","M","M","M","M","M","M",
        "M","M","M","M","M","M","N","N","M","M",
        "M","M","M","M","M","M","N","M","M","M",
        "M","M","M","M"
      ];
      function getSurahName(n) {
        return surahNames[n - 1] || "";
      }
      let isQuranOnlyMode = false,
        isPageMode = false,
        currentPageIndex = 0;
      const TOTAL_PAGES = 604,
        MARKERS_STORAGE_KEY = "quran-markers-data",
        PAGE_MODE_KEY = "quran-page-mode",
        ALFURQAN_API = "https://alfurqan.online/api/v1",
        JUZ_START = [1,23,43,63,83,107,129,151,177,201,225,247,269,289,309,329,349,369,389,409,429,449,469,491,513,535,557,579,601,605];
      const MUSHAF_IMG_BASE = "https://raw.githubusercontent.com/tarekeldeeb/madina_images/w1024/w1024_page";
      const MUSHAF_IMG_FALLBACK = "https://api.islamic.app/v1/mushaf/page/";
      const QCF_DATA_BASE = "https://raw.githubusercontent.com/zonetecde/mushaf-layout/refs/heads/main/mushaf/page-";
      const QRANK_API_BASE = "https://api.quran.com/api/v4/verses/by_page/";
      const MUSHAF_ASPECT = 1024 / 1656;
      var qcfDataCache = {};
      var ayahTextCache = {};
      function loadPageModePreference() {
        try {
          return localStorage.getItem(PAGE_MODE_KEY) === "single";
        } catch (e) {
          return false;
        }
      }
      function savePageModePreference(single) {
        try {
          localStorage.setItem(PAGE_MODE_KEY, single ? "single" : "scroll");
        } catch (e) {}
      }
      function getStoredMarkers() {
        try {
          var d = localStorage.getItem(MARKERS_STORAGE_KEY);
          if (d) return JSON.parse(d);
        } catch (e) {}
        return { red: [], green: [] };
      }
      function saveMarkers(m) {
        try {
          localStorage.setItem(MARKERS_STORAGE_KEY, JSON.stringify(m));
        } catch (e) {}
      }
      function addMarker(type, surah, ayah) {
        var m = getStoredMarkers(),
          key = surah + ":" + ayah;
        m.red = m.red.filter(function (k) {
          return k !== key;
        });
        m.green = m.green.filter(function (k) {
          return k !== key;
        });
        m[type] = [key];
        saveMarkers(m);
      }
      function removeMarker(surah, ayah) {
        var m = getStoredMarkers(),
          key = surah + ":" + ayah;
        m.red = m.red.filter(function (k) {
          return k !== key;
        });
        m.green = m.green.filter(function (k) {
          return k !== key;
        });
        saveMarkers(m);
      }
      function getMarkerType(surah, ayah, m) {
        if (!m) m = getStoredMarkers();
        var key = surah + ":" + ayah;
        if (m.red.includes(key)) return "red";
        if (m.green.includes(key)) return "green";
        return null;
      }
      function applyStoredMarkersToElement(el, m) {
        var s = parseInt(el.dataset.surah),
          a = parseInt(el.dataset.ayah);
        if (!s || !a) return;
        var t = getMarkerType(s, a, m);
        el.classList.remove("red-marker", "green-marker");
        if (t === "red") el.classList.add("red-marker");
        else if (t === "green") el.classList.add("green-marker");
      }
      function applyAllStoredMarkers() {
        var m = getStoredMarkers();
        document.querySelectorAll(".ayah, .word").forEach(function (el) {
          applyStoredMarkersToElement(el, m);
        });
      }
      function markAyahElements(s, a, color) {
        document
          .querySelectorAll('.ayah[data-surah="' + s + '"][data-ayah="' + a + '"]')
          .forEach(function (el) {
            el.classList.remove("red-marker", "green-marker");
            if (color) el.classList.add(color + "-marker");
          });
      }
      function toggleQuranOnlyMode() {
        isQuranOnlyMode = !isQuranOnlyMode;
        document.body.classList.toggle("quran-only", isQuranOnlyMode);
        if (isQuranOnlyMode) closeAll();
      }
      function isSmallScreen() {
        return window.matchMedia("(max-width: 400px)").matches;
      }
      function uiOverlaysOpen() {
        var sm = document.getElementById("side-menu"),
          lm = document.getElementById("links-menu"),
          ov = document.getElementById("overlay"),
          rw = document.querySelector(".custom-reciter-wrapper.active"),
          cm = document.getElementById("contextMenu");
        return (
          (sm && sm.style.right === "0px") ||
          (lm && lm.style.left === "0px") ||
          (ov && ov.style.display === "block") ||
          rw ||
          (cm && cm.style.display === "block")
        );
      }
      var uiIdleTimer = null;
      var sliderDragging = false;
      function hideUIChrome() {
        if (sliderDragging) {
          uiIdleTimer = setTimeout(hideUIChrome, 1000);
          return;
        }
        if (uiOverlaysOpen() || isQuranOnlyMode) return;
        isQuranOnlyMode = true;
        document.body.classList.add("quran-only");
      }
      function showUIChrome() {
        clearTimeout(uiIdleTimer);
        isQuranOnlyMode = false;
        document.body.classList.remove("quran-only");
        uiIdleTimer = setTimeout(hideUIChrome, 4000);
      }
      var CONTROLS =
        ".main-header, #reciterBar, #quranPageNav, #navModeToggle, #navModeTooltip, #loadMore, #offlineNotice, #links-menu, #overlay, #contextMenu, .custom-reciter-wrapper, .page-slider-tooltip, .page-nav-side, #pageRangeSlider, .page-slider-track";
      document.addEventListener(
        "pointerdown",
        function (e) {
          if (e.target.closest(CONTROLS)) showUIChrome();
        },
        true,
      );
      document.addEventListener(
        "pointerup",
        function () {
          sliderDragging = false;
        },
        true,
      );
      document.addEventListener(
        "click",
        function (e) {
          if (e.target.closest(CONTROLS)) return;
          if (isQuranOnlyMode) showUIChrome();
          else hideUIChrome();
        },
        true,
      );
      showUIChrome();
      function findMostVisiblePage() {
        var pages = document.querySelectorAll(".page");
        var bestIndex = 0;
        var bestScore = -1;
        var vh = window.innerHeight;
        pages.forEach(function (page, idx) {
          var rect = page.getBoundingClientRect();
          var visibleHeight = Math.min(rect.bottom, vh) - Math.max(rect.top, 0);
          if (visibleHeight > 0) {
            var score = visibleHeight / rect.height;
            if (score > bestScore) {
              bestScore = score;
              bestIndex = idx;
            }
          }
        });
        return bestIndex;
      }

      function trackWidth() {
        if (versesEl) {
          if (versesEl.clientWidth) return versesEl.clientWidth;
        }
        return window.innerWidth;
      }
      /* Native horizontal scroll-snap: scroll the track to the current page.
         This is far more reliable than a JS transform and gives the
         finger-following gallery feel for free on every browser/device. */
      function positionTrack(animate) {
        if (!versesEl) return;
        var w = trackWidth();
        versesEl.scrollTo({
          left: currentPageIndex * w,
          behavior: animate ? "smooth" : "auto",
        });
      }

      /* === WINDOWED PAGE PAGER (ALL SIZES) ===
         In page mode we keep only a 3-page window (prev / current / next) in the
         track. This means only the page before and after the current one are
         ever loaded, and because the adjacent pages are the only ones present,
         a swipe can never reveal an empty strip or scroll past the neighbouring
         page (requirement: dragging is limited to the edge of the side page),
         and old pages are removed so the DOM never grows. Pages are placed in
         DOM order [prev, current, next]; since the track is RTL, the PREVIOUS
         page sits on the RIGHT and the NEXT page on the LEFT, so reading flows
         from right to left (page 1 on the right, page 2 to its left). */
      var smallPage = { num: 1, active: false, center: 0 };
      var smallNavigating = false;
      try {
        var _lp = parseInt(localStorage.getItem("quranLastPage"));
        if (_lp >= 1 && _lp <= TOTAL_PAGES) smallPage.num = _lp;
      } catch (e) {}

      function smallWindowPages(n) {
        // DOM order [prev, current, next] so that, in the RTL track, the
        // PREVIOUS page sits on the RIGHT and the NEXT page on the LEFT. The
        // current page is therefore on the RIGHT of the next one — i.e. reading
        // flows from right to left (page 1 on the right, page 2 to its left).
        var a = [];
        if (n > 1) a.push(n - 1);
        a.push(n);
        if (n < TOTAL_PAGES) a.push(n + 1);
        return a;
      }
      function setSmallIndicator(n) {
        var ind = document.getElementById("quranPageIndicator");
        if (ind) ind.textContent = "صفحة " + n;
        var spb = document.getElementById("prevPageSideBtn");
        var snb = document.getElementById("nextPageSideBtn");
        if (spb) spb.disabled = n <= 1;
        if (snb) snb.disabled = n >= TOTAL_PAGES;
      }
      function loadOnePage(n) {
        if (window.loadQuranPage) return window.loadQuranPage(n);
        return Promise.resolve();
      }
      function centerSmallPage() {
        var node = versesEl.children[smallPage.center];
        if (node) node.scrollIntoView({ inline: "center", block: "nearest" });
      }
      function smallCurrentIndex() {
        var best = 0,
          bestDist = Infinity,
          cx = window.innerWidth / 2;
        Array.prototype.slice.call(versesEl.children).forEach(function (c, i) {
          var r = c.getBoundingClientRect();
          var d = Math.abs((r.left + r.right) / 2 - cx);
          if (d < bestDist) {
            bestDist = d;
            best = i;
          }
        });
        return best;
      }
      async function buildSmallWindow(n) {
        var pages = smallWindowPages(n);
        smallPage.num = n;
        smallPage.center = pages.indexOf(n);
        versesEl.innerHTML = "";
        for (var i = 0; i < pages.length; i++) await loadOnePage(pages[i]);
        // drop any stragglers appended by an aborted previous build
        var wanted = {};
        pages.forEach(function (p) {
          wanted[p] = true;
        });
        Array.prototype.slice.call(versesEl.children).forEach(function (c) {
          if (c.classList.contains("page") && !wanted[c.dataset.page]) c.remove();
        });
        centerSmallPage();
        setSmallIndicator(n);
      }
      window.buildSmallWindow = buildSmallWindow;
      async function updateSmallWindow(n) {
        if (n === smallPage.num) return;
        smallNavigating = true;
        var pages = smallWindowPages(n);
        var step = n - smallPage.num;
        if (step === 1 || step === -1) {
          // incremental: keep already-loaded neighbours, swap only one edge
          smallPage.num = n;
          smallPage.center = pages.indexOf(n);
          var keep = {};
          pages.forEach(function (p) {
            keep[p] = true;
          });
          Array.prototype.slice.call(versesEl.children).forEach(function (c) {
            if (c.classList.contains("page") && !keep[c.dataset.page]) c.remove();
          });
          for (var i = 0; i < pages.length; i++) {
            if (!versesEl.querySelector('.page[data-page="' + pages[i] + '"]'))
              await loadOnePage(pages[i]);
          }
          pages.forEach(function (p) {
            var node = versesEl.querySelector('.page[data-page="' + p + '"]');
            if (node) versesEl.appendChild(node);
          });
          centerSmallPage();
          setSmallIndicator(n);
          requestAnimationFrame(function () {
            smallNavigating = false;
          });
        } else {
          await buildSmallWindow(n);
          requestAnimationFrame(function () {
            smallNavigating = false;
          });
        }
      }
      function setupSmallPageMode() {
        smallPage.active = true;
        document.body.classList.add("page-mode");
        buildSmallWindow(smallPage.num);
      }
      function teardownSmallPageMode() {
        smallPage.active = false;
        versesEl.innerHTML = "";
        if (window.loadInitial) window.loadInitial();
      }
      var smallScrollTimer = null;
      function onSmallScroll() {
        if (smallNavigating || !smallPage.active) return;
        if (smallScrollTimer) clearTimeout(smallScrollTimer);
        smallScrollTimer = setTimeout(function () {
          if (!smallPage.active) return;
          var idx = smallCurrentIndex();
          if (idx === smallPage.center) return;
          var pages = smallWindowPages(smallPage.num);
          var landed = pages[idx];
          if (landed) updateSmallWindow(landed);
        }, 90);
      }

      function applyPageMode() {
        if (isPageMode) {
          setupSmallPageMode();
          return;
        }
        if (smallPage.active) {
          teardownSmallPageMode();
        }
        var prevSideBtn = document.getElementById("prevPageSideBtn");
        var nextSideBtn = document.getElementById("nextPageSideBtn");

        var nav = document.getElementById("quranPageNav");
        if (nav) nav.style.display = isPageMode ? "flex" : "none";

        // Detect the page that filled the screen BEFORE switching layout
        if (isPageMode) {
          var pages = document.querySelectorAll(".page");
          if (pages.length) {
            currentPageIndex = Math.min(findMostVisiblePage(), pages.length - 1);
          }
        }

        document.body.classList.toggle("page-mode", isPageMode);

        if (versesEl) {
          versesEl.style.transform = "";
          versesEl.style.transition = "";
        }

        if (isPageMode) {
          // Make every page render and load its image so swiping never shows
          // a blank/deferred page (the virtual-scroll ".far" class skips them).
          document.querySelectorAll(".page").forEach(function (p) {
            p.classList.remove("far");
            var im = p.querySelector(".mushaf-page-img");
            if (im) {
              im.removeAttribute("loading");
              im.loading = "eager";
            }
          });
          positionTrack(false);
          updatePageIndicator();
          ensurePagesAhead();
          if (prevSideBtn) prevSideBtn.style.display = "flex";
          if (nextSideBtn) nextSideBtn.style.display = "flex";
          document.body.classList.add("touch-device");
        } else {
          document.querySelectorAll(".page").forEach(function (p) {
            p.classList.remove("active-page");
          });
          if (prevSideBtn) prevSideBtn.style.display = "none";
          if (nextSideBtn) nextSideBtn.style.display = "none";
          document.body.classList.remove("touch-device");
        }
      }
      function togglePageMode() {
        isPageMode = !isPageMode;
        savePageModePreference(isPageMode);
        applyPageMode();
        updateToggleButtonUI();
      }
      function updateToggleButtonUI() {
        var btn = document.getElementById("navModeToggle"),
          tl = document.getElementById("navModeTooltip");
        if (!btn) return;
        if (isPageMode) {
          btn.innerHTML = '<i class="fa-solid fa-book-open"></i>';
          btn.title = "التبديل إلى وضع التمرير";
          btn.setAttribute("aria-label", "التبديل إلى وضع التمرير");
          if (tl) tl.textContent = "وضع الصفحة الواحدة";
        } else {
          btn.innerHTML = '<i class="fa-solid fa-arrows-up-down"></i>';
          btn.title = "التبديل إلى وضع الصفحة الواحدة";
          btn.setAttribute("aria-label", "التبديل إلى وضع الصفحة الواحدة");
          if (tl) tl.textContent = "وضع التمرير";
        }
        if (tl) {
          tl.classList.add("show");
          clearTimeout(tl._timeout);
          tl._timeout = setTimeout(function () {
            tl.classList.remove("show");
          }, 1800);
        }
      }
      window.changeQuranPage = function (delta) {
        if (smallPage.active) {
          var target = smallPage.num + delta;
          if (target < 1 || target > TOTAL_PAGES) return;
          updateSmallWindow(target);
          return;
        }
        if (!isPageMode) return;
        var pages = document.querySelectorAll(".page");
        if (!pages.length) return;
        var ni = currentPageIndex + delta;
        if (ni < 0) return;
        if (ni >= pages.length) {
          var lp = parseInt(pages[pages.length - 1].dataset.page) || 0;
          if (lp < TOTAL_PAGES) {
            loadMorePages().then(function () {
              var up = document.querySelectorAll(".page");
              if (up.length > pages.length) {
                currentPageIndex = pages.length;
                positionTrack(true);
                updatePageIndicator();
              }
            });
            return;
          }
          return;
        }
        currentPageIndex = ni;
        positionTrack(true);
        updatePageIndicator();
        ensurePagesAhead();
      };

      /* Touch / mouse drag with finger-following gallery effect */
      var versesEl = document.getElementById("verses");
      if (versesEl) versesEl.addEventListener("scroll", onSmallScroll, { passive: true });
      var drag = {
        active: false,
        startX: 0,
        startY: 0,
        delta: 0,
        horizontal: null,
      };

      function pageWidth() {
        return trackWidth();
      }
      function applyFollow(d) {
        if (!versesEl) return;
        var w = pageWidth();
        var pages = document.querySelectorAll(".page");
        var minOffset = -(pages.length - 1) * w;
        var maxOffset = 0;
        var desired = -currentPageIndex * w + d;
        // rubber-band when dragging past the first/last loaded page
        if (desired > maxOffset)
          desired = maxOffset + (desired - maxOffset) * 0.35;
        if (desired < minOffset)
          desired = minOffset + (desired - minOffset) * 0.35;
        versesEl.style.transition = "none";
        versesEl.style.transform = "translateX(" + desired + "px)";
      }
      function dragStart(x, y) {
        /* Swipe/drag navigation is handled natively by the scroll-snap track
           (page mode) and by native scrolling (scroll mode), so the custom JS
           drag is fully disabled to avoid fighting the browser. */
        return;
        var t = document.elementFromPoint(x, y);
        if (
          t &&
          t.closest(
            ".page-nav-side, #navModeToggle, .reciter-bar, .context-menu, .page-slider-wrap, .custom-reciter-wrapper",
          )
        )
          return;
        drag.active = true;
        drag.startX = x;
        drag.startY = y;
        drag.delta = 0;
        drag.horizontal = null;
      }
      function dragMove(x, y, ev) {
        if (!drag.active) return;
        var dx = x - drag.startX;
        var dy = y - drag.startY;
        if (drag.horizontal === null) {
          if (Math.abs(dx) < 10 && Math.abs(dy) < 10) return;
          if (Math.abs(dx) > Math.abs(dy)) {
            drag.horizontal = true;
            if (ev && ev.cancelable) ev.preventDefault();
          } else {
            drag.active = false;
            return;
          }
        }
        if (drag.horizontal) {
          if (ev && ev.cancelable) ev.preventDefault();
          drag.delta = dx;
          applyFollow(drag.delta);
        }
      }
      function dragEnd() {
        if (!drag.active) return;
        drag.active = false;
        var d = drag.delta;
        var w = pageWidth();
        var moved = Math.round(-d / w); // pages to move (negative = next)
        var pages = document.querySelectorAll(".page");
        var target = Math.max(
          0,
          Math.min(currentPageIndex + moved, pages.length - 1),
        );
        currentPageIndex = target;
        positionTrack(true);
        updatePageIndicator();
        ensurePagesAhead();
        drag.delta = 0;
        drag.horizontal = null;
      }

      /* TOUCH — touchmove is NON-passive so we can preventDefault the swipe */
      document.addEventListener(
        "touchstart",
        function (e) {
          if (!isPageMode) return;
          var t = e.touches[0];
          dragStart(t.clientX, t.clientY);
        },
        { passive: true },
      );
      document.addEventListener(
        "touchmove",
        function (e) {
          if (!isPageMode || !drag.active) return;
          var t = e.touches[0];
          dragMove(t.clientX, t.clientY, e);
        },
        { passive: false },
      );
      document.addEventListener("touchend", dragEnd, { passive: true });
      document.addEventListener("touchcancel", dragEnd, { passive: true });

      /* Track the current page from the native scroll position (swipe) and
         auto-load more pages as the user reaches the end of the loaded strip. */
      if (versesEl) {
        versesEl.addEventListener(
          "scroll",
          function () {
            if (!isPageMode || smallPage.active) return;
            var w = trackWidth();
            if (!w) return;
            var idx = Math.round(versesEl.scrollLeft / w);
            idx = Math.max(0, idx);
            if (idx !== currentPageIndex) {
              currentPageIndex = idx;
              updatePageIndicator();
              ensurePagesAhead();
            }
          },
          { passive: true },
        );
      }

      /* MOUSE (desktop drag) */
      document.addEventListener("mousedown", function (e) {
        if (!isPageMode || e.button !== 0) return;
        dragStart(e.clientX, e.clientY);
      });
      document.addEventListener("mousemove", function (e) {
        if (!drag.active) return;
        dragMove(e.clientX, e.clientY, e);
      });
      document.addEventListener("mouseup", dragEnd);

      var resizeRAF = null;
      window.addEventListener("resize", function () {
        if (!isPageMode || !versesEl) return;
        if (smallPage.active) {
          if (resizeRAF) cancelAnimationFrame(resizeRAF);
          resizeRAF = requestAnimationFrame(function () {
            buildSmallWindow(smallPage.num);
          });
          return;
        }
        if (resizeRAF) cancelAnimationFrame(resizeRAF);
        resizeRAF = requestAnimationFrame(function () {
          positionTrack(false);
        });
      });

      function activatePage(index, animate) {
        if (smallPage.active) return;
        currentPageIndex = index || 0;
        positionTrack(animate !== false);
        updatePageIndicator();
      }
      function updatePageIndicator() {
        var ind = document.getElementById("quranPageIndicator"),
          pb = document.getElementById("prevPageBtn"),
          nb = document.getElementById("nextPageBtn"),
          spb = document.getElementById("prevPageSideBtn"),
          snb = document.getElementById("nextPageSideBtn"),
          pages = document.querySelectorAll(".page");
        if (!pages.length) return;
        var cn = pages[currentPageIndex];
        var cp = cn ? cn.dataset.page : "?";
        if (ind) ind.textContent = "صفحة " + cp;
        var atStart = currentPageIndex <= 0;
        var lp = parseInt(pages[pages.length - 1]?.dataset.page) || 0;
        var atEnd = currentPageIndex >= pages.length - 1 && lp >= TOTAL_PAGES;
        if (pb) pb.disabled = atStart;
        if (nb) nb.disabled = atEnd;
        if (spb) spb.disabled = atStart;
        if (snb) snb.disabled = atEnd;
      }
      function afterPagesAdded() {
        if (smallPage.active) return;
        if (isPageMode) {
          var pages = document.querySelectorAll(".page");
          if (pages.length && currentPageIndex >= pages.length)
            currentPageIndex = pages.length - 1;
          updatePageIndicator();
          positionTrack(false);
          ensurePagesAhead();
        }
      }
      /* In page mode pages must exist beside the current one so swiping never
         reveals an empty (background) strip. Load more as we approach the end. */
      function ensurePagesAhead() {
        if (!isPageMode || smallPage.active) return;
        var pages = document.querySelectorAll(".page");
        if (!pages.length) return;
        if (currentPageIndex >= pages.length - 4) loadMorePages();
      }
        function toggleTheme() {
          var h = document.documentElement,
            b = document.getElementById("themeToggle");
          var d = h.getAttribute("data-theme") === "dark";
          if (d) {
            h.removeAttribute("data-theme");
            localStorage.setItem("istiqamah-theme", "light");
            if (b) b.innerHTML = '<i class="fa-solid fa-moon"></i>';
          } else {
            h.setAttribute("data-theme", "dark");
            localStorage.setItem("istiqamah-theme", "dark");
            if (b) b.innerHTML = '<i class="fa-solid fa-sun"></i>';
          }
        }
      (function () {
        var s = localStorage.getItem("istiqamah-theme");
        if (
          s === "dark" ||
          (!s && window.matchMedia("(prefers-color-scheme:dark)").matches)
        )
          document.documentElement.setAttribute("data-theme", "dark");
        var b = document.getElementById("themeToggle");
        if (b)
          b.innerHTML =
            document.documentElement.getAttribute("data-theme") === "dark"
              ? '<i class="fa-solid fa-sun"></i>'
              : '<i class="fa-solid fa-moon"></i>';
      })();
      function toggleMenu(id, prop, closeId, closeProp) {
        var m = document.getElementById(id),
          ov = document.getElementById("overlay");
        if (!m) return;
        if (m.style[prop] === "0px") {
          m.style[prop] = "-100%";
          ov.style.display = "none";
        } else {
          m.style[prop] = "0px";
          ov.style.display = "block";
          var c = document.getElementById(closeId);
          if (c) c.style[closeProp] = "-100%";
        }
      }
      function toggleLinks() {
        toggleMenu("links-menu", "left", "side-menu", "right");
      }
      function closeAll() {
        var sm = document.getElementById("side-menu");
        if (sm) sm.style.right = "-100%";
        document.getElementById("links-menu").style.left = "-100%";
        document.getElementById("overlay").style.display = "none";
        document.getElementById("contextMenu").style.display = "none";
      }
      var activeSurahIdx = -1;
      function highlightActiveSurah() {
        var host = document.getElementById("surah-index");
        if (!host) return;
        host.querySelectorAll(".surah-row.active").forEach(function (r) {
          r.classList.remove("active");
        });
        if (activeSurahIdx >= 0) {
          var row = host.querySelector('.surah-row[data-idx="' + activeSurahIdx + '"]');
          if (row) row.classList.add("active");
        }
      }
      function openSurahIndex() {
        var ov = document.getElementById("surah-index");
        var bd = document.getElementById("index-backdrop");
        if (ov) { ov.classList.add("open"); ov.setAttribute("aria-hidden", "false"); }
        if (bd) bd.classList.add("show");
        document.body.style.overflow = "hidden";
        highlightActiveSurah();
      }
      function closeSurahIndex() {
        var ov = document.getElementById("surah-index");
        var bd = document.getElementById("index-backdrop");
        if (ov) { ov.classList.remove("open"); ov.setAttribute("aria-hidden", "true"); }
        if (bd) bd.classList.remove("show");
        document.body.style.overflow = "";
      }
      document.addEventListener("keydown", function (e) {
        if (e.key === "Escape") {
          var ov = document.getElementById("surah-index");
          if (ov && ov.classList.contains("open")) closeSurahIndex();
        }
      });
      (function () {
        var disp = document.getElementById("verses"),
          btn = document.getElementById("loadMore"),
          ctx = document.getElementById("contextMenu"),
          ap = document.getElementById("audioPlayer"),
          ppb = document.getElementById("playPauseBtn"),
          rs = document.getElementById("reciterSelect"),
          asn = document.getElementById("audioSurahName"),
          aai = document.getElementById("audioAyahInfo");
        var cp = 1,
          loading = false,
          isPlaying = false,
          curSurah = null,
          curAyah = null,
          ayahInt = null,
          selEl = null,
          selSurah = null,
          selAyah = null,
          curTimings = [],
          curAudioUrl = "",
          lastSurah = null;
        var sn = surahNames,
          sp = surahPages;
        function stripBasmala(t) {
          var pats = [
            "بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ ",
            "بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ ",
            "بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ",
            "بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ",
          ];
          for (var p of pats) if (t.startsWith(p)) return t.substring(p.length);
          return t.trim();
        }
        async function loadRecitersFromQuranCom() {
          try {
            var r = await fetch(
              "https://api.quran.com/api/v4/resources/chapter_reciters?language=ar",
            );
            return (await r.json()).reciters.map(function (rr) {
              return { id: rr.id, name: rr.reciter_name, source: "quran" };
            });
          } catch (e) {
            return [
              { id: 7, name: "ماهر المعيقلي", source: "quran" },
              { id: 3, name: "مشاري العفاسي", source: "quran" },
            ];
          }
        }
        async function loadRecitersFromMp3Quran() {
          try {
            var r = await fetch(
              "https://www.mp3quran.net/api/v3/ayat_timing/reads",
            );
            return (await r.json()).map(function (rr) {
              return {
                id: rr.id,
                name: rr.name,
                source: "mp3quran",
                folder_url: rr.folder_url,
              };
            });
          } catch (e) {
            return [];
          }
        }
        var allReciters = [];
        function reciterHTML(rec) {
          var idx = allReciters.indexOf(rec);
          var badge =
            rec.source === "mp3quran"
              ? '<small style="color:#1B7A4B">MP3</small>'
              : rec.source === "quran"
                ? '<small style="color:#aaa">Q</small>'
                : rec.source === "custom"
                  ? '<small style="color:#c9a03d">مميز</small>'
                  : '<small style="color:var(--text-muted)">احتياطي</small>';
          return (
            '<div class="reciter-option" data-index="' +
            idx +
            '"><i class="fa-solid fa-microphone-alt"></i> <span>' +
            rec.name +
            "</span> " +
            badge +
            "</div>"
          );
        }
        function attachReciterClicks() {
          document.querySelectorAll(".reciter-option").forEach(function (o) {
            o.removeEventListener("click", handleReciterClick);
            o.addEventListener("click", handleReciterClick);
          });
        }
        function populateCustomReciterList(filter) {
          var ct = document.getElementById("reciterOptionsList");
          if (!ct) return;
          var matched = [],
            unmatched = [];
          for (var rec of allReciters) {
            if (!filter || rec.name.includes(filter)) matched.push(rec);
            else unmatched.push(rec);
          }
          if (!matched.length && filter) {
            ct.innerHTML =
              '<div class="reciter-option" style="justify-content:center;color:var(--text-muted)"><i class="fa-regular fa-face-frown"></i> لا توجد نتائج مطابقة لـ "' +
              filter +
              '"</div><div style="border-top:1px solid #eee;margin-top:8px;padding-top:8px;font-size:.8rem;color:#aaa;text-align:center"><i class="fa-solid fa-book"></i> جميع القراء:</div>';
            unmatched.forEach(function (r) {
              ct.innerHTML += reciterHTML(r);
            });
            attachReciterClicks();
            return;
          }
          var html = "";
          if (matched.length && filter)
            html +=
              '<div style="padding:8px 16px;font-size:.75rem;color:#aaa;border-bottom:1px solid #d0e0c5"><i class="fa-solid fa-magnifying-glass"></i> نتائج البحث (' +
              matched.length +
              ")</div>";
          matched.forEach(function (r) {
            html += reciterHTML(r);
          });
          if (unmatched.length && filter)
            html +=
              '<div style="padding:8px 16px;font-size:.75rem;color:#aaa;border-top:1px solid #e0e0d0;margin-top:4px"><i class="fa-solid fa-book"></i> جميع القراء (' +
              unmatched.length +
              ")</div>";
          unmatched.forEach(function (r) {
            html += reciterHTML(r);
          });
          ct.innerHTML = html;
          attachReciterClicks();
        }
        function handleReciterClick(e) {
          e.stopPropagation();
          var opt = e.currentTarget,
            idx = parseInt(opt.dataset.index),
            sr = allReciters[idx];
          if (!sr || !rs) return;
          rs.value = sr.value;
          rs.dispatchEvent(new Event("change"));
          var rbn = document.getElementById("reciterBarName");
          if (rbn) rbn.textContent = sr.name;
          var rw2 = document.querySelector(".custom-reciter-wrapper");
          if (rw2) rw2.classList.remove("active");
          var si = document.getElementById("reciterSearchInput");
          if (si) si.value = sr.name;
          document
            .getElementById("reciterOptionsList")
            .classList.remove("show");
          document.querySelectorAll(".reciter-option").forEach(function (el) {
            el.classList.remove("selected");
          });
          opt.classList.add("selected");
        }
        function setupReciterSearch() {
          var si = document.getElementById("reciterSearchInput"),
            ol = document.getElementById("reciterOptionsList");
          if (!si || !ol) return;
          si.addEventListener("input", function (e) {
            populateCustomReciterList(e.target.value);
            ol.classList.add("show");
          });
          si.addEventListener("click", function (e) {
            e.stopPropagation();
            populateCustomReciterList(si.value);
            ol.classList.add("show");
          });
          document.addEventListener("click", function (e) {
            if (!si.contains(e.target) && !ol.contains(e.target))
              ol.classList.remove("show");
          });
          ol.addEventListener("click", function (e) {
            e.stopPropagation();
          });
        }
        async function loadReciters() {
          if (!rs) return;
          rs.innerHTML = '<option value="">جار تحميل القراء...</option>';
          var si = document.getElementById("reciterSearchInput");
          if (si) si.placeholder = "⏳ جار التحميل...";
          try {
            var qr = await loadRecitersFromQuranCom(),
              mr = await loadRecitersFromMp3Quran();
            rs.innerHTML = '<option value="">اختر القارئ...</option>';
            allReciters = [];
            function addRec(name, val, src) {
              var o = document.createElement("option");
              o.value = val;
              o.textContent = name;
              rs.appendChild(o);
              allReciters.push({ name: name, value: val, source: src });
            }
            qr.forEach(function (r) {
              addRec(
                r.name,
                JSON.stringify({ id: r.id, source: "quran" }),
                "quran",
              );
            });
            mr.forEach(function (r) {
              addRec(
                r.name,
                JSON.stringify({
                  id: r.id,
                  source: "mp3quran",
                  folder_url: r.folder_url,
                }),
                "mp3quran",
              );
            });
            var lv = JSON.stringify({
              source: "custom",
              name: "محمد اللحيدان",
            });
            addRec("محمد اللحيدان", lv, "custom");
            var def = Array.from(rs.options).find(function (o) {
              return o.text.includes("ماهر");
            });
            if (def) rs.value = def.value;
            else rs.selectedIndex = 1;
            var rbn = document.getElementById("reciterBarName");
            if (rbn)
              rbn.textContent =
                rs.options[rs.selectedIndex]?.textContent || "ماهر المعيقلي";
            populateCustomReciterList("");
            setTimeout(function () {
              var cv = rs.value,
                si2 = allReciters.findIndex(function (r) {
                  return r.value === cv;
                });
              if (si2 >= 0) {
                var sd = document.querySelector(
                  '.reciter-option[data-index="' + si2 + '"]',
                );
                if (sd) {
                  document
                    .querySelectorAll(".reciter-option")
                    .forEach(function (el) {
                      el.classList.remove("selected");
                    });
                  sd.classList.add("selected");
                }
              }
              if (si && rs.selectedOptions[0])
                si.value = rs.selectedOptions[0].text;
            }, 50);
            if (si) si.placeholder = "ابحث عن قارئ...";
          } catch (e) {
            console.warn(e);
            if (si) si.placeholder = "❌ فشل التحميل، حاول تحديث الصفحة";
          }
        }
        function getSelectedReciterInfo() {
          if (!rs || !rs.value) return null;
          try {
            return JSON.parse(rs.value);
          } catch (e) {
            return null;
          }
        }
        function parsePbTimings(buf, surahNum) {
          var dv = new DataView(buf),
            off = 0;
          function varint() {
            var v = 0,
              s = 0,
              b;
            do {
              b = dv.getUint8(off++);
              v |= (b & 0x7f) << s;
              s += 7;
            } while (b & 0x80);
            return v;
          }
          var prefix = surahNum + ":",
            seen = new Map();
          while (off < buf.byteLength) {
            var tag = varint(),
              fn = tag >> 3,
              wt = tag & 7;
            if (wt !== 2) continue;
            var len = varint(),
              end = off + len;
            if (fn !== 1) {
              off = end;
              continue;
            }
            var key = "";
            while (off < end) {
              var iTag = varint(),
                iFn = iTag >> 3,
                iWt = iTag & 7;
              if (iWt !== 2) continue;
              var iLen = varint(),
                iEnd = off + iLen;
              if (iFn === 1) {
                key = new TextDecoder().decode(new Uint8Array(buf, off, iLen));
                off = iEnd;
              } else if (iFn === 2) {
                var firstFrom = -1,
                  lastTo = -1;
                while (off < iEnd) {
                  var sTag = varint(),
                    sFn = sTag >> 3,
                    sWt = sTag & 7;
                  if (sWt !== 2) continue;
                  var sLen = varint(),
                    sEnd = off + sLen;
                  while (off < sEnd) {
                    var wTag = varint(),
                      wFn = wTag >> 3,
                      wWt = wTag & 7,
                      wVal = wWt === 0 ? varint() : 0;
                    if (wFn === 3 && wWt === 0 && firstFrom < 0)
                      firstFrom = wVal;
                    if (wFn === 4 && wWt === 0) lastTo = wVal;
                  }
                }
                if (key.startsWith(prefix) && firstFrom >= 0 && lastTo >= 0) {
                  var st = firstFrom / 1000,
                    et = lastTo / 1000,
                    ex = seen.get(key);
                  if (!ex || st < ex.start)
                    seen.set(key, { verse_key: key, start: st, end: et });
                }
              } else off = iEnd;
            }
          }
          return Array.from(seen.values());
        }
        function validateAndFixTimings(t) {
          if (!t || !t.length) return t;
          var s = t.slice().sort(function (a, b) {
              return a.start - b.start || a.end - b.end;
            }),
            dd = [],
            sk = new Set();
          for (var i = 0; i < s.length; i++) {
            var n = parseInt(s[i].verse_key.split(":")[1]);
            if (isNaN(n) || sk.has(n)) continue;
            sk.add(n);
            dd.push({
              verse_key: s[i].verse_key,
              start: s[i].start,
              end: s[i].end,
            });
          }
          for (var j = 0; j < dd.length - 1; j++) {
            var c = dd[j],
              nx = dd[j + 1];
            if (c.end > nx.start) {
              c.end = (c.start + nx.start) / 2;
              nx.start = c.end;
            }
            if (nx.start - c.end > 0.5) c.end = nx.start;
          }
          if (dd.length)
            dd[dd.length - 1].end = Math.max(
              dd[dd.length - 1].end,
              dd[dd.length - 1].start + 0.5,
            );
          return dd;
        }
        async function loadSurahTimings(surahNum) {
          var info = getSelectedReciterInfo();
          if (!info) return false;
          try {
            if (info.source === "quran") {
              var r = await fetch(
                  "https://api.quran.com/api/v4/chapter_recitations/" +
                    info.id +
                    "/" +
                    surahNum +
                    "?segments=true",
                ),
                d = await r.json();
              if (d.audio_file && d.audio_file.audio_url) {
                curAudioUrl = d.audio_file.audio_url;
                if (d.audio_file.timestamps && d.audio_file.timestamps.length)
                  curTimings = validateAndFixTimings(
                    d.audio_file.timestamps.map(function (t) {
                      return {
                        verse_key: t.verse_key,
                        start: t.timestamp_from / 1000,
                        end: t.timestamp_to / 1000,
                      };
                    }),
                  );
                else curTimings = [];
                return true;
              }
            } else if (info.source === "mp3quran") {
              var r2 = await fetch(
                  "https://www.mp3quran.net/api/v3/ayat_timing?surah=" +
                    surahNum +
                    "&read=" +
                    info.id,
                ),
                d2 = await r2.json();
              if (d2 && d2.length) {
                curTimings = validateAndFixTimings(
                  d2.map(function (t) {
                    return {
                      verse_key: surahNum + ":" + t.ayah,
                      start: t.start_time / 1000,
                      end: t.end_time / 1000,
                    };
                  }),
                );
                curAudioUrl =
                  info.folder_url + String(surahNum).padStart(3, "0") + ".mp3";
                return true;
              }
            } else if (info.source === "custom") {
              var pad = String(surahNum).padStart(3, "0");
              curAudioUrl =
                "https://cdn.mualim.app/muhammad-al-luhaidan-murattal/" +
                pad +
                ".opus";
              var pbUrl =
                "https://cdn.mualim.app/muhammad-al-luhaidan-murattal/" +
                pad +
                ".pb",
                pbRes;
              try {
                pbRes = await fetch(pbUrl);
                if (!pbRes.ok) throw new Error();
              } catch (_) {
                var tc = await caches.open(SURAH_CACHE);
                pbRes = await tc.match(pbUrl);
                if (!pbRes || !pbRes.ok) throw new Error();
              }
              var buf = await pbRes.arrayBuffer(),
                timings = parsePbTimings(buf, surahNum);
              if (timings.length) {
                curTimings = validateAndFixTimings(timings);
                return true;
              }
            }
          } catch (e) {
            console.warn(e);
          }
          return false;
        }
        function highlightAyah(surah, ayah) {
          document.querySelectorAll(".ayah.playing").forEach(function (el) {
            el.classList.remove("playing");
          });
          var els = document.querySelectorAll('.ayah[data-surah="' + surah + '"][data-ayah="' + ayah + '"]');
          if (els.length) {
            els.forEach(function(el) { el.classList.add("playing"); });
            els[0].scrollIntoView({ behavior: "smooth", block: "center" });
            aai.textContent = "الآية " + ayah;
          }
        }
        function pauseTrackingOnly() {
          if (ayahInt) {
            clearInterval(ayahInt);
            ayahInt = null;
          }
          document.querySelectorAll(".ayah.playing").forEach(function (el) {
            el.classList.remove("playing");
          });
        }
        function stopTracking() {
          pauseTrackingOnly();
          curSurah = null;
          curAyah = null;
        }
        function startTracking(surah, ayah) {
          pauseTrackingOnly();
          curSurah = surah;
          curAyah = ayah;
          highlightAyah(surah, ayah);
          if (!curTimings.length) return;
          ayahInt = setInterval(function () {
            if (ap.paused) return;
            var t = ap.currentTime,
              lo = 0,
              hi = curTimings.length - 1,
              cur = null;
            while (lo <= hi) {
              var mid = (lo + hi) >> 1,
                tm = curTimings[mid];
              if (t < tm.start) hi = mid - 1;
              else if (t >= tm.end) lo = mid + 1;
              else {
                cur = tm;
                break;
              }
            }
            if (!cur && lo < curTimings.length && t >= curTimings[lo].start)
              cur = curTimings[lo];
            if (!cur) {
              for (var i = 0; i < curTimings.length; i++) {
                if (t >= curTimings[i].start) cur = curTimings[i];
              }
            }
            if (cur) {
              var a = parseInt(cur.verse_key.split(":")[1]);
              if (!isNaN(a) && a !== curAyah) {
                curAyah = a;
                highlightAyah(curSurah, a);
              }
            }
          }, 100);
        }
        const CACHE_NAME = "quran-audio-v1",
          SURAH_CACHE = "quran-text-v1";
        async function getCachedAudioWithProgress(url, onProgress, signal) {
          try {
            var cache = await caches.open(CACHE_NAME),
              cached = await cache.match(url);
            if (cached) {
              if (onProgress) onProgress(100);
              return URL.createObjectURL(await cached.blob());
            }
            var resp = await fetch(url, signal ? { signal: signal } : undefined);
            if (!resp.ok) throw new Error("HTTP " + resp.status);
            var cl = resp.headers.get("content-length"),
              total = cl ? parseInt(cl, 10) : 0,
              loaded = 0,
              reader = resp.body.getReader(),
              chunks = [];
            while (true) {
              var { done, value } = await reader.read();
              if (done) break;
              chunks.push(value);
              loaded += value.length;
              if (onProgress && total)
                onProgress(Math.round((loaded / total) * 100));
            }
            var blob = new Blob(chunks, { type: "audio/mpeg" }),
              blobUrl = URL.createObjectURL(blob);
            var blobResp = new Response(blob, {
              headers: { "Content-Type": "audio/mpeg" },
            });
            await cache.put(url, blobResp);
            return blobUrl;
          } catch (err) {
            console.error("Cache error:", err);
            throw err;
          }
        }
        function showLoading(show, pct) {
          var l = document.getElementById("loadingIndicator"),
            ps = document.getElementById("loadingPercent"),
            bar = document.getElementById("reciterBar");
          if (l) {
            if (show) {
              l.style.display = "flex";
              if (ps && typeof pct === "number") ps.innerText = pct + "%";
              if (bar) bar.classList.add("downloading");
            } else {
              l.style.display = "none";
              if (bar) bar.classList.remove("downloading");
            }
          }
        }
        function updateLoadingProgress(pct) {
          var ps = document.getElementById("loadingPercent");
          if (ps) ps.innerText = pct + "%";
        }
        async function playSurah(surah, ayah, isTest) {
          if (isTest && !rs.value) {
            alert("اختر قارئاً");
            return;
          }
          if (!isTest && (!selEl || !rs.value)) {
            alert("اختر قارئاً أولاً");
            closeAll();
            return;
          }
          showLoading(true, 0);
          loadAbort = new AbortController();
          try {
            var ok = await loadSurahTimings(surah);
            if (!ok || !curAudioUrl)
              throw new Error("التلاوة غير متوفرة لهذا القارئ");
            stopTracking();
            var blobUrl = await getCachedAudioWithProgress(
              curAudioUrl,
              updateLoadingProgress,
              loadAbort.signal,
            );
            loadAbort = null;
            ap.src = blobUrl;
            ap.load();
            await new Promise(function (resolve, reject) {
              var to = setTimeout(function () {
                reject(new Error("Timeout"));
              }, 20000);
              ap.addEventListener(
                "canplaythrough",
                function () {
                  clearTimeout(to);
                  resolve();
                },
                { once: true },
              );
              ap.addEventListener(
                "error",
                function () {
                  reject(new Error("Audio error"));
                },
                { once: true },
              );
            });
            if (!isTest) {
              var timing = curTimings.find(function (t) {
                return t.verse_key === surah + ":" + ayah;
              });
              ap.currentTime = timing ? timing.start : 0;
            } else ap.currentTime = 0;
            showLoading(false);
            await ap.play();
            isPlaying = true;
            updatePlayButton();
            asn.textContent = isTest
              ? "سورة الإخلاص (اختبار)"
              : "سورة " + getSurahName(surah);
            if (curTimings.length) startTracking(surah, isTest ? 1 : ayah);
            ap.addEventListener(
              "ended",
              function () {
                URL.revokeObjectURL(blobUrl);
              },
              { once: true },
            );
          } catch (e) {
            if (!(e && e.name === "AbortError")) {
              alert(
                isTest
                  ? "فشل تحميل التلاوة التجريبية."
                  : "حدث خطأ أثناء التشغيل.",
              );
            }
            showLoading(false);
          } finally {
            if (!isTest) {
              closeAll();
              if (surah && surahDownloadState[surah - 1] !== "done")
                downloadSurah(surah - 1);
            }
          }
        }
        window.playFromAyah = function () {
          playSurah(selSurah, selAyah, false);
        };
        window.testAudio = function () {
          playSurah(112, 1, true);
        };
        function getAyahTextByKey(surah, ayah) {
          var key = surah + ":" + ayah;
          if (ayahTextCache[key]) return ayahTextCache[key];
          var el = document.querySelector('[data-surah="' + surah + '"][data-ayah="' + ayah + '"]');
          if (el && el.dataset.text) return el.dataset.text;
          return null;
        }
        window.copyAyahText = function () {
          if (!selSurah || !selAyah) { closeAll(); return; }
          var txt = getAyahTextByKey(selSurah, selAyah);
          if (!txt) { closeAll(); return; }
          var full = txt + " (" + getSurahName(selSurah) + " " + selAyah + ")";
          if (navigator.clipboard && navigator.clipboard.writeText) {
            navigator.clipboard.writeText(full).catch(function(){});
          } else {
            var ta = document.createElement("textarea");
            ta.value = full; ta.style.position = "fixed"; ta.style.opacity = "0";
            document.body.appendChild(ta); ta.select();
            try { document.execCommand("copy"); } catch(e) {}
            document.body.removeChild(ta);
          }
          closeAll();
          showToast("تم نسخ الآية");
        };
        window.openTafsir = function () {
          if (!selSurah || !selAyah) { closeAll(); return; }
          closeAll();
          window.open("https://quran.com/" + selSurah + "/" + selAyah + "/tafsirs", "_blank");
        };
        window.shareAyah = function () {
          if (!selSurah || !selAyah) { closeAll(); return; }
          var txt = getAyahTextByKey(selSurah, selAyah);
          closeAll();
          var shareData = { text: txt + "\n\n" + getSurahName(selSurah) + " - الآية " + selAyah + "\n\nhttps://quran.com/" + selSurah + "/" + selAyah };
          if (navigator.share) {
            navigator.share(shareData).catch(function(){});
          } else if (navigator.clipboard && navigator.clipboard.writeText) {
            navigator.clipboard.writeText(shareData.text).then(function(){
              showToast("تم نسخ الرابط");
            }).catch(function(){});
          }
        };
        function showToast(msg) {
          var existing = document.querySelector(".toast-msg");
          if (existing) existing.remove();
          var t = document.createElement("div");
          t.className = "toast-msg";
          t.textContent = msg;
          t.style.cssText = "position:fixed;bottom:100px;left:50%;transform:translateX(-50%);background:var(--text-primary);color:var(--bg-body);padding:12px 28px;border-radius:60px;font-size:0.9rem;z-index:9999;box-shadow:0 8px 24px rgba(0,0,0,0.2);direction:rtl;font-family:Tajawal,sans-serif;";
          document.body.appendChild(t);
          setTimeout(function(){ t.style.opacity = "0"; t.style.transition = "opacity 0.3s"; setTimeout(function(){t.remove();},400); }, 2000);
        }
        window.togglePlay = function () {
          if (!ap.src) return;
          if (isPlaying) {
            ap.pause();
            pauseTrackingOnly();
          } else {
            ap.play();
            if (curSurah && curTimings.length) {
              var t = ap.currentTime,
                found = curTimings.find(function (tm) {
                  return t >= tm.start && t < tm.end;
                }),
                ayahToUse = found
                  ? parseInt(found.verse_key.split(":")[1])
                  : curAyah;
              startTracking(curSurah, isNaN(ayahToUse) ? curAyah : ayahToUse);
            }
          }
          isPlaying = !isPlaying;
          updatePlayButton();
        };
        function updatePlayButton() {
          ppb.innerHTML = isPlaying
            ? '<i class="fa-solid fa-pause"></i>'
            : '<i class="fa-solid fa-play"></i>';
        }
        ap.addEventListener("ended", function () {
          isPlaying = false;
          updatePlayButton();
          stopTracking();
        });
        ap.addEventListener("pause", function () {
          isPlaying = false;
          updatePlayButton();
        });
        ap.addEventListener("play", function () {
          isPlaying = true;
          updatePlayButton();
        });
        ap.addEventListener("seeked", function () {
          if (!isPlaying || !curSurah || !curTimings.length) return;
          var t = ap.currentTime,
            found = curTimings.find(function (tm) {
              return t >= tm.start && t < tm.end;
            });
          if (found) {
            var a = parseInt(found.verse_key.split(":")[1]);
            if (!isNaN(a) && a !== curAyah) {
              curAyah = a;
              highlightAyah(curSurah, a);
            }
          }
          startTracking(curSurah, curAyah);
        });
        var markerColor = function (c) {
          return function () {
            if (!selEl) {
              closeAll();
              return;
            }
            var s = selSurah,
              a = selAyah,
              t = getMarkerType(s, a),
              o = c === "red" ? "green" : "red";
            if (t === c) {
              markAyahElements(s, a, null);
              removeMarker(s, a);
            } else {
              // only one marker of each colour is kept, so clear the previous one first
              document
                .querySelectorAll("." + c + "-marker")
                .forEach(function (el) {
                  el.classList.remove(c + "-marker");
                });
              markAyahElements(s, a, c);
              addMarker(c, s, a);
            }
            closeAll();
          };
        };
        window.toggleRedMarker = markerColor("red");
        window.toggleGreenMarker = markerColor("green");
        function padPageNum(n) { return String(n).padStart(3, "0"); }
        function getPageImgUrl(n) {
          return MUSHAF_IMG_BASE + padPageNum(n) + ".png";
        }
        async function loadQCFData(pageNum) {
          if (qcfDataCache[pageNum]) return qcfDataCache[pageNum];
          var url = QCF_DATA_BASE + padPageNum(pageNum) + ".json";
          try {
            var cache = await caches.open(SURAH_CACHE),
              cached = await cache.match(url);
            if (cached && cached.ok) {
              var d = await cached.json();
              qcfDataCache[pageNum] = d;
              return d;
            }
          } catch (_) {}
          var resp = await fetch(url);
          if (!resp.ok) throw new Error("QCF fetch failed");
          var data = await resp.json();
          qcfDataCache[pageNum] = data;
          try {
            var ca = await caches.open(SURAH_CACHE);
            ca.put(url, new Response(JSON.stringify(data), { headers: { "Content-Type": "application/json" } }));
          } catch (_) {}
          return data;
        }
        function computePositionsFromApi(apiData) {
          var PRINTED_LINES = 15, LINE_PCT = 100 / PRINTED_LINES;
          var verses = apiData.verses;
          if (!verses || !verses.length) return null;
          var ayahMap = {};
          verses.forEach(function(v) {
            var key = v.verse_key;
            ayahMap[key] = ayahMap[key] || { lineWordCounts: {} };
            v.words.forEach(function(w) {
              var ln = w.line_number;
              if (!ln) return;
              ayahMap[key].lineWordCounts[ln] = (ayahMap[key].lineWordCounts[ln] || 0) + 1;
            });
          });
          // Determine visual ayah order per line (API verse order = RTL order on page)
          var lineOrder = {};
          verses.forEach(function(v) {
            var key = v.verse_key, seen = {};
            v.words.forEach(function(w) {
              var ln = w.line_number;
              if (!ln || seen[ln]) return;
              seen[ln] = true;
              if (!lineOrder[ln]) lineOrder[ln] = [];
              if (lineOrder[ln].indexOf(key) < 0) lineOrder[ln].push(key);
            });
          });
          var segments = [];
          var firstIdDone = {};
          for (var key in ayahMap) {
            var parts = key.split(":");
            var surah = parseInt(parts[0]), ayah = parseInt(parts[1]);
            var lineNums = Object.keys(ayahMap[key].lineWordCounts).map(Number).sort(function(a,b){return a-b;});
            lineNums.forEach(function(ln) {
              var top = (ln - 1) * LINE_PCT, height = LINE_PCT;
              var left = 0, width = 100;
              var ayahsOnLine = lineOrder[ln];
              if (ayahsOnLine && ayahsOnLine.length > 1) {
                var totalWords = 0;
                ayahsOnLine.forEach(function(ak) { totalWords += ayahMap[ak].lineWordCounts[ln] || 0; });
                if (totalWords > 0) {
                  var cum = 0;
                  for (var ai = 0; ai < ayahsOnLine.length; ai++) {
                    var ak = ayahsOnLine[ai];
                    var wc = ayahMap[ak].lineWordCounts[ln] || 0;
                    if (ak === key) { left = cum; width = (wc / totalWords) * 100; break; }
                    cum += (wc / totalWords) * 100;
                  }
                }
              }
              var seg = { surah: surah, ayah: ayah, key: key, top: top, height: height, left: left, width: width };
              if (!firstIdDone[key]) { seg.isFirst = true; firstIdDone[key] = true; }
              segments.push(seg);
            });
          }
          return segments;
        }
        function computeAyahPositions(qcfData) {
          var PRINTED_LINES = 15, LINE_PCT = 100 / PRINTED_LINES;
          var lines = qcfData.lines;
          if (!lines || !lines.length) return [];
          var nonTextTypes = {"surah-header": true, "basmala": true, "surah_header": true, "bismillah": true};
          var totalQcfLines = lines.length;
          var useExact = (totalQcfLines === PRINTED_LINES);
          var nonTextCount = 0, textLines = [];
          for (var i = 0; i < lines.length; i++) {
            var l = lines[i];
            if (nonTextTypes[l.type]) nonTextCount++;
            else if (l.type === "text") textLines.push(l);
          }
          var textQcfCount = textLines.length;
          if (!textQcfCount) return [];
          var lineAyahs = textLines.map(function(line) {
            var ayahSet = [], ayahWordCount = {}, seen = {};
            line.words.forEach(function(w) {
              var p = w.location.split(":"), key = p[0] + ":" + p[1];
              if (!seen[key]) { seen[key] = true; ayahSet.push(key); }
              ayahWordCount[key] = (ayahWordCount[key] || 0) + 1;
            });
            return { ayahs: ayahSet, ayahWordCount: ayahWordCount, line: line };
          });
          var allAyahs = [], allSeen = {};
          lineAyahs.forEach(function(la) {
            la.ayahs.forEach(function(k) {
              if (!allSeen[k]) { allSeen[k] = true; allAyahs.push(k); }
            });
          });
          var textLineInfo = [];
          var textPrintedLines = PRINTED_LINES - nonTextCount;
          if (useExact) {
            var textIdx = 0;
            for (var i = 0; i < totalQcfLines; i++) {
              if (lines[i].type === "text") {
                textLineInfo.push({ top: i * LINE_PCT, height: LINE_PCT, qcfLineIdx: i });
                textIdx++;
              }
            }
          } else {
            for (var li = 0; li < textQcfCount; li++) {
              var prevH = li * (textPrintedLines / textQcfCount) * LINE_PCT;
              textLineInfo.push({ top: nonTextCount * LINE_PCT + prevH, height: (textPrintedLines / textQcfCount) * LINE_PCT, qcfLineIdx: -1 });
            }
          }
          var positions = [];
          allAyahs.forEach(function(key) {
            var parts = key.split(":"), surah = parseInt(parts[0]), ayah = parseInt(parts[1]);
            var lineEntries = [];
            lineAyahs.forEach(function(la, idx) {
              if (la.ayahs.indexOf(key) >= 0) lineEntries.push({ lineIdx: idx, wordCount: la.ayahWordCount[key], top: textLineInfo[idx].top, height: textLineInfo[idx].height });
            });
            if (!lineEntries.length) return;
            var minIdx = lineEntries[0].lineIdx, maxIdx = lineEntries[lineEntries.length - 1].lineIdx;
            var top = textLineInfo[minIdx].top;
            var height = textLineInfo[maxIdx].top + textLineInfo[maxIdx].height - top;
            var left = 0, width = 100;
            var sharedLines = lineEntries.filter(function(e) { return lineAyahs[e.lineIdx].ayahs.length > 1; });
            if (sharedLines.length > 0) {
              var ayahLeft = 100, ayahRight = 0;
              sharedLines.forEach(function(e) {
                var la = lineAyahs[e.lineIdx], line = la.line;
                var ayahGroups = [], curGrp = null;
                line.words.forEach(function(w) {
                  var wp = w.location.split(":"), wk = wp[0] + ":" + wp[1];
                  if (!curGrp || curGrp.key !== wk) { curGrp = { key: wk, words: [] }; ayahGroups.push(curGrp); }
                  curGrp.words.push(w);
                });
                var reversed = ayahGroups.slice().reverse(), cumW = 0;
                for (var g = 0; g < reversed.length; g++) {
                  var grpW = (reversed[g].words.length / line.words.length) * 100;
                  if (reversed[g].key === key) { ayahLeft = Math.min(ayahLeft, cumW); ayahRight = Math.max(ayahRight, cumW + grpW); break; }
                  cumW += grpW;
                }
              });
              left = ayahLeft; width = ayahRight - ayahLeft;
            }
            positions.push({ surah: surah, ayah: ayah, key: key, top: top, height: height, left: left, width: width });
          });
          return positions.sort(function(a, b) { return a.surah - b.surah || a.ayah - b.ayah; });
        }
        function getAyahTextFromQCF(qcfData, surah, ayah) {
          var key = surah + ":" + ayah, words = [];
          qcfData.lines.forEach(function(l) {
            if (l.type !== "text") return;
            l.words.forEach(function(w) {
              var p = w.location.split(":"), wk = p[0] + ":" + p[1];
              if (wk === key) words.push(w.word);
            });
          });
          return words.join(" ");
        }
        function extractAyahTexts(qcfData) {
          var map = {};
          qcfData.lines.forEach(function(l) {
            if (l.type !== "text") return;
            l.words.forEach(function(w) {
              var p = w.location.split(":"), key = p[0] + ":" + p[1];
              if (!map[key]) map[key] = [];
              map[key].push(w.word);
            });
          });
          var result = {};
          for (var k in map) result[k] = map[k].join(" ");
          return result;
        }
        /* === QCF mushaf text rendering (alfurqan API) === */
        var layoutCache = {},
          loadedQcfFonts = new Set();
        function toArNum(n) {
          var m = "٠١٢٣٤٥٦٧٨٩";
          return String(n).replace(/\d/g, function (d) { return m[+d]; });
        }
        function pageToJuz(p) {
          var j = 1;
          for (var i = 0; i < JUZ_START.length; i++) { if (p >= JUZ_START[i]) j = i + 1; }
          return Math.min(j, 30);
        }
        function midJuz(p) {
          var j = pageToJuz(p), s = JUZ_START[j - 1], e = JUZ_START[j] || 605;
          return Math.floor((s + e) / 2);
        }
        function pageToHizb(p) { return ((pageToJuz(p) - 1) * 2 + (p >= midJuz(p) ? 1 : 0)) || 1; }
        function qcfFontName(pageNum) { return "QCF400" + padPageNum(pageNum); }
        function ensureQcfFont(pageNum) {
          var fam = qcfFontName(pageNum);
          if (loadedQcfFonts.has(fam)) return fam;
          loadedQcfFonts.add(fam);
          var css = "@font-face{font-family:'" + fam + "';src:url('" + ALFURQAN_API + "/quran-fonts/v2/" + pageNum + "') format('truetype');font-display:block;}";
          var s = document.createElement("style");
          s.id = "qcf-" + fam;
          s.textContent = css;
          document.head.appendChild(s);
          return fam;
        }
        function waitForQcfFont(fam) {
          if (document.fonts && document.fonts.load) {
            return document.fonts.load('32px "' + fam + '"').then(function () { return document.fonts.ready; }).catch(function () {});
          }
          return Promise.resolve();
        }
        async function loadMushafLayout(pageNum) {
          if (layoutCache[pageNum]) return layoutCache[pageNum];
          var url = ALFURQAN_API + "/quran-fonts/layout/" + pageNum;
          try {
            var cache = await caches.open(SURAH_CACHE),
              cached = await cache.match(url);
            if (cached && cached.ok) {
              var d = await cached.json();
              layoutCache[pageNum] = d;
              return d;
            }
          } catch (_) {}
          var ac = new AbortController(),
            to = setTimeout(function () { ac.abort(); }, 10000);
          var resp = await fetch(url, { signal: ac.signal });
          clearTimeout(to);
          if (!resp.ok) throw new Error("layout fetch failed");
          var data = await resp.json();
          layoutCache[pageNum] = data;
          try {
            var c2 = await caches.open(SURAH_CACHE);
            c2.put(url, resp.clone());
          } catch (_) {}
          return data;
        }
        function firstSurahOnLayout(layout) {
          for (var i = 0; i < layout.lines.length; i++) {
            if (layout.lines[i].surah) return layout.lines[i].surah;
          }
          for (var j = 0; j < layout.lines.length; j++) {
            var l = layout.lines[j];
            if (l.words && l.words[0] && l.words[0].location)
              return parseInt(l.words[0].location.split(":")[0], 10);
          }
          return null;
        }
        async function tryLoadMushafPage(pageNum) {
          var layout;
          try { layout = await loadMushafLayout(pageNum); } catch (e) { return null; }
          if (!layout || !layout.lines || !layout.lines.length) return null;
          var fam = ensureQcfFont(pageNum);
          var pageEl = document.createElement("div");
          pageEl.className = "page";
          pageEl.dataset.page = pageNum;
          var mp = document.createElement("div");
          mp.className = "mushaf-page";
          mp.style.setProperty("--qcf", '"' + fam + '"');
          var mi = document.createElement("div");
          mi.className = "mushaf-inner";
          var head = document.createElement("div");
          head.className = "page-head";
          var jz = document.createElement("span");
          jz.className = "corner";
          jz.textContent = "الجزء " + toArNum(pageToJuz(pageNum));
          var su = document.createElement("span");
          su.className = "center";
          var fs = firstSurahOnLayout(layout);
          su.textContent = fs ? (surahNames[fs - 1] || "") : "";
          var hz = document.createElement("span");
          hz.className = "corner";
          hz.textContent = "الحزب " + toArNum(pageToHizb(pageNum));
          head.appendChild(jz); head.appendChild(su); head.appendChild(hz);
          mi.appendChild(head);
          var lines = document.createElement("div");
          lines.className = "lines";
          layout.lines.forEach(function (line) {
            if (line.type === "surah-header") {
              var band = document.createElement("div");
              band.className = "surah-band";
              var orn1 = document.createElement("span"); orn1.className = "orn";
              var nm = document.createElement("span"); nm.className = "name"; nm.textContent = line.text || "";
              var orn2 = document.createElement("span"); orn2.className = "orn";
              band.appendChild(orn1); band.appendChild(nm); band.appendChild(orn2);
              lines.appendChild(band);
              return;
            }
            var row = document.createElement("div");
            row.className = "line " + (line.type === "basmala" ? "center-line" : "text-line");
            if (line.type === "basmala" && (!line.words || !line.words.length)) {
              row.innerHTML = '<span style="font-family:\'Amiri\',serif;font-size:calc(var(--qcf-fs, 32px) * 1.15);color:var(--ayah-text);letter-spacing:1px">بِسْمِ ٱللَّهِ ٱلرَّحْمَـٰنِ ٱلرَّحِيمِ</span>';
              lines.appendChild(row);
              return;
            }
            if (line.words && line.words.length) {
              var lastAyahKey = null, ayahWrap = null;
              line.words.forEach(function (w) {
                var loc = w.location || "";
                var pr = loc.split(":");
                var ayahKey = (pr[0] || "") + ":" + (pr[1] || "");
                if (ayahKey !== lastAyahKey) {
                  ayahWrap = document.createElement("span");
                  ayahWrap.className = "ayah";
                  ayahWrap.dataset.surah = pr[0] || "";
                  ayahWrap.dataset.ayah = pr[1] || "";
                  row.appendChild(ayahWrap);
                  lastAyahKey = ayahKey;
                }
                var span = document.createElement("span");
                span.className = "word";
                span.dataset.loc = loc;
                span.dataset.surah = pr[0] || "";
                span.dataset.ayah = pr[1] || "";
                span.dataset.verse = ayahKey;
                span.textContent = w.qpcV2 || w.qpcV1 || w.word || "";
                ayahWrap.appendChild(span);
              });
            } else if (line.text) row.textContent = line.text;
            lines.appendChild(row);
          });
          mi.appendChild(lines);
          var foot = document.createElement("div");
          foot.className = "page-foot";
          var pn = document.createElement("div");
          pn.className = "pageno";
          pn.textContent = pageNum;
          foot.appendChild(pn);
          mi.appendChild(foot);
          mp.appendChild(mi);
          pageEl.appendChild(mp);
          var map = {};
          layout.lines.forEach(function (l) {
            if (l.type !== "text" && l.type !== "basmala") return;
            (l.words || []).forEach(function (w) {
              var pr = (w.location || "").split(":");
              if (pr.length < 2) return;
              var k = pr[0] + ":" + pr[1];
              if (!map[k]) map[k] = [];
              map[k].push(w.word || "");
            });
          });
          for (var k in map) ayahTextCache[k] = map[k].join(" ");
          function calibrateMushafPage() {
            var mi = mp.querySelector(".mushaf-inner");
            if (!mi) return;
            var rows = lines.children;
            var textCount = 0;
            for (var i = 0; i < rows.length; i++) {
              if (rows[i].classList.contains("line")) textCount++;
            }
            if (!textCount) return;
            var full = rows.length >= 12;
            mp.classList.toggle("full-page", full);
            mp.classList.toggle("short-page", !full);
            var w = mi.clientWidth;
            if (!w) return;
            var fs = w / (full ? 17.8 : 21.36);
            mp.style.setProperty("--qcf-fs", fs + "px");
            mp.style.setProperty("--qcf-lh", (full ? 1.1 : 2.0) + "em");
          }
          calibrateMushafPage();
          if (window.ResizeObserver) {
            new ResizeObserver(calibrateMushafPage).observe(mp);
          }
          waitForQcfFont(fam).then(function () {
            setTimeout(function () {
              lines.querySelectorAll(".line").forEach(function (l) { l.style.opacity = "1"; });
            }, 30);
          });
          setTimeout(applyAllStoredMarkers, 150);
          try { localStorage.setItem("quranLastPage", String(pageNum)); } catch (_) {}
          return pageEl;
        }
        async function loadPage(pageNum) {
          var offEl = document.getElementById("offlineNotice");
          try {
            var mushafEl = await tryLoadMushafPage(pageNum);
            if (mushafEl) {
              disp.insertAdjacentElement("beforeend", mushafEl);
              return;
            }
          } catch (e) {}
          var qcfData, qcfOk = false;
          try {
            qcfData = await loadQCFData(pageNum);
            qcfOk = true;
          } catch(e) {
            try {
              var cache = await caches.open(SURAH_CACHE);
              var cachedResp = await cache.match(QCF_DATA_BASE + padPageNum(pageNum) + ".json");
              if (cachedResp && cachedResp.ok) { qcfData = await cachedResp.json(); qcfOk = true; }
            } catch(_) {}
          }
          if (qcfOk && qcfData) {
            var ayahTexts = extractAyahTexts(qcfData);
            for (var at in ayahTexts) ayahTextCache[at] = ayahTexts[at];
          }
          var apiUrl = QRANK_API_BASE + pageNum + "?words=true&word_fields=line_number&per_page=100";
          var apiPositions = null;
          try {
            var ac = new AbortController(); setTimeout(function(){ac.abort();},8000);
            var apiRes = await fetch(apiUrl, {signal: ac.signal});
            if (apiRes.ok) {
              var apiData = await apiRes.json();
              apiPositions = computePositionsFromApi(apiData);
              caches.open(SURAH_CACHE).then(function(c){c.put(apiUrl, apiRes.clone());}).catch(function(){});
            }
          } catch(e) {
            try {
              var cache = await caches.open(SURAH_CACHE);
              var cachedApi = await cache.match(apiUrl);
              if (cachedApi && cachedApi.ok) {
                var apiData = await cachedApi.json();
                apiPositions = computePositionsFromApi(apiData);
                if (offEl) offEl.style.display = "block";
              }
            } catch(_) {}
          }
          // If API covers most ayahs, use it; otherwise fall back to QCF (handles long verses spanning pages)
          if (apiPositions && qcfOk && qcfData) {
            var qcfKeys = {};
            qcfData.lines.forEach(function(l) {
              if (l.type !== "text") return;
              l.words.forEach(function(w) {
                var p = w.location.split(":"), key = p[0] + ":" + p[1];
                qcfKeys[key] = true;
              });
            });
            var qcfCount = Object.keys(qcfKeys).length, apiKeys = {};
            apiPositions.forEach(function(p) { apiKeys[p.key] = true; });
            var apiAyahCount = Object.keys(apiKeys).length;
            if (qcfCount > 0 && apiAyahCount < qcfCount * 0.7) {
              apiPositions = null;
            }
          }
          var pageEl = document.createElement("div");
          pageEl.className = "page";
          pageEl.dataset.page = pageNum;
          var container = document.createElement("div");
          container.className = "mushaf-page-container";
          var img = document.createElement("img");
          img.className = "mushaf-page-img";
          img.alt = "صفحة " + pageNum;
          img.loading = "eager";
          img.decoding = "async";
          var overlay = document.createElement("div");
          overlay.className = "mushaf-overlay";
          var positions = null;
          if (apiPositions) {
            positions = apiPositions;
          } else if (qcfOk && qcfData) {
            positions = computeAyahPositions(qcfData);
          }
          if (positions && positions.length) {
            positions.forEach(function(pos) {
              var el = document.createElement("div");
              el.className = "ayah";
              el.dataset.surah = pos.surah;
              el.dataset.ayah = pos.ayah;
              if (pos.isFirst) el.id = "ayah-" + pos.surah + "-" + pos.ayah;
              el.style.top = pos.top + "%";
              el.style.height = pos.height + "%";
              el.style.left = pos.left + "%";
              el.style.width = pos.width + "%";
              overlay.appendChild(el);
            });
          } else {
            try {
              var url = "https://api.alquran.cloud/v1/page/" + pageNum + "/quran-uthmani";
              var cache = await caches.open(SURAH_CACHE);
              var cached = await cache.match(url);
              var data;
              if (cached && cached.ok) data = await cached.json();
              if (!data) {
                try {
                  var ac = new AbortController(); setTimeout(function(){ac.abort();},5000);
                  var res = await fetch(url,{signal:ac.signal});
                  if(res.ok){data=await res.json();caches.open(SURAH_CACHE).then(function(c){c.put(url,res.clone());}).catch(function(){});}
                } catch(e) {
                  if (cached && cached.ok){data=await cached.json();if(offEl)offEl.style.display="block";} else throw e;
                }
              }
              if (data && data.data && data.data.ayahs) {
                if (offEl && navigator.onLine === false) offEl.style.display = "block";
                var ayahs = data.data.ayahs;
                ayahs.forEach(function(a){
                  var tk = a.surah.number + ":" + a.numberInSurah;
                  if (!ayahTextCache[tk]) ayahTextCache[tk] = a.text;
                });
                var lineH = 100 / 15, maxFallback = Math.min(ayahs.length, 15);
                for (var fbi = 0; fbi < maxFallback; fbi++) { var a = ayahs[fbi];
                  var sNum = a.surah.number, ayNum = a.numberInSurah;
                  var el = document.createElement("div");
                  el.className = "ayah";
                  el.dataset.surah = sNum;
                  el.dataset.ayah = ayNum;
                  el.id = "ayah-" + sNum + "-" + ayNum;
                  el.style.top = (fbi * lineH) + "%";
                  el.style.height = lineH + "%";
                  el.style.left = "0%";
                  el.style.width = "100%";
                  overlay.appendChild(el);
                }
                if (offEl && navigator.onLine === false) offEl.style.display = "block";
              }
            } catch(_) {}
          }
          var imgUrl = getPageImgUrl(pageNum);
          img.src = imgUrl;
          img.onerror = function() {
            img.src = MUSHAF_IMG_FALLBACK + pageNum + ".svg?font=uthmani&width=720";
          };
          container.appendChild(img);
          container.appendChild(overlay);
          pageEl.appendChild(container);
          var pnb = document.createElement("div");
          pnb.className = "page-number-bottom";
          pnb.textContent = pageNum;
          pageEl.appendChild(pnb);
          disp.insertAdjacentElement("beforeend", pageEl);
          setTimeout(applyAllStoredMarkers, 100);
          try { localStorage.setItem("quranLastPage", String(pageNum)); } catch(_) {}
        }
        function getApiPageUrl(pageNum) {
          return QRANK_API_BASE + pageNum + "?words=true&word_fields=line_number&per_page=100";
        }
        async function cachePageOnly(pageNum) {
          var urls = [
            getApiPageUrl(pageNum),
            ALFURQAN_API + "/quran-fonts/layout/" + pageNum,
            "https://api.alquran.cloud/v1/page/" + pageNum + "/quran-uthmani",
            QCF_DATA_BASE + padPageNum(pageNum) + ".json",
            getPageImgUrl(pageNum),
          ];
          var cache = await caches.open(SURAH_CACHE);
          for (var ui = 0; ui < urls.length; ui++) {
            var url = urls[ui];
            try {
              var existing = await cache.match(url);
              if (!existing) {
                var ac = new AbortController(),
                  to = setTimeout(function () { ac.abort(); }, 5000);
                var res = await fetch(url, { signal: ac.signal });
                clearTimeout(to);
                if (res.ok) cache.put(url, res.clone());
              }
            } catch (_) {}
          }
        }
        var navLock = false;
        function manageVisiblePages() {
          if (navLock) return;
          var vt = window.scrollY - 2000,
            vb = window.scrollY + window.innerHeight + 2000;
          disp.querySelectorAll(".page").forEach(function (p) {
            var r = p.getBoundingClientRect(),
              at = r.top + window.scrollY,
              ab = at + r.height;
            if (ab < vt || at > vb) {
              if (!p.classList.contains("far")) p.classList.add("far");
            } else p.classList.remove("far");
          });
        }
        var scrollTimer = null;
        function setupVirtualScroll() {
          window.addEventListener(
            "scroll",
            function () {
              if (scrollTimer) return;
              scrollTimer = setTimeout(function () {
                scrollTimer = null;
                manageVisiblePages();
              }, 150);
            },
            { passive: true },
          );
        }
        async function loadPages(count) {
          for (var i = 0; i < count; i++) {
            if (cp > TOTAL_PAGES) break;
            await loadPage(cp);
            cp++;
          }
        }
        async function loadInitial() {
          disp.innerHTML = "";
          var lastPage = null;
          try { lastPage = parseInt(localStorage.getItem("quranLastPage")); } catch(_) {}
          cp = (lastPage && lastPage > 0 && lastPage <= TOTAL_PAGES) ? lastPage : 1;
          await loadPages(Math.min(2, TOTAL_PAGES));
          updateButtonText();
          applyAllStoredMarkers();
          afterPagesAdded();
          setupVirtualScroll();
          manageVisiblePages();
          backgroundCachePages();
          var pl = document.getElementById("page-loader");
          if (pl) pl.classList.add("hidden");
        }
        function backgroundCachePages() {
          var pg = 1, busy = false;
          var cacheUrls = {};
          function getCachedUrls(pageNum) {
            return [
              getApiPageUrl(pageNum),
              ALFURQAN_API + "/quran-fonts/layout/" + pageNum,
              "https://api.alquran.cloud/v1/page/" + pageNum + "/quran-uthmani",
              QCF_DATA_BASE + padPageNum(pageNum) + ".json",
              getPageImgUrl(pageNum),
            ];
          }
          function tryNext() {
            if (busy || pg > TOTAL_PAGES) return;
            busy = true;
            var pageNum = pg++;
            var urls = getCachedUrls(pageNum);
            caches.open(SURAH_CACHE).then(function (cache) {
              var idx = 0;
              function fetchNext() {
                if (idx >= urls.length) { busy = false; setTimeout(tryNext, 500); return; }
                var url = urls[idx++];
                if (cacheUrls[url]) { fetchNext(); return; }
                cacheUrls[url] = true;
                cache.match(url).then(function (ex) {
                  if (ex) { fetchNext(); return; }
                  var controller = new AbortController(),
                    tid = setTimeout(function () { controller.abort(); fetchNext(); }, 10000);
                  fetch(url, { signal: controller.signal })
                    .then(function (r) {
                      clearTimeout(tid);
                      if (r.ok) cache.put(url, r.clone());
                      fetchNext();
                    })
                    .catch(function () { clearTimeout(tid); fetchNext(); });
                });
              }
              fetchNext();
            });
          }
          setTimeout(tryNext, 5000);
        }
        window.loadMorePages = loadMorePages;
        window.loadInitial = loadInitial;
        window.loadQuranPage = loadPage;
        async function loadMorePages() {
          if (loading || cp > TOTAL_PAGES) return;
          loading = true;
          btn.textContent = "جاري التحميل...";
          await loadPages(Math.min(5, TOTAL_PAGES - cp + 1));
          updateButtonText();
          applyAllStoredMarkers();
          afterPagesAdded();
          loading = false;
          manageVisiblePages();
          try {
            localStorage.setItem("quranLoadedPages", String(cp - 1));
          } catch (_) {}
        }
        function updateButtonText() {
          if (cp > TOTAL_PAGES) {
            btn.textContent = "انتهى المصحف";
            btn.classList.add("hidden-btn");
          } else {
            btn.textContent = "عرض المزيد من الصفحات";
            btn.classList.remove("hidden-btn");
          }
        }
        btn.addEventListener("click", loadMorePages);
        var surahDownloadState = new Array(114).fill(null);
        function getReciterKey() {
          var info = getSelectedReciterInfo();
          if (!info) return null;
          return info.source === "custom"
            ? "custom"
            : info.source + ":" + info.id;
        }
        function getDownloadStateKey(rk, idx) {
          return rk + ":" + idx;
        }
        function loadDownloadState() {
          try {
            var raw = JSON.parse(localStorage.getItem("surahDownloads"));
            if (!raw || typeof raw !== "object") return;
            var rk = getReciterKey();
            if (!rk) return;
            for (var i = 0; i < 114; i++) {
              var k = getDownloadStateKey(rk, i);
              if (raw[k] === "done") {
                surahDownloadState[i] = "done";
                updateDownloadBtn(i);
              }
            }
          } catch (_) {}
        }
        function saveDownloadState(idx, state) {
          try {
            var raw = {};
            try {
              raw = JSON.parse(localStorage.getItem("surahDownloads")) || {};
            } catch (_) {}
            var rk = getReciterKey();
            if (rk) raw[getDownloadStateKey(rk, idx)] = state;
            localStorage.setItem("surahDownloads", JSON.stringify(raw));
          } catch (_) {}
        }
        function getSurahPageRange(idx) {
          var start = surahPages[idx],
            end = idx < surahPages.length - 1 ? surahPages[idx + 1] - 1 : 604;
          return { start: start, end: end };
        }
        async function updateDownloadBtn(idx) {
          var item = document.getElementById("surah-" + idx);
          if (!item) return;
          var st = surahDownloadState[idx],
            btn2 = item.querySelector(".dl-btn");
          if (!btn2) return;
          if (st === "done") {
            btn2.innerHTML =
              '<i class="fa-solid fa-check" style="color:#1B7A4B"></i>';
            btn2.title = "تم التحميل";
          } else if (st === "progress") {
            btn2.innerHTML =
              '<i class="fa-solid fa-spinner fa-spin" style="color:#c9a03d"></i>';
            btn2.title = "جاري التحميل...";
          } else {
            btn2.innerHTML = '<i class="fa-solid fa-download"></i>';
            btn2.title = "تحميل السورة للاستخدام دون اتصال";
          }
        }
        async function cacheFetch(url, cache, signal) {
          try {
            var r = await fetch(url, signal ? { signal: signal } : undefined);
            if (r.ok) await cache.put(url, r.clone());
          } catch (e) {
            if (signal && signal.aborted) throw e;
          }
        }
        var downloadAbort = null;
        var loadAbort = null;
        function cancelLoading() {
          if (loadAbort) {
            loadAbort.abort();
            loadAbort = null;
          }
          if (downloadAbort) {
            downloadAbort.abort();
            downloadAbort = null;
          }
          try {
            if (ap && !ap.paused) ap.pause();
          } catch (_) {}
          showLoading(false);
        }
        window.cancelLoading = cancelLoading;
        function setDownloading(show, pct) {
          var bar = document.getElementById("reciterBar"),
            li = document.getElementById("loadingIndicator"),
            ps = document.getElementById("loadingPercent");
          if (!bar || !li) return;
          if (show) {
            bar.classList.add("downloading");
            li.style.display = "flex";
            if (ps && typeof pct === "number") ps.innerText = pct + "%";
          } else {
            bar.classList.remove("downloading");
            li.style.display = "none";
          }
        }
        async function downloadSurah(idx, reciterInfo) {
          if (surahDownloadState[idx] === "progress") return;
          var range = getSurahPageRange(idx),
            surahNum = idx + 1;
          surahDownloadState[idx] = "progress";
          await updateDownloadBtn(idx);
          var info = reciterInfo || getSelectedReciterInfo();
          downloadAbort = new AbortController();
          setDownloading(true, 0);
          try {
            var cache = await caches.open(SURAH_CACHE),
              items = [],
              i,
              it,
              c;
            for (var p = range.start; p <= range.end; p++)
              items.push({
                url:
                  "https://api.alquran.cloud/v1/page/" + p + "/quran-uthmani",
                cache: SURAH_CACHE,
              });
            if (info) {
              var padded = String(surahNum).padStart(3, "0");
              if (info.source === "custom") {
                items.push({
                  url:
                    "https://cdn.mualim.app/muhammad-al-luhaidan-murattal/" +
                    padded +
                    ".opus",
                  cache: "quran-audio-v1",
                });
                items.push({
                  url:
                    "https://cdn.mualim.app/muhammad-al-luhaidan-murattal/" +
                    padded +
                    ".pb",
                  cache: SURAH_CACHE,
                });
              } else if (info.source === "mp3quran" && info.folder_url)
                items.push({
                  url: info.folder_url + padded + ".mp3",
                  cache: "quran-audio-v1",
                });
              else if (info.source === "quran") {
                try {
                  var r2 = await fetch(
                      "https://api.quran.com/api/v4/chapter_recitations/" +
                        info.id +
                        "/" +
                        surahNum +
                        "?segments=true",
                      { signal: downloadAbort.signal },
                    ),
                    d2 = await r2.json();
                  if (d2.audio_file && d2.audio_file.audio_url)
                    items.push({
                      url: d2.audio_file.audio_url,
                      cache: "quran-audio-v1",
                    });
                } catch (_) {}
              }
            }
            var done = 0;
            for (i = 0; i < items.length; i++) {
              if (downloadAbort.signal.aborted)
                throw new DOMException("Aborted", "AbortError");
              it = items[i];
              c = await caches.open(it.cache || SURAH_CACHE);
              await cacheFetch(it.url, c, downloadAbort.signal);
              done++;
              setDownloading(true, Math.round((done / items.length) * 100));
            }
            surahDownloadState[idx] = "done";
            saveDownloadState(idx, "done");
          } catch (e) {
            surahDownloadState[idx] = null;
            saveDownloadState(idx, null);
          }
          downloadAbort = null;
          setDownloading(false);
          await updateDownloadBtn(idx);
        }
        loadDownloadState();
        rs.addEventListener("change", function () {
          for (var i = 0; i < 114; i++) surahDownloadState[i] = null;
          loadDownloadState();
          var rbn = document.getElementById("reciterBarName");
          if (rbn)
            rbn.textContent =
              rs.options[rs.selectedIndex]?.textContent || "اختر القارئ";
        });

        var JUZ_PAGES = [1,22,42,62,82,102,121,141,161,181,201,221,241,261,281,301,321,341,361,381,401,421,441,461,481,501,521,541,561,581];
        function juzOfPage(p) {
          var j = 1;
          for (var k = 0; k < JUZ_PAGES.length; k++) if (p >= JUZ_PAGES[k]) j = k + 1;
          return j;
        }
        async function goToSurahPage(idx) {
          try { stopTracking(); } catch (e) {}
          var pg = surahPages[idx];
          if (!pg || pg < 1) pg = 1;
          if (document.body.classList.contains("page-mode")) {
            activeSurahIdx = idx;
            highlightActiveSurah();
            if (window.buildSmallWindow) await window.buildSmallWindow(pg);
            return;
          }
          disp.innerHTML = "";
          cp = pg;
          await loadPages(Math.min(5, TOTAL_PAGES - cp + 1));
          try { localStorage.setItem("quranLoadedPages", String(cp - 1)); } catch (_) {}
          updateButtonText();
          applyAllStoredMarkers();
          afterPagesAdded();
          var pg = surahPages[idx];
          disp.querySelectorAll(".page.far").forEach(function (p) { p.classList.remove("far"); });
          var pgEl = disp.querySelector('.page[data-page="' + pg + '"]');
          var target = document.getElementById("ayah-" + (idx + 1) + "-1");
          if (!target)
            target = document.querySelector('.ayah[data-surah="' + (idx + 1) + '"][data-ayah="1"]');
          navLock = true;
          if (target) target.scrollIntoView({ behavior: "smooth", block: "start" });
          else if (pgEl) pgEl.scrollIntoView({ behavior: "smooth", block: "start" });
          else {
            var vs = document.getElementById("verses");
            if (vs) vs.scrollIntoView({ behavior: "smooth", block: "start" });
          }
          setTimeout(function () { navLock = false; manageVisiblePages(); }, 850);
          activeSurahIdx = idx;
          highlightActiveSurah();
        }
        function buildSurahIndex() {
          var host = document.getElementById("surah-index");
          if (!host) return;
          var html = "";
          html +=
            '<div class="index-overlay-header">' +
            '<h2 class="index-title">الفهرس</h2>' +
            '<button type="button" class="index-overlay-close" onclick="closeSurahIndex()" aria-label="إغلاق"><i class="fa-solid fa-xmark"></i></button>' +
            "</div>";
          html += '<div class="index-scroll">';
          html +=
            '<div class="index-top-toggle">' +
            '<button type="button" class="idx-tab active" data-tab="sura">السور</button>' +
              '<button type="button" class="idx-tab" data-tab="juz" title="قريبًا">الأجزاء</button>' +
            "</div>";
          html += '<div class="index-list">';
          for (var j = 1; j <= 30; j++) {
            var group = [];
            for (var i = 0; i < 114; i++) if (juzOfPage(surahPages[i]) === j) group.push(i);
            html += '<div class="juz-group"><div class="juz-header">الجزء ' + toArNum(j) + "</div>";
            if (!group.length) {
              html += '<div class="juz-empty">لا سور تبدأ في هذا الجزء</div>';
            } else {
              group.forEach(function (i) {
                var type = surahRevelation[i] === "M" ? "مكية" : "مدنية";
                html +=
                  '<div class="surah-row" data-idx="' + i + '">' +
                  '<div class="surah-num">' + toArNum(i + 1) + "</div>" +
                  '<div class="surah-info">' +
                  '<div class="surah-name">' + surahNames[i] + "</div>" +
                  '<div class="surah-meta">الصفحة ' + toArNum(surahPages[i]) + " - آياتها " + toArNum(surahAyahs[i]) + " - " + type + "</div>" +
                  "</div></div>";
              });
            }
            html += "</div>";
          }
          html += "</div></div>";
          html +=
            '<div class="index-bottom-nav">' +
              '<button type="button" class="idx-nav active">السور</button>' +
              '<button type="button" class="idx-nav" title="قريبًا">الختمة</button>' +
              '<button type="button" class="idx-nav" title="قريبًا">الفواصل</button>' +
              '<button type="button" class="idx-nav" title="قريبًا">مميزة بنجمة</button>' +
            "</div>";
          host.innerHTML = html;
          host.querySelectorAll(".surah-row").forEach(function (row) {
            row.setAttribute("tabindex", "0");
            row.setAttribute("role", "button");
            var open = function () {
              goToSurahPage(parseInt(row.getAttribute("data-idx"), 10));
              closeSurahIndex();
            };
            row.addEventListener("click", open);
            row.addEventListener("keydown", function (e) {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                open();
              }
            });
          });
        }
        buildSurahIndex();
        // بعد اكتمال جلب الأسماء من API أعد بناء الفهرس (لو كانت من الكاش/الشبكة)
        if (surahNamesReady && surahNamesReady.then) {
          surahNamesReady.then(function () {
            // أعد البناء فقط لو الأسماء اكتملت (114)
            if (surahNames.length === 114) {
              try { buildSurahIndex(); } catch (_) {}
            }
          });
        }
        function updateCtxItem(elId, color) {
          var el = document.getElementById(elId);
          if (!el) return;
          var isActive = getMarkerType(selSurah, selAyah) === color;
          el.innerHTML = isActive
            ? '<i class="fa-solid fa-eraser' +
              (color === "green" ? " tape-green" : "") +
              '"></i> إزالة شريط ' +
              (color === "red" ? "الأحمر" : "الأخضر")
            : '<i class="fa-solid fa-highlighter"></i> شريط ' +
              (color === "red" ? "أحمر" : "أخضر");
          el.className = isActive
            ? "menu-item remove-item" + (color === "green" ? " tape-green" : "")
            : "menu-item";
          el.onclick = color === "red" ? toggleRedMarker : toggleGreenMarker;
        }
        function updateContextMenuItems() {
          if (!selSurah || !selAyah) return;
          updateCtxItem("ctxRed", "red");
          updateCtxItem("ctxGreen", "green");
        }
        function showContextMenu(e, el, s, a) {
          e.preventDefault();
          selEl = el;
          selSurah = s;
          selAyah = a;
          updateContextMenuItems();
          ctx.style.display = "block";
          var x = e.touches ? e.touches[0].clientX : e.clientX,
            y = e.touches ? e.touches[0].clientY : e.clientY;
          ctx.style.left = x + "px";
          ctx.style.top = y + "px";
          setTimeout(function () {
            var rect = ctx.getBoundingClientRect();
            if (rect.right > window.innerWidth)
              ctx.style.left = window.innerWidth - rect.width - 10 + "px";
            if (rect.bottom > window.innerHeight)
              ctx.style.top = window.innerHeight - rect.height - 10 + "px";
          }, 10);
        }
        disp.addEventListener("contextmenu", function (e) {
          var ayah = e.target.closest(".ayah, .word");
          if (ayah)
            showContextMenu(
              e,
              ayah,
              parseInt(ayah.dataset.surah),
              parseInt(ayah.dataset.ayah),
            );
        });
        var touchTimer,
          touchMoved = false;
        disp.addEventListener("touchstart", function (e) {
          var ayah = e.target.closest(".ayah, .word");
          if (!ayah) return;
          touchMoved = false;
          touchTimer = setTimeout(function () {
            if (!touchMoved)
              showContextMenu(
                e,
                ayah,
                parseInt(ayah.dataset.surah),
                parseInt(ayah.dataset.ayah),
              );
          }, 600);
        });
        disp.addEventListener("touchmove", function () {
          touchMoved = true;
          clearTimeout(touchTimer);
        });
        disp.addEventListener("touchend", function () {
          clearTimeout(touchTimer);
        });
        document.addEventListener("click", function () {
          ctx.style.display = "none";
        });
        /* Whole-ayah hover: highlight every line-segment of the ayah */
        var hoveredAyahKey = null;
        function setAyahHover(s, a) {
          var key = s && a ? s + ":" + a : null;
          if (key === hoveredAyahKey) return;
          if (hoveredAyahKey) {
            document
              .querySelectorAll(".ayah.hover-mark")
              .forEach(function (el) { el.classList.remove("hover-mark"); });
          }
          hoveredAyahKey = key;
          if (key) {
            document
              .querySelectorAll('.ayah[data-surah="' + s + '"][data-ayah="' + a + '"]')
              .forEach(function (el) { el.classList.add("hover-mark"); });
          }
        }
        disp.addEventListener("mouseover", function (e) {
          var ay = e.target.closest(".ayah");
          setAyahHover(ay ? ay.dataset.surah : null, ay ? ay.dataset.ayah : null);
        });
        disp.addEventListener("mouseout", function (e) {
          var to = e.relatedTarget && e.relatedTarget.closest ? e.relatedTarget.closest(".ayah") : null;
          if (!to) setAyahHover(null, null);
        });
        /* === SLIDER === */
        var rs2 = document.getElementById("pageRangeSlider"),
          ind2 = document.getElementById("quranPageIndicator"),
          sf2 = document.getElementById("pageSliderFill"),
          tl2 = document.getElementById("pageSliderTooltip"),
          tpn2 = document.getElementById("tooltipPageNum"),
          tsn2 = document.getElementById("tooltipSurahName");
        function setSliderFill(v) {
          if (rs2)
            rs2.style.setProperty("--fill", ((v - 1) / 603) * 100 + "%");
        }
        function syncSliderFromIndicator() {
          var m = ind2.textContent.match(/(\d+)/);
          if (m) {
            rs2.value = parseInt(m[1]);
            setSliderFill(parseInt(m[1]));
          }
        }
        if (rs2 && ind2) {
          var obs = new MutationObserver(syncSliderFromIndicator);
          obs.observe(ind2, {
            characterData: true,
            childList: true,
            subtree: true,
          });
          syncSliderFromIndicator();
        }
        rs2.addEventListener("input", function () {
          var v = parseInt(this.value);
          if (tl2 && tpn2 && tsn2) {
            tpn2.textContent = "صفحة " + v;
            var s = "";
            for (var i = surahPages.length - 1; i >= 0; i--) {
              if (surahPages[i] <= v) {
                s = surahNames[i];
                break;
              }
            }
            tsn2.textContent = s || "";
            var pct = (v - 1) / 603,
              tr = this.parentElement,
              tw = tr.offsetWidth || 280,
              to = 18,
              rr = (1 - pct) * (tw - to) + to / 2;
            tl2.style.left = "auto";
            tl2.style.right = Math.min(Math.max(to / 2, rr), tw - to / 2) + "px";
            tl2.style.display = "flex";
            tl2.dataset.dragging = "true";
            sliderDragging = true;
          }
        });
        function currentViewedPage() {
          if (smallPage && smallPage.active) return smallPage.num;
          var pages = document.querySelectorAll(".page");
          var best = 1, bestScore = -1;
          var vh = window.innerHeight;
          for (var i = 0; i < pages.length; i++) {
            var r = pages[i].getBoundingClientRect();
            var vis = Math.min(r.bottom, vh) - Math.max(r.top, 0);
            if (vis > 0) {
              var score = vis / (r.height || 1);
              if (score > bestScore) {
                bestScore = score;
                best = parseInt(pages[i].dataset.page) || best;
              }
            }
          }
          return best;
        }

        rs2.addEventListener("change", function () {
          if (smallPage && (smallPage.active || isPageMode)) {
            var v = parseInt(this.value);
            if (v >= 1 && v <= TOTAL_PAGES) {
              if (!smallPage.active) smallPage.active = true;
              updateSmallWindow(v);
              setSmallIndicator(v);
              rs2.value = v;
              if (typeof setSliderFill === "function") setSliderFill(v);
            }
            if (tl2) {
              tl2.style.display = "none";
              tl2.dataset.dragging = "false";
            sliderDragging = false;
            }
            return;
          }
          // Scroll mode: slider is a reading-position indicator. On release
          // it snaps back to the page currently in view.
          var cur = (typeof currentViewedPage === "function") ? currentViewedPage() : 1;
          if (!(cur >= 1 && cur <= TOTAL_PAGES)) cur = 1;
          rs2.value = cur;
          if (typeof setSliderFill === "function") setSliderFill(cur);
          if (tl2) {
            tl2.style.display = "none";
            tl2.dataset.dragging = "false";
            sliderDragging = false;
          }
        });
        rs2.addEventListener("blur", function () {
          if (tl2) {
            tl2.style.display = "none";
            tl2.dataset.dragging = "false";
            sliderDragging = false;
          }
        });

        // Hover on slider track shows current page info
        var sliderTrack = document.querySelector(".page-slider-track");
        if (sliderTrack && tl2 && tpn2 && tsn2) {
          sliderTrack.addEventListener("mouseenter", function () {
            if (tl2.dataset.dragging === "true") return;
            var v = currentViewedPage();
            tpn2.textContent = "صفحة " + v;
            var s = "";
            for (var i = surahPages.length - 1; i >= 0; i--) {
              if (surahPages[i] <= v) {
                s = surahNames[i];
                break;
              }
            }
            tsn2.textContent = s || "";
            var pct = (v - 1) / 603,
              tr = rs2.parentElement,
              tw = tr.offsetWidth || 280,
              to = 18,
              rr = (1 - pct) * (tw - to) + to / 2;
            tl2.style.left = "auto";
            tl2.style.right = Math.min(Math.max(to / 2, rr), tw - to / 2) + "px";
            tl2.style.display = "flex";
          });
          sliderTrack.addEventListener("mouseleave", function () {
            if (tl2.dataset.dragging === "true") return;
            tl2.style.display = "none";
          });
        }
        /* === RECITER MODAL === */
        var rw = document.querySelector(".custom-reciter-wrapper");
        if (rw) {
          var ri = rw.querySelector("#reciterSearchInput"),
            ol = rw.querySelector("#reciterOptionsList"),
            rc = document.getElementById("reciterModalClose");
          function showReciterModal() {
            rw.classList.add("active");
            setTimeout(function () {
              if (ri) {
                var rbn = document.getElementById("reciterBarName");
                ri.value = rbn ? rbn.textContent : "";
                populateCustomReciterList(ri.value);
                ri.focus();
              }
              if (ol) ol.classList.add("show");
            }, 80);
          }
          function hideReciterModal() {
            rw.classList.remove("active");
            if (ol) ol.classList.remove("show");
          }
          if (ri) {
            var pb = document.getElementById("playPauseBtn");
            if (pb)
              pb.addEventListener("click", function (e) {
                e.stopPropagation();
              });
            document.getElementById("reciterBar") &&
              document
                .getElementById("reciterBar")
                .addEventListener("click", function (e) {
                  if (e.target.closest(".play-btn")) return;
                  showReciterModal();
                });
            rw.addEventListener("click", function (e) {
              if (e.target === rw) hideReciterModal();
            });
            if (rc)
              rc.addEventListener("click", function (e) {
                e.stopPropagation();
                hideReciterModal();
              });
            if (ol)
              ol.addEventListener("click", function () {
                hideReciterModal();
              });
          }
        }
        /* === RECITER NAME FIT (name+arrow are one element, shrink together) === */
        function fitReciterName() {
          var bar = document.getElementById("reciterBar");
          var name = document.getElementById("reciterBarName");
          var info = bar && bar.querySelector(".reciter-bar-info");
          if (!bar || !name || !info) return;
          name.style.fontSize = "";
          var barCs = getComputedStyle(bar);
          var innerW =
            bar.clientWidth -
            (parseFloat(barCs.paddingLeft) || 0) -
            (parseFloat(barCs.paddingRight) || 0);
          var play = bar.querySelector(".play-btn");
          var playW = play ? play.getBoundingClientRect().width : 44;
          var avail = innerW - playW - 14;
          var w = name.scrollWidth;
          if (w > avail && w > 0) {
            var fs = Math.max(0.5, 0.72 * (avail / w));
            name.style.fontSize = fs.toFixed(3) + "rem";
          }
        }
        var _raf = null;
        function fitReciterNameSoon() {
          if (_raf) cancelAnimationFrame(_raf);
          _raf = requestAnimationFrame(fitReciterName);
        }
        window.addEventListener("resize", fitReciterNameSoon);
        window.addEventListener("load", fitReciterNameSoon);
        if (document.fonts && document.fonts.ready) {
          document.fonts.ready.then(fitReciterNameSoon);
        }
        var _rbn = document.getElementById("reciterBarName");
        if (_rbn) {
          new MutationObserver(fitReciterNameSoon).observe(_rbn, {
            childList: true,
            characterData: true,
            subtree: true,
          });
        }
        fitReciterNameSoon();
        /* === INIT === */
        loadInitial();
        loadReciters();
        setupReciterSearch();
        setTimeout(function () {
          var pl = document.getElementById("page-loader");
          if (pl) pl.classList.add("hidden");
        }, 6000);
      })();
      document
        .getElementById("navModeToggle")
        .addEventListener("click", function (e) {
          e.stopPropagation();
          togglePageMode();
        });
      var navBtn = document.getElementById("navModeToggle"),
        navTl = document.getElementById("navModeTooltip");
      if (navBtn && navTl) {
        navBtn.addEventListener("mouseenter", function () {
          navTl.classList.add("show");
          clearTimeout(navTl._timeout);
        });
        navBtn.addEventListener("mouseleave", function () {
          navTl._timeout = setTimeout(function () {
            navTl.classList.remove("show");
          }, 300);
        });
        navBtn.addEventListener("touchstart", function (e) {
          e.stopPropagation();
          navTl.classList.add("show");
          clearTimeout(navTl._timeout);
          navTl._timeout = setTimeout(function () {
            navTl.classList.remove("show");
          }, 1800);
        });
      }
      isPageMode = loadPageModePreference();
      // Default to the single-page (swipe) gallery so the 3-page windowed view
      // is automatic on every screen size without pressing any button.
      if (localStorage.getItem(PAGE_MODE_KEY) === null) isPageMode = true;
      window.addEventListener("load", function () {
        applyPageMode();
        updateToggleButtonUI();
      });
      window.addEventListener("online", function () {
        var el = document.getElementById("offlineNotice");
        if (el) el.style.display = "none";
      });
      window.addEventListener("offline", function () {
        var el = document.getElementById("offlineNotice");
        if (el) el.style.display = "block";
      });
