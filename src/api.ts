// src/api.ts

export async function apiFiles() {
  const r = await fetch("http://localhost:4000/files");
  return r.json();
}

export async function apiDelete(path: string) {
  const res = await fetch(`http://localhost:4000${path}`, {
    method: "DELETE",
  });
  return res.json();
}

export async function apiTerminal(command: string) {
  const r = await fetch("http://localhost:4000/terminal", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ command }),
  });
  return r.json();
}

// =========================
// CRIAÇÃO DE ARQUIVOS
// =========================
export async function apiCreateFile(name: string, folder: string = "") {
  const r = await fetch("http://localhost:4000/create/file", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, folder }),
  });
  return r.json();
}

// =========================
// CRIAÇÃO DE PASTAS
// =========================
export async function apiCreateFolder(name: string, folder: string = "") {
  const r = await fetch("http://localhost:4000/create/folder", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, folder }),
  });
  return r.json();
}

// =========================
// LER ARQUIVO
// =========================
export async function apiReadFile(path: string) {
  const r = await fetch("http://localhost:4000/read/file", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ path }),
  });
  return r.json();
}

// =========================
// ESCREVER / SALVAR ARQUIVO
// =========================
export async function apiWriteFile(path: string, content: string) {
  const r = await fetch("http://localhost:4000/write/file", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ path, content }),
  });
  return r.json();
}
