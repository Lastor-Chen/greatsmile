const index = $('.productQty').length
for (let i = 0; i < index; i++) {

  // input 的數量大於 3 會出現提醒字樣，數量也會改為3
  $(`.productQty:eq(${i})`).bind('input propertychange', function () {
    const quantity = $(`.productQty:eq(${i})`).val()
    if (quantity > 3) {
      $(`.note:eq(${i})`).text('* 不可超過3樣')
      $(`.productQty:eq(${i})`).val(3)
    } else {
      $(`.note:eq(${i})`).text('')
    }
  })

  // 增加的數量點超過第三下會出現提醒字樣
  $(`.btn-add:eq(${i})`).on('click', function() {
    const quantity = $(`.productQty:eq(${i})`).val()
    if (quantity == 3 ) {
      $(`.note:eq(${i})`).text('* 不可超過3樣')
      return
    }

    $(`.productQty:eq(${i})`).val(+quantity + 1)
  })

  // 減少的數量等於 0 將不能再往下減
  $(`.btn-sub:eq(${i})`).on('click', function () {
    const quantity = $(`.productQty:eq(${i})`).val()
    if (quantity == 0) {
      return
    }
    $(`.note:eq(${i})`).text('')
    $(`.productQty:eq(${i})`).val(+quantity - 1)
  })
}

