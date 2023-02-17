import os
from konlpy.tag import Mecab
from typing import *
import pandas as pd
import pickle
from pathlib import Path

class CustomTokenizer:
    """
    mecab을 활용한 한국어 tokenizer
    키워드 후보군 추출에 사용
    """
    def __init__(self, tagger: Mecab, tag: Union[str, Tuple[str]] = ('NNP', 'NNG')):
        """
        Args:
            tagger: mecab 클래스
            tag: 태그 방법
                nouns: 명사만 추출
                morphs: 모든 품사의 형태소 추출
                NNP: 고유명사만 추출
                NNG: 일반명사만 추출
        """
        self.tagger = tagger
        self.tag = tag

    def load_mapping(self, path='./user_words/word_mapping.txt'):
        """
        버락 오바마와 오바마를 같은 단어로 인식하기 위한 단어 매핑들 저장

        Args:
            path: '단어_단어' 형태의 txt 경로
        Returns:
            words_dict: 매핑할 단어들 딕셔너리
        """
        with open(path, 'r', encoding='UTF8') as f:
            words_dict = list(map(lambda y: y.split('_'), list(set(map(lambda x: x.strip('\n').strip(), f.readlines())) - {''})))
            words_dict = {words_[0]: words_[1] for words_ in words_dict}
        return words_dict

    def load_filtering(self, path='./user_words/word_filtering.txt'):
        """
        불필요한 단어나 너무 제너럴한 단어(한국) 을 제외시키기 위한 단어들 저장

        Args:
            add_filter: 추가할 단어 집합
            save_path: 집합 저장경로
        """
        with open(path, 'r', encoding='UTF8') as f:
            words = set(map(lambda x: x.strip('\n').strip(), f.readlines())) - {''}
        return words

    def __call__(self, sent: str, user_words_path: str = './user_words') -> List[str]:
        """
        mecab을 이용해 tag 종류에 따라 tokenize를 한 뒤에 mapping & filtering
        Args:
            sent: 원본 문장

        Returns: tokenize 된 문장

        """
        if self.tag == 'nouns': # 명사만
            word_tokens = self.tagger.nouns(sent)
        elif self.tag == 'morphs': # 전체 다
            word_tokens = self.tagger.morphs(sent)
        elif isinstance(self.tag, tuple): # 세부적으로 pos 지칭한 것만 추출
            word_tokens = list(map(lambda x: x[0], filter(lambda x: x[1] in self.tag, self.tagger.pos(sent))))
        else:
            raise Exception('keyerror')
        # result = [word for word in word_tokens if len(word) > 1]
        result = word_tokens
        user_words_path = Path(user_words_path)
        filtering = self.load_filtering(str(user_words_path / 'word_filtering.txt'))
        mapping = self.load_mapping(str(user_words_path / 'word_mapping.txt'))

        def func(x):
            if x in mapping:
                return mapping[x]
            return x

        result = list(map(func, result))
        result = list(filter(lambda x: x not in filtering, result))
        return result

if __name__ == '__main__':
    tokenizer = CustomTokenizer(Mecab())
    print(tokenizer('야구, 농구, 축구, 배구를 했다.'))

    ##
    tokenizer.add_mapping(
        {
            '안치호': '치호',
            '양의동': '동'
        }
    )

    ##
    with open('./user_words/word_mapping.pkl', 'rb') as f:
        my_dict = pickle.load(f)
    print(my_dict)

    ##
    tokenizer.add_filtering(
        {
            '양의동', '김서현'
        }
    )

    ##
    with open('./user_words/word_filtering.pkl', 'rb') as f:
        my_dict = pickle.load(f)
    print(my_dict)

    ##
    df = pd.read_csv('./newsData/Naver.csv', index_col=0)
    print(tokenizer(df.loc[23, 'contents']))
