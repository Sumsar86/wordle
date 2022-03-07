from urllib.request import Request, urlopen
from urllib.error import URLError

url = "http://www.eki.ee/tarkvara/wordlist/lemmad2013.txt"
req = Request(url)
count = 0

try:
    text = urlopen(req).read().decode("utf-8")
    with open("lemma2013_5tahte.txt", "w", encoding="utf-8") as f:
        for line in text.splitlines():
            if len(line.strip("\n")) == 5:
                f.write(line.upper() + "\n")
                count += 1
except URLError as e:
    print("ERROR: COULD NOT OPEN URL.")
    print(e)

print(count)
