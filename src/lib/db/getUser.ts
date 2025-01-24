import prisma from '../prisma';
export async function getUser(id: string) {
  const user = await prisma.user.findFirst({
    where: {
      id: id,
    },
  });

  return user;
}
