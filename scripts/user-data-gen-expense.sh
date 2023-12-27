#!/bin/bash

uid=4
salary2012=50000
annual_salary_bump=1.08
annual_inflation=1.04
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

####################################################################################################
#                                        EXPENSES
####################################################################################################


sql_query_expenses="INSERT INTO user${uid}_expenses (date, amount, category, vendor, note, status) VALUES "

# =========================== EXPENSE - GROCERY ===============================
sql_query_expense_grocery=""
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

            sql_query_expense_grocery+="('$db_date', '$amount', 'groceries', '$random_vendor', 'food', 'active'), "
          done
      done
  done


# =========================== EXPENSE - TRANSPORTATION ===============================
sql_query_expense_transportation=""


##########  GAS #############
declare -a gas_dates=("10" "24")
sql_query_expense_gas=""

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

            sql_query_expense_gas+="('$db_date', '$amount', 'transportation', '$random_vendor', 'gas', 'active'), "
          done
      done
  done

  sql_query_expense_transportation+=$sql_query_expense_gas

##########  Oil Change #############
declare -a oil_change_months=("04" "10")
sql_query_expense_oil_change=""

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

        sql_query_expense_oil_change+="('$db_date', '$amount', 'transportation', '$random_vendor', 'oil change', 'active'), "
      done
  done

  sql_query_expense_transportation+=$sql_query_expense_oil_change


##########  UBER #############
declare -a uber_dates=("07" "12" "16" "25")
sql_query_expense_uber=""

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

            sql_query_expense_uber+="('$db_date', '$amount', 'transportation', 'uber', 'uber', 'active'), "
          done
      done
  done

  sql_query_expense_transportation+=$sql_query_expense_uber

##########  Mechanic Suprise #############
declare -a menchanic_months=("06" "12")
sql_query_expense_mechanic=""

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

        sql_query_expense_mechanic+="('$db_date', '$amount', 'transportation', '$random_vendor', 'mechanic', 'active'), "
      done
  done

  sql_query_expense_transportation+=$sql_query_expense_mechanic


##########  Annual Registration #############
declare -a car_registration_months=("09")
sql_query_expense_car_registration=""

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

        sql_query_expense_car_registration+="('$db_date', '$amount', 'transportation', 'dmv', 'registration & emissions', 'active'), "
      done
  done

  sql_query_expense_transportation+=$sql_query_expense_car_registration


  ##########  Quarterly Insurance #############
  declare -a car_insurance_months=("02" "05" "08" "11")
  sql_query_expense_car_insurance=""

  for i in ${!years[@]} 
    do
      for month in ${car_insurance_months[*]}
        do
          # record date
          db_date=${years[$i]}-$month-"26T05:00:00.000Z"

          # amount
          inflation_mutiplier=$(echo "scale=2; $annual_inflation ^ $(($i))" | bc )
          random_dollar=225
          infl_adj_random_dollar_float=$(echo "scale=0; $random_dollar  * $inflation_mutiplier" | bc)
          infl_adj_random_dollar=$(echo $infl_adj_random_dollar_float | awk '{ print int($1) }')
          random_cents=50
          amount="$infl_adj_random_dollar.$random_cents"

          sql_query_expense_car_registration+="('$db_date', '$amount', 'transportation', 'Geico', 'car insurance', 'active'), "
        done
    done

    sql_query_expense_transportation+=$sql_query_expense_car_insurance
  
  

  ########## Eating Out #############

  sql_query_expense_eating_out=""
  declare -a eat_out_dates=("04" "12" "18" "25")

  for i in ${!years[@]} 
  do
    for month in ${months[*]}
      do
        for day in ${eat_out_dates[*]} 
          do
            # record date
            db_date=${years[$i]}-$month-$day"T05:00:00.000Z"

            # amount calc
            inflation_mutiplier=$(echo "scale=2; $annual_inflation ^ $(($i))" | bc )
            lo=8
            hi=25
            random_dollar=$(shuf -i $lo-$hi -n 1)
            infl_adj_random_dollar_float=$(echo "scale=0; $random_dollar  * $inflation_mutiplier" | bc)
            infl_adj_random_dollar=$(echo $infl_adj_random_dollar_float | awk '{ print int($1) }')
            random_cents=$(shuf -i 10-99 -n 1)
            amount="$infl_adj_random_dollar.$random_cents"

            # random vendor selection
            vendor_list=("cava" "subway" "chipolte" "mcdonalds" "pho 75" "tops chinese" "guapos" "ichiban sushi & ramen" "dominos")
            # Get a random index between 0 and 3 (inclusive)
            random_index=$(shuf -i 0-8 -n 1)
            # Select the value at the random index
            random_vendor="${vendor_list[random_index]}"

            sql_query_expense_eating_out+="('$db_date', '$amount', 'eating out', '$random_vendor', '', 'active'), "
          done
      done
  done

  
  ##########  Pet #############
  sql_query_expense_pet=""


  ##########  Dog Food #############
  declare -a pet_food_months=("01" "03" "05" "07" "09" "11")
  sql_query_expense_pet_food=""

  for i in ${!years[@]} 
    do
      for month in ${pet_food_months[*]}
        do
          # record date
          db_date=${years[$i]}-$month-"15T05:00:00.000Z"

          # amount
          inflation_mutiplier=$(echo "scale=2; $annual_inflation ^ $(($i))" | bc )
          random_dollar=60
          infl_adj_random_dollar_float=$(echo "scale=0; $random_dollar  * $inflation_mutiplier" | bc)
          infl_adj_random_dollar=$(echo $infl_adj_random_dollar_float | awk '{ print int($1) }')
          random_cents=$(shuf -i 10-99 -n 1)
          amount="$infl_adj_random_dollar.$random_cents"

          sql_query_expense_pet_food+="('$db_date', '$amount', 'pet', 'chewy', 'dog food', 'active'), "
        done
    done

  sql_query_expense_pet+=$sql_query_expense_pet_food

  ##########  Dog Vet #############
  declare -a pet_food_months=("06")
  sql_query_expense_vet=""

  for i in ${!years[@]} 
    do
      for month in ${pet_food_months[*]}
        do
          # record date
          db_date=${years[$i]}-$month-"15T05:00:00.000Z"

          # amount
          inflation_mutiplier=$(echo "scale=2; $annual_inflation ^ $(($i))" | bc )
          random_dollar=300
          infl_adj_random_dollar_float=$(echo "scale=0; $random_dollar  * $inflation_mutiplier" | bc)
          infl_adj_random_dollar=$(echo $infl_adj_random_dollar_float | awk '{ print int($1) }')
          random_cents=$(shuf -i 10-99 -n 1)
          amount="$infl_adj_random_dollar.$random_cents"

          sql_query_expense_vet+="('$db_date', '$amount', 'pet', 'veterinarian', 'annual physical & shots', 'active'), "
        done
    done

  sql_query_expense_pet+=$sql_query_expense_vet

  ##########  Medical #############
  sql_query_expense_medical=""


  ########## Dentist ##############

  declare -a dentist_months=("03" "09")
  sql_query_expense_dentist=""

  for i in ${!years[@]} 
    do
      for month in ${dentist_months[*]}
        do
          # record date
          db_date=${years[$i]}-$month-"21T05:00:00.000Z"

          # amount
          inflation_mutiplier=$(echo "scale=2; $annual_inflation ^ $(($i))" | bc )
          random_dollar=40
          infl_adj_random_dollar_float=$(echo "scale=0; $random_dollar  * $inflation_mutiplier" | bc)
          infl_adj_random_dollar=$(echo $infl_adj_random_dollar_float | awk '{ print int($1) }')
          random_cents=50
          amount="$infl_adj_random_dollar.$random_cents"

          sql_query_expense_dentist+="('$db_date', '$amount', 'medical', 'dentist', '6 month cleaning', 'active'), "
      done
  done

  sql_query_expense_medical+=$sql_query_expense_dentist


  ########## Doctor ##############

  declare -a doctor_months=("05" "11")
  sql_query_expense_doctor=""

  for i in ${!years[@]} 
    do
      for month in ${doctor_months[*]}
        do
          # record date
          db_date=${years[$i]}-$month-"16T05:00:00.000Z"

          # amount
          inflation_mutiplier=$(echo "scale=2; $annual_inflation ^ $(($i))" | bc )
          random_dollar=30
          infl_adj_random_dollar_float=$(echo "scale=0; $random_dollar  * $inflation_mutiplier" | bc)
          infl_adj_random_dollar=$(echo $infl_adj_random_dollar_float | awk '{ print int($1) }')
          random_cents=75
          amount="$infl_adj_random_dollar.$random_cents"

          sql_query_expense_dentist+="('$db_date', '$amount', 'medical', 'doctor', 'dr examination', 'active'), "
      done
  done

  sql_query_expense_medical+=$sql_query_expense_doctor


  ##########  Discretionary #############

  sql_query_expense_discretionary=""



  #### Discretionary Amazon
  declare -a amazon_dates=("04" "09" "12" "16" "24")

  for i in ${!years[@]} 
    do
      for month in ${months[*]}
        do
          for day in ${amazon_dates[*]} 
            do
              # record date
              db_date=${years[$i]}-$month-$day"T05:00:00.000Z"

              # amount calc
              inflation_mutiplier=$(echo "scale=2; $annual_inflation ^ $(($i))" | bc )
              lo=20
              hi=80
              random_dollar=$(shuf -i $lo-$hi -n 1)
              infl_adj_random_dollar_float=$(echo "scale=0; $random_dollar  * $inflation_mutiplier" | bc)
              infl_adj_random_dollar=$(echo $infl_adj_random_dollar_float | awk '{ print int($1) }')
              random_cents=$(shuf -i 10-99 -n 1)
              amount="$infl_adj_random_dollar.$random_cents"

              sql_query_expense_discretionary+="('$db_date', '$amount', 'discretionary', 'amazon', '', 'active'), "
          done
      done
  done

  #### Discretionary Target
  declare -a target_dates=("04" "11" "23")

  for i in ${!years[@]} 
    do
      for month in ${months[*]}
        do
          for day in ${target_dates[*]} 
            do
              # record date
              db_date=${years[$i]}-$month-$day"T05:00:00.000Z"

              # amount calc
              inflation_mutiplier=$(echo "scale=2; $annual_inflation ^ $(($i))" | bc )
              lo=20
              hi=80
              random_dollar=$(shuf -i $lo-$hi -n 1)
              infl_adj_random_dollar_float=$(echo "scale=0; $random_dollar  * $inflation_mutiplier" | bc)
              infl_adj_random_dollar=$(echo $infl_adj_random_dollar_float | awk '{ print int($1) }')
              random_cents=$(shuf -i 10-99 -n 1)
              amount="$infl_adj_random_dollar.$random_cents"

              sql_query_expense_discretionary+="('$db_date', '$amount', 'discretionary', 'target', '', 'active'), "
          done
      done
  done

  #### Discretionary Clothes

  declare -a clothes_months=("03" "06" "09" "12")

  for i in ${!years[@]} 
    do
      for month in ${clothes_months[*]}
        do
          # record date
          db_date=${years[$i]}-$month-"10T05:00:00.000Z"

          # amount
          inflation_mutiplier=$(echo "scale=2; $annual_inflation ^ $(($i))" | bc )
          lo=75
          hi=160
          random_dollar=$(shuf -i $lo-$hi -n 1)
          infl_adj_random_dollar_float=$(echo "scale=0; $random_dollar  * $inflation_mutiplier" | bc)
          infl_adj_random_dollar=$(echo $infl_adj_random_dollar_float | awk '{ print int($1) }')
          random_cents=50
          amount="$infl_adj_random_dollar.$random_cents"

          sql_query_expense_discretionary+="('$db_date', '$amount', 'discretionary', 'uniqlo', 'clothes', 'active'), "
      done
  done

  #### Discretionary Clothes

  declare -a shoes_months=("02" "05" "08" "11")

  for i in ${!years[@]} 
    do
      for month in ${clothes_months[*]}
        do
          # record date
          db_date=${years[$i]}-$month-"17T05:00:00.000Z"

          # amount
          inflation_mutiplier=$(echo "scale=2; $annual_inflation ^ $(($i))" | bc )
          lo=50
          hi=100
          random_dollar=$(shuf -i $lo-$hi -n 1)
          infl_adj_random_dollar_float=$(echo "scale=0; $random_dollar  * $inflation_mutiplier" | bc)
          infl_adj_random_dollar=$(echo $infl_adj_random_dollar_float | awk '{ print int($1) }')
          random_cents=50
          amount="$infl_adj_random_dollar.$random_cents"

          sql_query_expense_discretionary+="('$db_date', '$amount', 'discretionary', 'dsw', 'shoes', 'active'), "
      done
  done


  ##########  Recurring #############
  sql_query_expense_recurring=""

  ## Internet
  for i in ${!years[@]} 
    do
      for month in ${months[*]}
        do
          # record date
          db_date=${years[$i]}-$month-"01T05:00:00.000Z"

          # amount calc
          inflation_mutiplier=$(echo "scale=2; $annual_inflation ^ $(($i))" | bc )
          random_dollar=40
          infl_adj_random_dollar_float=$(echo "scale=0; $random_dollar  * $inflation_mutiplier" | bc)
          infl_adj_random_dollar=$(echo $infl_adj_random_dollar_float | awk '{ print int($1) }')
          random_cents=99
          amount="$infl_adj_random_dollar.$random_cents"

          sql_query_expense_recurring+="('$db_date', '$amount', 'recurring', 'verizon', 'internet', 'active'), "
      done
  done

  ## Mobile Phone
  for i in ${!years[@]} 
    do
      for month in ${months[*]}
        do
          # record date
          db_date=${years[$i]}-$month-"15T05:00:00.000Z"
          sql_query_expense_recurring+="('$db_date', '35', 'recurring', 'mint mobile', 'cell phone', 'active'), "
      done
  done

  ## Gym Membership
  for i in ${!years[@]} 
    do
      for month in ${months[*]}
        do
          # record date
          db_date=${years[$i]}-$month-"10T05:00:00.000Z"
          sql_query_expense_recurring+="('$db_date', '180', 'recurring', 'gym membership', 'bjj', 'active'), "
      done
  done

  ## Spotify
  for i in ${!years[@]} 
    do
      for month in ${months[*]}
        do
          # record date
          db_date=${years[$i]}-$month-"24T05:00:00.000Z"
          sql_query_expense_recurring+="('$db_date', '9.99', 'recurring', 'Spotify', '', 'active'), "
      done
  done

  ## Google Drive
  for i in ${!years[@]} 
    do
      for month in ${months[*]}
        do
          # record date
          db_date=${years[$i]}-$month-"04T05:00:00.000Z"
          sql_query_expense_recurring+="('$db_date', '1.99', 'recurring', 'google drive', '', 'active'), "
      done
  done

  ## Netflix
  for i in ${!years[@]} 
    do
      for month in ${months[*]}
        do
          # record date
          db_date=${years[$i]}-$month-"06T05:00:00.000Z"
          sql_query_expense_recurring+="('$db_date', '12.99', 'recurring', 'netflix', '', 'active'), "
      done
  done

  ## Car Payment
  for i in ${!years[@]} 
    do
      for month in ${months[*]}
        do
          # record date
          db_date=${years[$i]}-$month-"11T05:00:00.000Z"
          sql_query_expense_recurring+="('$db_date', '294.32', 'recurring', 'car payment', '', 'active'), "
      done
  done

  ## Mortgage Payment
  for i in ${!years[@]} 
    do
      for month in ${months[*]}
        do
          # record date
          db_date=${years[$i]}-$month-"01T05:00:00.000Z"
          sql_query_expense_recurring+="('$db_date', '1455.29', 'recurring', 'mortgage', '', 'active'), "
      done
  done

  ## HOA Payment
  for i in ${!years[@]} 
    do
      for month in ${months[*]}
        do
          # record date
          db_date=${years[$i]}-$month-"01T05:00:00.000Z"
          
          # amount
          inflation_mutiplier=$(echo "scale=2; $annual_inflation ^ $(($i))" | bc )
          random_dollar=250
          infl_adj_random_dollar_float=$(echo "scale=0; $random_dollar  * $inflation_mutiplier" | bc)
          infl_adj_random_dollar=$(echo $infl_adj_random_dollar_float | awk '{ print int($1) }')
          random_cents=79
          amount="$infl_adj_random_dollar.$random_cents"

          sql_query_expense_recurring+="('$db_date', '$amount', 'recurring', 'home owners association', '', 'active'), "
      done
  done

  ## Electric Bill
  for i in ${!years[@]} 
    do
      for month in ${months[*]}
        do
          # record date
          db_date=${years[$i]}-$month-"12T05:00:00.000Z"
          
          # amount
          inflation_mutiplier=$(echo "scale=2; $annual_inflation ^ $(($i))" | bc )
          lo=55
          hi=90
          random_dollar=$(shuf -i $lo-$hi -n 1)
          infl_adj_random_dollar_float=$(echo "scale=0; $random_dollar  * $inflation_mutiplier" | bc)
          infl_adj_random_dollar=$(echo $infl_adj_random_dollar_float | awk '{ print int($1) }')
          random_cents=$(shuf -i 10-99 -n 1)
          amount="$infl_adj_random_dollar.$random_cents"

          sql_query_expense_recurring+="('$db_date', '$amount', 'recurring', 'dominion energy', 'electric bill', 'active'), "
      done
  done

  ########## Consolidate and Edit final expense sql query string ##########

  sql_query_expenses+=$sql_query_expense_grocery
  sql_query_expenses+=$sql_query_expense_transportation
  sql_query_expenses+=$sql_query_expense_eating_out
  sql_query_expenses+=$sql_query_expense_pet
  sql_query_expenses+=$sql_query_expense_medical
  sql_query_expenses+=$sql_query_expense_discretionary
  sql_query_expenses+=$sql_query_expense_recurring


  sql_query_expenses_edit="${sql_query_expenses%??}"
  sql_query_expenses_edit+=";"
  sql_query_expenses=$sql_query_expenses_edit



echo "|=============== INSERT DATA INTO DB STARTED ===============|"
ROOT_PASSWD="pass"
DB="cashamole"


# Switch to database AND insert generated data to specified user id tables
mysql -u root -p$ROOT_PASSWD -e "
    USE $DB; 
    $sql_query_expenses
  "

echo "|=============== INSERT DATA INTO DB END ===============|"