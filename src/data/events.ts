export type EventStatus = '筹备中' | '售票中' | '进行中' | '已结束' | '待定';

export interface TouhouEvent {
  id: number;
  title: string;
  date: string;
  location: string;
  status: EventStatus;
  image: string;
  description: string;
  link?: string;
}

/** 活动档案：内容集中维护，组件只负责展示和交互。 */
export const events: TouhouEvent[] = [
  {
    id: 1,
    title: '山东东方高校联合例会-齐鲁幻聚01',
    date: '2025年12月20日',
    location: '济南',
    status: '已结束',
    image: '/posters/qlhj01.webp',
    description: '山东东方高校联合会12月例会。\n群聊：977015593 \n 活动视频：\n东方赛马：https://www.bilibili.com/video/BV1jhB7BzEoo/\n[自由舞台]月兔DJ：https://www.bilibili.com/video/BV184BEBwEVK',
    link: 'https://touhou.market/main/events/320'
  },
  {
    id: 2,
    title: '山东东方高校联合例会-齐鲁幻聚02',
    date: '2027年1月1日',
    location: '青岛',
    status: '筹备中',
    image: '/posters/qlhj02.webp',
    description: '山东东方高校联合会1月例会。\n群聊：977015593',
    link: 'https://touhou.market/main/events/543'
  }
];
