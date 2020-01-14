$("#image").change(function () {
  console.log('yo')
  readImgUrl(this);
})

// function readImgUrl(input) {
//   if (input.files && input.files[0]) {

//     let reader = new FileReader()
//     reader.onload = function (e) {
//       $("#preview_img").attr('src', e.target.result)
//     }
//     reader.readAsDataURL(input.files[0])

//   }
// }

function readImgUrl(input) {
  if (input.files && input.files.length >= 0) {
    console.log('in')
    for (let i = 0; i < input.files.length; i++) {
      console.log(i)
      let reader = new FileReader();
      reader.onload = function (e) {
        let img = `
        <div class="mx-1">
          <label class="d-block">
            <img src=${e.target.result} class="img-thumbnail mx-1" style="width: 100px">
          </label>
        </div>
        `
        // $("<img width='200' height='150'>").attr('src', e.target.result);
        console.log(img)
        $('#images').append(img);
      }
      reader.readAsDataURL(input.files[i]);
    }
  }
}