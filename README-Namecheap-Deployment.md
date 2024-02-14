# Namecheap Deployment Process

## Angular UI deployment to Namecheap

```
cd ui
<!-- ng build --configuration=production THIS DOESNT WORK!--> 
ng build --configuration=production workaround: just use ng build but must switch uncommented apiUrl to cashamole.com in environment.dev.ts
note: api url should point to the actual domain ie https://cashamole.com/api not localhost//3000
```
- go to folder/dist/ui/browser and zip contents, the contents should include folders assets and media.
- extract zip file into root cashamole.com folder

## MySQL Database export & import to Namecheap

### Export existing MySql database using terminal

- [MySql Export Options](https://hevodata.com/learn/mysql-export-to-csv/)
- [MySql Docs/Dump](https://dev.mysql.com/doc/refman/8.0/en/mysqldump.html) 

- May need to login to mysql:
```
mysql -u root -p pass
```
- Export database cashamole into compress sql file
```
mysqldump -u root -ppass cashamole > mysql-cashamole-dump.sql
```

- importing this file in Namecheap phpAdmin will result in the following error beceause Namecheap has an older version of mysql(Database client version: libmysql - mysqlnd 7.4.33 ) and utf8mb4_0900_ai_ci' collation was added in mySql 8.0

<#1273 - Unknown collation: 'utf8mb4_0900_ai_ci'>

- So must go into exported database sql file with text editor and **replace** the collate value from _COLLATE=utf8mb4_0900_ai_ci_ to lower mysql version supported _COLLATE=utf8mb4_general_ci_

### Import data into Namecheap
- Go to Namecheap cPanel > phpMyAdmin
- Select appropriate database on left pane
- Select **Import** on top nav bar
- Browse for selected file, no other options require adjustment
- Click import at bottom of page

## NestJS Namecheap deployment


### Versioning issues
- Namecheap latest version of Node is 14.21.2, NestJS current latest version 10, requires Node >= 16, so must use NestJS version 9 or below.
- bcrypt requires a C dependency, _GLIBC_2.14_, which Namecheap does not support. Must use library bcryptjs as it is written completely in JavaScript and supported by Namecheap in production.

### stackoverflow post with full directions

- [stackoverflow post](https://stackoverflow.com/questions/77768040/deploy-nestjs-server-api-in-namecheap-cpanel)
