/* Vérification immobilière Conakry — interactions du prototype.
   Aucun envoi réseau : tout se passe dans le navigateur. */
(function () {
  "use strict";

  /* ---------- Onglets du rapport d'exemple ---------- */
  var tabs = document.querySelectorAll(".tab");
  tabs.forEach(function (tab) {
    tab.addEventListener("click", function () {
      tabs.forEach(function (t) {
        t.classList.remove("active");
        t.setAttribute("aria-selected", "false");
      });
      tab.classList.add("active");
      tab.setAttribute("aria-selected", "true");
      document.getElementById("report-terrain").classList.toggle("hidden", tab.dataset.tab !== "terrain");
      document.getElementById("report-chantier").classList.toggle("hidden", tab.dataset.tab !== "chantier");
    });
  });

  /* ---------- Jalons du chantier d'exemple ---------- */
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

    var html = "<strong>Estimation (exemple) : " + price + "</strong> pour une " + unit +
      " d'un" + (type === "Maison" ? "e maison" : " terrain");
    if (quartier) html += " à " + escapeHtml(quartier);
    html += ".";
    if (budget) html += " Budget du bien : " + escapeHtml(budget) + " $.";
    html += "<br><span>Tarif d'exemple, en cours de validation. Le tarif exact est confirmé après analyse de votre demande.</span>";
    estimateBox.innerHTML = html;
  }

  function escapeHtml(text) {
    return text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
  }

  form.addEventListener("change", updateEstimate);
  form.addEventListener("input", updateEstimate);
  updateEstimate();

  /* ---------- Copier le brief WhatsApp ---------- */
  var copyBtn = document.getElementById("copy-brief");
  var copyStatus = document.getElementById("copy-status");

  copyBtn.addEventListener("click", function () {
    var type = selectedValue("type");
    var mission = selectedValue("mission");
    var quartier = document.getElementById("quartier").value.trim() || "Non précisé";
    var budget = document.getElementById("budget").value.trim();
    var description = document.getElementById("description").value.trim() || "Non précisée";

    var brief =
      "Bonjour, je demande une " + mission.toLowerCase() + " pour un" +
      (type === "Maison" ? "e maison" : " terrain") +
      " à Conakry.\n" +
      "— Bien : " + type + "\n" +
      "— Mission : " + mission + "\n" +
      "— Quartier : " + quartier + "\n" +
      (budget ? "— Budget du bien : " + budget + " $\n" : "") +
      "— Besoin : " + description + "\n" +
      "(Demande envoyée depuis le site Vérification immobilière Conakry.)";

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
