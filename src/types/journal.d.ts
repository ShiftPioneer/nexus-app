
interface JournalEntry {
  id: string;
  title: string;
  content: string;
  date: Date;
  tags: string[];
  mood: "positive" | "negative" | "neutral" | "mixed";
}
