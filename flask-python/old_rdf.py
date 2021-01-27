import sys, requests, json
from SPARQLWrapper import SPARQLWrapper, JSON

def get_results(endpoint_url, query):
    user_agent = "WDQS-example Python/%s.%s" % (sys.version_info[0], sys.version_info[1])
    # TODO adjust user agent; see https://w.wiki/CX6
    sparql = SPARQLWrapper(endpoint_url, agent=user_agent)
    sparql.setQuery(query)
    sparql.setReturnFormat(JSON)
    return sparql.query().convert()


def get_artist_wiki(artist):
    try:
        endpoint_url = "https://query.wikidata.org/sparql"

        search_url = r"https://www.wikidata.org/w/api.php?action=wbsearchentities&search={}&format=json&language=en".format(artist.replace(" ", "%20"))
        r = requests.get(search_url)
        resp = json.loads(r.content.decode())
        entity = resp["search"][0]["id"]

        query = """SELECT  ?item ?itemLabel (iri(min(str(?image))) as ?image) ?itemDescription (SAMPLE(?article) AS ?articleSample) 
        WHERE{ 
          VALUES ?item { wd:""" + entity + """ } 
          ?article  schema:about       
          ?item ; schema:inLanguage  "en" ; 
          schema:isPartOf    <https://en.wikipedia.org/>   
                    
          OPTIONAL { ?item  p:P18 [ps:P18  ?image; wikibase:rank wikibase:PreferredRank] }     
          OPTIONAL { ?item wdt:P18 ?image }
          SERVICE wikibase:label { bd:serviceParam wikibase:language "en"}}
        
        GROUP BY ?item ?itemLabel ?itemDescription
        """

        results = get_results(endpoint_url, query)
        return results['results']['bindings'][0]
    except:
        return {'image': {'value': 'https://yaoizbsyarnz.managedwp.com.au/wp-content/uploads/2020/06/no-image.jpg'}}


'''
rdf = """<?xml version="1.0" encoding="UTF-8"?>
<rdf:RDF
   xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#"
   xmlns:rdfs="http://www.w3.org/2000/01/rdf-schema#"
   xmlns:skos="http://www.w3.org/2004/02/skos/core#"
>\n"""

entities = dict()
for result in results["results"]["bindings"]:
    entity = result["subject"]["value"]
    label = ""
    if result["predicate"]["value"].endswith("rdf-schema#label"):
        label = "rdfs:label"
    elif result["predicate"]["value"].endswith("skos/core#altLabel"):
        label = "skos:altLabel"
    elif result["predicate"]["value"].endswith("skos/core#prefLabel"):
        label = "skos:prefLabel"
    lang = result["object"]["xml:lang"]
    value = result["object"]["value"]

    if entity not in entities:
        entities[entity] = list()
    entities[entity].append([label, lang, value])

for entity in entities:
    rdf += "\t<rdf:Description rdf:about=\"{}\">\n".format(entity)
    for elem in entities[entity]:
        label = elem[0]
        lang = elem[1]
        value = elem[2]
        rdf += "\t\t<{} xml:lang=\"{}\">{}</{}>\n".format(label, lang, value, label)
    rdf += "\t</rdf:Description>\n"

rdf += "</rdf:RDF>\n"

with io.open(item + ".rdf", "w+", encoding="utf-8") as f:
    f.write(rdf)'''
