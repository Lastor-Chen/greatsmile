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