// checkout-2，運費計算
$('#shipForm').change((e) => {
  const radio = e.target

  const shipping = +(radio.value).split(',')[1]
  $('#shipping').text(shipping)
  
  const subtotal = +$('#subtotal').data('val')
  const total = (subtotal + shipping).toLocaleString()
  $('#total').text(total)
})

// checkout-3，帳單地址表單 show/hide 轉換
$('#toggle-check').change(() => {
  $('.toggle-form').toggle()
})
