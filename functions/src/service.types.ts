type Block = {
  id: string; // the block id, primary key
  userId: string; // the user whom this block object belongs to
  start: number; // millisecond since epoch, start date of block
  end: number; // millisecond since epoch, end date of the block
  breakLength: number; // millisecond, length of a break
};

enum ECollectionType {
  reports = "reports",
}

enum ECodes {
  SUCCESS = 200,
  BAD_REQUEST = 400,
  SERVER_ERROR = 500,
}

interface IReport {
  generateReports: (userId: string, count: number) => void;
  getRandomData: () => Partial<Block>;
}

interface IDatabase {
  addReports: (data: Array<Block>) => Promise<void>;
  getReports: (userId: string) => Promise<any>;
}

interface IReportResponse {
  length: number | null;
  maxLength: number | null;
  blockCount: number | null;
  avgLength: number | null;
}

export { ECodes, ECollectionType };

export type { Block, IDatabase, IReport, IReportResponse };
