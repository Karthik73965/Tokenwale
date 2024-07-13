import NextAuth from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import CredentialsProvider from 'next-auth/providers/credentials';
import prisma from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import { randomBytes } from 'crypto';

const generateRandomPassword = () => {
  return randomBytes(16).toString('hex');
};
const currentDateTime = new Date().toISOString();

const authOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        username: { label: 'Username', type: 'text', placeholder: 'jsmith' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials: any) {
        if (!credentials?.username || !credentials?.password) {
          console.error('Missing credentials');
          return null;
        }

        try {
          const user = await prisma.user.findUnique({
            where: { username: credentials.username },
          });

          if (user) {
            const isValid = await bcrypt.compare(credentials.password, user.password);
            if (!isValid) {
              return null;
            }
            console.log('Valid password, returning user');
            return user;
          } else {
            console.log('Creating new user');
            const hashedPassword = await bcrypt.hash(credentials.password, 10);
            const newUser = await prisma.user.create({
              data: {
                  username: credentials.username,
                  password: hashedPassword,
                  tokens: 100, // Initialize with 100 tokens
                  tokenTxns: {
                      create: {
                          transaction: {
                              type: 'bonus',
                              amount: 100,
                              updatedAmount: 100,
                              timestamp: currentDateTime,
                          },
                      },
                  },
              },
          });
            return newUser;
          }
        } catch (error) {
          console.log('Error during authorization:', error);
          return null;
        }
      },
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID ?? '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? '',
    }),
  ],
  callbacks: {
    async session({ session, token }: any) {
      if (token) {
        session.user.id = token.id;

        const user = await prisma.user.findUnique({
          where: { id: token.id },
        });

        if (user) {
          session.user.username = user.username;
        }
      }
      return session;
    },
    async jwt({ token, user, account, profile }: any) {
      if (user) {
        token.id = user.id;
      }

      if (account?.provider === 'google' && profile) {
        const username = profile.email.split('@')[0];
        const existingUser = await prisma.user.findUnique({
          where: { username },
        });
        if (!existingUser) {
          const password = generateRandomPassword();
          const hashedPassword = await bcrypt.hash(password, 10)
          const newUser = await prisma.user.create({
            data: {
              username,
              password: hashedPassword,
              tokenTxns: {
                create: {
                    transaction: {
                        type: 'bonus',
                        amount: 100,
                        updatedAmount: 100,
                        timestamp: currentDateTime,
                    },
                },
            },
            },
          });
          token.id = newUser.id;
        } else {
          token.id = existingUser.id;
        }
      }
      return token;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: 'jwt',
  },
  pages:{
    signIn:'/login'
  },
  onError: (error: any) => {
    if (error?.message) {
      console.error('Error:', error.message)
    }
    return '/env';
  },
};

//@ts-ignore
const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
