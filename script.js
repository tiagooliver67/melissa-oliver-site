(function(){
  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var motionOn = !reduced;

  // Menu (sanfona) em telas menores
  var menu = document.querySelector('.menu');
  var nav = document.querySelector('.header nav');
  if(menu && nav){
    menu.addEventListener('click', function(){
      nav.classList.toggle('open');
    });
    document.querySelectorAll('nav a').forEach(function(a){
      a.addEventListener('click', function(){ nav.classList.remove('open'); });
    });
    document.addEventListener('click', function(e){
      if(nav.classList.contains('open') && !nav.contains(e.target) && e.target !== menu){
        nav.classList.remove('open');
      }
    });
  }

  // Cabeçalho encolhe ao rolar
  var header = document.getElementById('site-header');
  function onScroll(){
    if(!header) return;
    if(window.scrollY > 40){ header.classList.add('scrolled'); } else { header.classList.remove('scrolled'); }
  }
  document.addEventListener('scroll', onScroll, {passive:true});
  onScroll();

  // Revelação ao rolar (cada seção "entra" uma vez, quando alcança a tela)
  var targets = document.querySelectorAll('.timeline, .values, .gallery, .people, .support-grid, .ig-grid, .achievement, .next');
  if('IntersectionObserver' in window && motionOn){
    var io = new IntersectionObserver(function(entries){
      entries.forEach(function(entry){
        if(entry.isIntersecting){
          entry.target.classList.add('is-visible');
          io.unobserve(entry.target);
        }
      });
    }, {threshold:.22});
    targets.forEach(function(t){ io.observe(t); });
  } else {
    targets.forEach(function(t){ t.classList.add('is-visible'); });
  }

  // Marca o herói como pronto (libera o leve zoom da foto e o "kime" de entrada)
  requestAnimationFrame(function(){
    var hero = document.querySelector('.hero');
    if(hero) hero.classList.add('is-ready');
  });

  // Contador do número da conquista quando a seção aparece
  var medalNumber = document.querySelector('.medal span');
  var achievement = document.querySelector('.achievement');
  if('IntersectionObserver' in window && medalNumber && achievement){
    var counted = false;
    var targetN = parseInt(medalNumber.textContent, 10);
    if(isNaN(targetN)) targetN = 3;
    var io2 = new IntersectionObserver(function(entries){
      entries.forEach(function(entry){
        if(entry.isIntersecting && !counted){
          counted = true;
          if(motionOn){
            var n = 0;
            var step = function(){
              n++;
              medalNumber.textContent = n;
              if(n < targetN) setTimeout(step, 160);
            };
            medalNumber.textContent = '0';
            setTimeout(step, 180);
          }
          io2.unobserve(entry.target);
        }
      });
    }, {threshold:.4});
    io2.observe(achievement);
  }

  // Paralaxe sutil no herói (desliga sozinho fora da área do herói)
  var heroImg = document.querySelector('.hero-image img');
  var giantMo = document.querySelector('.giant-mo');
  var heroSection = document.querySelector('.hero');
  var ticking = false;
  function parallax(){
    ticking = false;
    if(!motionOn || !heroImg || !heroSection) return;
    var heroHeight = heroSection.offsetHeight;
    var y = window.scrollY;
    if(y > heroHeight) return;
    var p = y / heroHeight;
    heroImg.style.transform = 'scale(1) translateY(' + Math.round(p * 46) + 'px)';
    if(giantMo) giantMo.style.setProperty('--py', p);
  }
  document.addEventListener('scroll', function(){
    if(!ticking){ requestAnimationFrame(parallax); ticking = true; }
  }, {passive:true});

  // Rede de segurança: garante que nada fique invisível para sempre
  setTimeout(function(){
    targets.forEach(function(t){ t.classList.add('is-visible'); });
  }, 6000);
})();
