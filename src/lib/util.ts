export default function clipDescription(description: string): string {
  const index = description.indexOf(".");
  if (index !== -1) {
    return description.slice(0, index + 1);
  }
  return description;
}

export function extractCategories(urls: string[]) {
  const results: string[] = [];

  urls.forEach((url: string) => {
    const parts = url.split("/");
    const lastPart = parts[parts.length - 1];

    if (/[^a-zA-Z0-9 ]/.test(lastPart)) {
      const furtherParts = lastPart.split(/[^a-zA-Z0-9 ]+/);
      results.push(...furtherParts);
    } else {
      results.push(lastPart);
    }
  });

  return results;
}
