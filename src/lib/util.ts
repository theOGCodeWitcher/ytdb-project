export default function clipDescription(description: string): string {
  const index = description.indexOf(".");
  if (index !== -1) {
    return description.slice(0, index + 1);
  }
  return description;
}

export function extractCategories(urls: string[]) {
  return urls.map((url: string) => {
    const parts = url.split("/");
    return parts[parts.length - 1];
  });
}
