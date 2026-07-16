      var surahNames = [
        "الفاتحة",
        "البقرة",
        "آل عمران",
        "النساء",
        "المائدة",
        "الأنعام",
        "الأعراف",
        "الأنفال",
        "التوبة",
        "يونس",
        "هود",
        "يوسف",
        "الرعد",
        "إبراهيم",
        "الحجر",
        "النحل",
        "الإسراء",
        "الكهف",
        "مريم",
        "طه",
        "الأنبياء",
        "الحج",
        "المؤمنون",
        "النور",
        "الفرقان",
        "الشعراء",
        "النمل",
        "القصص",
        "العنكبوت",
        "الروم",
        "لقمان",
        "السجدة",
        "الأحزاب",
        "سبأ",
        "فاطر",
        "يس",
        "الصافات",
        "ص",
        "الزمر",
        "غافر",
        "فصلت",
        "الشورى",
        "الزخرف",
        "الدخان",
        "الجاثية",
        "الأحقاف",
        "محمد",
        "الفتح",
        "الحجرات",
        "ق",
        "الذاريات",
        "الطور",
        "النجم",
        "القمر",
        "الرحمن",
        "الواقعة",
        "الحديد",
        "المجادلة",
        "الحشر",
        "الممتحنة",
        "الصف",
        "الجمعة",
        "المنافقون",
        "التغابن",
        "الطلاق",
        "التحريم",
        "الملك",
        "القلم",
        "الحاقة",
        "المعارج",
        "نوح",
        "الجن",
        "المزمل",
        "المدثر",
        "القيامة",
        "الإنسان",
        "المرسلات",
        "النبأ",
        "النازعات",
        "عبس",
        "التكوير",
        "الانفطار",
        "المطففين",
        "الانشقاق",
        "البروج",
        "الطارق",
        "الأعلى",
        "الغاشية",
        "الفجر",
        "البلد",
        "الشمس",
        "الليل",
        "الضحى",
        "الشرح",
        "التين",
        "العلق",
        "القدر",
        "البينة",
        "الزلزلة",
        "العاديات",
        "القارعة",
        "التكاثر",
        "العصر",
        "الهمزة",
        "الفيل",
        "قريش",
        "الماعون",
        "الكوثر",
        "الكافرون",
        "النصر",
        "المسد",
        "الإخلاص",
        "الفلق",
        "الناس",
      ];
      var surahPages = [
        1, 2, 50, 77, 106, 128, 151, 177, 187, 208, 221, 235, 249, 255, 262,
        267, 282, 293, 305, 312, 322, 332, 342, 350, 359, 367, 377, 385, 396,
        404, 411, 415, 418, 428, 434, 440, 446, 453, 458, 467, 477, 483, 489,
        496, 499, 507, 511, 515, 518, 520, 523, 526, 528, 531, 534, 537, 541,
        544, 547, 549, 551, 553, 555, 558, 560, 562, 564, 566, 568, 570, 572,
        574, 575, 577, 578, 580, 582, 583, 585, 586, 587, 589, 590, 591, 592,
        593, 594, 595, 596, 597, 598, 599, 600, 601, 602, 603, 604,
      ];
      function getSurahName(n) {
        return surahNames[n - 1] || "";
      }
      let isQuranOnlyMode = false,
        isPageMode = false,
        currentPageIndex = 0;
      const TOTAL_PAGES = 604,
        MARKERS_STORAGE_KEY = "quran-markers-data",
        PAGE_MODE_KEY = "quran-page-mode";
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
      function getMarkerType(surah, ayah) {
        var m = getStoredMarkers(),
          key = surah + ":" + ayah;
        if (m.red.includes(key)) return "red";
        if (m.green.includes(key)) return "green";
        return null;
      }
      function applyStoredMarkersToElement(el) {
        var s = parseInt(el.dataset.surah),
          a = parseInt(el.dataset.ayah);
        if (!s || !a) return;
        var t = getMarkerType(s, a);
        el.classList.remove("red-marker", "green-marker");
        if (t === "red") el.classList.add("red-marker");
        else if (t === "green") el.classList.add("green-marker");
      }
      function applyAllStoredMarkers() {
        document.querySelectorAll(".ayah").forEach(function (el) {
          applyStoredMarkersToElement(el);
        });
      }
      function toggleQuranOnlyMode() {
        isQuranOnlyMode = !isQuranOnlyMode;
        document.body.classList.toggle("quran-only", isQuranOnlyMode);
        if (isQuranOnlyMode) closeAll();
      }
      document.body.addEventListener("click", function (e) {
        if (
          e.target.closest(
            ".page, #contextMenu, #navModeToggle, #navModeTooltip",
          )
        )
          return;
        if (
          !isQuranOnlyMode &&
          e.target.closest(
            "button, select, input, a, .reciter-option, .menu-item, #side-menu, #links-menu, .surah-item, .reciter-bar, .main-header, #overlay",
          )
        )
          return;
        if (e.target.matches("body, .container, #verses"))
          toggleQuranOnlyMode();
      });
      function applyPageMode() {
        document.body.classList.toggle("page-mode", isPageMode);
        var nav = document.getElementById("quranPageNav");
        if (nav) nav.style.display = isPageMode ? "flex" : "none";
        if (isPageMode) {
          var pages = document.querySelectorAll(".page");
          if (pages.length) {
            if (currentPageIndex >= pages.length) currentPageIndex = 0;
            activatePage(currentPageIndex);
            updatePageIndicator();
          }
        } else
          document.querySelectorAll(".page").forEach(function (p) {
            p.classList.remove("active-page");
          });
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
        if (!btn || !tl) return;
        if (isPageMode) {
          btn.innerHTML = '<i class="fa-solid fa-book-open"></i>';
          btn.title = "التبديل إلى وضع التمرير";
          tl.textContent = "📖 وضع الصفحة الواحدة";
        } else {
          btn.innerHTML = '<i class="fa-solid fa-arrows-up-down"></i>';
          btn.title = "التبديل إلى وضع الصفحة الواحدة";
          tl.textContent = "📜 وضع التمرير";
        }
        tl.classList.add("show");
        clearTimeout(tl._timeout);
        tl._timeout = setTimeout(function () {
          tl.classList.remove("show");
        }, 1800);
      }
      window.changeQuranPage = function (delta) {
        if (!isPageMode) return;
        var pages = document.querySelectorAll(".page");
        if (!pages.length) return;
        var ni = currentPageIndex + delta;
        if (ni < 0) return;
        function scrollToActive() {
          var a = document.querySelector(".page.active-page");
          if (a) a.scrollIntoView({ behavior: "smooth", block: "start" });
        }
        if (ni >= pages.length) {
          var lp = parseInt(pages[pages.length - 1].dataset.page) || 0;
          if (lp < TOTAL_PAGES) {
            loadMorePages().then(function () {
              var up = document.querySelectorAll(".page");
              if (up.length > pages.length && pages.length < up.length) {
                currentPageIndex = pages.length;
                activatePage(currentPageIndex);
                updatePageIndicator();
                scrollToActive();
              }
            });
            return;
          }
          return;
        }
        currentPageIndex = ni;
        activatePage(currentPageIndex);
        updatePageIndicator();
        scrollToActive();
      };
      function activatePage(index) {
        document.querySelectorAll(".page").forEach(function (p) {
          p.classList.remove("active-page");
        });
        var pages = document.querySelectorAll(".page");
        if (pages[index]) pages[index].classList.add("active-page");
      }
      function updatePageIndicator() {
        var ind = document.getElementById("quranPageIndicator"),
          pb = document.getElementById("prevPageBtn"),
          nb = document.getElementById("nextPageBtn"),
          pages = document.querySelectorAll(".page");
        if (!pages.length) return;
        var cn = pages[currentPageIndex];
        var cp = cn ? cn.dataset.page : "?";
        if (ind) ind.textContent = "صفحة " + cp;
        if (pb) pb.disabled = currentPageIndex <= 0;
        if (nb) {
          var lp = parseInt(pages[pages.length - 1]?.dataset.page) || 0;
          nb.disabled =
            currentPageIndex >= pages.length - 1 && lp >= TOTAL_PAGES;
        }
      }
      function afterPagesAdded() {
        if (isPageMode) {
          updatePageIndicator();
          if (
            !document.querySelector(".page.active-page") &&
            document.querySelectorAll(".page").length > 0
          ) {
            currentPageIndex = 0;
            activatePage(0);
          }
        }
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
        if (m.style[prop] === "0px") {
          m.style[prop] = "-100%";
          ov.style.display = "none";
        } else {
          m.style[prop] = "0px";
          ov.style.display = "block";
          document.getElementById(closeId).style[closeProp] = "-100%";
        }
      }
      function toggleSurah() {
        toggleMenu("side-menu", "right", "links-menu", "left");
      }
      function toggleLinks() {
        toggleMenu("links-menu", "left", "side-menu", "right");
      }
      function closeAll() {
        document.getElementById("side-menu").style.right = "-100%";
        document.getElementById("links-menu").style.left = "-100%";
        document.getElementById("overlay").style.display = "none";
        document.getElementById("contextMenu").style.display = "none";
      }
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
          var el = document.getElementById("ayah-" + surah + "-" + ayah);
          if (el) {
            el.classList.add("playing");
            el.scrollIntoView({ behavior: "smooth", block: "center" });
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
        async function getCachedAudioWithProgress(url, onProgress) {
          try {
            var cache = await caches.open(CACHE_NAME),
              cached = await cache.match(url);
            if (cached) {
              if (onProgress) onProgress(100);
              return URL.createObjectURL(await cached.blob());
            }
            var resp = await fetch(url);
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
            ps = document.getElementById("loadingPercent");
          if (l) {
            if (show) {
              l.style.display = "flex";
              if (ps) ps.innerText = pct + "%";
            } else l.style.display = "none";
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
          try {
            var ok = await loadSurahTimings(surah);
            if (!ok || !curAudioUrl)
              throw new Error("التلاوة غير متوفرة لهذا القارئ");
            stopTracking();
            var blobUrl = await getCachedAudioWithProgress(
              curAudioUrl,
              updateLoadingProgress,
            );
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
            alert(
              isTest
                ? "فشل تحميل التلاوة التجريبية."
                : "حدث خطأ أثناء التشغيل.",
            );
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
              selEl.classList.remove(c + "-marker");
              removeMarker(s, a);
            } else {
              document
                .querySelectorAll(".ayah." + c + "-marker")
                .forEach(function (el) {
                  el.classList.remove(c + "-marker");
                });
              selEl.classList.remove(o + "-marker");
              selEl.classList.add(c + "-marker");
              addMarker(c, s, a);
            }
            closeAll();
          };
        };
        window.toggleRedMarker = markerColor("red");
        window.toggleGreenMarker = markerColor("green");
        async function loadPage(pageNum) {
          var url =
              "https://api.alquran.cloud/v1/page/" + pageNum + "/quran-uthmani",
            offEl = document.getElementById("offlineNotice"),
            res;
          try {
            res = await fetch(url);
            if (!res.ok) throw new Error("HTTP " + res.status);
            if (offEl) offEl.style.display = "none";
            caches
              .open(SURAH_CACHE)
              .then(function (c) {
                c.put(url, res.clone());
              })
              .catch(function () {});
          } catch (e) {
            try {
              var cache = await caches.open(SURAH_CACHE),
                cached = await cache.match(url);
              if (cached && cached.ok) {
                res = cached;
                if (offEl) offEl.style.display = "block";
              } else throw e;
            } catch (_) {
              if (offEl) offEl.style.display = "block";
              throw e;
            }
          }
          var data = await res.json(),
            html = '<div class="page" data-page="' + pageNum + '">',
            ayahs = data.data.ayahs;
          if (!ayahs.length) return;
          var firstSurahId = ayahs[0].surah.number;
          if (lastSurah !== null && firstSurahId === lastSurah)
            html +=
              '<div class="surah-corner">' +
              getSurahName(firstSurahId) +
              "</div>";
          var lastSurahInPage = null;
          for (var a of ayahs) {
            var sNum = a.surah.number,
              ayNum = a.numberInSurah;
            if (lastSurahInPage !== sNum) {
              if (lastSurah !== sNum)
                html +=
                  '<div class="surah-header">سورة ' +
                  getSurahName(sNum) +
                  "</div>";
              if (ayNum === 1 && sNum !== 9 && sNum !== 1)
                html +=
                  '<div class="basmala">بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ</div>';
              lastSurahInPage = sNum;
            }
            var dt = a.text;
            if (sNum === 1 && ayNum === 1)
              dt = "بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ";
            else if (ayNum === 1 && sNum !== 9) dt = stripBasmala(a.text);
            html +=
              '<div class="ayah" data-surah="' +
              sNum +
              '" data-ayah="' +
              ayNum +
              '" id="ayah-' +
              sNum +
              "-" +
              ayNum +
              '">' +
              dt +
              ' <span class="num">(' +
              ayNum +
              ")</span></div>";
          }
          lastSurah = lastSurahInPage;
          html += '<div class="page-number-bottom">' + pageNum + "</div></div>";
          disp.insertAdjacentHTML("beforeend", html);
          setTimeout(applyAllStoredMarkers, 100);
        }
        async function cachePageOnly(pageNum) {
          var url =
            "https://api.alquran.cloud/v1/page/" + pageNum + "/quran-uthmani";
          try {
            var cache = await caches.open(SURAH_CACHE),
              existing = await cache.match(url);
            if (!existing) {
              var res = await fetch(url);
              if (res.ok) cache.put(url, res.clone());
            }
          } catch (_) {}
        }
        function manageVisiblePages() {
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
          lastSurah = null;
          cp = 1;
          await loadPages(Math.min(5, TOTAL_PAGES));
          updateButtonText();
          applyAllStoredMarkers();
          afterPagesAdded();
          setupVirtualScroll();
          manageVisiblePages();
          backgroundCachePages();
        }
        function backgroundCachePages() {
          var pg = 1,
            busy = false;
          function tryNext() {
            if (busy || pg > TOTAL_PAGES) return;
            busy = true;
            var pageNum = pg++,
              url =
                "https://api.alquran.cloud/v1/page/" +
                pageNum +
                "/quran-uthmani";
            caches.open(SURAH_CACHE).then(function (cache) {
              cache.match(url).then(function (ex) {
                if (ex) {
                  busy = false;
                  setTimeout(tryNext, 500);
                  return;
                }
                var controller = new AbortController(),
                  tid = setTimeout(function () {
                    controller.abort();
                    busy = false;
                    setTimeout(tryNext, 5000);
                  }, 10000);
                fetch(url, { signal: controller.signal })
                  .then(function (r) {
                    clearTimeout(tid);
                    if (r.ok) cache.put(url, r.clone());
                    busy = false;
                    setTimeout(tryNext, 3500);
                  })
                  .catch(function () {
                    clearTimeout(tid);
                    busy = false;
                    setTimeout(tryNext, 8000);
                  });
              });
            });
          }
          setTimeout(tryNext, 5000);
        }
        window.loadMorePages = loadMorePages;
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
        async function cacheFetch(url, cache) {
          try {
            var r = await fetch(url);
            if (r.ok) await cache.put(url, r.clone());
          } catch (_) {}
        }
        async function downloadSurah(idx, reciterInfo) {
          if (surahDownloadState[idx] === "progress") return;
          var range = getSurahPageRange(idx),
            surahNum = idx + 1;
          surahDownloadState[idx] = "progress";
          await updateDownloadBtn(idx);
          var info = reciterInfo || getSelectedReciterInfo();
          try {
            var cache = await caches.open(SURAH_CACHE);
            for (var p = range.start; p <= range.end; p++) {
              var url =
                  "https://api.alquran.cloud/v1/page/" + p + "/quran-uthmani",
                res = await fetch(url);
              if (res.ok) cache.put(url, res.clone());
            }
            if (info) {
              var padded = String(surahNum).padStart(3, "0"),
                audioCache = await caches.open("quran-audio-v1");
              if (info.source === "custom") {
                await cacheFetch(
                  "https://cdn.mualim.app/muhammad-al-luhaidan-murattal/" +
                    padded +
                    ".opus",
                  audioCache,
                );
                await cacheFetch(
                  "https://cdn.mualim.app/muhammad-al-luhaidan-murattal/" +
                    padded +
                    ".pb",
                  cache,
                );
              } else if (info.source === "mp3quran" && info.folder_url)
                await cacheFetch(info.folder_url + padded + ".mp3", audioCache);
              else if (info.source === "quran") {
                try {
                  var r2 = await fetch(
                      "https://api.quran.com/api/v4/chapter_recitations/" +
                        info.id +
                        "/" +
                        surahNum +
                        "?segments=true",
                    ),
                    d2 = await r2.json();
                  if (d2.audio_file && d2.audio_file.audio_url)
                    await cacheFetch(d2.audio_file.audio_url, audioCache);
                } catch (_) {}
              }
            }
            surahDownloadState[idx] = "done";
            saveDownloadState(idx, "done");
          } catch (e) {
            surahDownloadState[idx] = null;
            saveDownloadState(idx, null);
          }
          await updateDownloadBtn(idx);
        }
        var slDiv = document.getElementById("surah-list");
        surahNames.forEach(function (name, idx) {
          var div = document.createElement("div");
          div.className = "surah-item";
          div.id = "surah-" + idx;
          div.innerHTML =
            '<div><i class="fa-solid fa-book-open"></i></div><div>' +
            (idx + 1) +
            ". " +
            name +
            '</div><button class="dl-btn" data-idx="' +
            idx +
            '" title="تحميل السورة للاستخدام دون اتصال"><i class="fa-solid fa-download"></i></button>';
          div.onclick = function (e) {
            if (!e.target.closest(".dl-btn")) goToSurah(idx);
          };
          slDiv.appendChild(div);
        });
        document.querySelectorAll(".dl-btn").forEach(function (b) {
          b.addEventListener("click", function (e) {
            e.stopPropagation();
            downloadSurah(parseInt(b.dataset.idx));
          });
        });
        loadDownloadState();
        rs.addEventListener("change", function () {
          for (var i = 0; i < 114; i++) surahDownloadState[i] = null;
          loadDownloadState();
          var rbn = document.getElementById("reciterBarName");
          if (rbn)
            rbn.textContent =
              rs.options[rs.selectedIndex]?.textContent || "اختر القارئ";
        });
        window.goToSurah = async function (idx) {
          stopTracking();
          var pg = surahPages[idx];
          if (pg < 1) pg = 1;
          disp.innerHTML = "";
          cp = pg;
          lastSurah = null;
          await loadPages(Math.min(5, TOTAL_PAGES - cp + 1));
          try {
            localStorage.setItem("quranLoadedPages", String(cp - 1));
          } catch (_) {}
          updateButtonText();
          applyAllStoredMarkers();
          afterPagesAdded();
          closeAll();
          document.querySelectorAll(".surah-item").forEach(function (el) {
            el.classList.remove("active");
          });
          document.getElementById("surah-" + idx).classList.add("active");
          var fp = document.querySelector(".page");
          if (fp) fp.scrollIntoView({ behavior: "smooth", block: "start" });
        };
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
          var ayah = e.target.closest(".ayah");
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
          var ayah = e.target.closest(".ayah");
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
        /* === SLIDER === */
        var rs2 = document.getElementById("pageRangeSlider"),
          ind2 = document.getElementById("quranPageIndicator"),
          sf2 = document.getElementById("pageSliderFill"),
          tl2 = document.getElementById("pageSliderTooltip"),
          tpn2 = document.getElementById("tooltipPageNum"),
          tsn2 = document.getElementById("tooltipSurahName");
        function setSliderFill(v) {
          if (sf2) sf2.style.width = ((v - 1) / 603) * 100 + "%";
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
              ll = pct * (tw - to) + to / 2;
            tl2.style.left = Math.min(Math.max(to / 2, ll), tw - to / 2) + "px";
            tl2.style.display = "flex";
          }
        });
        rs2.addEventListener("change", function () {
          var tp = parseInt(this.value),
            pp = document.querySelectorAll(".page"),
            fd = false;
          for (var i = 0; i < pp.length; i++) {
            if (parseInt(pp[i].dataset.page) === tp) {
              if (typeof activatePage === "function") {
                currentPageIndex = i;
                activatePage(i);
                updatePageIndicator();
              }
              fd = true;
              break;
            }
          }
          if (!fd) {
            var cp2 = document.querySelector(".page.active-page");
            if (cp2) this.value = parseInt(cp2.dataset.page);
            else this.value = 1;
            setSliderFill(parseInt(this.value));
          }
          if (tl2) tl2.style.display = "none";
        });
        rs2.addEventListener("blur", function () {
          if (tl2) tl2.style.display = "none";
        });
        /* === RECITER MODAL === */
        var rw = document.querySelector(".custom-reciter-wrapper");
        if (rw) {
          var ri = rw.querySelector("#reciterSearchInput"),
            ol = rw.querySelector("#reciterOptionsList"),
            rc = document.getElementById("reciterModalClose");
          function showReciterModal() {
            rw.classList.add("active");
            setTimeout(function () {
              if (ri) ri.focus();
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
        /* === INIT === */
        loadInitial();
        loadReciters();
        setupReciterSearch();
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
      window.addEventListener("load", function () {
        applyPageMode();
        updateToggleButtonUI();
      });
