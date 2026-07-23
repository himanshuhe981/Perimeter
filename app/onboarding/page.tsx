import { redirect } from "next/navigation";
import { Flex } from "antd";
import Title from "antd/es/typography/Title";
import Text from "antd/es/typography/Text";
import { getCurrentUser } from "@/lib/getCurrentUser";
import { setRole } from "./actions";
import { Logo } from "@/components/shared/Logo";
import { BriefcaseIcon, ClockIcon } from "@/components/shared/icons";

export default async function OnboardingPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/auth/login");
  if (user.role) redirect("/");

  return (
    <div style={{ position: "relative", minHeight: "100vh", display: "flex" }}>
      {/* Ambient background decoration specifically for onboarding */}
      <div
        style={{
          position: "absolute",
          top: "10%",
          left: "50%",
          transform: "translateX(-50%)",
          width: "60vw",
          height: "60vh",
          background: "var(--accent-soft)",
          filter: "blur(100px)",
          borderRadius: "50%",
          zIndex: 0,
          pointerEvents: "none",
        }}
      />

      <div
        className="px-4 sm:px-7 py-3.5"
        style={{ position: "absolute", top: 0, left: 0, zIndex: 2 }}
      >
        <div style={{ color: "var(--foreground)" }} className="flex">
          <Logo size={24} />
        </div>
      </div>

      <Flex
        vertical
        align="center"
        justify="center"
        gap={32}
        className="px-4 sm:px-6"
        style={{ flex: 1, textAlign: "center", padding: "96px 16px 24px", zIndex: 1 }}
      >
        <div style={{ maxWidth: 460 }}>
          <Title
            level={1}
            style={{
              margin: 0,
              fontWeight: 700,
              letterSpacing: "-0.03em",
              fontSize: "clamp(1.75rem, 6vw, 2.5rem)",
              lineHeight: 1.15,
            }}
          >
            Welcome to Perimeter
          </Title>
          <Text
            type="secondary"
            style={{
              fontSize: "clamp(0.875rem, 3.2vw, 1rem)",
              display: "block",
              marginTop: 8,
            }}
          >
            Tell us how you&apos;ll be using the app — this can&apos;t be
            changed later.
          </Text>
        </div>

        <form action={setRole} style={{ width: "100%", maxWidth: 600 }}>
          <Flex gap={16} wrap style={{ justifyContent: "center" }}>
            <RoleTile
              name="role"
              value="MANAGER"
              icon={<BriefcaseIcon size={28} />}
              title="I'm a Manager"
              description="Set the perimeter, monitor staff, and view analytics."
              gradient="pm-gradient-violet"
            />
            <RoleTile
              name="role"
              value="CARE_WORKER"
              icon={<ClockIcon size={28} />}
              title="I'm a Care Worker"
              description="Clock in and out of shifts within the perimeter."
              gradient="pm-gradient-lime"
            />
          </Flex>
        </form>
      </Flex>
    </div>
  );
}

function RoleTile({
  name,
  value,
  icon,
  title,
  description,
  gradient,
}: {
  name: string;
  value: string;
  icon: React.ReactNode;
  title: string;
  description: string;
  gradient: string;
}) {
  return (
    <button
      type="submit"
      name={name}
      value={value}
      className="pm-card w-full sm:w-auto"
      style={{
        flex: "1 1 220px",
        minWidth: 220,
        padding: 24,
        textAlign: "left",
        cursor: "pointer",
      }}
    >
      <div
        className={gradient}
        style={{
          width: 44,
          height: 44,
          borderRadius: 12,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          marginBottom: 14,
        }}
      >
        {icon}
      </div>
      <Text strong style={{ fontSize: 15, display: "block" }}>
        {title}
      </Text>
      <Text type="secondary" style={{ fontSize: 13 }}>
        {description}
      </Text>
    </button>
  );
}
