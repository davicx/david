  
class Country:
    def __init__(self):
        self.attendees = []
        self.name = None
        self.final_start_date = None

    def add(self, partner):
        self.attendees.append(partner.email)

    def get_final(self):
        final = dict()
        final['attendeeCount'] = len(self.attendees)
        final['attendees'] = sorted(self.attendees)
        final['name'] = self.name
        final['startDate'] = self.final_start_date
        return final
		
		
class Partner:
    def __init__(self, json_in):
        self.first_name = json_in['firstName']
        self.last_name = json_in['lastName']
        self.email = json_in['email']
        self.country = json_in['country']
        self.dates_available = json_in['availableDates']


from Partner import Partner
from Country import Country
#installed using python-dateutil
from dateutil.parser import parse
import datetime
#installed using python-requests
import requests
import json


"""
    Performs a get request at the indicated HubSpot api
"""
def get_json():
    data = requests.get('https://candidate.hubteam.com/candidateTest/v2/partners?userKey=cc77851c9d677bffec6e915c5fc1')
    return data.json()

def parse_json(json_in):
    country_result = []
    country_dict = dict()

    """
         Adds a country to the dictionary if it does not already exist
    """
    for p in json_in['partners']:
        employee = Partner(p)
        if employee.country not in country_dict:
            country_dict[employee.country] = dict()

        """
            Sets an employee under the subdictionary to hold the available dates
        """
        for available in employee.dates_available:
            if available not in country_dict[employee.country]:
                country_dict[employee.country][available] = set()
            country_dict[employee.country][available].add(employee)


        for country, dates in country_dict.items():
            sorted_dates = sorted(dates.keys())
            min_attendees = 0
            min_days = None
            max_attendees = set()

            """
                Parses all date formats to a readable form that can be used to compare. This is how to find two
                dates that are consecutive
            """
            for i in range(len(sorted_dates[:-1])):

                current_date = sorted_dates[i]
                current_tomorrow = sorted_dates[i+1]
                current_date_formatted = parse(current_date)
                current_tomorrow_formatted = parse(current_tomorrow)

                date_attendees = dates[current_date]
                tomorrow_attendees = dates[current_tomorrow]

                if current_tomorrow_formatted - current_date_formatted != datetime.timedelta(1):
                    continue
                attendees = date_attendees & tomorrow_attendees
                attend_total = len(attendees)

                """
                    Sets a new date if the total number of attendees for a given date is greater than the already
                    existing max date
                """
                if attend_total > min_attendees:
                    min_attendees = attend_total
                    min_days = current_date
                    max_attendees = attendees
            """
                Creates Country objects to hold the correct format able to be put into JSON
            """
            country = Country()
            country.name = country
            if min_attendees > 0:
                country.final_start_date = min_attendees
            for attendee in max_attendees:
                country.add(attendee)
            country_result.append(country)
            return country_result

def get_final(countries):
    final = dict()
    final['countries'] = list(map(lambda result: result.get_final(), countries))
    return final

"""
    Posts the final list of countries w/ dates and attendees to the HubSpot api
"""
def json_out(final_send):
    r = requests.post('https://candidate.hubteam.com/candidateTest/v2/results?userKey=cc77851c9d677bffec6e915c5fc1', data=json.dumps(final_send))
    print(r)

def main():
    json_in = get_json()
    countries = parse_json(json_in)
    final_send = get_final(countries)
    json_out(final_send)
if __name__ == '__main__':
    main()
	
	
'use strict';

const got = require('got');
const moment = require('moment');
const util = require('util');
const dedupe = require('dedupe');

got('https://candidate.hubteam.com/candidateTest/v3/problem/dataset?userKey=43adbb9a79d336cae5ab9149ee6f').then((response) => {
    let availabilityMap = {};
    let availabilities = {};
    let combinedAvailabilities = {};
    let invitation = {
        countries: []
    };

    const data = JSON.parse(response.body)
    const partners = data.partners;

    partners.forEach((partner) => {
        const availableDates = partner.availableDates;
        const country = partner.country;
        const email = partner.email;
        let filteredAvailableDates;

        if (!availabilityMap[country]) {
            availabilityMap[country] = {};
            availabilities[country] = [];
            combinedAvailabilities[country] = [];
        }

        // filter dates to ones that is one day apart
        filteredAvailableDates = availableDates.filter((date, index, array) => {
            return moment(date).diff(moment(array[index - 1]), 'days') === 1 || moment(date).diff(moment(array[index + 1]), 'days') === -1
        })

        filteredAvailableDates.forEach((availableDate, index) => {
            if (availabilityMap[country][availableDate]) {
                availabilityMap[country][availableDate].attendees.push(email);
            } else {
                availabilityMap[country][availableDate] = {
                    attendees: [email]
                };
            }
        });
    });

    // restructure data for sorting
    for (let country in availabilityMap) {
        if (availabilityMap.hasOwnProperty(country)) {
            for (let date in availabilityMap[country]) {
                availabilities[country].push({
                    date: date,
                    attendees: availabilityMap[country][date].attendees
                });
            }
        }
    }

    // sort on dates
    for (let country in availabilities) {
        if (availabilities.hasOwnProperty(country)) {
            availabilities[country].sort((current, next) => {
                if (moment(current.date).isBefore(moment(next.date))) {
                    return -1;
                } else {
                    return 1;
                }
            });
        }
    }

    // combined count for two-day event
    for (let country in availabilities) {
        if (availabilities.hasOwnProperty(country)) {
            for (let i = 0; i < availabilities[country].length; i++) {
                if (i !== 0) {
                    combinedAvailabilities[country].push({
                        dates: [
                            availabilities[country][i - 1].date,
                            availabilities[country][i].date
                        ],
                        attendeeCount: dedupe(keepDuplicates(availabilities[country][i - 1].attendees.concat(availabilities[country][i].attendees))).length,
                        attendees: dedupe(keepDuplicates(availabilities[country][i - 1].attendees.concat(availabilities[country][i].attendees)))
                    });
                }
            }
        }
    }

    // sort on counts
    for (let country in combinedAvailabilities) {
        if (combinedAvailabilities.hasOwnProperty(country)) {
           combinedAvailabilities[country].sort((current, next) => {
             if(current.attendeeCount > next.attendeeCount) {
                 return -1;
             } else if(current.attendeeCount < next.attendeeCount) {
                 return 1;
             } else {
                 if(moment(current.dates[0]).isBefore(moment(next.dates[0]))) {
                    return -1;
                 } else {
                    return 1;
                 }
             }
           });
        }
    }

    // map data into required shape
    for (let country in combinedAvailabilities) {
        if (combinedAvailabilities.hasOwnProperty(country)) {
           invitation['countries'].push({
               attendeeCount: combinedAvailabilities[country][0].attendeeCount,
               attendees: combinedAvailabilities[country][0].attendees,
               name: country,
               startDate: combinedAvailabilities[country][0].dates[0] ? combinedAvailabilities[country][0].dates[0] : null
           });
        }
    }

    // post = profit
    got.post('https://candidate.hubteam.com/candidateTest/v3/problem/result?userKey=43adbb9a79d336cae5ab9149ee6f', {
        body: JSON.stringify(invitation),
        headers: {
            'Content-type': 'application/json'
        }
    }).then((response) => {
        console.log(response.body);
    }).catch((error) => {
        console.error(error);
    });;
}).catch((error) => {
    console.error(error);
});

// This is to keep the duplicated attendees, because they are the only ones can attend on both days
function keepDuplicates(array) {
    let result = [];

    for(let i = 0; i < array.length; i++) {
        let temp = array.slice();
        temp.splice(i, 1);
        if(temp.indexOf(array[i]) > -1) {
            result.push(array[i]);
        }
    }
    return result;
}











////
const axios = require('axios');
const moment = require("moment");
const _ = require("lodash");

// 2 day event
// dates are 2017-05-03
// date for the country is starting date of two day period where most partners can attend both days in a row
// if multiple dates with same number of partners, pick the earlier date. 
// if no two days in a row when any partners can make it, return null.

class Scheduler {
    constructor() {
        this.dates = [];
        this.days = 366; //assumed to be within a year
        this.beginningOfYear = moment("2017-01-01");

        for (let i = 0; i < this.days; i++) {
            this.dates.push([]);
        }
    }

    mapDateToIndex = date => date.diff(this.beginningOfYear, 'days');

    getBestDate = () => {
        let maxCount = 0;
        let startDate = null;

        let previousCount = this.dates[0].length;

        for (let i = 1; i < this.days; i++) {
            let currentCount = this.dates[i].length;
            let attendBothDays = _.intersection(this.dates[i], this.dates[i - 1])
            let attendingCount = attendBothDays.length;

            if (attendingCount > maxCount && currentCount > 0 && previousCount > 0) {
                maxCount = attendingCount;
                startDate = moment(this.beginningOfYear).add(i - 1, 'days');
            }

            previousCount = currentCount;
        }

        return startDate;
    }

    pushToArray = (email, date) => this.dates[this.mapDateToIndex(moment(date))].push(email);

    getAttendeesForDate = (date) => this.dates[this.mapDateToIndex(moment(date))]
}

axios.get("https://candidate.hubteam.com/candidateTest/v3/problem/dataset?userKey=d641cd3acc4f2474d674f70b345c")
    .then(res => {
        const { data } = res;
        const { partners } = data;

        const countries = {};

        partners.forEach(partner => {
            if (!countries[partner.country]) {
                countries[partner.country] = new Scheduler();
            }
            partner.availableDates.forEach(date => countries[partner.country].pushToArray(partner.email, date))
        })

        res = {
            countries: []
        }
        Object.keys(countries).forEach(country => {
            var bestDate = countries[country].getBestDate()
            if (bestDate) bestDate = bestDate.format("YYYY-MM-DD");
            let attendees = countries[country].getAttendeesForDate(bestDate) || [];
            countryAns = {
                attendeeCount: attendees.length,
                attendees,
                name: country,
                startDate: bestDate
            }

            res.countries.push(countryAns)
        });

        axios.post("https://candidate.hubteam.com/candidateTest/v3/problem/result?userKey=d641cd3acc4f2474d674f70b345c", res)
            .then(res => {
                console.log(res.status == 200 ? ":)" : ":(")
            })
    })


////











	

partner_data = requests.get('https://candidate.hubteam.com/candidateTest/v3/problem/dataset?userKey=68d9d7827b0710e4da5f61c1a18a')

partner_json = partner_data.json()
partners = partner_json['partners']

#first we need to find if dates are consecutive by isConsecutive(date1,date2) => abs(date2-date1)==1
def isConsecutive(date1,date2):
date1 = datetime.strptime(date1, "%Y-%m-%d")
date2 = datetime.strptime(date2, "%Y-%m-%d")
return abs((date2 - date1).days) == 1

#gives us a dictionary of consecutive dates {'21_22':2} date1_date2:times-observed
def isConsecutiveDates(dates):
consecutiveData = {}
for i in range(len(dates)-1):
date1,date2 = dates[i],dates[i+1]
if isConsecutive(date1,date2):
date_key = '_'.join([date1,date2])
consecutiveData[date_key] = consecutiveData.get(date_key,0) + 1
return consecutiveData

#make list of attendees from countryDict
def getAttendees(countryDict):
countryAttendees = countryDict[1][1]
attendeeEmails = []
for attendee in countryAttendees:
attEmail = attendee.get('email')
attendeeEmails.append(attEmail)
return attendeeEmails

#get start date from countryDict
def getStartDate(countryDict):
if countryDict[0] is None:
return None
dateConcat = countryDict[0]
newDate = dateConcat.split('_')[0]
return newDate

#for each partner we get a dictionary of date and count so we must add it to a country-wide dictionary where
# {country:{date_1: [n,[partner_dict1...partner_dictn]]}
countryDict = dict()
for dct in partners:
dates = dct['availableDates']
dates = sorted(dates, key=lambda d: tuple(map(int, d.split('-'))))
consecutiveDates = isConsecutiveDates(dates)
country = dct['country']
#build our countryWide dictionary
countryDict[country] = countryDict.get(country,{})
for date in consecutiveDates:
countryDict[country][date] = countryDict[country].get(date,[0,[]])
countryDict[country][date][0] += 1
countryDict[country][date][1].append(dct)

#get max element for each country from countryDict and change countryDict to contain data from
# only that date for each country
for country in countryDict:
maxEl = 0
maxData = [None,[]]
max_date = None
for date in countryDict[country]:
if countryDict[country][date][0] > maxEl:
maxEl = countryDict[country][date][0]
maxData = countryDict[country][date]
max_date = date
countryDict[country] = (max_date,maxData)

#build json dictionary for posting to api endpoint
jsonData = {}
jsonList = []
for country in countryDict:
newDict = {}
newDict['attendeeCount'] = countryDict[country][1][0]
newDict['attendees'] = getAttendees(countryDict[country])
newDict['name'] = country
newDict['startDate'] = getStartDate(countryDict[country])
jsonList.append(newDict)

jsonData['countries'] = jsonList
r = requests.post('https://candidate.hubteam.com/candidateTest/v3/problem/result?userKey=68d9d7827b0710e4da5f61c1a18a',
json = jsonData
)
#print the status of our post request
print(r.json())
