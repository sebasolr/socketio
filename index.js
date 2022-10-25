const express = require("express")
const { Server: HttpServer } = require("http")
const { Server: SocketIOServer } = require("socket.io")
const dayjs = require("dayjs")
const customParseFormat = require('dayjs/plugin/customParseFormat')

dayjs.extend(customParseFormat)

const Product = require("./models/product/product.model")
const Message = require("./models/message/message.model")

const app = express()
const httpServer = new HttpServer(app)
const io = new SocketIOServer(httpServer)

const PORT = 8080

app.use(express.static("./public"))

httpServer.listen(PORT, () => console.log(`Running on port: ${PORT}`))

io.on('connection', socket => {
  enviarTodosLosProductos(socket)
  enviarTodosLosMensajes(socket)

  socket.on("new product", newProduct =>{
    guardarProducto(newProduct)
  })

  socket.on("new message", nuevoMensaje => {
    guardarMensaje(nuevoMensaje)
  })

})

/* -------------------------------------------------------------------------- */
/*                                  PRODUCTOS                                 */
/* -------------------------------------------------------------------------- */

const enviarTodosLosProductos = async (socket) => {
  const allProduct = await Product.getAll()
  socket.emit("all products", allProduct)
  
  
}

const guardarProducto = async (newProduct) =>{
    await Product.save(newProduct)
    const allProduct = await Product.getAll()
    io.sockets.emit("all products", allProduct)
}

/* -------------------------------------------------------------------------- */
/*                                    CHAT                                    */
/* -------------------------------------------------------------------------- */
const guardarMensaje = async (message) =>{
  const date = new Date()
  const dateFormated = dayjs(date).format('DD/MM/YYYY hh:mm:ss')
  const newMessage = { ...message, createdAt: `${dateFormated} hs` }
  await Message.save(newMessage)
  const allMessage = await Message.getAll()
  io.sockets.emit("all message", allMessage)
}

const enviarTodosLosMensajes = async (socket) => {
  const allMessage = await Message.getAll()
  socket.emit("all message", allMessage)
  
}
