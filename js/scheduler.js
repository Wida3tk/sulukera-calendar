export const DAY = 86400000;

export const PROGRAM_TEMPLATES = {
  ABA: {
    id: "ABA",
    name: "تحليل السلوك التطبيقي",
    kind: "semester",
    description: "4 أسابيع دراسة + أسبوع اختبارات + أسبوع إجازة",
    blocks: [
      { type: "study", label: "أسبوع دراسي", weeks: 4 },
      { type: "exam", label: "أسبوع الاختبارات", weeks: 1 },
      { type: "break", label: "إجازة نهاية الفصل", weeks: 1 },
    ],
  },
  OBM_PRACTITIONER: {
    id: "OBM_PRACTITIONER",
    name: "إدارة السلوك التنظيمي — مسار الممارس",
    kind: "track",
    description: "3 مقررات، مدة كل مقرر أسبوعان",
    blocks: Array.from({ length: 3 }, (_, i) => ({
      type: "course", label: `المقرر ${i + 1}`, weeks: 2, courseNumber: i + 1,
    })),
  },
  OBM_ADVANCED: {
    id: "OBM_ADVANCED",
    name: "إدارة السلوك التنظيمي — المسار المتقدم",
    kind: "track",
    description: "3 مقررات، مدة كل مقرر أسبوعان",
    blocks: Array.from({ length: 3 }, (_, i) => ({
      type: "course", label: `المقرر ${i + 1}`, weeks: 2, courseNumber: i + 1,
    })),
  },
};

export const SAUDI_EVENTS = [
  { id:"founding-2026", name:"يوم التأسيس", start:"2026-02-22", end:"2026-02-22", type:"official_holiday", blocksScheduling:true, status:"confirmed", source:"HRSD" },
  { id:"eid-fitr-2026", name:"إجازة عيد الفطر", start:"2026-03-20", end:"2026-03-23", type:"official_holiday", blocksScheduling:true, status:"confirmed", source:"Umm al-Qura / HRSD" },
  { id:"arafah-2026", name:"يوم عرفة", start:"2026-05-26", end:"2026-05-26", type:"official_holiday", blocksScheduling:true, status:"confirmed", source:"Saudi Supreme Court" },
  { id:"eid-adha-2026", name:"إجازة عيد الأضحى", start:"2026-05-26", end:"2026-05-29", type:"official_holiday", blocksScheduling:true, status:"confirmed", source:"Saudi Supreme Court / HRSD" },
  { id:"national-2026", name:"اليوم الوطني السعودي", start:"2026-09-23", end:"2026-09-23", type:"official_holiday", blocksScheduling:true, status:"confirmed", source:"MOFA" },
  { id:"flag-2026", name:"يوم العلم السعودي", start:"2026-03-11", end:"2026-03-11", type:"occasion", blocksScheduling:false, status:"confirmed", source:"Saudi official calendar" },
  { id:"founding-2027", name:"يوم التأسيس", start:"2027-02-22", end:"2027-02-22", type:"official_holiday", blocksScheduling:true, status:"confirmed", source:"HRSD" },
  { id:"eid-fitr-2027", name:"إجازة عيد الفطر (متوقعة)", start:"2027-03-09", end:"2027-03-12", type:"official_holiday", blocksScheduling:true, status:"tentative", source:"Umm al-Qura estimate" },
  { id:"arafah-2027", name:"يوم عرفة (متوقع)", start:"2027-05-16", end:"2027-05-16", type:"official_holiday", blocksScheduling:true, status:"tentative", source:"Umm al-Qura estimate" },
  { id:"eid-adha-2027", name:"إجازة عيد الأضحى (متوقعة)", start:"2027-05-16", end:"2027-05-19", type:"official_holiday", blocksScheduling:true, status:"tentative", source:"Umm al-Qura estimate" },
  { id:"national-2027", name:"اليوم الوطني السعودي", start:"2027-09-23", end:"2027-09-23", type:"official_holiday", blocksScheduling:true, status:"confirmed", source:"MOFA" },
  { id:"flag-2027", name:"يوم العلم السعودي", start:"2027-03-11", end:"2027-03-11", type:"occasion", blocksScheduling:false, status:"confirmed", source:"Saudi official calendar" },
];

export function parseDate(value) { return new Date(`${value}T00:00:00`); }
export function formatDate(date) {
  const d = typeof date === "string" ? parseDate(date) : date;
  return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}-${String(d.getDate()).padStart(2,"0")}`;
}
export function addDays(value, days) { const d=parseDate(value); d.setDate(d.getDate()+days); return formatDate(d); }
export function overlaps(aStart,aEnd,bStart,bEnd) { return aStart <= bEnd && bStart <= aEnd; }

export function generatePlan({ templateId, startDate, title, programId, instructor="", room="", visibility="draft" }) {
  const template = PROGRAM_TEMPLATES[templateId];
  if (!template) throw new Error("قالب البرنامج غير معروف");
  if (!startDate) throw new Error("تاريخ البداية مطلوب");
  let cursor = startDate;
  const blocks = [];
  template.blocks.forEach((definition, definitionIndex) => {
    for (let week=0; week<definition.weeks; week++) {
      const start=cursor, end=addDays(cursor,6);
      blocks.push({
        id:`${definitionIndex}-${week}`,
        type:definition.type,
        label: definition.weeks > 1 ? `${definition.label} ${week+1}` : definition.label,
        courseNumber:definition.courseNumber || null,
        start,end,instructor,room,
        visibleToStudents: visibility === "published",
      });
      cursor=addDays(cursor,7);
    }
  });
  return {
    id:`${programId || templateId}-${Date.now()}`,
    templateId, programId:programId || templateId, title:title || template.name,
    status:visibility, visibleToStudents:visibility === "published", startDate,
    endDate:addDays(cursor,-1), blocks, createdAt:new Date().toISOString(),
  };
}

export function detectConflicts(candidate, plans=[], events=SAUDI_EVENTS) {
  const conflicts=[];
  candidate.blocks.forEach(block => {
    events.filter(e=>e.blocksScheduling && overlaps(block.start,block.end,e.start,e.end)).forEach(e=>conflicts.push({
      severity:"warning", kind:"holiday", blockId:block.id,
      title:`${block.label} يتقاطع مع ${e.name}`,
      detail:`${e.start}${e.end!==e.start?` — ${e.end}`:""}`,
      eventId:e.id,
    }));
    plans.filter(p=>p.id!==candidate.id).forEach(plan => (plan.blocks||[]).forEach(other => {
      if (!overlaps(block.start,block.end,other.start,other.end)) return;
      if (block.instructor && other.instructor && block.instructor.trim()===other.instructor.trim()) conflicts.push({
        severity:"error",kind:"instructor",blockId:block.id,
        title:`تعارض المدرّس ${block.instructor}`,detail:`مع ${plan.title}: ${other.label}`,
      });
      if (block.room && other.room && block.room.trim()===other.room.trim()) conflicts.push({
        severity:"error",kind:"room",blockId:block.id,
        title:`تعارض القاعة/الرابط ${block.room}`,detail:`مع ${plan.title}: ${other.label}`,
      });
      if (candidate.programId===plan.programId) conflicts.push({
        severity:"warning",kind:"program",blockId:block.id,
        title:"تداخل داخل البرنامج نفسه",detail:`مع ${plan.title}: ${other.label}`,
      });
    }));
  });
  return conflicts;
}

export function shiftPlanAfterHolidays(plan, events=SAUDI_EVENTS) {
  const shifted=structuredClone(plan);
  let cursor=shifted.startDate;
  shifted.blocks.forEach(block => {
    let start=cursor, end=addDays(start,6), changed=true;
    while(changed){
      changed=false;
      const hit=events.find(e=>e.blocksScheduling && overlaps(start,end,e.start,e.end));
      if(hit){ start=addDays(hit.end,1); end=addDays(start,6); changed=true; }
    }
    block.start=start; block.end=end; cursor=addDays(end,1);
  });
  shifted.startDate=shifted.blocks[0]?.start || shifted.startDate;
  shifted.endDate=shifted.blocks.at(-1)?.end || shifted.endDate;
  return shifted;
}
