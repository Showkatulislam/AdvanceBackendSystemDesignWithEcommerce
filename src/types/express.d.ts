declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        role: "USER" | "SELLER" | "ADMIN";
      };
    }
  }
}

export {};
