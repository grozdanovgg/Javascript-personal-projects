const config = require('./server-config');
const app = require('./app')

app.init(config)
    .then((app) => {
        app.listen(config.port, () => {
            console.log(`Magic is running at port ${config.port}`);
        });
    });
