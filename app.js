/* Seedee — interactions du site.
   Le site n'envoie aucune donnée tout seul : tout se passe dans le
   navigateur. WhatsApp ne s'ouvre que si le visiteur clique sur
   « Envoyer sur WhatsApp ». */
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

  function animateBudget() {
    if (!budgetFill) return;
    budgetFill.style.width = "0%";
    setTimeout(function () { budgetFill.style.width = "41%"; }, 120);
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
    var quartier = document.getElementById("quartier").value.trim() || "Non précisé";
    var budget = document.getElementById("budget").value.trim();
    var description = document.getElementById("description").value.trim() || "Non précisée";

    return (
      "Bonjour, je demande une " + mission.toLowerCase() + " pour un" +
      (type === "Maison" ? "e maison" : " terrain") +
      " à Conakry.\n" +
      "— Bien : " + type + "\n" +
      "— Mission : " + mission + "\n" +
      "— Quartier : " + quartier + "\n" +
      (budget ? "— Budget du bien : " + budget + " $\n" : "") +
      "— Besoin : " + description + "\n" +
      "(Demande envoyée depuis le site Seedee.)"
    );
  }

  sendBtn.addEventListener("click", function () {
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
