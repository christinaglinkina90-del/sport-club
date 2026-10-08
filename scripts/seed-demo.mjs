// Заполняет базу демо-данными для презентации через API бэкенда.
// Все записи создаются обычными запросами, поэтому проходят валидацию,
// а пароли шифруются так же, как при работе через сайт.
//
// Запуск:  node --env-file=scripts/seed-demo.env scripts/seed-demo.mjs
// (или npm run seed:demo). Переменные описаны в scripts/seed-demo.env.example.
//
// Скрипт можно запускать повторно: то, что уже есть, пропускается.

const API_URL = requireEnv('SEED_API_URL').replace(/\/+$/, '');
const ADMIN_EMAIL = requireEnv('SEED_ADMIN_EMAIL');
const ADMIN_PASSWORD = requireEnv('SEED_ADMIN_PASSWORD');
// Пароль для всех демо-тренеров и демо-клиентов, чтобы на презентации
// можно было войти под любым из них.
const DEMO_PASSWORD = requireEnv('SEED_DEMO_PASSWORD');

// ---------- Демо-данные ----------

// Имена - только латиница, телефоны - только цифры (правила UserSaveDto).
const TRAINERS = [
  { key: 'anna', name: 'Anna Smirnova', email: 'anna.smirnova@example.com', phone: '4917055500101' },
  { key: 'igor', name: 'Igor Volkov', email: 'igor.volkov@example.com', phone: '4917055500102' },
  { key: 'maria', name: 'Maria Kuznetsova', email: 'maria.kuznetsova@example.com', phone: '4917055500103' },
  { key: 'dmitry', name: 'Dmitry Orlov', email: 'dmitry.orlov@example.com', phone: '4917055500104' },
];

const CLIENTS = [
  { key: 'elena', name: 'Elena Sokolova', email: 'elena.sokolova@example.com', phone: '4917055500201' },
  { key: 'pavel', name: 'Pavel Morozov', email: 'pavel.morozov@example.com', phone: '4917055500202' },
];

// Видов услуг в бэкенде шесть (GYM, YOGA, EQUESTRIAN, SPA, RESTAURANT, GOLF),
// поэтому бокс и силовые относятся к GYM, пилатес - к YOGA, бассейн - к SPA.
const SERVICES = [
  { key: 'yoga', name: 'Hatha Yoga', type: 'YOGA', price: 15, description: 'Классическая хатха-йога: дыхание, асаны и расслабление. Подходит для любого уровня подготовки.' },
  { key: 'pilates', name: 'Pilates', type: 'YOGA', price: 16, description: 'Пилатес на коврике для укрепления мышц кора, осанки и гибкости.' },
  { key: 'boxing', name: 'Boxing', type: 'GYM', price: 18, description: 'Техника бокса, работа на мешках и лапах, общая физическая подготовка. Перчатки выдаём.' },
  { key: 'strength', name: 'Strength Training', type: 'GYM', price: 14, description: 'Силовая тренировка в небольшой группе со свободными весами и тренажёрами.' },
  { key: 'functional', name: 'Functional Training', type: 'GYM', price: 14, description: 'Круговая функциональная тренировка на выносливость и координацию.' },
  { key: 'pool', name: 'Swimming Pool', type: 'SPA', price: 10, description: 'Групповое плавание с тренером в 25-метровом бассейне.' },
  { key: 'spa', name: 'Sauna and Spa', type: 'SPA', price: 25, description: 'Финская сауна, хаммам и зона отдыха. Полотенца и халат включены.' },
];

const MEMBERSHIPS = [
  { key: 'silver', name: 'Monthly Silver', type: 'SILVER', price: 39, durationInDays: 30, description: 'Тренажёрный зал и групповые тренировки в будние дни до 17:00.' },
  { key: 'gold', name: 'Monthly Gold', type: 'GOLD', price: 59, durationInDays: 30, description: 'Безлимитное посещение зала и всех групповых тренировок в любое время.' },
  { key: 'platinum', name: 'Monthly Platinum', type: 'PLATINUM', price: 89, durationInDays: 30, description: 'Всё из Gold плюс бассейн, сауна и спа без ограничений.' },
  { key: 'yearlyGold', name: 'Yearly Gold', type: 'GOLD', price: 590, durationInDays: 365, description: 'Годовой Gold со скидкой: двенадцать месяцев по цене десяти.' },
];

// Недельное расписание: день недели (0 - воскресенье) -> занятия.
const WEEKLY_PLAN = {
  1: [
    { service: 'yoga', trainer: 'anna', start: '08:00', end: '09:00', capacity: 15 },
    { service: 'strength', trainer: 'dmitry', start: '18:00', end: '19:00', capacity: 10 },
    { service: 'boxing', trainer: 'igor', start: '19:30', end: '21:00', capacity: 12 },
  ],
  2: [
    { service: 'pilates', trainer: 'anna', start: '09:00', end: '10:00', capacity: 12 },
    { service: 'pool', trainer: 'maria', start: '17:00', end: '18:00', capacity: 8 },
    { service: 'functional', trainer: 'igor', start: '18:30', end: '19:30', capacity: 15 },
  ],
  3: [
    { service: 'yoga', trainer: 'anna', start: '08:00', end: '09:00', capacity: 15 },
    { service: 'strength', trainer: 'dmitry', start: '18:00', end: '19:00', capacity: 10 },
    { service: 'boxing', trainer: 'igor', start: '19:30', end: '21:00', capacity: 12 },
  ],
  4: [
    { service: 'pilates', trainer: 'anna', start: '09:00', end: '10:00', capacity: 12 },
    { service: 'pool', trainer: 'maria', start: '17:00', end: '18:00', capacity: 8 },
    { service: 'functional', trainer: 'dmitry', start: '18:30', end: '19:30', capacity: 15 },
  ],
  5: [
    { service: 'yoga', trainer: 'anna', start: '08:00', end: '09:00', capacity: 15 },
    { service: 'boxing', trainer: 'igor', start: '18:00', end: '19:30', capacity: 12 },
  ],
  6: [
    { service: 'yoga', trainer: 'anna', start: '10:00', end: '11:30', capacity: 20 },
    { service: 'pool', trainer: 'maria', start: '11:00', end: '12:00', capacity: 8 },
    { service: 'spa', trainer: 'maria', start: '14:00', end: '17:00', capacity: 10 },
  ],
  0: [
    { service: 'spa', trainer: 'maria', start: '12:00', end: '16:00', capacity: 10 },
  ],
};
const SCHEDULE_DAYS = 14;

const NEWS = [
  { title: 'Открыта запись на новый сезон', content: 'Расписание на ближайшие две недели уже на сайте. Записывайтесь на занятия заранее: в популярных группах места заканчиваются быстро.' },
  { title: 'Новый тренер по боксу', content: 'К команде присоединился Игорь Волков, КМС по боксу. Занятия для начинающих и продолжающих по понедельникам, средам и пятницам.' },
  { title: 'Бассейн после ремонта', content: 'Бассейн снова открыт: заменили фильтрацию и освещение.\nГрупповое плавание проходит по вторникам, четвергам и субботам.' },
  { title: 'Скидка на годовой абонемент', content: 'До конца месяца годовой абонемент Gold стоит как десять месяцев. Оформить его можно на странице «Абонементы».' },
  { title: 'Ассистент клуба на сайте', content: 'На сайте появился онлайн-ассистент. Он отвечает на вопросы о расписании, абонементах и правилах клуба в любое время суток.' },
];

// Записи демо-клиентов: занятие выбирается как N-е по счёту занятие этой
// услуги в ближайшие две недели.
const CLIENT_BOOKINGS = {
  elena: [
    { service: 'yoga', occurrence: 0 },
    { service: 'pilates', occurrence: 0 },
    { service: 'spa', occurrence: 0 },
  ],
  pavel: [
    { service: 'boxing', occurrence: 0 },
    { service: 'strength', occurrence: 1 },
  ],
};

// Абонементы демо-клиентов: confirm=true - администратор подтверждает оплату,
// false - заявка остаётся ожидающей, чтобы показать подтверждение в админке.
const CLIENT_MEMBERSHIPS = {
  elena: { membership: 'platinum', confirm: true },
  pavel: { membership: 'gold', confirm: false },
};

// ---------- HTTP ----------

function requireEnv(name) {
  const value = process.env[name];
  if (!value) {
    console.error(`Не задана переменная окружения ${name}. См. scripts/seed-demo.env.example`);
    process.exit(1);
  }
  return value;
}

class ApiError extends Error {
  constructor(method, path, status, body) {
    const message = Array.isArray(body?.message) ? body.message.join('; ') : (body?.message ?? body);
    super(`${method} ${path} -> ${status}: ${message}`);
    this.status = status;
    this.body = body;
  }
}

// Сессия хранит cookies с токенами, которые бэкенд выставляет при входе.
class Session {
  constructor(label) {
    this.label = label;
    this.cookies = new Map();
  }

  async login(email, password) {
    await this.request('POST', '/auth/login', { email, password });
  }

  async request(method, path, body) {
    const response = await fetch(`${API_URL}${path}`, {
      method,
      headers: {
        ...(body === undefined ? {} : { 'Content-Type': 'application/json' }),
        ...(this.cookies.size > 0 ? { Cookie: this.cookieHeader() } : {}),
      },
      body: body === undefined ? undefined : JSON.stringify(body),
    });

    for (const cookie of response.headers.getSetCookie()) {
      const [pair] = cookie.split(';');
      const index = pair.indexOf('=');
      this.cookies.set(pair.slice(0, index), pair.slice(index + 1));
    }

    const text = await response.text();
    let data = text;
    if ((response.headers.get('content-type') ?? '').includes('application/json') && text) {
      data = JSON.parse(text);
    }

    if (!response.ok) {
      throw new ApiError(method, path, response.status, data);
    }
    return data;
  }

  // Списки бэкенд отдаёт с 404, если они пустые.
  async list(path) {
    try {
      return await this.request('GET', path);
    } catch (error) {
      if (error instanceof ApiError && error.status === 404) {
        return [];
      }
      throw error;
    }
  }

  cookieHeader() {
    return [...this.cookies.entries()].map(([name, value]) => `${name}=${value}`).join('; ');
  }
}

// ---------- Отчёт ----------

const stats = { created: 0, skipped: 0 };

function created(what) {
  stats.created++;
  console.log(`  + ${what}`);
}

function skipped(what, reason) {
  stats.skipped++;
  console.log(`  = ${what} (${reason})`);
}

// ---------- Даты ----------

function toDateString(date) {
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${date.getFullYear()}-${month}-${day}`;
}

// Занятия начинаются с завтрашнего дня: так все даты гарантированно в будущем.
function upcomingDays(count) {
  const days = [];
  const date = new Date();
  date.setHours(12, 0, 0, 0);
  for (let i = 1; i <= count; i++) {
    const day = new Date(date);
    day.setDate(date.getDate() + i);
    days.push(day);
  }
  return days;
}

// ---------- Шаги ----------

async function seedUsers(admin, people, role) {
  console.log(role === 'TRAINER' ? '\nТренеры' : '\nКлиенты');
  const ids = {};

  for (const person of people) {
    let all = await admin.list('/users/all');
    let user = all.find((u) => u.email === person.email);

    if (!user) {
      await admin.request('POST', '/users', {
        email: person.email,
        password: DEMO_PASSWORD,
        name: person.name,
        phone: person.phone,
      });
      all = await admin.list('/users/all');
      user = all.find((u) => u.email === person.email);
      created(`${person.name} <${person.email}>`);
    } else {
      skipped(`${person.name}`, 'уже есть');
    }

    if (!user.active) {
      await admin.request('PATCH', `/users/${user.id}/restore`);
      console.log(`    активирован ${person.name}`);
    }

    if (user.role !== role) {
      await admin.request('PATCH', `/users/${user.id}/set-role/${role}`);
      console.log(`    роль ${person.name}: ${user.role} -> ${role}`);
    }

    ids[person.key] = user.id;
  }

  return ids;
}

async function seedServices(admin) {
  console.log('\nУслуги');
  const existing = await admin.list('/services');
  const ids = {};

  for (const service of SERVICES) {
    let found = existing.find((s) => s.name === service.name);
    if (found) {
      skipped(service.name, 'уже есть');
    } else {
      found = await admin.request('POST', '/services', {
        name: service.name,
        type: service.type,
        description: service.description,
        price: service.price,
      });
      created(`${service.name} (${service.price} €)`);
    }
    ids[service.key] = found.id;
  }

  return ids;
}

async function seedMemberships(admin) {
  console.log('\nТарифы абонементов');
  const existing = await admin.list('/memberships');
  const ids = {};

  for (const membership of MEMBERSHIPS) {
    let found = existing.find((m) => m.name === membership.name && m.type === membership.type);
    if (found) {
      skipped(membership.name, 'уже есть');
    } else {
      found = await admin.request('POST', '/memberships', {
        name: membership.name,
        type: membership.type,
        description: membership.description,
        price: membership.price,
        durationInDays: membership.durationInDays,
      });
      created(`${membership.name} (${membership.price} €, ${membership.durationInDays} дн.)`);
    }
    ids[membership.key] = found.id;
  }

  return ids;
}

async function seedSchedules(admin, serviceIds, trainerIds) {
  console.log(`\nРасписание на ${SCHEDULE_DAYS} дней`);
  const existing = await admin.list('/schedules');
  const sameSlot = (s, date, slot) =>
    s.date.slice(0, 10) === date &&
    s.startTime.slice(0, 5) === slot.start &&
    s.service.id === serviceIds[slot.service];

  // service key -> занятия по порядку дат (нужно для записей клиентов)
  const byService = {};
  let createdCount = 0;
  let skippedCount = 0;

  for (const day of upcomingDays(SCHEDULE_DAYS)) {
    const date = toDateString(day);

    for (const slot of WEEKLY_PLAN[day.getDay()] ?? []) {
      let schedule = existing.find((s) => sameSlot(s, date, slot));

      if (schedule) {
        skippedCount++;
      } else {
        schedule = await admin.request('POST', '/schedules', {
          serviceId: serviceIds[slot.service],
          trainerId: trainerIds[slot.trainer],
          date,
          startTime: slot.start,
          endTime: slot.end,
          capacity: slot.capacity,
        });
        createdCount++;
      }

      (byService[slot.service] ??= []).push(schedule.id);
    }
  }

  stats.created += createdCount;
  stats.skipped += skippedCount;
  console.log(`  + создано занятий: ${createdCount}, уже было: ${skippedCount}`);

  return byService;
}

async function seedNews(admin) {
  console.log('\nНовости');
  const existing = await admin.list('/news');

  // Новости выводятся от новых к старым, поэтому добавляем их в обратном
  // порядке: первая в списке окажется наверху ленты.
  for (const item of [...NEWS].reverse()) {
    if (existing.some((n) => n.title === item.title)) {
      skipped(item.title, 'уже есть');
      continue;
    }
    await admin.request('POST', '/news', item);
    created(item.title);
  }
}

async function seedClientActivity(admin, schedulesByService, membershipIds) {
  console.log('\nЗаписи и абонементы клиентов');

  for (const client of CLIENTS) {
    const session = new Session(client.name);
    await session.login(client.email, DEMO_PASSWORD);

    // Записи на занятия
    const myBookings = await session.list('/bookings/my');
    for (const plan of CLIENT_BOOKINGS[client.key] ?? []) {
      const scheduleId = schedulesByService[plan.service]?.[plan.occurrence];
      if (!scheduleId) {
        skipped(`${client.name}: запись на ${plan.service}`, 'нет подходящего занятия');
        continue;
      }

      const alreadyBooked = myBookings.some(
        (b) => b.schedule.id === scheduleId && b.status !== 'CANCELLED',
      );
      if (alreadyBooked) {
        skipped(`${client.name}: запись на ${plan.service}`, 'уже записан');
        continue;
      }

      try {
        await session.request('POST', '/bookings/my', { scheduleId });
        created(`${client.name}: запись на ${plan.service}`);
      } catch (error) {
        // 409 - нет мест или уже записан: для демо это не ошибка.
        if (error instanceof ApiError && error.status === 409) {
          skipped(`${client.name}: запись на ${plan.service}`, error.message);
        } else {
          throw error;
        }
      }
    }

    // Абонемент
    const plan = CLIENT_MEMBERSHIPS[client.key];
    if (!plan) {
      continue;
    }

    const membershipId = membershipIds[plan.membership];
    const myMemberships = await session.list('/user-memberships/my');
    let userMembership = myMemberships.find(
      (um) => um.membership.id === membershipId && um.status !== 'CANCELLED',
    );

    if (userMembership) {
      skipped(`${client.name}: абонемент ${userMembership.membership.name}`, `уже есть, ${userMembership.status}`);
    } else {
      userMembership = await session.request('POST', '/user-memberships/my', { membershipId });
      created(`${client.name}: заявка на абонемент ${userMembership.membership.name}`);
    }

    if (plan.confirm && userMembership.status === 'PENDING') {
      await admin.request('PATCH', `/user-memberships/${userMembership.id}/confirm`);
      created(`${client.name}: оплата абонемента подтверждена`);
    }
  }

}

// ---------- Запуск ----------

async function main() {
  console.log(`Сервер: ${API_URL}`);

  const admin = new Session('admin');
  try {
    await admin.login(ADMIN_EMAIL, ADMIN_PASSWORD);
  } catch (error) {
    console.error(`Не удалось войти как администратор: ${error.message}`);
    console.error('Проверьте SEED_API_URL, SEED_ADMIN_EMAIL, SEED_ADMIN_PASSWORD и что у пользователя роль ADMIN.');
    process.exit(1);
  }

  const me = await admin.request('GET', '/auth/me');
  if (me.role !== 'ADMIN') {
    console.error(`Пользователь ${ADMIN_EMAIL} вошёл, но его роль ${me.role}, а нужна ADMIN.`);
    process.exit(1);
  }
  console.log(`Вошли как ${me.name} (ADMIN)`);

  const trainerIds = await seedUsers(admin, TRAINERS, 'TRAINER');
  await seedUsers(admin, CLIENTS, 'CLIENT');
  const serviceIds = await seedServices(admin);
  const membershipIds = await seedMemberships(admin);
  const schedulesByService = await seedSchedules(admin, serviceIds, trainerIds);
  await seedNews(admin);
  await seedClientActivity(admin, schedulesByService, membershipIds);

  console.log(`\nГотово: создано ${stats.created}, пропущено (уже было) ${stats.skipped}.`);
  console.log(`Демо-пользователи входят с паролем из SEED_DEMO_PASSWORD, например ${CLIENTS[0].email}.`);
}

main().catch((error) => {
  console.error(`\nОшибка: ${error.message}`);
  process.exit(1);
});
