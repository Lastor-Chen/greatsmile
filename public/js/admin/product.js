$("#image").change(function () {
  readImgUrl(this);
})

function readImgUrl(input) {
  if (input.files && input.files.length >= 0) {
    for (let i = 0; i < input.files.length; i++) {
      let reader = new FileReader();
      reader.onload = function (e) {
        let img = `
        <div class="mx-1">
          <label class="d-block">
            <img src=${e.target.result} class="img-thumbnail mx-1" style="width: 100px">
          </label>
        </div>
        `
        $('#images').append(img);
      }
      reader.readAsDataURL(input.files[i]);
    }
  }
}