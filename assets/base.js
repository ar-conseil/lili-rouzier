// Lili Rouzier — comportements communs (sans dépendance).
(() => {
  const reduit = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // Apparition au défilement
  const elements = document.querySelectorAll(".apparait");
  if (reduit || !("IntersectionObserver" in window)) {
    elements.forEach((el) => el.classList.add("visible"));
  } else {
    const obs = new IntersectionObserver((entrees) => {
      entrees.forEach((e) => {
        if (e.isIntersecting) { e.target.classList.add("visible"); obs.unobserve(e.target); }
      });
    }, { rootMargin: "0px 0px -8% 0px", threshold: 0.08 });
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
    const maj = () => entete.classList.toggle("resserre", window.scrollY > 24);
    maj(); window.addEventListener("scroll", maj, { passive: true });
  }

  // Formulaire de maquette : pas d'envoi réel dans les pistes
  document.querySelectorAll("form[data-maquette]").forEach((f) => {
    f.addEventListener("submit", (e) => {
      e.preventDefault();
      const msg = f.querySelector("[data-retour]");
      if (msg) msg.textContent = "Maquette : l'envoi sera branché sur le cockpit de Lili à l'étape suivante.";
    });
  });
})();
