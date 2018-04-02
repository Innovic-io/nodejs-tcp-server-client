# NodeJS TSP Server Client communication

Showcase of TCP ( server to client ) communication implemented in NodeJS programming language. Example application consists of Server 
script and client script, which run separately. 

Upon connecting to a server the user is prompted to enter the name of a city. If the city exists the app returns its current 
weather and temperature.

## How To Use it

First, we need to create TCP Server:
```npm
npm run server
```

Than we can connect to Server using Client script.
```npm
npm run client
```

Or you can connect using telnet with:

```bash
telnet localhost 8215
```

**Server is bound to all network interfaces, and therefore available to every computer on network.**


[Net NodeJS](https://nodejs.org/api/net.html)