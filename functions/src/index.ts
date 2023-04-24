import * as functions from "firebase-functions";
import { Report } from "./service.report";
import { ECodes } from "./service.types";

const report = new Report();

export const makeData = functions.https.onRequest(async (request, response) => {
  const { userId, count = 100 } = request.query as {
    userId?: string;
    count?: string;
  };

  if (!userId)
    response.status(ECodes.BAD_REQUEST).send({ message: "No userId provided" });

  try {
    await report.generateReports(userId!, Number(count));
    response.status(ECodes.SUCCESS).send({ message: "ok" });
  } catch (error) {
    functions.logger.error(error);

    response.status(ECodes.SERVER_ERROR).send({ message: "Server error" });
    return;
  }
});

export const thisMonthReport = functions.https.onRequest(
  async (request, response) => {
    const { userId } = request.query as {
      userId?: string;
    };
    if (!userId?.length)
      response
        .status(ECodes.BAD_REQUEST)
        .send({ message: "No userId provided" });

    try {
      const data = await report.thisMonthReport(userId!);
      response.send({ code: 200, data });
      return;
    } catch (error) {
      functions.logger.info(error);

      response.status(ECodes.SERVER_ERROR).send({ message: "Server error" });
      return;
    }
  }
);
