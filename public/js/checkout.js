function checkPostCode(elem) {
  const postCode = $(elem).val()
  if (isNaN(postCode) || postCode.length !== 5) {
    elem.setCustomValidity('格式錯誤')
    $(elem).addClass('is-invalid')
  } else {
    elem.setCustomValidity('')
    $(elem).removeClass('is-invalid')
    $(elem).addClass('is-valid')
  }
}

function checkPhone(elem) {
  const phone = $(elem).val()
  if (!/^09\d{2}(-?\d{3}){2}$/.test(phone)) {
    elem.setCustomValidity('格式錯誤')
    $(elem).addClass('is-invalid')
  } else {
    elem.setCustomValidity('')
    $(elem).removeClass('is-invalid')
    $(elem).addClass('is-valid')
  }
}

// checkout-1，套用 Bootstrap Form 驗證
$('.needs-validation').submit(e => {
  e.preventDefault()

  // setup 自定義驗證
  checkPostCode($('input[name=postCode]')[0])
  checkPhone($('input[name=phone]')[0])

  const form = e.target
  if (!form.checkValidity()) return $(form).addClass('was-validated')

  form.submit()
})

$('.needs-validation').change(e => {
  if (e.target.matches('input[name=postCode]')) {
    checkPostCode(e.target)
  }
  
  if (e.target.matches('input[name=phone]')) {
    checkPhone(e.target)
  }
})

// checkout-2，運費計算
$('#shipForm').change((e) => {
  const radio = e.target

  const shipping = +$(radio).data('price')
  $('#shipping').text(shipping)
  
  const subtotal = +$('#subtotal').data('val')
  const total = (subtotal + shipping).toLocaleString()
  $('#total').text(total)
})

// checkout-3，帳單地址表單 show/hide 轉換
$('#toggle-check').change(() => {
  $('.toggle-form').toggle()
})
