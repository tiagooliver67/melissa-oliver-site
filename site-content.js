// Carrega o conteúdo editável (data.json) e atualiza a página.
// Esse arquivo NÃO precisa ser editado manualmente — o conteúdo é
// gerenciado pelo painel em /admin.
(function () {
  function setText(id, value) {
    var el = document.getElementById(id);
    if (el && value != null) el.textContent = value;
  }
  function setHtmlWithBreaks(id, value) {
    var el = document.getElementById(id);
    if (el && value != null) el.innerHTML = String(value).split("\n").join("<br>");
  }
  function setImg(id, value) {
    var el = document.getElementById(id);
    if (el && value) el.src = value;
  }
  function setAllHref(className, value) {
    if (!value) return;
    document.querySelectorAll("." + className).forEach(function (el) {
      el.href = value;
    });
  }
  function setAllMailto(className, email) {
    if (!email) return;
    document.querySelectorAll("." + className).forEach(function (el) {
      el.href = "mailto:" + email;
    });
  }

  fetch("data.json", { cache: "no-store" })
    .then(function (r) {
      if (!r.ok) throw new Error("data.json not found");
      return r.json();
    })
    .then(function (d) {
      if (d.hero) {
        setHtmlWithBreaks("hero-eyebrow", d.hero.eyebrow);
        setHtmlWithBreaks("hero-script", d.hero.script);
        setHtmlWithBreaks("hero-copy", d.hero.copy);
        setImg("hero-photo", d.hero.photo);
        setAllHref("ig-link", d.hero.instagram_url);
      }
      if (d.achievement) {
        setText("ach-title", d.achievement.title);
        setText("ach-subtitle", d.achievement.subtitle);
        setText("ach-event", d.achievement.event);
        setText("ach-text", d.achievement.text);
        setImg("ach-photo", d.achievement.photo);
      }
      if (Array.isArray(d.team)) {
        d.team.forEach(function (member, i) {
          setText("team-role-" + i, member.role);
          setText("team-name-" + i, member.name);
          setImg("team-photo-" + i, member.photo);
        });
      }
      if (Array.isArray(d.journey)) {
        d.journey.forEach(function (step, i) {
          setText("journey-label-" + i, step.label);
          setText("journey-text-" + i, step.text);
          setImg("journey-photo-" + i, step.photo);
        });
      }
      if (Array.isArray(d.moments)) {
        d.moments.forEach(function (photo, i) {
          setImg("moment-photo-" + i, photo);
          setImg("ig-grid-photo-" + i, photo);
        });
      }
      if (d.hero && d.hero.photo) {
        setImg("ig-grid-photo-4", d.hero.photo);
      }
      if (d.next) {
        setHtmlWithBreaks("next-text", d.next.text);
        setImg("next-photo", d.next.photo);
      }
      if (d.contact) {
        setText("ig-handle", d.contact.instagram_handle);
        setAllMailto("email-link", d.contact.email);
      }
    })
    .catch(function (err) {
      // Se o data.json não carregar por algum motivo, o site continua
      // funcionando normalmente com o conteúdo padrão do HTML.
      console.warn("Não foi possível carregar data.json:", err);
    });
})();
