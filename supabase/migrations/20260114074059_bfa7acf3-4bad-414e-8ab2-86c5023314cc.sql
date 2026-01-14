-- Create unified tasks table for cross-device sync
CREATE TABLE IF NOT EXISTS public.unified_tasks (
  id TEXT PRIMARY KEY,
  user_id UUID NOT NULL,
  data JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_unified_tasks_user_id ON public.unified_tasks (user_id);

ALTER TABLE public.unified_tasks ENABLE ROW LEVEL SECURITY;

-- RLS policies
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'unified_tasks' AND policyname = 'Users can view their own unified tasks'
  ) THEN
    CREATE POLICY "Users can view their own unified tasks"
    ON public.unified_tasks
    FOR SELECT
    USING (auth.uid() = user_id);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'unified_tasks' AND policyname = 'Users can create their own unified tasks'
  ) THEN
    CREATE POLICY "Users can create their own unified tasks"
    ON public.unified_tasks
    FOR INSERT
    WITH CHECK (auth.uid() = user_id);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'unified_tasks' AND policyname = 'Users can update their own unified tasks'
  ) THEN
    CREATE POLICY "Users can update their own unified tasks"
    ON public.unified_tasks
    FOR UPDATE
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'unified_tasks' AND policyname = 'Users can delete their own unified tasks'
  ) THEN
    CREATE POLICY "Users can delete their own unified tasks"
    ON public.unified_tasks
    FOR DELETE
    USING (auth.uid() = user_id);
  END IF;
END $$;

-- updated_at trigger
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger WHERE tgname = 'update_unified_tasks_updated_at'
  ) THEN
    CREATE TRIGGER update_unified_tasks_updated_at
    BEFORE UPDATE ON public.unified_tasks
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();
  END IF;
END $$;