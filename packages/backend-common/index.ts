import "dotenv/config"; // MUST BE FIRST


export const JWT_SECERET =   process.env.JWT_SECRET || "secret"

export const SALT_ROUNDS = 10;
export const Plain_Text_Secret = process.env.PLAIN_TEXT_SECRET || "plain_text_secret"
