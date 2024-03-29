export function formatS3ImageUrl(
  key: string,
  bucket: string,
  size: "sm" | "md" | "explore" | "lg" = "lg",
) {
  if (size === "sm") {
    return `https://${bucket}.s3.us-west-1.amazonaws.com/resized-50w50h-${key}`;
  }

  if (size === "md") {
    return `https://${bucket}.s3.us-west-1.amazonaws.com/resized-300w450h-${key}`;
  }

  if (size === "explore") {
    return `https://${bucket}.s3.us-west-1.amazonaws.com/resized-400w600h-${key}`;
  }

  return `https://${bucket}.s3.us-west-1.amazonaws.com/resized-400w225h-${key}`;
}
