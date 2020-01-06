$(window).scroll(() => {
  // navbar sticky
  if ($(window).scrollTop() >= 224) {
    $('#navbar').css('visibility', 'hidden')
    $('#stickybar').css('visibility', 'visible')
  } else {
    $('#navbar').css('visibility', 'visible')
    $('#stickybar').css('visibility', 'hidden')
  }

  // back-top 按鈕，隨 scrollbar 出現/消失
  if ($(window).scrollTop() > 500) {
    $('.back-top').fadeIn()
  } else {
    $('.back-top').fadeOut()
  }
})

// scroll to top 特效
$('.back-top').click(() => {
  $("html, body").animate({ scrollTop: 0 }, 500)
})

// cartAlert 自動消失
if ($('.cart-alert').length) {
  setTimeout(() => {
    $('.cart-alert').alert('close')
  }, 5000)
}

