// 掛上 input 加減按鈕功能
$('.cart-product').on('click', e => {
  if (e.target.matches('.btn-add')) {
    const btnAdd = $(e.target).prev()

    const quantity = +btnAdd.val()
    btnAdd.val(quantity + 1)

    btnAdd.change()  // 手動觸發 input change
  }

  if (e.target.matches('.btn-sub')) {
    const btnSub = $(e.target).next()

    const quantity = +btnSub.val()
    btnSub.val(quantity - 1)

    btnSub.change()
  }
})

// 監控 input 商品數量
$('.cart-product').on('change', e => {
  if (e.target.matches('.productQty')) {
    const quantity = +e.target.value
    const note = $(e.target).parents('.note-flag').next()

    // 不得小於 0
    if (quantity < 0) return e.target.value = 0

    // 不得大於 3
    if (quantity > 3) {
      e.target.value = 3
      return note.text('* 不可超過3樣')
    }

    note.text('')
  }
})
