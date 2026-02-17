"use client";

import { useMemo, useState } from "react";

type FormData = {
  employer_name: string;
  employer_uscc: string;
  employer_representative: string;
  employer_registered_address: string;
  employer_business_address: string;
  employer_phone: string;
  employee_name: string;
  employee_id: string;
  employee_hukou_address: string;
  employee_contact_address: string;
  employee_phone: string;
  term_type: string;
  start_date: string;
  end_date: string;
  probation_end_date: string;
  position: string;
  job_duties: string;
  work_location: string;
  worktime_type: string;
  worktime_cycle: string;
  wage_type: string;
  monthly_wage: string;
  piece_rate: string;
  base_wage: string;
  performance_rule: string;
  wage_other: string;
  probation_wage: string;
  payday: string;
  sign_date: string;
  employer_sign_date: string;
  employee_sign_date: string;
};

const DEFAULT_FORM: FormData = {
  employer_name: "",
  employer_uscc: "",
  employer_representative: "",
  employer_registered_address: "",
  employer_business_address: "",
  employer_phone: "",
  employee_name: "",
  employee_id: "",
  employee_hukou_address: "",
  employee_contact_address: "",
  employee_phone: "",
  term_type: "1",
  start_date: "",
  end_date: "",
  probation_end_date: "",
  position: "",
  job_duties: "",
  work_location: "",
  worktime_type: "1",
  worktime_cycle: "",
  wage_type: "1",
  monthly_wage: "",
  piece_rate: "",
  base_wage: "",
  performance_rule: "",
  wage_other: "",
  probation_wage: "",
  payday: "",
  sign_date: "",
  employer_sign_date: "",
  employee_sign_date: "",
};

const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;
const ID_RE = /^(\d{15}|\d{17}[\dXx])$/;

function parseFileNameFromDisposition(disposition: string | null): string | null {
  if (!disposition) return null;
  const utfMatch = disposition.match(/filename\*=UTF-8''([^;]+)/i);
  if (utfMatch?.[1]) return decodeURIComponent(utfMatch[1]);
  const normalMatch = disposition.match(/filename="?([^";]+)"?/i);
  return normalMatch?.[1] ?? null;
}

export default function LaborContractTemplateClient() {
  const [form, setForm] = useState<FormData>(DEFAULT_FORM);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState("");

  const requiredErrors = useMemo(() => {
    const errors: string[] = [];

    const required: Array<[keyof FormData, string]> = [
      ["employer_name", "甲方名称"],
      ["employee_name", "乙方姓名"],
      ["employee_id", "身份证号"],
      ["term_type", "合同期限方式"],
      ["start_date", "起始日期"],
      ["position", "岗位"],
      ["work_location", "工作地点"],
      ["wage_type", "工资方式"],
      ["payday", "发薪日"],
      ["sign_date", "签订日期"],
    ];

    for (const [field, label] of required) {
      if (!form[field]?.trim()) errors.push(`${label}为必填项`);
    }

    if (form.term_type !== "3" && !form.end_date.trim()) {
      errors.push("固定期限/无固定期限合同需填写结束日期");
    }

    if (!ID_RE.test(form.employee_id.trim())) {
      errors.push("身份证号码格式不正确");
    }

    for (const field of ["start_date", "end_date", "probation_end_date", "sign_date", "employer_sign_date", "employee_sign_date"] as const) {
      if (form[field].trim() && !DATE_RE.test(form[field].trim())) {
        errors.push(`${field} 日期格式应为 YYYY-MM-DD`);
      }
    }

    if (form.worktime_type === "2" && !form.worktime_cycle.trim()) {
      errors.push("综合工时制度需填写工时周期");
    }

    if (form.wage_type === "1" && !form.monthly_wage.trim()) {
      errors.push("工资方式为月工资时，月工资必填");
    }

    if (form.wage_type === "2" && !form.piece_rate.trim()) {
      errors.push("工资方式为计件时，计件单价必填");
    }

    if (form.wage_type === "3" && (!form.base_wage.trim() || !form.performance_rule.trim())) {
      errors.push("工资方式为基本+绩效时，基本工资与绩效计发办法必填");
    }

    if (form.wage_type === "4" && !form.wage_other.trim()) {
      errors.push("工资方式为其他时，其他说明必填");
    }

    if (!/^\d{1,2}$/.test(form.payday.trim())) {
      errors.push("发薪日请填写 1-31 的数字");
    }

    return errors;
  }, [form]);

  const update = (field: keyof FormData, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    setMessage("");

    if (requiredErrors.length > 0) {
      setMessage(requiredErrors[0]);
      return;
    }

    setSubmitting(true);
    try {
      const response = await fetch("/api/generate-labor-contract", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!response.ok) {
        const text = await response.text();
        throw new Error(text || "生成失败");
      }

      const blob = await response.blob();
      const fileName =
        parseFileNameFromDisposition(response.headers.get("content-disposition")) ||
        `劳动合同_${form.employee_name || "模板"}.docx`;

      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);

      setMessage("已生成并开始下载。请检查文件内容后再使用。");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "生成失败，请稍后重试。");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="post-shell contract-tool">
      <h2 className="contract-title">劳动合同范本（可用于自检）</h2>
      <p className="contract-note">
        基于《2024劳动合同示范文本（通用）》制作。填写后可下载 .docx 用于自检与留存。
      </p>
      <p className="contract-warning">免责声明：仅供参考，不构成法律意见；请结合当地政策和实际情况。</p>

      <div className="contract-grid">
        <label className="contract-field">
          <span>甲方用人单位 *</span>
          <input value={form.employer_name} onChange={(e) => update("employer_name", e.target.value)} />
        </label>
        <label className="contract-field">
          <span>统一社会信用代码</span>
          <input value={form.employer_uscc} onChange={(e) => update("employer_uscc", e.target.value)} />
        </label>
        <label className="contract-field">
          <span>法定代表人/委托代理人</span>
          <input value={form.employer_representative} onChange={(e) => update("employer_representative", e.target.value)} />
        </label>
        <label className="contract-field">
          <span>甲方注册地</span>
          <input value={form.employer_registered_address} onChange={(e) => update("employer_registered_address", e.target.value)} />
        </label>
        <label className="contract-field">
          <span>甲方经营地</span>
          <input value={form.employer_business_address} onChange={(e) => update("employer_business_address", e.target.value)} />
        </label>
        <label className="contract-field">
          <span>甲方联系电话</span>
          <input value={form.employer_phone} onChange={(e) => update("employer_phone", e.target.value)} />
        </label>
        <label className="contract-field">
          <span>乙方姓名 *</span>
          <input value={form.employee_name} onChange={(e) => update("employee_name", e.target.value)} />
        </label>
        <label className="contract-field">
          <span>身份证号码 *</span>
          <input value={form.employee_id} onChange={(e) => update("employee_id", e.target.value)} />
        </label>
        <label className="contract-field">
          <span>户籍地址</span>
          <input value={form.employee_hukou_address} onChange={(e) => update("employee_hukou_address", e.target.value)} />
        </label>
        <label className="contract-field">
          <span>通讯地址/经常居住地</span>
          <input value={form.employee_contact_address} onChange={(e) => update("employee_contact_address", e.target.value)} />
        </label>
        <label className="contract-field">
          <span>乙方联系电话</span>
          <input value={form.employee_phone} onChange={(e) => update("employee_phone", e.target.value)} />
        </label>
        <label className="contract-field">
          <span>合同期限方式 *</span>
          <select value={form.term_type} onChange={(e) => update("term_type", e.target.value)}>
            <option value="1">1 固定期限</option>
            <option value="2">2 无固定期限</option>
            <option value="3">3 以完成任务为期限</option>
          </select>
        </label>
        <label className="contract-field">
          <span>起始日期 *（YYYY-MM-DD）</span>
          <input value={form.start_date} onChange={(e) => update("start_date", e.target.value)} placeholder="2026-02-17" />
        </label>
        <label className="contract-field">
          <span>结束日期（term_type=3 可空）</span>
          <input value={form.end_date} onChange={(e) => update("end_date", e.target.value)} placeholder="2027-02-16" />
        </label>
        <label className="contract-field">
          <span>试用期截止</span>
          <input value={form.probation_end_date} onChange={(e) => update("probation_end_date", e.target.value)} placeholder="2026-05-17" />
        </label>
        <label className="contract-field">
          <span>工作岗位 *</span>
          <input value={form.position} onChange={(e) => update("position", e.target.value)} />
        </label>
        <label className="contract-field">
          <span>岗位职责</span>
          <input value={form.job_duties} onChange={(e) => update("job_duties", e.target.value)} />
        </label>
        <label className="contract-field">
          <span>工作地点 *</span>
          <input value={form.work_location} onChange={(e) => update("work_location", e.target.value)} />
        </label>
        <label className="contract-field">
          <span>工时制度 *</span>
          <select value={form.worktime_type} onChange={(e) => update("worktime_type", e.target.value)}>
            <option value="1">1 标准工时</option>
            <option value="2">2 综合计算工时</option>
            <option value="3">3 不定时工时</option>
          </select>
        </label>
        <label className="contract-field">
          <span>综合工时周期（worktime_type=2 必填）</span>
          <input value={form.worktime_cycle} onChange={(e) => update("worktime_cycle", e.target.value)} placeholder="按月/按季" />
        </label>
        <label className="contract-field">
          <span>工资方式 *</span>
          <select value={form.wage_type} onChange={(e) => update("wage_type", e.target.value)}>
            <option value="1">1 月工资</option>
            <option value="2">2 计件</option>
            <option value="3">3 基本+绩效</option>
            <option value="4">4 其他</option>
          </select>
        </label>
        <label className="contract-field">
          <span>月工资（wage_type=1）</span>
          <input value={form.monthly_wage} onChange={(e) => update("monthly_wage", e.target.value)} />
        </label>
        <label className="contract-field">
          <span>计件单价（wage_type=2）</span>
          <input value={form.piece_rate} onChange={(e) => update("piece_rate", e.target.value)} />
        </label>
        <label className="contract-field">
          <span>基本工资（wage_type=3）</span>
          <input value={form.base_wage} onChange={(e) => update("base_wage", e.target.value)} />
        </label>
        <label className="contract-field">
          <span>绩效计发办法（wage_type=3）</span>
          <input value={form.performance_rule} onChange={(e) => update("performance_rule", e.target.value)} />
        </label>
        <label className="contract-field">
          <span>其他工资说明（wage_type=4）</span>
          <input value={form.wage_other} onChange={(e) => update("wage_other", e.target.value)} />
        </label>
        <label className="contract-field">
          <span>试用期工资</span>
          <input value={form.probation_wage} onChange={(e) => update("probation_wage", e.target.value)} />
        </label>
        <label className="contract-field">
          <span>每月发薪日前 *（数字）</span>
          <input value={form.payday} onChange={(e) => update("payday", e.target.value)} placeholder="10" />
        </label>
        <label className="contract-field">
          <span>签订日期 *（YYYY-MM-DD）</span>
          <input value={form.sign_date} onChange={(e) => update("sign_date", e.target.value)} />
        </label>
        <label className="contract-field">
          <span>甲方日期</span>
          <input value={form.employer_sign_date} onChange={(e) => update("employer_sign_date", e.target.value)} />
        </label>
        <label className="contract-field">
          <span>乙方日期</span>
          <input value={form.employee_sign_date} onChange={(e) => update("employee_sign_date", e.target.value)} />
        </label>
      </div>

      <div className="contract-actions">
        <button type="button" className="contract-btn" onClick={handleSubmit} disabled={submitting}>
          {submitting ? "生成中..." : "生成并下载劳动合同（.docx）"}
        </button>
        {message ? <p className="contract-message">{message}</p> : null}
      </div>
    </section>
  );
}
