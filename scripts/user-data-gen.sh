#!/bin/bash

uid=1
salary2012=50000
annualSalaryBump=1.08
annual_inflation=1.056
declare -a years=("2020" "2021" "2022" "2023")
declare -a months=("01" "02" "03" "04" "05" "06" "07" "08" "09" "10" "11" "12")


declare -a eat_out_dates=("05" "11" "13" "20" "25")
current_date=$(date +%Y-%m-%d)

echo $current_date

# sqlQuery="INSERT INTO user${userId}_bal_sheet (date, amount, type, description, status) VALUES
#             ('10/01/23','50.87',)


# # sqlQuery="INSERT INTO user${uid}_chips (kind, chip, status) VALUES
# #         ('asset', 'cash', 'active'),
# #         ('asset', 'checking', 'active'),
# #         ('asset', 'savings', 'active'),
# #         ('asset', '401k', 'active'),
# #         ('asset', 'roth', 'active'),
# #         ('asset', 'fidelity', 'active'),
# #         ('asset', 'vanguard', 'active'),"

# echo $sqlQuery

# array=("one" "two" "three")
# for i in ${!array[@]}; do
#   echo "$(($i+1)), ${array[$i]}"
# done

#########################


sqlQueryExpenses="INSERT INTO user${uid}_expenses (date, amount, category, vendor, note, status) VALUES "

# =========================== EXPENSE - GROCERY ===============================
sqlQueryExpenseGrocery=""
declare -a grocery_dates=("02" "06" "10" "16" "21" "23" "26")

for i in ${!years[@]} 
  do
    for month in ${months[*]}
      do
        for day in ${grocery_dates[*]} 
          do
            # record date
            db_date=${years[$i]}-$month-$day"T05:00:00.000Z"

            # amount calc
            inflation_mutiplier=$(echo "scale=2; $annual_inflation ^ $(($i))" | bc )
            lo=20
            hi=89
            random_dollar=$(shuf -i $lo-$hi -n 1)
            infl_adj_random_dollar_float=$(echo "scale=0; $random_dollar  * $inflation_mutiplier" | bc)
            infl_adj_random_dollar=$(echo $infl_adj_random_dollar_float | awk '{ print int($1) }')
            random_cents=$(shuf -i 10-99 -n 1)
            amount="$infl_adj_random_dollar.$random_cents"

            # random vendor selection
            vendor_list=("harris teeter" "giant" "trader joes" "target")
            # Get a random index between 0 and 3 (inclusive)
            random_index=$(shuf -i 0-3 -n 1)
            # Select the value at the random index
            random_vendor="${vendor_list[random_index]}"

            sqlQueryExpenseGrocery+="('$db_date', '$amount', 'groceries', '$random_vendor', 'food', 'active'), "
          done
      done
  done

  sqlQueryExpenses+=$sqlQueryExpenseGrocery


# =========================== EXPENSE - TRANSPORTATION ===============================
sqlQueryExpenseTransportation=""


##########  GAS #############
declare -a gas_dates=("10" "24")
sqlQueryExpenseGas=""

for i in ${!years[@]} 
  do
    for month in ${months[*]}
      do
        for day in ${gas_dates[*]} 
          do
            # record date
            db_date=${years[$i]}-$month-$day"T05:00:00.000Z"

            # amount calc
            inflation_mutiplier=$(echo "scale=2; $annual_inflation ^ $(($i))" | bc )
            lo=18
            hi=45
            random_dollar=$(shuf -i $lo-$hi -n 1)
            infl_adj_random_dollar_float=$(echo "scale=0; $random_dollar  * $inflation_mutiplier" | bc)
            infl_adj_random_dollar=$(echo $infl_adj_random_dollar_float | awk '{ print int($1) }')
            random_cents=$(shuf -i 10-99 -n 1)
            amount="$infl_adj_random_dollar.$random_cents"

            # random vendor selection
            vendor_list=("bp" "exxon" "sheetz" "shell")
            # Get a random index between 0 and 3 (inclusive)
            random_index=$(shuf -i 0-3 -n 1)
            # Select the value at the random index
            random_vendor="${vendor_list[random_index]}"

            sqlQueryExpenseGas+="('$db_date', '$amount', 'transportation', '$random_vendor', 'gas', 'active'), "
          done
      done
  done

  sqlQueryExpenseTransportation+=$sqlQueryExpenseGas

##########  Oil Change #############
declare -a oil_change_months=("04" "10")
sqlQueryExpenseOilChange=""

for i in ${!years[@]} 
  do
    for month in ${oil_change_months[*]}
      do
        # record date
        db_date=${years[$i]}-$month-"12T05:00:00.000Z"

        # amount calc
        inflation_mutiplier=$(echo "scale=2; $annual_inflation ^ $(($i))" | bc )
        lo=40
        hi=75
        random_dollar=$(shuf -i $lo-$hi -n 1)
        infl_adj_random_dollar_float=$(echo "scale=0; $random_dollar  * $inflation_mutiplier" | bc)
        infl_adj_random_dollar=$(echo $infl_adj_random_dollar_float | awk '{ print int($1) }')
        random_cents=$(shuf -i 10-99 -n 1)
        amount="$infl_adj_random_dollar.$random_cents"

        # random grocery selection
        vendor_list=("mechanic" "bp" "mr tire")
        # Get a random index between 0 and 3 (inclusive)
        random_index=$(shuf -i 0-2 -n 1)
        # Select the value at the random index
        random_vendor="${vendor_list[random_index]}"

        sqlQueryExpenseOilChange+="('$db_date', '$amount', 'transportation', '$random_vendor', 'oil change', 'active'), "
      done
  done

  sqlQueryExpenseTransportation+=$sqlQueryExpenseOilChange


##########  UBER #############
declare -a uber_dates=("07" "12" "16" "25")
sqlQueryExpenseUber=""

for year in ${years[*]} 
  do
    for month in ${months[*]}
      do
        for day in ${uber_dates[*]} 
          do
            # record date
            db_date=${years[$i]}-$month-$day"T05:00:00.000Z"

            # amount calc
            inflation_mutiplier=$(echo "scale=2; $annual_inflation ^ $(($i))" | bc )
            lo=18
            hi=50
            random_dollar=$(shuf -i $lo-$hi -n 1)
            infl_adj_random_dollar_float=$(echo "scale=0; $random_dollar  * $inflation_mutiplier" | bc)
            infl_adj_random_dollar=$(echo $infl_adj_random_dollar_float | awk '{ print int($1) }')
            random_cents=$(shuf -i 10-99 -n 1)
            amount="$infl_adj_random_dollar.$random_cents"

            sqlQueryExpenseUber+="('$db_date', '$amount', 'transportation', 'uber', 'uber', 'active'), "
          done
      done
  done

  sqlQueryExpenseTransportation+=$sqlQueryExpenseUber

##########  Mechanic Suprise #############
declare -a menchanic_months=("06" "12")
sqlQueryExpenseMechanic=""

for i in ${!years[@]} 
  do
    for month in ${menchanic_months[*]}
      do
        # record date
        db_date=${years[$i]}-$month-"08T05:00:00.000Z"

        # amount calc
        inflation_mutiplier=$(echo "scale=2; $annual_inflation ^ $(($i))" | bc )
        lo=250
        hi=2200
        random_dollar=$(shuf -i $lo-$hi -n 1)
        infl_adj_random_dollar_float=$(echo "scale=0; $random_dollar  * $inflation_mutiplier" | bc)
        infl_adj_random_dollar=$(echo $infl_adj_random_dollar_float | awk '{ print int($1) }')
        random_cents=$(shuf -i 10-99 -n 1)
        amount="$infl_adj_random_dollar.$random_cents"

        # random grocery selection
        vendor_list=("mechanic" "bp" "mr tire")
        # Get a random index between 0 and 3 (inclusive)
        random_index=$(shuf -i 0-2 -n 1)
        # Select the value at the random index
        random_vendor="${vendor_list[random_index]}"

        sqlQueryExpenseMechanic+="('$db_date', '$amount', 'transportation', '$random_vendor', 'mechanic suprise!', 'active'), "
      done
  done

  sqlQueryExpenseTransportation+=$sqlQueryExpenseMechanic


##########  Annual Registration #############
declare -a car_registration_months=("09")
sqlQueryExpenseCarRegistration=""

for i in ${!years[@]} 
  do
    for month in ${car_registration_months[*]}
      do
        # record date
        db_date=${years[$i]}-$month-"15T05:00:00.000Z"

        # amount
        inflation_mutiplier=$(echo "scale=2; $annual_inflation ^ $(($i))" | bc )
        random_dollar=225
        infl_adj_random_dollar_float=$(echo "scale=0; $random_dollar  * $inflation_mutiplier" | bc)
        infl_adj_random_dollar=$(echo $infl_adj_random_dollar_float | awk '{ print int($1) }')
        random_cents=$(shuf -i 10-99 -n 1)
        amount="$infl_adj_random_dollar.$random_cents"

        sqlQueryExpenseCarRegistration+="('$db_date', '$amount', 'transportation', 'DMV', 'Registration & emissions', 'active'), "
      done
  done

  sqlQueryExpenseTransportation+=$sqlQueryExpenseCarRegistration
  sqlQueryExpenses+=$sqlQueryExpenseTransportation

  ########## Edit final expense sql query string ##########
  sqlQueryExpenses_edit="${sqlQueryExpenses%??}"
  sqlQueryExpenses_edit+=";"
  sqlQueryExpenses=$sqlQueryExpenses_edit

  echo $sqlQueryExpenses




