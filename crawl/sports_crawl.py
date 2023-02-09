import requests
import datetime as dt
import re

from bs4 import BeautifulSoup as bs


LINK = 'https://news.nate.com/view/'
# TODO: rename SportsNews to NateNews
# TODO: modulize
"""
/
L crawl
    L utils
        L funcs
    L nate
        L NateNews
"""
# TODO: () handling
# TODO: all domain handling 


class SportsNews:
    def __init__(self, url:str):
        headers = {'User-Agent':'Mozilla/5.0 (Windows NT 6.3; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/63.0.3239.132 Safari/537.36'}
        res = requests.get(url, headers=headers) # to prevent block crawling
        assert res.status_code == 200
        
        self.url = url
        html = res.text
        self.content = bs(html, 'html.parser')
    
    def get_info(self):
        return[
            self._get_title(),
            self._get_category(),
            self._get_press(),
            self._get_date(),
            self._get_content(),
            self.url,
        ]
    
    def _get_press(self):
        press = self.content.find('dl', {'class': 'articleInfo'})
        # press.text
        return press.select("img")[0]['alt']

    def _get_category(self):
        nav = self.content.find('div', {'class': 'snbArea'})
        category = nav.find('li', {'class': 'on'})
        return category.text if category else 'X'

    def _get_content(self):
        article = self.content.find('div',{'id': 'articleContetns'})
        
        # FIXME: 밑에 코드는 backup용, 혹시 위에 코드 에러나면 아래거 돌려보기
        # article = self.content.find('div', {'id': 'realArtcContents'})
        # if not article:
        #     article = self.content.find(
        #         'div',
        #         {'id': 'RealArtcContents'}
        #     )
        # if not article: return None
        return self._preprocessing(article)
    
    def _get_title(self):
        title = self.content.find('h3', {'class': 'viewTite'})
        return title.text
    
    
    def _get_date(self):
        _date = self.content.find('dl', {'class': 'articleInfo'})
        _date = _date.find('em').text
        date: dt.datetime = dt.datetime.strptime(_date, "%Y-%m-%d %H:%M")
        return date
    
    def _preprocessing(self, article):
        MESSAGE = '지원하지 않는 브라우저로 접근하셨습니다.\nInternet Explorer 10 이상으로 업데이트 해주시거나, 최신 버전의 Chrome에서 정상적으로 이용이 가능합니다.'

        article_text = str(article)

        text = article_text.replace('\n', '').replace('\t', '').replace('\r', '') # 공백 제거
        pattern = "<br/?>" # <br> 태그 -> 개행으로 변경
        tmp = re.sub(pattern, '\n', text)
        
        pattern = "</?p[^>]*>" # <p> or </p> -> 개행으로 변경
        tmp = re.sub(pattern, '\n', tmp)
        
        pattern = "<caption>[^>]+>" # caption 제거
        tmp = re.sub(pattern, '', tmp)

        pattern = "<a.+</a>" # [a] 태그 제거
        tmp = re.sub(pattern, '', tmp)

        pattern = "<img[^>]+>" # img들 모두 제거
        tmp = re.sub(pattern, '\n(IMAGE)\n', tmp)
        content = bs(tmp, 'html.parser') # 다시 parsing
        tmp = re.sub(' {2,}', ' ', content.text)
        
        pattern = '\[[^\]]*\]' # [] 내부 모두 제거
        tmp = re.sub(pattern, '', tmp)
        
        pattern = "<[^>]*>" # <> 내부 모두 제거
        text = re.sub(pattern, '', tmp)
        
        last_text = ('').join([word for word in text if word.isalpha() or ord(word) < 128]) # 특수기호들 제거
        
        text = last_text.replace(MESSAGE, '')
        
        # 이메일 제거
        pattern = '[a-zA-Z0-9+-_.]+@[a-zA-Z0-9+-_]+.com'
        text = re.sub(pattern, '', text)
        pattern = '[a-zA-Z0-9+-_.]+@[a-zA-Z0-9+-_]+.co.kr'
        text = re.sub(pattern, '', text)
        pattern = '[a-zA-Z0-9+-_.]+@'
        text = re.sub(pattern, '', text)
        
        # 공백 및 하단부 노이즈 제거
        text = re.sub('\n ', '\n\n', text)
        text = re.sub('- ?\n', '\n\n', text)
        text = re.sub('\n{2,}', '\n\n', text)
        
        # 기사 앞부분의 공백 및 개행 제거
        while text[0] == ' ' or text[0] == '\n':
            text = text[1:]
        if text[0] == ']': text = text[1:]
        
        # 기사내용 요약 부분 따로 구현
        text = text.replace('기사내용 요약', '[기사내용 요약]\n')
        return text
    
    
    @staticmethod
    def get_recent(date: int):
        """get latest article number in Nate given date

        Args:
            `date` (int): date in which latest article number will be found

        Note:
            Can't return accurate number of article
            -> get latest number of article in '최신뉴스' in Nate

        Returns:
            int: latest article number
        """        
        req = requests.get(f'https://news.nate.com/recent?mid=n0100&type=c&date={date}')
        content = bs(req.text, 'html.parser')
        _recent = content.find_all('div', {'class': 'mlt01'})
        
        latest = None
        for news in _recent:
            # recent = //news.nate.com/view/{YYYY}{mm}{dd}n{NNNNN}?mid=n0100
            recent = int(news.find('a')['href'].split('?')[0][-5:])
            if not latest or latest < recent:
                latest = recent
        return latest # return latest article number

    @classmethod
    def create(
        cls,
        url:str,
    ):
        # TODO: 기사가 없는 경우 -> svcname='뉴스'
        """create `NateNews` if it satisfy some conditions

        Args:
            `url` (str): url for news in Nate

        Desc:
            return `NateNews` if given url satisfy some conditions
            * 1. Should have article(RealArtcContents or articleContetns)
            * 2. Only for '뉴스', exclude for '연예', '스포츠'
            
        Returns:
            Union[NateNews, None]: 
        """        
        # TODO: add exclusion rule for press('연합뉴스',etc..)
        # if sleep: time.sleep(0.5)
        new_class = cls(url)
        # article = new_class.content.find(
        #     'div',
        #     {'id': 'RealArtcContents'}
        # )
        # if not article:
        #     article = new_class.content.find(
        #         'div',
        #         {'id': 'articleContetns'}
        #     )
        # if not article:
        #     return None
        
        which_news = new_class.content.find(
            'a',
            {'class': 'svcname'}
        ).text
        if which_news == '스포츠':
            return new_class
        else:
            return None

