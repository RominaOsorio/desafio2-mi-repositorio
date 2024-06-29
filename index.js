/* eslint-disable n/no-path-concat */
const express = require('express')
const fs = require('fs')
const app = express()
app.use(express.json())

app.get('/', (req, res) => {
  console.log(__dirname)
  res.sendFile(__dirname + '/index.html')
})

app.get('/canciones', (req, res) => {
  try {
    const response = fs.readFileSync('repositorio.json')
    const canciones = JSON.parse(response)
    console.log(canciones)
    res.status(200).json(canciones)
  } catch (error) {
    res.status(404).send('Error al obtener la informacion')
  }
})

app.post('/canciones', (req, res) => {
  try {
    const { id, titulo, artista, tono } = req.body
    if (id === undefined || titulo === undefined || artista === undefined || tono === undefined) {
      throw new Error('Todos los campos son obligatorios')
    }
    console.log(req.body)
    const cancion = req.body
    const canciones = JSON.parse(fs.readFileSync('repositorio.json'))
    canciones.push(cancion)
    fs.writeFileSync('repositorio.json', JSON.stringify(canciones))
    res.status(200).json({ message: 'Cancion agregada con exito' })
  } catch (error) {
    res.status(400).send(`No se pudo crear la cancion ${error.message}`)
  }
})

app.put('/canciones/:id', (req, res) => {
  try {
    const { id } = req.params
    const cancion = req.body
    const canciones = JSON.parse(fs.readFileSync('repositorio.json'))
    // eslint-disable-next-line eqeqeq
    const index = canciones.findIndex(cancion => cancion.id == id)
    console.log(index)
    index === -1
      ? res.status(404).send('No existe la cancion')
      : canciones[index] = cancion
    fs.writeFileSync('repositorio.json', JSON.stringify(canciones, null, 2))
    res.status(200).json({ message: 'cancion actualizada con exito' })
  } catch (error) {
    res.status(501).json({ message: `No se pudo conectar al servidor ${error.message}` })
  }
})

app.delete('/canciones/:id', (req, res) => {
  try {
    const { id } = req.params
    const canciones = JSON.parse(fs.readFileSync('repositorio.json'))
    // eslint-disable-next-line eqeqeq
    const index = canciones.findIndex(cancion => cancion.id == id)
    console.log(index)
    index === -1
      ? res.status(404).send('No existe la cancion, no puede ser eliminada')
      : canciones.splice(index, 1)
    fs.writeFileSync('repositorio.json', JSON.stringify(canciones, null, 2))
    res.status(200).json({ message: 'cancion eliminada con exito' })
  } catch (error) {
    res.status(400).json({ message: `No se pudo eliminar la cancion ${error.message}` })
  }
})

app.listen(3000, () => console.log('Estoy funcionando en el puerto 3000'))
