import { createServer } from 'net';
import * as requestPromise from 'request-promise';

let connected = 0, port = 0;
const sockets = [];

const server = createServer(socket => {
    sockets.push({ 'socket': socket, 'port': socket.remotePort });

    console.log(`Client connected! (${++connected})`);
    socket.write(`Welcome, user!\nRemote address: ${socket.remoteAddress} Port: ${socket.remotePort}\nEnter the name of the city:\n`);
    //socket.pipe(socket);

    socket.on('end', () => {
        console.log(`Client disconnected. (${--connected})`);
        sockets.splice(sockets.indexOf(socket), 1);
    });

    socket.on('data', onData);

    async function onData(data) {

        const socketData = `Weather around the area ${data}${await getWeather(data.toString())}\nEnter the name of the city:\n`;
        broadcastMessage(socketData);
    }

    function broadcastMessage(socketData) {
        sockets.forEach(socket => {
            // if(socket.socket.)
            socket.socket.write(socketData)
        });
    }
});


server.on('error', err => {
    throw err
});
server.listen({ port: 8125, host: '0.0.0.0' }, () => {
    console.log('Server bound.')
});


async function getWeather(data) {

    let sentence;
    try {

        const city = await requestPromise({
            method: 'GET',
            uri: `https://www.metaweather.com/api/location/search/?query=${data}`,
            json: true,
        });
        const latlong = city.map(value => value["latt_long"]);

        const weather = await requestPromise({
            method: 'GET',
            uri: `https://api.darksky.net/forecast/47c436a7e96c14385cb23a90b2435f05/${latlong}?units=si&lang=en`,
            json: true,
        });
        sentence = `Currently: ${weather["currently"]["summary"]}\nTemperature: ${weather["currently"]["temperature"].toFixed(0)}`;

    }
    catch (e) {
        sentence = `Cannot find the entered city.\n`;
    }
    finally {
        return sentence;
    }
}