import Text from "antd/es/typography/Text";

export function StatTile({
  label,
  value,
  gradient,
  icon,
  large,
}: {
  label: string;
  value: string;
  gradient?: "pm-gradient-lime" | "pm-gradient-violet";
  icon?: React.ReactNode;
  large?: boolean;
}) {
  return (
    <div
      className={`pm-card ${gradient ?? ""}`}
      style={{
        borderRadius: 24,
        padding: large ? "24px" : "16px 18px",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        height: "100%",
        minHeight: large ? 140 : undefined,
      }}
    >
      <Text
        style={{
          fontSize: large ? 13 : 12,
          color: gradient ? "inherit" : "var(--muted)",
          opacity: gradient ? 0.8 : 1,
          display: "flex",
          alignItems: "center",
          gap: 6,
        }}
      >
        {icon}
        {label}
      </Text>
      <div
        style={{
          fontSize: large ? 40 : 22,
          fontWeight: 700,
          marginTop: large ? 10 : 2,
          letterSpacing: "-0.02em",
        }}
      >
        {value}
      </div>
    </div>
  );
}
