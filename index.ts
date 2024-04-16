import { createServer, IncomingMessage, ServerResponse } from "http";
import { createMember, login, createPatient, getPatients } from "./api";

const server = createServer((req: IncomingMessage, res: ServerResponse) => {
  if (req.url === "/register" && req.method === "POST") {
    return createMember(req, res);
  }

  if (req.url === "/login" && req.method === "POST") {
    return login(req, res);
  }

  if (req.url === "/createPatient" && req.method === "POST") {
    return createPatient(req, res);
  }

  if (
    req.url &&
    req.url.split("/")[1] === "getPatient" &&
    req.method === "GET"
  ) {
    return getPatients(req, res);
  }

  res.writeHead(404, { "Content-Type": "text/plain" });
  res.end("Not Found");

  // switch (req.url) {
  //   case "/register":
  //     req.method === "POST" ? createMember(req, res) : sendNotFound(res);
  //     break;
  //   case "/login":
  //     req.method === "POST" ? login(req, res) : sendNotFound(res);
  //     break;
  //   case "/createPatient":
  //     req.method === "POST" ? createPatient(req, res) : sendNotFound(res);
  //     break;
  //   case "/getPatient/:patientId":
  //     req.method === "GET" ? getPatient(req, res) : sendNotFound(res);
  //     break;
  //   default:
  //     sendNotFound(res);
  // }

  // function sendNotFound(res: ServerResponse) {
  //   res.writeHead(404, { "Content-Type": "text/plain" });
  //   res.end("Not Found");
  // }
});

server.listen(3000, () => {
  console.log("Server is running on port 3000");
});
