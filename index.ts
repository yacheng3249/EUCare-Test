import { createServer, IncomingMessage, ServerResponse } from "http";
import {
  createMember,
  login,
  createPatient,
  getPatients,
  createAppointment,
} from "./api";

interface Routes {
  [method: string]: {
    [url: string]: (req: IncomingMessage, res: ServerResponse) => void;
  };
}

const routes: Routes = {
  POST: {
    register: createMember,
    login: login,
    createPatient: createPatient,
    createAppointment: createAppointment,
  },
  GET: {
    getPatients: getPatients,
  },
};

const server = createServer((req: IncomingMessage, res: ServerResponse) => {
  const url = req.url?.split("/")[1];
  let routeHandler;

  if (req.method && url) {
    routeHandler = routes[req.method] && routes[req.method][url];
  }

  if (routeHandler) {
    routeHandler(req, res);
  } else {
    res.writeHead(404, { "Content-Type": "text/plain" });
    res.end("Route Not Found");
  }
});

server.listen(3000, () => {
  console.log("Server is running on port 3000");
});
