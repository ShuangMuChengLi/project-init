let _ = require('lodash');
let s = `
query: 沪深300权重
urp_sort_way: desc
urp_sort_index: 沪深300个股权重
page: 1
perpage: 100
addheaderindexes:
condition: [{"indexName":"沪深300个股权重","indexProperties":[],"source":"new_parser","type":"index","indexPropertiesMap":{},"reportType":"null","chunkedResult":"沪深300权重","valueType":"_浮点型数值","domain":"abs_股票领域","uiText":"沪深300个股权重","sonSize":0,"queryText":"沪深300个股权重","relatedSize":0,"tag":"沪深300个股权重"}]
codelist:
indexnamelimit:
logid: 4d12c478020d33506077331e34324b66
ret: json_all
sessionid: 4d12c478020d33506077331e34324b66
source: Ths_iwencai_Xuangu
date_range[0]: 20230719
iwc_token: 0ac9665416897368747795088
urp_use_sort: 1
user_id: Ths_iwencai_Xuangu_k5txqqznnm3r6fa394e2kjdxjardj338
uuids[0]: 24087
query_type: stock
comp_id: 6734520
business_cat: soniu
uuid: 24087`;
let list = s.split(/\n/);
let result = {};
for(let item of list){
  let match = item.split(':');
  if(match.length > 1){
    result[match[0]] = _.trim(match[1]);
  }
}
console.log(JSON.stringify(result, '', 2));
