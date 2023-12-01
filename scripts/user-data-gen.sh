#!/bin/bash

uid=1
2012salary=50000
annualSalaryBump=1.08
annualInflation=1.03
current_date=$(date +%Y-%m-%d)
echo $current_date

sqlQuery="INSERT INTO user${userId}_bal_sheet (date, amount, type, description, status) VALUES
            ('10/01/23','50.87',)


# sqlQuery="INSERT INTO user${uid}_chips (kind, chip, status) VALUES
#         ('asset', 'cash', 'active'),
#         ('asset', 'checking', 'active'),
#         ('asset', 'savings', 'active'),
#         ('asset', '401k', 'active'),
#         ('asset', 'roth', 'active'),
#         ('asset', 'fidelity', 'active'),
#         ('asset', 'vanguard', 'active'),"

echo $sqlQuery


original_text="Hello"
text_to_add=" World!"

for i in {1..7}; do
  original_text+=" $text_to_add"
done

echo $original_text