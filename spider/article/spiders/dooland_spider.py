# -*- coding: utf-8 -*-

from scrapy.utils.url import urljoin_rfc
from scrapy.spiders import CrawlSpider, Rule
from scrapy.selector import Selector
from scrapy.http import Request
from scrapy.linkextractors import LinkExtractor as sle
# from scrapy.linkextractors.sgml import SgmlLinkExtractor as sle

from article.items import ArticleItem


class DoolandSpider(CrawlSpider):
    name = "dooland"
    # 减慢爬取速度 为1s
    # download_delay = 1
    allowed_domains = ["dooland.com"]
    start_urls = [
        "http://southpeople.dooland.com",
        'http://beijingjishi.dooland.com',
        'http://dutianxia.dooland.com',
        'http://ybtx.dooland.com',
        'http://blogweekly.dooland.com',
        'http://hxly.dooland.com',
        'http://lysj.dooland.com',

        'http://redoo.dooland.com',
        'http://yfdj.dooland.com',
        'http://travel.dooland.com',
        'http://dianying.dooland.com',
        'http://kxzy.dooland.com',
        'http://xinjiang.dooland.com',


        'http://lifeweeker.dooland.com',
        'http://aomi.dooland.com',
        'http://bkzs.dooland.com',
        'http://xsgx.dooland.com',
        'http://zhongguoshuhua.dooland.com',
        'http://blqs.dooland.com',

        'http://zgxb.dooland.com',
        'http://wsbl.dooland.com',
        'http://kanshijie.dooland.com',
        'http://vistastory.dooland.com',
        'http://zhongguoxinwenzhoukan.dooland.com',
        'http://blqs.dooland.com',
        # 'http://www.dooland.com/magazine/article_22540.html'
    ]

    rules = [ 
        Rule(sle(allow=('/magazine/article_\d*\.html'),restrict_xpaths=('//*[@class="jx_Article"]')),callback='parse_details',follow=True),
        Rule(sle(allow=('/magazine/\d*'),restrict_xpaths=('//*[@class="past-mag margin_top12"]')),callback='parse_list',follow=True),
         
        # 分页
        Rule(sle(allow=(),restrict_xpaths=('//*[@id="page"]')),callback='parse_pages',follow=True)
    ]

    # 所有期次杂志的url list
    def parse_pages(self, response):
        item_urls = []
        for sel in response.xpath('//*[@id="top2"]/div/ul/li/div[1]'):
            item_url = ArticleItem()
            item_url['url'] = sel.xpath('a/@href').extract()[0]
            item_urls.append(item_url)
            # yield item_url
        for item_url in item_urls:
            yield Request(item_url['url'], callback=self.parse_list)

    # 某一期 所有文章url list
    def parse_list(self, response):
        items = []
        # print '(abc)'+response.url
        for sel in response.xpath('//*[@class="jx_Article"]/ul/li/h2'):
            item = ArticleItem()
            item['url'] = 'http://www.dooland.com/magazine/' + sel.xpath('a/@href').extract()[0].strip()
            # item['title'] = sel.xpath('a/@title').extract()[0].strip() 
            items.append(item) 
            # print '(def)'
        
        for item in items:
            # yield Request(item['url'],meta={'item': item}, callback=self.parse_details)
            yield Request(item['url'],callback=self.parse_details)
       

    # 文章详情
    def parse_details(self, response):
    # def parse(self, response):
         
        item = ArticleItem() 
        sel=Selector(response)
        item['url'] = response.url
        item['title'] = sel.xpath('//*[@class="title"]/div/h1/text()').extract()[0].strip() 
        item['content'] = sel.xpath('//*[@id="article"]/div').extract()[0]

        item['source'] = sel.xpath('//*[@id="main"]/aside/section[1]/h3/text()').extract()[0].split( )[0]
        item['issue'] = sel.xpath('//*[@id="main"]/aside/section[1]/h3/text()').extract()[0].split( )[1]

        # TODO 来源ID
        item['source_id'] = ''
        item['author'] = ''
        
        return item

SPIDER = DoolandSpider()
