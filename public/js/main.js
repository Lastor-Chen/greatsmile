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

// sticky效果
window.onscroll = function () { myFunction() };
var navbar = document.getElementById("navbar");
var sticky = navbar.offsetTop;
function myFunction() {
  if (window.pageYOffset >= sticky) {
    navbar.classList.add("sticky")
  } else {
    navbar.classList.remove("sticky");
  }
}