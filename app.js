const mongo = require('mongodb').MongoClient
const client = require('socket.io').listen(4000).sockets
var url = 'mongodb://localhost:27017/mychat'

//Connect to mongodb
mongo.connect(url, (err, db) => {
    if (err) {
        throw err
    }
    console.log("Connected correctly to server");
    //Connect to socket.io
    client.on('connection', () => {
        let chat = db.collection('chat')
        //Function to send status
        sendStatus = (s) => {
            socket.emit('status', s)
        }
        //Get chats from mongo collection
        chat.find().limit(100).sort({ _id: 1 }).toArray((err, res) => {
            if (err) {
                throw err
            }
            socket.emit('output', res)
        })

        socket.on('input', (data) => {
            let name = data.name
            let message = data.message

            if (name == '' || mesage == '') {
                sendStatus('Nombre y mensaje requeridos')
            } else {
                chat.insert({ name: name, message: message }, () => {
                    client.emit('output', [data])
                    sendStatus({
                        message: 'Mensaje enviado',
                        clear: true
                    })
                })
            }
        })

        socket.on('clear', (data)=>{
            chat.remove({}, ()=>{
                socket.emit('Borrados')
            })
        })

    })

});