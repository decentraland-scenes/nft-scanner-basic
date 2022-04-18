function indexData(data) {
  var index = lunr(function() {
    this.field('id')
    this.field('title', { boost: 10 })
    this.field('categories')
    this.field('url')
    this.field('content')
  })

  for (var key in data) {
    index.add(data[key])
  }

  window.index = index
  window.data = data
}

if (!document.location.pathname.match('/search')) {
  $.getJSON('/blog/data.json?1649354097208554264', function(data) {
    indexData(data)
  })
}

function getPreview(query, content, previewLength) {
  previewLength = previewLength || content.length * 2

  var parts = query.split(" "),
    match = content.toLowerCase().indexOf(query.toLowerCase()),
    matchLength = query.length,
    preview

  // Find a relevant location in content
  for (var i = 0; i < parts.length; i++) {
    if (match >= 0) {
      break
    }

    match = content.toLowerCase().indexOf(parts[i].toLowerCase())
    matchLength = parts[i].length
  }

  // Create preview
  if (match >= 0) {
    var start = match - previewLength / 2,
      end = start > 0 ? match + matchLength + previewLength / 2 : previewLength

    preview = content.substring(start, end).trim()

    if (start > 0) {
      preview = "..." + preview
    }

    if (end < content.length) {
      preview = preview + "..."
    }

    // Highlight query parts
    preview = preview.replace(
      new RegExp("(" + parts.join("|") + ")", "gi"),
      "<strong>$1</strong>"
    )
  } else {
    // Use start of content if no match found
    preview =
      content.substring(0, previewLength).trim() +
      (content.length > previewLength ? "..." : "")
  }

  return preview
}

$(function() {
  // HEADER ==>

  const $header = $('header')
  const $headerSearch = $('.header_search')

  function openDropdown() {
    closeSearchResults()
    $header.find('.dropdown-trigger').addClass('open')
    $header.find('.dropdown-content').addClass('open')
    $header.find('.dropdown-overlay').addClass('open')
  }

  function closeDropdown() {
    $header.find('.dropdown-trigger').removeClass('open')
    $header.find('.dropdown-content').removeClass('open')
    $header.find('.dropdown-overlay').removeClass('open')
  }

  function openSearchResults() {
    $headerSearch.addClass('open')
    $headerSearch.find('.search-results').empty()
    $header.find('.search-overlay').addClass('open')
  }

  function closeSearchResults() {
    $headerSearch.removeClass('open')
    $header.find('.search-overlay').removeClass('open')
  }

  $header.find('.dropdown-trigger').click(function(event) {
    event.preventDefault()
    $(this).hasClass('open') ? closeDropdown() : openDropdown()
  })

  $header.find('.dropdown-overlay').click(function(event) {
    event.preventDefault()
    closeDropdown()
  })

  $header.find('.search-overlay').click(function(event) {
    event.preventDefault()
    closeSearchResults()
  })

  const $searchInput = $headerSearch.find('input[type="text"]')

  $header.find('.close').click(function(event) {
    event.preventDefault()
    closeSearchResults()
    $searchInput.val('')
  })

  $searchInput.on('focus click', function() {
    closeDropdown()
    showSearchResults()
  })

  function showSearchResults() {
    const userInput = $searchInput.val().toLowerCase()

    if (userInput.length === 0) {
      closeSearchResults()
      return
    }

    openSearchResults()

    const items = window.index
      .search(userInput)
      .map(function (index) { return window.data[index.ref] })

    const limit = 4
    const results = items.slice(0, limit)
    const $list = $headerSearch.find('.search-results')

    for (var i = 0; i < results.length; i++) {
      var result = results[i]
      var category = result.categories.split(',')[0]

      if (category === 'Decentraland') {
        category = 'general'
      }

      $list.append(
        '<li>' +
          '<a href="' + result.url + '">' +
            '<div class="icon">' +
              '<img src="' + result.image + '" />' +
            '</div>' +
            '<div>' +
              '<span class="title">' + result.title + '</span>' +
              '<span class="description">' + getPreview(userInput, result.content, 64) + '</span>' +
            '</div>' +
          '</a>' +
        '</li>'
      )
    }

    if (items.length > limit) {
      $list.append(
        '<li class="more-results">' +
          '<a href="/blog/search/?q=' + userInput + '">See more results</a>' +
        '</li>'
      )
    }

    if (results.length === 0) {
      $list.append(
        '<li class="no-results">' +
          '<div class="image">' +
            '<svg xmlns="http://www.w3.org/2000/svg" width="56" height="56" viewBox="0 0 56 56"><g fill="none" fill-rule="evenodd" opacity=".24" transform="matrix(0 1 1 0 -20 -20)"><rect width="96" height="96"/><path fill="#5C5C6E" fill-rule="nonzero" d="M74.6294864,68.0113778 L62.4637732,55.8458883 C62.3991179,55.781233 62.3232766,55.7360414 62.2557129,55.6758605 C64.6495254,52.0446483 66.0466618,47.6979769 66.0466618,43.0235546 C66.0466618,30.3079357 55.7387261,20 43.0233309,20 C30.3079357,20 20,30.3079357 20,43.0233309 C20,55.7385023 30.307712,66.0466618 43.0231072,66.0466618 C47.6977532,66.0466618 52.0442008,64.6495254 55.6754131,62.2557129 C55.735594,62.3230528 55.7805619,62.3988942 55.8452172,62.4635495 L68.0111541,74.6294864 C69.8387293,76.4568379 72.8016875,76.4568379 74.6294864,74.6294864 C76.4568379,72.8019112 76.4568379,69.838953 74.6294864,68.0113778 Z M43.0233309,58.0651986 C34.7156828,58.0651986 27.9812394,51.3307552 27.9812394,43.0233309 C27.9812394,34.7156828 34.7159065,27.9812394 43.0233309,27.9812394 C51.3305315,27.9812394 58.0651986,34.7159065 58.0651986,43.0233309 C58.0651986,51.3307552 51.3305315,58.0651986 43.0233309,58.0651986 Z"/></g></svg>' +
          '</div>' +
          "<strong>Sorry, we couldn't find any matches</strong>" +
          '<span>Try searching for a different keyword</span>' +
        '</li>'
      )
    }

    $list.find('li:not(.no-results)')
      .mouseenter(function() {
        $list.find('li.selected').removeClass('selected')
        $(this).addClass('selected')
      })
      .mouseleave(function() {
        $(this).removeClass('selected')
      })
  }

  $searchInput.keydown(function(event) {
    const $list = $headerSearch.find('.search-results')
    const $selected = $list.find('li.selected')

    let $next

    function selectNextItem() {
      event.preventDefault()
      $selected.removeClass('selected')
      $next.addClass('selected')
    }

    switch (event.key) {
      case 'Down': // IE specific value
      case 'ArrowDown':
        $next = $selected.next()
        if ($next.length === 0) {
          $next = $list.find('li:first-child')
        }
        selectNextItem()
        break

      case 'Up': // IE specific value
      case 'ArrowUp':
        $next = $selected.prev()
        if ($next.length === 0) {
          $next = $list.find('li:last-child')
        }
        selectNextItem()
        break

      case 'Escape':
        closeSearchResults()
        break

      case 'Enter':
        if ($selected.length > 0) {
          event.preventDefault()
          document.location.href = $selected.find('a').attr('href')
        }
        break
    }
  })

  let fetching = false

  $searchInput.on('input', function() {
    if (fetching) return

    if (window.data) {
      showSearchResults()
      return
    }

    fetching = true
    $headerSearch.addClass('fetching')

    $.getJSON('/blog/data.json?1649354097208554264', function(data) {
      fetching = false
      $headerSearch.removeClass('fetching')

      indexData(data)
      showSearchResults()
    })
  })

  // NAVBAR ==>

  const $navbar = $('.navbar')

  if ($navbar.length > 0) {
    const $dropdown = $navbar.find('.dropdown')

    $dropdown.click(function(event) {
      event.stopPropagation()
      $dropdown.not(this).parent().removeClass('open')

      const $parent = $(this).parent()
      const $document = $(document)

      if ($parent.hasClass('open')) {
        $parent.removeClass('open')
        $document.off('click.dropdown')
      } else {
        $parent.addClass('open');
        $document.on('click.dropdown', function() {
          $parent.removeClass('open')
        })
      }
    })

    window.addEventListener('scroll', function () {
      $navbar.find('> .wrapper').toggleClass('sticky', window.scrollY > $header.height() + $header.offset().top)
    }, { passive: true })
  }

  // NEWSLETTER ==>

  $('#email').on('keyup', function() {
    $('#subscribe').attr({
      disabled: $('#email').val().trim().length === 0
    })
  })

  $('form.newsletter__form').on('submit', function(event) {
    event.preventDefault()
    const $email = $('#email')
    $email.blur()
    cta($email.val().trim())
    $('.newsletter').addClass('sent')
    return false
  })

  function cta(email) {
    $('#subscribe').attr({ disabled: true })
    if (email) {
      
        analytics.identify({ email: email })
        analytics.track('Subscribe Newsletter', { email: email })

        $.ajax({
          type: 'POST',
          url: 'https://decentraland.org/subscribe',
          data: {
            email: email,
            interest: 'blog'
          },
          crossDomain: true,
          success: console.log
        })
      
    }
  }

  // HEADINGS ==>

  const headings = document.querySelectorAll('h3[id]')

  for (var i = 0; i < headings.length; i++) {
    const anchorLink = document.createElement('a')
    anchorLink.innerText = '#'
    anchorLink.href = '#' + headings[i].id
    anchorLink.classList.add('anchor')

    headings[i].appendChild(anchorLink)
  }

  $('a[href*=\\#]').not('.no-smooth').on('click', function() {
    const $el = $(this.hash)
    if ($el.length > 0) {
      $('html,body').animate({ scrollTop: $el.offset().top - $header.height() }, 500)
    }
  })

  // LOAD MORE ==>

  var month = [
    
      
      "Jan",
    
      
      "Feb",
    
      
      "Mar",
    
      
      "Apr",
    
      
      "May",
    
      
      "Jun",
    
      
      "Jul",
    
      
      "Aug",
    
      
      "Sep",
    
      
      "Oct",
    
      
      "Nov",
    
      
      "Dec",
    
  ];

  var fullMonth = [
    
      
      "January",
    
      
      "February",
    
      
      "March",
    
      
      "April",
    
      
      "May",
    
      
      "June",
    
      
      "July",
    
      
      "August",
    
      
      "September",
    
      
      "October",
    
      
      "November",
    
      
      "December"
    
  ];

  const LANG = 'en'

  function formatDate(date, full) {
    var postDate = new Date(date);
    var postDay = postDate.getDate();
    var postYear = postDate.getFullYear();

    switch (LANG) {
      case 'zh':
        var postMonth = postDate.getMonth() + 1;
        return postYear + '年 ' + postMonth + '月 ' + postDay + '日'
      case 'ko':
        var postMonth = postDate.getMonth() + 1;
        return postYear + '년 ' + postMonth + '월 ' + postDay + '일'
      default:
        if (full) {
          var postMonth = fullMonth[postDate.getMonth()];
        } else {
          var postMonth = month[postDate.getMonth()];
        }
        return postMonth + ' ' + postDay + ', ' + postYear
    }
  }

  var categories = {
    
    "announcements": "Announcements",
    
    "project-updates": "Project Updates",
    
    "platform": "Platform",
    
    "technology": "Technology",
    
    "tutorials": "Tutorials",
    
  }

  var postsData;

  $.getJSON('/blog/feed.json?1649354097208554264', function(data) {
    postsData = data.items;
  });

  function addPostToGrid(postData) {
    if (!postData) return

    var postCategory = categories[postData.categories[0]];
    var postImage = postData.image;
    var postTitle = postData.title;
    var postURL = postData.url;

    $(".post-grid").append(
      '<div class="post">' +
        '<a href="' + postURL + '">' +
          '<div class="post__image" style="background-image: url(' + postImage + ')"></div>' +
        '</a>' +
        '<div class="post__info">' +
          '<span class="post__date">' + formatDate(postData.date_published, false) + '</span>' +
          '<span class="post__category">' +
            '<a href="/blog/' + postData.categories[0] + '/">' + postCategory + '</a>' +
          '</span>' +
          '<h3>' +
            '<a href="' + postURL + '">' + postTitle + '</a>' +
          '</h3>' +
        '</div>' +
      '</div>'
    );
  }

  function hideLoadMore(postsData) {
    if ($(".post-grid").find(".post").length == postsData.length) {
      $(".blog__load-more").hide();
    }
  }

  // Load More : HOME
  $(".homepage__load-more").on("click", function() {
    var postsDisplayedCount = $(".post-grid").find(".post").length;
    for (var i = postsDisplayedCount; i < postsDisplayedCount + 6; i += 1) {
      addPostToGrid(postsData[i]);
      hideLoadMore(postsData);
    }
  });

  // Load More : AUTHOR
  function loadMoreAuthor() {
    var postAuthor = $(".author__name").text();
    var postsByAuthor = [];
    var postsDisplayedCount = $(".post-grid").find(".post").length;

    for (var i = 0; i < postsData.length; i += 1) {
      if (postsData[i].author.name == postAuthor) {
        postsByAuthor.push(postsData[i]);
      }
    }

    for (
      var j = postsDisplayedCount;
      j < postsDisplayedCount + 6 && j < postsByAuthor.length;
      j += 1
    ) {
      addPostToGrid(postsByAuthor[j]);
      hideLoadMore(postsByAuthor);
    }
  }

  // $(".load-more__author").on("click", loadMoreAuthor);

  function addPostToList(postData) {
    if (!postData) return

    var postImage = postData.image;
    var postTitle = postData.title;
    var postURL = postData.url;

    var element = '<div>' +
        '<a href="' + postURL + '">' +
          '<div class="info">' +
            '<span class="date">' + formatDate(postData.date_published, true) + '</span>' +
            '<h3>' + postTitle + '</h3>' +
          '</div>';

    if (!postImage.match(postData.categories[0])) {
      element += '<div class="image">' +
        '<img src="' + postImage + '">' +
      '</div>';
    }

    element += '</a>' +
      '</div>';

    $(".post-list").append(element);
  }

  // Load More : CATEGORY
  function loadMoreCategory() {
    var postTag = $(".title").attr("ref")
    var postsByCategory = [];
    var postsDisplayedCount = $(".post-list").find("> div").length;

    for (var q = 0; q < postsData.length; q += 1) {
      if (postsData[q].categories[0] == postTag) {
        postsByCategory.push(postsData[q]);
      }
    }

    for (
      var h = postsDisplayedCount;
      h < postsDisplayedCount + 6 && h < postsByCategory.length;
      h += 1
    ) {
      addPostToList(postsByCategory[h]);
      hideLoadMore(postsByCategory);
    }
  }

  // $(".load-more__tag").on("click", loadMoreCategory);


  // INFINITE SCROLL ==>

  var $window = $(window);
  var $document = $(document);
  var $footer = $('footer');
  var isAuthorPage = !!$('.author')[0];
  var isCategoryPage = !!$('.category')[0];

  function handleInfiniteScroll() {
    if (!isAuthorPage && !isCategoryPage) return;

    var threshold = $document.height() - $window.height() - $footer.height();

    if (window.scrollY > threshold) {
      if (isAuthorPage) loadMoreAuthor();
      if (isCategoryPage) loadMoreCategory();
    }
  }

  window.addEventListener('scroll', handleInfiniteScroll, { passive: true });


  // LANGUAGE ==>

  function dismissLanguageBar() {
    Cookies.set('language', true, { expires: 365 })
    $('.select-language').removeClass('visible')
  }

  $('select#lang').on('change', function() {
    const value = $(this).val()
    dismissLanguageBar()
    $('select#lang').val(value)
    $('.lang-flag')
      .removeClass('en zh ko')
      .addClass(value)

    const sites = {
      en: 'https://decentraland.org',
      zh: 'https://decentraland.org/cn',
      ko: 'https://decentraland.org/kr'
    }

    const destination = document.location.pathname
    .replace('/cn', '')
    .replace('/kr', '')

    document.location.href = sites[value] + destination
  })

  $('.select-language .dismiss').click(dismissLanguageBar)

  if (!Cookies.get('language')) {
    $('.select-language').addClass('visible')
  }

  /*/ TOPBAR ==>
  $('.top .close').click(function() {
    Cookies.set('topbar', true, { expires: 30 })
    $('.top').removeClass('visible')
  })
  if (!Cookies.get('topbar')) {
    $('.top').addClass('visible')
  }
  /* */

})