$("#image").change(function () {
  readImgUrl(this);
})


function readImgUrl(input) {
  if (input.files && input.files[0]) {
    console.log(input.files)
    let reader = new FileReader()
    reader.onload = function (e) {
      $("#preview_img").attr('src', e.target.result)
    }
    reader.readAsDataURL(input.files[0])
  }
}