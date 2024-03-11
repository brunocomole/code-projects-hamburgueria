const express = require('express')
const app = express()
const port = 3000
const uuid = require('uuid')
app.use(express.json())

const orders = []

const checkId = (request, response, next) => {
  const { id } = request.params 

  const index = orders.findIndex(order => order.id === id) 

  if (index < 0) {
    return response.status(404).json({ message: "Not Found" })
  }

  request.orderIndex = index
  request.orderId = id
  next()
}

const checktUrl = (request, response, next) => {
  console.log(request.method)
  console.log(request.url)

  next()
}

app.post('/orders', checktUrl, (request, response) => {
  const { order, clientName, price } = request.body 
  const status = "Em preparação"
  const newOrder = { id: uuid.v4(), order, clientName, price, status } 

  orders.push(newOrder) 

  return response.status(201).json(newOrder) 
})

app.get('/orders', checktUrl, (request, response) => {
  return response.json(orders)  
})

app.put('/orders/:id', checkId, checktUrl, (request, response) => {
  const { order, clientName, price } = request.body
  const index = request.orderIndex
  const id = request.orderId

  const updateOrder = { id, order, clientName, price } 

  orders[index] = updateOrder 

  return response.json(updateOrder)
})

app.delete('/orders/:id', checkId, checktUrl, (request, response) => {
  const index = request.orderIndex

  orders.splice(index, 1)

  return response.status(204).json()
})

app.get('/orders/:id', checkId, checktUrl, (request, response) => {
  const index = request.orderIndex

  const viewOrder = orders[index]

  return response.json(viewOrder)
})

app.patch('/orders/:id', checkId, checktUrl, (request, response) => {
  const { order, clientName, price } = request.body
  const id = request.orderId
  const index = request.orderIndex
  const orderReady = {
    id,
    order: orders[index].order,
    clientName: orders[index].clientName,
    price: orders[index].price,
    status: "Pronto"
  }

  orders[index] = orderReady

  return response.json(orderReady)
})


app.listen(port, () => {
    console.log(`🚀 Server started on port ${port}`)
})