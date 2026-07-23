import { redirect } from "next/navigation";
import { Button, Flex, Space } from "antd";
import Text from "antd/es/typography/Text";
import { getCurrentUser } from "@/lib/getCurrentUser";
import { Logo } from "@/components/shared/Logo";

const TAGS = ["Location-verified", "Real-time shifts", "Built for care teams"];

export default async function Home() {
  const user = await getCurrentUser();

  if (!user) {
    return (
      <div style={{ position: "relative", minHeight: "100vh", display: "flex", overflow: "hidden" }}>
        {/* Ambient background decoration */}
        <div 
          style={{
            position: "absolute",
            top: "-10%",
            left: "-10%",
            width: "50vw",
            height: "50vh",
            background: "var(--accent-soft)",
            filter: "blur(120px)",
            borderRadius: "50%",
            zIndex: 0,
            pointerEvents: "none"
          }}
        />
        <div 
          style={{
            position: "absolute",
            bottom: "-10%",
            right: "-10%",
            width: "50vw",
            height: "50vh",
            background: "var(--green-soft)",
            filter: "blur(120px)",
            borderRadius: "50%",
            zIndex: 0,
            pointerEvents: "none"
          }}
        />

        <div style={{ position: "absolute", top: 32, left: 32, zIndex: 10, color: "var(--foreground)" }}>
          <Logo size={28} />
        </div>

        <Flex
          vertical
          align="center"
          justify="center"
          gap={32}
          style={{ flex: 1, textAlign: "center", padding: "24px", zIndex: 1 }}
        >

          <Flex vertical align="center" gap={8}>
            <h1
              style={{
                fontSize: "clamp(3rem, 8vw, 5.5rem)",
                fontWeight: 800,
                letterSpacing: "-0.04em",
                lineHeight: 1.05,
                margin: 0,
                background: "linear-gradient(135deg, var(--foreground) 0%, var(--muted) 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent"
              }}
            >
              Clock in.
              <br />
              Stay in bounds.
            </h1>
            <Text
              type="secondary"
              style={{ fontSize: 18, maxWidth: 500, marginTop: 16, lineHeight: 1.6 }}
            >
              Perimeter keeps shifts honest — care workers clock in only when
              they&apos;re actually on site, and managers see it all in
              real time.
            </Text>
          </Flex>

          <Space size="middle" style={{ marginTop: 12 }}>
            <Button type="primary" size="large" href="/auth/login" style={{ padding: "0 32px" }}>
              Log in
            </Button>
            <Button size="large" href="/auth/login?screen_hint=signup" style={{ padding: "0 32px" }}>
              Sign up
            </Button>
          </Space>

          <Flex gap={12} wrap justify="center" style={{ marginTop: 24 }}>
            {TAGS.map((tag) => (
              <span
                key={tag}
                className="pm-pill"
                style={{ 
                  background: "var(--surface)", 
                  color: "var(--foreground)",
                  border: "1px solid var(--border)",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
                  padding: "4px 16px",
                  fontSize: 13
                }}
              >
                {tag}
              </span>
            ))}
          </Flex>
        </Flex>
      </div>
    );
  }

  if (!user.role) redirect("/onboarding");
  redirect(user.role === "MANAGER" ? "/manager" : "/worker");
}
