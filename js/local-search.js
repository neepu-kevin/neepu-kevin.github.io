(function () {
  var overlay = document.querySelector('.search-pop-overlay');
  var input = document.querySelector('.search-input');
  var result = document.getElementById('search-result');
  var triggers = document.querySelectorAll('.search-trigger');
  var close = document.querySelector('.popup-btn-close');
  var navToggle = document.querySelector('.nav-toggle');
  var siteNav = document.querySelector('.site-nav');
  var toTop = document.getElementById('to-top');
  var indexReady = false;
  var searchData = [];

  function escapeHtml(text) {
    return String(text || '').replace(/[&<>"']/g, function (char) {
      return {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;'
      }[char];
    });
  }

  function openSearch() {
    overlay.classList.add('active');
    overlay.setAttribute('aria-hidden', 'false');
    loadIndex();
    setTimeout(function () {
      input.focus();
    }, 60);
  }

  function closeSearch() {
    overlay.classList.remove('active');
    overlay.setAttribute('aria-hidden', 'true');
  }

  function loadIndex() {
    if (indexReady) return;
    fetch('/search.xml')
      .then(function (response) {
        return response.text();
      })
      .then(function (xmlText) {
        var xml = new DOMParser().parseFromString(xmlText, 'text/xml');
        searchData = Array.prototype.map.call(xml.querySelectorAll('entry'), function (entry) {
          return {
            title: entry.querySelector('title') ? entry.querySelector('title').textContent : '',
            url: entry.querySelector('url') ? entry.querySelector('url').textContent : '',
            content: entry.querySelector('content') ? entry.querySelector('content').textContent : ''
          };
        });
        indexReady = true;
        doSearch();
      })
      .catch(function () {
        result.innerHTML = '<div id="no-result">搜索索引加载失败，请重新生成站点。</div>';
      });
  }

  function makeSnippet(content, terms) {
    var lower = content.toLowerCase();
    var firstHit = -1;
    terms.some(function (term) {
      firstHit = lower.indexOf(term);
      return firstHit >= 0;
    });
    if (firstHit < 0) firstHit = 0;
    var start = Math.max(firstHit - 36, 0);
    var end = Math.min(firstHit + 110, content.length);
    var snippet = content.slice(start, end);
    terms.forEach(function (term) {
      if (!term) return;
      var reg = new RegExp(term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'gi');
      snippet = snippet.replace(reg, function (match) {
        return '<b class="search-keyword">' + escapeHtml(match) + '</b>';
      });
    });
    return (start > 0 ? '...' : '') + snippet + (end < content.length ? '...' : '');
  }

  function doSearch() {
    if (!indexReady) return;
    var query = input.value.trim().toLowerCase();
    if (!query) {
      result.innerHTML = '<div id="no-result">输入关键词后，会搜索文章标题和正文。</div>';
      return;
    }
    var terms = query.split(/[\s-]+/).filter(Boolean);
    var matches = searchData.map(function (item) {
      var title = item.title || '';
      var content = item.content || '';
      var haystack = (title + ' ' + content).toLowerCase();
      var score = 0;
      terms.forEach(function (term) {
        var titleHits = (title.toLowerCase().match(new RegExp(term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g')) || []).length;
        var contentHits = (content.toLowerCase().match(new RegExp(term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g')) || []).length;
        score += titleHits * 8 + contentHits;
      });
      if (!terms.every(function (term) { return haystack.indexOf(term) >= 0; })) return null;
      return {
        item: item,
        score: score
      };
    }).filter(Boolean).sort(function (a, b) {
      return b.score - a.score;
    });

    if (!matches.length) {
      result.innerHTML = '<div id="no-result">没有找到匹配文章。</div>';
      return;
    }

    result.innerHTML = '<ul class="search-result-list">' + matches.map(function (match) {
      return '<li>' +
        '<a class="search-result-title" href="' + escapeHtml(match.item.url) + '">' + escapeHtml(match.item.title) + '</a>' +
        '<a class="search-result" href="' + escapeHtml(match.item.url) + '">' + makeSnippet(escapeHtml(match.item.content), terms) + '</a>' +
        '</li>';
    }).join('') + '</ul>';
  }

  Array.prototype.forEach.call(triggers, function (trigger) {
    trigger.addEventListener('click', openSearch);
  });

  if (close) close.addEventListener('click', closeSearch);
  if (overlay) {
    overlay.addEventListener('click', function (event) {
      if (event.target === overlay) closeSearch();
    });
  }
  if (input) input.addEventListener('input', doSearch);
  document.addEventListener('keydown', function (event) {
    if (event.key === 'Escape') closeSearch();
  });

  if (navToggle && siteNav) {
    navToggle.addEventListener('click', function () {
      siteNav.classList.toggle('active');
    });
  }

  window.addEventListener('scroll', function () {
    if (!toTop) return;
    toTop.classList.toggle('visible', window.scrollY > 240);
  });
  if (toTop) {
    toTop.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  document.querySelectorAll('.post-toggle').forEach(function (button) {
    button.addEventListener('click', function () {
      var post = button.closest('.post-preview');
      if (!post) return;

      var excerpt = post.querySelector('.post-excerpt');
      var body = post.querySelector('.post-inline-body');
      var expanded = button.getAttribute('aria-expanded') === 'true';

      if (!body || !excerpt) return;

      if (expanded) {
        body.hidden = true;
        excerpt.hidden = false;
        button.textContent = 'Read more';
        button.setAttribute('aria-expanded', 'false');
        post.classList.remove('is-expanded');
        post.scrollIntoView({ behavior: 'smooth', block: 'start' });
      } else {
        body.hidden = false;
        excerpt.hidden = true;
        button.textContent = '收起';
        button.setAttribute('aria-expanded', 'true');
        post.classList.add('is-expanded');
      }
    });
  });
}());
