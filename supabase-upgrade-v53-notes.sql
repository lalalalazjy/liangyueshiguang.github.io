begin;

alter table public.records
  drop constraint if exists records_type_check;

alter table public.records
  add constraint records_type_check check (
    type in (
      'task',
      'wish',
      'goal',
      'expense',
      'message',
      'sleep',
      'intimacy',
      'memory',
      'note',
      'future_letter',
      'space_settings'
    )
  );

commit;
