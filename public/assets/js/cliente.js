const socket = io("http://localhost:8080")

/* -------------------------------- PRODUCTOS ------------------------------- */
const productForm = document.getElementById('product-form')
const productsContainer = document.getElementById('products')
/* ---------------------------------- CHAT ---------------------------------- */
const chatForm = document.getElementById('chat')
const chatContainer = document.getElementById('chatContainer')


productForm.addEventListener('submit', (e) =>{
  e.preventDefault()
  const formData = new FormData(productForm)
  const formValues = Object.fromEntries(formData)
  productForm.reset()
  socket.emit("new product", formValues)
  console.log("🚀 ~ file: cliente.js ~ line 8 ~ productForm.addEventListener ~ formValues", formValues)
})

socket.on("all products", allProduct => {
  console.log("🚀 ~ file: cliente.js ~ line 16 ~ allProduct", allProduct)
  renderizadoProductos(allProduct)
})

const renderizadoProductos = async (products) => {
    const respuesta = await fetch('/assets/templates/product.template.handlebars')
    const template = await respuesta.text()
    // compile the template
    const compiledTemplate = Handlebars.compile(template);
    // execute the compiled template and print the output to the console
    const html = compiledTemplate({products})
    productsContainer.innerHTML = html
} 



/* -------------------------------------------------------------------------- */
/*                                    CHAT                                    */
/* -------------------------------------------------------------------------- */

chatForm.addEventListener('submit', (e) =>{
  e.preventDefault()
  const formData = new FormData(chatForm)
  const formValues = Object.fromEntries(formData)
  chatForm.reset()
  socket.emit("new message", formValues)
})

socket.on("all message", allMessage => {
  renderizadoMensajes(allMessage)
})

const renderizadoMensajes = async (messages) => {
  console.log("🚀 ~ file: cliente.js ~ line 54 ~ renderizadoMensajes ~ messages", messages)
  const respuesta = await fetch('/assets/templates/chat.template.handlebars')
  const template = await respuesta.text()
  // compile the template
  const compiledTemplate = Handlebars.compile(template);
  // execute the compiled template and print the output to the console
  const html = compiledTemplate({messages})
  chatContainer.innerHTML = html
} 
