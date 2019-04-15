import { statSync, readdirSync, readFileSync } from "fs";

/**
 * fileの一覧と本文を取得
 *
 * @param {string} path
 * @returns {{ title: string, content: string }[]}
 */
export function getFileContent(
  path: string
): { title: string; content: string }[] {
  const stat = statSync(path);

  if (stat.isFile() && path.substr(-3) === ".md") {
    return [
      {
        title: path,
        content: readFileSync(path, { encoding: "utf-8" })
      }
    ];
  }

  if (stat.isDirectory()) {
    const fileNames: { title: string; content: string }[] = [];
    path = path.substr(-1) === "/" ? path.slice(0, -1) : path;
    readdirSync(path).forEach((childPath: string) =>
      fileNames.push(...getFileContent(`${path}/${childPath}`))
    );
    return fileNames;
  }
  return [];
}
