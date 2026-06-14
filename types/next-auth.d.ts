import { DefaultSession, DefaultUser } from "next-auth";
import { DefaultJWT } from "next-auth/jwt";

export type PortalRole = "owner" | "employee";

declare module "next-auth" {
  interface Session {
    user: DefaultSession["user"] & {
      role: PortalRole;
      eid?: number;
    };
  }

  interface User extends DefaultUser {
    role?: PortalRole;
    eid?: number;
  }
}

declare module "next-auth/jwt" {
  interface JWT extends DefaultJWT {
    role: PortalRole;
    eid?: number;
  }
}
