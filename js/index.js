'use strict'
//requiriendo dependencias 
const express = require('express')
const socketio = require('socket.io')
const http = require('http')
const path = require('path')

const app = express() //instancia de express
const server = http.createServer(app) //creando el server con http y express como handle request
const io = socketio(server) //iniciando el server de socket.io
const PORT = process.env.PORT || 3000

app.use(express.static(path.join(__dirname, '../dist/mapa-tk102'))) //middleware de express para archivos estaticos

module.exports = {
    server,
    io
}