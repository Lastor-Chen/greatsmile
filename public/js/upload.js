$("#image").change(function () {
  readURL(this);
})


function readURL(input) {
  if (input.files && input.files[0]) {
    let reader = new FileReader();
    reader.onload = function (e) {
      $("#preview_img").attr('src', e.target.result);
    }
    reader.readAsDataURL(input.files[0]);
  }
}