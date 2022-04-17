//PROBLEM 2: Amazon Music pairs
public static int pairsOfSongs(int[] time) {
	int[] arr = new int[60];
	int answer = 0;
	for (int i = 0; i < time.length; i++) {
		int mod = time[i] % 60; // 120%60=0, 1%60=1
		int target = (60-mod) % 60; // 120 target = 0; 1 then target=59
		answer = answer + arr[target];
		arr[mod]++;
	}
	
	return answer;
	
}


//PROBLEM 11.B: Amazon Substrings of size K with K distinct chars
public static Set<String> uniqueSubstringSizeK(String s, int k) {
	Set<String> set = new HashSet<>();
	int[] ch = new int[26];
	int lo=0;
	int hi=0;
	while(lo<=hi && hi<s.length()) {
		ch[s.charAt(hi)-'a']++;
		while(ch[s.charAt(hi)-'a'] != 1) {
			ch[s.charAt(lo)-'a']--;
			lo++;
		}
		if(hi-lo+1 == k) {
			set.add(s.substring(lo, hi+1));
			ch[s.charAt(lo)-'a']--;
			lo++;
		}
		hi++;
	}
	System.out.println(set.size());
	Iterator<String> it = set.iterator();
	while(it.hasNext()) {
		System.out.println(it.next());
	}
	return set;
}

//PROBLEM 10: Transaction Logs
public class FraudLogs {
	public List<String> getFraudIds(String[] input, int threshold) {
		List<String> res = new ArrayList<>();
		Map<String, Integer> map = new HashMap<>();
		for (String log : input) {
			String[] logVals = log.split(" ");
            Set<String> set = new HashSet<>(Arrays.asList(logVals[0], logVals[1]));
			for (String userId : set) {
				map.put(userId, map.getOrDefault(userId, 0) + 1);
			}
		}

		for (String userId : map.keySet()) {
			if (map.get(userId) >= threshold)
				res.add(userId);
		}

		Collections.sort(res);

		return res;
	}

	public static void main(String[] args) {
		String[] input = new String[] { "345366 89921 45", "029323 38239 23", "38239 345366 15", "029323 38239 77",
				"345366 38239 23", "029323 345366 13", "38239 38239 23" };
		System.out.println(new FraudLogs().getFraudIds(input, 3));
	}
}

#include <vector>
#include <unordered_map>
#include <iostream>
using namespace std;

// time : O(L logL)
// space: O(L)
// L = total size of logs
vector<string> fraudulent(vector<string>& logs, int threshold) {
  unordered_map<string, int> counter;
  vector<string> ans;
  for (string& log : logs) {
    int space_pos1 = log.find(' '), space_pos2 = log.rfind(' ');
    string u1 = log.substr(0, space_pos1);
    string u2 = log.substr(space_pos1 + 1, space_pos2 - space_pos1 - 1);
    counter[u1]++;
    if (u1 != u2) counter[u2]++;
  }
  for (auto& [user, k] : counter) if (k >= threshold) ans.push_back(user);
  sort(begin(ans), end(ans), [&counter](auto& x, auto& y) {
    return counter[x] > counter[y];
  });
  return ans;
}

int main() {
  vector<string> logs = {
    "345366 89921 45",
    "029323 38239 23",
    "38239 345366 15",
    "029323 38239 77",
    "345366 38239 23",
    "029323 345366 13",
    "38239 38239 23"
  };
  for (auto& user : fraudulent(logs, 3)) cout << user << " ";
  cout << '\n';
}