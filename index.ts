import { createServer, IncomingMessage, ServerResponse } from "http";
import { createMember, login } from "./api";

const server = createServer((req: IncomingMessage, res: ServerResponse) => {
  switch (req.url) {
    case "/register":
      req.method === "POST" ? createMember(req, res) : sendNotFound(res);
      break;
    case "/login":
      req.method === "POST" ? login(req, res) : sendNotFound(res);
      break;
    default:
      sendNotFound(res);
  }

  function sendNotFound(res: ServerResponse) {
    res.writeHead(404, { "Content-Type": "text/plain" });
    res.end("Not Found");
  }
});

server.listen(3000, () => {
  console.log("Server is running on port 3000");
});
