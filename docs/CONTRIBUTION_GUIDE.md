# Humaniki Contributing Guide
Humaniki is a completely open-source and open-data project that will always welcome your help!
![Architecture Illustration](https://commons.wikimedia.org/wiki/File:Humaniki_Architecture.png#/media/File:Humaniki_Architecture.png)
## Finding the right repo
There are four components to the Humaniki stack.
1. Wikidata dump processing.
    - https://github.com/notconfusing/denelezh-import
    - This is a [Wikdata-Toolkit](https://github.com/Wikidata/Wikidata-Toolkit) Java program that processes huge the wikidata
      dumpfiles and subsets it into CSVs that just relate to humans.
2. Metrics generation
    - https://github.com/notconfusing/humaniki-schema
    - This is python/SQL layer that aggregates data into metrics about humans. It is written mainly in SQLAlchemy, that
      compiles into mysql-dialect sql before executing. 
3. API layer.
    - https://github.com/notconfusing/humaniki-backend
    - This is a python-flask HTTP server that provides a public api at humaniki.wmcloud.org/api to serve results from
      metric generation.
4. Web UI.
    - https://github.com/theeugeniakim/humaniki
    - This is a react-js dashboard that gets. You may develop on the dashboard while getting live data by setting `REACT_APP_URL` environment 
      variable, thereby removing the other repos as dependencies.

## Our workboard
We don't keep our public todo list on github, but on Wikimedia's phabricator [here](https://phabricator.wikimedia.org/project/view/4967/).

## Getting personal help.
The main people that can help answer your questions are, @notconfusing, @sejalkhatri and @theeugeniakim. You mention us (in order of preference)
1. [Phabricator](https://phabricator.wikimedia.org/project/view/4967/) `@`mentions. 
2. On our [Element channel](https://matrix.to/#/+humaniki:matrix.org)
3. Or through  [@humanikidata](https://twitter.com/humanikidata) main twitter or [personal accounts](https://twitter.com/notconfusing) if all else fails.


## General FAQ Page
- https://www.mediawiki.org/wiki/Humaniki/FAQ