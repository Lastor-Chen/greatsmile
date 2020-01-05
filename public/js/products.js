// 排序 <select>
$('#sort').on('change', function() {
  // 取得 selected 排序
  const selectedValue = this.value
  const [sort, order] = selectedValue.split(',')
  let queryString = `?`
  
  // 確認 search query
  const searchQuery = $('#searchQuery').data('q')
  if (searchQuery) {
    queryString += `q=${searchQuery}&`
  } 

  // 確認 category query
  const categoryQuery = $('#categoryQuery').data('category')
  if (categoryQuery) {
    queryString += `category=${categoryQuery}&`
  } 
  
  // 最後加上 selected 排序
  queryString += `sort=${sort}&order=${order}`

  window.location = queryString
})

// Tag
$('.nav-tag').on('click', e => {
  let queryString = `?`
 
  // 確認 search query
  const searchQuery = $('#searchQuery').data('q')
  if (searchQuery) {
    queryString += `q=${searchQuery}&`
  }

  // 確認 category query
  const categoryQuery = $('#categoryQuery').data('category')
  if (categoryQuery) {
    queryString += `category=${categoryQuery}&`
  }

  // 取得 tag
  if (e.target.matches('.btn-sm')) {
    const tagValue = $(e.target).data('tag')
    queryString += `tag=${tagValue}`
  }

  window.location = queryString 
})  