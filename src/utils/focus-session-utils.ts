
export const prepareSessionsForHistory = (focusSessions: FocusSession[]) => {
  return focusSessions.map(session => ({
    ...session,
    date: typeof session.date === 'string' ? session.date : session.date.toISOString(),
    completed: true
  })) as any[];
};

export const prepareSessionsForStats = (focusSessions: FocusSession[]) => {
  return focusSessions.map(session => ({
    ...session,
    date: typeof session.date === 'string' ? session.date : session.date.toISOString(),
    completed: true
  })) as any[];
};
