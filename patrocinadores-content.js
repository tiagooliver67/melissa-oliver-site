// Carrega o conteúdo editável da página de Patrocinadores (patrocinadores.json)
// e atualiza a página. Esse arquivo NÃO precisa ser editado manualmente —
// o conteúdo é gerenciado pelo painel em /admin (aba "Patrocinadores").
(function () {
  function setText(id, value) {
    var el = document.getElementById(id);
    if (el && value != null && value !== "") el.textContent = value;
  }
  function setHtmlWithBreaks(id, value) {
    var el = document.getElementById(id);
    if (el && value != null && value !== "") el.innerHTML = String(value).split("\n").join("<br>");
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
  function renderList(id, items) {
    var el = document.getElementById(id);
    if (!el || !Array.isArray(items) || !items.length) return;
    el.innerHTML = items.map(function (it) {
      return "<li>" + it + "</li>";
    }).join("");
  }

  fetch("patrocinadores.json", { cache: "no-store" })
    .then(function (r) {
      if (!r.ok) throw new Error("patrocinadores.json not found");
      return r.json();
    })
    .then(function (d) {
      if (d.hero) {
        setHtmlWithBreaks("sp-hero-copy", d.hero.copy);
        setImg("sp-hero-photo", d.hero.photo);
        setText("sp-hero-location", d.hero.location);
      }
      if (d.story) {
        setHtmlWithBreaks("sp-story-text", d.story.text);
        setImg("sp-story-photo", d.story.photo);
        setText("sp-story-badge-title", d.story.badge_title);
        setText("sp-story-badge-event", d.story.badge_event);
        setHtmlWithBreaks("sp-quote-text", d.story.quote);
      }
      if (Array.isArray(d.why)) {
        d.why.forEach(function (item, i) {
          setText("sp-why-" + i + "-title", item.title);
          setHtmlWithBreaks("sp-why-" + i + "-text", item.text);
        });
      }
      if (d.expo) {
        setImg("sp-expo-photo-0", d.expo.kimono);
        setImg("sp-expo-photo-1", d.expo.camisas);
        setImg("sp-expo-photo-2", d.expo.redes_sociais);
        setImg("sp-expo-photo-3", d.expo.eventos);
      }
      if (Array.isArray(d.sponsors) && d.sponsors.length) {
        var grid = document.getElementById("sp-logo-grid");
        if (grid) {
          grid.innerHTML = d.sponsors.map(function (s) {
            if (s.logo) {
              return '<div><img src="' + s.logo + '" alt="' + (s.name || "") + '"></div>';
            }
            return "<div>" + (s.name || "SUA MARCA") + "</div>";
          }).join("");
        }
      }
      if (Array.isArray(d.plans)) {
        d.plans.forEach(function (plan, i) {
          setText("sp-plan-" + i + "-title", plan.title);
          renderList("sp-plan-" + i + "-list", plan.bullets);
        });
      }
      if (d.cta) {
        setHtmlWithBreaks("sp-cta-text", d.cta.text);
        setImg("sp-cta-photo", d.cta.photo);
      }
      if (d.contact) {
        if (d.contact.whatsapp) {
          var digits = String(d.contact.whatsapp).replace(/\D/g, "");
          setAllHref("sp-wa-link", "https://wa.me/" + digits);
        }
        if (d.contact.instagram_handle) {
          var handle = String(d.contact.instagram_handle).replace(/^@/, "");
          setAllHref("sp-ig-link", "https://instagram.com/" + handle);
          setText("sp-contact-ig-text", "@" + handle.toUpperCase());
        }
        if (d.contact.email) {
          setAllMailto("sp-email-link", d.contact.email);
          setText("sp-contact-email-text", d.contact.email.toUpperCase());
        }
      }
    })
    .catch(function (err) {
      // Se o patrocinadores.json não carregar por algum motivo, a página
      // continua funcionando normalmente com o conteúdo padrão do HTML.
      console.warn("Não foi possível carregar patrocinadores.json:", err);
    });
})();
