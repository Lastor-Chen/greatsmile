// 排序 <select>
$('#sort').on('change', function() {
  // 取得 selected 排序
  const selectedValue = this.value
  const [sort, order] = selectedValue.split(',')
  let queryString = `?sort=${sort}&order=${order}`
  
  // 確認 search query
  const searchQuery = $('#searchQuery').data('q')
  if (searchQuery) {
    queryString = `?q=${searchQuery}&sort=${sort}&order=${order}` 
  } 

  window.location = queryString
})