export const sortSearchParams = (params: URLSearchParams): URLSearchParams => {
  const sortedParams = new URLSearchParams()
  const fixedOrderKeys = ['PAGEN_1','category', 'subcategory', 'brend']
  const allKeys = Array.from(params.keys())

  // Ключі, які не входять до фіксованого порядку
  const otherKeys = allKeys.filter(key => !fixedOrderKeys.includes(key)).sort()

  // Об'єднуємо ключі у правильному порядку
  const sortedKeys = [...fixedOrderKeys, ...otherKeys].filter(key =>
    allKeys.includes(key)
  )

  // Додаємо значення до нового об'єкта URLSearchParams у відсортованому порядку
  for (const key of sortedKeys) {
    const value = params.get(key)
    if (value !== null) {
      sortedParams.set(key, value)
    }
  }

  return sortedParams
}
