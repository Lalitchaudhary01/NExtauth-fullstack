import { connect } from "http2";
import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { connectToDatabase } from "./db";
import User from "@/models/User";
import bcrypt from "bcryptjs";

export const authOptions: NextAuthOptions = { 
    providers: [
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "email", placeholder: "email" },
                password: { label: "Password", type: "password" },
            },
            async authorize(credentials){
                if(!credentials?.email || !credentials?.password) {
                    throw new Error("Email and password are required");
                }
                // Here you would typically fetch the user from your database
                try{
                    await connectToDatabase();
                    const user = await User.findOne({ email: credentials.email });
                    if (!user) {
                        throw new Error("no user find with this email");
                    }
                    const isValid = await bcrypt.compare(credentials.password, user.password);
                    if (!isValid) {
                        throw new Error("Invalid password");
                    }
                    return {
                        id: user._id.toString(),
                        email: user.email,
                    };
                } catch (error) {
                    console.error("Error authorizing user:", error);
                    throw new Error("Failed to authorize user");
                }
            },
            
        })
  ],
  callbacks:{
    async jwt({token, user}) {
        if (user) {
            token.id = user.id;
        }
        return token;
    },
    async session({session, token}) {
        if (token) {
            session.user.id = token.id as string;
        }
        return session;
    }
  },
    pages: {
        signIn: "/login",
        error: "/login", // Error code passed in query string as ?error=
        
    },
    session: {
        strategy: "jwt",
        maxAge: 30 * 24 * 60 * 60, // 30 days
    },
    secret: process.env.NEXTAUTH_SECRET!,
}