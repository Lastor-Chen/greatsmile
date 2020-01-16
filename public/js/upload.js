$("#image").change(function () {
  readImgUrl(this);
})


$(document).on('change', '.inputImg', function () {
  showEditImg(this)
})


function readImgUrl(input) {
  if (input.files && input.files[0]) {

    let reader = new FileReader()
    reader.onload = function (e) {
      $("#preview_img").attr('src', e.target.result)
    }
    reader.readAsDataURL(input.files[0])

  }
}

function showEditImg(input) {
  if (input.files && input.files[0]) {

    let reader = new FileReader()
    reader.onload = function (e) {
      input.nextElementSibling.src =  e.target.result
    }
    reader.readAsDataURL(input.files[0])

  }
}
