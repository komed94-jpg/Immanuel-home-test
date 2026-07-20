const deployedAt = process.env.NEXT_PUBLIC_DEPLOYED_AT ?? "";

function formatDeploymentTime(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "배포 시각 확인 중";

  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: "Asia/Seoul",
    month: "short",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  }).formatToParts(date);
  const get = (type: Intl.DateTimeFormatPartTypes) =>
    parts.find((part) => part.type === type)?.value ?? "";

  return `${get("month")}${get("day")}, ${get("dayPeriod").toLowerCase()} ${get("hour")}:${get("minute")}`;
}

export function DeploymentBadge() {
  return (
    <time
      className="home-version-badge"
      dateTime={deployedAt}
      title="최근 테스트 배포 시각 · 한국시간"
    >
      {formatDeploymentTime(deployedAt)}
    </time>
  );
}
