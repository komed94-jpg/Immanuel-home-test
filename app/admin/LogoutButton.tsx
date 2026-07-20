"use client";

export function LogoutButton() {
  return <button type="button" onClick={async () => { await fetch("/api/admin/logout", { method: "POST" }); window.location.assign("/admin"); }}>로그아웃</button>;
}
