const fs = require("fs");
const MongoClient = require("mongodb").MongoClient;
const nodeHint = require("./node-hint").hint;
const defaultReporter = require("./node-hint/lib/report").report;

const report = {
  reporter: defaultReporter,
  options: { oneErrorPerLine: false },
};

MongoClient.connect(
  "mongodb://admin:ase123@127.0.0.1:27017/zerionProd?authSource=admin",
  (err, db) => {
    const collection = db.collection("page");

    collection.find({ "PAGE.PROFILE": 145087 }).toArray((err, results) => {
      let str = "";

      results.forEach((doc) => {
        if (
          doc.PAGE.PAGE_JAVASCRIPT &&
          typeof doc.PAGE.PAGE_JAVASCRIPT === "string"
        ) {
          console.log(doc.PAGE.ID);
          const options = {
            source: doc.PAGE.PAGE_JAVASCRIPT,
            sourceName: "Page Id " + doc.PAGE.ID,
            report,
          };

          nodeHint(options, (err, result) => {
            str += [
              `PAGE JAVASCRIPT PROBLEMS FOR ${doc.PAGE.NAME}`,
              result,
              "/----------------------------------------------------------------------------------------------------------/\n",
            ].join("\n");
            console.log(result);
            console.log();
          });
        }

        doc.ELEMENTS.forEach((element) => {
          if (
            element.DYNAMIC_VALUE &&
            typeof element.DYNAMIC_VALUE === "string"
          ) {
            const options = {
              source: element.DYNAMIC_VALUE,
              sourceName: `Page Id ${doc.PAGE.ID} ${element.NAME} Dynamic Value`,
              report,
            };

            nodeHint(options, (err, result) => {
              str += [
                `ELEMENT DYNAMIC_VALUE PROBLEMS FOR ${element.NAME} IN PAGE ${doc.PAGE.NAME}`,
                `JavaScript: + ${element.DYNAMIC_VALUE}`,
                result,
                "/----------------------------------------------------------------------------------------------------------/\n",
              ].join("\n");
              console.log(result);
              console.log();
            });
          }

          if (
            element.CONDITION_VALUE &&
            typeof element.CONDITION_VALUE === "string"
          ) {
            const options = {
              source: element.CONDITION_VALUE,
              sourceName: `Page Id ${doc.PAGE.ID} ${element.NAME} Condition Value`,
              report,
            };

            nodeHint(options, (err, result) => {
              str += [
                `ELEMENT CONDITION_VALUE PROBLEMS FOR ${element.NAME} IN PAGE ${doc.PAGE.NAME}`,
                `JavaScript: ${element.CONDITION_VALUE}`,
                result,

                "/----------------------------------------------------------------------------------------------------------/\n",
              ].join("\n");
              console.log(result);
              console.log();
            });
          }

          if (
            element.DYNAMIC_LABEL &&
            typeof element.DYNAMIC_LABEL === "string"
          ) {
            const options = {
              source: element.DYNAMIC_LABEL,
              sourceName: `Page Id ${doc.PAGE.ID} ${element.NAME} Dynamic Label`,
              report,
            };

            nodeHint(options, (err, result) => {
              str += [
                `ELEMENT DYNAMIC_LABEL PROBLEMS FOR ${element.NAME} IN PAGE ${doc.PAGE.NAME}`,
                `JavaScript: ${element.DYNAMIC_LABEL}`,
                result,
                "/----------------------------------------------------------------------------------------------------------/\n",
              ].join("\n");
              console.log(result);
              console.log();
            });
          }
        });
      });

      fs.appendFile("output.txt", str, (err) => {});
    });
  }
);
