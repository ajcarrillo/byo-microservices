/**
 * Resolves a DB shop order status to display correctly in the webapp
 * @param {*} status The status
 * @return {string} Capitalised first letter
 */
const resolveShopOrderStatus = (status) => status.charAt(0).toUpperCase() + status.slice(1)

/**
 * Resolves a DB shop payment status to display correctly in the webapp
 * @param {string} status The status
 * @return {string} The resolved payment status
 */
const resolveShopPaymentStatus = (status) => {
  let paymentStatus

  switch (status) {
  case 'payment_requested':
    paymentStatus = 'Pending'
    break
  case 'payment_processing':
    paymentStatus = 'Processing'
    break
  case 'payment_failed':
    paymentStatus = 'Failed'
    break
  case 'payment_succeeded':
    paymentStatus = 'Paid'
    break
  case 'payment_refunded':
    paymentStatus = 'Refunded'
    break
  default:
    paymentStatus = status
  }

  return paymentStatus
}

export {
  resolveShopOrderStatus,
  resolveShopPaymentStatus,
}
