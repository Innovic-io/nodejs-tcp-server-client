import { createConnection } from 'net';

const client = createConnection({ port: 8125 }, () => {
    console.log('connected to server');

    client.on('data', data => {
        console.log(data.toString());
    });

    client.write('London');
    client.write('Paris');
});

