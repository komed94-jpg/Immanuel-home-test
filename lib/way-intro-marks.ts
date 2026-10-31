export type IntroMarkStyle = "circle" | "underline" | "double-underline";
export type IntroMarkRect = { x: number; y: number; width: number; height: number };
type Point = { x: number; y: number };

// A stable shuffle: navigation, hydration and reloads never change a page's mark.
export function introMarkStyle(slug: string): IntroMarkStyle {
  let hash = 2166136261;
  for (const character of slug) hash = Math.imul(hash ^ character.charCodeAt(0), 16777619) >>> 0;
  return (["circle", "underline", "double-underline"] as const)[hash % 3];
}

// A filled ribbon gives pen pressure and tapered ends without a heavy drawing library.
function ribbon(points: Point[], pressure: (t: number) => number): string {
  const sides = [1, -1].map((side) => points.map((point, index) => {
    const before = points[Math.max(0, index - 1)];
    const after = points[Math.min(points.length - 1, index + 1)];
    const dx = after.x - before.x;
    const dy = after.y - before.y;
    const length = Math.hypot(dx, dy) || 1;
    const radius = pressure(index / (points.length - 1)) / 2;
    return `${(point.x - side * dy / length * radius).toFixed(2)} ${(point.y + side * dx / length * radius).toFixed(2)}`;
  }));
  return `M ${sides[0].join(" L ")} L ${sides[1].reverse().join(" L ")} Z`;
}

export function introMarkPaths(rect: IntroMarkRect, style: IntroMarkStyle, lineIndex = 0): string[] {
  const { x, y, width, height } = rect;
  if (width <= 0 || height <= 0) return [];
  const lean = lineIndex % 2 === 0 ? 1 : -1;
  if (style === "circle") {
    const rx = width / 2 + 6;
    const ry = height / 2 + 6;
    const points = Array.from({ length: 85 }, (_, index) => {
      const t = index / 84;
      const angle = -.67 - t * (Math.PI * 2 - .23);
      return {
        x: x + width / 2 + rx * Math.cos(angle) + 1.1 * Math.sin(2 * angle),
        y: y + height / 2 + ry * Math.sin(angle) + lean * 1.2 * Math.cos(angle) + .7 * Math.sin(3 * angle)
      };
    });
    return [ribbon(points, (t) => .45 + 1.6 * Math.pow(Math.sin(Math.PI * t), .55) + .2 * Math.sin(t * Math.PI * 5))];
  }

  const underline = (second: boolean) => {
    const start = second ? .19 : 0;
    const end = second ? .79 : 1;
    const points = Array.from({ length: 33 }, (_, index) => {
      const t = index / 32;
      return {
        x: x + width * (start + (end - start) * t),
        y: y + height + (second ? 9 : 4) - (second ? 1.3 : 2.2) * Math.sin(Math.PI * t) + lean * .6 * t + .3 * Math.sin(t * Math.PI * 3)
      };
    });
    return ribbon(points, (t) => .15 + (second ? 1.8 : 2.5) * Math.pow(1 - t, .65) * Math.min(1, .45 + t * 14));
  };
  return style === "double-underline" ? [underline(false), underline(true)] : [underline(false)];
}
