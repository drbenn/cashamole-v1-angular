
uid=4

query="SELECT LEFT(date, 7) AS unique_date, category, SUM(amount) AS total_expenses_by_date_category
FROM user${uid}_expenses
GROUP BY LEFT(date, 7), category

UNION ALL

SELECT LEFT(date, 7) AS unique_date, source, SUM(amount) AS total_income_by_date_source 
FROM user${uid}_income
GROUP BY LEFT(date, 7), source;"

echo "|=============== TEST DB QUERY STARTED ===============|"
ROOT_PASSWD="pass"
DB="cashamole"

output=$(mysql -u root -p$ROOT_PASSWD $DB -e "$query")

echo "|=============== TEST DB QUERY END ===============|"

# echo $output

echo "Expense Results:"
echo "$output" | grep -A 1000 'total_expenses_by_date_category'
# echo "|=============== EXPENSES BEFORE - INCOME AFTER ===============|"
# # Print income results
# echo "\nIncome Results:"
# echo "$output" | grep 'total_income_by_date_source'