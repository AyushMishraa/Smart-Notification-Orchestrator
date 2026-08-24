  import { PrismaPg } from '@prisma/adapter-pg'
  import { PrismaClient } from '../generated/prisma/client'
  import 'dotenv/config'

  const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL })
  const prisma = new PrismaClient({ adapter })
  
async function main() {
  // 1. Tenant → User
  const tenant = await prisma.tenant.create({
    data: {
      name: 'Corp',
      status: 'ACTIVE',
      slug: 'corp',
      users: {
        create: {
          email: 'dev@acme.test',
          name: 'Dev User',
          status: 'ACTIVE',
        },
      },
    },
    include: { users: true },
  })
  console.log('✅ Tenant → User created:', tenant)

  // 2. Tenant → Notification → DeliveryAttempt
  const notification = await prisma.notification.create({
    data: {
      tenantId: tenant.id,
      type: 'OTP',
      channel: 'EMAIL',
      recipient: 'dev@acme.test',
      content: 'Your OTP is 123456',
      deliveryAttempts: {
        create: [
          {
            status: 'PROCESSING',
            attemptNumber: 1,
            provider: 'RESEND',
          },
        ],
      },
    },
    include: { deliveryAttempts: true },
  })
  console.log('✅ Tenant → Notification → DeliveryAttempt created:', notification)

  // 3. Notification → AuditLog
  const auditLog = await prisma.auditLog.create({
    data: {
      tenantId: tenant.id,
      notificationId: notification.id,
      event: 'NOTIFICATION_CREATED',
    },
  })
  console.log('✅ Notification → AuditLog created:', auditLog)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })