This app runs on Firebase infrastructure. Was added 2 function
`makeData` - creates needed amount of fake data. Defaults to 100, max is 500.
The userId will be created based on provided one
If no userId provided - response will be 500

`thisMonthReport` - get the data from firestore for the last month.
If userId will be wrong - the request returns empty data object.

To test this function locally:

- install all packages using `yarn`
- run script `yarn serve`

Then go to postman and place this link to create fake data
`http://127.0.0.1:5001/backend-evaluation-project/us-central1/makeData?count=10&userId=12345`

To get the report run
`http://127.0.0.1:5001/backend-evaluation-project/us-central1/thisMonthReport?userId=12345`

To test deployed functions contact me by email `roman.kameniev@gmail.com`, I'll invite you to the project on firebase

the functions also available by link
makeData:
`https://us-central1-backend-evaluation-project.cloudfunctions.net/makeData`
thisMonthReport:
`https://us-central1-backend-evaluation-project.cloudfunctions.net/thisMonthReport`

If you want to set-up it for yourself:

- go to Firebase and create new project
- then migrate project to the `Blaze` plan
- from the firebase cli overwrite this project, but do not change `src/index.js` and `package.json`
- be aware, overwriting could cause eslint and import errors
- generate new service account and rename it to `service.json`
- drop `service.json` into functions folder.
- run `cd functions && yarn`
- run firebase emulators:start --project ${your-project-name}

1- If you were to extend to the project to add authentication and improved security, at a high level how would you do it?
\\\
I will use the passport or firebase auth module to login and add some hash functions to cover sensitive data in DB. Also, will add cors policy.

2- If this was a production server, how or with what tools would you monitor the state of the server and errors encountered?
\\\
The logger will work well to get the data from execution (Pino logger, logRocket, etc.), and every error should be thrown to the Grafana or any different monitor tool.

3- Your API ends up being highly successful and getting 10 million requests daily. What would you do to improve scalability to handle those loads? Provide a high level explanation, no need to delve into implementation details.
\\\
It could be handled by adding scaling. New instances of the lambda function will be created and managed with a load balancer. Functions should be of the minimum size. Instances also could be combined in the bigger clusters with another load balancer. And clusters combined into superclusters.
