// back-top 按鈕，隨 scrollbar 出現/消失
$(window).scroll(() => {
  const scrollTop = $(window).scrollTop()
  if (scrollTop > 500) return $('.back-top').fadeIn()

  $('.back-top').fadeOut()
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

window.onscroll = function () { myFunction() }
var navbar = document.getElementById("navbar")
let stickybar = document.getElementById("stickybar")
var stickyRange = navbar.offsetTop + 224
function myFunction() {
  if (window.pageYOffset >= stickyRange) {
    navbar.style.visibility = "hidden"
    stickybar.style.visibility = "visible"
  } else {
    navbar.style.visibility = "visible"
    stickybar.style.visibility = "hidden"
  }
}