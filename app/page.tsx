import { redirect } from "next/navigation";
import { Button, Flex, Space } from "antd";
import Title from "antd/es/typography/Title";
import { getCurrentUser } from "@/lib/getCurrentUser";

export default async function Home() {
  const user = await getCurrentUser();

  if (!user) {
    return (
      <Flex
        vertical
        align="center"
        justify="center"
        gap="middle"
        style={{ flex: 1, textAlign: "center", padding: 24 }}
      >
        <Title level={1}>Perimeter</Title>
        <Space>
          <Button type="primary" size="large" href="/auth/login">
            Log in
          </Button>
          <Button size="large" href="/auth/login?screen_hint=signup">
            Sign up
          </Button>
        </Space>
      </Flex>
    );
  }

  if (!user.role) redirect("/onboarding");
  redirect(user.role === "MANAGER" ? "/manager" : "/worker");
}
