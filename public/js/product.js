$(document).ready(function () {
  $('.gallery-main').slick({
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: true,
    fade: true,
    infinite: false,
    asNavFor: '.gallery-nav'
  })

  $('.gallery-nav').slick({
    slidesToShow: 5.5,
    arrows: false,
    infinite: false,
    focusOnSelect: true,
    asNavFor: '.gallery-main',
    responsive: [
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 4.5,
        }
      },
    ]
  })

  lightbox.option({
    'fitImagesInViewport': false,
    'maxWidth': 720
  })
})