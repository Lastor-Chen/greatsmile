function getQueryString() {
  let queryString = `?`

  // 確認 search query
  const searchQuery = $('#searchQuery').data('q')
  if (location.pathname === '/search') {
    queryString += `q=${searchQuery}&`
  }

  // 確認 category query
  const categoryQuery = $('#categoryQuery').data('category')
  if (categoryQuery) {
    queryString += `category=${categoryQuery}&`
  }

  return queryString
}

// 排序 <select>
$('#sort').on('change', function() {
  let queryString = getQueryString()
  const tagQuery = $('#tagQuery').data('tag')
  queryString += `tag=${tagQuery}&`

  // 取得 selected 排序
  const selectedValue = this.value
  const [sort, order] = selectedValue.split(',')
  queryString += `sort=${sort}&order=${order}`

  window.location = queryString
})

// Tag
$('.nav-tag').on('click', e => {
  if (e.target.matches('[data-tag]')) {
    let queryString = getQueryString()

    const tagValue = $(event.target).data('tag')
    queryString += `tag=${tagValue}`

    window.location = queryString
  }
})