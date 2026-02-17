import { readFile } from "node:fs/promises";
import path from "node:path";
import { NextResponse } from "next/server";
import Docxtemplater from "docxtemplater";
import PizZip from "pizzip";

type Payload = Record<string, unknown>;

const MAX_FIELD_LENGTH = 200;
const MAX_LONG_FIELD_LENGTH = 1000;
const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;
const ID_RE = /^(\d{15}|\d{17}[\dXx])$/;

const TERM_TYPE_LABEL: Record<string, string> = {
  "1": "固定期限",
  "2": "无固定期限",
  "3": "以完成任务为期限",
};

const WORKTIME_TYPE_LABEL: Record<string, string> = {
  "1": "标准工时",
  "2": "综合工时",
  "3": "不定时工时",
};

const WAGE_TYPE_LABEL: Record<string, string> = {
  "1": "月工资",
  "2": "计件",
  "3": "基本+绩效",
  "4": "其他",
};

function cleanString(value: unknown, max = MAX_FIELD_LENGTH): string {
  const text = String(value ?? "").trim();
  if (text.length > max) return text.slice(0, max);
  return text;
}

function assertDate(value: string, fieldLabel: string): string | null {
  if (!value) return null;
  return DATE_RE.test(value) ? null : `${fieldLabel} 格式应为 YYYY-MM-DD`;
}

function encodeFileName(fileName: string): string {
  return encodeURIComponent(fileName).replace(/['()]/g, escape).replace(/\*/g, "%2A");
}

function validate(payload: Payload) {
  const data = {
    employer_name: cleanString(payload.employer_name),
    employer_uscc: cleanString(payload.employer_uscc),
    employer_representative: cleanString(payload.employer_representative),
    employer_registered_address: cleanString(payload.employer_registered_address, MAX_LONG_FIELD_LENGTH),
    employer_business_address: cleanString(payload.employer_business_address, MAX_LONG_FIELD_LENGTH),
    employer_phone: cleanString(payload.employer_phone),
    employee_name: cleanString(payload.employee_name),
    employee_id: cleanString(payload.employee_id),
    employee_hukou_address: cleanString(payload.employee_hukou_address, MAX_LONG_FIELD_LENGTH),
    employee_contact_address: cleanString(payload.employee_contact_address, MAX_LONG_FIELD_LENGTH),
    employee_phone: cleanString(payload.employee_phone),
    term_type: cleanString(payload.term_type, 1),
    start_date: cleanString(payload.start_date),
    end_date: cleanString(payload.end_date),
    probation_end_date: cleanString(payload.probation_end_date),
    position: cleanString(payload.position),
    job_duties: cleanString(payload.job_duties, MAX_LONG_FIELD_LENGTH),
    work_location: cleanString(payload.work_location, MAX_LONG_FIELD_LENGTH),
    worktime_type: cleanString(payload.worktime_type, 1),
    worktime_cycle: cleanString(payload.worktime_cycle),
    wage_type: cleanString(payload.wage_type, 1),
    monthly_wage: cleanString(payload.monthly_wage),
    piece_rate: cleanString(payload.piece_rate),
    base_wage: cleanString(payload.base_wage),
    performance_rule: cleanString(payload.performance_rule, MAX_LONG_FIELD_LENGTH),
    wage_other: cleanString(payload.wage_other, MAX_LONG_FIELD_LENGTH),
    probation_wage: cleanString(payload.probation_wage),
    payday: cleanString(payload.payday, 2),
    sign_date: cleanString(payload.sign_date),
    employer_sign_date: cleanString(payload.employer_sign_date),
    employee_sign_date: cleanString(payload.employee_sign_date),
  };

  const errors: string[] = [];
  const required: Array<[keyof typeof data, string]> = [
    ["employer_name", "甲方用人单位"],
    ["employee_name", "乙方姓名"],
    ["employee_id", "身份证号"],
    ["term_type", "合同期限方式"],
    ["start_date", "起始日期"],
    ["position", "工作岗位"],
    ["work_location", "工作地点"],
    ["wage_type", "工资方式"],
    ["payday", "发薪日"],
    ["sign_date", "签订日期"],
  ];

  for (const [field, label] of required) {
    if (!data[field]) errors.push(`${label}不能为空`);
  }

  if (!ID_RE.test(data.employee_id)) {
    errors.push("身份证号格式不正确");
  }

  const dateChecks: Array<[string, string]> = [
    [data.start_date, "起始日期"],
    [data.end_date, "结束日期"],
    [data.probation_end_date, "试用期截止"],
    [data.sign_date, "签订日期"],
    [data.employer_sign_date, "甲方签章日期"],
    [data.employee_sign_date, "乙方签字日期"],
  ];

  for (const [value, label] of dateChecks) {
    const err = assertDate(value, label);
    if (err) errors.push(err);
  }

  if (data.term_type !== "3" && !data.end_date) {
    errors.push("固定期限/无固定期限合同必须填写结束日期");
  }

  if (data.worktime_type === "2" && !data.worktime_cycle) {
    errors.push("综合工时制度必须填写工时周期");
  }

  if (data.wage_type === "1" && !data.monthly_wage) errors.push("月工资方式必须填写月工资");
  if (data.wage_type === "2" && !data.piece_rate) errors.push("计件方式必须填写计件单价");
  if (data.wage_type === "3" && (!data.base_wage || !data.performance_rule)) {
    errors.push("基本+绩效方式必须填写基本工资和绩效计发办法");
  }
  if (data.wage_type === "4" && !data.wage_other) errors.push("其他工资方式必须填写说明");

  if (!/^\d{1,2}$/.test(data.payday)) {
    errors.push("发薪日应为1-31数字");
  } else {
    const day = Number(data.payday);
    if (day < 1 || day > 31) errors.push("发薪日应在1-31之间");
  }

  return {
    errors,
    data: {
      ...data,
      term_type_label: TERM_TYPE_LABEL[data.term_type] ?? "",
      worktime_type_label: WORKTIME_TYPE_LABEL[data.worktime_type] ?? "",
      wage_type_label: WAGE_TYPE_LABEL[data.wage_type] ?? "",
    },
  };
}

export async function POST(request: Request) {
  try {
    const payload = (await request.json()) as Payload;
    const { errors, data } = validate(payload);

    if (errors.length > 0) {
      return NextResponse.json({ error: errors[0], errors }, { status: 400 });
    }

    const templatePath = path.join(process.cwd(), "public", "templates", "labor-contract-template-fillable.docx");
    const binary = await readFile(templatePath);

    const zip = new PizZip(binary);
    const doc = new Docxtemplater(zip, {
      delimiters: { start: "{{", end: "}}" },
      linebreaks: true,
      paragraphLoop: true,
    });

    doc.render(data);

    const output = doc.getZip().generate({
      type: "nodebuffer",
      compression: "DEFLATE",
    });

    const safeName = (data.employee_name || "模板").replace(/[\\/:*?"<>|]/g, "_");
    const fileName = `劳动合同_${safeName}.docx`;

    return new Response(new Uint8Array(output), {
      status: 200,
      headers: {
        "Content-Type": "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        "Content-Disposition": `attachment; filename*=UTF-8''${encodeFileName(fileName)}`,
        "Cache-Control": "no-store",
      },
    });
  } catch (error) {
    return NextResponse.json(
      {
        error: "生成失败，请检查输入并重试",
        detail: error instanceof Error ? error.message : "unknown",
      },
      { status: 500 },
    );
  }
}

