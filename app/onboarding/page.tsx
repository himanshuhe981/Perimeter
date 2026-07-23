import { redirect } from "next/navigation";
import { Button, Flex, Space } from "antd";
import Title from "antd/es/typography/Title";
import Text from "antd/es/typography/Text";
import { getCurrentUser } from "@/lib/getCurrentUser";
import { setRole } from "./actions";

export default async function OnboardingPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/auth/login");
  if (user.role) redirect("/");

  return (
    <Flex
      vertical
      align="center"
      justify="center"
      gap="middle"
      style={{ flex: 1, textAlign: "center", padding: 24 }}
    >
      <Title level={2}>Welcome to Perimeter</Title>
      <Text type="secondary">
        Tell us how you&apos;ll be using the app.
      </Text>
      <form action={setRole}>
        <Space>
          <Button type="primary" size="large" htmlType="submit" name="role" value="MANAGER">
            I&apos;m a Manager
          </Button>
          <Button size="large" htmlType="submit" name="role" value="CARE_WORKER">
            I&apos;m a Care Worker
          </Button>
        </Space>
      </form>
    </Flex>
  );
}
