const express = require("express")
const { Server: HttpServer } = require("http")
const { Server: SocketIOServer } = require("socket.io")
const dayjs = require("dayjs")
const customParseFormat = require('dayjs/plugin/customParseFormat')
const {getData,save,deleteAll,deleteById,getAll,getById,updateById} = require('./models/container.js')

dayjs.extend(customParseFormat)


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
  const allProduct = await getAll()
  socket.emit("all products", allProduct)
  
  
}

const guardarProducto = async (newProduct) =>{
    await save(newProduct)
    const allProduct = await getAll()
    io.sockets.emit("all products", allProduct)
}

/* -------------------------------------------------------------------------- */
/*                                    CHAT                                    */
/* -------------------------------------------------------------------------- */
const guardarMensaje = async (message) =>{
  const date = new Date()
  const dateFormated = dayjs(date).format('DD/MM/YYYY hh:mm:ss')
  const newMessage = { ...message, createdAt: `${dateFormated} hs` }
  await save(newMessage)
  const allMessage = await getAll()
  io.sockets.emit("all message", allMessage)
}

const enviarTodosLosMensajes = async (socket) => {
  const allMessage = await getAll()
  socket.emit("all message", allMessage)
  
}
