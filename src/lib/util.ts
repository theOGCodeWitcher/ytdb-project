export default function clipDescription(description: string): string {
  const index = description.indexOf(".");
  if (index !== -1) {
    return description.slice(0, index + 1);
  }
  return description;
}
