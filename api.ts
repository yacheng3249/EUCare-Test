import { IncomingMessage, ServerResponse } from "http";
import { PrismaClient } from "@prisma/client";
import * as bcrypt from "bcrypt";

const store = new PrismaClient();

export const createMember = (req: IncomingMessage, res: ServerResponse) => {
  let body = "";

  req.on("data", (chunk) => {
    body += chunk;
  });

  req.on("end", async () => {
    const { phone, password } = JSON.parse(body);

    try {
      const existingMember = await store.member.findFirst({
        where: {
          phone: phone as string,
        },
      });

      if (existingMember) {
        res.writeHead(400, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ error: "Phone already exists." }));
        return;
      }

      const hashedPassword = await bcrypt.hash(
        password,
        Number(process.env.SALT_ROUNDS)
      );

      const newMember = await store.member.create({
        data: {
          phone: phone as string,
          password: hashedPassword as string,
        },
      });

      res.writeHead(201, { "Content-Type": "application/json" });
      res.end(
        JSON.stringify({
          message: "Member registered successfully.",
          member: newMember,
        })
      );
    } catch (error) {
      console.error(error);
      res.writeHead(500, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ error: "Internal server error" }));
    }
  });
};

export const login = (req: IncomingMessage, res: ServerResponse) => {
  let body = "";

  req.on("data", (chunk) => {
    body += chunk;
  });

  req.on("end", async () => {
    const { phone, password } = JSON.parse(body);

    try {
      const member = await store.member.findFirst({
        where: { phone: phone as string },
      });
      if (!member) {
        res.writeHead(400, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ error: "The phone does not exist." }));
        return;
      }

      const passwordIsValid = await bcrypt.compare(password, member.password);
      if (!passwordIsValid) {
        res.writeHead(401, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ error: "Wrong Password." }));
        return;
      }

      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ message: "You are now logged in." }));
    } catch (error) {
      console.error(error);
      res.writeHead(500, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ error: "Internal server error" }));
    }
  });
};

export const createPatient = (req: IncomingMessage, res: ServerResponse) => {
  let body = "";

  req.on("data", (chunk) => {
    body += chunk;
  });

  req.on("end", async () => {
    const { memberId, name, patientId, birthday, address } = JSON.parse(body);

    const existingPatientId = await store.patient.findFirst({
      where: {
        patientId: patientId as string,
      },
    });

    if (existingPatientId) {
      res.writeHead(400, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ error: "The patient ID already exists." }));
      return;
    }

    const newPatient = await store.patient.create({
      data: {
        memberId: memberId as string,
        name: name as string,
        patientId: patientId as string,
        birthday: birthday as Date,
        address: address as string,
      },
    });

    res.writeHead(201, { "Content-Type": "application/json" });
    res.end(
      JSON.stringify({
        message: "Patient created successfully.",
        patient: newPatient,
      })
    );
    try {
    } catch (error) {
      console.error(error);
      res.writeHead(500, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ error: "Internal server error" }));
    }
  });
};

export const getPatients = async (
  req: IncomingMessage,
  res: ServerResponse
) => {
  if (req.url) {
    try {
      const memberId = req.url.split("/")[2];
      const patients = await store.patient.findMany({
        where: { memberId: memberId as string },
      });

      if (!patients) {
        res.writeHead(404, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ error: "Patient not found" }));
        return;
      }

      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify(patients));
    } catch (error) {
      console.error(error);
      res.writeHead(500, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ error: "Internal server error" }));
    }
  } else {
    res.writeHead(404, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ error: "Route not found" }));
  }
};
