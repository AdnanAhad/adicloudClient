import type { GitHubUser, Files } from "../../types/types";

const GITHUB_API = "https://api.github.com";

async function gh<T>(path: string, token: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${GITHUB_API}${path}`, {
    ...init,
    headers: {
      Accept: "application/vnd.github.v3+json",
      Authorization: `token ${token}`,
      ...(init?.headers || {}),
    },
    cache: "no-store",
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`GitHub error ${res.status}: ${text}`);
  }
  return (await res.json()) as T;
}

export async function getAuthenticatedUser(token: string): Promise<GitHubUser> {
  return gh<GitHubUser>("/user", token);
}

export async function ensurePdfRepo(token: string, username: string): Promise<void> {
  const repo = "pdf-storage";
  // check existence
  const exists = await fetch(`${GITHUB_API}/repos/${username}/${repo}`, {
    headers: {
      Authorization: `token ${token}`,
      Accept: "application/vnd.github.v3+json",
    },
  });
  if (exists.ok) return;
  if (exists.status !== 404) {
    const msg = await exists.text();
    throw new Error(`Failed to check repo: ${exists.status} ${msg}`);
  }
  // create repo
  await gh("/user/repos", token, {
    method: "POST",
    body: JSON.stringify({ name: repo, description: "My personal PDF storage", private: false }),
    headers: { "Content-Type": "application/json" },
  });
}

export async function uploadPdf(token: string, owner: string, path: string, contentBase64: string, message: string) {
  const repo = "pdf-storage";
  return gh(`/repos/${owner}/${repo}/contents/${encodeURIComponent(path)}` as any, token, {
    method: "PUT",
    body: JSON.stringify({ message, content: contentBase64 }),
    headers: { "Content-Type": "application/json" },
  });
}

export async function listPdfs(token: string, owner: string): Promise<Files[]> {
  const repo = "pdf-storage";
  const folder = "uploads";
  try {
    const data = await gh<any[]>(`/repos/${owner}/${repo}/contents/${folder}`, token);
    return data
      .filter((item) => item.type === "file")
      .map((item) => ({ name: item.name, path: item.path, url: item.download_url }));
  } catch (err: any) {
    if (/(404)/.test(String(err?.message))) return [];
    throw err;
  }
}

export async function getFileSha(token: string, owner: string, path: string): Promise<string> {
  const repo = "pdf-storage";
  const data = await gh<any>(`/repos/${owner}/${repo}/contents/${encodeURIComponent(path)}`, token);
  return data.sha as string;
}

export async function deletePdf(token: string, owner: string, path: string, message: string) {
  const repo = "pdf-storage";
  const sha = await getFileSha(token, owner, path);
  return gh(`/repos/${owner}/${repo}/contents/${encodeURIComponent(path)}` as any, token, {
    method: "DELETE",
    body: JSON.stringify({ message, sha }),
    headers: { "Content-Type": "application/json" },
  });
}
