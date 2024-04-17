import { createServer, IncomingMessage, ServerResponse } from "http";
import {
  createMember,
  login,
  createPatient,
  getPatients,
  createAppointment,
} from "./api";

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
    req.url.split("/")[1] === "getPatients" &&
    req.method === "GET"
  ) {
    return getPatients(req, res);
  }

  if (req.url === "/createAppointment" && req.method === "POST") {
    return createAppointment(req, res);
  }

  res.writeHead(404, { "Content-Type": "text/plain" });
  res.end("Not Found");
});

server.listen(3000, () => {
  console.log("Server is running on port 3000");
});
