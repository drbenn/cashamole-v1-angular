#!/bin/bash

uid=18
starting_post_tax_salary=65000
annual_salary_bump=1.08
annual_inflation=1.04
declare -a years=("2019" "2020" "2021" "2022" "2023" "2024")
declare -a months=("01" "02" "03" "04" "05" "06" "07" "08" "09" "10" "11" "12")

current_date=$(date +%Y-%m-%d)

echo $current_date


####################################################################################################
#                                        INCOME
####################################################################################################


sql_query_income="INSERT INTO user${uid}_income (date, amount, source, note, status) VALUES "

## Income interest
for i in ${!years[@]} 
  do
    for month in ${months[*]}
      do
        # record date
        db_date=${years[$i]}-$month-"27T05:00:00.000Z"
        
        # amount
        inflation_mutiplier=$(echo "scale=2; $annual_inflation ^ $(($i))" | bc )
        lo=1
        hi=2
        random_dollar=$(shuf -i $lo-$hi -n 1)
        infl_adj_random_dollar_float=$(echo "scale=0; $random_dollar  * $inflation_mutiplier" | bc)
        infl_adj_random_dollar=$(echo $infl_adj_random_dollar_float | awk '{ print int($1) }')
        random_cents=$(shuf -i 10-99 -n 1)
        amount="$infl_adj_random_dollar.$random_cents"

        sql_query_income+="('$db_date', '$amount', 'bank of america', 'interest',  'active'), "
    done
done

## Fidelity Dividends
for i in ${!years[@]} 
  do
    for month in ${months[*]}
      do
        # record date
        db_date=${years[$i]}-$month-"27T05:00:00.000Z"
        
        # amount
        inflation_mutiplier=$(echo "scale=2; $annual_inflation ^ $(($i))" | bc )
        lo=90
        hi=130
        random_dollar=$(shuf -i $lo-$hi -n 1)
        infl_adj_random_dollar_float=$(echo "scale=0; $random_dollar  * $inflation_mutiplier" | bc)
        infl_adj_random_dollar=$(echo $infl_adj_random_dollar_float | awk '{ print int($1) }')
        random_cents=$(shuf -i 10-99 -n 1)
        amount="$infl_adj_random_dollar.$random_cents"

        sql_query_income+="('$db_date', '$amount', 'fidelity', 'dividends', 'active'), "
    done
done

## Vanguard Dividends
for i in ${!years[@]} 
  do
    for month in ${months[*]}
      do
        # record date
        db_date=${years[$i]}-$month-"27T05:00:00.000Z"
        
        # amount
        inflation_mutiplier=$(echo "scale=2; $annual_inflation ^ $(($i))" | bc )
        lo=60
        hi=80
        random_dollar=$(shuf -i $lo-$hi -n 1)
        infl_adj_random_dollar_float=$(echo "scale=0; $random_dollar  * $inflation_mutiplier" | bc)
        infl_adj_random_dollar=$(echo $infl_adj_random_dollar_float | awk '{ print int($1) }')
        random_cents=$(shuf -i 10-99 -n 1)
        amount="$infl_adj_random_dollar.$random_cents"

        sql_query_income+="('$db_date', '$amount', 'vanguard', 'dividends', 'active'), "
    done
done

## Paycheck
for i in ${!years[@]} 
  do
    for month in ${months[*]}
      do
        # record date
        db_date=${years[$i]}-$month-"01T05:00:00.000Z"
        
        # amount
        inflation_mutiplier=$(echo "scale=2; $annual_salary_bump ^ $(($i))" | bc )
        random_dollar=$(echo "scale=0; $starting_post_tax_salary / 12" | bc)
        infl_adj_random_dollar_float=$(echo "scale=0; $random_dollar  * $inflation_mutiplier" | bc)
        infl_adj_random_dollar=$(echo $infl_adj_random_dollar_float | awk '{ print int($1) }')
        random_cents=50
        amount="$infl_adj_random_dollar.$random_cents"

        sql_query_income+="('$db_date', '$amount', 'big firm', 'paycheck', 'active'), "
    done
done

  ########## Consolidate and Edit final income sql query string ##########

  sql_query_income_edit="${sql_query_income%??}"
  sql_query_income_edit+=";"
  sql_query_income=$sql_query_income_edit

echo $sql_query_income

echo "|=============== INSERT DATA INTO DB STARTED ===============|"
ROOT_PASSWD="pass"
DB="cashamole"


# Switch to database AND insert generated data to specified user id tables
mysql -u root -p$ROOT_PASSWD -e "
    USE $DB; 
    $sql_query_income
  "

echo "|=============== INSERT DATA INTO DB END ===============|"