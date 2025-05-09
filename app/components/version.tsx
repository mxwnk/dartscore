import { version } from "@/lib/version";

export function Version() {
  const versionComment = `<!-- Version: ${version} -->`;
  return <script dangerouslySetInnerHTML={{ __html: versionComment }} />;
}
