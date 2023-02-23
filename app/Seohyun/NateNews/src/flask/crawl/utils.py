from bs4 import BeautifulSoup as bs
from concurrent.futures import ThreadPoolExecutor
from news_crawl import NateNews
from preprocessing import text_cleaning
from typing import List
from typing import List, Union

import datetime as dt
import pandas as pd
import requests
import time
import re


LINK = 'https://news.nate.com/view/'
COLUMNS = [
    'title',
    'category',
    'press',
    'date',
    'content',
    'url',
]


def get_news_df(
    news_list: List[NateNews]
):
    """make `pd.DataFrame` with `news_list`

    Returns:
        pd.DataFame: DataFrmae w.r.t `news_list`
    """
    info_list = list()
    for news in news_list:
        try:
            info_list.append(news.get_info())
        except:
            print('Error occurs')
            print(news.url)
    # info_list = [news.get_info() for news in news_list]
    return pd.DataFrame(info_list, columns=COLUMNS)


def get_news(
    url_list: Union[List[str], str]
):
    """Return `NateNews` list

    Args:
        url_list (Union[List[str], str]): url list to be requested

    Returns:
        List[Union[Response, None]]:
            1. NateNews: Normal Request
            2. None: Abnormal Request(won't get that page)
    """
    url_list = url_list if isinstance(url_list, list) else [url_list]
    url_list = list(map(_convert_url, url_list))
    if len(url_list) < 100:
        with ThreadPoolExecutor(max_workers=10) as mult:
            _news_list = list(mult.map(_create, url_list))
    else:
        # _news_list = [_create(url) for url in url_list]
        _news_list = list()
        for url in url_list:
            try:
                _news_list.append(_create(url))
            except:
                print(url)

    news_list = [news for news in _news_list if news]
    return news_list


def _convert_url(url: str):
    url = url.split('?')[0].split('//')[-1]
    return f"https://{url}"


def get_urls(
    date1: Union[int, None] = None,
    date2: Union[int, None] = None,
    artc1: Union[int, None] = None,
    artc2: Union[int, None] = None,
):
    """get url list

    Desc:
        url list
        eg:
            `date1`: `article1` ~ `article2`
            `dateN`: `article1` ~ `article2`
            \n\t\t...
            `date2`: `article1` ~ `article2`

    Args:
        date1 (Union[int, None], optional):
            None -> `datetime.datetime.now()`
        date2 (Union[int, None], optional): 
            None -> `date1`
        artc1 (Union[int, None], optional):
            None -> 1: first article of that day
        artc2 (Union[int, None], optional):
            None -> last article of that day

    Returns:
        List[str]: url list
    """
    date1 = date1 if date1 else int(dt.datetime.now().strftime('%Y%m%d'))
    date2 = date2 if date2 else date1
    artc1 = artc1 if artc1 and artc1 > 0 else 1

    urls = [
        f"{LINK}{date}n{str(num).zfill(5)}"
        for date in _get_date_list(date1, date2)
        for num in _get_artc_list(artc1, artc2, date)
    ]
    return urls


def _get_date_list(
    date1: int,
    date2: int,
):
    """get date list

    Args:
        `date1` (int): first date
        `date2` (int): last date

    Returns:
        List[int]: date list from `date1` to `date2`
    """

    if not date2:
        return [date1]

    date: int = date1
    date_list = list()

    while date <= date2:
        date_list.append(date)
        date = dt.datetime.strptime(str(date), "%Y%m%d") + dt.timedelta(days=1)
        date = int(date.strftime('%Y%m%d'))

    return date_list


def _get_artc_list(
    artc1: int,
    artc2: Union[int, None],
    date: int,
):
    """get article list

    Args:
        `artc1` (int): first article in nate news
        `artc2` (Union[int,None]): last article in nate news
            None: `artc2` = latest article on `date`
        `date` (int): the day you want to crawl

    Returns:
        List[int]: article list from `artc1` to `artc2`
    """
    max_article = _get_recent(date)
    artc1 = artc1 if artc1 < max_article else max_article

    if not artc2 or artc2 > max_article:
        artc2 = max_article
    return [artc for artc in range(artc1, artc2+1)]


def _get_recent(date: int):
    """get latest article number in Nate given date

    Args:
        `date` (int): date in which latest article number will be found

    Note:
        Can't return accurate number of article
        -> get latest number of article in '최신뉴스' in Nate

    Returns:
        int: latest article number
    """
    req = requests.get(
        f'https://news.nate.com/recent?mid=n0100&type=c&date={date}')
    content = bs(req.text, 'html.parser')
    _recent = content.find_all('div', {'class': 'mlt01'})

    latest = None
    for news in _recent:
        # recent = //news.nate.com/view/{YYYY}{mm}{dd}n{NNNNN}?mid=n0100
        recent = int(news.find('a')['href'].split('?')[0][-5:])
        if not latest or latest < recent:
            latest = recent
    return latest  # return latest article number


def _create(url: str):
    """create `NateNews` if it satisfy some conditions

    Args:
        `url` (str): url for news in Nate

    Desc:
        return `NateNews` if given url satisfy some conditions
        * 1. Should have article(articleContetns)
        * 2. Exclude English news

    Returns:
        Union[NateNews, None]: 
    """
    # time.sleep(0.5)
    # TODO: handling sleep stuff...
    new_class = NateNews(url)
    which_news = new_class.content.find(
        'a',
        {'class': 'svcname'}
    ).text

    # 연예 기사는 제외
    if which_news == '연예':
        print(f"{url} is Entertainment News!")
        return None

    # 연합 뉴스들 제외
    if new_class.press == 'AP연합뉴스' or new_class.press == 'EPA연합뉴스':
        print(f"{url} is English News!")
        return None

    article = new_class.content.find(
        'div',
        {'id': 'articleContetns'}
    )

    # 기사가 없는 경우
    if not article:
        print(f"{url} has no article!")
        return None
    else:
        # 특수 기사들은 제외
        title = new_class.title
        if '[속보]' in title or '[포토]' in title or '[부고]' in title:
            print(f"{url} is not Normal News!")
            return None
        # 기사가 있다 -> 길이 확인하기
        content_len = len(_remove_bracket(text_cleaning(article)[0]))
        if content_len < 300:
            print(f'{url} has too short article!')
            return None
        else:
            return new_class


def _remove_bracket(text):
    pattern = '\[[^\]]*\]'
    return re.sub(pattern, '', text)