import sys
import csv
import os
from classes.Plan import Plan

#CONSTANTS
#Metal_Level: This is so we only are looking in Silver Plans 
METAL_LEVEL_CONSTANT = 'Silver' 

#Arrays of Data 
silver_plans_array = []
zip_codes_array = []

#STEP 1: Load Zip Codes (This is what we are finding rates for)
#zip_codes_array = load_zipcodes()



#STEP 2: Load Plans Data 
print("STEP 2")
with open('C:/Users/Vasquezd/Desktop/SLCSP/data_files/plans.csv') as file:
    plansReader = csv.reader(file)
    count = 0
    
    #Loop through the whole plans.csv file and create an object that represents each plan
    for currentPlansRow in plansReader:
        plan_id = currentPlansRow[0]
        state = currentPlansRow[1]
        metal_level = currentPlansRow[2]
        rate = currentPlansRow[3]
        rate_area = currentPlansRow[4]
       
        #Only Create Objects for the Silver Plans 
        if metal_level == METAL_LEVEL_CONSTANT:
            plan_id = Plan(state, metal_level, rate, rate_area)
            silver_plans_array.append(plan_id) 
        
        if count > 20: 
            break            
        count = count + 1    

for plan in silver_plans_array:
    print(plan.state + " "  + plan.metal_level)



print("STEP 1")

with open('C:/Users/Vasquezd/Desktop/SLCSP/data_files/slcsp.csv') as zip_code_file:
    zipCodesReader = csv.reader(zip_code_file)  
    
    for currentZipCodeRow in zipCodesReader:  
        print(currentZipCodeRow[0])
        zip_codes_array.append(currentZipCodeRow[0]) 

for zip_code in zip_codes_array:
    print(zip_code) 


#FUNCTIONS: 
#Function A.1: Load Zipcodes from CSV File 
def load_zipcodes():
    internal_zip_codes_array = []
    with open('C:/Users/Vasquezd/Desktop/SLCSP/data_files/zips.csv') as file:
        zipCodesReader = csv.reader(file)   
        internal_zip_codes_array.append(zipCodesReader[0]) 
        return internal_zip_codes_array


