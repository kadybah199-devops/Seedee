/* Seedee — interactions du site.
   Quand le visiteur clique sur « Envoyer sur WhatsApp », sa demande
   est aussi enregistrée (nom, téléphone, bien, mission) pour que
   Seedee puisse la retrouver sur sa page privée. Rien ne s'envoie
   sans ce clic, et un échec d'enregistrement n'empêche jamais
   WhatsApp de s'ouvrir. */
(function () {
  "use strict";

  /* ---------- Révélation au défilement ---------- */
  var revealEls = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window) {
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    revealEls.forEach(function (el) { observer.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add("visible"); });
  }

  /* ---------- Ombre de la barre supérieure au défilement ---------- */
  var topbar = document.getElementById("topbar");
  function onScroll() {
    if (topbar) topbar.classList.toggle("scrolled", window.scrollY > 8);
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* ---------- Onglets du rapport ---------- */
  var tabs = document.querySelectorAll(".tab");
  var reportTerrain = document.getElementById("report-terrain");
  var reportChantier = document.getElementById("report-chantier");
  var budgetFill = document.getElementById("budget-fill");
  var budgetPct = document.getElementById("budget-pct");

  function animateBudget() {
    if (!budgetFill) return;
    budgetFill.style.width = "0%";
    setTimeout(function () { budgetFill.style.width = "41%"; }, 120);
    if (!budgetPct) return;
    var reduceMotion = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduceMotion || !window.requestAnimationFrame) {
      budgetPct.textContent = "41";
      return;
    }
    var start = null;
    var duration = 900;
    function step(timestamp) {
      if (start === null) start = timestamp;
      var progress = Math.min((timestamp - start) / duration, 1);
      budgetPct.textContent = String(Math.round(41 * progress));
      if (progress < 1) window.requestAnimationFrame(step);
    }
    window.requestAnimationFrame(step);
  }

  tabs.forEach(function (tab) {
    tab.addEventListener("click", function () {
      tabs.forEach(function (t) {
        t.classList.remove("active");
        t.setAttribute("aria-selected", "false");
      });
      tab.classList.add("active");
      tab.setAttribute("aria-selected", "true");
      var showChantier = tab.dataset.tab === "chantier";
      if (reportTerrain) reportTerrain.classList.toggle("hidden", showChantier);
      if (reportChantier) reportChantier.classList.toggle("hidden", !showChantier);
      if (showChantier) animateBudget();
    });
  });

  /* ---------- Jalons du chantier ---------- */
  var milestoneData = {
    fondation: {
      title: "Fondation — terminé le 28 oct. 2026",
      lines: [
        "Fouilles et béton armé conformes au plan.",
        "12 photos envoyées, dont les ferrailles avant coulage.",
        "Dépensé sur ce jalon : 3 100 $ (prévu : 3 200 $)."
      ]
    },
    elevation: {
      title: "Élévation — en cours (visite du 14 nov. 2026)",
      lines: [
        "Murs du rez-de-chaussée terminés, premier étage en cours.",
        "8 photos envoyées, dont les chaînages et les ouvertures.",
        "Dépensé sur ce jalon : 4 300 $ sur 5 500 $ prévus."
      ]
    },
    toiture: {
      title: "Toiture — à venir",
      lines: [
        "Démarrage prévu après la fin de l'élévation.",
        "Budget prévu : 4 800 $ (charpente + tôles).",
        "Le paiement de ce jalon sera validé après la visite de contrôle."
      ]
    },
    finitions: {
      title: "Finitions — à venir",
      lines: [
        "Enduit, peinture, menuiserie et sols.",
        "Budget prévu : 4 500 $.",
        "Réception finale avec photos détaillées de chaque pièce."
      ]
    }
  };

  var detailBox = document.getElementById("milestone-detail");
  var milestoneBtns = document.querySelectorAll(".milestone");

  function showMilestone(key) {
    var data = milestoneData[key];
    if (!data || !detailBox) return;
    var html = "<p><strong>" + data.title + "</strong></p>";
    data.lines.forEach(function (line) {
      html += "<p>— " + line + "</p>";
    });
    detailBox.innerHTML = html;
    detailBox.classList.remove("swap");
    void detailBox.offsetWidth; /* relance l'animation */
    detailBox.classList.add("swap");
    milestoneBtns.forEach(function (btn) {
      btn.classList.toggle("active", btn.dataset.milestone === key);
    });
  }

  milestoneBtns.forEach(function (btn) {
    btn.addEventListener("click", function () {
      showMilestone(btn.dataset.milestone);
    });
  });
  showMilestone("elevation");

  /* ---------- Cartes « Pourquoi Seedee ? » (accordéon) ---------- */
  var whyCards = document.querySelectorAll(".why-card");
  whyCards.forEach(function (card) {
    var head = card.querySelector(".why-head");
    if (!head) return;
    head.addEventListener("click", function () {
      var isOpen = card.classList.contains("open");
      whyCards.forEach(function (other) {
        other.classList.remove("open");
        var otherHead = other.querySelector(".why-head");
        if (otherHead) otherHead.setAttribute("aria-expanded", "false");
      });
      if (!isOpen) {
        card.classList.add("open");
        head.setAttribute("aria-expanded", "true");
      }
    });
  });

  /* ---------- Comparaison « Sans / Avec Seedee » ---------- */
  var compareBtns = document.querySelectorAll(".compare-btn");
  var panelSans = document.getElementById("compare-sans");
  var panelAvec = document.getElementById("compare-avec");
  compareBtns.forEach(function (btn) {
    btn.addEventListener("click", function () {
      compareBtns.forEach(function (b) {
        b.classList.remove("active");
        b.setAttribute("aria-selected", "false");
      });
      btn.classList.add("active");
      btn.setAttribute("aria-selected", "true");
      var showAvec = btn.dataset.compare === "avec";
      if (panelSans) panelSans.classList.toggle("hidden", showAvec);
      if (panelAvec) panelAvec.classList.toggle("hidden", !showAvec);
    });
  });

  /* ---------- Visionneuse photo (lightbox) ---------- */
  var lightbox = document.getElementById("lightbox");
  var lightboxImg = document.getElementById("lightbox-img");
  var lightboxCaption = document.getElementById("lightbox-caption");
  var lightboxPhotos = [];
  var lightboxIndex = 0;

  function showLightboxPhoto(index) {
    if (!lightboxPhotos.length) return;
    lightboxIndex = (index + lightboxPhotos.length) % lightboxPhotos.length;
    var photo = lightboxPhotos[lightboxIndex];
    lightboxImg.src = photo.src;
    lightboxImg.alt = photo.alt;
    lightboxCaption.textContent = photo.caption;
  }

  function openLightbox(index) {
    if (!lightbox) return;
    showLightboxPhoto(index);
    lightbox.classList.add("open");
    document.body.style.overflow = "hidden";
  }

  function closeLightbox() {
    if (!lightbox) return;
    lightbox.classList.remove("open");
    document.body.style.overflow = "";
  }

  document.querySelectorAll("[data-lightbox]").forEach(function (frame) {
    var img = frame.querySelector("img");
    if (!img) return;
    var idx = lightboxPhotos.length;
    lightboxPhotos.push({
      src: img.src,
      alt: img.alt,
      caption: frame.getAttribute("data-caption") || img.alt
    });
    frame.addEventListener("click", function () { openLightbox(idx); });
    frame.addEventListener("keydown", function (e) {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        openLightbox(idx);
      }
    });
  });

  var lightboxClose = document.getElementById("lightbox-close");
  if (lightboxClose) lightboxClose.addEventListener("click", closeLightbox);
  var lightboxPrev = document.getElementById("lightbox-prev");
  if (lightboxPrev) lightboxPrev.addEventListener("click", function (e) {
    e.stopPropagation();
    showLightboxPhoto(lightboxIndex - 1);
  });
  var lightboxNext = document.getElementById("lightbox-next");
  if (lightboxNext) lightboxNext.addEventListener("click", function (e) {
    e.stopPropagation();
    showLightboxPhoto(lightboxIndex + 1);
  });
  if (lightbox) {
    lightbox.addEventListener("click", function (e) {
      if (e.target === lightbox) closeLightbox();
    });
  }
  document.addEventListener("keydown", function (e) {
    if (!lightbox || !lightbox.classList.contains("open")) return;
    if (e.key === "Escape") closeLightbox();
    else if (e.key === "ArrowLeft") showLightboxPhoto(lightboxIndex - 1);
    else if (e.key === "ArrowRight") showLightboxPhoto(lightboxIndex + 1);
  });

  /* ---------- Carrousel photos ---------- */
  var carousel = document.getElementById("photo-carousel");
  var track = document.getElementById("carousel-track");
  if (carousel && track) {
    var slides = track.querySelectorAll(".photo-card");
    var dotsBox = document.getElementById("carousel-dots");
    var prevBtn = document.getElementById("carousel-prev");
    var nextBtn = document.getElementById("carousel-next");
    var current = 0;
    var timer = null;
    var carouselVisible = true;
    var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    var dots = [];

    slides.forEach(function (_, i) {
      var dot = document.createElement("button");
      dot.className = "carousel-dot";
      dot.type = "button";
      dot.setAttribute("aria-label", "Photo " + (i + 1));
      dot.addEventListener("click", function () { goTo(i); restartAuto(); });
      dotsBox.appendChild(dot);
      dots.push(dot);
    });

    function goTo(i) {
      current = (i + slides.length) % slides.length;
      track.style.transform = "translateX(-" + (current * 100) + "%)";
      dots.forEach(function (d, j) { d.classList.toggle("active", j === current); });
      slides.forEach(function (slide, j) {
        slide.setAttribute("aria-hidden", j === current ? "false" : "true");
        var frame = slide.querySelector(".photo-frame");
        if (frame) frame.setAttribute("tabindex", j === current ? "0" : "-1");
      });
    }
    function nextSlide() { goTo(current + 1); }
    function prevSlide() { goTo(current - 1); }
    function startAuto() {
      if (reduceMotion || timer) return;
      timer = setInterval(function () { if (carouselVisible) nextSlide(); }, 4500);
    }
    function stopAuto() {
      if (timer) { clearInterval(timer); timer = null; }
    }
    function restartAuto() { stopAuto(); startAuto(); }

    if (prevBtn) prevBtn.addEventListener("click", function () { prevSlide(); restartAuto(); });
    if (nextBtn) nextBtn.addEventListener("click", function () { nextSlide(); restartAuto(); });

    carousel.addEventListener("mouseenter", stopAuto);
    carousel.addEventListener("mouseleave", startAuto);

    var touchX = null;
    var justSwiped = false;
    carousel.addEventListener("touchstart", function (e) {
      stopAuto();
      touchX = e.changedTouches[0].clientX;
    }, { passive: true });
    carousel.addEventListener("touchend", function (e) {
      if (touchX === null) { startAuto(); return; }
      var dx = e.changedTouches[0].clientX - touchX;
      if (Math.abs(dx) > 40) {
        justSwiped = true;
        if (dx < 0) nextSlide(); else prevSlide();
      }
      touchX = null;
      restartAuto();
    }, { passive: true });
    /* Un balayage ne doit pas ouvrir la visionneuse */
    carousel.addEventListener("click", function (e) {
      if (justSwiped) { e.preventDefault(); e.stopPropagation(); justSwiped = false; }
    }, true);

    if ("IntersectionObserver" in window) {
      new IntersectionObserver(function (entries) {
        carouselVisible = entries[0].isIntersecting;
      }, { threshold: 0.3 }).observe(carousel);
    }

    goTo(0);
    startAuto();
  }

  /* ---------- Quiz : votre achat est-il risqué ? ---------- */
  var quizStep = document.getElementById("quiz-step");
  var quizProgress = document.getElementById("quiz-progress");
  var quizFill = document.getElementById("quiz-fill");
  if (quizStep && quizProgress && quizFill) {
    var quizQuestions = [
      { q: "Le vendeur est-il un proche ou quelqu'un que vous connaissez bien ?",
        answers: [{ t: "Oui", pts: 0 }, { t: "Non", pts: 1 }, { t: "Je ne sais pas", pts: 1 }] },
      { q: "Avez-vous vu le titre foncier original ?",
        answers: [{ t: "Oui", pts: 0 }, { t: "Non", pts: 1 }, { t: "Pas encore", pts: 1 }] },
      { q: "Le terrain est-il borné aux 4 coins ?",
        answers: [{ t: "Oui", pts: 0 }, { t: "Non", pts: 1 }, { t: "Je ne sais pas", pts: 1 }] },
      { q: "Avez-vous déjà visité le terrain ou la maison vous-même ?",
        answers: [{ t: "Oui", pts: 0 }, { t: "Non", pts: 1 }] }
    ];
    var quizIndex = 0;
    var quizScore = 0;

    function showQuestion(i) {
      var item = quizQuestions[i];
      quizProgress.textContent = "Question " + (i + 1) + " sur " + quizQuestions.length;
      quizFill.style.width = ((i / quizQuestions.length) * 100) + "%";
      var html = '<p class="quiz-q">' + item.q + '</p><div class="quiz-answers">';
      item.answers.forEach(function (a) {
        html += '<button type="button" class="btn btn-quiz" data-pts="' + a.pts + '">' + a.t + '</button>';
      });
      html += '</div>';
      quizStep.innerHTML = html;
      quizStep.classList.remove("swap");
      void quizStep.offsetWidth; /* relance l'animation */
      quizStep.classList.add("swap");
      quizStep.querySelectorAll(".btn-quiz").forEach(function (btn) {
        btn.addEventListener("click", function () {
          quizScore += parseInt(btn.getAttribute("data-pts"), 10);
          quizIndex++;
          if (quizIndex < quizQuestions.length) showQuestion(quizIndex);
          else showResult();
        });
      });
    }

    function showResult() {
      quizProgress.textContent = "Votre résultat";
      quizFill.style.width = "100%";
      var level, cls, text;
      if (quizScore <= 1) {
        level = "Risque faible"; cls = "risk-low";
        text = "Votre achat semble plutôt sûr, mais une vérification reste une bonne assurance avant de payer.";
      } else if (quizScore === 2) {
        level = "Risque moyen"; cls = "risk-mid";
        text = "Quelques points à éclaircir avant de payer — une vérification vous donnerait les réponses.";
      } else {
        level = "Risque élevé"; cls = "risk-high";
        text = "Attention, plusieurs signaux d'alerte — ne payez rien avant une vérification.";
      }
      quizStep.innerHTML =
        '<div class="quiz-result ' + cls + '">' +
          '<p class="quiz-level">' + level + ' — ' + quizScore + ' point' + (quizScore > 1 ? 's' : '') + ' sur 4</p>' +
          '<p>' + text + '</p>' +
          '<div class="quiz-actions">' +
            '<a class="btn btn-coral" href="#demande">Demander une vérification</a>' +
            '<button type="button" class="btn btn-ghost" id="quiz-restart">Recommencer le test</button>' +
          '</div>' +
        '</div>';
      quizStep.classList.remove("swap");
      void quizStep.offsetWidth;
      quizStep.classList.add("swap");
      document.getElementById("quiz-restart").addEventListener("click", function () {
        quizIndex = 0; quizScore = 0; showQuestion(0);
      });
    }

    showQuestion(0);
  }

  /* ---------- Formulaire : estimation en direct ---------- */
  var form = document.getElementById("mission-form");
  var estimateBox = document.getElementById("estimate");
  if (!form || !estimateBox) return;

  function selectedValue(name) {
    var input = form.querySelector('input[name="' + name + '"]:checked');
    return input ? input.value : "";
  }

  function updateEstimate() {
    var type = selectedValue("type");
    var mission = selectedValue("mission");
    var quartier = document.getElementById("quartier").value.trim();
    var budget = document.getElementById("budget").value.trim();

    var price, unit;
    if (mission === "Suivi de chantier") {
      price = "49 $ / mois";
      unit = "suivi de chantier";
    } else {
      price = "79 $";
      unit = "vérification avant achat";
    }

    var html = "<strong>Estimation : " + price + "</strong> pour une " + unit +
      " d'un" + (type === "Maison" ? "e maison" : " terrain");
    if (quartier) html += " à " + escapeHtml(quartier);
    html += ".";
    if (budget) html += " Budget du bien : " + escapeHtml(budget) + " $.";
    html += "<br><span>Tarif confirmé après analyse de votre demande.</span>";
    estimateBox.innerHTML = html;
  }

  function escapeHtml(text) {
    return text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
  }

  form.addEventListener("change", updateEstimate);
  form.addEventListener("input", updateEstimate);
  updateEstimate();

  /* ---------- Envoyer le brief sur WhatsApp ---------- */
  var WHATSAPP_NUMBER = "224620685645"; /* +224 620 68 56 45, vérificateur à Conakry */
  var sendBtn = document.getElementById("send-whatsapp");
  var copyBtn = document.getElementById("copy-brief");
  var copyStatus = document.getElementById("copy-status");

  function buildBrief() {
    var type = selectedValue("type");
    var mission = selectedValue("mission");
    var nom = document.getElementById("nom").value.trim() || "Non précisé";
    var telephone = document.getElementById("telephone").value.trim() || "Non précisé";
    var quartier = document.getElementById("quartier").value.trim() || "Non précisé";
    var budget = document.getElementById("budget").value.trim();
    var description = document.getElementById("description").value.trim() || "Non précisée";

    return (
      "Bonjour, je demande une " + mission.toLowerCase() + " pour un" +
      (type === "Maison" ? "e maison" : " terrain") +
      " à Conakry.\n" +
      "— Nom : " + nom + "\n" +
      "— Téléphone : " + telephone + "\n" +
      "— Bien : " + type + "\n" +
      "— Mission : " + mission + "\n" +
      "— Quartier : " + quartier + "\n" +
      (budget ? "— Budget du bien : " + budget + " $\n" : "") +
      "— Besoin : " + description + "\n" +
      "(Demande envoyée depuis le site Seedee.)"
    );
  }

  /* Enregistre la demande pour la page privée des demandes.
     Envoi « fire-and-forget » : un échec n'empêche jamais WhatsApp
     de s'ouvrir. */
  function saveDemande() {
    if (!window.fetch) return;
    var payload = {
      nom: document.getElementById("nom").value.trim(),
      telephone: document.getElementById("telephone").value.trim(),
      type_bien: selectedValue("type"),
      mission: selectedValue("mission"),
      quartier: document.getElementById("quartier").value.trim(),
      budget: document.getElementById("budget").value.trim(),
      description: document.getElementById("description").value.trim()
    };
    try {
      fetch("/api/demande", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
        keepalive: true
      }).catch(function () { /* l'échec n'empêche pas WhatsApp */ });
    } catch (e) { /* idem */ }
  }

  sendBtn.addEventListener("click", function () {
    var nomEl = document.getElementById("nom");
    var telEl = document.getElementById("telephone");
    if (!nomEl.value.trim()) {
      copyStatus.textContent = "Merci d'indiquer votre nom.";
      nomEl.focus();
      return;
    }
    if (!telEl.value.trim()) {
      copyStatus.textContent = "Merci d'indiquer votre numéro WhatsApp / téléphone.";
      telEl.focus();
      return;
    }
    saveDemande();
    var url = "https://wa.me/" + WHATSAPP_NUMBER + "?text=" + encodeURIComponent(buildBrief());
    window.open(url, "_blank", "noopener");
    copyStatus.textContent = "WhatsApp s'ouvre avec votre message déjà rempli.";
  });

  copyBtn.addEventListener("click", function () {
    var brief = buildBrief();

    function done() {
      copyStatus.textContent = "Brief copié ! Collez-le dans WhatsApp.";
    }
    function failed() {
      copyStatus.textContent = "Copie impossible ici : sélectionnez le texte du formulaire et copiez-le.";
    }

    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(brief).then(done, failed);
    } else {
      var area = document.createElement("textarea");
      area.value = brief;
      area.style.position = "fixed";
      area.style.opacity = "0";
      document.body.appendChild(area);
      area.select();
      try {
        document.execCommand("copy");
        done();
      } catch (e) {
        failed();
      }
      document.body.removeChild(area);
    }
  });
})();
