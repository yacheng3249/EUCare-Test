import { IncomingMessage, ServerResponse } from "http";
import { PrismaClient } from "@prisma/client";
import * as bcrypt from "bcrypt";

const prisma = new PrismaClient();

export const createMember = (req: IncomingMessage, res: ServerResponse) => {
  let body = "";

  req.on("data", (chunk) => {
    body += chunk;
  });

  req.on("end", async () => {
    const { phone, password } = JSON.parse(body);

    try {
      const existingMember = await prisma.member.findFirst({
        where: { phone },
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

      const newMember = await prisma.member.create({
        data: {
          phone,
          password: hashedPassword,
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
      const member = await prisma.member.findFirst({
        where: { phone },
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

    const existingPatientId = await prisma.patient.findFirst({
      where: { patientId },
    });

    if (existingPatientId) {
      res.writeHead(400, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ error: "The patient ID already exists." }));
      return;
    }

    const newPatient = await prisma.patient.create({
      data: {
        memberId,
        name,
        patientId,
        birthday,
        address,
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
      const patients = await prisma.patient.findMany({
        where: { memberId },
      });

      if (!patients || patients.length === 0) {
        res.writeHead(404, { "Content-Type": "text/plain" });
        res.end(JSON.stringify("Patient not found"));
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

export const createAppointment = (
  req: IncomingMessage,
  res: ServerResponse
) => {
  let body = "";

  req.on("data", (chunk) => {
    body += chunk;
  });

  req.on("end", async () => {
    try {
      const { nationalId, consultationContent, date, time } = JSON.parse(body);

      const patient = await prisma.patient.findFirst({
        where: { patientId: nationalId },
      });

      if (!patient) {
        res.writeHead(404, { "Content-Type": "application/json" });
        res.end(
          JSON.stringify({
            error:
              "Patient not found. Please check the national ID and try again.",
          })
        );
        return;
      }

      if (patient.appointmentAmount >= 2) {
        res.writeHead(400, { "Content-Type": "application/json" });
        res.end(
          JSON.stringify({
            error:
              "You have reached the maximum number (2) of appointments per patient.",
          })
        );
        return;
      }

      const member = await prisma.member.findFirst({
        where: { id: patient.memberId },
      });

      if (!member) {
        res.writeHead(404, { "Content-Type": "application/json" });
        res.end(
          JSON.stringify({
            error: "Member not found",
          })
        );
        return;
      }

      if (member.appointmentAmount >= 5) {
        res.writeHead(400, { "Content-Type": "application/json" });
        res.end(
          JSON.stringify({
            error:
              "You have reached the maximum number (5) of appointments per member.",
          })
        );
        return;
      }

      const appointment = await prisma.appointment.create({
        data: {
          patientId: patient.id,
          consultationContent,
          date,
          time,
        },
      });

      await prisma.patient.update({
        where: { id: patient.id },
        data: {
          appointmentAmount: {
            increment: 1,
          },
        },
      });

      await prisma.member.update({
        where: { id: member.id },
        data: {
          appointmentAmount: {
            increment: 1,
          },
        },
      });

      res.writeHead(201, { "Content-Type": "application/json" });
      res.end(JSON.stringify(appointment));
    } catch (error) {
      console.error(error);
      res.writeHead(500, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ error: "Internal server error" }));
    }
  });
};
