import { Button, Card, Flex } from "antd";
import Title from "antd/es/typography/Title";
import { prisma } from "@/lib/prisma";
import { PerimeterForm } from "@/components/manager/PerimeterForm";
import { LiveClockedInTable } from "@/components/manager/LiveClockedInTable";
import { StaffHistoryTable } from "@/components/manager/StaffHistoryTable";

export default async function ManagerPage() {
  const [perimeter, clockedIn, allShifts] = await Promise.all([
    prisma.perimeter.findFirst({
      where: { isActive: true },
      orderBy: { createdAt: "desc" },
    }),
    prisma.shift.findMany({
      where: { clockOutAt: null },
      include: { user: true },
      orderBy: { clockInAt: "desc" },
    }),
    prisma.shift.findMany({
      include: { user: true },
      orderBy: { clockInAt: "desc" },
      take: 200,
    }),
  ]);

  return (
    <Flex
      vertical
      gap="large"
      style={{ maxWidth: 960, margin: "0 auto", padding: 24, width: "100%" }}
    >
      <Flex align="center" justify="space-between">
        <Title level={2} style={{ margin: 0 }}>
          Manager Dashboard
        </Title>
        <Button href="/manager/dashboard">View analytics dashboard</Button>
      </Flex>

      <PerimeterForm currentPerimeter={perimeter} />

      <Card title={`Currently clocked in (${clockedIn.length})`}>
        <LiveClockedInTable shifts={clockedIn} />
      </Card>

      <Card title="Staff shift history">
        <StaffHistoryTable shifts={allShifts} />
      </Card>
    </Flex>
  );
}
