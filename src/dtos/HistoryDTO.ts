export type HistoryDTO = {
  id: string;
  name: string;
  group: string;
  hour: string;
  created_at: string;
};

export type HistoryByDate = {
  title: string;
  data: HistoryDTO[];
};
