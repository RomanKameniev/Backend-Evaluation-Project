import * as functions from "firebase-functions";

import { Block, ECollectionType, IDatabase } from "./service.types";
import { cert, initializeApp } from "firebase-admin/app";
import { getFirestore, Firestore } from "firebase-admin/firestore";

const serviceAccount = require("../service.json");

export class DbService implements IDatabase {
  private readonly db: Firestore;

  constructor() {
    initializeApp({
      credential: cert(serviceAccount),
    });
    this.db = getFirestore();
  }

  public addReports = async (reports: Array<Block>): Promise<void> => {
    functions.logger.info(`writing ${reports.length} items`);

    const batch = this.db.batch();
    reports.forEach((report) => {
      batch.set(this.db.collection(ECollectionType.reports).doc(), report);
    });

    await batch.commit();
  };

  public getReports = (userId: string): Promise<any> => {
    const startDate = new Date().setDate(1);

    const dateWithoutHours = new Date(startDate).setHours(0, 0, 0, 0);
    functions.logger.info(`date => ${dateWithoutHours}`, userId);

    return this.db
      .collection(ECollectionType.reports)
      .where("userId", "==", userId)
      .where("start", ">=", dateWithoutHours)
      .get();
  };
}
