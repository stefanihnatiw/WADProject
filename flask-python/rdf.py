import sys, io, requests, json, csv, rdflib
from SPARQLWrapper import SPARQLWrapper, RDFXML, JSON

graph = rdflib.Graph()
with open("artists.rdf", 'r', encoding='utf8') as fi:
    fo = "xml"
    graph.parse(fi, format=fo)


def get_results(endpoint_url, query, tip):
    sparql = SPARQLWrapper(endpoint_url)
    sparql.setQuery(query)
    sparql.setReturnFormat(tip)
    return sparql.query().convert().serialize(format='xml').decode()


def get_artist_wiki(artist):
    search_url = r"https://www.wikidata.org/w/api.php?action=wbsearchentities&search={}&format=json&language=en".format(
        artist.replace(" ", "%20"))
    r = requests.get(search_url)
    resp = json.loads(r.content.decode())
    entity = resp["search"][0]["id"]

    query = """
    SELECT ?uri ?image ?article
    WHERE { 
        ?uri schema:about ?article
        OPTIONAL { ?uri wdt:P18 ?image }
    }
    GROUP BY ?uri
    """

    results = graph.query(query).serialize(format='json').decode()
    wiki = dict()
    results = json.loads(results)
    for result in results["results"]["bindings"]:
        if result["uri"]["value"] == "http://www.wikidata.org/entity/" + entity:
            wiki["article"] = result["article"]["value"]
            wiki["image"] = result["image"]["value"]
            break
    return wiki


def get_artists_wiki():
    endpoint_url = "https://query.wikidata.org/sparql"
    entities = ""

    input_file = csv.DictReader(open("artists.csv"))
    for row in input_file:
        artist = row["name"]
        search_url = r"https://www.wikidata.org/w/api.php?action=wbsearchentities&search={}&format=json&language=en".format(
            artist.replace(" ", "%20"))
        r = requests.get(search_url)
        resp = json.loads(r.content.decode())
        entity = resp["search"][0]["id"]
        entities += "(wd:" + entity + ") "

    query = """
    PREFIX skos: <http://www.w3.org/2004/02/skos/core#>
    PREFIX wdt: <http://www.wikidata.org/prop/direct/>
    PREFIX p: <http://www.wikidata.org/prop/>
    PREFIX ps: <http://www.wikidata.org/prop/statement/>
    
    CONSTRUCT {
        ?uri rdfs:label ?label ;
             skos:prefLabel ?prefLabel ;
             skos:altLabel ?altLabel ;
             wdt:P18 ?image ;
             schema:about ?article .
    }
    
    WHERE {
        VALUES (?uri) { """ + entities + """}.
        ?article schema:about       
        ?uri ; schema:inLanguage "en" ; 
        schema:isPartOf <https://en.wikipedia.org/>
    
        OPTIONAL { ?uri rdfs:label ?label }
        OPTIONAL { ?uri skos:prefLabel ?prefLabel }
        OPTIONAL { ?uri skos:altLabel ?altLabel }
        OPTIONAL { ?uri  p:P18 [ps:P18  ?image; wikibase:rank wikibase:PreferredRank] }    
        OPTIONAL { ?uri wdt:P18 ?image }
    }
    """

    results = get_results(endpoint_url, query, RDFXML)
    return results


def gen_rdf():
    rdf = get_artists_wiki()
    with io.open("artists.rdf", "w+", encoding="utf-8") as f:
        f.write(rdf)
