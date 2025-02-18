import { createServer } from "node:http";
import next from "next";
import { Server } from "socket.io";

const dev = process.env.NODE_ENV !== "production";
const hostname = "localhost";
const port = 3000;
// when using middleware `hostname` and `port` must be provided below
const app = next({ dev, hostname, port });
const handler = app.getRequestHandler();

app.prepare().then(() => {
    const httpServer = createServer(handler);

    const io = new Server(httpServer);

    io.on("connection", (socket) => {
        // ...
        console.log("a new connection was made");

        socket.emit("connected", "You have connected successfully");

        socket.on("loanPage", () => {
            console.log("I am on the loan Page");
        });

        socket.on("newLoanApplicationSubmited", () => {
            console.log("a new loan application was made");
            socket.emit(
                "notifyAdmin",
                "A new loan application has been sent and needs your approval"
            );
        });
    });

    httpServer
        .once("error", (err) => {
            console.error(err);
            process.exit(1);
        })
        .listen(port, () => {
            console.log(`> Ready on http://${hostname}:${port}`);
        });
});