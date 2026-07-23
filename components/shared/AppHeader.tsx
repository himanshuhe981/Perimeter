import { Button, Flex } from "antd";
import { Header } from "antd/es/layout/layout";
import Text from "antd/es/typography/Text";

export function AppHeader({
  user,
}: {
  user: { email: string; name: string | null; role: string | null };
}) {
  return (
    <Header
      style={{
        background: "transparent",
        borderBottom: "1px solid rgba(128,128,128,0.2)",
        height: "auto",
        padding: "12px 24px",
      }}
    >
      <Flex align="center" justify="space-between">
        <Text type="secondary">
          {user.name ?? user.email} — {user.role}
        </Text>
        <Button type="link" href="/auth/logout" style={{ paddingInline: 0 }}>
          Log out
        </Button>
      </Flex>
    </Header>
  );
}
