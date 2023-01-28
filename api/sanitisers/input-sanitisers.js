/**
 * Sanitises a string to remove HTML tags
 * @param {string} value The string to sanitise
 * @return {string} The sanitised string
 */
const removeHTMLTags = (value) => {
  if (value) {
    return value.replace(new RegExp('<[^>]*>', 'g'), '')
  } else {
    return value
  }
}

export {
  removeHTMLTags,
}
