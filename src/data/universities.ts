export interface ContactInfo {
  qqGroup?: string;
  qrCode?: string;
  description?: string;
}

export interface University {
  id: number;
  name: string;
  logo: string;
  contact: ContactInfo;
}

export const universities: University[] = [
  {
    id: 1,
    name: '山东大学',
    logo: '/logos/sdu.webp',
    contact: { qqGroup: '186295950', description: '★山东大学♪幻想浮世伊行★  \n 蓬莱清辉学海浮幻想，灵山风起浩然行世伊' }
  },
  {
    id: 2,
    name: '山东大学（威海）',
    logo: '/logos/sduwh.webp',
    contact: { qqGroup: '908978336', description: '崴车万同好会' }
  },
  {
    id: 3,
    name: '山东理工大学',
    logo: '/logos/sdut.webp',
    contact: { qqGroup: '982212088' }
  },
  {
    id: 4,
    name: '山东中医药大学',
    logo: '/logos/sdutcm.webp',
    contact: { qqGroup: '917763620' }
  },
  {
    id: 5,
    name: '山东医药大学',
    logo: '/logos/sum.webp',
    contact: { qqGroup: '1030282692' }
  },
  {
    id: 6,
    name: '山东建筑大学',
    logo: '/logos/sdjzu.webp',
    contact: { qqGroup: '579042420', description: '济南山童联合协会' }
  },
  {
    id: 7,
    name: '山东体育学院',
    logo: '/logos/sdpei.webp',
    contact: { qqGroup: '871721412' }
  },
  {
    id: 8,
    name: '山东交通学院',
    logo: '/logos/sdjtu.webp',
    contact: { qqGroup: '937924293' }
  },
  {
    id: 9,
    name: '山东青年政治学院',
    logo: '/logos/sdyu.webp',
    contact: { qqGroup: '659598919' }
  },
  {
    id: 10,
    name: '山东师范大学',
    logo: '/logos/sdnu.webp',
    contact: { qqGroup: '743070412' }
  },
  {
    id: 11,
    name: '山东管理学院',
    logo: '/logos/smu.webp',
    contact: { qqGroup: '1070267383' ,description:'山东管理学院东方同好会'}
  },
  {
    id: 12,
    name: '齐鲁工业大学',
    logo: '/logos/qlu.webp',
    contact: { qqGroup: '1021423802' }
  },
  {
    id: 13,
    name: '山东艺术学院',
    logo: '/logos/sdca.webp',
    contact: { qqGroup: '596762256' }
  },
  {
    id: 14,
    name: '中国石油大学（华东）',
    logo: '/logos/UPC.webp',
    contact: { qqGroup: '631941461' }
  },
  {
    id: 15,
    name: '哈尔滨工业大学（威海）',
    logo: '/logos/hitwith.webp',
    contact: { qqGroup: '196208810' ,description:'梦环翠海　～　哈尔滨工业大学（威海）东方同好会'}
  },
  {
    id: 16,
    name: '山东石油化工学院',
    logo: '/logos/sdipct.webp',
    contact: { qqGroup: '644182264' ,description:'曾经的石油大学胜利学院，石油大学是我们的亲爹'}
  },
  {
    id: 17,
    name: '济南大学',
    logo: '/logos/ujn.webp',
    contact: { qqGroup: '856370052' }
  },
  {
    id: 18,
    name: '枣庄学院',
    logo: '/logos/uzz.webp',
    contact: { qqGroup: '852282759' }
  },
  {
    id: 19,
    name: '东营科技职业学院',
    logo: '/logos/dykj.webp',
    contact: { qqGroup: '112864654' }
  },
  {
    id: 20,
    name: '聊城大学',
    logo: '/logos/lcu.webp',
    contact: { qqGroup: '514756242',description:"水城烟波泛古槎，\n光岳楼前绽梦家。\n星曳御柱临幽境，\n月照博丽映京华。" }
  },
  {
    id: 21,
    name: '烟台大学',
    logo: '/logos/ytu.webp',
    contact: { qqGroup: '1007450236' }
  },
   {
    id: 22,
    name: '鲁东大学',
    logo: '/logos/ldu.webp',
    contact: { qqGroup: '1071013231' }
  },
  {
    id: 23,
    name: '齐鲁理工学院',
    logo: '/logos/qiot.webp',
    contact: { qqGroup: '1011030824' }
  },
  {
    id: 24,
    name: '枣庄职业学院',
    logo: '/logos/zvc.webp',
    contact: { qqGroup: '1020621071' }
  },
  {
    id: 25,
    name: '青岛农业大学',
    logo: '/logos/qau.webp',
    contact: { qqGroup: '815491041' }
  },
  {
    id: 26,
    name: '添加你的学校',
    logo: '/logos/more.webp',
    contact: { qqGroup: '977015593', description: '请加入山高联群聊私信管理员添加' }
  },
];
