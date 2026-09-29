export const profile = {
  name: '闵灿',
  latin: 'MIN CAN',
  roles: ['环境艺术设计', '视觉艺术设计', '概念艺术设计'],
  tagline: '空间是叙事的载体，视觉是情绪的语法。',
  lede:
    '环境艺术设计硕士在读。兴趣从画画、游戏与为喜欢的作品做延伸创作开始，六年间把它带进室内、建筑、景观与数字孪生——擅长把想法从概念推到建模、效果图与完整方案本。',
  location: '湖北 · 武汉',
  hometown: '湖北 · 咸宁',
  email: '1422730241@qq.com',
  phone: '+86 151 7272 0275',
  phoneHref: 'tel:+8615172720275',
  wechat: 'Renesmee0206',
  wechatQr: '/media/wechat-qr.png',
  status: '硕士在读 · 可实习',
  intent: '设计师 · 武汉 · 随时到岗',
}

export const heroStats = [
  { value: '20+', unit: '项', label: '项目经历' },
  { value: '30+', unit: '项', label: '竞赛获奖' },
  { value: '3.8', unit: '/4', label: '硕士绩点' },
  { value: '06', unit: '年', label: '设计训练' },
]

export const aboutStats = [
  { value: '20+', label: '项目经历', note: '2024.09 — 2026.06' },
  { value: '30+', label: '竞赛获奖', note: '国家级 / 省级' },
  { value: '3.8', label: '绩点 (满分 4)', note: '专业排名前 20%' },
  { value: '6', label: '年设计训练', note: '本科 + 硕士' },
]

export const education = [
  {
    period: '2024.09 — 2027.07',
    org: '湖北美术学院',
    title: '环境艺术设计 · 硕士',
    desc: '绩点 3.8 / 4，专业排名前 20%；连续两年获研究生学业奖学金。',
    current: true,
  },
  {
    period: '2020.09 — 2024.07',
    org: '湖北美术学院',
    title: '环境设计 · 本科',
    desc: '室内设计方向，完成材料构造、空间表达与手绘表现的系统训练。',
  },
]

export const experience = [
  {
    period: '2026.04 — 2026.06',
    org: '北京 DAMU 建筑事务所',
    title: '海南黎染美术馆 · 设计师',
    desc: '建模反复推敲空间尺度与比例关系，制作 1:80 手工艺术木模型，还原场地地貌、建筑形态与设计意图。',
  },
  {
    period: '2025.12 — 2026.03',
    org: '黑龙江省绥芬河市政府',
    title: '园林绿色规划 · 设计师',
    desc: '完成设计概念的提炼与表达，借助 AI 工具绘制效果图，并独立完成方案本的排版与编排。',
  },
  {
    period: '2024.11 — 2025.05',
    org: '湖北省内荆河农业科技开发有限公司',
    title: '景观规划设计 · 设计师',
    desc: '负责前期场地周边信息梳理、现场实地考察、模型重建、节点设计、效果图制作与方案本产出。',
  },
  {
    period: '2024.11 — 2025.04',
    org: '武汉理工大学',
    title: '新疆水坝智能工程管理数字孪生 · 设计师',
    desc: '依据大坝工程图纸、地形测绘数据与设计参数，独立完成大坝及周边环境的高精度三维数字孪生建模；制作效果图呈现建成后的外观形态、结构细节与自然景观的融合；协调 Unity 团队完成 web 端模拟与实时数据接入，指导多软件端口的美化处理。',
  },
  {
    period: '2024.09 — 2024.12',
    org: '中南设计院',
    title: '《荆楚派建筑设计指南》· 撰写编排',
    desc: '搜集相关案例，深入分析荆楚建筑的特点，提炼核心内容，完成文案撰写与排版汇总。',
  },
]

export const awards = [
  { year: '2026.09', name: '《海上生明月 — 爱达 · 望舒号》', award: '第二届「邮轮来了」大型邮轮创新创意大赛 · 铜奖' },
  { year: '2026.03', name: '《积稻市廊 — 存量空间下的轻介入织补设计》', award: '中国室内设计大赛学院杯 · 乡村振兴优秀设计奖' },
  { year: '2025.12', name: '《方寸寰宇》装置', award: '中国美协「心境空间构筑和谐」空间艺术构造展览 · 二等奖' },
  { year: '2025.11', name: '《偏 · 衍》', award: '老韩煸鸡校企合作竞赛 · 二等奖' },
  { year: '2025.10', name: '《篱下容 · 文化馆 — 黄花涝古镇小说原址改造》', award: '大学生创新创业训练项目 · 省级结项' },
  { year: '2025.03', name: '《寻根与再生 — 红钢城社区改造之跨代共存设计》', award: '亚洲大学生创意设计展 · 两项三等奖' },
  { year: '2024.04', name: '研究生学业奖学金', award: '湖北美术学院 · 连续两年' },
]

/**
 * 精选项目
 * 顺序：矩以构 → 映岳·叠景 → 邮轮来了 → 海南黎染美术馆 → 新疆大坝 → 积稻市廊
 * （大坝按你的要求放在倒数第二个）
 * 主图 = 作品集里写了项目名称的那一页；detail = 紧随其后的页面。
 * video 会插在主图之后，作为点击后的第 2 页。
 */
export const projects = [
  {
    index: '01',
    id: 'p-juyi',
    title: '矩以构 · 聚以生',
    subtitle: 'Modular Scaffold Public Space',
    org: '中国美术家协会「为中国而设计」第十二届环境艺术设计展览',
    period: '2026.08',
    role: '概念设计 / 模块化构造',
    tags: ['公共空间', '模块化', '装配式', '可逆建造'],
    desc:
      '以盘扣式脚手架为结构骨架，把公共空间拆成一组可组装的标准模块：双层复合功能平台承载观演、停留与聚会，文化休闲模块提供交流与休憩，模块化餐饮单元与展售一体模块支撑临时市集，螺旋薄纱幕帘则沿结构攀升、围合出向上的形态。所有模块以卡扣固定在杆件上，实现装配化、可逆化安装——用完可以完整拆走，留下的是一套可复用构件，而不是一次性的展台。',
    image: '/media/p-01.webp',
    video: '/media/video-juyi.mp4',
    detail: [
      '/media/d-01-1.webp',
      '/media/d-01-2.webp',
      '/media/d-01-3.webp',
      '/media/d-01-4.webp',
      '/media/d-01-5.webp',
      '/media/d-01-6.webp',
      '/media/d-01-7.webp',
    ],
  },
  {
    index: '02',
    id: 'p-yingyue',
    title: '映岳 · 叠景 — 天地之中的邻里共栖地',
    subtitle: 'Terrace Neighbourhood',
    org: '第八届中联杯 · 国际大学生建筑设计竞赛',
    period: '2026.06',
    role: '方案设计 / 效果图表达',
    tags: ['邻里中心', '山地语境', '立体景观'],
    desc:
      '场地正对山体，方案以「映岳」回应远山、以「叠景」组织竖向：底层架空留出连续的城市界面与商业活力，上部用通透的玻璃盒与半透明幕帘削弱体量，屋面被拉成一条连续的公共步道与彩色跑道，让街道 — 檐下 — 屋面形成层次递进的邻里生活。',
    image: '/media/p-02.webp',
    video: '',
    detail: [
      '/media/d-02-1.webp',
      '/media/d-02-2.webp',
      '/media/d-02-3.webp',
      '/media/d-02-4.webp',
      '/media/d-02-5.webp',
      '/media/d-02-6.webp',
      '/media/d-02-7.webp',
    ],
  },
  {
    index: '03',
    id: 'p-cruise',
    title: '《海上生明月 — 爱达 · 望舒号》',
    subtitle: 'Cruise Livery & Deck',
    org: '第二届「邮轮来了」大型邮轮创新创意大赛 · 铜奖',
    period: '2026.07',
    role: '主题涂装 / 甲板空间',
    tags: ['邮轮涂装', '主题叙事', '夜景照明'],
    desc:
      '「海上生明月」——爱达 · 望舒号的涂装与甲板空间设计。从月亮、海浪、海豚、星云与东方建筑元素中提取图形，形成深邃蓝、流光金、新月白三色方案并落到船体涂装上；甲板空间延续同一套语汇，用月相灯亭、睡莲池灯与张拉膜构筑出可以停留的观景序列，日景与夜景各自成立。',
    image: '/media/p-03.webp',
    video: '/media/video-cruise.mp4',
    detail: [
      '/media/d-03-1.webp',
      '/media/d-03-2.webp',
      '/media/d-03-3.webp',
      '/media/d-03-4.webp',
      '/media/d-03-5.webp',
      '/media/d-03-6.webp',
    ],
  },
  {
    index: '04',
    id: 'p-museum',
    title: '海南黎染美术馆',
    subtitle: 'Li-Dye Art Museum',
    org: '北京 DAMU 建筑事务所',
    period: '2026.04 — 2026.06',
    role: '建筑方案 / 1:80 手工木模型',
    tags: ['美术馆', '在地文化', '实体模型'],
    desc:
      '以海南黎族染织工艺为线索，把美术馆放在山林与既有砖瓦民居之间：主体是架空的长条白色体量，用穿孔表皮过滤热带阳光，底层保持通透，让院落、展线与人流在坡地之间穿行。设计过程中以建模反复推敲空间尺度与比例，并制作 1:80 手工艺术木模型，还原场地地貌、建筑形态与设计意图。',
    image: '/media/p-04.webp',
    video: '',
    detail: [
      '/media/d-04-1.webp',
      '/media/d-04-2.webp',
      '/media/d-04-3.webp',
      '/media/d-04-4.webp',
      '/media/d-04-5.webp',
    ],
  },
  {
    index: '05',
    id: 'p-dam',
    title: '新疆水坝智能工程管理数字孪生',
    subtitle: 'Dam Digital Twin',
    org: '武汉理工大学',
    period: '2024.11 — 2025.04',
    role: '数字孪生 / 三维可视化',
    tags: ['数字孪生', '三维建模', '实时数据'],
    desc:
      '依据大坝工程图纸、地形测绘数据与设计参数，独立完成大坝及周边环境的高精度三维建模，输出用于呈现建成形态、结构细节与自然景观融合的效果图；并协调 Unity 团队完成 web 端模拟与实时数据接入，把数据总览、实时监控的可视化界面一并落地。',
    image: '/media/p-05.webp',
    video: '',
    detail: ['/media/d-05-1.webp', '/media/d-05-2.webp', '/media/d-05-3.webp'],
  },
  {
    index: '06',
    id: 'p-jidao',
    title: '积稻市廊 — 存量空间下的轻介入织补设计',
    subtitle: 'Light Intervention Weaving',
    org: '中国室内设计大赛学院杯 · 乡村振兴优秀设计奖',
    period: '2026.03',
    role: '室内设计 / 空间叙事',
    tags: ['存量更新', '轻介入', '乡村市集'],
    desc:
      '以「织补」为策略，把闲置的存量空间改造成可以停留的市集廊道：轻钢与格栅构成可拆卸的骨架，在不改动原有结构的前提下插入展销、餐饮与休憩节点；木构节奏、光影序列与人的行为被组织成一条连续的叙事动线。',
    image: '/media/p-06.webp',
    video: '',
    detail: ['/media/d-06-1.webp', '/media/d-06-2.webp'],
  },
]

/** 成果集锦 —— 每张都挂在某个项目上，点一下回到对应项目 */
export const gallery = [
  { src: '/media/g-01.webp', caption: '大坝数字孪生 · 库区观景台', project: 'p-dam' },
  { src: '/media/g-02.webp', caption: '矩以构 · 聚以生 — 结构拆解', project: 'p-juyi' },
  { src: '/media/g-03.webp', caption: '矩以构 · 聚以生 — 构造大样', project: 'p-juyi' },
  { src: '/media/g-04.webp', caption: '映岳 · 叠景 — 屋面跑道', project: 'p-yingyue' },
  { src: '/media/g-05.webp', caption: '海上生明月 · 夜航远景', project: 'p-cruise' },
  { src: '/media/g-06.webp', caption: '爱达 · 望舒号 — 甲板白昼', project: 'p-cruise' },
  { src: '/media/g-07.webp', caption: '海南黎染美术馆 — 实体模型', project: 'p-museum' },
  { src: '/media/g-08.webp', caption: '积稻市廊 — 廊下光影', project: 'p-jidao' },
]

export const navItems = [
  { id: 'home', label: '首页', en: 'Index' },
  { id: 'about', label: '个人经历', en: 'About' },
  { id: 'projects', label: '精选项目', en: 'Projects' },
  { id: 'contact', label: '联系方式', en: 'Contact' },
]

export const marqueeWords = [
  '数字孪生',
  '模块化建造',
  '邻里共栖',
  '主题涂装',
  '在地文化',
  '存量更新',
  '空间叙事',
  '效果图表达',
]

export const totalSections = navItems.length
