npx @angular/cli@17 new ui

# JEST in Angular 17
https://medium.com/@megha.d.parmar2018/angular-unit-testing-with-jest-2023-2676faa2e564
npm uninstall @types/jasmine jasmine-core karma karma-chrome-launcher karma-coverage karma-jasmine karma-jasmine-html-reporter
npm install --save-dev jest @types/jest jest-environment-jsdom

angular.json > test > builder: "@angular-devkit/build-angular:jest"  & remove karma section

npm run test
npm run test:coverage
npm run test:watch

# Nest mac permissions bypass
sudo chown -R $USER /Users/danielbennett/Desktop/code/cashamole/api