import { neon } from "@neondatabase/serverless";

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  console.log("[db] DATABASE_URL 없음: 로컬 빌드에서는 마이그레이션을 건너뜁니다.");
  process.exit(0);
}

const sql = neon(connectionString);

const statements = [
  `create table if not exists ministry_requests (
    id serial primary key,
    request_type text not null,
    name text,
    contact text,
    subject text not null,
    message text not null,
    options text,
    status text not null default 'received',
    admin_note text,
    consented boolean not null,
    submitted_at timestamptz not null default now()
  )`,
  `create table if not exists discipleship_programs (
    id serial primary key,
    title text not null,
    summary text not null,
    schedule text,
    location text,
    capacity text,
    status text not null default 'recruiting',
    sort_order integer not null default 0,
    created_at timestamptz not null default now()
  )`,
  `create table if not exists sermons (
    id serial primary key,
    title text not null,
    scripture text,
    preacher text,
    video_url text not null,
    description text,
    preached_on text not null,
    created_at timestamptz not null default now()
  )`,
  `create table if not exists church_events (
    id serial primary key,
    title text not null,
    category text,
    starts_at text not null,
    ends_at text,
    location text,
    description text,
    registration_open boolean not null default false,
    created_at timestamptz not null default now()
  )`,
  `alter table church_events add column if not exists registration_open boolean not null default false`,
  `create table if not exists giving_information (
    id serial primary key,
    bank text not null,
    account_number text not null,
    account_holder text not null,
    note text,
    updated_at timestamptz not null default now()
  )`,
  `create table if not exists daily_words (
    id serial primary key,
    title text not null,
    scripture text not null,
    revised_korean_text text,
    new_korean_translation_text text,
    niv_text text,
    message text not null,
    application text,
    prayer text,
    source text not null default 'manual',
    published_on text not null unique,
    created_at timestamptz not null default now()
  )`,
  `create table if not exists members (
    id serial primary key,
    name text not null,
    email text not null unique,
    phone text not null unique,
    birth_date text not null,
    password_hash text not null,
    account_status text not null default 'active',
    membership_status text not null default 'nonmember',
    role text not null default 'member',
    member_number text unique,
    registration_category integer,
    privacy_consented_at timestamptz not null default now(),
    approved_at timestamptz,
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now()
  )`,
  `create table if not exists member_sessions (
    id serial primary key,
    member_id integer not null references members(id) on delete cascade,
    token_hash text not null unique,
    expires_at timestamptz not null,
    created_at timestamptz not null default now()
  )`,
  `create table if not exists member_login_attempts (
    id serial primary key,
    identifier_hash text not null unique,
    attempts integer not null default 0,
    window_started_at timestamptz not null default now(),
    blocked_until timestamptz,
    updated_at timestamptz not null default now()
  )`,
  `create table if not exists member_number_counters (
    id serial primary key,
    registration_year integer not null,
    category integer not null,
    last_number integer not null default 0,
    unique (registration_year, category)
  )`,
  `create table if not exists attendance_events (
    id serial primary key,
    title text not null,
    event_type text not null,
    held_on text not null,
    starts_at text,
    created_at timestamptz not null default now()
  )`,
  `create table if not exists attendance_records (
    id serial primary key,
    event_id integer not null references attendance_events(id) on delete cascade,
    member_id integer not null references members(id) on delete cascade,
    status text not null default 'present',
    method text not null default 'manual',
    note text,
    checked_in_at timestamptz not null default now(),
    unique (event_id, member_id)
  )`,
  `create index if not exists ministry_requests_type_date_idx on ministry_requests (request_type, submitted_at desc)`,
  `create index if not exists sermons_preached_on_idx on sermons (preached_on desc)`,
  `create index if not exists church_events_starts_at_idx on church_events (starts_at)`,
  `create index if not exists daily_words_published_on_idx on daily_words (published_on desc)`,
  `create index if not exists members_membership_status_idx on members (membership_status, created_at desc)`,
  `create index if not exists member_sessions_member_expiry_idx on member_sessions (member_id, expires_at desc)`,
  `create index if not exists member_login_attempts_blocked_idx on member_login_attempts (blocked_until)`,
  `create index if not exists attendance_events_held_on_idx on attendance_events (held_on desc)`,
  `create index if not exists attendance_records_member_idx on attendance_records (member_id, checked_in_at desc)`,
  `insert into giving_information (bank, account_number, account_holder, note)
  select '기업은행', '01072454295', '백승건', '온라인 헌금 안내'
  where not exists (select 1 from giving_information)`,
];

for (const statement of statements) {
  await sql.query(statement);
}

console.log("[db] Immanuel-home-test Neon 스키마 준비 완료");
