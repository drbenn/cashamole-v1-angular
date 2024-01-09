#!/bin/bash

uid=4
annual_inflation=1.04
declare -a years=("2019" "2020" "2021" "2022" "2023" "2024")
declare -a months=("01" "02" "03" "04" "05" "06" "07" "08" "09" "10" "11" "12")
# declare -a years=("2023")
# declare -a months=("10" "11" "12")
starting_year_month="2019-01"
# growth base on the following annual % return divided by 12 (-6, -6, -4, -2, -1, 1, 2, 3, 4, 5, 6, 8, 10, 12, 14, 16, 18)
declare -a month_returns=("0.995" "0.995" "0.9933" "0.9917" "0.9998" "1.0008" "1.0017" "1.0025" "1.0033" "1.0042" "1.0050" "1.0067" "1.0083" "1.01" "1.0117" "1.0133" "1.015")
declare -a cash_account_variance=("-33.43" "-26.75" "-18.42" "-11.07" "-4.28" "2.16" "5.19" "7.99" "9.34" "12.29" "14.77" "18.10" "20.45" "24.78" "29.33" "31.54" "33.87")
current_date=$(date +%Y-%m-%d)

echo $current_date

echo "|=============== BALANCE SHEET INSERT STARTED ===============|"
DB_USER="root"
ROOT_PASSWD="pass"
DB="cashamole"

cash=432.17
checking=5214.42
savings=4954.11
retire=89881.95
roth_retire=32489.69
v_broke=61684.41
f_broke=39521.60
house_book=242154
car_value=19456
bank_americard=842.48
chase_card=422.84
mortgage_note=197532.13
# car payment is 294.32/7358 = 25 months..but car_payment not 294.32 and changed to account for interest payment
car_note=7358

car_payment=262.32
mort_payment=1208.11


for year in ${years[*]}
do
    for month in ${months[*]} 
    do
        db_date=$year-$month-"01T05:00:00.000Z"
        random_growth_index=$(shuf -i 0-16 -n 1)
        # Select the value at the random index
        random_growth="${month_returns[random_growth_index]}"
        echo "Random growth variable: " $random_growth

        # SET Base Amounts for first month
        if [ "$year-$month" == $starting_year_month ]; then
            echo "First Base Amount Entry"
            sql_balance_query_first="INSERT INTO user${uid}_bal_sheet  (date, amount, type, description, status)  VALUES 
                ('$db_date', $cash, 'asset', 'cash', 'active'),
                ('$db_date', $checking, 'asset', 'checking', 'active'),
                ('$db_date', $savings, 'asset', 'savings', 'active'),
                ('$db_date', $retire, 'asset', '401k', 'active'),
                ('$db_date', $roth_retire, 'asset', 'vanguard - roth ira', 'active'),
                ('$db_date', $v_broke, 'asset', 'vanguard - brokerage', 'active'),
                ('$db_date', $f_broke, 'asset', 'fidelity - brokerage', 'active'),
                ('$db_date', $house_book, 'asset', 'house book value', 'active'),
                ('$db_date', $car_value, 'asset', 'car value', 'active'),
                ('$db_date', $bank_americard, 'liability', 'bank americard', 'active'),
                ('$db_date', $chase_card, 'liability', 'chase - amazon prime card', 'active'),
                ('$db_date', $mortgage_note, 'liability', 'house mortgage note', 'active'),
                ('$db_date', $car_note, 'liability', 'car loan note', 'active');
            "
            mysql -u root -p$ROOT_PASSWD -e "
                USE $DB; 
                $sql_balance_query_first
            "

            ############# Set new values from month in prep for next month ########


            ### Minor fluctuations for cash accounts
            random_cash_index=$(shuf -i 0-16 -n 1)
            # Select the value at the random index
            random_cash_variance="${cash_account_variance[random_cash_index]}"
            cash=$(echo "scale=2; $cash + $random_cash_variance" | bc )

            random_checking_index=$(shuf -i 0-16 -n 1)
            # Select the value at the random index
            random_checking_variance="${cash_account_variance[random_checking_index]}"
            checking=$(echo "scale=2; $checking + $random_checking_variance" | bc )


            #### Get both persoanl and employer 401k contribution and combine => then add to balance of 401k in balance sheet

            #### 401k
            sql_query_401k_invest_emp="SELECT SUM(amount) AS month_401k FROM user${uid}_invest WHERE date LIKE '$year-$month%' AND institution = '401k - employer contribution';"
            four01k_invest_emp=$(mysql -u $DB_USER -p$ROOT_PASSWD -se "
                USE $DB; 
                $sql_query_401k_invest_emp
            ")
            sql_query_401k_invest_pers="SELECT SUM(amount) AS month_401k FROM user${uid}_invest WHERE date LIKE '$year-$month%' AND institution = '401k - personal contribution';"
            four01k_invest_pers=$(mysql -u $DB_USER -p$ROOT_PASSWD -se "
                USE $DB; 
                $sql_query_401k_invest_pers
            ")
            total_401k_invest=$(echo "scale=2; $four01k_invest_emp + $four01k_invest_pers" | bc )

            retire=$(echo "scale=2; $retire + $total_401k_invest" | bc )
            # multiply by randome market return
            retire=$(echo "scale=2; $retire * $random_growth" | bc )
            

            #### Vanguard ROTH
            sql_query_roth_invest="SELECT SUM(amount) AS month_van_roth FROM user${uid}_invest WHERE date LIKE '$year-$month%' AND institution = 'vanguard - roth ira';"
            roth_invest=$(mysql -u $DB_USER -p$ROOT_PASSWD -se "
                USE $DB; 
                $sql_query_roth_invest
            ")
            # add investment amount to previous balance
            roth_retire=$(echo "scale=2; $roth_retire + $roth_invest" | bc )
            # multiply by randome market return
            roth_retire=$(echo "scale=2; $roth_retire * $random_growth" | bc )


            #### Vanguard Brokerage
            sql_query_month_van_broke_invest="SELECT SUM(amount) AS month_van_broke FROM user${uid}_invest WHERE date LIKE '$year-$month%' AND institution = 'vanguard - brokerage';"
            van_brokerage_invest=$(mysql -u $DB_USER -p$ROOT_PASSWD -se "
                USE $DB; 
                $sql_query_month_van_broke_invest
            ")
            # add investment amount to previous balance
            v_broke=$(echo "scale=2; $v_broke + $van_brokerage_invest" | bc )
            # multiply by randome market return
            v_broke=$(echo "scale=2; $v_broke * $random_growth" | bc )


            #### Fidelity Brokerage
            sql_query_month_fidelity_invest="SELECT SUM(amount) AS month_fidelity FROM user${uid}_invest WHERE date LIKE '$year-$month%' AND institution = 'fidelity';"
            fidelity_brokerage_invest=$(mysql -u $DB_USER -p$ROOT_PASSWD -se "
                USE $DB; 
                $sql_query_month_fidelity_invest
            ")
            # add investment amount to previous balance
            f_broke=$(echo "scale=2; $f_broke + $fidelity_brokerage_invest" | bc )
            # multiply by randome market return
            f_broke=$(echo "scale=2; $f_broke * $random_growth" | bc )

            ####  House note amortization
            sql_query_month_mortgage="SELECT SUM(amount) AS month_mort FROM user${uid}_bal_sheet WHERE date LIKE '$year-$month%' AND description = 'house mortgage note';"
            mortgage_bal=$(mysql -u $DB_USER -p$ROOT_PASSWD -se "
                USE $DB; 
                $sql_query_month_mortgage
            ")
            # reduce mortgage balance by mortgage payment
            mortgage_note=$(echo "scale=2; $mortgage_bal - $mort_payment" | bc )


            ####  Car note amortization
            sql_query_month_car_loan="SELECT SUM(amount) AS month_mort FROM user${uid}_bal_sheet WHERE date LIKE '$year-$month%' AND description = 'car loan note';"
            car_bal=$(mysql -u $DB_USER -p$ROOT_PASSWD -se "
                USE $DB; 
                $sql_query_month_car_loan
            ")
            # reduce mortgage balance by mortgage payment
            car_note=$(echo "scale=2; $car_bal - $car_payment" | bc )


            ####  Chase/Amazon Prime card
            sql_query_chase_total="SELECT SUM(amount) AS chase_exp FROM user${uid}_expenses WHERE date LIKE '$year-$month%' AND vendor = 'amazon';"
            chase_expenses=$(mysql -u $DB_USER -p$ROOT_PASSWD -se "
                USE $DB; 
                $sql_query_chase_total
            ")
            # set chase card value as sum of all amazon purchases each month
            chase_card=$(echo "scale=2; $chase_expenses" | bc )


            ####  Bank America Americard
            sql_query_americard_total="SELECT SUM(amount) AS americard_exp FROM user${uid}_expenses WHERE date LIKE '$year-$month%' AND vendor != 'amazon' AND category != 'recurring';"
            americard_expenses=$(mysql -u $DB_USER -p$ROOT_PASSWD -se "
                USE $DB; 
                $sql_query_americard_total
            ")
            # set BoA americard value as sum of all amazon purchases each month
            bank_americard=$(echo "scale=2; $americard_expenses" | bc )



        else   
            echo "ELSE BALANCE SHEET"

            sql_balance_query_remaining="INSERT INTO user${uid}_bal_sheet  (date, amount, type, description, status)  VALUES 
                ('$db_date', $cash, 'asset', 'cash', 'active'),
                ('$db_date', $checking, 'asset', 'checking', 'active'),
                ('$db_date', $savings, 'asset', 'savings', 'active'),
                ('$db_date', $retire, 'asset', '401k', 'active'),
                ('$db_date', $roth_retire, 'asset', 'vanguard - roth ira', 'active'),
                ('$db_date', $v_broke, 'asset', 'vanguard - brokerage', 'active'),
                ('$db_date', $f_broke, 'asset', 'fidelity - brokerage', 'active'),
                ('$db_date', $house_book, 'asset', 'house book value', 'active'),
                ('$db_date', $car_value, 'asset', 'car value', 'active'),
                ('$db_date', $bank_americard, 'liability', 'bank americard', 'active'),
                ('$db_date', $chase_card, 'liability', 'chase - amazon prime card', 'active'),
                ('$db_date', $mortgage_note, 'liability', 'house mortgage note', 'active'),
                ('$db_date', $car_note, 'liability', 'car loan note', 'active');
            "
            mysql -u root -p$ROOT_PASSWD -e "
                USE $DB; 
                $sql_balance_query_remaining
            "


            ### Minor fluctuations for cash accounts
            random_cash_index=$(shuf -i 0-16 -n 1)
            # Select the value at the random index
            random_cash_variance="${cash_account_variance[random_cash_index]}"
            cash=$(echo "scale=2; $cash + $random_cash_variance" | bc )

            random_checking_index=$(shuf -i 0-16 -n 1)
            # Select the value at the random index
            random_checking_variance="${cash_account_variance[random_checking_index]}"
            checking=$(echo "scale=2; $checking + $random_checking_variance" | bc )


            #### Get both persoanl and employer 401k contribution and combine => then add to balance of 401k in balance sheet

            #### 401k
            sql_query_401k_invest_emp="SELECT SUM(amount) AS month_401k FROM user${uid}_invest WHERE date LIKE '$year-$month%' AND institution = '401k - employer contribution';"
            four01k_invest_emp=$(mysql -u $DB_USER -p$ROOT_PASSWD -se "
                USE $DB; 
                $sql_query_401k_invest_emp
            ")
            sql_query_401k_invest_pers="SELECT SUM(amount) AS month_401k FROM user${uid}_invest WHERE date LIKE '$year-$month%' AND institution = '401k - personal contribution';"
            four01k_invest_pers=$(mysql -u $DB_USER -p$ROOT_PASSWD -se "
                USE $DB; 
                $sql_query_401k_invest_pers
            ")
            total_401k_invest=$(echo "scale=2; $four01k_invest_emp + $four01k_invest_pers" | bc )

            # ELSE
            sql_query_401k_bal="SELECT SUM(amount) AS month_401k_bal FROM user${uid}_bal_sheet WHERE date LIKE '$year-$month%' AND description = '401k';"
            four01k_bal=$(mysql -u $DB_USER -p$ROOT_PASSWD -se "
                USE $DB; 
                $sql_query_401k_bal
            ")

            # ELSE
            retire=$(echo "scale=2; $four01k_bal + $total_401k_invest" | bc )
            retire=$(echo "scale=2; $retire * $random_growth" | bc )



            #### Vanguard ROTH
            sql_query_roth_invest="SELECT SUM(amount) AS month_van_roth FROM user${uid}_invest WHERE date LIKE '$year-$month%' AND institution = 'vanguard - roth ira';"
            roth_invest=$(mysql -u $DB_USER -p$ROOT_PASSWD -se "
                USE $DB; 
                $sql_query_roth_invest
            ")
            # ELSE
            sql_query_roth_bal="SELECT SUM(amount) AS month_van_roth FROM user${uid}_bal_sheet WHERE date LIKE '$year-$month%' AND description = 'vanguard - roth ira';"
            roth_bal=$(mysql -u $DB_USER -p$ROOT_PASSWD -se "
                USE $DB; 
                $sql_query_roth_bal
            ")

            # ELSE
            roth_retire=$(echo "scale=2; $roth_bal + $roth_invest" | bc )
            roth_retire=$(echo "scale=2; $roth_retire * $random_growth" | bc )



            #### Vanguard Brokerage
            sql_query_month_van_broke_invest="SELECT SUM(amount) AS month_van_broke FROM user${uid}_invest WHERE date LIKE '$year-$month%' AND institution = 'vanguard - brokerage';"
            van_brokerage_invest=$(mysql -u $DB_USER -p$ROOT_PASSWD -se "
                USE $DB; 
                $sql_query_month_van_broke_invest
            ")
            # ELSE
            sql_query_van_broke_bal="SELECT SUM(amount) AS month_van_broke FROM user${uid}_bal_sheet WHERE date LIKE '$year-$month%' AND description = 'vanguard - brokerage';"
            van_brokerage_bal=$(mysql -u $DB_USER -p$ROOT_PASSWD -se "
                USE $DB; 
                $sql_query_van_broke_bal
            ")
            # add investment amount to previous balance
            # ELSE
            v_broke=$(echo "scale=2; $van_brokerage_bal + $van_brokerage_invest" | bc )
            v_broke=$(echo "scale=2; $v_broke * $random_growth" | bc )

            
            
            
            #### Fidelity Brokerage
            sql_query_month_fidelity_invest="SELECT SUM(amount) AS month_fidelity FROM user${uid}_invest WHERE date LIKE '$year-$month%' AND institution = 'fidelity';"
            fidelity_brokerage_invest=$(mysql -u $DB_USER -p$ROOT_PASSWD -se "
                USE $DB; 
                $sql_query_month_fidelity_invest
            ")
            # ELSE
            sql_query_fidelity_bal="SELECT SUM(amount) AS month_van_broke FROM user${uid}_bal_sheet WHERE date LIKE '$year-$month%' AND description = 'fidelity - brokerage';"
            fidelity_bal=$(mysql -u $DB_USER -p$ROOT_PASSWD -se "
                USE $DB; 
                $sql_query_fidelity_bal
            ")
            # add investment amount to previous balance
            # ELSE
            f_broke=$(echo "scale=2; $fidelity_bal + $fidelity_brokerage_invest" | bc )
            f_broke=$(echo "scale=2; $f_broke * $random_growth" | bc )


            ####  House note amortization
            sql_query_month_mortgage="SELECT SUM(amount) AS month_mort FROM user${uid}_bal_sheet WHERE date LIKE '$year-$month%' AND description = 'house mortgage note';"
            mortgage_bal=$(mysql -u $DB_USER -p$ROOT_PASSWD -se "
                USE $DB; 
                $sql_query_month_mortgage
            ")
            # reduce mortgage balance by mortgage payment
            mortgage_note=$(echo "scale=2; $mortgage_bal - $mort_payment" | bc )



            ####  Car note amortization
            sql_query_month_car_loan="SELECT SUM(amount) AS month_mort FROM user${uid}_bal_sheet WHERE date LIKE '$year-$month%' AND description = 'car loan note';"
            car_bal=$(mysql -u $DB_USER -p$ROOT_PASSWD -se "
                USE $DB; 
                $sql_query_month_car_loan
            ")
            car_note_int=$(echo $car_note | awk '{ print int($1) }')
            car_payment_int=$(echo $car_payment | awk '{ print int($1) }')
            # reduce mortgage balance by mortgage payment
            # echo "savings before: " $savings
            if [ $car_note == 0 ]; then
                # echo "car paid off send funds to savings"
                savings=$(echo "scale=2; $savings + $car_payment" | bc )
            elif [ $car_note_int -le $car_payment_int ]; then
                # echo "pay off remaining loan and then send remaining funds to savings"
                car_money=$car_payment
                car_money=$(echo "scale=2; $car_money - $car_note" | bc )
                car_note=$(echo "scale=2; 0.00" | bc )
                savings=$(echo "scale=2; $savings + $car_money" | bc )
            else
                # echo "full payment to loan"
                car_note=$(echo "scale=2; $car_bal - $car_payment" | bc )
            fi

            ####  Chase/Amazon Prime card
            sql_query_chase_total="SELECT SUM(amount) AS chase_exp FROM user${uid}_expenses WHERE date LIKE '$year-$month%' AND vendor = 'amazon';"
            chase_expenses=$(mysql -u $DB_USER -p$ROOT_PASSWD -se "
                USE $DB; 
                $sql_query_chase_total
            ")
            # set chase card value as sum of all amazon purchases each month
            chase_card=$(echo "scale=2; $chase_expenses" | bc )


            ####  Bank America Americard
            sql_query_americard_total="SELECT SUM(amount) AS americard_exp FROM user${uid}_expenses WHERE date LIKE '$year-$month%' AND vendor != 'amazon' AND category != 'recurring';"
            americard_expenses=$(mysql -u $DB_USER -p$ROOT_PASSWD -se "
                USE $DB; 
                $sql_query_americard_total
            ")
            # set BoA americard value as sum of all amazon purchases each month
            bank_americard=$(echo "scale=2; $americard_expenses" | bc )

        fi
    done
done