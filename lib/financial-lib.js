const addFloatValues = (values) => {
  if (values.length > 1) {
    let total = 0
    values.forEach((v) => {
      if (typeof v === 'string') {
        const fl = parseFloat(v)
        total += (fl * 100)
      }
    })

    return (total / 100).toFixed(2).toString()
  } else {
    return values[0] || '0.00'
  }
}

const multiplyFloatValues = (value, multiplier) => {
  if (typeof value === 'string' && typeof multiplier === 'string') {
    const v = parseFloat(value)
    const m = parseFloat(multiplier)
    const result = (v * 100) * m
    return (result / 100).toFixed(2).toString()
  } else {
    return '0.00'
  }
}

export {
  addFloatValues,
  multiplyFloatValues,
}
