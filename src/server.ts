import { createServer } from 'net';
import * as requestPromise from 'request-promise';

let connected = 0;

const server = createServer(socket => {
    console.log(`Client connected! (${++connected})`);
    socket.write(`Welcome, user!\nRemote address: ${socket.remoteAddress} Port: ${socket.remotePort}\nEnter the name of the city:\n`);

    socket.on('end', () => {
        console.log(`Client diconnected. (${--connected})`);
    });
    socket.on('data', onData );

    async function onData(data){
        socket.write(`Weather around the area ${data}${await getWeather(data)}\n`);
    }
});



server.on('error', err => {
    throw err
});
server.listen({ port: 8125, host: '0.0.0.0' }, () => {
    console.log('Server bound.')
});

async function getWeather(data) {

    const city =  await requestPromise ({
        method: 'GET',
        uri: `https://www.metaweather.com/api/location/search/?query=${data}`,
        json: true,
    });
    const latlong = city.map(value => value["latt_long"]);

    const weather = await requestPromise ({
        method: 'GET',
        uri: `https://api.darksky.net/forecast/47c436a7e96c14385cb23a90b2435f05/${latlong}?units=si&lang=en`,
        json: true,
    });
    const sentence = `Currently: ${weather["currently"]["summary"]}\nTemperature: ${weather["currently"]["temperature"].toPrecision(1)}`;
    return sentence ;
}


/*
 * const server = createServer((socket) => {
    sockets.push(socket);

    console.log(`Client connected. Clients connected: ${sockets.length}`);
    //console.log(socket);

    socket.on('end', () => {
        console.log('Client disconnected');
    });

    socket.on('data', data => {
        sockets.forEach(socket => socket.write(data.toString()));
    });


    socket.write('Welcome to Miami.\r\t');
    socket.pipe(socket);
});

 server.on('error', err => {
    throw err;
});
 server.listen({ port: 8124, host: '0.0.0.0' }, () => {
    console.log('Server bound');
});*/