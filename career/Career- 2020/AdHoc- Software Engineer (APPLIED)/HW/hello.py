import sys
import csv
import os
from classes.Person import Person

p1 = Person("Katie", 22)

print(p1.name)
print(p1.age)
print(p1.age)
print(p1.age)
print(p1.age)
#print("hello")
print(sys.path)

#/c/Users/Vasquezd/Desktop/SLCSP/hello.txt
file = open('C:/Users/Vasquezd/Desktop/SLCSP/hello.txt', 'r')
for line in file.readlines(): print line

with open('C:/Users/Vasquezd/Desktop/SLCSP/data_files/plans.csv') as file:
    plansReader = csv.reader(file)
    count = 0
    
    for row in plansReader:
        
        #Plan ID
        print(row[0])
        
        #State
        print(row[1])
        
        #Metal Level
        print(row[2])
        
        #Rate
        print(row[3])
        
        #Rate Area 
        print(row[4])
        
        
        if count > 5: 
            break            
        count = count + 1    

