// 同步"更新 form" 裡的 hidden input
const index = $('.productQty').length
for (let i = 0; i < index; i++) {
  $(`.productQty:eq(${i})`).bind('input propertychange', function () {
    const quantity = $(`.productQty:eq(${i})`).val()
    
    // input 的數量大於 3 會出現提醒字樣，數量也會改為3
    if (quantity > 3) {
      $(`.note:eq(${i})`).text('* 不可超過3樣')
      $(`.productQty:eq(${i})`).val(3) 
      $(`.productQty2:eq(${i})`).val(3)
    } else {
      $(`.note:eq(${i})`).text('')
      $(`.productQty2:eq(${i})`).val(quantity)
    }
  })
}