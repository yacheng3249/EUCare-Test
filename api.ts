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
        res.end(JSON.stringify({ error: "Phone already exists" }));
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
          message: "Member registered successfully",
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

      res.writeHead(201, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ message: "You are now logged in." }));
    } catch (error) {
      console.error(error);
      res.writeHead(500, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ error: "Internal server error" }));
    }
  });
};
