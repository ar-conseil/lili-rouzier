// Lili Rouzier — comportements communs (sans dépendance).
(() => {
  const reduit = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // Apparition au défilement
  const elements = document.querySelectorAll(".apparait");
  // Sur téléphone, pas d’apparition au défilement : le contenu est là tout de suite, le défilement reste fluide
  const mobile = window.matchMedia("(max-width: 980px)").matches;
  if (mobile) {
    // rien à faire : la feuille de style affiche déjà tout
  } else if (reduit || !("IntersectionObserver" in window)) {
    elements.forEach((el) => el.classList.add("visible"));
  } else {
    const obs = new IntersectionObserver((entrees) => {
      entrees.forEach((e) => {
        if (e.isIntersecting) { e.target.classList.add("visible"); obs.unobserve(e.target); }
      });
    }, { rootMargin: window.matchMedia("(max-width: 980px)").matches ? "0px 0px 12% 0px" : "0px 0px -8% 0px", threshold: 0.01 });
    elements.forEach((el) => obs.observe(el));
  }

  // Menu mobile
  const bouton = document.querySelector("[data-menu-bouton]");
  const menu = document.querySelector("[data-menu]");
  if (bouton && menu) {
    const fermer = () => { bouton.setAttribute("aria-expanded", "false"); document.body.classList.remove("menu-ouvert"); };
    bouton.addEventListener("click", () => {
      const ouvert = bouton.getAttribute("aria-expanded") === "true";
      bouton.setAttribute("aria-expanded", String(!ouvert));
      document.body.classList.toggle("menu-ouvert", !ouvert);
    });
    menu.querySelectorAll("a").forEach((a) => a.addEventListener("click", fermer));
    document.addEventListener("keydown", (e) => { if (e.key === "Escape") fermer(); });
  }

  // En-tête qui se resserre au défilement
  const entete = document.querySelector("[data-entete]");
  if (entete) {
    let etat = null;
    const maj = () => { const r = window.scrollY > 24; if (r !== etat) { etat = r; entete.classList.toggle("resserre", r); } };
    requestAnimationFrame(maj); window.addEventListener("scroll", maj, { passive: true });
  }

  // Formulaire de contact
  // En attendant le cockpit de Lili, les messages passent par FormSubmit (formsubmit.co).
  // ALIAS = la chaîne aléatoire que FormSubmit envoie à Lili après l'activation.
  // Jamais l'adresse e-mail de Lili ici.
  const ALIAS = "fbb0d5dffaed9cbeda7837d88a696533";
  const ATTENTE_MS = 60000; // un envoi par minute et par navigateur

  document.querySelectorAll("form[data-contact]").forEach((f) => {
    const retour = f.querySelector("[data-retour]");
    const bouton = f.querySelector('button[type="submit"]');
    const dire = (texte) => { if (retour) retour.textContent = texte; };
    bouton.disabled = false; // le bouton ne s’active qu’avec ce script

    f.addEventListener("submit", async (e) => {
      e.preventDefault();
      if (!f.reportValidity()) return;

      // Champ piège rempli : un robot. On fait comme si tout allait bien.
      if (f.elements._honey && f.elements._honey.value) { f.reset(); dire("Merci, votre message est bien parti."); return; }

      let dernier = 0;
      try { dernier = Number(localStorage.getItem("lili-dernier-envoi")) || 0; } catch {}
      if (Date.now() - dernier < ATTENTE_MS) { dire("Votre message vient de partir. Patientez une minute avant d’en envoyer un autre."); return; }

      if (!ALIAS) { dire("Le formulaire n’est pas encore ouvert. Écrivez-moi sur Instagram ou LinkedIn en attendant."); return; }

      const v = (nom) => (f.elements[nom] ? f.elements[nom].value.trim() : "");
      const reseaux = [...f.querySelectorAll('input[name="reseaux"]:checked')].map((c) => c.value).join(", ");
      const donnees = {
        "Nom": v("nom"),
        "Entreprise": v("entreprise"),
        "E-mail": v("email"),
        "Réseaux": reseaux || "Non précisé",
        "Besoin": v("besoin"),
        "Budget mensuel": v("budget") || "Non précisé",
        _replyto: v("email"),
        _subject: `Site : nouveau message de ${v("nom")}`,
        _template: "table",
        _captcha: "false",
        _honey: "",
      };

      bouton.disabled = true;
      dire("Envoi en cours…");
      try {
        const r = await fetch(`https://formsubmit.co/ajax/${ALIAS}`, {
          method: "POST",
          headers: { "Content-Type": "application/json", Accept: "application/json" },
          body: JSON.stringify(donnees),
        });
        const json = await r.json().catch(() => ({}));
        if (!r.ok || String(json.success) !== "true") throw new Error(json.message || r.status);
        try { localStorage.setItem("lili-dernier-envoi", String(Date.now())); } catch {}
        f.reset();
        dire("Merci, votre message est bien parti. Je vous réponds très vite.");
      } catch (err) {
        dire("L’envoi n’a pas marché. Réessayez dans un instant, ou écrivez-moi sur Instagram ou LinkedIn.");
      } finally {
        bouton.disabled = false;
      }
    });
  });
})();

  // Jauge du parcours et carrousel d’avis
  (() => {
    const p = document.querySelector("[data-parcours]");
    if (p) {
      // Calcul seulement quand le parcours est visible, une fois par image
      let prevu = false, visible = false;
      const maj = () => {
        prevu = false;
        const r = p.getBoundingClientRect(), h = window.innerHeight;
        const v = Math.min(1, Math.max(0, (h * 0.6 - r.top) / r.height));
        p.style.setProperty("--p", v.toFixed(3));
      };
      const demander = () => { if (visible && !prevu) { prevu = true; requestAnimationFrame(maj); } };
      new IntersectionObserver(([e]) => { visible = e.isIntersecting; demander(); }).observe(p);
      window.addEventListener("scroll", demander, { passive: true });
    }
    const scene = document.querySelector("[data-avis]");
    if (scene) {
      const items = [...scene.children], compte = document.querySelector("[data-avis-compte]");
      let i = 0;
      const voir = (n) => { items[i].hidden = true; i = (n + items.length) % items.length; items[i].hidden = false; compte.textContent = `${i + 1} sur ${items.length}`; };
      document.querySelector("[data-avis-prec]").addEventListener("click", () => voir(i - 1));
      document.querySelector("[data-avis-suiv]").addEventListener("click", () => voir(i + 1));
    }
  })();

// Bouton flottant « Parlons de votre projet » (téléphone) : caché sur l'accueil et le contact
(() => {
  const cta = document.querySelector("[data-cta]");
  const une = document.querySelector(".une"), contact = document.querySelector("#contact");
  if (!cta || !une || !contact || !("IntersectionObserver" in window)) return;
  let uneVisible = true, contactVisible = false;
  const maj = () => cta.classList.toggle("visible", !uneVisible && !contactVisible);
  new IntersectionObserver(([e]) => { uneVisible = e.isIntersecting; maj(); }).observe(une);
  new IntersectionObserver(([e]) => { contactVisible = e.isIntersecting; maj(); }, { rootMargin: "0px 0px -20% 0px" }).observe(contact);
})();

// Cascade : dans une liste, chaque élément arrive un peu après le précédent
document.querySelectorAll(".apparait").forEach((el) => {
  const freres = el.parentElement ? [...el.parentElement.children].filter((e) => e.classList.contains("apparait")) : [];
  const i = freres.indexOf(el);
  if (i > 0) el.style.setProperty("--d", `${Math.min(i, 6) * 0.07}s`);
});

// Navigation : souligner la section en cours (ordinateur)
(() => {
  const liens = [...document.querySelectorAll('.nav a[href^="#"]')];
  if (!liens.length || !("IntersectionObserver" in window)) return;
  const parId = new Map(liens.map((a) => [a.getAttribute("href").slice(1), a]));
  const obs = new IntersectionObserver((entrees) => {
    entrees.forEach((e) => {
      const a = parId.get(e.target.id);
      if (!a) return;
      if (e.isIntersecting) { liens.forEach((l) => l.removeAttribute("aria-current")); a.setAttribute("aria-current", "location"); }
      else if (a.getAttribute("aria-current")) a.removeAttribute("aria-current");
    });
  }, { rootMargin: "-45% 0px -50% 0px" });
  parId.forEach((_, id) => { const sec = document.getElementById(id); if (sec) obs.observe(sec); });
})();

// Avis : flèches du clavier quand le carrousel a le focus
(() => {
  const zone = document.querySelector("#avis");
  if (!zone) return;
  zone.addEventListener("keydown", (e) => {
    if (e.key === "ArrowRight") zone.querySelector("[data-avis-suiv]")?.click();
    if (e.key === "ArrowLeft") zone.querySelector("[data-avis-prec]")?.click();
  });
})();
