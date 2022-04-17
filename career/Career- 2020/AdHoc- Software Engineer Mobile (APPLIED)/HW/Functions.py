import csv
#FUNCTIONS: 
#Function A.1: Load Zipcodes from CSV File 
def load_zipcodes():
    internal_zip_codes_array = []
    with open('C:/Users/Vasquezd/Desktop/SLCSP/data_files/slcsp.csv') as zip_code_file:
        zipCodesReader = csv.reader(zip_code_file)  
        
        for currentZipCodeRow in zipCodesReader:  
            print(currentZipCodeRow[0])
            internal_zip_codes_array.append(currentZipCodeRow[0]) 
    return internal_zip_codes_array


def pyth_add(x1, x2):
    return x1 + x2
    
def pyth_test(x1, x2):
    return x1 + x2