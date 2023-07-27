// import {JSONHeader} from '../../src/code/util';

let axios = require('axios');
let fs = require('fs');
let path = require('path');
let moment = require('moment');
let date = moment().valueOf();

axios.post(
  'http://www.iwencai.com/gateway/urp/v7/landing/getDataList',
  new URLSearchParams({
    'query': '沪深300权重',
    'urp_sort_way': 'desc',
    'urp_sort_index': '沪深300个股权重',
    'page': 1,
    'perpage': 100,
    'addheaderindexes': '',
    'condition': JSON.stringify([{
      'chunkedResult': '沪深300指数成分股权重、行业、市净率、市值',
      'opName': 'and',
      'opProperty': '',
      'sonSize': 8,
      'relatedSize': 0
    }, {
      'indexName': '所属指数类',
      'indexProperties': ['包含沪深300'],
      'valueType': '_所属指数类',
      'domain': 'abs_股票领域',
      'uiText': '所属指数类是沪深300指数',
      'sonSize': 0,
      'queryText': '所属指数类是沪深300指数',
      'relatedSize': 0,
      'source': 'new_parser',
      'tag': '所属指数类',
      'type': 'index',
      'indexPropertiesMap': {'包含': '沪深300'}
    }, {'opName': 'and', 'opProperty': '', 'sonSize': 6, 'relatedSize': 0}, {
      'indexName': '沪深300个股权重',
      'indexProperties': [],
      'source': 'new_parser',
      'type': 'index',
      'indexPropertiesMap': {},
      'reportType': 'null',
      'valueType': '_浮点型数值',
      'domain': 'abs_股票领域',
      'uiText': '沪深300个股权重',
      'sonSize': 0,
      'queryText': '沪深300个股权重',
      'relatedSize': 0,
      'tag': '沪深300个股权重'
    }, {'opName': 'and', 'opProperty': '', 'sonSize': 4, 'relatedSize': 0}, {
      'indexName': '所属同花顺行业',
      'indexProperties': [],
      'source': 'new_parser',
      'type': 'index',
      'indexPropertiesMap': {},
      'reportType': 'null',
      'valueType': '_所属同花顺行业',
      'domain': 'abs_股票领域',
      'uiText': '所属同花顺行业',
      'sonSize': 0,
      'queryText': '所属同花顺行业',
      'relatedSize': 0,
      'tag': '所属同花顺行业'
    }, {'opName': 'and', 'opProperty': '', 'sonSize': 2, 'relatedSize': 0}, {
      'indexName': '市净率(pb)',
      'indexProperties': ['nodate 1', '交易日期 20230721'],
      'source': 'new_parser',
      'type': 'index',
      'indexPropertiesMap': {'交易日期': '20230721', 'nodate': '1'},
      'reportType': 'TRADE_DAILY',
      'dateType': '交易日期',
      'valueType': '_浮点型数值(倍)',
      'domain': 'abs_股票领域',
      'uiText': '市净率(pb)',
      'sonSize': 0,
      'queryText': '市净率(pb)',
      'relatedSize': 0,
      'tag': '市净率(pb)'
    }, {
      'indexName': '总市值',
      'indexProperties': ['nodate 1', '交易日期 20230721'],
      'source': 'new_parser',
      'type': 'index',
      'indexPropertiesMap': {'交易日期': '20230721', 'nodate': '1'},
      'reportType': 'TRADE_DAILY',
      'dateType': '交易日期',
      'valueType': '_浮点型数值(元|港元|美元|英镑)',
      'domain': 'abs_股票领域',
      'uiText': '总市值',
      'sonSize': 0,
      'queryText': '总市值',
      'relatedSize': 0,
      'tag': '总市值'
    }]),
    'codelist': '',
    'indexnamelimit': '',
    'logid': '4d12c478020d33506077331e34324b66',
    'ret': 'json_all',
    'sessionid': '4d12c478020d33506077331e34324b66',
    'source': 'Ths_iwencai_Xuangu',
    'date_range[0]': '20230719',
    'iwc_token': '0ac9665416897368747795088',
    'urp_use_sort': '1',
    'user_id': 'Ths_iwencai_Xuangu_k5txqqznnm3r6fa394e2kjdxjardj338',
    'uuids[0]': '24087',
    'query_type': 'stock',
    'comp_id': '6734520',
    'business_cat': 'soniu',
    'uuid': '24087'
  }).toString(),

  // 'query=%E6%B2%AA%E6%B7%B1300%E6%9D%83%E9%87%8D&urp_sort_way=desc&urp_sort_index=%E6%B2%AA%E6%B7%B1300%E4%B8%AA%E8%82%A1%E6%9D%83%E9%87%8D&page=1&perpage=100&addheaderindexes=&condition=%5B%7B%22indexName%22%3A%22%E6%B2%AA%E6%B7%B1300%E4%B8%AA%E8%82%A1%E6%9D%83%E9%87%8D%22%2C%22indexProperties%22%3A%5B%5D%2C%22source%22%3A%22new_parser%22%2C%22type%22%3A%22index%22%2C%22indexPropertiesMap%22%3A%7B%7D%2C%22reportType%22%3A%22null%22%2C%22chunkedResult%22%3A%22%E6%B2%AA%E6%B7%B1300%E6%9D%83%E9%87%8D%22%2C%22valueType%22%3A%22_%E6%B5%AE%E7%82%B9%E5%9E%8B%E6%95%B0%E5%80%BC%22%2C%22domain%22%3A%22abs_%E8%82%A1%E7%A5%A8%E9%A2%86%E5%9F%9F%22%2C%22uiText%22%3A%22%E6%B2%AA%E6%B7%B1300%E4%B8%AA%E8%82%A1%E6%9D%83%E9%87%8D%22%2C%22sonSize%22%3A0%2C%22queryText%22%3A%22%E6%B2%AA%E6%B7%B1300%E4%B8%AA%E8%82%A1%E6%9D%83%E9%87%8D%22%2C%22relatedSize%22%3A0%2C%22tag%22%3A%22%E6%B2%AA%E6%B7%B1300%E4%B8%AA%E8%82%A1%E6%9D%83%E9%87%8D%22%7D%5D&codelist=&indexnamelimit=&logid=4d12c478020d33506077331e34324b66&ret=json_all&sessionid=4d12c478020d33506077331e34324b66&source=Ths_iwencai_Xuangu&date_range%5B0%5D=20230719&iwc_token=0ac9665416897368747795088&urp_use_sort=1&user_id=Ths_iwencai_Xuangu_k5txqqznnm3r6fa394e2kjdxjardj338&uuids%5B0%5D=24087&query_type=stock&comp_id=6734520&business_cat=soniu&uuid=24087',
  {
    headers: {
      // 'Cookie': 'other_uid=Ths_iwencai_Xuangu_k5txqqznnm3r6fa394e2kjdxjardj338; ta_random_userid=rlkgyn255m; cid=0be191494e7e2b927a6078d9578559a11677074607; v=Ay3v7Jn4NTsILtHXiREnqIA_PMKiimGE67_FFG8ya58z3UM8N9pxLHsO1RH8',
      // 'Hexin-V': 'Ay3v7Jn4NTsILtHXiREnqIA_PMKiimGE67_FFG8ya58z3UM8N9pxLHsO1RH8',
      // 'Origin': 'http://www.iwencai.com',
      // 'Host': 'www.iwencai.com',
      // 'Referer': 'http://www.iwencai.com/unifiedwap/result?w=%E6%B2%AA%E6%B7%B1300%E6%9D%83%E9%87%8D&querytype=stock',

    }
  }
).then(res => {
  console.log(JSON.stringify(res.data.answer.components[0].data));
});