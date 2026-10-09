// Загружает документ в базу знаний через POST /ingestion/upload бэкенда.
// Документ проходит обычный конвейер: проверка безопасности, разбиение
// на чанки, эмбеддинги и запись в Qdrant.
//
// Запуск:  npm run ingest:club-info
// или:     node --env-file=scripts/seed-demo.env scripts/ingest-knowledge.mjs \
//            <файл> <documentId> [serviceType=general] [documentVersion=1] [language=ru]
//
// Адрес бэкенда и администратор берутся из scripts/seed-demo.env
// (см. scripts/seed-demo.env.example).
//
// Чтобы обновить уже загруженный документ, увеличьте documentVersion:
// старая версия уйдёт в архив, повторная загрузка той же версии вернёт ошибку.

import { readFile } from 'node:fs/promises';
import { basename, extname } from 'node:path';

const API_URL = requireEnv('SEED_API_URL').replace(/\/+$/, '');
const ADMIN_EMAIL = requireEnv('SEED_ADMIN_EMAIL');
const ADMIN_PASSWORD = requireEnv('SEED_ADMIN_PASSWORD');

const MIME_TYPES = {
  '.txt': 'text/plain',
  '.pdf': 'application/pdf',
  '.docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
};

const [filePath, documentId, serviceType = 'general', documentVersion = '1', language = 'ru'] =
  process.argv.slice(2);

if (!filePath || !documentId) {
  console.error('Использование: ingest-knowledge.mjs <файл> <documentId> [serviceType] [documentVersion] [language]');
  process.exit(1);
}

const mimeType = MIME_TYPES[extname(filePath).toLowerCase()];
if (!mimeType) {
  console.error(`Неподдерживаемый формат файла: ${filePath}. Нужен .txt, .pdf или .docx`);
  process.exit(1);
}

function requireEnv(name) {
  const value = process.env[name];
  if (!value) {
    console.error(`Не задана переменная окружения ${name}. См. scripts/seed-demo.env.example`);
    process.exit(1);
  }
  return value;
}

async function readBody(response) {
  const text = await response.text();
  if ((response.headers.get('content-type') ?? '').includes('application/json') && text) {
    return JSON.parse(text);
  }
  return text;
}

function errorMessage(body) {
  return Array.isArray(body?.message) ? body.message.join('; ') : (body?.message ?? body);
}

// Вход администратора: бэкенд возвращает токены в cookies.
async function login() {
  const response = await fetch(`${API_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: ADMIN_EMAIL, password: ADMIN_PASSWORD }),
  });

  if (!response.ok) {
    throw new Error(`POST /auth/login -> ${response.status}: ${errorMessage(await readBody(response))}`);
  }

  return response.headers
    .getSetCookie()
    .map((cookie) => cookie.split(';')[0])
    .join('; ');
}

async function upload(cookies) {
  const form = new FormData();
  form.append('file', new Blob([await readFile(filePath)], { type: mimeType }), basename(filePath));
  form.append('serviceType', serviceType);
  form.append('language', language);
  form.append('publicAccess', 'true');
  form.append('documentVersion', documentVersion);
  form.append('documentId', documentId);

  const response = await fetch(`${API_URL}/ingestion/upload`, {
    method: 'POST',
    headers: { Cookie: cookies },
    body: form,
  });

  const body = await readBody(response);
  if (!response.ok) {
    throw new Error(`POST /ingestion/upload -> ${response.status}: ${errorMessage(body)}`);
  }
  return body;
}

try {
  console.log(`Бэкенд: ${API_URL}`);
  console.log(`Документ: ${filePath} (id ${documentId}, версия ${documentVersion}, ${serviceType}, ${language})`);

  const result = await upload(await login());

  console.log(`Статус: ${result.status}, чанков: ${result.chunksCount}`);
  if (result.status !== 'INGESTED') {
    process.exitCode = 1;
  }
} catch (error) {
  console.error(`Ошибка: ${error.message}`);
  process.exit(1);
}
