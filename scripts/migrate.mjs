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
    created_at timestamptz not null default now()
  )`,
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
  `create index if not exists ministry_requests_type_date_idx on ministry_requests (request_type, submitted_at desc)`,
  `create index if not exists sermons_preached_on_idx on sermons (preached_on desc)`,
  `create index if not exists church_events_starts_at_idx on church_events (starts_at)`,
  `create index if not exists daily_words_published_on_idx on daily_words (published_on desc)`,
  `insert into giving_information (bank, account_number, account_holder, note)
  select '기업은행', '01072454295', '백승건', '온라인 헌금 안내'
  where not exists (select 1 from giving_information)`,
];

for (const statement of statements) {
  await sql.query(statement);
}

console.log("[db] Immanuel-home-test Neon 스키마 준비 완료");
