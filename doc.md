# FÖR ATT STARTA
1. Se till att redis servern är igång. redis-server i terminal på linux. Mac ???
2. starta backend genom att cd:a in i backend mappen och kör npm start från terminalen.
3. för att start electron, cd:a in i frontend/electron och kör npm start i konsolen.

# För att få fram Json till att rita ut frontend:
1. Först anropas getURL för att få den simpla json.
2. Sen anropas createSimplejson på resultatet av steg 1 för att ta ut de relevanta.
3. Sen anropas getUrl på den mer avancerade json.
4. Sen anropas createAdvancedJson på resultatet av 2,3.
5. Sen anropas createSorted Json på resultatet av steg 4.

# För att få fram m3u8
1. Först anropas get SvtvideoId med videoid från steg 5 i ovan.
2. Sen anropas getm3u8link med resultatet från steg 1 som input.

# APILÄNKAR
## PROGRAM A TILL Ö
https://api.svt.se/contento/graphql?ua=svtplaywebb-play-render-prod-client&operationName=ProgramsListing&variables={"legacyIds":[24186554]}&extensions={"persistedQuery":{"version":1,"sha256Hash":"1eeb0fb08078393c17658c1a22e7eea3fbaa34bd2667cec91bbc4db8d778580f"}}
: Legacy id: 

https://www.svtstatic.se/image/wide/140/14102756/1497434150

## RELEVANT DATA FÖR SERIER
https://api.svt.se/contento/graphql?ua=svtplaywebb-play-render-prod-client&operationName=TitlePage&variables={"titleSlugs":"abel-och-fant"}&extensions={"persistedQuery":{"version":1,"sha256Hash":"4122efcb63970216e0cfb8abb25b74d1ba2bb7e780f438bbee19d92230d491c5"}}

