<template>
  <div class="root">
    {{ test }}
  </div>
</template>

<script>

import axios from 'axios';
export default {
  data(){
    return {
      test: '测试'
    };
  },
  mounted(){
    axios.post('/gateway/urp/v7/landing/getDataList', {
      method: 'post',
      data:   new URLSearchParams({
        'query': ' 沪深300权重',
        'urp_sort_way': ' desc',
        'urp_sort_index': ' 沪深300个股权重',
        'page': ' 1',
        'perpage': ' 100',
        'addheaderindexes': '',
        'condition': [{'indexName':'沪深300个股权重', 'indexProperties':[], 'source':'new_parser', 'type':'index', 'indexPropertiesMap':{}, 'reportType':'null', 'chunkedResult':'沪深300权重', 'valueType':'_浮点型数值', 'domain':'abs_股票领域', 'uiText':'沪深300个股权重', 'sonSize':0, 'queryText':'沪深300个股权重', 'relatedSize':0, 'tag':'沪深300个股权重'}],
        'codelist': '',
        'indexnamelimit': '',
        'logid': ' 4d12c478020d33506077331e34324b66',
        'ret': ' json_all',
        'sessionid': ' 4d12c478020d33506077331e34324b66',
        'source': ' Ths_iwencai_Xuangu',
        'date_range[0]': ' 20230719',
        'iwc_token': ' 0ac9665416897368747795088',
        'urp_use_sort': ' 1',
        'user_id': ' Ths_iwencai_Xuangu_k5txqqznnm3r6fa394e2kjdxjardj338',
        'uuids[0]': ' 24087',
        'query_type': ' stock',
        'comp_id': ' 6734520',
        'business_cat': ' soniu',
        'uuid': ' 24087'
      }),
      headers:{
        'Content-Type': 'application/x-www-form-urlencoded',
        'Cookie': 'other_uid=Ths_iwencai_Xuangu_k5txqqznnm3r6fa394e2kjdxjardj338; ta_random_userid=rlkgyn255m; cid=0be191494e7e2b927a6078d9578559a11677074607; v=Ay3v7Jn4NTsILtHXiREnqIA_PMKiimGE67_FFG8ya58z3UM8N9pxLHsO1RH8',
        'Hexin-V': 'Ay3v7Jn4NTsILtHXiREnqIA_PMKiimGE67_FFG8ya58z3UM8N9pxLHsO1RH8',
        'Origin': 'http://www.iwencai.com',
        'Host': 'www.iwencai.com',
        'Referer': 'http://www.iwencai.com/unifiedwap/result?w=%E6%B2%AA%E6%B7%B1300%E6%9D%83%E9%87%8D&querytype=stock',

      }
    }
    ).then(res=>{
      console.log(res.data);
    });

  }
};
</script>

<style>
.chart{
  width: 100%;
  height: 500px;
}
</style>

