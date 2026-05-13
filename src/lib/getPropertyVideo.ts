import videos from "./propertyVideos.json";

export function getPropertyVideo(id: string): string | null {
  return (videos as Record<string, string>)[id] ?? null;
}