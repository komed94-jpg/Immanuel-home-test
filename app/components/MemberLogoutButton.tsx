"use client";

export function MemberLogoutButton() {
  async function logout() {
    await fetch("/api/member/logout", { method: "POST" });
    window.location.assign("/");
  }
  return <button className="admin-secondary-button member-logout-button" type="button" onClick={logout}>로그아웃</button>;
}
