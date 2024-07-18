import {connectDB} from "./database.js";
import {server} from "./app.js";
import {PORT} from "./config/constantes.js";



await connectDB();

server.listen(PORT, () => {
    console.log(`Api en http://localhost:${PORT}`)
});

