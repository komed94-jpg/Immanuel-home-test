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
  `create table if not exists discipleship_sessions (
    id serial primary key,
    program_id integer not null references discipleship_programs(id) on delete cascade,
    session_number integer not null,
    title text not null,
    stage_key text not null,
    held_on text,
    created_at timestamptz not null default now(),
    unique (program_id, session_number)
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
  `alter table church_events add column if not exists is_public boolean not null default true`,
  `alter table church_events add column if not exists registration_starts_at text`,
  `alter table church_events add column if not exists registration_ends_at text`,
  `alter table church_events add column if not exists capacity integer`,
  `alter table church_events add column if not exists attendance_event_id integer`,
  // 테스트 홈페이지 캘린더 확인용 기본 일정입니다. 같은 제목·시작 일시는 다시 넣지 않습니다.
  `insert into church_events (title, category, starts_at, ends_at, location, description, is_public, registration_open)
   select item.title, item.category, item.starts_at, item.ends_at, item.location, item.description, true, false
   from (values
     ('주일예배', '예배', '2026-07-26T11:00', '2026-07-26T12:20', '본당', '캘린더 기능 확인용 가상 일정입니다.'),
     ('금요철야', '예배', '2026-07-24T21:00', '2026-07-24T23:00', '본당', '캘린더 기능 확인용 가상 일정입니다.'),
     ('제자훈련 1', '훈련', '2026-07-28T19:30', '2026-07-28T21:00', '제1교육관', '캘린더 기능 확인용 가상 일정입니다.'),
     ('제자훈련 2', '훈련', '2026-07-22T19:30', '2026-07-22T21:00', '제2교육관', '캘린더 기능 확인용 가상 일정입니다.'),
     ('주일예배', '예배', '2026-08-02T11:00', '2026-08-02T12:20', '본당', '캘린더 기능 확인용 가상 일정입니다.'),
     ('금요철야', '예배', '2026-07-31T21:00', '2026-07-31T23:00', '본당', '캘린더 기능 확인용 가상 일정입니다.'),
     ('제자훈련 1', '훈련', '2026-08-04T19:30', '2026-08-04T21:00', '제1교육관', '캘린더 기능 확인용 가상 일정입니다.'),
     ('제자훈련 2', '훈련', '2026-07-29T19:30', '2026-07-29T21:00', '제2교육관', '캘린더 기능 확인용 가상 일정입니다.'),
     ('주일예배', '예배', '2026-08-09T11:00', '2026-08-09T12:20', '본당', '캘린더 기능 확인용 가상 일정입니다.'),
     ('금요철야', '예배', '2026-08-07T21:00', '2026-08-07T23:00', '본당', '캘린더 기능 확인용 가상 일정입니다.'),
     ('제자훈련 1', '훈련', '2026-08-11T19:30', '2026-08-11T21:00', '제1교육관', '캘린더 기능 확인용 가상 일정입니다.'),
     ('제자훈련 2', '훈련', '2026-08-05T19:30', '2026-08-05T21:00', '제2교육관', '캘린더 기능 확인용 가상 일정입니다.'),
     ('주일예배', '예배', '2026-08-16T11:00', '2026-08-16T12:20', '본당', '캘린더 기능 확인용 가상 일정입니다.'),
     ('금요철야', '예배', '2026-08-14T21:00', '2026-08-14T23:00', '본당', '캘린더 기능 확인용 가상 일정입니다.'),
     ('제자훈련 1', '훈련', '2026-08-18T19:30', '2026-08-18T21:00', '제1교육관', '캘린더 기능 확인용 가상 일정입니다.'),
     ('제자훈련 2', '훈련', '2026-08-12T19:30', '2026-08-12T21:00', '제2교육관', '캘린더 기능 확인용 가상 일정입니다.'),
     ('제자훈련 2', '훈련', '2026-08-19T19:30', '2026-08-19T21:00', '제2교육관', '캘린더 기능 확인용 가상 일정입니다.')
   ) as item(title, category, starts_at, ends_at, location, description)
   where not exists (
     select 1 from church_events existing
     where existing.title = item.title and existing.starts_at = item.starts_at
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
    address text,
    occupation text,
    current_department text,
    faith_years text,
    baptism_type text,
    baptism_church text,
    previous_church_name text,
    previous_church_position text,
    service_history text,
    pastoral_note text,
    privacy_consented_at timestamptz not null default now(),
    approved_at timestamptz,
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now()
  )`,
  `alter table members add column if not exists address text`,
  `alter table members add column if not exists occupation text`,
  `alter table members add column if not exists current_department text`,
  `alter table members add column if not exists faith_years text`,
  `alter table members add column if not exists baptism_type text`,
  `alter table members add column if not exists baptism_church text`,
  `alter table members add column if not exists previous_church_name text`,
  `alter table members add column if not exists previous_church_position text`,
  `alter table members add column if not exists service_history text`,
  `alter table members add column if not exists pastoral_note text`,
  `create table if not exists discipleship_applications (
    id serial primary key,
    program_id integer not null references discipleship_programs(id) on delete cascade,
    member_id integer not null references members(id) on delete cascade,
    motivation text,
    status text not null default 'pending',
    admin_note text,
    applied_at timestamptz not null default now(),
    reviewed_at timestamptz,
    completed_at timestamptz,
    updated_at timestamptz not null default now(),
    unique (program_id, member_id)
  )`,
  `create table if not exists discipleship_attendance (
    id serial primary key,
    session_id integer not null references discipleship_sessions(id) on delete cascade,
    application_id integer not null references discipleship_applications(id) on delete cascade,
    status text not null default 'absent',
    note text,
    checked_at timestamptz not null default now(),
    unique (session_id, application_id)
  )`,
  `alter table ministry_requests add column if not exists member_id integer references members(id) on delete set null`,
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
  `create table if not exists member_password_reset_tokens (
    id serial primary key,
    member_id integer not null references members(id) on delete cascade,
    token_hash text not null unique,
    expires_at timestamptz not null,
    used_at timestamptz,
    created_at timestamptz not null default now()
  )`,
  `create table if not exists new_family_registrations (
    id serial primary key,
    request_id integer not null unique references ministry_requests(id) on delete cascade,
    member_id integer references members(id) on delete set null,
    card_type text not null,
    birth_date text not null,
    address text not null,
    email text not null,
    occupation text not null,
    family_info text not null,
    referral text not null,
    guide_name text,
    guide_phone text,
    guide_relation text,
    faith_status text,
    faith_years text,
    previous_church_name text,
    faith_history text,
    church_position text,
    service_history text,
    ordinance_type text,
    ordinance_church text,
    participation text,
    review_status text not null default 'received',
    review_note text,
    reviewed_at timestamptz,
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now()
  )`,
  `create table if not exists new_family_journeys (
    id serial primary key,
    registration_id integer not null unique references new_family_registrations(id) on delete cascade,
    member_id integer references members(id) on delete set null,
    stage text not null default 'received',
    journey_status text not null default 'active',
    assignee text,
    first_visited_on text,
    visit_count integer not null default 1,
    last_contact_on text,
    last_contact_result text,
    next_action_on text,
    consultation_note text,
    small_group_name text,
    education_progress integer not null default 0,
    settled_at timestamptz,
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now()
  )`,
  `create table if not exists new_family_followups (
    id serial primary key,
    journey_id integer not null references new_family_journeys(id) on delete cascade,
    action_type text not null,
    happened_on text not null,
    result text not null,
    next_action_on text,
    note text,
    actor text not null default 'admin',
    created_at timestamptz not null default now()
  )`,
  `create table if not exists new_family_messages (
    id serial primary key,
    journey_id integer not null references new_family_journeys(id) on delete cascade,
    channel text not null,
    recipient text not null,
    content text not null,
    status text not null,
    provider text not null default 'solapi',
    provider_message_id text,
    error_message text,
    sent_at timestamptz,
    actor text not null default 'admin',
    created_at timestamptz not null default now()
  )`,
  `insert into new_family_journeys (registration_id, member_id, first_visited_on, visit_count)
   select registration.id, registration.member_id, registration.created_at::date::text, 1
   from new_family_registrations registration
   on conflict (registration_id) do nothing`,
  `create table if not exists member_approval_logs (
    id serial primary key,
    member_id integer not null references members(id) on delete cascade,
    action text not null,
    previous_value text,
    new_value text,
    note text,
    actor text not null default 'admin',
    created_at timestamptz not null default now()
  )`,
  `create table if not exists households (
    id serial primary key,
    name text not null,
    address text,
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now()
  )`,
  `create table if not exists household_members (
    id serial primary key,
    household_id integer not null references households(id) on delete cascade,
    member_id integer not null unique references members(id) on delete cascade,
    relationship text not null default '본인',
    is_primary boolean not null default false,
    created_at timestamptz not null default now()
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
    finalized_at timestamptz,
    created_at timestamptz not null default now()
  )`,
  `alter table attendance_events add column if not exists finalized_at timestamptz`,
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
  `create table if not exists event_applications (
    id serial primary key,
    event_id integer not null references church_events(id) on delete cascade,
    member_id integer references members(id) on delete set null,
    applicant_type text not null,
    applicant_name text not null,
    contact text not null,
    contact_key text not null,
    status text not null default 'registered',
    attendance_status text,
    note text,
    admin_note text,
    cancel_token_hash text not null unique,
    applied_at timestamptz not null default now(),
    updated_at timestamptz not null default now(),
    cancelled_at timestamptz,
    unique (event_id, contact_key),
    unique (event_id, member_id)
  )`,
  `create index if not exists ministry_requests_type_date_idx on ministry_requests (request_type, submitted_at desc)`,
  `create index if not exists sermons_preached_on_idx on sermons (preached_on desc)`,
  `create index if not exists church_events_starts_at_idx on church_events (starts_at)`,
  `create index if not exists event_applications_event_status_idx on event_applications (event_id, status, applied_at)`,
  `create index if not exists event_applications_member_idx on event_applications (member_id, applied_at desc)`,
  `create index if not exists daily_words_published_on_idx on daily_words (published_on desc)`,
  `create index if not exists members_membership_status_idx on members (membership_status, created_at desc)`,
  `create index if not exists member_sessions_member_expiry_idx on member_sessions (member_id, expires_at desc)`,
  `create index if not exists member_login_attempts_blocked_idx on member_login_attempts (blocked_until)`,
  `create index if not exists member_password_reset_member_idx on member_password_reset_tokens (member_id, created_at desc)`,
  `create index if not exists new_family_registration_member_idx on new_family_registrations (member_id, created_at desc)`,
  `create index if not exists new_family_registration_status_idx on new_family_registrations (review_status, created_at desc)`,
  `create index if not exists new_family_journey_stage_idx on new_family_journeys (journey_status, stage, next_action_on)`,
  `create index if not exists new_family_journey_member_idx on new_family_journeys (member_id, updated_at desc)`,
  `create index if not exists new_family_followup_journey_idx on new_family_followups (journey_id, happened_on desc, created_at desc)`,
  `create index if not exists new_family_message_journey_idx on new_family_messages (journey_id, created_at desc)`,
  `create index if not exists member_approval_log_member_idx on member_approval_logs (member_id, created_at desc)`,
  `create index if not exists household_member_household_idx on household_members (household_id, member_id)`,
  `create index if not exists attendance_events_held_on_idx on attendance_events (held_on desc)`,
  `create index if not exists attendance_records_member_idx on attendance_records (member_id, checked_in_at desc)`,
  `create index if not exists discipleship_applications_member_idx on discipleship_applications (member_id, applied_at desc)`,
  `create index if not exists discipleship_applications_program_status_idx on discipleship_applications (program_id, status, applied_at)`,
  `create index if not exists discipleship_sessions_program_idx on discipleship_sessions (program_id, session_number)`,
  `create index if not exists discipleship_attendance_application_idx on discipleship_attendance (application_id, session_id)`,
  `create table if not exists bible_study_responses (
    id serial primary key,
    member_id integer not null references members(id) on delete cascade,
    course_slug text not null,
    lesson_slug text not null,
    page_key text not null,
    question_key text not null,
    answer text not null default '',
    studied_on text not null,
    updated_at timestamptz not null default now(),
    unique (member_id, course_slug, lesson_slug, page_key, question_key)
  )`,
  `create table if not exists bible_study_page_progress (
    id serial primary key,
    member_id integer not null references members(id) on delete cascade,
    course_slug text not null,
    lesson_slug text not null,
    page_key text not null,
    studied_on text not null,
    completed_at timestamptz not null default now(),
    updated_at timestamptz not null default now(),
    unique (member_id, course_slug, lesson_slug, page_key)
  )`,
  `create table if not exists bible_study_completions (
    id serial primary key,
    member_id integer not null references members(id) on delete cascade,
    course_slug text not null,
    status text not null default 'ready',
    admin_note text,
    completed_at timestamptz not null default now(),
    certified_at timestamptz,
    updated_at timestamptz not null default now(),
    unique (member_id, course_slug)
  )`,
  `create index if not exists bible_study_responses_member_idx on bible_study_responses (member_id, course_slug, updated_at desc)`,
  `create index if not exists bible_study_progress_member_idx on bible_study_page_progress (member_id, course_slug, completed_at desc)`,
  `create index if not exists bible_study_completions_status_idx on bible_study_completions (course_slug, status, completed_at desc)`,
  `insert into discipleship_sessions (program_id, session_number, title, stage_key)
   select p.id, s.session_number, s.title, s.stage_key
   from discipleship_programs p
   cross join (values
     (1, '인식', 'awareness'),
     (2, '직면', 'confrontation'),
     (3, '회개', 'repentance'),
     (4, '치유', 'healing'),
     (5, '재해석', 'reinterpretation'),
     (6, '훈련', 'training'),
     (7, '관계 변화', 'relationship'),
     (8, '사명 회복', 'mission')
   ) as s(session_number, title, stage_key)
   on conflict (program_id, session_number) do nothing`,
  `insert into giving_information (bank, account_number, account_holder, note)
  select '기업은행', '01072454295', '백승건', '온라인 헌금 안내'
  where not exists (select 1 from giving_information)`,
];

for (const statement of statements) {
  await sql.query(statement);
}

console.log("[db] Immanuel-home-test Neon 스키마 준비 완료");
