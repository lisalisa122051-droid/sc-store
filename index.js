const {
  default: makeWASocket,
  useMultiFileAuthState
} = require("@whiskeysockets/baileys")
const pino = require("pino")
const config = require("./config")
const menu = require("./features/menu")
const produk = require("./features/produk")
const beli = require("./features/beli")

async function startBot() {
  const { state, saveCreds } = await useMultiFileAuthState("./session")
  const sock = makeWASocket({
    logger: pino({ level: "silent" }),
    auth: state,
    printQRInTerminal: true
  })

  sock.ev.on("creds.update", saveCreds)

  sock.ev.on("messages.upsert", async (msg) => {
    const m = msg.messages[0]
    if (!m.message) return

    const jid = m.key.remoteJid
    const text = m.message.conversation || m.message.extendedTextMessage?.text
    const buttonId = m.message?.listResponseMessage?.singleSelectReply?.selectedRowId

    console.log("Pesan masuk:", text)

    // MENU
    if (text === "menu") {
      const data = menu()
      return sock.sendMessage(jid, {
        text: "Silakan pilih menu:",
        buttonText: "Buka Menu",
        sections: data.sections
      })
    }

    // PRODUK
    if (buttonId === "produk") {
      const data = produk()
      return sock.sendMessage(jid, {
        text: "Pilih produk:",
        buttonText: "Lihat Produk",
        sections: data.sections
      })
    }

    // ADMIN
    if (buttonId === "admin") {
      return sock.sendMessage(jid, {
        text: `Hubungi admin:\n${config.adminWa}`
      })
    }

    // BELI PRODUK
    if (buttonId?.startsWith("beli_")) {
      const nama = buttonId.replace("beli_", "").toUpperCase()
      return sock.sendMessage(jid, {
        text: beli(nama)
      })
    }
  })
}

startBot()
