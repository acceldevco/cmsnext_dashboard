// lib/auth.ts
import { NextAuthOptions, User as NextAuthUser } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { PrismaClient } from '@/generated/prisma';
import bcrypt from 'bcryptjs';
import { JWT } from 'next-auth/jwt';
import { regdbHandler } from './regdb';

const prisma = new PrismaClient();

interface CustomUser extends NextAuthUser {
  id: string;
  role: string;
  access_token:string
}

export type {CustomUser}
export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email', placeholder: 'jsmith@example.com' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials): Promise<CustomUser | null> {
        if (!credentials?.email || !credentials.password) {
          return null;
        }
        const modelName = 'user';
        const user = await regdbHandler({
          modelName,
          method: 'GET',
          options: {
            where: {
              email: credentials.email
            }
          }
        });
        console.log('****************',user);
        



        // const user = await regdbHandler({
        //   'users', method: 'GET', options: {
        //     where: {
        //       email: credentials.email
        //     }
        //   }
        // });    
        // const user = await prisma.user.findUnique({
        //   where: { email: credentials.email },
        // });
        if (!user) {
          return null;
        }

        const passwordMatch = await bcrypt.compare(credentials.password, user.items[0].password);
        
        if (!passwordMatch) {
          return null;
        }

        // Return the user object including the role
        return {
          id: user.items[0].id,
          email: user.items[0].email,
          name: `${user.items[0].firstName} ${user.items[0].lastName}`,
          role: user.items[0].role,
          access_token: "", // Assuming 'role' exists on your User model
        };
      },
    }),
  ],
  session: {
    strategy: 'jwt',
  },
  jwt: {
    secret: process.env.JWT_SECRET,
  },
  callbacks: {
    async jwt({ token, user, account, profile, trigger, isNewUser, session }: { token: JWT; user: NextAuthUser; account: any; profile?: any; trigger?: any; isNewUser?: any; session?: any }): Promise<JWT> {

      // Persist the user role to the token right after signin
      if (user && (user as CustomUser).role) {
        token.id = (user as CustomUser).id;
        token.role = (user as CustomUser).role;
        token.accessToken = (user as CustomUser).access_token
      }
      return token;
    },
    async session({ session, token }: { session: any; token: JWT }): Promise<any> {
      // Send properties to the client, like an access_token and user id from the token.
      if (token && session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as string;
        session.accessToken = token.accessToken as string
      }
      return session;
    },
  },
  pages: {
    signIn: '/auth', // Redirect users to your custom login page
    // error: '/auth/error', // Error code passed in query string as ?error=
    // signOut: '/auth/signout',
  },
  secret: process.env.NEXTAUTH_SECRET, // Add this for production
};
