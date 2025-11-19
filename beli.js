const config = require("../config")

module.exports = function (produk) {
  return `
🛒 *PESAN PRODUK*

Produk: ${produk}
Status: Tersedia

Klik link berikut untuk order:
${config.adminWa}

Terima kasih telah berbelanja di ${config.botName}!
`
}
