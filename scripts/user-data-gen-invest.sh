#!/bin/bash

uid=18
starting_post_tax_salary=65000
annual_salary_bump=1.08
annual_inflation=1.04
declare -a years=("2019" "2020" "2021" "2022" "2023" "2024")
# declare -a years=("2023")
declare -a months=("01" "02" "03" "04" "05" "06" "07" "08" "09" "10" "11" "12")
# declare -a months=("10" "11" "12")
# Roth 6k limit started in 2019
contribution_roth=500
# 401k max $19k in 2019
contribution_401k_personal=1580
contribution_401k_employer=518

current_date=$(date +%Y-%m-%d)

echo $current_date


echo "|=============== INVEST INSERT STARTED ===============|"
DB_USER="root"
ROOT_PASSWD="pass"
DB="cashamole"

for year in ${years[*]}
do
    for month in ${months[*]} 
    do
        db_date_401k=$year-$month-"05T05:00:00.000Z"
        ## Monthly 401k personal contribution
        sql_query_month_401k_personal_contribution="INSERT INTO user${uid}_invest (date, amount, institution, note, status) VALUES 
                ('$db_date_401k', $contribution_401k_personal, '401k - personal contribution', '', 'active'); "
        mysql -u root -p$ROOT_PASSWD -e "
            USE $DB; 
            $sql_query_month_401k_personal_contribution
        "

        ## Monthly 401k employer contribution
        sql_query_month_401k_employer_contribution="INSERT INTO user${uid}_invest (date, amount, institution, note, status) VALUES 
                ('$db_date_401k', $contribution_401k_employer, '401k - employer contribution', '', 'active'); "
        mysql -u root -p$ROOT_PASSWD -e "
            USE $DB; 
            $sql_query_month_401k_employer_contribution
        "

        ## From remaining net cash, invest roth IRA and then 70/30 split of leftover to fidelity/vanugard brokerage
        db_date=$year-$month-"27T05:00:00.000Z"
        sql_query_month_income="SELECT SUM(amount) AS month_total_income FROM user${uid}_income WHERE date LIKE '$year-$month%';"
        sql_query_month_expense="SELECT SUM(amount) AS month_total_expense FROM user${uid}_expenses WHERE date LIKE '$year-$month%';"
        month_income=$(mysql -u $DB_USER -p$ROOT_PASSWD -se "
            USE $DB; 
            $sql_query_month_income
            ")

        month_expense=$(mysql -u $DB_USER -p$ROOT_PASSWD -se "
            USE $DB; 
            $sql_query_month_expense
            ")
        month_net=$(echo "scale=2; $month_income - $month_expense" | bc )
        month_net_int=$(echo $month_net | awk '{ print int($1) }')
        # echo $year-$month
        # echo "month income: "$month_income
        # echo "month expense: "$month_expense
        # echo "month net: " $month_net
        # echo "month net int: " $month_net_int
        
        if [ $month_net_int -gt $contribution_roth ]; then
            # echo "YES MONTH_NET GREATER THAN 500"
            sql_roth_query="INSERT INTO user${uid}_invest (date, amount, institution, note, status) VALUES 
                ('$db_date', 500, 'vanguard - roth ira', '', 'active'); "
            mysql -u root -p$ROOT_PASSWD -e "
                USE $DB; 
                $sql_roth_query
            "
            month_net=$(echo "scale=2; $month_net - $contribution_roth" | bc )
            # echo "new month net: "$month_net
            # split 70/30 to distribute to Fidelity & Vanguard brokerage
            month_net_70=$(echo "scale=2; $month_net * 0.7" | bc )
            month_net_30=$(echo "scale=2; $month_net * 0.3" | bc )
            # echo "new month net 70: "$month_net_70
            # echo "new month net 30: "$month_net_30
            # 70% after Roth contribution to fidelity
            sql_roth_query_70="INSERT INTO user${uid}_invest (date, amount, institution, note, status) VALUES 
                ('$db_date', $month_net_70, 'fidelity', '', 'active'); "
            mysql -u root -p$ROOT_PASSWD -e "
                USE $DB; 
                $sql_roth_query_70
            "
            # 30% after Roth contribution to fidelity
            sql_roth_query_30="INSERT INTO user${uid}_invest (date, amount, institution, note, status) VALUES 
                ('$db_date', $month_net_30, 'vanguard - brokerage', '', 'active'); "
            mysql -u root -p$ROOT_PASSWD -e "
                USE $DB; 
                $sql_roth_query_30
            "
        elif [ $month_net_int -gt 0 ]; then
            # echo "YES MONTH_NET POSITVE BUT LESS THAN GREATER THAN 500"
            # net income less than roth contribution goal, so all net income to roth for month
            sql_roth_query_min="INSERT INTO user${uid}_invest (date, amount, institution, note, status) VALUES 
                ('$db_date', $month_net, 'vanguard - roth ira', '', 'active'); "
            mysql -u root -p$ROOT_PASSWD -e "
                USE $DB; 
                $sql_roth_query_min
            "
        else   
            echo "NO POSITIVE CASH FLOW FOR MONTH"
        fi
    done
done


echo "|=============== INVEST INSERT ENDED ===============|"