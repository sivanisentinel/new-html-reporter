//file scan for screenshots
const fs = require('fs');
const Handlebars = require('handlebars');

Handlebars.registerHelper('eq', function (string1, string2) {
    return string1 === string2;
});

module.exports = function () {
    return {
        noColors:    true,
        summaryData: {
            serverUrl:         '',
            taskStartTime:     '',
            taskTestCount:     '',
            skipped:           0,
            browser:           '',
            duration:          0,
            failed:            0,
            reportFixtursData: [],
            errorsData:        []
        },
        /*
        current fixture structure
        {
        name: string,
        path: string,
        meta: meta,
        failed: boolean,
        tests: {
                  status:   testRunInfo.skipped ? 'skipped' : result,
                  index:    currentTestNumber,
                  testName:     name,
                  duration: testRunInfo.durationMs
        }[]
        }
    */
        currentfixture: {},

        currentTestNumber: 0,


        reportTaskStart (startTime, userAgents, testCount) {
            this.summaryData.taskStartTime = startTime;
            this.summaryData.browser = userAgents.join(', ');
            this.summaryData.taskTestCount = testCount;
        },

        reportFixtureStart: function (name, path, meta) {
            this.currentfixture = { name: name, path: path, meta: meta, failed: 0, tests: [] };
            this.summaryData.reportFixtursData.push(this.currentfixture);

            if (meta && meta.url) this.summaryData.serverUrl = `${meta.url}/login?username=${meta.username}&password=${meta.password}`;
        },

        reportTestDone (name, testRunInfo) {
            const hasErr = !!testRunInfo.errs.length;

            let result;

            this.currentTestNumber += 1;

            if (hasErr) {
                result = 'failed';
                this.currentfixture.failed = true;
                this.summaryData.failed += 1;
                const errorsData = {
                    id:          this.currentTestNumber,
                    fixture:     this.currentfixture.name,
                    name:        name,
                    screenshots: [],
                    stackTrace:  []
                };

                if (testRunInfo.screenshots) {
                    testRunInfo.screenshots.forEach((screenshot) => {
                        errorsData.screenshots.push(fs.readFileSync(screenshot.screenshotPath, { encoding: 'base64' }));
                    });
                }

                testRunInfo.errs.forEach((error) => {
                    errorsData.stackTrace.push(this.formatError(error, ''));
                    //errorsData.stackTrace.push(this.escapeHtml(JSON.stringify(error)));
                });

                this.summaryData.errorsData.push(errorsData);
            }
            else result = 'passed';


            if (testRunInfo.skipped) this.summaryData.skipped += 1;

            const testInfo = {
                status:   testRunInfo.skipped ? 'skipped' : result,
                index:    this.currentTestNumber,
                testName: name,
                duration: this.moment.duration(testRunInfo.durationMs).format('h[h] mm[m] ss[s]')
            };

            this.currentfixture.tests.push(testInfo);

        },

        reportTaskDone ( endTime/*, passed, warnings*/) {

            this.summaryData.duration = this.moment.duration(endTime - this.summaryData.startTime).format('h[h] mm[m] ss[s]');
            const source = fs.readFileSync('lib/report-template.html', 'utf8').toString();
            const template = Handlebars.compile(source);
            const output = template(this.summaryData);

            // fs.writeFile('generated-report.html', output, function () {
            //     console.log('Saved!');
            // });

            this.write(output);
        }
    };
};
