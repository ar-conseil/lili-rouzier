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
  const une = document.querySelector(".une, .cas-une"), contact = document.querySelector("#contact, .cas-appel");
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

// Pages de texte : l’onglet du sommaire suit la lecture (et reste visible sur téléphone)
(() => {
  const liens = [...document.querySelectorAll(".sommaire-texte a")];
  if (!liens.length || !("IntersectionObserver" in window)) return;
  const parId = new Map(liens.map((a) => [a.getAttribute("href").slice(1), a]));
  const obs = new IntersectionObserver((entrees) => {
    entrees.forEach((e) => {
      if (!e.isIntersecting) return;
      const a = parId.get(e.target.id);
      liens.forEach((l) => l.removeAttribute("aria-current"));
      a.setAttribute("aria-current", "location");
      const ol = a.closest("ol");
      if (ol && ol.scrollWidth > ol.clientWidth) ol.scrollTo({ left: a.parentElement.offsetLeft - 8, behavior: "smooth" });
    });
  }, { rootMargin: "-35% 0px -60% 0px" });
  parId.forEach((_, id) => { const s = document.getElementById(id); if (s) obs.observe(s); });
})();

// Avis : glisser du doigt pour passer d’un avis à l’autre
(() => {
  const scene = document.querySelector("[data-avis]");
  if (!scene) return;
  let x0 = null, y0 = null;
  scene.addEventListener("touchstart", (e) => { x0 = e.touches[0].clientX; y0 = e.touches[0].clientY; }, { passive: true });
  scene.addEventListener("touchend", (e) => {
    if (x0 === null) return;
    const dx = e.changedTouches[0].clientX - x0, dy = e.changedTouches[0].clientY - y0;
    if (Math.abs(dx) > 45 && Math.abs(dx) > Math.abs(dy)) document.querySelector(dx < 0 ? "[data-avis-suiv]" : "[data-avis-prec]")?.click();
    x0 = y0 = null;
  }, { passive: true });
})();

// ============================================================
// Effets « studio »
// ============================================================
(() => {
  const reduit = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduit) return;
  const souris = window.matchMedia("(pointer: fine)").matches;
  const ordi = window.matchMedia("(min-width: 981px)").matches;
  const lerp = (a, b, t) => a + (b - a) * t;

  // --- Barre de progression ---
  const barre = document.createElement("div");
  barre.className = "progression";
  document.body.appendChild(barre);

  // --- Signature du pied de page qui s'écrit ---
  const sig = document.querySelector(".pied .signature");
  if (sig && "IntersectionObserver" in window) {
    new IntersectionObserver(([e], o) => { if (e.isIntersecting) { sig.classList.add("ecrite"); o.disconnect(); } }, { threshold: 0.4 }).observe(sig);
  }

  // --- Titres révélés mot à mot (ordinateur) ---
  if (ordi && "IntersectionObserver" in window) {
    const titres = document.querySelectorAll(".bloc .titre, .cas-autres .titre, .p404 h1, .cas-une h1, .cas-citation blockquote");
    const obs = new IntersectionObserver((entrees) => {
      entrees.forEach((e) => { if (e.isIntersecting) { e.target.classList.add("revele"); obs.unobserve(e.target); } });
    }, { rootMargin: "0px 0px -10% 0px" });
    titres.forEach((t) => {
      if (t.closest(".apparait") && t.closest(".apparait") !== t) t.closest(".apparait").classList.add("visible");
      let i = 0;
      const marcher = (noeud) => {
        [...noeud.childNodes].forEach((n) => {
          if (n.nodeType === 3) {
            const frag = document.createDocumentFragment();
            n.textContent.split(/( )/).forEach((morceau) => {
              if (morceau === " ") { frag.appendChild(document.createTextNode(" ")); return; }
              if (!morceau) return;
              const m = document.createElement("span"); m.className = "mot";
              const s = document.createElement("span"); s.textContent = morceau; s.style.setProperty("--i", i++);
              m.appendChild(s); frag.appendChild(m);
            });
            n.replaceWith(frag);
          } else if (n.nodeType === 1) marcher(n);
        });
      };
      t.setAttribute("aria-label", t.textContent.replace(/\s+/g, " ").trim());
      marcher(t);
      t.classList.add("mots");
      t.classList.remove("apparait");
      obs.observe(t);
    });
  }

  // --- Défilement : profondeur, valeurs, bandeau, progression ---
  const photoUne = document.querySelector(".une .photo img");
  const pause = document.querySelector(".pause img");
  const valeurs = [...document.querySelectorAll(".valeurs b")];
  const bandeau = document.querySelector(".bandeau");
  const piste = bandeau && bandeau.querySelector(".piste");
  let y = window.scrollY, yPrec = y, vitesse = 0, posBandeau = 0, sens = 1, enCours = false;
  if (piste) bandeau.classList.add("pilote");
  // L’animation d’arrivée de la photo garderait la main sur « transform » : on la retire une fois finie
  if (photoUne) photoUne.addEventListener("animationend", () => { photoUne.style.animation = "none"; }, { once: true });

  const image = () => {
    y = window.scrollY;
    const h = window.innerHeight, total = document.documentElement.scrollHeight - h;
    barre.style.transform = `scaleX(${total > 0 ? y / total : 0})`;
    if (ordi) {
      if (photoUne && y < h * 1.2) photoUne.style.transform = `translate3d(var(--sx, 0px), ${y * 0.18}px, 0) scale(1.04)`;
      if (pause) {
        const r = pause.parentElement.getBoundingClientRect();
        if (r.bottom > 0 && r.top < h) { const p = 1 - (r.top + r.height) / (h + r.height); pause.style.transform = `scale(${1.22 - p * 0.22}) translate3d(0, ${(p - 0.5) * -40}px, 0)`; }
      }
      valeurs.forEach((v, k) => {
        const r = v.getBoundingClientRect();
        if (r.bottom > 0 && r.top < h) { const p = (r.top - h / 2) / h; v.style.transform = `translate3d(${(k % 2 ? -1 : 1) * p * 120}px, 0, 0)`; }
      });
    }
    if (piste) {
      const dy = y - yPrec; yPrec = y;
      if (dy !== 0) sens = dy > 0 ? 1 : -1;
      vitesse = lerp(vitesse, Math.min(Math.abs(dy), 60), 0.1);
      posBandeau -= sens * (0.6 + vitesse * 0.35);
      const moitie = piste.scrollWidth / 2;
      if (posBandeau <= -moitie) posBandeau += moitie;
      if (posBandeau > 0) posBandeau -= moitie;
      piste.style.transform = `translate3d(${posBandeau}px, 0, 0)`;
    }
    requestAnimationFrame(image);
  };
  requestAnimationFrame(image);

  if (!souris) return;

  // --- Photo d'accueil qui suit légèrement la souris ---
  const une = document.querySelector(".une");
  if (une && photoUne && ordi) {
    une.addEventListener("mousemove", (e) => {
      const x = (e.clientX / window.innerWidth - 0.5) * -18;
      photoUne.style.setProperty("--sx", `${x.toFixed(1)}px`);
    });
  }

  // --- Boutons magnétiques ---
  document.querySelectorAll(".bouton, .burger").forEach((b) => {
    b.addEventListener("mousemove", (e) => {
      const r = b.getBoundingClientRect();
      const dx = e.clientX - (r.left + r.width / 2), dy = e.clientY - (r.top + r.height / 2);
      b.style.transform = `translate(${dx * 0.18}px, ${dy * 0.28}px)`;
    });
    b.addEventListener("mouseleave", () => { b.style.transition = "transform .5s cubic-bezier(.22,.61,.21,1)"; b.style.transform = ""; setTimeout(() => (b.style.transition = ""), 500); });
  });

  // --- Liste des clients : la ligne survolée prend la couleur du client ---
  document.querySelectorAll("#realisations [data-apercu-c]").forEach((a) => {
    const sombre = a.dataset.apercuC === "#0e0e0e"; // Move Your Fit : noir sur fond noir, on inverse
    a.style.setProperty("--c", sombre ? "#f4efe8" : a.dataset.apercuC);
    a.style.setProperty("--t", sombre ? "#0e0e0e" : a.dataset.apercuT);
  });

  // --- Instagram : inclinaison 3D ---
  document.querySelectorAll(".grille-insta a").forEach((a) => {
    a.addEventListener("mousemove", (e) => {
      const r = a.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width - 0.5, y2 = (e.clientY - r.top) / r.height - 0.5;
      a.style.transform = `rotateY(${x * 14}deg) rotateX(${-y2 * 14}deg) translateZ(10px)`;
    });
    a.addEventListener("mouseleave", () => { a.style.transform = ""; });
  });
})();

// ============================================================
// Effets des pages clients
// ============================================================
(() => {
  if (!document.body.classList.contains("page-cas")) return;
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  const souris = window.matchMedia("(pointer: fine)").matches;
  const ordi = window.matchMedia("(min-width: 981px)").matches;

  // Sur téléphone, le nom de la marque se révèle aussi (une seule fois, à l'arrivée)
  if (!ordi) {
    const h1 = document.querySelector(".cas-une h1");
    if (h1 && !h1.classList.contains("mots")) {
      let i = 0;
      h1.innerHTML = h1.textContent.split(" ").map((m) => `<span class="mot"><span style="--i:${i++}">${m}</span></span>`).join(" ");
      h1.classList.add("mots");
      requestAnimationFrame(() => requestAnimationFrame(() => h1.classList.add("revele")));
    }
  }

  const logo = document.querySelector(".cas-une .logo");
  const une = document.querySelector(".cas-une");
  const img = document.querySelector(".cas-visuel img");
  let sx = 0, sy = 0;
  let logoLibre = false;
  if (logo) logo.addEventListener("animationend", () => { logo.style.animation = "none"; logoLibre = true; }, { once: true });

  // Logo qui dérive au défilement et suit un peu la souris ; visuel qui se resserre
  const boucle = () => {
    const y = window.scrollY, h = window.innerHeight;
    if (logo && logoLibre && y < h) {
      logo.style.transform = `translate3d(${sx}px, ${y * 0.25 + sy}px, 0) rotate(${y * 0.02}deg)`;
    }
    if (img && ordi) {
      const r = img.getBoundingClientRect();
      if (r.bottom > 0 && r.top < h && !img.dataset.survol) {
        const p = 1 - (r.top + r.height) / (h + r.height);
        img.style.transform = `scale(${1.15 - p * 0.15})`;
      }
    }
    requestAnimationFrame(boucle);
  };
  requestAnimationFrame(boucle);

  if (!souris) return;
  if (une && logo && ordi) {
    une.addEventListener("mousemove", (e) => {
      sx = (e.clientX / window.innerWidth - 0.5) * 30;
      sy = (e.clientY / window.innerHeight - 0.5) * 20;
    });
  }
  // Visuel : inclinaison au survol
  if (img) {
    const cadre = img.closest("picture");
    cadre.style.perspective = "900px";
    cadre.addEventListener("mousemove", (e) => {
      const r = cadre.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width - 0.5, y = (e.clientY - r.top) / r.height - 0.5;
      img.dataset.survol = "1";
      img.style.transform = `scale(1.06) rotateY(${x * 8}deg) rotateX(${-y * 8}deg)`;
    });
    cadre.addEventListener("mouseleave", () => { delete img.dataset.survol; });
  }
  // Cartes des autres clients : inclinaison 3D
  document.querySelectorAll(".cas-autres .generique a").forEach((a) => {
    a.addEventListener("mousemove", (e) => {
      const r = a.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width - 0.5, y = (e.clientY - r.top) / r.height - 0.5;
      a.style.transform = `translateY(-6px) rotateY(${x * 12}deg) rotateX(${-y * 12}deg)`;
    });
    a.addEventListener("mouseleave", () => { a.style.transform = ""; });
  });
})();

// ============================================================
// Troisième niveau d'effets
// ============================================================
(() => {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  const souris = window.matchMedia("(pointer: fine)").matches;
  const ordi = window.matchMedia("(min-width: 981px)").matches;
  const lerp = (a, b, t) => a + (b - a) * t;

  // --- Grand bandeau de texte : file à l'inverse du bandeau des logos, accélère avec le défilement ---
  const pisteTexte = document.querySelector(".piste-texte");
  let yPrec = window.scrollY, vitesse = 0, pos = 0, sens = 1;

  // --- Méthode horizontale (ordinateur) ---
  const methode = document.querySelector(".methode");
  const track = methode && methode.querySelector(".parcours");
  let jauge = null;
  if (methode && track && ordi) {
    methode.classList.add("horizontale");
    jauge = document.createElement("div"); jauge.className = "jauge-h"; jauge.innerHTML = "<i></i>";
    track.after(jauge);
  }

  const boucle = () => {
    const y = window.scrollY, h = window.innerHeight;
    if (pisteTexte) {
      const dy = y - yPrec;
      if (dy !== 0) sens = dy > 0 ? 1 : -1;
      vitesse = lerp(vitesse, Math.min(Math.abs(dy), 80), 0.08);
      pos += sens * (0.5 + vitesse * 0.45);
      const moitie = pisteTexte.scrollWidth / 2;
      if (pos >= 0) pos -= moitie;
      if (pos < -moitie) pos += moitie;
      pisteTexte.style.transform = `translate3d(${pos}px, 0, 0)`;
    }
    yPrec = y;
    if (jauge) {
      const r = methode.getBoundingClientRect();
      const prog = Math.min(1, Math.max(0, -r.top / (r.height - h)));
      const marge = methode.querySelector(".grille").getBoundingClientRect().left;
      const max = Math.max(0, track.scrollWidth + 2 * marge - window.innerWidth);
      track.style.transform = `translate3d(${-prog * max}px, 0, 0)`;
      jauge.style.setProperty("--p", prog.toFixed(3));
    }
    requestAnimationFrame(boucle);
  };
  requestAnimationFrame(boucle);

  // --- Photos dévoilées (ordinateur) ---
  if (ordi && "IntersectionObserver" in window) {
    const cibles = document.querySelectorAll(".pause picture, .moi figure picture, .methode figure picture, .cas-visuel picture");
    const obs = new IntersectionObserver((entrees) => {
      entrees.forEach((e) => { if (e.isIntersecting) { e.target.classList.add("devoile"); obs.unobserve(e.target); } });
    }, { rootMargin: "0px 0px -15% 0px" });
    cibles.forEach((c) => { c.classList.add("voile"); obs.observe(c); });
  }

  // --- Services : grande image qui suit la souris (ordinateur) ---
  const services = document.querySelectorAll(".services-grille li:not(.autre)");
  if (souris && ordi && services.length) {
    document.body.classList.add("services-suivi");
    const ap = document.createElement("div"); ap.className = "apercu-image"; ap.setAttribute("aria-hidden", "true");
    const im = document.createElement("img"); im.alt = ""; ap.appendChild(im); document.body.appendChild(ap);
    let px = 0, py = 0, cx = 0, cy = 0, actif = false, rot = 0;
    services.forEach((li) => {
      const src = li.querySelector(".vignette img")?.getAttribute("src");
      li.addEventListener("mouseenter", (e) => {
        if (src && im.getAttribute("src") !== src) { if (actif) { ap.classList.add("change"); setTimeout(() => ap.classList.remove("change"), 120); } im.src = src; }
        if (!actif) { cx = e.clientX + 32; cy = e.clientY + 24; }
        actif = true; ap.classList.add("visible");
      });
      li.addEventListener("mouseleave", () => { actif = false; ap.classList.remove("visible"); });
    });
    window.addEventListener("mousemove", (e) => { px = e.clientX; py = e.clientY; }, { passive: true });
    const bouger = () => {
      const nx = lerp(cx, px + 32, 0.14), ny = lerp(cy, py + 24, 0.14);
      rot = lerp(rot, Math.max(-4, Math.min(4, (nx - cx) * 0.25)), 0.12);
      cx = nx; cy = ny;
      ap.style.transform = `translate3d(${cx}px, ${cy}px, 0) rotate(${rot.toFixed(2)}deg)`;
      requestAnimationFrame(bouger);
    };
    requestAnimationFrame(bouger);
  }
})();
