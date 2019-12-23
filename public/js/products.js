// 排序 <select>
$('#sort').on('change', function() {
  const selectValue = this.value
  const [sort, order] = selectValue.split(',')
  const queryString = `?sort=${sort}&order=${order}`

  window.location = queryString
})