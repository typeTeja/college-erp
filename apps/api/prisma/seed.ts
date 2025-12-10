import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
    // 1. Ensure Roles Exist
    const roles = ['SUPER_ADMIN', 'ADMIN', 'FACULTY', 'STUDENT', 'PARENT'];

    for (const roleName of roles) {
        await prisma.role.upsert({
            where: { name: roleName },
            update: {},
            create: { name: roleName, permissions: {} },
        });
    }

    console.log('Roles seeded.');

    // 2. Create Super Admin
    const adminEmail = 'admin@college.com';
    const superAdminRole = await prisma.role.findUnique({ where: { name: 'SUPER_ADMIN' } });

    if (!superAdminRole) throw new Error('Super Admin Role not found');

    const existingAdmin = await prisma.user.findUnique({ where: { email: adminEmail } });

    if (!existingAdmin) {
        const hashedPassword = await bcrypt.hash('admin123', 10);
        await prisma.user.create({
            data: {
                email: adminEmail,
                password: hashedPassword,
                phone: '9999999999',
                roles: {
                    create: { roleId: superAdminRole.id },
                },
            },
        });
        console.log(`Super Admin created: ${adminEmail} / admin123`);
    } else {
        console.log('Super Admin already exists.');
    }
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
