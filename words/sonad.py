from urllib.request import Request, urlopen
from urllib.error import URLError

# url = "http://www.eki.ee/tarkvara/wordlist/lemmad2013.txt"
url = "http://www.eki.ee/tarkvara/wordlist/soned2013.txt"
# letters = "ABCDEFGHIJKLMNOPQRSŠZŽTUVWÕÄÖÜXY"
letters = "abcdefghijklmnopqrsšzžtuvwõäöüxy"
req = Request(url)
count = 0

try:
    text = urlopen(req).read().decode("utf-8")
    with open("soned2013_5tahte.txt", "w", encoding="utf-8") as f:
        length = len(text.splitlines())
        print("START!", length)
        for it, line in enumerate(
            map(
                lambda x: x.strip("\n").strip("|").split("\t")[0],
                text.splitlines(),
            )
        ):
            if len(line) == 5 and line.islower():
                passes = True
                for char in line:
                    if char not in letters:
                        passes = False
                        continue
                if passes:
                    f.write(line.upper() + "\n")
                    count += 1
            if it % 10000 == 0:
                print(str(it / length * 100), end="%    \r")
except URLError as e:
    print("ERROR: COULD NOT OPEN URL.")
    print(e)

print("\r100.0000000000000%   ")
print("Count: " + str(count))
