#!/usr/bin/env python
# Name:
# Student number:
'''
This script scrapes IMDB and outputs a CSV file with highest rated tv series.
'''
import csv

from pattern.web import URL, DOM, strip_tags, encode_utf8

TARGET_URL = "http://www.imdb.com/search/title?num_votes=5000,&sort=user_rating,desc&start=1&title_type=tv_series"
BACKUP_HTML = 'tvseries.html'
OUTPUT_CSV = 'tvseries.csv'


def extract_tvseries(dom):
    '''
    Extract a list of highest rated TV series from DOM (of IMDB page).

    Each TV series entry should contain the following fields:
    - TV Title
    - Rating
    - Genres (comma separated if more than one)
    - Actors/actresses (comma separated if more than one)
    - Runtime (only a number!)
    '''
    
    title_list = []
    actors = []
    moviestars = ""
    for movie in dom('div.lister-item-content'):
        for header in movie('h3.lister-item-header'):
            for title in header('a'):
                title = strip_tags(title)
                title = encode_utf8(title)
                title_list.append(title)

        for actornames in movie('p'):
            for actor in actornames('a'):
                url = actor.attributes.get('href', '')
                if url[:5] == '/name':
                    actor = strip_tags(actor)
                    actor = encode_utf8(actor)
                    if moviestars:
                        moviestars += ', {}'.format(actor)
                    else:
                        moviestars += actor
        actors.append(moviestars)
        moviestars = ""

    ratings = []
    for rating in dom('div.ratings-imdb-rating'):
        rating = strip_tags(rating)
        rating = encode_utf8(rating)
        ratings.append(rating[:-2])

    genres = []
    for genre in dom('span.genre'):
        genre = strip_tags(genre)
        genre = encode_utf8(genre)
        genres.append(genre[:-12])

    runtimes = []
    for show in dom('p.text-muted'):
        for runtime in show('span.runtime'):
            runtime = strip_tags(runtime)
            runtime = encode_utf8(runtime)
            runtimes.append(runtime[:-4])
        
    print runtimes
    print actors
    print genres
    print ratings
    print title_list

    return title_list, ratings, genres, actors, runtimes


'''

    for actors in dom('p.'):
        for actor in actors('a'):
            print actor

    for runtime in dom('span.runtime'):
        print runtime
#'''
    
                
        

    # ADD YOUR CODE HERE TO EXTRACT THE ABOVE INFORMATION ABOUT THE
    # HIGHEST RATED TV-SERIES
    # NOTE: FOR THIS EXERCISE YOU ARE ALLOWED (BUT NOT REQUIRED) TO IGNORE
    # UNICODE CHARACTERS AND SIMPLY LEAVE THEM OUT OF THE OUTPUT.
    #return title_list  # replace this line as well as appropriate


def save_csv(f, tvseries):
    '''
    Output a CSV file containing highest rated TV-series.
    '''
    writer = csv.writer(f)
    writer.writerow(['Title', 'Rating', 'Genre', 'Actors', 'Runtime'])
    
    for i in range(len(tvseries[0])):
        writer.writerow([tvseries[0][i], tvseries[1][i], tvseries[2][i], tvseries[3][i], tvseries[4][i]])
    #for item in tvseries:
    #    writer.writerow(tvseries[item])

    # ADD SOME CODE OF YOURSELF HERE TO WRITE THE TV-SERIES TO DISK

if __name__ == '__main__':
    # Download the HTML file
    url = URL(TARGET_URL)
    html = url.download()

    # Save a copy to disk in the current directory, this serves as an backup
    # of the original HTML, will be used in grading.
    with open(BACKUP_HTML, 'wb') as f:
        f.write(html)

    # Parse the HTML file into a DOM representation
    dom = DOM(html)

    # Extract the tv series (using the function you implemented)
    tvseries = extract_tvseries(dom)
    print tvseries

    # Write the CSV file to disk (including a header)
    with open(OUTPUT_CSV, 'wb') as output_file:
        save_csv(output_file, tvseries)
