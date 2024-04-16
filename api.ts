import { IncomingMessage, ServerResponse } from "http";
import { PrismaClient } from "@prisma/client";
import { hash } from "bcrypt";

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

      const hashedPassword = await hash(
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
      console.error("Error:", error);
      res.writeHead(500, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ error: "Internal server error" }));
    }
  });
};
