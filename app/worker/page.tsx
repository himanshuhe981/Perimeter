import { Flex } from "antd";
import Title from "antd/es/typography/Title";
import { getCurrentUser } from "@/lib/getCurrentUser";
import { prisma } from "@/lib/prisma";
import { ClockInOutCard } from "@/components/worker/ClockInOutCard";

export default async function WorkerPage() {
  const user = await getCurrentUser();
  if (!user) return null;

  const [activeShift, perimeter] = await Promise.all([
    prisma.shift.findFirst({
      where: { userId: user.id, clockOutAt: null },
      orderBy: { clockInAt: "desc" },
    }),
    prisma.perimeter.findFirst({
      where: { isActive: true },
      orderBy: { createdAt: "desc" },
    }),
  ]);

  return (
    <Flex
      vertical
      align="center"
      justify="center"
      gap="middle"
      style={{ flex: 1, padding: 24 }}
    >
      <Title level={2}>Clock In / Out</Title>
      <ClockInOutCard
        initialActiveShift={
          activeShift
            ? {
                id: activeShift.id,
                clockInAt: activeShift.clockInAt.toISOString(),
              }
            : null
        }
        perimeter={perimeter}
      />
    </Flex>
  );
}
