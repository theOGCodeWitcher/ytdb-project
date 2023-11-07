const MAX_LENGTH = 200; // Set your desired maximum length here

export default function clipDescription(description: string): string {
  if (description.length > MAX_LENGTH) {
    return description.substring(0, MAX_LENGTH - 3) + "...";
  }
  return description;
}

export function extractCategories(urls: string[]) {
  const results: string[] = [];
  const maxCategories = 3;

  urls.forEach((url: string) => {
    const parts = url.split("/");
    const lastPart = parts[parts.length - 1];

    if (/[^a-zA-Z0-9 ]/.test(lastPart)) {
      const furtherParts = lastPart.split(/[^a-zA-Z0-9 ]+/);
      results.push(...furtherParts.filter((part) => part.length > 0));
    } else if (lastPart.length > 0) {
      results.push(lastPart);
    }

    if (results.length >= maxCategories) {
      return results.slice(0, maxCategories);
    }
  });

  return results.slice(0, maxCategories);
}

export function formatCount(count: number): string {
  if (count >= 1_000_000) {
    return `${(count / 1_000_000).toFixed(1)}M`;
  }
  if (count >= 1_000) {
    return `${(count / 1_000).toFixed(1)}K`;
  }
  return count.toString();
}
