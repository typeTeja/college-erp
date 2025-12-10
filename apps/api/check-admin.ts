import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    const admin = await prisma.user.findUnique({
        where: { email: 'admin@college.com' },
        include: { roles: { include: { role: true } } },
    });
    console.log(JSON.stringify(admin, null, 2));
}

main()
    .catch(console.error)
    .finally(() => prisma.$disconnect());
