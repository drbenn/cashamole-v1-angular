npx @angular/cli@17 new ui

# JEST in Angular 17
https://medium.com/@megha.d.parmar2018/angular-unit-testing-with-jest-2023-2676faa2e564
npm uninstall @types/jasmine jasmine-core karma karma-chrome-launcher karma-coverage karma-jasmine karma-jasmine-html-reporter
npm install --save-dev jest @types/jest jest-environment-jsdom

angular.json > test > builder: "@angular-devkit/build-angular:jest"  & remove karma section

npm run test
npm run test:coverage
npm run test:watch

# MYSQL
/usr/local/mysql/bin/mysql -uroot -p
nest app.module holds database config

# NestJs
enable cors config in main.ts
https://www.youtube.com/watch?v=UQEQHPwQJdg

# NGXS App Module imports
NgxsModule.forRoot([AppState]),
NgxsReduxDevtoolsPluginModule.forRoot(),

# MailerModule
https://www.youtube.com/watch?v=DHcxpZEaVWg


# Most Popular Semantic Html to implement

header: This tag defines a header section for a web page or component.

nav: This tag defines a navigation section for a web page or component.

main: This tag defines the main content section of a web page or component.

aside: This tag defines a side section for a web page or component, often used for related content or sidebars.

section: This tag defines a generic section of a web page or component, used for grouping related content.

article: This tag defines an independent piece of content, often used for blog posts, news articles, or other self-contained text.

figure: This tag defines a self-contained unit of content, often used for images or illustrations along with captions.

figcaption: This tag defines a caption for an image or illustration within a figure element.

details: This tag defines a section of content that can be toggled between expanded and collapsed states.

summary: This tag defines a brief summary of the content within a details element.

time: This tag defines a specific date or time within the content.

# Nest mac permissions bypass
## for directory
sudo chown -R $USER /Users/danielbennett/Desktop/code/cashamole/api
## for shell file
chmod +x create-db.sh