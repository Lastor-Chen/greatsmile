function checkName(elem) {
  const isName = $(elem).val().trim().length > 0
  if (!isName) {
    elem.setCustomValidity('尚未輸入')
    $(elem).addClass('is-invalid')
  } else {
    elem.setCustomValidity('')
    $(elem).removeClass('is-invalid')
    $(elem).addClass('is-valid')
  }
}

function checkEmail(elem) {
  const isMail = /^\w+((-\w+)|(\.\w+))*\@[A-Za-z0-9]+((\.|-)[A-Za-z0-9]+)*\.[A-Za-z]+$/.test($(elem).val())
  if (!isMail) {
    elem.setCustomValidity('格式錯誤')
    $(elem).addClass('is-invalid')
  } else {
    elem.setCustomValidity('')
    $(elem).removeClass('is-invalid')
    $(elem).addClass('is-valid')
  }
}

function checkPassword(elem) {
  const isPassword = $(elem).val().trim().length > 5
  if (!isPassword) {
    elem.setCustomValidity('格式錯誤')
    $(elem).addClass('is-invalid')
    console.log(isPassword)
  } else {
    elem.setCustomValidity('')
    $(elem).removeClass('is-invalid')
    $(elem).addClass('is-valid')
  }
}

//套用 Bootstrap Form 驗證
$('.needs-validation').submit(e => {
  e.preventDefault()

  // setup 自定義驗證
  checkEmail($('input[name=email]')[0])
  checkName($('input[name=lastName]')[0])
  checkPassword($('input[name=password]')[0])

  const form = e.target
  if (!form.checkValidity()) return $(form).addClass('was-validated')

  form.submit()
})

$('.needs-validation').change(e => {
  if (e.target.matches('input[name=lastName]')) {
    checkName(e.target)
  }

  if (e.target.matches('input[name=firstName]')) {
    checkName(e.target)
  }

  if (e.target.matches('input[name=email]')) {
    checkEmail(e.target)
  }

  if (e.target.matches('input[name=password]')) {
    checkPassword(e.target)
  }
})

