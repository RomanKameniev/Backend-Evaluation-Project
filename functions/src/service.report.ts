import * as functions from "firebase-functions";

import { DbService } from "./db.service";
import { Block, IDatabase, IReportResponse } from "./service.types";

const MAX_DAY_AGO = 60;
const MIN_DAY_AGO = 1;

const MIN_BLOCK_LENGTH = 15;
const MAX_BLOCK_LENGTH = 600;

const MIN_BREAK_LENGTH = 0;
const MAX_BREAK_LENGTH = 45;

const MIN_TO_MILLISECOND = 60000;

export class Report {
  private readonly dbReports: IDatabase;

  constructor() {
    this.dbReports = new DbService();
  }

  public thisMonthReport = async (userId: string): Promise<IReportResponse> => {
    const reports = await this.dbReports.getReports(userId);

    let maxLength = 0;
    let mounthLength = 0;

    reports.forEach((doc: any) => {
      const { start, end, breakLength } = doc.data();

      const length = end - start - breakLength;
      if (maxLength < length) maxLength = this.evalToNearest(length);
      mounthLength += this.evalToNearest(length);
    });

    return {
      length: this.evalToNearest(mounthLength),
      maxLength,
      blockCount: reports.size,
      avgLength: this.evalToNearest(mounthLength / reports.size),
    };
  };

  public generateReports = async (
    userId: string,
    count: number
  ): Promise<void> => {
    functions.logger.log(count);

    const reports = Array(count)
      .fill({ userId })
      .map((data) => {
        const d = { ...data, ...this.getRandomData() };
        functions.logger.log(d, count);
        return d;
      });

    await this.dbReports.addReports(reports);
  };

  private getRandomData = (): Partial<Block> => {
    const daysAgo = this.getValueFromTimeRange(MAX_DAY_AGO, MIN_DAY_AGO);

    const timeRange = this.evalToNearest(
      this.getValueFromTimeRange(MAX_BLOCK_LENGTH, MIN_BLOCK_LENGTH)
    );

    const breakLength =
      this.getValueFromTimeRange(
        MAX_BREAK_LENGTH > timeRange ? timeRange : MAX_BREAK_LENGTH,
        MIN_BREAK_LENGTH
      ) * MIN_TO_MILLISECOND;

    const evalStartTime = this.evalToNearest(new Date().getMinutes());

    const startDate = new Date().setDate(new Date().getDate() - daysAgo);

    const start = new Date(startDate).setMinutes(evalStartTime);

    const end = new Date(
      new Date(start).getTime() + timeRange * MIN_TO_MILLISECOND
    ).valueOf();

    return {
      start,
      end,
      breakLength,
    };
  };

  private evalToNearest(num: number): number {
    return Math.round(num / 15) * 15;
  }

  private getValueFromTimeRange = (max: number, min: number): number => {
    return Math.floor(Math.random() * (max - min + 1) + min);
  };
}
