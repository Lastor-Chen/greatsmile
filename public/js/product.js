$(document).ready(function () {
  $('.slider-for').slick({
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: true,
    fade: true,
    infinite: false,
    asNavFor: '.slider-nav'
  })

  $('.slider-nav').slick({
    slidesToShow: 5.5,
    slidesToScroll: 5,
    arrows: false,
    asNavFor: '.slider-for',
    infinite: false,
    focusOnSelect: true
  })
})