const fs = require('fs');
const path = require('path');
const { marked } = require('marked');

// Configure marked
marked.setOptions({
  gfm: true,
  breaks: true,
});

// Guide metadata
const guides = [
  { id: 'chenghuangge', fileName: 'guides/杭州景点/城隍阁.md', title: '城隍阁', category: '杭州景点', location: '杭州', description: '城隍阁景区位于吴山之巅，是杭州的标志性建筑之一。登阁可俯瞰西湖全景和杭城美景。' },
  { id: 'leifengta', fileName: 'guides/杭州景点/雷峰塔.md', title: '雷峰塔', category: '杭州景点', location: '杭州', description: '雷峰塔位于西湖南岸，因白娘子传说而闻名。现塔为2002年重建，融合了现代科技与古典美学。' },
  { id: 'feilaifeng', fileName: 'guides/杭州景点/飞来峰.md', title: '飞来峰', category: '杭州景点', location: '杭州', description: '飞来峰位于灵隐寺旁，以石窟造像和摩崖石刻著称，是中国南方古代石窟艺术的瑰宝。' },
  { id: 'huxueyanguju', fileName: 'guides/杭州景点/胡雪岩故居.md', title: '胡雪岩故居', category: '杭州景点', location: '杭州', description: '胡雪岩故居是清末红顶商人胡雪岩的宅邸，展现了晚清江南豪宅的建筑风格和商业文化。' },
  { id: 'zhuozhengyuan', fileName: 'guides/苏州园林/拙政园.md', title: '拙政园', category: '苏州园林', location: '苏州', description: '拙政园是中国四大名园之一，以水景见长，是江南古典园林的代表作品。' },
  { id: 'shizilin', fileName: 'guides/苏州园林/狮子林.md', title: '狮子林', category: '苏州园林', location: '苏州', description: '狮子林以假山著称，园内石峰林立，形态各异，宛如群狮起舞。' },
  { id: 'xiaolianzhuan', fileName: 'guides/湖州景点/小莲庄.md', title: '小莲庄', category: '湖州景点', location: '湖州', description: '小莲庄是清末光禄大夫刘镛的私家园林，以荷花池和家族祠堂闻名。' },
  { id: 'zhangshimingjiuzhai', fileName: 'guides/湖州景点/张石铭旧宅.md', title: '张石铭旧宅', category: '湖州景点', location: '湖州', description: '张石铭旧宅是江南罕见的中西合璧建筑群，展现了清末民初的建筑艺术。' },
  { id: 'yuefei', fileName: 'guides/历史人物/岳飞.md', title: '岳飞', category: '历史人物', location: '杭州', description: '南宋抗金名将岳飞的生平事迹，精忠报国的民族英雄。' },
  { id: 'sushi', fileName: 'guides/历史人物/苏轼的一生.md', title: '苏轼的一生', category: '历史人物', location: '杭州', description: '北宋文学家苏轼的传奇人生，诗词书画无所不精的文化巨匠。' },
  { id: 'songhuizong', fileName: 'guides/历史人物/宋徽宗的一生.md', title: '宋徽宗的一生', category: '历史人物', location: '杭州', description: '北宋末代皇帝宋徽宗赵佶的生平，艺术造诣极高却治国无方的悲剧帝王。' },
  { id: 'zhangjingjiang', fileName: 'guides/历史人物/张静江的一生.md', title: '张静江的一生', category: '历史人物', location: '湖州', description: '民国时期著名政治家、实业家张静江的传奇人生。' },
  { id: 'beishangbeishang', fileName: 'guides/文化专题/北上北上.md', title: '北上北上', category: '文化专题', location: '华东', description: '探索华东地区的历史文化脉络和地域特色。' },
  { id: 'fojiao', fileName: 'guides/文化专题/佛教知识.md', title: '佛教知识', category: '文化专题', location: '杭州', description: '佛教文化基础知识，了解佛教在江南地区的传播与影响。' },
];

// Process markdown files
const processedGuides = guides.map(guide => {
  const filePath = path.join(__dirname, '..', guide.fileName);
  
  try {
    if (fs.existsSync(filePath)) {
      const markdown = fs.readFileSync(filePath, 'utf-8');
      const html = marked.parse(markdown);
      
      return {
        ...guide,
        content: html,
      };
    } else {
      console.warn(`Warning: File not found - ${guide.fileName}`);
      return {
        ...guide,
        content: `<p>文件 ${guide.fileName} 未找到</p>`,
      };
    }
  } catch (error) {
    console.error(`Error processing ${guide.fileName}:`, error);
    return {
      ...guide,
      content: `<p>处理文件 ${guide.fileName} 时出错</p>`,
    };
  }
});

// Generate TypeScript file
const outputContent = `// This file is auto-generated. Do not edit manually.
import { Guide } from '@/types/guide'

export const guideData: Guide[] = ${JSON.stringify(processedGuides, null, 2)}
`;

const outputPath = path.join(__dirname, '..', 'src', 'data', 'guides.ts');
fs.writeFileSync(outputPath, outputContent, 'utf-8');

console.log(`✅ Processed ${processedGuides.length} guide files`);
console.log(`📝 Output written to ${outputPath}`);
